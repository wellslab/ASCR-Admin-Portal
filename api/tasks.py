from celery import shared_task
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.utils import timezone
from .models import TranscribedArticle, CellLineTemplate
from .transcription import run_transcription
import logging
logger = logging.getLogger(__name__)

@shared_task(bind=True)
def celery_create_article(self, file_name, file_content, pubmed_id):
    """
    Celery task to process an uploaded article file.
    Args:
        file_name (str): Name of the uploaded file
        file_content (bytes): Content of the file
        file_content_type (str): MIME type of the file
    
    Returns:
        dict: Task result with status and details
    """ 
    logger.info(f"Processing file: {file_name}")
    
    # Create the transcribed article record
    article = TranscribedArticle.objects.create(
        filename=file_name,
        pubmed_id=pubmed_id,
        transcription_status='pending',
        curation_status='pending'
    )
    
    # Start transcription process
    article.start_transcription()
    
    # Transcribe the file 
    try: 
        transcription_response = run_transcription(file_content)
        
        # Update the article with the transcription status
        article.complete_transcription(transcription_response)
        
    except Exception as e:
        # Update the article status to failed
        article.fail_transcription(str(e))
        
        return {
            'status': '500',
            'pubmed_id': pubmed_id,
            'message': 'TRANSCRIPTION FAILED: Check web container logs for more details.'
        }
    
    return {
        'status': '200',
        'filename': file_name,
        'article_id': article.id,
        'message': 'SUCCESS: Article created and transcribed successfully!'
    }


@shared_task
def curate_article_task(article_id):
    """
    Celery task for processing article curation.
    
    Args:
        article_id (int): ID of the article to curate
        
    Returns:
        dict: Task result with status and data
    """
    try:
        article = TranscribedArticle.objects.get(id=article_id)
        article.start_curation()
        
        # Use OpenAI curation function
        from .curation.curate import curate_article_with_openai
        import json
        
        curation_results_json_list = curate_article_with_openai(article.transcription_content)  # Returns List[str]
        created_cell_lines = []
        
        for curation_json in curation_results_json_list:
            curation_result = json.loads(curation_json)  # Parse individual JSON string
            
            cell_line_template, created = CellLineTemplate.objects.update_or_create(
                CellLine_hpscreg_id=curation_result.get('CellLine_hpscreg_id'),
                defaults={
                    **curation_result,
                    'curation_source': 'LLM',
                    'work_status': 'in progress',
                    'source_article': article  # Link back to source article
                }
            )
            created_cell_lines.append({
                'cell_line_id': cell_line_template.CellLine_hpscreg_id,
                'created': created
            })
        
        # Mark article as successfully curated
        article.complete_curation()
        
        return {
            'status': 'success',
            'article_id': article_id,
            'cell_lines': created_cell_lines,
            'total_found': len(created_cell_lines)
        }
        
    except Exception as exc:
        logger.error(f"Curation failed for article {article_id}: {str(exc)}")
        
        try:
            article = TranscribedArticle.objects.get(id=article_id)
            article.fail_curation(str(exc))
        except TranscribedArticle.DoesNotExist:
            pass
        
        return {
            'status': 'failed',
            'article_id': article_id,
            'error': str(exc)
        }


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



    
        
        