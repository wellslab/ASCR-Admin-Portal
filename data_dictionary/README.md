# ASCR Data Dictionary

This directory contains the data dictionary files and tools for the Australian Stem Cell Registry (ASCR) project.

## Files

### Source Data
- `admin_portal_data_dictionary.csv` - Cleaned CSV file with database schema definitions (11 columns only)
- `data_dictionary_inspection.ipynb` - Jupyter notebook for inspecting the CSV data

### Configuration
- `fk_mappings.json` - Foreign key mappings defining relationships between tables
  - Maps field names to their target table references
  - Used by the Pydantic model generator

### Generated Models
- `data_dictionary.py` - Generated Pydantic models for all database tables
  - 40+ model classes with proper type hints
  - Foreign key relationships using forward references
  - Optional fields based on "Is required" and "Allows null" columns

### Tools
- `generate_pydantic_models.py` - Script to generate Pydantic models from CSV
- `analyze_fks.py` - Helper script to analyze foreign key relationships

## Usage

### Regenerating Pydantic Models

1. Update `fk_mappings.json` if foreign key relationships change
2. Run the generator script:
   ```bash
   cd data_dictionary
   python3 generate_pydantic_models.py
   ```
3. The updated models will be saved to `data_dictionary.py`

### Foreign Key Mappings Format

The `fk_mappings.json` file uses this format:
```json
{
  "field_name": "TargetTableName",
  "another_fk_field": "AnotherTable"
}
```

### Model Features

- **PascalCase class names** (e.g., `CellLine`, `GenomicCharacterisation`)
- **snake_case field names** (e.g., `cell_line_id`, `genomic_characterisation`)
- **Type mapping**:
  - VARCHAR/TEXT → str
  - INT → int
  - BOOLEAN → bool
  - DATE → date
  - FLOAT → float
  - Optional fields use `Optional[Type] = None`
- **Foreign key relationships** use forward references with string annotations
- **Comments** include field descriptions from the CSV

## Database Schema Overview

The schema includes tables for:
- Cell line management (`CellLine`, `CellLineSource`)
- Genomic data (`GenomicCharacterisation`, `GenomicAlteration`)
- Publications and references (`Publication`, `XRefs`)
- User and group management (`RegUser`, `Group`, `Contact`)
- Ethics and compliance (`Ethics`, `RegistrationRequirements`)
- Characterisation protocols and results
- Ontology management
- And more...

## Notes

- The original CSV had hundreds of empty columns which were removed during processing
- All foreign key relationships were manually mapped to ensure accuracy
- Models use Pydantic v2 syntax with proper type annotations
- Forward references resolve circular dependencies between models