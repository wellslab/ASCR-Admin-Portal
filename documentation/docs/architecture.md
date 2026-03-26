# Architecture Overview

Read this document first. It describes the system's structure, the key design decisions, and how the major components relate to each other. The feature and module documentation in the rest of this site assumes the context established here.

---

## What the system does

The ASCR Admin Portal is an internal staging and curation tool used by curators at the Australian Stem Cell Registry. Its purpose is to prepare cell line records for submission to the ASCR registry database. Curators upload scientific publications, the system extracts structured cell line metadata using an AI pipeline, and curators then review and edit that metadata before submitting it for ingestion into the registry. The admin portal file system holds the full history of records — working drafts, ready-for-submission records, and registered records — while the ASCR registry database contains only the live, currently ingested versions.

The system has no public-facing component. It is deployed on an internal server and accessed by a small team.

---

## Service infrastructure

Three services communicate over HTTP and a Redis task queue:

```
Browser
  │
  ▼
Frontend (Next.js 15)          :3001
  │
  │  HTTP / WebSocket
  ▼
Backend (FastAPI + Celery)     :8001
  │                │
  │ reads/writes   │ enqueues tasks
  ▼                ▼
/app/data/       Redis          :6380
(JSON files)    (task queue)
```

| Service | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js 15, TypeScript, Material UI | All user interaction — editing, curation, status views |
| Backend | FastAPI, Python 3.11 | REST API, file storage, task dispatch, ingestion processing |
| Celery Worker | Celery, same codebase as backend | Runs AI curation jobs in the background |
| Redis | Redis 7 | Task queue between backend and worker; task progress and history storage |

The backend and Celery worker share the same Docker image and codebase. The worker runs as a separate container executing the same Python modules but launched with `celery -A tasks worker` instead of `uvicorn`.

---

## The System Uses File-Based Storage

There is no database. All cell line records are stored as JSON files on the container's filesystem (mounted from the host for persistence). This was a deliberate simplification to remove the operational overhead of running a database and exporting data into a directory structure that was agreed upon for the ingestion process.

Each cell line file uses a `StandardRecord` envelope:

```json
{
  "filename": "AIBNi001-A_v1",
  "location": "working",
  "version": 1,
  "curation_method": "AI",
  "last_modified": "2026-03-15T10:42:00",
  "data": {
    "general": { "hpscreg_name": "AIBNi001-A", ... },
    "donors": [...],
    ...
  }
}
```

The `data` field holds the scientific metadata. The outer fields are provenance — they record where the file is, what version it is, and how it was created.

Each state directory (`working/`, `ready/`, `registered/`) contains an `index.json` that maps base names to lists of filenames:

```json
{ "AIBNi001-A": ["AIBNi001-A_v0", "AIBNi001-A_v1"] }
```

The storage layer (`storage.py`) maintains this index automatically on every create and delete operation.

---

## Cell lines move through three states

Every cell line JSON file moves through three states, each corresponding to a **directory** on disk:

```
working/  →  ready/  →  registered/
```

**working** — the file is being actively edited by a curator. Files here can be modified at any time. A new cell line is always created in `working/` first.

**ready** — the curator has reviewed the file and marked it as ready for submission to the ASCR registry. The file is moved from `working/` to `ready/` without modification. Once in `ready/`, the file is not editable in the UI.

**registered** — the ASCR registry ingestion system has processed the file and confirmed it. The file is moved from `ready/` to `registered/` automatically by the **Ingestion Monitor**. Files in `registered/` are read-only from the portal's perspective.

A file can also move backward: from `ready/` back to `working/` if a curator needs to correct it after it has been queued.

This three-state workflow is the central organizing principle of the system. Most backend modules exist to support it.

---

## Versioning

Every time a new version of a cell line is created, it gets a version number appended to its filename: `AIBNi001-A_v0`, `AIBNi001-A_v1`, and so on. Version numbers are globally scoped — they increment across all three directories.

The version number is determined by looking at what already exists in `registered/` for that base name. If `AIBNi001-A_v0` is already registered, the next new version will be `v1`. This means the version history in `registered/` is the authoritative record of how many times a cell line has been submitted to the registry.

Within a normal workflow, only one version of a given cell line can be in `working/` or `ready/` at a time. Multiple versions can accumulate in `registered/` over time.

---

## The AI curation pipeline

The primary data entry method is AI-assisted curation from scientific publications:

```
1. Curator uploads a PDF via the frontend
2. Frontend encodes the file as base64 and sends it to POST /start-ai-curation
3. Backend creates a task record in Redis and queues a Celery job
4. The Celery worker:
   a. Uploads the PDF to the OpenAI Files API
   b. Runs an identification agent to extract cell line IDs from the paper
   c. Runs a curation agent for each cell line, extracting structured metadata
   d. Runs a normalisation agent to map free-text values to controlled vocabularies
   e. Validates the output against the Pydantic schema
   f. Saves each cell line as a new file in working/
5. The worker broadcasts progress updates to the backend via HTTP
6. The backend relays progress to the frontend over WebSocket
7. The frontend displays live stage-by-stage progress in the Task History panel
```

The three AI agents each have a separate system prompt stored in `services/backend/ai_assets/`. The curation agent's prompt is combined at runtime with the LLM curation instructions stored in `curation_instructions/llm_curation_instructions.md`.

---

## Backend modules

### Functional modules

These modules implement the application's core capabilities. They are what the system does, and they are the primary reference for understanding how the application works.

| Module | Responsibility |
|---|---|
| **Storage** (`storage.py`) | Pure file I/O. Implements `StorageInterface` (create, get, update, delete, list, exists). Manages `index.json` files. No business logic. All other modules depend on this. |
| **File Manager** (`file_manager.py`) | All file management logic. State transitions between working, ready, and registered. Version number assignment and parsing. Conflict detection. Depends only on `StorageInterface`. |
| **AI Curation** (`curate.py`, `tasks.py`) | The AI-assisted data entry path. `curate.py` implements the three OpenAI agents (identification, curation, normalisation). `tasks.py` defines the Celery task that runs the full pipeline and saves results to working. |
| **Ingestion Monitor** (`ingestion_manager.py`) | Reads `run_log.json` produced by the ASCR registry ingestion system. Moves files from `ready/` to `registered/` on PROD-PASS, or back to `working/` on ERROR. |
| **Validation** (`data_dictionaries/models.py`) | Pydantic models defining the curation schema. Edited directly as the single source of truth. Used by the backend to validate all incoming cell line data, and by the frontend editor to determine field types and constraints. |

### Internal modules

These modules handle infrastructure, configuration, and tooling. They are not features of the application — they support how the application is built and operated.

| Module | Responsibility |
|---|---|
| `main.py` | FastAPI application. Defines all HTTP and WebSocket endpoints. Wires dependencies via FastAPI's `Depends` system. |
| `config_manager.py` | Reads and writes `config.json`. Runtime config (set via UI) takes priority over environment variables. |
| `task_progress.py` | Manages task progress records in Redis. Called by the Celery worker at each pipeline stage to broadcast progress to the frontend. |
| `schema_migration.py` | Migrates existing cell line files to the current `StandardRecord` format. Idempotent. Triggered via the Settings page or `POST /admin/migrate-schema`. |

### Module dependencies

```
main.py  →  FileManager(storage)
main.py  →  IngestionManager(storage, file_manager)
main.py  →  storage (directly, for simple read/list operations)
tasks.py →  curate.py, storage (saves results directly)
```

---

## The data schema

The curation schema is defined directly in `data_dictionaries/models.py`. This file is the single source of truth for all cell line fields — their names, types, allowed values, and descriptions — and is edited by hand when the schema needs to change.

The backend validates all incoming cell line data against the Pydantic models in this file. The frontend editor calls `GET /cellline-schema`, which reads the same models and returns a field descriptor object used to render the correct input widget for each field (dropdown, number input, boolean toggle, etc.).

To change a field, edit `data_dictionaries/models.py` directly. Changes take effect on next deployment. If existing records need to be updated to conform to the new schema, use the **Migrate Schema** button on the Settings page.

---

## Configuration

The backend reads configuration from two sources, in priority order:

1. `services/backend/config.json` — written by the Settings page in the UI. Takes precedence over environment variables.
2. Environment variables — set in `.env` or passed to the Docker container.

The most important configuration value is `OPENAI_API_KEY`, which the curation pipeline requires. It can be set either through the Settings page or as an environment variable before starting the services.

For deployment configuration, see [Deployment](deployment.md).
