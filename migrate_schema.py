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

sys.path.insert(0, str(Path(__file__).parent / "services" / "backend"))
sys.path.insert(0, str(Path(__file__).parent))

from schema_migration import apply_schema, LOCATIONS
from storage import FileStorage
from data_dictionaries.models import JSONOutputSchema


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

    data_dir = FileStorage.get_data_dir()
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
            location_dir = data_dir / location
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
