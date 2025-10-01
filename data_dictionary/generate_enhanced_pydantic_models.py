import csv
import json
import re
from typing import Dict, List, Set, Optional as TypingOptional
from collections import defaultdict

def load_fk_mappings() -> Dict[str, str]:
    """Load foreign key mappings from JSON file"""
    with open('fk_mappings.json', 'r') as f:
        return json.load(f)

def parse_valid_values(valid_values_str: str) -> TypingOptional[List[str]]:
    """Parse valid values string to extract enum values"""
    if not valid_values_str or valid_values_str.upper() in ['NA', 'NULL', '']:
        return None
    
    # Handle various formats like: "TRUE, FALSE", "[option1, option2]", etc.
    # Remove brackets and quotes, split by comma, and clean newlines
    cleaned = re.sub(r'[\[\]"]', '', valid_values_str)
    cleaned = cleaned.replace('\n', ' ').replace('\r', ' ')
    values = [v.strip() for v in cleaned.split(',') if v.strip()]
    
    # Filter out non-enum-like values (URLs, descriptions, etc.)
    if len(values) <= 10 and all(len(v) < 100 for v in values):  # Reasonable enum constraints
        return values
    return None

def get_python_type_and_constraints(
    db_type: str, 
    is_required: str, 
    allows_null: str, 
    field_length: str,
    valid_values: str,
    uses_ontology: str
) -> tuple[str, str, TypingOptional[List[str]], TypingOptional[str]]:
    """
    Get Python type, constraints, enum values, and reference link
    Returns: (base_type, constraints_str, enum_values, reference_link)
    """
    
    # Check if this is an ontology field
    is_ontology_field = uses_ontology.upper() == 'YES'
    reference_link = None
    
    # Check if valid_values contains a URL (either ontology or reference)
    if valid_values and valid_values not in ['NA', '']:
        # Check if valid_values looks like a URL
        if valid_values.startswith('http'):
            reference_link = valid_values
            enum_values = None  # Don't treat as enum if it's a URL
        else:
            enum_values = parse_valid_values(valid_values)
    else:
        enum_values = parse_valid_values(valid_values)
    
    # Base type mapping
    type_mapping = {
        'VARCHAR': 'str',
        'TEXT': 'str', 
        'INT': 'int',
        'FLOAT': 'float',
        'BOOLEAN': 'bool',
        'DATE': 'date',
        'URL': 'str',
        'EMAIL': 'str',
        'FILE': 'str',
        'ENUM': 'str',
        'ONTOLOGY': 'str',
        'CHAR': 'str'
    }
    
    base_type = type_mapping.get(db_type.upper(), 'str')
    
    # If we have enum values and it's not a field with a reference link, use Literal
    if enum_values and not reference_link:
        # Escape quotes and newlines in enum values
        escaped_values = [v.replace('"', '\\"').replace('\n', '\\n').replace('\r', '') for v in enum_values]
        enum_str = ', '.join(f'"{v}"' for v in escaped_values)
        base_type = f'Literal[{enum_str}]'
    
    # Determine if field should be optional
    is_optional = (is_required.upper() != 'YES') or (allows_null.upper() == 'YES')
    
    if is_optional:
        final_type = f'Optional[{base_type}]'
    else:
        final_type = base_type
    
    # Build constraints for Field()
    constraints = []
    
    # Add length constraints for string types
    if base_type in ['str'] or 'str' in base_type:
        if field_length and field_length.isdigit():
            constraints.append(f'max_length={field_length}')
    
    # Add range constraints for numeric types  
    if base_type == 'int' and field_length and field_length.isdigit():
        # For INT fields, field_length might indicate max digits
        max_val = 10 ** int(field_length) - 1
        if max_val < 2147483647:  # Reasonable constraint
            constraints.append(f'le={max_val}')
    
    constraints_str = ', '.join(constraints) if constraints else ''
    
    return final_type, constraints_str, enum_values, reference_link

def pascal_case(snake_str: str) -> str:
    """Convert snake_case to PascalCase with special cases"""
    special_cases = {
        'xRefs': 'XRefs',
        'hpsc_scorecard': 'HpscScorecard',
        'CellLine': 'CellLine',
        'CellLineSource': 'CellLineSource', 
        'GenomicCharacterisation': 'GenomicCharacterisation',
        'UndifferentiatedCharacterisation': 'UndifferentiatedCharacterisation',
        'MicrobiologyVirologyScreening': 'MicrobiologyVirologyScreening',
        'CultureMedium': 'CultureMedium',
        'RegistrationRequirements': 'RegistrationRequirements',
        'ExternalCellLineSource': 'ExternalCellLineSource',
        'DonorSource': 'DonorSource',
        'AdditionalGenomicCharacterisation': 'AdditionalGenomicCharacterisation',
        'CellLineDerivationinducedPluripotent': 'CellLineDerivationInducedPluripotent',
        'CellLineDerivationEmbryonic': 'CellLineDerivationEmbryonic',
        'GenomicAlteration': 'GenomicAlteration',
        'VectorFreeReprogramming': 'VectorFreeReprogramming',
        'UndifferentiatedCharacterisationMarkerExpressionMethod': 'UndifferentiatedCharacterisationMarkerExpressionMethod',
        'CharacterisationProtocolResult': 'CharacterisationProtocolResult',
        'CharacterisationMethod': 'CharacterisationMethod',
        'VectorFreeReprogrammingGenes': 'VectorFreeReprogrammingGenes',
        'OntologyParentChild': 'OntologyParentChild',
        'OntologySynonym': 'OntologySynonym',
        'Cell_Line_Publication': 'CellLinePublication',
        'Culture_Medium_Items': 'CultureMediumItems',
        'Group_Institute': 'GroupInstitute',
        'Genomic modification': 'GenomicModification'
    }
    
    if snake_str in special_cases:
        return special_cases[snake_str]
    
    # Handle spaces and underscores
    snake_str = snake_str.replace(' ', '_')
    components = snake_str.split('_')
    return ''.join(word.capitalize() for word in components if word)

def generate_enhanced_pydantic_models():
    """Generate comprehensive Pydantic models from CSV data"""
    fk_mappings = load_fk_mappings()
    
    # Track original data types for mapping
    original_data_types = {}
    
    # Group fields by table
    tables = defaultdict(list)
    
    with open('data_dictionary_2.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        header = next(reader)  # Skip header
        
        for row in reader:
            if len(row) < 10 or not row[0]:  # Skip empty rows (changed from 11 to 10)
                continue
            
            # Store original data type mapping
            table_name = row[0]
            field_name = row[1]
            data_type = row[5]
            if table_name and field_name:
                original_data_types[f"{table_name}.{field_name}"] = data_type
                
            tables[row[0]].append({
                'table_name': row[0],
                'field_name': row[1], 
                'description': row[2],
                'key_type': row[3],
                'is_required': row[4],
                'data_type': row[5],
                'allows_null': row[6],
                'uses_ontology': row[7],
                'field_length': row[8],
                'valid_values': row[9],
                'links': ''  # No links column in new CSV
            })
    
    # Generate the Python file content
    output = []
    output.append('"""')
    output.append('ASCR Data Dictionary - Pydantic Models')
    output.append('')
    output.append('Auto-generated from admin_portal_data_dictionary.csv')
    output.append('Contains comprehensive field definitions with validation, constraints, and relationships.')
    output.append('"""')
    output.append('')
    output.append('from pydantic import BaseModel, Field')
    output.append('from typing import Optional, Literal')
    output.append('from datetime import date')
    output.append('')
    
    # Add the original data types mapping
    output.append('# Original CSV Data Types Mapping')
    output.append('# Maps table.field -> original CSV data type constants')
    output.append('ORIGINAL_DATA_TYPES = {')
    for field_key, data_type in sorted(original_data_types.items()):
        # Escape quotes in the data type
        escaped_type = data_type.replace('"', '\\"')
        output.append(f'    "{field_key}": "{escaped_type}",')
    output.append('}')
    output.append('')
    
    # Track all enum values used
    all_enums = set()
    
    # Generate models
    for table_name, fields in tables.items():
        if not table_name or table_name == 'DB_Schema_Table_Name':
            continue
            
        class_name = pascal_case(table_name)
        output.append(f'class {class_name}(BaseModel):')
        output.append(f'    """')
        output.append(f'    {table_name} model')
        output.append(f'    """')
        
        for field in fields:
            field_name = field['field_name']
            if not field_name:
                continue
            
            # Convert field names with spaces and hyphens to valid Python identifiers
            field_name = field_name.replace(' ', '_').replace('-', '_')
                
            description = field['description']
            key_type = field['key_type']
            data_type = field['data_type']
            is_required = field['is_required']
            allows_null = field['allows_null']
            field_length = field['field_length']
            valid_values = field['valid_values']
            uses_ontology = field['uses_ontology']
            links = field['links']
            
            # Handle foreign keys
            if key_type == 'FK' and field_name in fk_mappings:
                ref_table = fk_mappings[field_name]
                ref_class = pascal_case(ref_table)
                
                # Determine if field should be optional
                is_optional = (is_required.upper() != 'YES') or (allows_null.upper() == 'YES')
                
                if is_optional:
                    field_type = f'Optional[{ref_class}]'
                    default_value = ' = None'
                else:
                    field_type = ref_class
                    default_value = ''
                
                # Build Field() definition for FK
                field_parts = []
                if description:
                    # Escape quotes and newlines in description
                    escaped_desc = description.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
                    field_parts.append(f'description="{escaped_desc}"')
                if links:
                    # Escape quotes and newlines in links
                    escaped_links = links.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
                    field_parts.append(f'json_schema_extra={{"reference_url": "{escaped_links}"}}')
                
                # Always include Field() for proper Pydantic syntax
                if field_parts:
                    field_def = f' = Field({", ".join(field_parts)})'
                else:
                    field_def = f' = Field()' if not default_value else default_value
                
                output.append(f'    {field_name}: {field_type}{field_def}')
                
            else:
                # Regular field
                python_type, constraints, enum_values, reference_link = get_python_type_and_constraints(
                    data_type, is_required, allows_null, field_length, valid_values, uses_ontology
                )
                
                if enum_values:
                    all_enums.update(enum_values)
                
                # Build Field() definition
                field_parts = []
                if description:
                    # Escape quotes and newlines in description
                    escaped_desc = description.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
                    field_parts.append(f'description="{escaped_desc}"')
                if constraints:
                    field_parts.append(constraints)
                
                # Build json_schema_extra
                schema_extra_parts = []
                if key_type == 'PK':
                    schema_extra_parts.append('"primary_key": True')
                if uses_ontology.upper() == 'YES':
                    schema_extra_parts.append('"ontology": True')
                if reference_link:
                    # Escape quotes and newlines in reference links
                    escaped_ref = reference_link.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
                    # For ontology fields, use ontology_link, for others use reference_url
                    if uses_ontology.upper() == 'YES':
                        schema_extra_parts.append(f'"ontology_link": "{escaped_ref}"')
                    else:
                        schema_extra_parts.append(f'"reference_url": "{escaped_ref}"')
                if links:
                    # Escape quotes and newlines in links
                    escaped_links = links.replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
                    schema_extra_parts.append(f'"reference_url": "{escaped_links}"')
                
                if schema_extra_parts:
                    field_parts.append(f'json_schema_extra={{{", ".join(schema_extra_parts)}}}')
                
                # Default value
                default_value = ''
                if 'Optional' in python_type:
                    default_value = ' = None'
                
                # Complete field definition
                if field_parts:
                    field_def = f' = Field({", ".join(field_parts)})'
                else:
                    field_def = default_value
                
                output.append(f'    {field_name}: {python_type}{field_def}')
        
        output.append('')
        output.append('')
    
    # Add metadata section at the end
    output.append('# Data Dictionary Metadata')
    output.append('# This file was generated from CSV containing:')
    output.append(f'# - {len(tables)} tables')
    total_fields = sum(len(fields) for fields in tables.values())
    output.append(f'# - {total_fields} total fields')
    fk_count = sum(1 for fields in tables.values() for field in fields if field['key_type'] == 'FK')
    output.append(f'# - {fk_count} foreign key relationships')
    enum_count = len(all_enums)
    output.append(f'# - {enum_count} unique enum values across all fields')
    
    return '\n'.join(output)

def main():
    """Main function to generate and save enhanced Pydantic models"""
    models_content = generate_enhanced_pydantic_models()
    
    with open('data_dictionary.py', 'w') as f:
        f.write(models_content)
    
    print("Enhanced Pydantic models generated successfully in 'data_dictionary.py'")
    
    # Count statistics
    table_count = models_content.count('class ')
    field_count = models_content.count('    # Type:')
    fk_count = models_content.count('# FK ->')
    literal_count = models_content.count('Literal[')
    
    print(f"Generated: {table_count} models, {field_count} fields, {fk_count} FKs, {literal_count} enums")

if __name__ == "__main__":
    main()