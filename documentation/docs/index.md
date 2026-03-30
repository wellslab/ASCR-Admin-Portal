# ASCR Admin Portal Documentation

The ASCR Admin Portal is a web application for curating and staging cell line records before submission to the ASCR registry database. It provides tools for AI-assisted curation, manual editing, version control, and ingestion monitoring.

## Where to start

- **[Architecture](architecture.md)** — how the system is structured and how the components fit together
- **[FAQ](faq.md)** — answers to common questions about the schema, AI curation, and workflow operations

## Frontend

- **[Cell Line Editor](frontend/cell-line-editor.md)** — the main curation and editing interface
- **[Ingestion Manager](frontend/ingestion-manager.md)** — review and resolve ingestion errors
- **[Settings Page](frontend/settings-page.md)** — configure API keys, model selection, and system settings
- **[Task History](frontend/task-history.md)** — monitor AI curation task progress and results

## Modules

- **[Storage](modules/storage.md)** — file-based storage layer
- **[File Manager](modules/file-manager.md)** — state transitions and version control
- **[AI Curation](modules/ai-curation.md)** — the AI curation pipeline
- **[Ingestion Monitor](modules/ingestion-monitor.md)** — ingestion log processing
- **[Validation](modules/validation.md)** — schema validation and frontend schema export

## API Reference

Auto-generated from source docstrings:

- **[Storage](reference/storage.md)**
- **[File Manager](reference/file-manager.md)**
- **[AI Curation](reference/ai-curation.md)**
- **[Ingestion Monitor](reference/ingestion-monitor.md)**
- **[Validation](reference/validation.md)**
