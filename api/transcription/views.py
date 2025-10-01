from rest_framework import viewsets, status
from .models import TranscriptionRecord
from .transcription import run_transcription
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import TranscriptionRecordSerializer
from ..tasks import celery_create_article


class TranscriptionRecordViewSet(viewsets.ModelViewSet):
    queryset = TranscriptionRecord.objects.all()
    serializer_class = TranscriptionRecordSerializer
    
    # GET request to check if the transcription service is running
    @action(detail=False, methods=['get'])
    def health_check(self, request):
        return Response({"message": "Transcription service is running..."}, status=200)
    
    @action(detail=False, methods=['post'])
    def create_article(self, request):
        """
        Endpoint to receive articles from frontend and create transcription tasks
        """    
        try:
            if not request.FILES:
                return Response(
                    {'message': 'No files received'}, 
                    status=400
                )
                
            task_results = []
            
            for file_key in request.FILES:
                files = request.FILES.getlist(file_key)
                
                for uploaded_file in files:
                    file_content = uploaded_file.read()
                    pubmed_id = int(uploaded_file.name.split('.')[0])
                    
                    # Check for existing article with same PubMed ID BEFORE creating task
                    from ..models import TranscribedArticle
                    existing_article = TranscribedArticle.objects.filter(pubmed_id=pubmed_id).first()
                    
                    if existing_article:
                        # Duplicate detected - return 200 with error details for FilePond compatibility
                        return Response(
                            {
                                'success': False,
                                'error_type': 'duplicate',
                                'message': f'Article with PubMed ID {pubmed_id} has already been transcribed.',
                                'pubmed_id': pubmed_id,
                                'existing_article_id': existing_article.id
                            }, 
                            status=200  # FilePond expects 200 for all responses
                        )
                    
                    try:
                        task = celery_create_article.delay(
                            uploaded_file.name,
                            file_content,
                            pubmed_id
                        )
                        
                        task_results.append({
                            'pubmed_id': pubmed_id,
                            'task_id': task.id,
                            'status': 'Queued',
                            'message': 'Article creation task queued...'
                        })
                    except Exception as e:
                        import traceback
                        error_details = traceback.format_exc()
                        return Response(
                            {
                                'message': f'Celery task creation error...\n{str(e)}',
                                'error_type': type(e).__name__,
                                'traceback': error_details
                            }, 
                            status=501
                        )
            
            
            
            
            return Response({
                'success': True,
                'message': f'Created {len(task_results)} articles... check database for transcription status',
                'results': task_results
            }, status=200)
        
        except Exception as e:
            return Response(
                {'message': f'Error creating articles...\n{str(e)}'}, 
                status=500
            )

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
            
        except TranscriptionRecord.DoesNotExist:
            return Response(
                {'message': 'Transcription record not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'message': f'Error updating transcription: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )