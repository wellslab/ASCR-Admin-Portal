# Schema and Data Model Guide

This document describes how the cell line data schema works and how to make changes to it safely.

---

## Overview of the two schema layers

There are two distinct schema layers in this codebase, defined in two separate files.

### 1. `data_dictionaries/models.py` — the scientific data schema

Defines `JSONOutputSchema` and all its nested models (e.g. `General`, `Donor`, `DerivationIpsc`). This represents the cell line metadata itself — the scientific content.

This file is **generated** from the data dictionary spreadsheet. Do not edit it by hand unless you understand the generation pipeline. See `data_dictionaries/stefan_data_dictionary_change_record.md` for how to make changes.

### 2. `services/backend/models.py` — the record envelope

Defines `StandardRecord`, which is the format all cell line files are stored in on disk and returned from the API. It wraps `JSONOutputSchema` data with provenance fields:

```python
class StandardRecord(BaseModel):
    filename: str
    location: Literal["working", "ready", "registered"]
    version: Optional[int]
    curation_method: Optional[str]
    last_modified: Optional[str]  # ISO 8601
    data: Dict[str, Any]          # JSONOutputSchema content
```

Every `.json` file in `archive_data/working/`, `archive_data/ready/`, and `archive_data/registered/` uses this structure.

---

## How to add a new scientific data field

Scientific data fields live inside the `data` object of a `StandardRecord`.

1. Follow the data dictionary change process documented in `data_dictionaries/stefan_data_dictionary_change_record.md`
2. Regenerate the Python models and schema artifacts by running `python data_dictionaries/make_data_dictionary.py`
3. Run schema migration to propagate the new field (with a null/[] default) to all existing records:
   - Via the UI: Settings → Migrate Schema
   - Via the API: `POST /admin/migrate-schema`

Existing field values are never overwritten by migration.

---

## How to add a new provenance field to StandardRecord

Provenance fields are the envelope fields around `data` — things like `curation_method`, `last_modified`, `location`.

1. Add the field to `StandardRecord` in `services/backend/models.py`
2. Decide what the initial value should be for existing records:
   - **If `null` is acceptable**: no migration code needed. The field will simply be absent from old records until they are next written through the API.
   - **If a real derived value is required**: add population logic to `_apply_standard_record_envelope()` in `services/backend/schema_migration.py`. Provenance values are typically derived from the file path (filename stem, directory), the filename's version suffix, or the file's mtime.
3. Update `storage.py`'s `_build_record()` to populate the new field on every create/update.
4. Run schema migration: `POST /admin/migrate-schema`

---

## How schema migration works

`/admin/migrate-schema` calls `migrate_all()` in `services/backend/schema_migration.py`.

For each cell line file it does two things in order:

**Step 1 — StandardRecord envelope conversion** (`_apply_standard_record_envelope`)

Detects whether the file is in the old flat format (no `data` key) or already in `StandardRecord` format. Old-format files are wrapped into the envelope, with provenance fields derived from context:
- `filename` — from the file's stem
- `location` — from the directory it lives in
- `version` — parsed from the `_v{n}` suffix in the filename
- `last_modified` — from the file's filesystem mtime
- `curation_method` — extracted from the old top-level field

**Step 2 — JSONOutputSchema field propagation** (`apply_schema`)

Walks the `JSONOutputSchema` model and adds any fields missing from `data` with their default values (`null` for optional scalars, `[]` for lists). Existing values are never changed.

Migration is idempotent — running it multiple times on already-migrated records is safe.

---

## Storage layer

`services/backend/storage.py` handles reading and writing cell line files.

- `storage.create(filename, data, location, curation_method)` — wraps scientific data into a `StandardRecord` envelope and writes it to disk
- `storage.update(filename, data, location, curation_method)` — same, overwrites in place
- `storage.get(filename, location)` — reads and returns the `StandardRecord` dict as-is

The `data` parameter to `create`/`update` is the raw `JSONOutputSchema` dict, not the full envelope.

---

## File locations

| Directory | Purpose |
|---|---|
| `archive_data/working/` | Active editing — files here can be modified |
| `archive_data/ready/` | Finalised, awaiting registration |
| `archive_data/registered/` | Registered with HPSCreg — read-only in the UI |

Each directory has an `index.json` that maps base names to lists of versioned filenames (e.g. `{ "AIBNi001-A": ["AIBNi001-A_v0", "AIBNi001-A_v1"] }`). The storage layer maintains this index automatically.
