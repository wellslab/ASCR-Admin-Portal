# Ingestion Manager

## Overview

The Ingestion Manager is a backend module that processes the ASCR registry ingestion system's run log and moves cell line files between states accordingly.

The ASCR registry ingestion system picks up cell line files from the `ready/` directory and ingests them into the ASCR registry database. After each ingestion run it writes a JSON log file (`run_log.json`) at a configured path. The Ingestion Manager reads this file and resolves the outcome for each cell line that is currently waiting in `ready/`.

---

## Run Log Format

The run log is a JSON file keyed by cell line base name. Each base name contains one key per version, and each version contains an array of ingestion run records ordered chronologically (newest last).

```json
{
  "AIBNi001-A": {
    "v0": {
      "ingest_runs": [
        { "date": "2026-03-23", "status": "ERROR" },
        { "date": "2026-03-24", "status": "DEV-PASS" },
        { "date": "2026-03-25", "status": "PROD-PASS" }
      ]
    },
    "v1": {
      "ingest_runs": [
        { "date": "2026-03-25", "status": "PROD-PASS" }
      ]
    }
  }
}
```

The last item in `ingest_runs` is treated as the current status. An empty `ingest_runs` array means the file has not yet been processed.

---

## File-to-Log Mapping

Cell line files in the `ready/` directory carry a version suffix (e.g., `AIBNi001-A_v0`). The Ingestion Manager splits this into a base name and version key to look up the entry in the run log:

- File: `AIBNi001-A_v0` → base name `AIBNi001-A`, version key `v0`
- Lookup: `run_log["AIBNi001-A"]["v0"]["ingest_runs"][-1]`

---

## Processing Logic

For each file in the `ready/` directory:

| Condition | Action |
|---|---|
| No entry in run log for this cell line / version | Leave in `ready/` — not yet ingested |
| `ingest_runs` is empty | Leave in `ready/` — not yet processed |
| Latest status is `PROD-PASS` | Move to `registered/` via `DataTransport.move_to_registered` |
| Latest status is `ERROR` | Move to `working/` via `DataTransport.move_to_working` |
| Latest status is `DEV-PASS` or any other value | Leave in `ready/` — not yet at production stage |

---

## Scheduling

The ASCR registry ingestion process runs every Friday. The Ingestion Manager therefore runs automatically every Saturday at 06:00 local server time. This gives the ASCR registry ingestion system time to complete and write its log before the manager processes it.

On application startup, the background task calculates the time until the next Saturday 06:00 and sleeps until then. Subsequent runs repeat on a 7-day cycle.

A manual trigger is also available from the Settings page in the admin portal (see below).

---

## Backend Components

### `IngestionManager` class (`services/backend/ingestion_manager.py`)

Replaces the previous `IngestionMonitor` sketch. Key method:

**`process_ready_files() -> dict`**

Reads `run_log.json`, iterates all files in `ready/`, and applies the processing logic above.

Returns a summary:
```json
{
  "processed": 5,
  "moved_to_registered": 3,
  "moved_to_working": 1,
  "skipped": 1
}
```

Constructor takes:
- `run_log_path: str` — path to the `run_log.json` file
- `storage: StorageInterface`
- `data_transport: DataTransport`

### API Endpoints

**`POST /internal/check-ingestion-log`** (renamed from the old CSV-based version)

Manual trigger. Instantiates `IngestionManager` and calls `process_ready_files()`. Returns the processing summary. Called by the Settings page button.

**`GET /ingestion/errors`**

Returns a list of cell lines currently in `working/` whose most recent run log entry has status `ERROR`. Used by the Ingestion Monitor frontend page.

Response shape:
```json
{
  "errors": [
    { "filename": "AIBNi001-B_v0", "base_name": "AIBNi001-B", "version": "v0", "last_run_date": "2026-03-23" }
  ]
}
```

---

## Frontend Components

### Settings Page — Manual Ingestion Check

A new section on the Settings page titled "Ingestion Log" provides a button labelled "Check Ingestion Log Now". Pressing it calls `POST /internal/check-ingestion-log` and displays the returned summary (e.g., "3 moved to registered, 1 returned to working").

### Ingestion Monitor Page (`/tools/ingestion-monitor`)

A new page accessible from the sidebar under the Explore section. It is styled similarly to the Editor page with a two-panel layout.

**Left panel**: A list of cell lines returned to `working/` due to ingestion errors, fetched from `GET /ingestion/errors`. Each item shows the cell line filename. Selecting an item loads it in the right panel.

**Right panel**: A read-only view of the selected cell line's data, using the existing editor component in read-only mode. No editing is done here.

**Action**: A "Mark as Ready" button sends `POST /cell-line/{filename}/move-to-ready`. On success the item is removed from the left panel list.

---

## What This Module Does Not Handle

- Error message detail from the ASCR registry ingestion system. The run log does not currently include error messages; only the status code is present.
- Retry logic. Once a cell line is moved back to `working/`, the curator amends it and manually sets it to `ready/` via the existing workflow.
- Partial ingestion status. `DEV-PASS` entries are treated the same as no-result — the file stays in `ready/` until a `PROD-PASS` or `ERROR` is recorded.
