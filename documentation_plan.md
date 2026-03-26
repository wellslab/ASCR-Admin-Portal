# Documentation Plan

## Goal

Produce a complete, handover-ready documentation set for the incoming development team. All documentation lives in `documentation/docs/` and is served via MkDocs.

---

## Target Structure

```
documentation/docs/
├── index.md                          # Landing page and navigation guide
├── architecture.md                   # System overview — read this first
│
├── features/
│   ├── ingestion-manager.md          # exists — good
│   ├── settings-page.md              # exists — good
│   ├── task-history.md               # exists — good
│   ├── version-control.md            # move from /docs/features/
│   ├── validation-system.md          # move from /docs/features/
│   └── cell-line-editor.md           # move from /editor_component_spec.md
│
├── modules/
│   ├── storage.md                    # exists — stub, needs prose
│   ├── file-manager.md               # new — replaces data_transport + version_control stubs
│   ├── ai-curation.md                # new — curate.py + tasks.py
│   ├── ingestion-monitor.md          # new — ingestion_manager.py
│   └── validation.md                 # new — data_dictionaries/models.py
│
├── data-dictionary.md                # consolidate SCHEMA_GUIDE.md
│
├── tests/
│   ├── index.md                      # exists
│   └── validation.md                 # exists
│
├── deployment.md                     # consolidate prod_deployment_guide + root deployment.md
│
└── faq.md                            # future
```

Internal modules (`main.py`, `config_manager.py`, `task_progress.py`, `schema_migration.py`) are not given their own pages. They are described in `architecture.md` and can be understood by reading the source.

---

## Document Checklist

### Must Write (missing entirely)
- [x] `architecture.md` — highest priority, the connective tissue for everything else
- [ ] `modules/file-manager.md` — FileManager: state transitions, versioning, conflict exceptions
- [ ] `modules/ai-curation.md` — AI curation pipeline: agents, prompts, task flow
- [ ] `modules/ingestion-monitor.md` — IngestionManager: run log processing, file routing
- [ ] `modules/validation.md` — Validation: Pydantic models, how they're used in backend and frontend

### Must Move (exist but in wrong location)
- [ ] `docs/features/three-status-version-control-spec.md` → `documentation/docs/features/version-control.md`
- [ ] `docs/features/validation-system-spec.md` → `documentation/docs/features/validation-system.md`
- [ ] `editor_component_spec.md` → `documentation/docs/features/cell-line-editor.md`
- [ ] `SCHEMA_GUIDE.md` → `documentation/docs/data-dictionary.md`

### Must Update
- [ ] `index.md` — rewrite, fix broken `api/` path references
- [ ] `modules/storage.md` — add prose description above docstring directive
- [ ] `mkdocs.yml` nav — add all missing entries
- [ ] `deployment.md` — check if root `deployment.md` adds anything over `prod_deployment_guide.md`

### Already Good (no action needed)
- [x] `features/ingestion-manager.md`
- [x] `features/settings-page.md`
- [x] `features/task-history.md`
- [x] `tests/index.md`
- [x] `tests/validation.md`
- [x] `prod_deployment_guide.md`

### Out of Scope (not for handover docs)
- `todo.md` — internal task tracking
- `curation_instructions/` — LLM system prompts, not developer docs
- `data_dictionaries/stefan_data_dictionary_change_record.md` — internal working file
- `services/frontend/my-app/README.md` — generic Next.js scaffold readme
- `modules/main.md` — `main.py` is an internal module; covered by architecture doc

---

## Work Order

1. [x] Refactor FileManager (prereq for accurate architecture doc)
2. [x] Write `architecture.md`
3. [x] Write `modules/file-manager.md`
4. [x] Write `modules/ai-curation.md`
5. [x] Write `modules/ingestion-monitor.md`
6. [x] Write `modules/validation.md`
7. [ ] Move and tidy feature specs into correct location
8. [ ] Move `SCHEMA_GUIDE.md` → `data-dictionary.md`
9. [x] Update `modules/storage.md` with prose
10. [ ] Rewrite `index.md`
11. [ ] Update `mkdocs.yml` nav

---

## Current Progress

The following work has been completed as of 2026-03-26.

**Backend refactoring (prerequisite to documentation):**
- `DataTransport` and `VersionControl` modules were consolidated into a single `FileManager` module (`services/backend/file_manager.py`). Tests were written first (`tests/test_file_manager.py`, 38 tests), all passing. Old modules and their test files were deleted.
- The backend directory was restructured: `utils.py` was dissolved and its contents distributed to `websocket.py` (WebSocket connection management), `validation.py` (schema/form generation), and `tasks.py` (task queuing). `models.py` was renamed to `api_models.py`. The `prompts/` and `contexts/` directories were merged into `ai_assets/`. All stale `__pycache__` entries from deleted modules were cleared. Tests remain at 65 passing, 7 pre-existing failures unrelated to this work.

**Documentation written:**
- `documentation/docs/architecture.md` — full system overview including service topology, file storage model, three-state workflow, versioning strategy, AI curation pipeline, and the functional vs internal module distinction.
- `documentation/docs/modules/storage.md` — replaces the previous one-line stub with full prose documentation.
- `documentation/docs/modules/file-manager.md` — new document covering the three-state workflow, versioning, conflict exceptions, and all public methods.
- `documentation/docs/modules/ai-curation.md` — new document covering the eight-stage pipeline, the three agents, the Celery task, error handling, and the `ai_assets/` directory.
- `documentation/docs/modules/ingestion-monitor.md` — new document covering the run log format, status routing logic, scheduling, and all public methods.
- `documentation/docs/modules/validation.md` — new document covering the generated Pydantic schema, the `CellLineValidation` class, schema and form generation utilities, and the schema update process.

**Documentation style decisions made:**
- All module documentation is written in full prose, instructional in style, leading the reader through flows and processes. Short-form bullet points and terse phrasing are avoided.
- The architecture document distinguishes between functional modules (Storage, FileManager, AI Curation, Ingestion Monitor, Validation) and internal/infrastructure modules (main.py, config_manager.py, task_progress.py, schema_migration.py). Only functional modules get their own documentation pages.
- Module docs use a **Responsibilities** section as the first section, with each responsibility as a bold-titled bullet. Subsections below unpack how the module fulfils each responsibility. No function-level descriptions are included in module docs — these are replaced by a link to the auto-generated API reference page.
- Each module doc ends with a **FAQ** section covering common developer questions.
- API reference pages live in `documentation/docs/reference/` and use the `mkdocstrings` `:::` directive to auto-generate content from Python docstrings. This keeps method documentation in sync with the code without manual maintenance.

---

## Next Steps

The remaining work items are mechanical — moving existing files to their correct locations, consolidating two documents, rewriting the landing page, and updating the MkDocs nav. No significant new writing is required except for `index.md`.

**Item 7 — Move and tidy feature specs (Work Order item 7)**

Three existing spec files need to be moved and lightly edited into `documentation/docs/features/`. Each should be read, assessed for content that is still accurate, and rewritten as a description of the implemented feature rather than a design specification. The "Implementation Plan", "Timeline", "Success Criteria" and similar sections from the original specs should be dropped — those sections describe development work that is now complete.

- `docs/features/three-status-version-control-spec.md` → `documentation/docs/features/version-control.md`
- `docs/features/validation-system-spec.md` → `documentation/docs/features/validation-system.md`
- `editor_component_spec.md` → `documentation/docs/features/cell-line-editor.md`

The `documentation/docs/features/` directory already contains `ingestion-manager.md`, `settings-page.md`, and `task-history.md`, which are already in good shape and should not be touched.

**Item 8 — Consolidate `SCHEMA_GUIDE.md` → `data-dictionary.md` (Work Order item 8)**

`SCHEMA_GUIDE.md` exists at the project root. It should be read, assessed, and its useful content moved to `documentation/docs/data-dictionary.md`. The target document should explain the Excel spreadsheet as the source of truth, the code generation pipeline (`make_data_dictionary.py`), the artifacts it produces, and the process for making a schema change. The existing `data_dictionaries/SPEC.md` is also relevant source material.

**Item 10 — Rewrite `index.md` (Work Order item 10)**

`documentation/docs/index.md` currently contains broken `api/` path references and does not reflect the current documentation structure. It should be rewritten as a proper landing page that orients the reader: what the system is, how to navigate the docs, and where to start (architecture.md). Read the existing file first before rewriting.

**Item 11 — Update `mkdocs.yml` nav (Work Order item 11)**

The MkDocs nav in `documentation/mkdocs.yml` needs to be updated to match the target nav defined at the bottom of this plan. Read the existing `mkdocs.yml` before editing. The target nav is:

```yaml
nav:
  - Home: index.md
  - Architecture: architecture.md
  - Features:
    - Ingestion Manager: features/ingestion-manager.md
    - Cell Line Editor: features/cell-line-editor.md
    - Version Control: features/version-control.md
    - Validation System: features/validation-system.md
    - Task History: features/task-history.md
    - Settings Page: features/settings-page.md
  - Modules:
    - Storage: modules/storage.md
    - File Manager: modules/file-manager.md
    - AI Curation: modules/ai-curation.md
    - Ingestion Monitor: modules/ingestion-monitor.md
    - Validation: modules/validation.md
  - Data Dictionary: data-dictionary.md
  - Tests:
    - Overview: tests/index.md
    - Validation: tests/validation.md
  - Deployment: deployment.md
  - FAQ: faq.md
```

Note that `deployment.md` and `faq.md` are listed in the nav but may not yet exist in the correct location or at all — check before updating the nav. The `deployment.md` item should be checked against the existing `prod_deployment_guide.md` (which is already good) to see if a copy or redirect is needed. `faq.md` is optional and can be omitted from the nav if it has not been written.

---

## MkDocs Nav (target)

```yaml
nav:
  - Home: index.md
  - Architecture: architecture.md
  - Features:
    - Ingestion Manager: features/ingestion-manager.md
    - Cell Line Editor: features/cell-line-editor.md
    - Version Control: features/version-control.md
    - Validation System: features/validation-system.md
    - Task History: features/task-history.md
    - Settings Page: features/settings-page.md
  - Modules:
    - Storage: modules/storage.md
    - File Manager: modules/file-manager.md
    - AI Curation: modules/ai-curation.md
    - Ingestion Monitor: modules/ingestion-monitor.md
    - Validation: modules/validation.md
  - Data Dictionary: data-dictionary.md
  - Tests:
    - Overview: tests/index.md
    - Validation: tests/validation.md
  - Deployment: deployment.md
  - FAQ: faq.md
```
