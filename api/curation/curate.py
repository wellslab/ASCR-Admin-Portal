import os
import json
from openai import OpenAI
from typing import List
from ..models import CellLineTemplatePydantic

def load_curation_instructions(instructions_directory: str = 'api/curation/instructions') -> str:
    """Load and combine all instruction files."""
    if not os.path.exists(instructions_directory):
        raise FileNotFoundError(f"Curation instructions directory not found: {instructions_directory}. Please ensure the instructions directory exists and contains curation instruction files.")
    
    instructions = []
    for filename in sorted(os.listdir(instructions_directory)):
        file_path = os.path.join(instructions_directory, filename)
        if os.path.isfile(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if content:  # Only add non-empty files
                    instructions.append(content)
    
    return "\n\n".join(instructions) + "\n\n" if instructions else ""



def find_cell_lines_in_article(transcription_content: str) -> list[str]:
    """
    Find cell lines in the article transcription content.
    
    Args:
        transcription_content (str): The article transcription text to search for cell lines
        
    Returns:
        list[str]: A list of cell line names found in the article
    """
    
    # Initialize OpenAI client
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # Ask OpenAI to find cell lines in the article
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """You are an expert stem cell researcher. 
             You are given a transcription of a research article taken from the stem cell literature where the experimenters have generated at least one stem cell line.
             The article should contain the generation details of the stem cell line.
             Your task is to return a python list of all the unique stem cell lines mentioned in the article.
             Return the result as a JSON array of strings, for example: ["Cell_Line_1", "Cell_Line_2"]
             You do not need to return ANY other information. Just the names. Do not include any other commentary.
             If the article is from the journal Stem Cell Research, there will be a Resource Table, and the field called unique identifier contains these the correct identifiers.
             If the article not from the journal Stem Cell Research, you will need to read the article and figure out the names of the stem cell lines mentioned in the article.
             """},
            {"role": "user", "content": transcription_content}
        ],
        temperature=0
    )
    
    # Parse the JSON response
    import json
    try:
        cell_lines = json.loads(response.choices[0].message.content)
        return cell_lines if isinstance(cell_lines, list) else []
    except json.JSONDecodeError:
        # Fallback: try to extract from text response
        content = response.choices[0].message.content.strip()
        if content.startswith('[') and content.endswith(']'):
            try:
                return json.loads(content)
            except:
                pass
        return []


def extract_cell_line_metadata(cell_line: str, instructions: str, transcription_content: str) -> str:
    
    # Initialize OpenAI client
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # Send request to OpenAI using chat completions
    response = client.chat.completions.create(
        model="gpt-4o",  
        messages=[
            {
                "role": "system",
                "content": f"""** Curation Instructions **\n{instructions}\n\n** Article **\n{transcription_content}\n\n

You are extracting metadata for the cell line: {cell_line}

Please extract cell line metadata and return it as a valid JSON object that matches the CellLineTemplate schema. 
Make sure all required fields are populated based on the article content."""
            },
            {
                "role": "user",
                "content": f"Read the article and extract metadata for cell line '{cell_line}'. Return the data as a JSON object that matches the CellLineTemplate schema."
            }
        ],
        temperature=0
    )
    
    # Extract and clean the JSON content from OpenAI response
    content = response.choices[0].message.content
    
    # Remove markdown code block formatting if present
    if content.startswith('```json'):
        content = content[7:]  # Remove '```json'
    if content.endswith('```'):
        content = content[:-3]  # Remove '```'
    
    # Return the cleaned JSON string
    return content.strip()


def curate_article_with_openai(transcription_content: str) -> List[str]:
    """
    Main curation function that sends transcription content to OpenAI and returns structured cell line data.
    
    Args:
        transcription_content (str): The article transcription text to curate
        
    Returns:
        str: Cell line metadata as a JSON string mapping to CellLineTemplate fields
    """
    try:
        # Load curation instructions
        instructions = load_curation_instructions()
        
        # Find cell lines in the article
        cell_lines = find_cell_lines_in_article(transcription_content)
        
        # Extract metadata for each cell line
        curation_results = []
        for cell_line in cell_lines:
            cell_line_metadata = extract_cell_line_metadata(cell_line, instructions, transcription_content)
            curation_results.append(cell_line_metadata)
            
        return curation_results
        
        
    except Exception as e:
        # Raise exception with OpenAI error details
        raise Exception(f"OpenAI curation error: {str(e)}")



