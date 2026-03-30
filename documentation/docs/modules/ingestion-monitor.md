# Ingestion Monitor

**Source file:** `services/backend/ingestion_manager.py`

## Responsibilities

- **Run log processing** — reads and parses the ASCR registry run log to determine the most recent ingestion outcome for each cell line version.
- **Run ready processing** — routes each file in `ready/` to its correct next state based on the run log, and surfaces files with errors for curator review.

---

## Run log processing

After each ASCR registry ingestion run, the ASCR registry ingestion system writes a log file (`run_log.json`) that records the outcome for every cell line version it attempted to process. The **Ingestion Monitor** reads this log to drive its routing decisions.

The log path defaults to `data/run_log.json` within the backend data directory and can be overridden with the `RUN_LOG_PATH` environment variable.

The log is structured as a nested dictionary keyed first by cell line base name, then by version key, and finally containing an `ingest_runs` list. Each entry in `ingest_runs` carries a `date` and a `status`. Multiple ingestion attempts for the same version accumulate as additional entries in this list, preserving the full ingestion history.

```json
{
  "AIBNi001-A": {
    "v0": {
      "ingest_runs": [
        { "date": "2026-03-18", "status": "ERROR" },
        { "date": "2026-03-25", "status": "PROD-PASS" }
      ]
    }
  }
}
```

When determining what action to take for a cell line, only the most recent entry in `ingest_runs` is considered. Earlier entries are treated as historical record only.

If the log file does not exist or contains malformed JSON, the module returns an empty dictionary rather than raising an exception. This is intentional: the run log is managed by an external system and may legitimately not exist on first startup.

---

## Run ready processing

The **Ingestion Monitor** processes each file in `ready/` against the run log and applies the following routing rules based on the latest status for that file.

A status of `PROD-PASS` means the file was successfully ingested into the ASCR registry database. The file is moved from `ready/` to `registered/` via `file_manager.move_to_registered`.

A status of `ERROR` means the ingestion attempt failed. The file is moved from `ready/` back to `working/` via `file_manager.move_to_working`, where the curator can review and correct it before resubmitting.

Any other outcome — including `DEV-PASS`, an empty `ingest_runs` list, or no log entry for the file — leaves the file in `ready/` unchanged. `DEV-PASS` indicates the file passed a development environment but has not yet been processed at the production level, so it remains queued.

The **Ingestion Monitor** also provides a read-only view of error files: it can scan `working/` and return all files whose most recent run log entry has a status of `ERROR`. This is used by the frontend **Ingestion Monitor** page to display cell lines that need curator attention.

### Scheduling

The **Ingestion Monitor** runs automatically every Saturday at 06:00, timed to run the day after the typical ASCR registry ingestion schedule. It is started as a background `asyncio` task when the FastAPI application starts.

A manual trigger is also available via `POST /internal/check-ingestion-log`, exposed in the Settings page. This runs the same routing logic immediately and returns a summary with counts of processed, moved-to-registered, moved-to-working, and skipped files.

For full method documentation, see the [Ingestion Monitor API reference](../reference/ingestion-monitor.md).

---

## Dependencies

The `IngestionManager` class takes three constructor arguments: the run log path, a `StorageInterface` for listing files in `ready/` and `working/`, and a `FileManager` for performing state transitions. It does not interact with Redis, the AI pipeline, or any other module.

The **Ingestion Monitor** is instantiated in two places in `main.py`: in the `monitor_ingestion_log` background coroutine that runs on a weekly schedule, and in the `POST /internal/check-ingestion-log` endpoint that handles manual triggers.

---

## FAQ

**What happens if the run log doesn't exist yet?**

`_load_run_log()` returns an empty dictionary rather than raising an error. `process_ready_files()` will skip all files and `get_errors()` will return an empty list. Neither operation fails hard because the run log is managed by an external system.

**What if a file in `ready/` has no matching entry in the run log?**

The file is left in `ready/` unchanged. Only `PROD-PASS` and `ERROR` statuses trigger action — absence of an entry is treated the same as an unresolved or in-progress state.

**Can I trigger the ingestion check without waiting for Saturday?**

Yes. The Settings page has a manual trigger button that calls `POST /internal/check-ingestion-log`, which runs the routing logic immediately and returns the result summary.

**What happens if a filename in `ready/` doesn't have a version suffix?**

The file is skipped. The monitor cannot look up a file in the run log without a version key, and all files created through normal workflow will have version suffixes, so this is a safety guard against unexpected files.
