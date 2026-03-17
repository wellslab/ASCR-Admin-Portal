"""
migrate_schema.py — Apply structural schema updates to historical cell line JSON records.

Usage:
    python migrate_schema.py [--dry-run]
    python migrate_schema.py -f path/to/file.json [--dry-run]

For each JSON record in data/working, data/ready, and data/registered, adds any fields
present in the current JSONOutputSchema that are missing from the record. Existing field
values are never overwritten. Fields in records that no longer exist in the schema are
left untouched.

Options:
    --dry-run       Print what would change without writing any files.
    -f FILE         Migrate a single JSON file instead of all directories.
"""

import sys
import json
import argparse
from pathlib import Path
from typing import get_origin, get_args
import typing

sys.path.insert(0, str(Path(__file__).parent / "services" / "backend"))
sys.path.insert(0, str(Path(__file__).parent))

from data_dictionaries.models import JSONOutputSchema


LOCATIONS = ["working", "ready", "registered"]
DATA_DIR = Path(__file__).parent / "services" / "backend" / "data"


def _list_item_model(annotation):
    """Return the model class for List[Model], or None if items are not a model."""
    args = get_args(annotation)
    if args and hasattr(args[0], 'model_fields'):
        return args[0]
    return None


def apply_schema(model_class: type, existing: dict) -> dict:
    """
    Recursively apply model_class structure to existing data.

    - Missing fields are added with null / [] defaults.
    - Existing field values are never overwritten.
    - Fields in existing data that are not in the schema are preserved.
    - List items are recursed into when their type is a known model.
    """
    result = {}

    for field_name, field_info in model_class.model_fields.items():
        annotation = field_info.annotation
        existing_value = existing.get(field_name)
        origin = get_origin(annotation)

        # Optional[X]
        if origin is typing.Union:
            args = get_args(annotation)
            if type(None) in args:
                inner = next((a for a in args if a is not type(None)), None)
                inner_origin = get_origin(inner)

                if inner_origin is list:
                    # Optional[List[Model]]
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
                    # Optional[NestedModel]
                    if isinstance(existing_value, dict):
                        result[field_name] = apply_schema(inner, existing_value)
                    else:
                        result[field_name] = existing_value  # None or unexpected type

                else:
                    # Optional[scalar]
                    result[field_name] = existing_value  # None if missing

            continue

        # List[Model]
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

        # Non-optional NestedModel
        if hasattr(annotation, 'model_fields'):
            if isinstance(existing_value, dict):
                result[field_name] = apply_schema(annotation, existing_value)
            else:
                result[field_name] = apply_schema(annotation, {})
            continue

        # Scalar (str, int, float, bool, Literal, date, etc.)
        result[field_name] = existing_value  # None if missing

    # Preserve fields in existing data that are not in the schema
    for key in existing:
        if key not in result:
            result[key] = existing[key]

    return result


def migrate_file(filepath: Path, dry_run: bool) -> bool:
    """Migrate a single JSON file. Returns True if the file was (or would be) changed."""
    with open(filepath, 'r', encoding='utf-8') as f:
        existing = json.load(f)

    updated = apply_schema(JSONOutputSchema, existing)

    if updated == existing:
        return False

    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(updated, f, indent=2, ensure_ascii=False)

    return True


def main():
    parser = argparse.ArgumentParser(description="Migrate cell line JSONs to current schema.")
    parser.add_argument('--dry-run', action='store_true', help="Show changes without writing files.")
    parser.add_argument('-f', metavar='FILE', help="Migrate a single JSON file instead of all directories.")
    args = parser.parse_args()

    if args.dry_run:
        print("Dry run — no files will be written.\n")

    total = 0
    changed = 0

    if args.f:
        filepath = Path(args.f)
        if not filepath.exists():
            print(f"Error: file not found: {filepath}")
            sys.exit(1)
        total = 1
        was_changed = migrate_file(filepath, dry_run=args.dry_run)
        if was_changed:
            changed = 1
            status = "(dry run)" if args.dry_run else "updated"
            print(f"  {filepath.name} — {status}")
    else:
        for location in LOCATIONS:
            location_dir = DATA_DIR / location
            if not location_dir.exists():
                continue
            for filepath in sorted(location_dir.glob("*.json")):
                if filepath.name == "index.json":
                    continue
                total += 1
                was_changed = migrate_file(filepath, dry_run=args.dry_run)
                if was_changed:
                    changed += 1
                    status = "(dry run)" if args.dry_run else "updated"
                    print(f"  [{location}] {filepath.name} — {status}")

    action = "would be updated" if args.dry_run else "updated"
    print(f"\nDone. {changed}/{total} files {action}.")


if __name__ == "__main__":
    main()
