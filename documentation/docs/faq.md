# FAQ

---

## Schema and Models

**How do I update the curation schema?**

Edit `data_dictionaries/models.py` directly — it is the single source of truth for the curation schema. Add, remove, or modify fields in the relevant Pydantic model. Backend validation rules and frontend editor field rendering both derive from this file and will reflect the changes on next deployment.

**Will schema changes propagate to historical cell line records?**

Not automatically. Existing records were saved against the schema that was in place at the time. If a schema change makes existing records invalid — for example a field is renamed or a new required field is added — those records will fail validation when a curator next tries to save them.

To update existing records, click the **Migrate Schema** button on the Settings page. This runs the migration logic against all records across `working/`, `ready/`, and `registered/`, updating them to conform to the current schema structure.

Note that migrating the portal's records does not update the ASCR registry database — the database still holds the pre-migration structure for any previously ingested cell lines. To push the updated schema into the registry, the relevant live records (the latest version of each cell line in `registered/`) need to be moved back to `ready/` and resubmitted through the normal ingestion process. This is a manual step: identify which registered records need resubmission, move them to `ready/`, and let the **Ingestion Monitor** pick them up on the next run or trigger it manually from the Settings page.

**How do I add a new field to the curation schema?**

Add the field to the appropriate Pydantic model in `data_dictionaries/models.py`. The frontend editor picks it up automatically via the `/cellline-schema` endpoint — no frontend changes are needed for the field to appear. If the new field is required and existing records don't have it, run schema migration from the Settings page. Also review `curation_instructions/llm_curation_instructions.md` to add guidance for the AI curation agent about the new field.

**Where does the validation logic live?**

`data_dictionaries/models.py` defines the schema — field types, `Literal` enum constraints, required vs optional. `services/backend/validation.py` contains the `CellLineValidation` class used in the AI curation pipeline, and the `get_frontend_schema` and `generate_empty_form` utilities used by the API. FastAPI handles API-level validation automatically from the Pydantic models — there is no separate validation middleware.

**Why do version numbers start at v0 instead of v1?**

The version number reflects how many times a cell line has previously been registered. A brand-new cell line has zero prior registered copies, so its first version is `v0`. The second submission of the same cell line has one prior registered copy, so it becomes `v1`, and so on.

---

## AI Curation

**How do I update the prompts for AI curation?**

Edit the Markdown prompt files in `services/backend/ai_assets/`. There is one prompt file per agent (identification, curation, normalisation). The curation agent's prompt is combined at runtime with `curation_instructions/llm_curation_instructions.md`, which contains the field-by-field extraction instructions — edit that file to change what the curation agent is told about individual fields. Changes take effect immediately for new curation runs; tasks already queued or in progress are not affected.

**How do I change the model used for AI curation?**

The model name is read from the configuration manager at task startup. Update the model setting there. The default is `gpt-4.1-mini`. Changes take effect for new curation runs; in-progress tasks will complete using the model they were started with.

**How do I retry a failed AI curation task?**

The Task History panel has a retry button on each failed task entry. Alternatively, call `POST /tasks/{task_id}/retry` directly. The task will be re-queued with the same PDF input.

**Where do I find logs for a failed curation job?**

The Task History panel shows the error details recorded during the pipeline run. For lower-level Celery worker output, run `docker-compose logs background_processor`. The task progress record in Redis also contains the stage at which the failure occurred and the error message.

**The AI curation pipeline ran but saved nothing — what went wrong?**

There are three common causes. First, the identification agent found no cell lines in the PDF — check the task result in Task History for the identified cell line list. Second, all identified cell lines failed Pydantic validation after normalisation — the task result will include the validation errors for each. Third, all identified cell lines already have a working copy with the same `hpscreg_name` and the overwrite condition was not met. In all cases the Task History entry contains enough detail to diagnose the cause.

---

## Workflow and Operations

**How do I manually move a cell line back from `ready/` to `working/`?**

Use the Working/Ready toggle in the Cell Line Editor header. Clicking it when a cell line is in `ready/` will move it back to `working/` immediately. The `POST /cell-line/{filename}/move-to-working` endpoint can also be called directly.

**A cell line is stuck in `ready/` but the ingestion monitor didn't move it — what should I check?**

Check `data/run_log.json` for an entry matching the cell line's base name and version. The file will only be moved if the most recent entry in `ingest_runs` has a status of `PROD-PASS` or `ERROR`. A status of `DEV-PASS`, an empty `ingest_runs` list, or no entry at all will leave the file in `ready/` unchanged. You can also trigger the ingestion check manually from the Settings page to force an immediate processing pass.

**The ingestion monitor ran but reported zero files processed — is that normal?**

Yes, if `ready/` is empty or if all files in `ready/` have no matching log entry yet (or have `DEV-PASS` as their latest status). Zero processed is not an error — it means no files met the criteria for routing on that run.

---

## Troubleshooting

**A cell line failed validation on save but the error message isn't clear — how do I investigate?**

The validation error includes the field path (e.g. `general → cell_type`) and the rule that failed. Cross-reference the field name with `data_dictionaries/models.py` to see the exact type constraint or `Literal` enum values. If the error is coming from the AI curation pipeline rather than the editor, the full Pydantic error detail is recorded in the task result and visible in Task History.

**What if `index.json` gets out of sync with the files on disk?**

Files that exist on disk but are absent from the index are invisible to the application — they will not appear in any listing and cannot be retrieved via the API. To fix, manually edit the relevant `index.json` to add the missing entry. The index format is a plain JSON dictionary mapping base names to lists of versioned filenames.

---

## Architecture

**Why is there no database?**

File-based storage removes the need for database migrations, connection management, and infrastructure setup. Cell line records are plain JSON files that can be inspected, copied, and backed up directly on the filesystem. The tradeoff is that there is no query capability beyond what the index files provide, and no transactional guarantees. At the current scale of the ASCR registry this is a reasonable trade.

**What is the difference between the Frontend and Modules sections of these docs?**

**Frontend** describes what the UI pages do — the pages a curator interacts with, how they behave, and what they allow the user to do. **Modules** describes how the backend code works — what each module is responsible for and how it is structured. A developer trying to understand a user-facing behaviour should start in Frontend; a developer trying to understand or modify backend logic should start in Modules.
