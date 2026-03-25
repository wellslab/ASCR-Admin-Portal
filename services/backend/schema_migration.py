"""
Core schema migration logic.

Handles two concerns:
1. Structural migration: converts old-format cell line files to the StandardRecord
   envelope (provenance fields + data). This is a one-time conversion for existing records.
2. Schema migration: applies the current JSONOutputSchema structure to the data field
   of each record. Missing fields are added with null/[] defaults. Existing values are
   never overwritten.

To add a new JSONOutputSchema field: edit data_dictionaries/models.py, then run this.
To add a new StandardRecord provenance field that needs a real value (not null): add
explicit population logic in _apply_standard_record_envelope() below.
"""

import json
import logging
import re
from datetime import datetime
from pathlib import Path
from typing import get_origin, get_args
import typing

from data_dictionaries.models import JSONOutputSchema
from storage import FileStorage

logger = logging.getLogger(__name__)

LOCATIONS = ["working", "ready", "registered"]


def _list_item_model(annotation):
    args = get_args(annotation)
    if args and hasattr(args[0], 'model_fields'):
        return args[0]
    return None


def apply_schema(model_class: type, existing: dict) -> dict:
    """Recursively apply model_class structure to existing data.

    - Missing fields are added with null / [] defaults.
    - Existing field values are never overwritten.
    - Fields in existing data not in the schema are preserved.
    """
    result = {}

    for field_name, field_info in model_class.model_fields.items():
        annotation = field_info.annotation
        existing_value = existing.get(field_name)
        origin = get_origin(annotation)

        if origin is typing.Union:
            args = get_args(annotation)
            if type(None) in args:
                inner = next((a for a in args if a is not type(None)), None)
                inner_origin = get_origin(inner)

                if inner_origin is list:
                    item_model = _list_item_model(inner)
                    if existing_value is None:
                        result[field_name] = []
                    elif item_model and isinstance(existing_value, list):
                        result[field_name] = [
                            apply_schema(item_model, item) if isinstance(item, dict) else item
                            for item in existing_value
                        ]
                    else:
                        result[field_name] = existing_value
                elif inner is not None and hasattr(inner, 'model_fields'):
                    if isinstance(existing_value, dict):
                        result[field_name] = apply_schema(inner, existing_value)
                    else:
                        result[field_name] = existing_value
                else:
                    result[field_name] = existing_value
            continue

        if origin is list:
            item_model = _list_item_model(annotation)
            if existing_value is None:
                result[field_name] = []
            elif item_model and isinstance(existing_value, list):
                result[field_name] = [
                    apply_schema(item_model, item) if isinstance(item, dict) else item
                    for item in existing_value
                ]
            else:
                result[field_name] = existing_value if existing_value is not None else []
            continue

        if hasattr(annotation, 'model_fields'):
            if isinstance(existing_value, dict):
                result[field_name] = apply_schema(annotation, existing_value)
            else:
                result[field_name] = apply_schema(annotation, {})
            continue

        result[field_name] = existing_value

    for key in existing:
        if key not in result:
            result[key] = existing[key]

    return result


def _parse_version(filename_stem: str) -> int | None:
    match = re.search(r'_v(\d+)$', filename_stem)
    return int(match.group(1)) if match else None


def _apply_standard_record_envelope(existing: dict, filepath: Path, location: str) -> dict:
    """Ensure the file is in StandardRecord format.

    If the file is in the old format (no 'data' key), wraps it into the StandardRecord
    envelope and derives provenance fields from context. If it is already in StandardRecord
    format, leaves provenance fields unchanged.

    To add a new provenance field that requires a real derived value: add population
    logic here. Fields with acceptable null defaults need no code — they will be absent
    from old records and can be handled by whatever reads them.
    """
    if "data" in existing:
        # Already StandardRecord format — nothing to convert
        return existing

    # Old format: provenance fields are absent and curation_method is mixed into the
    # scientific data. Extract it and wrap everything else as the data payload.
    stem = filepath.stem
    curation_method = existing.pop("curation_method", None)

    return {
        "filename": stem,
        "location": location,
        "version": _parse_version(stem),
        "curation_method": curation_method,
        "last_modified": datetime.fromtimestamp(filepath.stat().st_mtime).isoformat(),
        "data": existing,
    }


def migrate_registered_structure() -> dict:
    """Move any flat files in registered/ into per-base-name subdirectories.

    This is a one-time structural migration. Files already in subdirectories are
    left untouched. Safe to call on every startup — it is a no-op once complete.

    Returns:
        dict with key: migrated (int)
    """
    data_dir = FileStorage.get_data_dir()
    registered_dir = data_dir / "registered"
    if not registered_dir.exists():
        return {"migrated": 0}

    migrated = 0
    for filepath in list(registered_dir.glob("*.json")):
        if filepath.name == "index.json":
            continue
        stem = filepath.stem
        base_name = stem.split("_v")[0] if "_v" in stem else stem
        subdir = registered_dir / base_name
        subdir.mkdir(exist_ok=True)
        filepath.rename(subdir / filepath.name)
        migrated += 1
        logger.info(f"Moved {stem} → registered/{base_name}/{filepath.name}")

    if migrated:
        logger.info(f"Structural migration complete: {migrated} file(s) moved to subdirectories")

    return {"migrated": migrated}


def migrate_all(dry_run: bool = False) -> dict:
    """Apply StandardRecord structure and current JSONOutputSchema to all cell line records.

    For each file:
    - Converts old-format files (no 'data' key) to StandardRecord envelope.
    - Applies JSONOutputSchema to the 'data' field, adding any missing fields as null/[].

    Registered files are read from per-base-name subdirectories (registered/{base_name}/*.json).
    Working and ready files are read from their flat location directories.

    Returns:
        dict with keys: total (int), changed (int), dry_run (bool)
    """
    data_dir = FileStorage.get_data_dir()
    total = 0
    changed = 0

    for location in LOCATIONS:
        location_dir = data_dir / location
        if not location_dir.exists():
            continue

        # Registered files live in subdirectories; working/ready are flat
        pattern = "*/*.json" if location == "registered" else "*.json"

        for filepath in sorted(location_dir.glob(pattern)):
            if filepath.name == "index.json":
                continue
            total += 1
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    existing = json.load(f)

                # Step 1: ensure StandardRecord envelope
                record = _apply_standard_record_envelope(existing, filepath, location)

                # Step 2: apply JSONOutputSchema to the data field
                record["data"] = apply_schema(JSONOutputSchema, record.get("data", {}))

                if record != existing:
                    changed += 1
                    if not dry_run:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            json.dump(record, f, indent=2, ensure_ascii=False)
                        logger.info(f"Migrated {location}/{filepath.name}")
            except Exception as e:
                logger.error(f"Error migrating {filepath}: {e}")

    return {"total": total, "changed": changed, "dry_run": dry_run}
