# CLAUDE.md

This file provides guidance to Claude Code when working with the ASCR Admin Portal microservices architecture.

## TODO Management

When asked to create or update todos, use the `todo.md` file in the project root.
This is the single source of truth for project task tracking.

## Claude Developer Mindset
This section of instructions suggests the mindset that I want you to have when developing with me.

### Code and commenting
- Propose only the minimally engineered version of what I asked for. **Don't over engineer**.
- If you think you have a good idea for how to extend what I ask for, first propose the minimally engineered version, then provide the suggestion in chat.
- When writing code always provide the minimally engineered solution first, based on my requirements.
- When writing comments in code, be concise and clear. Comment in terms of high-level architecture.

### Conversation
- When conversing with me, be concise and clear.
- Do not be verbose or long winded.
- However, when giving explanations, explain things clearly and naturally.

### Git Commit Workflow
- **Do NOT commit changes unless explicitly asked to do so.**
- When committing, keep commit messages short and to the point.
- Do NOT include authorship information (no `Co-Authored-By` lines).
- Focus commit messages on what was changed, not why or how.

Example: `"Add loading skeletons for instant page transitions"` not `"Added loading.tsx files to improve UX by showing skeletons during navigation transitions"`

## MCP Connection

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

## Project Overview

The **Australian Stem Cell Registry (ASCR) Admin Portal** is a modern microservices-based web application for managing cell line data and AI-powered curation workflows. Built with FastAPI and Next.js, it provides a lightweight, scalable solution for cell line metadata management.

## Architecture

### Microservices Structure

- **Frontend** (`services/frontend/my-app/`) - Next.js 15 + TypeScript application (Port 3001)
- **Curation Service** (`services/curation_service/`) - FastAPI + OpenAI for AI curation (Port 8001)
- **Cell Line Archive** (`services/cell_line_archive/`) - FastAPI + file storage for data management (Port 8002)
- **Background Processor** (`services/background_processor/`) - Celery worker for long-running tasks
- **Redis** - Task queue and caching (Port 6380)

## Development Commands

### Quick Start
```bash
# Start all services
./start.sh

# Or manually
docker-compose up -d
```

### Service Management
```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f [frontend|curation_service|cell_line_archive|background_processor|redis]

# Restart a service
docker-compose restart [service_name]

# Stop all services
docker-compose down
```

### Individual Service Development

#### Curation Service (Port 8001)
```bash
cd services/curation_service/
python -m uvicorn main:app --reload --port 8001
```

#### Archive Service (Port 8002)
```bash
cd services/cell_line_archive/
python -m uvicorn main:app --reload --port 8002
```

#### Frontend (Port 3001)
```bash
cd services/frontend/my-app/
npm run dev
```

#### Background Processor
```bash
cd services/background_processor/
celery -A worker worker --loglevel=info
```

## Data Storage

### File-Based Architecture
- **Cell Lines**: Stored as JSON files in `archive_data/cell_lines/`
- **Versions**: Version history in `archive_data/versions/{cell_line_id}/v*.json`
- **Jobs**: Temporary job status in Redis
- **Sample Data**: Example records in `sample_data/`

### Data Flow
1. **Manual Entry**: Create cell lines via Archive API
2. **AI Curation**: Submit text to Curation Service for OpenAI processing
3. **Background Processing**: Long-running curation jobs handled by Celery
4. **Version Control**: Automatic versioning on cell line updates (10-version retention)
5. **Frontend Interface**: User interaction through Next.js application

## Data Dictionary Changes

The data dictionary (`data_dictionaries/2025_12_ascr_data_dictionary_v1.0.xlsx`) is the source of truth for curation models and LLM instructions. When making changes during development:

1. **Record the change** in `data_dictionaries/stefan_data_dictionary_change_record.md`
   - Document: table name, field name, column changed, reason, old value, new value

2. **Update the xlsx** using openpyxl (via `.venv`):
   ```bash
   source .venv/bin/activate
   python3 -c "from openpyxl import load_workbook; ..."
   ```

3. **Regenerate artifacts**:
   ```bash
   source .venv/bin/activate
   python data_dictionaries/make_data_dictionary.py
   ```

This generates:
- `curation_models.py` - Pydantic models
- `curation_schema.yaml` - Human-readable schema
- `curation_schema.jsonc` - JSON schema for frontend
- `curation_instructions/llm_curation_instructions.md` - LLM instructions

The change record ensures alignment with the data dictionary maintainer's master copy.

## API Integration

### Curation Service (8001)
- `POST /curate` - Start AI curation job
- `GET /status/{job_id}` - Check job status
- `GET /jobs` - List recent jobs

### Archive Service (8002)
- `GET/POST /cell-lines/` - List/create cell lines
- `GET/PUT/DELETE /cell-lines/{id}` - Manage specific cell line
- `GET /cell-lines/{id}/versions` - Version history
- `GET /stats` - Archive statistics

## Environment Configuration

Required environment variables:
```bash
# AI Services (required for curation)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Service configuration
REDIS_URL=redis://redis:6379/0
DEBUG=true
```

## Key Technologies

- **FastAPI**: Modern Python web framework for APIs
- **Next.js 15**: React framework with TypeScript
- **Pydantic**: Data validation and serialization
- **Celery**: Distributed task queue
- **Redis**: In-memory data store for task queue
- **Docker**: Containerization for consistent development

## Frontend Structure

```
services/frontend/my-app/src/app/
├── components/          # Shared UI components
├── tools/
│   ├── curation/       # AI curation interface
│   ├── editor/         # Cell line editor with diff visualization
│   ├── transcription/  # (Legacy - can be removed)
│   └── ontologies/     # Ontology management
└── lib/                # Utility functions and API clients
```

## Testing

### Backend Services
```bash
# Test curation service
curl http://localhost:8001/health

# Test archive service  
curl http://localhost:8002/health

# Create test cell line
curl -X POST "http://localhost:8002/cell-lines/" \
  -H "Content-Type: application/json" \
  -d '{"CellLine_hpscreg_id": "TEST001", "CellLine_cell_line_type": "hiPSC"}'
```

### Frontend
```bash
cd services/frontend/my-app/
npm test
```

### Test Documentation Style

When writing tests, document them using Given-When-Then format in docstrings:

```python
def test_example(self, fixture_data):
    """
    Brief description of what the test does.

    - Given: initial condition or setup
    - When: action being tested
    - Then: expected outcome
    """
```

These docstrings are automatically rendered in the mkdocs documentation. Keep test documentation in the code, not in separate markdown files. Use `./serve-docs.sh` to view the auto-generated test documentation.

## Performance Considerations

- **File Storage**: No database overhead, simple JSON persistence
- **Microservices**: Independent scaling and development
- **Background Tasks**: Non-blocking AI operations via Celery
- **Version Control**: Automatic cleanup prevents storage bloat
- **Container Volumes**: Persistent data storage across container restarts

## Development Workflow

### TDD-Based Feature Development

When developing new features or functionality, follow this test-driven development workflow:

1. **Requirements Gathering**
   - Have an intelligent conversation about the feature requirements
   - Clarify scope, constraints, and acceptance criteria
   - **Always consider only the minimal implementation** based on requirements

2. **Feature Specification**
   - Create a spec sheet in `documentation/docs/features/`
   - Document the minimal feature design that satisfies requirements
   - Keep it simple - avoid overengineering at all costs

3. **Test Coverage Planning**
   - Establish comprehensive test coverage for the spec
   - Define test cases using Given-When-Then format
   - Ensure tests cover all acceptance criteria

4. **Write Tests First**
   - Implement tests based on the coverage plan
   - Tests should fail initially (red state)
   - Document tests with Given-When-Then docstrings

5. **Implementation Phase**
   - Implement the minimal solution to pass tests
   - Work iteratively to green light all test coverage
   - Refactor only when necessary and tests are green

**Design Philosophy**: Keep it simple. Overengineering should be avoided at all costs. If there's a simpler way to achieve the requirement, choose that path.

### Bug Fixing Workflow

When addressing bugs, focus on root cause analysis and systemic issues:

1. **Bug Investigation**
   - Reproduce the bug reliably
   - Understand the expected vs actual behavior
   - Gather relevant logs, error messages, and context

2. **Root Cause Analysis**
   - Identify the immediate cause of the bug
   - Look for underlying system design flaws contributing to the issue
   - Consider whether the bug indicates a broader architectural problem

3. **Solution Design**
   - Determine the minimal fix that addresses the root cause
   - If system design flaws exist, discuss whether they should be addressed now or separately
   - Avoid band-aid solutions that hide deeper problems

4. **Write Regression Test**
   - Create a test that reproduces the bug (should fail before fix)
   - Document with Given-When-Then format
   - Ensure the test will catch this bug if it reappears

5. **Fix Implementation**
   - Implement the minimal fix to pass the regression test
   - Address any identified system design issues if appropriate
   - Verify the fix doesn't break existing functionality

6. **Verification**
   - All tests pass (including the new regression test)
   - Bug is resolved in the actual system
   - No new issues introduced

### Day-to-Day Development

1. **Start Services**: Use `./start.sh` for full stack development
2. **Service Development**: Individual services can be run locally for faster iteration
3. **API Testing**: Use FastAPI auto-generated docs at `/docs` endpoints
4. **Frontend Development**: Hot reload available via Next.js dev server
5. **Background Tasks**: Monitor Celery worker for long-running operations
6. **Documentation**: Use `./serve-docs.sh` to view mkdocs documentation

## Important Notes

- **No Database**: This architecture uses file-based storage instead of PostgreSQL
- **No Transcription**: AWS Textract integration has been removed for simplicity
- **Simplified Models**: Pydantic models are used instead of Django ORM
- **Version Control**: File-based versioning with automatic cleanup
- **AI Integration**: OpenAI GPT-4 for cell line metadata extraction

## Migration from Django

This microservices architecture replaces the previous Django + PostgreSQL setup with:
- ✅ **Simpler**: File storage instead of database migrations
- ✅ **Faster**: Independent service development and deployment
- ✅ **Cleaner**: Focused microservices with clear responsibilities
- ✅ **Maintainable**: Reduced complexity and dependencies