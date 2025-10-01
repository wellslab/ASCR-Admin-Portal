# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the ASCR (Australian Stem Cell Registry) Web Services application - a Django-based system with a Next.js frontend for managing cell line data, article transcription, and AI-powered curation workflows. The system supports PDF document processing, cell line metadata extraction using OpenAI, and comprehensive data management with version control.

## Development Commands

### Backend (Django)

```bash
# Run the development server
python manage.py runserver

# Run database migrations
python manage.py migrate

# Create new migrations
python manage.py makemigrations

# Run tests
python manage.py test

# Load cell line data
python manage.py load_celllines

# Cleanup old versions
python manage.py cleanup_old_versions

# Django shell
python manage.py shell
```

### Frontend (Next.js)

```bash
# Development server
cd api/front-end/my-app
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Docker Development

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Run migrations in container
docker-compose exec web python manage.py migrate

# View logs
docker-compose logs -f web
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### Celery Task Queue

```bash
# Start Celery worker
celery -A config worker -l INFO

# Start Celery beat scheduler
celery -A config beat -l INFO

# Monitor tasks
celery -A config events
```

## Architecture Overview

### Core Applications

- **api**: Main Django app containing models and core API endpoints
- **api.transcription**: PDF transcription service using AWS Textract  
- **api.curation**: AI-powered curation using OpenAI for cell line metadata extraction
- **api.editor**: Advanced cell line editor with version control and diff capabilities
- **api.ontologies**: Ontology management services

### Key Models

- **CellLineTemplate**: Core model storing cell line metadata with extensive fields covering genomic alterations, characterization, and ethics
- **TranscribedArticle**: Manages PDF transcription and curation workflow states
- **CellLineVersion**: Version control system for tracking cell line changes
- **Article**: Legacy model for article processing (being phased out)

### Frontend Architecture

- **Next.js 15** with TypeScript and Tailwind CSS
- **Component Structure**:
  - `tools/curation/`: Curation workflow components with real-time polling
  - `tools/editor/`: Advanced cell line editor with diff visualization
  - `tools/transcription/`: PDF transcription interface
- **Key Features**: Performance optimization, virtualization for large datasets, comprehensive error handling

## Data Flow

1. **Document Upload**: PDFs uploaded through frontend
2. **Transcription**: AWS Textract extracts text content
3. **AI Curation**: OpenAI processes transcription to extract structured cell line data
4. **Manual Review**: Users review and edit extracted data using advanced editor
5. **Version Control**: Changes tracked with automatic versioning system

## Environment Configuration

Required environment variables:

```bash
# Database
DATABASE_URL=postgres://postgres:postgres@db:5432/postgres

# Redis
REDIS_URL=redis://redis:6379/0

# API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_DEFAULT_REGION=us-east-1

# Django
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
```

## AI Integration

- **OpenAI Integration**: Uses GPT-4 with structured outputs for cell line data extraction
- **Curation Instructions**: Stored in `api/curation/instructions/` directory
- **Error Handling**: Comprehensive error tracking for AI service failures
- **Work Status Tracking**: Automatic status updates during curation process

## Testing

- **Backend Tests**: Located in `api/tests/`
- **Frontend Tests**: Located in `api/front-end/my-app/src/app/tools/curation/__tests__/`
- **Test Coverage**: Models, API endpoints, curation workflow, and frontend components

## Version Control & Collaboration

- **Cell Line Versioning**: Automatic version creation on edits with 10-version retention policy
- **Edit Locking**: Prevents concurrent edits with timeout mechanism  
- **Diff Visualization**: Advanced diff engine for comparing cell line versions

## Performance Considerations

- **Database**: PostgreSQL with appropriate indexing for version queries
- **Caching**: Redis for Celery task queue and caching
- **Frontend**: Virtualized components for large datasets, optimized polling
- **File Processing**: Chunked uploads and background processing for large PDFs

## Development Workflow

1. Use Docker Compose for consistent development environment
2. Run migrations after model changes
3. Test AI curation with sample articles in development
4. Frontend development uses hot reload via Next.js dev server
5. Celery required for background transcription and curation tasks

## API Structure

- **REST API**: Django REST Framework with ViewSets
- **Key Endpoints**:
  - `/api/transcribed-articles/` - Article management
  - `/api/editor/` - Cell line editing and version control
  - `/api/curation/` - AI curation workflows
  - `/api/transcription/` - PDF transcription services