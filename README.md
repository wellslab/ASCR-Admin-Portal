# ASCR Curation Portal

A web application for curating and staging cell line records before submission to the ASCR registry database. Built with FastAPI and Next.js.

## Documentation

Documentation is served by the `docs` container at **http://localhost:8080** when the application is running. It is accessible from the sidebar in the UI.

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
| Docs | 8080 | MkDocs documentation |
| Redis | 6380 | Task queue and caching |

## Quick Start

**Prerequisites**: Docker and Docker Compose

```bash
git clone https://github.com/wellslab/ASCR-Curation-Portal.git
cd ASCR-Curation-Portal

# Start all services
./start.sh
```

Access points:
- **Application**: http://localhost:3001
- **API docs**: http://localhost:8001/docs
- **Documentation**: http://localhost:8080

## Configuration

The OpenAI API key and model selection are configured through the **Settings page** in the UI. They are stored in `services/backend/config.json` and persist across container restarts. Setting `OPENAI_API_KEY` as an environment variable has no effect.

For production, set the following in your environment before starting:
```bash
NEXT_PUBLIC_BACKEND_API_URL=http://YOUR_SERVER_IP:8001
```

## Features

**AI Curation** — Upload publication PDFs and the system uses OpenAI to extract structured cell line metadata. Curation jobs run in the background via Celery, with real-time progress updates over WebSocket.

**Cell Line Editor** — Edit cell line records with field-level diff visualisation showing changes between versions.

**State Management** — Cell lines move through three states: `working` → `ready` → `registered`. Each state maps to a separate directory under `/app/data/`.

**Version Control** — Every save creates a new versioned JSON file. All versions are retained across all states.

**Ingestion Monitor** — Reads the ASCR registry run log and automatically routes cell lines from `ready/` to `registered/` on success, or back to `working/` on error.

**Schema-Driven Forms** — The data schema is defined in `data_dictionaries/models.py`. Editing that file directly updates backend validation and frontend field rendering.

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

## Data Storage

Cell lines are stored as JSON files in `/app/data/`:

```
/app/data/
  working/      # in-progress records
  ready/        # records awaiting ingestion
  registered/   # successfully ingested records
```

There is no database. Each versioned file is named `{base_name}_v{n}.json`.

## Production Deployment

For the initial deployment on the prod server:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

After pushing changes to master, run `update.sh` on the prod server to pull the latest code and rebuild the containers:

```bash
./update.sh
```

See the Deployment Guide in the documentation (http://localhost:8080) for full instructions.
