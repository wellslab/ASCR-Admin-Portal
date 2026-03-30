# Storage

**Source file:** `services/backend/storage.py`

## Responsibilities

- **Maintain file system storage** — reads and writes cell line JSON files to the local filesystem, maintaining per-directory index files as the authoritative record of what exists in each location.

---

## Maintain file system storage

The **Storage** module is the lowest layer of the backend. All other modules that need to read or write cell line data do so through the `StorageInterface` — never by touching the filesystem directly.

The **Storage** module contains no business logic. It does not know about versioning strategy, state transitions, or what a valid cell line looks like beyond the requirement that it has an `hpscreg_name`. Those concerns belong to the **File Manager**. The **Storage** module's sole responsibility is to do exactly what it is told with a given filename in a given location.

### The StandardRecord envelope

Every cell line record stored on disk uses the `StandardRecord` format. When `FileStorage` writes a file, it wraps the raw cell line data in an envelope that adds provenance fields alongside the scientific data:

```json
{
  "filename": "AIBNi001-A_v1",
  "location": "working",
  "version": 1,
  "curation_method": "AI",
  "last_modified": "2026-03-25T10:42:00.000000",
  "data": { ... }
}
```

The `data` field holds the scientific metadata. The outer fields are written by the storage layer at the time of creation or update and are not provided by the caller. The `last_modified` timestamp is set to the current time on every write.

### Index files

Each of the three directories maintains an `index.json` file that maps cell line base names to lists of versioned filenames:

```json
{
  "AIBNi001-A": ["AIBNi001-A_v0", "AIBNi001-A_v1"],
  "WIBNi002-B": ["WIBNi002-B_v0"]
}
```

The index is updated automatically on every `create` and `delete` operation. All existence checks and file listing operations read from the index rather than scanning the directory on disk. This means the index is the authoritative record of what files exist in each location — if a file exists on disk but is not in the index, `FileStorage` will not find it.

### File layout on disk

Files in `working/` and `ready/` are stored as flat JSON files directly inside the directory:

```
data/working/AIBNi001-A_v1.json
data/ready/AIBNi001-A_v1.json
```

Files in `registered/` are stored in per-base-name subdirectories:

```
data/registered/AIBNi001-A/AIBNi001-A_v0.json
data/registered/AIBNi001-A/AIBNi001-A_v1.json
```

The storage layer handles this difference transparently — callers do not need to know about it.

### Data directory location

The root data directory defaults to `services/backend/data/` and can be overridden by setting the `DATA_DIR` environment variable. The tests use this to point each test run at a temporary directory. In the Docker deployment, `DATA_DIR` is set to a volume-mounted path so that data persists across container restarts.

### StorageInterface

`StorageInterface` is an abstract base class that defines the contract all storage implementations must fulfil. It exists so that the rest of the system can be written against an interface rather than a concrete class. In practice, only one implementation exists — `FileStorage` — but the interface keeps the storage layer replaceable if the system outgrows local file storage.

For full method documentation, see the [Storage API reference](../reference/storage.md).

---

## Dependencies

`FileStorage` has no dependencies on other application modules. It imports only from the Python standard library and operates entirely on the local filesystem. It is instantiated by the `get_storage()` dependency injection function in `main.py`, which returns a new `FileStorage()` instance for every request. All modules that need storage access receive it as a constructor argument or via FastAPI's `Depends` system. The one exception is `tasks.py`, which creates its own instance directly since the Celery worker runs in a separate process outside the FastAPI dependency chain.

---

## FAQ

**What if a file exists on disk but is not in the index?**

`FileStorage` will not find it. All operations — `exists()`, `get()`, `list_files()` — read from the index, not from the filesystem directly. Files outside the index are invisible to the application.

**Should I instantiate `FileStorage` directly in new code?**

In FastAPI handlers, receive storage via the `get_storage()` dependency. Creating `FileStorage` directly is only appropriate in the Celery worker context (`tasks.py`), where the FastAPI dependency chain is unavailable.

**What happens to the `registered/` subdirectory when the last file for a base name is deleted?**

The per-base-name subdirectory is removed automatically. If `AIBNi001-A/` has only one file and that file is deleted, the `AIBNi001-A/` directory is also cleaned up.

**Does `update()` check if the file already exists before writing?**

No. Unlike `create()`, `update()` writes the file whether or not it already exists and adds it to the index if it was not already present. It is used for in-place updates to working cell lines and for overwrite operations.
