import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Article, CellLineTemplate, TranscribedArticle
from .serializers import ArticleSerializer, CellLineTemplateSerializer, TranscribedArticleSerializer
from .tasks import celery_create_article

@api_view(['GET'])
def health_check(request):
    return Response({
        'status': 'healthy',
        'message': 'Gateway is running'
    })

class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Article operations
    """
    queryset = Article.objects.all().order_by('-created_on')  # Most recent first
    serializer_class = ArticleSerializer
    
    def list(self, request, *args, **kwargs):
        """
        List all articles, sorted by most recently created
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class TranscribedArticleViewSet(viewsets.ModelViewSet):
    """ViewSet for TranscribedArticle model"""
    queryset = TranscribedArticle.objects.all()
    serializer_class = TranscribedArticleSerializer
    
    @action(detail=True, methods=['patch'])
    def update_transcription(self, request, pk=None):
        """
        Endpoint to update transcription content for a specific record
        """
        try:
            record = self.get_object()
            new_content = request.data.get('transcription_content')
            
            if new_content is None:
                return Response(
                    {'message': 'transcription_content is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            record.transcription_content = new_content
            record.save()
            
            return Response({
                'message': 'Transcription updated successfully',
                'id': record.id,
                'filename': record.filename,
                'modified_on': record.modified_on
            }, status=status.HTTP_200_OK)
            
        except TranscribedArticle.DoesNotExist:
            return Response(
                {'message': 'Transcribed article not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'message': f'Error updating transcription: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    
    
    
                
                
        
        
        
        
                
    
    
    