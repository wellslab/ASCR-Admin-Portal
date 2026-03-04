# ASCR Admin Portal

A web application for managing Australian Stem Cell Registry (ASCR) cell line data with an AI-powered curation workflow. Built with FastAPI and Next.js.

## Architecture

Three services communicate via HTTP and a Redis-backed task queue:

```
Frontend (Next.js 15)
  :3001
    |
    └── Backend (FastAPI + Celery)
          :8001
            |
            ├── /app/data/     (JSON file storage)
            └── Redis :6380    (task queue)
```

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 3001 | Next.js UI |
| Backend | 8001 | FastAPI REST API + Celery worker |
| Redis | 6380 | Task queue and caching |

## Quick Start

**Prerequisites**: Docker and Docker Compose

```bash
# Clone the repo
git clone <repository-url>
cd ascr-admin-portal

# Create a .env file with your API key (see Configuration below)

# Start all services
./start.sh
```

Access points:
- **Application**: http://localhost:3001
- **API docs**: http://localhost:8001/docs

## Configuration

Create a `.env` file in the project root:

```bash
# Required for AI curation
OPENAI_API_KEY=your_openai_api_key

# Redis
REDIS_URL=redis://redis:6379/0

# Development
DEBUG=true
```

For production, also set:
```bash
NEXT_PUBLIC_BACKEND_API_URL=http://YOUR_SERVER_IP:8001
CELL_LINE_DATA_PATH=/path/on/server/to/cell_lines
```

API keys can also be configured through the Settings page in the UI. They are stored in `services/backend/config.json` and persist across container restarts.

## Features

**AI Curation** — Upload publication PDFs or paste text, and the system uses OpenAI GPT-4 to extract structured cell line metadata. Curation jobs run in the background via Celery, with real-time progress updates over WebSocket.

**Cell Line Editor** — Edit cell line records with field-level diff visualization showing changes between the current version and the previous one.

**State Management** — Cell lines move through three states: `working` → `ready` → `registered`. Each state maps to a separate directory under `/app/data/`.

**Version Control** — Every update creates a new versioned JSON file. The system retains the last 10 versions per cell line.

**Schema-Driven Forms** — The data schema is generated from an Excel data dictionary (`data_dictionaries/2025_12_ascr_data_dictionary_v1.0.xlsx`). Changing the schema requires regenerating the Pydantic models and JSON schema artifacts.

## Development

### Running services individually

```bash
# Backend
cd services/backend
python -m uvicorn main:app --reload --port 8001

# Celery worker
cd services/backend
celery -A tasks worker --loglevel=info --pool=solo

# Frontend
cd services/frontend/my-app
npm run dev
```

### Docker commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [frontend|backend|redis]

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down
```

### Updating data dictionary

The data dictionary Excel file is the source of truth for cell line fields and validation rules.

1. Record the change in `data_dictionaries/stefan_data_dictionary_change_record.md`
2. Edit the Excel file: `data_dictionaries/2025_12_ascr_data_dictionary_v1.0.xlsx`
3. Regenerate artifacts:
   ```bash
   source .venv/bin/activate
   python data_dictionaries/make_data_dictionary.py
   ```
   This regenerates `curation_models.py`, `curation_schema.yaml`, `curation_schema.jsonc`, and the LLM instructions file.

## API Reference

All endpoints are on the backend at port 8001. Full interactive docs available at `/docs`.

### Cell line management

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/get-all-cell-lines` | List all cell lines across all states |
| `GET` | `/working/files` | List files in working directory |
| `GET` | `/ready/files` | List files in ready directory |
| `GET` | `/registered/files` | List files in registered directory |
| `GET` | `/cell-line/{filename}` | Get a specific cell line record |
| `POST` | `/working/cell-line` | Create a new cell line |
| `PUT` | `/working/cell-line/{filename}` | Update a cell line |
| `DELETE` | `/working/cell-line` | Delete a cell line |
| `POST` | `/cell-line/{filename}/move-to-ready` | Promote from working to ready |
| `POST` | `/cell-line/{filename}/move-to-working` | Move from ready back to working |
| `GET` | `/cell-line/{base_name}/versions` | Get all versions of a cell line |
| `GET` | `/cell-line/{base_name}/latest` | Get the latest version with full data |
| `GET` | `/get-empty-form` | Get an empty form template |
| `GET` | `/cellline-schema` | Get the JSON schema for cell line validation |
| `GET` | `/stats` | Counts by state (working/ready/registered) |

### AI curation

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/start-ai-curation` | Submit files for AI curation (base64-encoded) |
| `GET` | `/tasks` | List recent curation tasks |
| `POST` | `/tasks/{task_id}/retry` | Retry a failed task |
| `DELETE` | `/tasks/{task_id}` | Remove a task from history |

### Settings

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/settings` | Get current settings (API keys masked) |
| `POST` | `/settings` | Update settings |

### Real-time

| Protocol | Path | Description |
|----------|------|-------------|
| WebSocket | `/ws/task-updates` | Stream task completion and progress events |

## Data Storage

Cell lines are stored as JSON files in `/app/data/`:

```
/app/data/
  working/      # in-progress records
  ready/        # records reviewed and awaiting registration
  registered/   # finalized records
```

Each update to a cell line creates a new versioned file (e.g., `CellLine_Name_v3.json`). There is no database.

## Production Deployment

```bash
# Build and start
docker compose -f docker-compose.prod.yml up --build -d

# Update to latest
./update.sh
```

The production compose file mounts `${CELL_LINE_DATA_PATH}` from the host for persistent cell line storage.

## Documentation

Auto-generated API and module documentation is available via MkDocs:

```bash
./serve-docs.sh
```

Documentation is also published to GitHub Pages on push to `master`.
