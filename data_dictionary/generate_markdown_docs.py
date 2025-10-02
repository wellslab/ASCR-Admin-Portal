"""
Generate business-friendly markdown documentation from Pydantic models.
This script parses the data_dictionary.py file and creates a comprehensive
markdown document with table of contents and cross-references.
"""

import ast
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime

def parse_field_info(field_node) -> Dict:
    """Parse a field definition from AST node to extract all information"""
    field_info = {
        'name': '',
        'type': '',
        'original_data_type': '',
        'description': '',
        'required': True,
        'default': None,
        'constraints': {},
        'is_foreign_key': False,
        'foreign_table': '',
        'is_primary_key': False,
        'is_ontology': False,
        'ontology_link': '',
        'reference_url': '',
        'enum_values': []
    }
    
    # Extract field name
    if hasattr(field_node, 'target') and field_node.target:
        field_info['name'] = field_node.target.id
    
    # Extract type annotation
    if hasattr(field_node, 'annotation'):
        field_info['type'] = ast.unparse(field_node.annotation)
        
        # Check if it's optional
        if 'Optional[' in field_info['type']:
            field_info['required'] = False
            
        # Check if it's a foreign key (non-quoted class name)
        if (not field_info['type'].startswith(('str', 'int', 'float', 'bool', 'date', 'Optional', 'Literal')) 
            and not field_info['type'].startswith('Optional[str') 
            and not field_info['type'].startswith('Optional[int')
            and not field_info['type'].startswith('Optional[float')
            and not field_info['type'].startswith('Optional[bool')
            and not field_info['type'].startswith('Optional[date')
            and not field_info['type'].startswith('Optional[Literal')):
            field_info['is_foreign_key'] = True
            # Extract foreign table name
            foreign_type = field_info['type'].replace('Optional[', '').replace(']', '')
            field_info['foreign_table'] = foreign_type
            
        # Extract enum values from Literal types
        if 'Literal[' in field_info['type']:
            literal_match = re.search(r'Literal\[(.*?)\]', field_info['type'])
            if literal_match:
                enum_str = literal_match.group(1)
                # Parse quoted values (handle both single and double quotes)
                enum_values = re.findall(r'["\']([^"\']*)["\']', enum_str)
                field_info['enum_values'] = enum_values
    
    # Extract Field() information
    if hasattr(field_node, 'value') and isinstance(field_node.value, ast.Call):
        if (isinstance(field_node.value.func, ast.Name) and 
            field_node.value.func.id == 'Field'):
            
            # Parse Field() arguments
            for keyword in field_node.value.keywords:
                if keyword.arg == 'description':
                    field_info['description'] = ast.literal_eval(keyword.value)
                elif keyword.arg == 'max_length':
                    field_info['constraints']['max_length'] = ast.literal_eval(keyword.value)
                elif keyword.arg == 'le':
                    field_info['constraints']['max_value'] = ast.literal_eval(keyword.value)
                elif keyword.arg == 'json_schema_extra':
                    # Parse json_schema_extra dict
                    if isinstance(keyword.value, ast.Dict):
                        for k, v in zip(keyword.value.keys, keyword.value.values):
                            key = ast.literal_eval(k)
                            value = ast.literal_eval(v)
                            
                            if key == 'primary_key' and value:
                                field_info['is_primary_key'] = True
                            elif key == 'ontology' and value:
                                field_info['is_ontology'] = True
                            elif key == 'ontology_link':
                                field_info['ontology_link'] = value
                            elif key == 'reference_url':
                                field_info['reference_url'] = value
    
    # Set default for optional fields
    if not field_info['required'] and not field_info['default']:
        field_info['default'] = 'None'
    
    return field_info

def parse_pydantic_models(file_path: str) -> Dict[str, Dict]:
    """Parse the Pydantic models file and extract all model information"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    tree = ast.parse(content)
    models = {}
    original_data_types = {}
    
    for node in ast.walk(tree):
        # Parse ORIGINAL_DATA_TYPES dictionary
        if isinstance(node, ast.Assign):
            if (len(node.targets) == 1 and 
                isinstance(node.targets[0], ast.Name) and 
                node.targets[0].id == 'ORIGINAL_DATA_TYPES'):
                if isinstance(node.value, ast.Dict):
                    for key, value in zip(node.value.keys, node.value.values):
                        if isinstance(key, ast.Constant) and isinstance(value, ast.Constant):
                            original_data_types[key.value] = value.value
        
        elif isinstance(node, ast.ClassDef):
            # Skip if not a Pydantic model
            if not any(base.id == 'BaseModel' for base in node.bases if isinstance(base, ast.Name)):
                continue
                
            model_name = node.name
            model_info = {
                'name': model_name,
                'docstring': '',
                'fields': []
            }
            
            # Extract docstring
            if (node.body and isinstance(node.body[0], ast.Expr) and 
                isinstance(node.body[0].value, ast.Constant)):
                model_info['docstring'] = node.body[0].value.value
            
            # Extract fields
            for item in node.body:
                if isinstance(item, ast.AnnAssign):
                    field_info = parse_field_info(item)
                    if field_info['name']:  # Only add if we got a field name
                        # Add original data type from mapping
                        table_field_key = f"{model_name}.{field_info['name']}"
                        if table_field_key in original_data_types:
                            field_info['original_data_type'] = original_data_types[table_field_key]
                        model_info['fields'].append(field_info)
            
            models[model_name] = model_info
    
    return models

def format_type_display(field_info: Dict) -> str:
    """Format the type using original CSV data type constants"""
    # Use original data type if available
    if field_info.get('original_data_type'):
        # Normalize TEXT to VARCHAR for consistency
        data_type = field_info['original_data_type']
        if data_type == 'TEXT':
            return 'VARCHAR'
        return data_type
    
    # Fallback to simplified type display if no original data type
    type_str = field_info['type']
    
    if 'Literal[' in type_str:
        return "ENUM"
    elif field_info['is_foreign_key']:
        return "REFERENCE"
    elif 'Optional[str]' in type_str or type_str == 'str':
        return "VARCHAR"
    elif 'Optional[int]' in type_str or type_str == 'int':
        return "INT"
    elif 'Optional[bool]' in type_str or type_str == 'bool':
        return "BOOLEAN"
    elif 'Optional[float]' in type_str or type_str == 'float':
        return "FLOAT"
    elif type_str == 'date':
        return "DATE"
    else:
        return "VARCHAR"


def generate_table_of_contents(models: Dict[str, Dict]) -> str:
    """Generate table of contents with links"""
    toc = ["# ASCR Data Dictionary", ""]
    toc.append("## Table of Contents")
    toc.append("")
    
    for model_name in sorted(models.keys()):
        toc.append(f"- [{model_name}](#{model_name.lower()})")
    
    toc.append("")
    toc.append("---")
    toc.append("")
    
    return "\n".join(toc)

def get_accepted_values(field_info: Dict) -> str:
    """Get accepted values for the field"""
    if field_info['enum_values']:
        return ', '.join(field_info['enum_values'])
    return ""

def get_max_length(field_info: Dict) -> str:
    """Get max length constraint"""
    if field_info['constraints'].get('max_length'):
        return str(field_info['constraints']['max_length'])
    return ""

def get_key_type(field_info: Dict) -> str:
    """Get key type"""
    if field_info['is_primary_key']:
        return "Primary Key"
    elif field_info['is_foreign_key']:
        return "Foreign Key"
    return ""

def get_nested_model(field_info: Dict) -> str:
    """Get nested model with hyperlink"""
    if field_info['is_foreign_key']:
        return f"[{field_info['foreign_table']}](#{field_info['foreign_table'].lower()})"
    return ""

def get_external_links(field_info: Dict) -> str:
    """Get external links as raw URLs"""
    links = []
    
    if field_info['ontology_link']:
        links.append(field_info['ontology_link'])
    
    if field_info['reference_url']:
        links.append(field_info['reference_url'])
    
    return " | ".join(links) if links else ""

def generate_model_section(model_name: str, model_info: Dict) -> str:
    """Generate markdown section for a single model"""
    lines = []
    
    # Section header
    lines.append(f"## {model_name}")
    lines.append("")
    
    # Skip description line as it's redundant
    
    # Table header with your requested columns
    lines.append("| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |")
    lines.append("|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|")
    
    # Sort fields: Primary keys first, then required fields, then optional
    sorted_fields = sorted(
        model_info['fields'],
        key=lambda f: (
            not f['is_primary_key'],  # Primary keys first
            not f['required'],        # Required fields next
            f['name']                 # Alphabetical within groups
        )
    )
    
    # Generate table rows
    for field in sorted_fields:
        name = field['name']
        data_type = format_type_display(field)
        required = "Yes" if field['required'] else "No"
        max_length = get_max_length(field)
        accepted_values = get_accepted_values(field)
        description = field['description'] or "No description provided"
        key_type = get_key_type(field)
        nested_model = get_nested_model(field)
        external_links = get_external_links(field)
        
        # Escape pipe characters in content
        description = description.replace('|', '\\|')
        accepted_values = accepted_values.replace('|', '\\|')
        
        lines.append(f"| {name} | {data_type} | {required} | {max_length} | {accepted_values} | {description} | {key_type} | {nested_model} | {external_links} |")
    
    lines.append("")
    lines.append("---")
    lines.append("")
    
    return "\n".join(lines)

def generate_summary_stats(models: Dict[str, Dict]) -> str:
    """Generate summary statistics"""
    total_models = len(models)
    total_fields = sum(len(model['fields']) for model in models.values())
    
    fk_count = 0
    pk_count = 0
    ontology_count = 0
    
    for model in models.values():
        for field in model['fields']:
            if field['is_foreign_key']:
                fk_count += 1
            if field['is_primary_key']:
                pk_count += 1
            if field['is_ontology']:
                ontology_count += 1
    
    lines = []
    lines.append("## Summary Statistics")
    lines.append("")
    lines.append(f"- **Total Tables:** {total_models}")
    lines.append(f"- **Total Fields:** {total_fields}")
    lines.append(f"- **Primary Keys:** {pk_count}")
    lines.append(f"- **Foreign Key Relations:** {fk_count}")
    lines.append(f"- **Ontology-Controlled Fields:** {ontology_count}")
    lines.append("")
    lines.append("---")
    lines.append("")
    
    return "\n".join(lines)

def generate_markdown_documentation(models_file: str, output_file: str):
    """Generate complete markdown documentation"""
    print(f"Parsing Pydantic models from {models_file}...")
    models = parse_pydantic_models(models_file)
    
    print(f"Found {len(models)} models. Generating documentation...")
    
    # Build the complete document
    doc_lines = []
    
    # Header with generation info
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    doc_lines.extend([
        f"*Generated on {timestamp} from {models_file}*",
        "",
        "> This document provides a business-friendly view of the ASCR database schema.",
        "> Each table represents a different aspect of stem cell registry data.",
        "",
    ])
    
    # Table of contents
    doc_lines.append(generate_table_of_contents(models))
    
    # Summary statistics
    doc_lines.append(generate_summary_stats(models))
    
    # Model sections (sorted alphabetically)
    for model_name in sorted(models.keys()):
        doc_lines.append(generate_model_section(model_name, models[model_name]))
    
    # Footer
    doc_lines.extend([
        "## Legend",
        "",
        "- **✅ Yes**: Field is required and must have a value",
        "- **❌ No**: Field is optional and can be empty",
        "- **Primary Key**: Unique identifier for this table",
        "- **Reference to [Table]**: Links to another table (click to navigate)",
        "- **Ontology Controlled**: Values must come from a specific controlled vocabulary",
        "- **Enum**: Field accepts only the listed values",
        "",
        "---",
        "",
        "*This documentation is automatically generated from the Pydantic models.*",
        "*Last updated: " + timestamp + "*"
    ])
    
    # Write to file
    with open(output_file, 'w') as f:
        f.write('\n'.join(doc_lines))
    
    print(f"✅ Documentation generated successfully: {output_file}")
    print(f"📊 Statistics: {len(models)} tables, {sum(len(m['fields']) for m in models.values())} fields")

def main():
    """Main function"""
    models_file = "data_dictionary.py"
    output_file = "../docs/data_dictionary.md"
    
    try:
        generate_markdown_documentation(models_file, output_file)
    except FileNotFoundError:
        print(f"❌ Error: Could not find {models_file}")
        print("Make sure you're running this script from the data_dictionary directory.")
    except Exception as e:
        print(f"❌ Error generating documentation: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()