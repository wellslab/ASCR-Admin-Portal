import csv
import json

def generate_fk_mappings():
    """Generate FK mappings by analyzing field names and descriptions"""
    fk_mappings = {}
    
    with open('data_dictionary_2.csv', 'r') as f:
        reader = csv.reader(f)
        header = next(reader)  # Skip header
        
        for row in reader:
            if len(row) >= 4 and row[3] == 'FK':  # Key type column is index 3
                table_name = row[0]
                field_name = row[1]
                description = row[2]
                
                # Determine referenced table based on field name and description
                referenced_table = infer_referenced_table(field_name, description, table_name)
                
                if referenced_table:
                    fk_mappings[field_name] = referenced_table
                    print(f"Mapping: {field_name} -> {referenced_table}")
    
    return fk_mappings

def infer_referenced_table(field_name, description, source_table):
    """Infer the referenced table from field name and description"""
    
    # Direct mappings based on field names
    direct_mappings = {
        'cell_line_id': 'CellLine',
        'cell_line_source_id': 'CellLineSource',
        'genomic_characterisation': 'GenomicCharacterisation', 
        'undifferentiated_characterisation_protocol': 'UndifferentiatedCharacterisation',
        'generator_group': 'Group',
        'owner_group': 'Group',
        'group_id': 'Group',
        'registration_requirements': 'RegistrationRequirements',
        'screening_contaminants': 'MicrobiologyVirologyScreening',
        'culture_medium': 'CultureMedium',
        'biopsy_location': 'Ontology',
        'donor_id': 'DonorSource',
        'aust_reg_parental_cell_line': 'CellLine',
        'external_cell_line_id': 'ExternalCellLineSource',
        'xref_id': 'xRefs',
        'disease_phenotype': 'Disease',
        'contact': 'Contact',
        'institute_id': 'Institute',
        'reg_user': 'RegUser',
        'ethics': 'Ethics',
        'publication_id': 'Publication',
        'disease_id': 'Disease',
        'mondo_onto_id': 'Ontology',
        'medium_component_item': 'MediumComponentItems',
        'culture_medium_items': 'CultureMediumItems',
        'hpsc_scorecard_id': 'hpsc_scorecard',
        'undifferentiationcharacterisation_id': 'UndifferentiatedCharacterisation',
        'genomiccharacterisation_id': 'GenomicCharacterisation',
        'loci_id': 'Loci',
        'additionalgenomiccharacterisation_id': 'AdditionalGenomicCharacterisation',
        'celllinederivationinducedpluripotent_id': 'CellLineDerivationinducedPluripotent',
        'derivationipsintegratedvector_id': 'IntegratedVector',
        'derivationipsnonintegratedvector_id': 'NonIntegratedVector',
        'genomic_alteration_id': 'GenomicAlteration',
        'vectorfreereprogramming_id': 'VectorFreeReprogramming',
        'vectorfreeprogramming_id': 'VectorFreeReprogramming',
        'parent': 'Ontology',
        'child': 'Ontology',
        'ontology_id': 'Ontology',
        'associated_disease': 'Disease'
    }
    
    # Check direct mappings first
    if field_name in direct_mappings:
        return direct_mappings[field_name]
    
    # Special case for fields ending with _id
    if field_name.endswith('_id'):
        base_name = field_name[:-3]  # Remove '_id'
        
        # Convert to PascalCase
        if base_name == 'donor_source':
            return 'DonorSource'
        elif base_name == 'external_cell_line':
            return 'ExternalCellLineSource'
        # Add more special cases as needed
    
    # If no mapping found, return None and we'll handle manually
    print(f"WARNING: No mapping found for {field_name} in table {source_table}")
    return None

def main():
    """Generate and save FK mappings"""
    fk_mappings = generate_fk_mappings()
    
    # Save to JSON file
    with open('fk_mappings.json', 'w') as f:
        json.dump(fk_mappings, f, indent=2)
    
    print(f"\n✅ Generated {len(fk_mappings)} FK mappings and saved to fk_mappings.json")

if __name__ == "__main__":
    main()