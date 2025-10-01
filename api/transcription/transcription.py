from django.http import JsonResponse
from django.conf import settings
from PIL import Image
from io import BytesIO
import base64
import os
from openai import OpenAI
from pdf2image import convert_from_bytes
import io
from textractprettyprinter.t_pretty_print import get_text_from_layout_json
from textractcaller.t_call import call_textract, Textract_Features


import logging

# Set up logger for this module
logger = logging.getLogger(__name__)


def gpt_transcribe(pdf_binary_data: bytes, output_path=None):
    """
    Extract tables from PDF binary data using GPT-4o
    Args:
        pdf_binary_data: bytes - PDF binary data
    Raises:
        Exception: If any image fails to be processed
    """
    
    logger.info("Starting GPT transcription process")
    
    try:
        # Gets the images of the pdf using pdf2image from binary data
        images = convert_from_bytes(pdf_binary_data)
        logger.info(f"Successfully converted PDF to {len(images)} images")
    except Exception as e:
        logger.error(f"Failed to convert PDF to images: {e}")
        raise
    
    output_string = ""
    for i, image in enumerate(images):
        logger.debug(f"Processing image {i+1}/{len(images)}")
        
        try:
            # Convert PIL Image to base64
            buffered = BytesIO()
            image.save(buffered, format="PNG", quality=100)  
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            logger.debug(f"Converted image {i+1} to base64 format")
            
            # Create OpenAI client with API key from settings
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            # Send the image to GPT-4
            logger.info(f"Sending image {i+1} to GPT-4o for table extraction")
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user", 
                        "content": [
                            {
                                "type": "text", 
                                "text": """Extract only the tables from the given image of a pdf page and output them in JSON format.
                                You can ignore data that might be in figures or other non-table data."""
                            },
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{img_str}"},
                            }
                        ]
                    }
                ],
                max_tokens=4096,
                temperature=0.0
            )

            # Extract the response text
            output_string += response.choices[0].message.content + "\n\n"
            logger.info(f"Successfully processed image {i+1} with GPT-4o")
            
        except Exception as e:
            logger.error(f"Critical error processing image {i+1} with GPT-4o: {e}")
            logger.error("Aborting transcription.")
            raise Exception(f"GPT transcription failed on image {i+1}: {e}")

    logger.info("COMPLETE: GPT TRANSCRIPTION.")
    return output_string
    
    
def textract_transcribe(pdf_binary_data: bytes, output_path=None):
    """
    Extract text from PDF binary data using Amazon Textract
    Args:
        pdf_binary_data: bytes - PDF binary data
    Raises:
        Exception: If any image fails to be processed
    """
    
    logger.info("Starting Textract transcription process")
    
    # Set AWS credentials from Django settings
    os.environ['AWS_ACCESS_KEY_ID'] = settings.AWS_ACCESS_KEY_ID
    os.environ['AWS_SECRET_ACCESS_KEY'] = settings.AWS_SECRET_ACCESS_KEY
    os.environ['AWS_DEFAULT_REGION'] = settings.AWS_DEFAULT_REGION
    
    try:
        # Convert PDF to images from binary data
        images = convert_from_bytes(pdf_binary_data)
        logger.info(f"Successfully converted PDF to {len(images)} images for Textract")
    except Exception as e:
        logger.error(f"Failed to convert PDF to images for Textract: {e}")
        raise

    output_string = ""
    # Call Amazon Textract for each image in the pdf
    for i, image in enumerate(images):
        logger.debug(f"Processing image {i+1}/{len(images)} with Textract")
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        
        try: 
            logger.info(f"Sending image {i+1} to AWS Textract")
            # Add document layout configuration
            response = call_textract(
                input_document=img_byte_arr.getvalue(),
                features=[Textract_Features.LAYOUT]
            )
            
            # Get text with layout awareness
            layout = get_text_from_layout_json(response)  # Using layout-aware text extraction
            output_string += layout[1] + "\n\n"
            logger.info(f"Successfully processed image {i+1} with Textract")
            
        except Exception as e:
            logger.error(f"Critical error processing image {i+1} with AWS Textract: {e}")
            logger.error("Aborting transcription.")
            raise Exception(f"Textract transcription failed on image {i+1}: {e}")
            
    logger.info("COMPLETE: Textract transcription process.")
    return output_string


def run_transcription(article: bytes) -> str:
    """
    Run both GPT and Textract transcription on PDF binary data
    Args:
        article: bytes - PDF binary data
    Raises:
        Exception: If any part of the transcription process fails
    """
    
    logger.info("Starting integrated transcription process (GPT + Textract)")
    
    try:
        gpt_results = gpt_transcribe(article)
        textract_results = textract_transcribe(article)
        integrated_results = textract_results + "\n\n # TABLES #\n\n" + gpt_results
        
        logger.info("Successfully completed integrated transcription process")        
        return integrated_results
        
    except Exception as e:
        logger.error(f"TRANSCRIPTION FAILED: {e}")
        raise


