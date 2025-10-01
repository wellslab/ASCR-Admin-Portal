import logging
import json
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Log request method
        logger.info(f"Request: {request.method}")
        
        # Log uploaded files
        if request.FILES:
            files_info = {}
            for key, file_list in request.FILES.lists():
                files_info[key] = [f.name for f in file_list]
            logger.info(f"Files: {files_info}")
        
        return None
    
    def process_response(self, request, response):
        # Log response code
        logger.info(f"Response Code: {response.status_code}")
        
        # Log response body
        try:
            if hasattr(response, 'content') and response.content:
                # Try to parse as JSON for better formatting
                try:
                    content = json.loads(response.content.decode('utf-8'))
                    logger.info(f"Response Body: {content}")
                except:
                    logger.info(f"Response Body: {response.content.decode('utf-8')}")
        except:
            logger.info(f"Response Body: [Unable to decode]")
        
        return response 