# ASCR Web Services Project

## Project Overview
The Australian Stem Cell Registry (ASCR) is a national registry for stem cells generated and maintained in Australia. Researchers can consult the registry to retrieve up to date and carefully curated data about stem cell lines. The registered stem cell metadata is curated manually however recent efforts have been made to test AI assisted curation workflows where AI models are given a schema and are asked to read stem cell literature articles and for each cell line mentioned in the article, retrieve a set of metadata for the cell line. This project aims to provide the software infrastructure and administratiive processes that support the ASCR's activities.

Specifically, this is the project codebase for the ASCR AdminPortal application, which is a web interface used by the principal curator for their curation activities.


## Architecture & Technology Stack
The project follows a microservices architecture with:

### Core Infrastructure
- **Backend**: Django 5.0.2 + Django REST Framework 3.14.0
- **Frontend**: Next.js 15.3.4 + React 19.0.0 + TypeScript 5
- **Database**: PostgreSQL with psycopg2-binary
- **Task Queue**: Celery 5.3.6 + Redis 5.0.1
- **Containerization**: Docker + Docker Compose

### AI & Processing Services
- **OpenAI GPT-4o**: Intelligent table extraction and document analysis
- **AWS Textract**: OCR and document layout analysis
- **Image Processing**: Pillow, pdf2image

### Frontend Technologies
- **Styling**: Tailwind CSS 4.0 + Preline 3.1.0 UI components
- **File Upload**: FilePond (react-filepond)
- **Development**: Turbopack for hot reload

## Application Modules

### 1. Document Transcription (`api/transcription/`)
AI-powered extraction of text and tables from PDFs using dual AI approach (GPT-4o + Textract). Converts PDFs to images, processes with both services, and combines results with real-time status tracking.

### 2. Content Curation (`api/curation/`)
AI-assisted curation system for bulk processing of transcription records through OpenAI API integration. Supports up to 20 concurrent curation requests with background processing capabilities. Features real-time status updates, comprehensive error handling, and cell line browser integration with curation source filtering.

### 3. Editor & Ontologies (`api/editor/`, `api/ontologies/`)
Content editing capabilities and scientific ontology/controlled vocabulary management.

### 4. Frontend Interface (`api/front-end/my-app/`)
Modern React dashboard with sidebar navigation, drag-and-drop upload, real-time records table, and live status monitoring with 3-second polling intervals.

## Data Models
- **Article**: Main document entity with filename, timestamps, pubmed_id, transcription_content, and status tracking (transcription_status, curation_status, is_curated)
- **CellLineTemplate**: Curated content with hpscreg_id reference

## Document Processing Pipeline
1. **Upload**: PDF documents via web interface
2. **Transcription**: Asynchronous processing using both GPT-4o and Textract
3. **Status Tracking**: Real-time dashboard updates
4. **Curation**: AI-assisted curation using OpenAI GPT-4o with structured output parsing
5. **Cell Line Creation**: Automatic generation of CellLineTemplate records with LLM curation source
6. **Export**: Finalized content for downstream use

## Development & Deployment
- **Local Development**: Docker Compose with hot reload, volume mounting, and .env configuration
- **Async Processing**: Celery workers for long-running tasks, Celery Beat for scheduling
- **AI Integration**: OpenAI GPT-4o API with structured output parsing for curation
- **API Design**: RESTful with ViewSet patterns, modular URL routing, and health check endpoints
- **Security**: Environment-based configuration, API key management, CORS setup, and Django security middleware

This platform combines modern web technologies with advanced AI capabilities for sophisticated academic and scientific content management.
