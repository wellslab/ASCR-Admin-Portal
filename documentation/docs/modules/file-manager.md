# File Manager

**Source file:** `services/backend/file_manager.py`

## Responsibilities

- **State movement** — the single authority on transitions between the `working/`, `ready/`, and `registered/` directories. No other module moves files between directories directly.
- **Version control** — assigns version numbers when files are created and exposes utilities for parsing, comparing, and resolving versions across directories.

---

## State movement

Cell line files move through three states during the curation lifecycle, each corresponding to a directory on disk. A new cell line is always created in `working/`, where a curator can edit it freely. When the curator is satisfied with the record, they move it to `ready/`, which marks it as finalised and queued for submission to the ASCR registry. The file is not editable once it is in `ready/`. After the ASCR registry ingestion system processes the file and reports a successful result, the **Ingestion Monitor** calls the **File Manager** to move the file from `ready/` into `registered/`, where it remains as a permanent, read-only record.

A file can also move backward: from `ready/` back to `working/` if a curator needs to correct the record after it has been queued. This is the only permitted backward transition.

```
working/  →  ready/  →  registered/
                ↑____________|
             (back to working if correction needed)
```

The **File Manager** sits directly above the **Storage** layer. It receives a `StorageInterface` at construction time and uses it for all raw file operations, but the logic governing when and how those operations happen lives entirely in the **File Manager**.

### Conflict detection

The **File Manager** raises structured exceptions when a state transition or creation operation would produce a conflict.

`WorkingVersionConflict` is raised when an operation would result in two copies of the same cell line existing in `working/` simultaneously. It carries the `existing_filename` of the conflicting file so the caller can communicate the conflict to the user.

`ReadyVersionConflict` is raised when an operation would conflict with a file already in `ready/`. Because `ready/` files are considered finalised and awaiting ingestion, they cannot be overwritten or bypassed — this exception signals that the curator must resolve the ready copy before proceeding.

Both exceptions are handled in `main.py`, which maps them to HTTP 409 responses with structured detail payloads.

---

## Version control

Every cell line file carries a version number appended to its filename: `AIBNi001-A_v0`, `AIBNi001-A_v1`, and so on. The version number is assigned once, when the file is first created in `working/`, and does not change as the file moves through the states.

The version number for a new cell line is determined by the number of copies of that cell line that already exist in `registered/`. If no registered copies exist, the first version is `v0`. If one registered copy exists, the next version is `v1`. This means the version number reflects how many times that cell line has been submitted to the registry, making the registered directory the authoritative record of submission history.

Within any normal workflow, only one version of a given cell line can be in `working/` or `ready/` at a time. The **File Manager** enforces this constraint and raises explicit errors if it is violated.

The **File Manager** also exposes versioning utilities that are used internally and by `main.py` for version display in the frontend. These handle parsing version suffixes from filenames, constructing versioned filenames, finding the latest version in a list, and querying the maximum version across all three directories.

For full method documentation, see the [File Manager API reference](../reference/file-manager.md).

---

## Dependencies

The **File Manager** depends only on a `StorageInterface` instance, injected at construction time. It has no knowledge of the HTTP layer, the AI pipeline, or any other module.

The **File Manager** is consumed in two places. In `main.py`, it is wired via FastAPI's dependency injection system and used by the endpoints that handle cell line creation, state transitions, and version queries. In `ingestion_manager.py`, it is passed as a constructor argument and called when the ingestion run log indicates that a file should be moved to `registered/` or returned to `working/`.

---

## FAQ

**What happens if a file already exists in `working/` when I try to create a new cell line?**

`save_with_auto_versioning` raises a `ValueError` explaining the conflict, and `main.py` returns an HTTP 409 response. The curator should edit the existing copy rather than creating a duplicate.

**Can a file move directly from `working/` to `registered/`?**

No. The only permitted forward path is `working/` → `ready/` → `registered/`. Moving a file to `registered/` is handled exclusively by the **Ingestion Monitor** in response to a `PROD-PASS` result in the run log — it cannot be triggered directly through the normal curator workflow.

**What determines the version number assigned to a new file?**

The count of copies already in `registered/`. If none exist, the version is `v0`. Each registered copy increments the count by one. This means the version number is a direct count of how many times that cell line has previously been submitted to the registry.

**What happens when `create_new_version_from_registered` is called with `overwrite=True`?**

Instead of creating a new versioned file, the method overwrites the existing working copy in place with the data from the registered file. No new version number is allocated. This is used when the curator wants to reset their working edits back to the registered state.
