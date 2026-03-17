"""
Core schema migration logic.

Applies the current JSONOutputSchema structure to existing cell line JSON records.
Missing fields are added with null/[] defaults. Existing values are never overwritten.
"""

import json
import logging
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


def migrate_all(dry_run: bool = False) -> dict:
    """Apply current schema to all cell line records across all locations.

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
        for filepath in sorted(location_dir.glob("*.json")):
            if filepath.name == "index.json":
                continue
            total += 1
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
                updated = apply_schema(JSONOutputSchema, existing)
                if updated != existing:
                    changed += 1
                    if not dry_run:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            json.dump(updated, f, indent=2, ensure_ascii=False)
                        logger.info(f"Migrated {location}/{filepath.name}")
            except Exception as e:
                logger.error(f"Error migrating {filepath}: {e}")

    return {"total": total, "changed": changed, "dry_run": dry_run}
