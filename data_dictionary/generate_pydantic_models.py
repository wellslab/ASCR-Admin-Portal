import csv
import json
from typing import Dict, List, Set
from collections import defaultdict

def load_fk_mappings() -> Dict[str, str]:
    """Load foreign key mappings from JSON file"""
    with open('fk_mappings.json', 'r') as f:
        return json.load(f)

def get_python_type(db_type: str, is_required: str, allows_null: str) -> str:
    """Convert database type to Python type with Optional wrapper if needed"""
    # Base type mapping
    type_mapping = {
        'VARCHAR': 'str',
        'TEXT': 'str',
        'INT': 'int',
        'FLOAT': 'float',
        'BOOLEAN': 'bool',
        'DATE': 'date',
        'URL': 'str',  # Could add HttpUrl validation later
        'EMAIL': 'str',  # Could add EmailStr validation later
        'FILE': 'str',
        'ENUM': 'str',
        'ONTOLOGY': 'str',
        'CHAR': 'str'
    }
    
    base_type = type_mapping.get(db_type.upper(), 'str')
    
    # Determine if field should be optional
    is_optional = (is_required.upper() != 'YES') or (allows_null.upper() == 'YES')
    
    if is_optional:
        return f'Optional[{base_type}]'
    else:
        return base_type

def pascal_case(snake_str: str) -> str:
    """Convert snake_case to PascalCase"""
    # Handle special cases first
    if snake_str == 'xRefs':
        return 'XRefs'
    if snake_str == 'hpsc_scorecard':
        return 'HpscScorecard'
    if snake_str == 'CellLine':
        return 'CellLine'
    if snake_str == 'CellLineSource':
        return 'CellLineSource'
    if snake_str == 'GenomicCharacterisation':
        return 'GenomicCharacterisation'
    if snake_str == 'UndifferentiatedCharacterisation':
        return 'UndifferentiatedCharacterisation'
    if snake_str == 'MicrobiologyVirologyScreening':
        return 'MicrobiologyVirologyScreening'
    if snake_str == 'CultureMedium':
        return 'CultureMedium'
    if snake_str == 'RegistrationRequirements':
        return 'RegistrationRequirements'
    if snake_str == 'ExternalCellLineSource':
        return 'ExternalCellLineSource'
    if snake_str == 'DonorSource':
        return 'DonorSource'
    if snake_str == 'AdditionalGenomicCharacterisation':
        return 'AdditionalGenomicCharacterisation'
    if snake_str == 'CellLineDerivationinducedPluripotent':
        return 'CellLineDerivationInducedPluripotent'
    if snake_str == 'CellLineDerivationEmbryonic':
        return 'CellLineDerivationEmbryonic'
    if snake_str == 'GenomicAlteration':
        return 'GenomicAlteration'
    if snake_str == 'VectorFreeReprogramming':
        return 'VectorFreeReprogramming'
    if snake_str == 'UndifferentiatedCharacterisationMarkerExpressionMethod':
        return 'UndifferentiatedCharacterisationMarkerExpressionMethod'
    if snake_str == 'CharacterisationProtocolResult':
        return 'CharacterisationProtocolResult'
    if snake_str == 'CharacterisationMethod':
        return 'CharacterisationMethod'
    if snake_str == 'VectorFreeReprogrammingGenes':
        return 'VectorFreeReprogrammingGenes'
    if snake_str == 'OntologyParentChild':
        return 'OntologyParentChild'
    if snake_str == 'OntologySynonym':
        return 'OntologySynonym'
    
    # Split by underscores and capitalize each part
    components = snake_str.split('_')
    return ''.join(word.capitalize() for word in components)

def generate_pydantic_models():
    """Generate Pydantic models from CSV data"""
    fk_mappings = load_fk_mappings()
    
    # Group fields by table
    tables = defaultdict(list)
    
    with open('admin_portal_data_dictionary.csv', 'r') as f:
        reader = csv.reader(f)
        header = next(reader)  # Skip header
        
        for row in reader:
            if len(row) < 11 or not row[0]:  # Skip empty rows
                continue
                
            table_name = row[0]
            field_name = row[1]
            description = row[2]
            key_type = row[3]
            is_required = row[4]
            data_type = row[5]
            allows_null = row[6]
            uses_ontology = row[7]
            field_length = row[8]
            valid_values = row[9]
            links = row[10] if len(row) > 10 else ''
            
            tables[table_name].append({
                'field_name': field_name,
                'description': description,
                'key_type': key_type,
                'is_required': is_required,
                'data_type': data_type,
                'allows_null': allows_null,
                'uses_ontology': uses_ontology,
                'field_length': field_length,
                'valid_values': valid_values,
                'links': links
            })
    
    # Generate the Python file content
    output = []
    output.append('from pydantic import BaseModel')
    output.append('from typing import Optional')
    output.append('from datetime import date')
    output.append('')
    
    # First pass: Create base models without FK relationships
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
                
            description = field['description']
            key_type = field['key_type']
            
            # Handle foreign keys
            if key_type == 'FK' and field_name in fk_mappings:
                ref_table = fk_mappings[field_name]
                ref_class = pascal_case(ref_table)
                
                # Determine if field should be optional
                is_optional = (field['is_required'].upper() != 'YES') or (field['allows_null'].upper() == 'YES')
                
                if is_optional:
                    field_type = f'Optional["{ref_class}"]'
                    default_value = ' = None'
                else:
                    field_type = f'"{ref_class}"'
                    default_value = ''
                
                output.append(f'    {field_name}: {field_type}{default_value}  # FK -> {ref_table}')
            else:
                # Regular field
                python_type = get_python_type(field['data_type'], field['is_required'], field['allows_null'])
                
                if 'Optional' in python_type:
                    default_value = ' = None'
                else:
                    default_value = ''
                
                output.append(f'    {field_name}: {python_type}{default_value}')
            
            # Add description as comment if available
            if description:
                output.append(f'    # {description}')
        
        output.append('')
        output.append('')
    
    return '\n'.join(output)

def main():
    """Main function to generate and save Pydantic models"""
    models_content = generate_pydantic_models()
    
    with open('pydantic_models.py', 'w') as f:
        f.write(models_content)
    
    print("Pydantic models generated successfully in 'pydantic_models.py'")
    print(f"Generated models for {models_content.count('class ')} tables")

if __name__ == "__main__":
    main()