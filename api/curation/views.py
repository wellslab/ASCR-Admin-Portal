from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import TranscribedArticle, CellLineTemplate
from ..serializers import TranscribedArticleSerializer, CellLineTemplateSerializer
from ..tasks import bulk_curate_articles_task, curate_article_task
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
        articles = TranscribedArticle.objects.filter(id__in=article_ids)
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

    @action(detail=True, methods=['post'])
    def retry(self, request, pk=None):
        """
        Endpoint: POST /api/curation/retry/{article_id}/
        Retry curation for a failed article.
        """
        article = get_object_or_404(TranscribedArticle, pk=pk)
        
        if article.curation_status != 'failed':
            return Response(
                {'error': 'Only failed articles can be retried'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Immediately set status to processing for better UX
        article.start_curation()
        
        # Start the curation task for this article
        task_result = curate_article_task.delay(article.id)
        
        return Response({
            'status': 'queued',
            'task_id': task_result.id,
            'article_id': article.id,
            'message': 'Curation retry started successfully'
        })
    
    @action(detail=False, methods=['get'])
    def status(self, request):
        """
        Endpoint: GET /api/curation/status/
        Get current curation status for all articles.
        """
        articles = TranscribedArticle.objects.all().order_by('-modified_on')
        serializer = TranscribedArticleSerializer(articles, many=True)
        
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
        article = get_object_or_404(TranscribedArticle, pk=pk)
        
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
        articles = TranscribedArticle.objects.all().order_by('-created_on')
        serializer = TranscribedArticleSerializer(articles, many=True)
        
        return Response({
            'articles': serializer.data,
            'count': articles.count()
        })
    
    @action(detail=True, methods=['get'], url_path='celllines')
    def get_article_celllines(self, request, pk=None):
        """
        Endpoint: GET /api/curation/{article_id}/celllines/
        Get cell lines curated from specific article.
        """
        article = get_object_or_404(TranscribedArticle, pk=pk)
        
        # Get cell lines linked to this article via source_article field
        cell_lines = article.curated_cell_lines.all().order_by('-created_on')
        serializer = CellLineTemplateSerializer(cell_lines, many=True)
        
        return Response({
            'article_id': article.id,
            'article_pubmed_id': article.pubmed_id,
            'cell_lines': serializer.data,
            'count': cell_lines.count()
        })
    
    @action(detail=False, methods=['put'], url_path='celllines/(?P<cellline_id>[^/.]+)')
    def save_cellline(self, request, cellline_id=None):
        """
        Endpoint: PUT /api/curation/celllines/{cellline_id}/
        Save edited cell line data with duplicate handling.
        """
        try:
            cell_line = CellLineTemplate.objects.get(CellLine_hpscreg_id=cellline_id)
        except CellLineTemplate.DoesNotExist:
            return Response(
                {'error': f'Cell line {cellline_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if this is a duplicate CellLine_hpscreg_id update
        new_hpscreg_id = request.data.get('CellLine_hpscreg_id', cellline_id)
        force_replace = request.data.get('force_replace', False)
        
        if new_hpscreg_id != cellline_id:
            existing_duplicate = CellLineTemplate.objects.filter(CellLine_hpscreg_id=new_hpscreg_id).first()
            
            if existing_duplicate and not force_replace:
                # Show duplicate dialog
                return Response(
                    {
                        'error': 'duplicate_id',
                        'message': f'Cell line with ID {new_hpscreg_id} already exists',
                        'existing_id': new_hpscreg_id,
                        'current_id': cellline_id
                    },
                    status=status.HTTP_409_CONFLICT
                )
            elif existing_duplicate and force_replace:
                # Delete the existing duplicate and update current record
                existing_duplicate.delete()
        
        # Update the cell line with new data (remove force_replace from data)
        update_data = {k: v for k, v in request.data.items() if k != 'force_replace'}
        serializer = CellLineTemplateSerializer(cell_line, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Cell line updated successfully',
                'cell_line': serializer.data
            })
        else:
            return Response(
                {'error': 'validation_failed', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
