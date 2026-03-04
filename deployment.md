# Deployment Guide

## Prerequisites

The server must have Docker and Docker Compose installed.

## First-Time Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd ASCR-Admin-Portal-Fast-API
```

### 2. Create the `.env` file

The `.env` file is not in the repo (gitignored). Create it in the project root:

```bash
nano .env
```

Add the following:

```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
REDIS_URL=redis://redis:6379/0
NEXT_PUBLIC_BACKEND_API_URL=http://YOUR_SERVER_IP:8001
CELL_LINE_DATA_PATH=/path/on/server/to/cell_lines
```

- `NEXT_PUBLIC_BACKEND_API_URL` must be the server's public IP or domain, reachable from the browser.
- `CELL_LINE_DATA_PATH` is the directory on the host where cell line JSON files will be stored.

### 3. Create the cell line data directory

```bash
mkdir -p /path/on/server/to/cell_lines
```

This must match `CELL_LINE_DATA_PATH` in your `.env`.

### 4. Create the backend config file

`config.json` stores API keys set via the Settings UI. It is gitignored and must exist on the host so it persists across container restarts.

```bash
echo '{}' > services/backend/config.json
```

### 5. Build and start

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

The first build will take several minutes as it installs dependencies and builds the Next.js app.

### 6. Verify

```bash
docker compose -f docker-compose.prod.yml ps
```

All four services (`frontend`, `backend`, `worker`, `redis`) should show as running.

---

## Ongoing Deployment

After pushing changes from your local machine:

```bash
git pull
docker compose -f docker-compose.prod.yml up --build -d
```

This rebuilds any images with changed source files and recreates those containers. The cell line data and `config.json` are on the host filesystem and are not affected.

---

## Useful Commands

```bash
# View logs for all services
docker compose -f docker-compose.prod.yml logs -f

# View logs for a specific service
docker compose -f docker-compose.prod.yml logs -f backend

# Restart a single service without rebuilding
docker compose -f docker-compose.prod.yml restart backend

# Stop all services
docker compose -f docker-compose.prod.yml down
```
