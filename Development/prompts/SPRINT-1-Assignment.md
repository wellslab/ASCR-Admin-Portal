# SPRINT-1: Backend Foundation - Complete Infrastructure Setup

## Sprint Overview
**Sprint**: 1 (Backend Foundation)
**Duration**: 8-10 hours
**Dependencies**: None
**Priority**: High - Foundation for entire CurationApp system

## Objective
Establish complete backend infrastructure for the CurationApp including data models, Celery task processing, and API endpoints. This sprint creates the foundation for AI-assisted curation workflow supporting up to 20 concurrent requests.

## Context
The ASCR AdminPortal currently has an `Article` model that represents transcription records. The CurationApp will process these articles through an AI-assisted curation workflow via OpenAI API, generating `CellLineTemplate` records with proper status tracking and error handling.

**Key Notes**:
- The `Article` model will be renamed to `TranscriptionRecord` in future refactoring (post-CurationApp)
- Work with existing `Article` model name for now
- User will provide OpenAI curation function after infrastructure is complete
- Focus on complete backend infrastructure setup

## Sprint Requirements

### 1. Data Model Updates

#### 1.1 CellLineTemplate Model Enhancement
**File**: `api/models.py`

Add curation source tracking field:
```python
# Curation source tracking
curation_source = models.CharField(
    max_length=50,
    choices=[
        ('hpscreg', 'HPSCREG'),
        ('LLM', 'LLM Generated'),
        ('institution', 'Institution'),
        ('manual', 'Manual Entry'),
    ],
    default='manual',
    blank=True
)
```

#### 1.2 Article Model Enhancement
**File**: `api/models.py`

Add curation processing fields:
```python
# Curation error tracking
curation_error = models.TextField(blank=True, null=True)

# Curation processing timestamp
curation_started_at = models.DateTimeField(null=True, blank=True)
```

Add helper methods:
```python
def start_curation(self):
    """Mark article as starting curation process"""
    self.curation_status = 'processing'
    self.curation_started_at = timezone.now()
    self.curation_error = None
    self.save()

def complete_curation(self):
    """Mark article as successfully curated"""
    self.curation_status = 'completed'
    self.curation_started_at = None
    self.curation_error = None
    self.save()

def fail_curation(self, error_message):
    """Mark article as failed curation with error"""
    self.curation_status = 'failed'
    self.curation_started_at = None
    self.curation_error = error_message
    self.save()
```

### 2. Celery Task Infrastructure

#### 2.1 Curation Task Implementation
**File**: `api/tasks.py`

Create comprehensive curation task:
```python
from celery import shared_task
from django.utils import timezone
from .models import Article, CellLineTemplate
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def curate_article_task(self, article_id):
    """
    Celery task for processing article curation.
    
    Args:
        article_id (int): ID of the article to curate
        
    Returns:
        dict: Task result with status and data
    """
    try:
        article = Article.objects.get(id=article_id)
        article.start_curation()
        
        # Placeholder for OpenAI curation function
        # This will be replaced with actual curation logic
        curation_result = mock_curation_function(article.transcription_content)
        
        # Create or update CellLineTemplate record
        cell_line_template, created = CellLineTemplate.objects.update_or_create(
            CellLine_hpscreg_id=curation_result.get('CellLine_hpscreg_id'),
            defaults={
                **curation_result,
                'curation_source': 'LLM'
            }
        )
        
        # Link to curation object
        article.curation_object = cell_line_template.curation_object
        article.complete_curation()
        
        return {
            'status': 'success',
            'article_id': article_id,
            'cell_line_id': cell_line_template.CellLine_hpscreg_id,
            'created': created
        }
        
    except Exception as exc:
        logger.error(f"Curation failed for article {article_id}: {str(exc)}")
        
        try:
            article = Article.objects.get(id=article_id)
            article.fail_curation(str(exc))
        except Article.DoesNotExist:
            pass
        
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60, exc=exc)
        
        return {
            'status': 'failed',
            'article_id': article_id,
            'error': str(exc)
        }

def mock_curation_function(transcription_content):
    """
    Mock curation function placeholder.
    Will be replaced with actual OpenAI integration.
    """
    import uuid
    return {
        'CellLine_hpscreg_id': f'MOCK-{uuid.uuid4().hex[:8]}',
        'CellLine_source_cell_type': 'Induced Pluripotent Stem Cell',
        'CellLine_source_tissue': 'Dermal Fibroblast',
        'CellLine_source': 'Research Institution',
        'CellLine_frozen': False,
        # Add other required fields with mock data
    }
```

#### 2.2 Bulk Processing Task
**File**: `api/tasks.py`

Add bulk curation management:
```python
@shared_task
def bulk_curate_articles_task(article_ids):
    """
    Celery task for managing bulk curation requests.
    
    Args:
        article_ids (list): List of article IDs to curate
        
    Returns:
        dict: Bulk operation result
    """
    results = []
    
    for article_id in article_ids:
        task_result = curate_article_task.delay(article_id)
        results.append({
            'article_id': article_id,
            'task_id': task_result.id
        })
    
    return {
        'status': 'queued',
        'total_articles': len(article_ids),
        'task_results': results
    }
```

### 3. API Endpoints Implementation

#### 3.1 Curation Views
**File**: `api/curation/views.py`

Create comprehensive API endpoints:
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Article, CellLineTemplate
from ..serializers import ArticleSerializer, CellLineTemplateSerializer
from ..tasks import bulk_curate_articles_task
from celery.result import AsyncResult

class CurationViewSet(viewsets.ViewSet):
    """
    ViewSet for handling curation operations.
    """
    
    @action(detail=False, methods=['post'])
    def bulk_curate(self, request):
        """
        Endpoint: POST /api/curation/bulk/
        Start bulk curation process for selected articles.
        """
        article_ids = request.data.get('article_ids', [])
        
        if not article_ids:
            return Response(
                {'error': 'No article IDs provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(article_ids) > 20:
            return Response(
                {'error': 'Maximum 20 articles can be curated at once'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate all articles exist and are not already processing
        articles = Article.objects.filter(id__in=article_ids)
        if articles.count() != len(article_ids):
            return Response(
                {'error': 'Some articles not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        processing_articles = articles.filter(curation_status='processing')
        if processing_articles.exists():
            return Response(
                {'error': 'Some articles are already being processed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Start bulk curation task
        task_result = bulk_curate_articles_task.delay(article_ids)
        
        return Response({
            'status': 'queued',
            'task_id': task_result.id,
            'article_count': len(article_ids),
            'message': 'Bulk curation started successfully'
        })
    
    @action(detail=False, methods=['get'])
    def status(self, request):
        """
        Endpoint: GET /api/curation/status/
        Get current curation status for all articles.
        """
        articles = Article.objects.all().order_by('-modified_on')
        serializer = ArticleSerializer(articles, many=True)
        
        return Response({
            'articles': serializer.data,
            'total_count': articles.count(),
            'processing_count': articles.filter(curation_status='processing').count(),
            'completed_count': articles.filter(curation_status='completed').count(),
            'failed_count': articles.filter(curation_status='failed').count()
        })
    
    @action(detail=True, methods=['get'])
    def error_details(self, request, pk=None):
        """
        Endpoint: GET /api/curation/errors/{article_id}/
        Get error details for a specific article.
        """
        article = get_object_or_404(Article, pk=pk)
        
        if article.curation_status != 'failed':
            return Response(
                {'error': 'Article has not failed curation'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'article_id': article.id,
            'error_message': article.curation_error,
            'curation_status': article.curation_status,
            'failed_at': article.modified_on
        })
    
    @action(detail=False, methods=['get'])
    def articles(self, request):
        """
        Endpoint: GET /api/curation/articles/
        Get all articles with curation-specific fields.
        """
        articles = Article.objects.all().order_by('-created_on')
        serializer = ArticleSerializer(articles, many=True)
        
        return Response({
            'articles': serializer.data,
            'count': articles.count()
        })
```

#### 3.2 URL Configuration
**File**: `api/curation/urls.py`

Set up URL routing:
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'curation', views.CurationViewSet, basename='curation')

urlpatterns = [
    path('api/', include(router.urls)),
]
```

### 4. Serializer Updates

#### 4.1 Enhanced Serializers
**File**: `api/serializers.py`

Create or update serializers:
```python
from rest_framework import serializers
from .models import Article, CellLineTemplate

class ArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for Article model with curation fields.
    """
    approximate_tokens = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'filename', 'pubmed_id', 'created_on', 'modified_on',
            'curation_status', 'curation_error', 'curation_started_at',
            'transcription_status', 'is_curated', 'approximate_tokens'
        ]
        read_only_fields = ['id', 'created_on', 'modified_on']
    
    def get_approximate_tokens(self, obj):
        """
        Calculate approximate token count for transcription content.
        """
        if obj.transcription_content:
            return len(obj.transcription_content.split()) // 0.75  # Rough estimate
        return 0

class CellLineTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for CellLineTemplate model with curation source.
    """
    class Meta:
        model = CellLineTemplate
        fields = '__all__'
        read_only_fields = ['created_on', 'modified_on']
```

### 5. Database Migration

#### 5.1 Migration Creation
Run Django migration commands:
```bash
python manage.py makemigrations
python manage.py migrate
```

## Testing Requirements

### 5.1 Model Tests
**File**: `api/tests/test_models.py`

Create comprehensive model tests:
```python
from django.test import TestCase
from django.utils import timezone
from ..models import Article, CellLineTemplate

class ArticleModelTest(TestCase):
    def setUp(self):
        self.article = Article.objects.create(
            filename='test.pdf',
            transcription_content='Test content',
            pubmed_id=12345
        )
    
    def test_start_curation(self):
        self.article.start_curation()
        self.assertEqual(self.article.curation_status, 'processing')
        self.assertIsNotNone(self.article.curation_started_at)
        self.assertIsNone(self.article.curation_error)
    
    def test_complete_curation(self):
        self.article.start_curation()
        self.article.complete_curation()
        self.assertEqual(self.article.curation_status, 'completed')
        self.assertIsNone(self.article.curation_started_at)
        self.assertIsNone(self.article.curation_error)
    
    def test_fail_curation(self):
        error_message = 'Test error'
        self.article.fail_curation(error_message)
        self.assertEqual(self.article.curation_status, 'failed')
        self.assertEqual(self.article.curation_error, error_message)
        self.assertIsNone(self.article.curation_started_at)
```

### 5.2 API Tests
**File**: `api/tests/test_curation_api.py`

Create API endpoint tests:
```python
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Article

class CurationAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.article = Article.objects.create(
            filename='test.pdf',
            transcription_content='Test content'
        )
    
    def test_bulk_curate_endpoint(self):
        response = self.client.post('/api/curation/bulk/', {
            'article_ids': [self.article.id]
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'queued')
    
    def test_status_endpoint(self):
        response = self.client.get('/api/curation/status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('articles', response.data)
```

## Integration Points

### Dependencies Created
This sprint enables:
- **Sprint 2**: Frontend Foundation (requires API endpoints and serializers)
- **Sprint 3**: Core Integration (requires Celery tasks and status management)
- **Sprint 4**: Integration & Polish (requires curation_source field)

### API Compatibility
Maintain compatibility with:
- Existing transcription workflow
- Current article listing functionality
- Cell line browser operations

## Deliverables Checklist

### 1. Data Models
- [ ] CellLineTemplate model updated with curation_source field
- [ ] Article model updated with curation_error and curation_started_at fields
- [ ] Helper methods added to Article model
- [ ] Django migrations created and tested

### 2. Celery Infrastructure
- [ ] Individual curation task implemented
- [ ] Bulk curation task implemented
- [ ] Error handling and retry logic configured
- [ ] Mock curation function placeholder created

### 3. API Endpoints
- [ ] Bulk curation endpoint (POST /api/curation/bulk/)
- [ ] Status polling endpoint (GET /api/curation/status/)
- [ ] Error details endpoint (GET /api/curation/errors/{id}/)
- [ ] Articles listing endpoint (GET /api/curation/articles/)
- [ ] Input validation and rate limiting implemented

### 4. Serializers & Tests
- [ ] Updated ArticleSerializer with curation fields
- [ ] Updated CellLineTemplateSerializer with curation_source
- [ ] Comprehensive model tests
- [ ] API endpoint tests
- [ ] Integration tests

## Success Criteria
- [ ] All data models updated with new fields
- [ ] Celery tasks handle curation workflow
- [ ] API endpoints functional and tested
- [ ] Serializers include all required fields
- [ ] Migrations run successfully
- [ ] Tests pass with >90% coverage
- [ ] No breaking changes to existing functionality
- [ ] Ready for Sprint 2 frontend integration

## Notes for Implementation
- Use `timezone.now()` for timestamp fields
- Follow existing code patterns and conventions
- Implement proper error handling throughout
- Create comprehensive logging for debugging
- Test all endpoints with realistic data
- Consider adding database indexes for performance

## Completion Report Requirements
After completing this sprint, provide a comprehensive report including:
1. Summary of all changes made
2. Migration details and any issues encountered
3. Testing results and coverage metrics
4. API endpoint documentation
5. Performance considerations and optimizations
6. Integration notes for Sprint 2
7. Any deviations from the original plan

**File**: `documents/features/CurationApp/SPRINT-1-Completion-Report.md` 