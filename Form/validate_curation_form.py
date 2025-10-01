#!/usr/bin/env python3
"""
Curation Form Validation Script

This script validates curation form data against the field mapping rules
defined in CurationFormMapping.json. It checks data types, required fields,
enum values, and other validation rules.
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional, Union
from urllib.parse import urlparse


class ValidationResult:
    """Container for validation results"""
    
    def __init__(self):
        self.is_valid = True
        self.errors: List[Dict[str, str]] = []
    
    def add_error(self, field_path: str, message: str, field_type: str = "field"):
        """Add a validation error"""
        self.is_valid = False
        self.errors.append({
            "field": field_path,
            "message": message,
            "type": field_type
        })
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary format"""
        return {
            "is_valid": self.is_valid,
            "errors": self.errors,
            "error_count": len(self.errors)
        }


class CurationFormValidator:
    """Main validation class for curation forms"""
    
    def __init__(self, mapping_file_path: str):
        """Initialize validator with mapping configuration"""
        with open(mapping_file_path, 'r') as f:
            self.mapping_config = json.load(f)
        
        # Extract mapping sections
        self.direct_mappings = self.mapping_config.get("direct_mappings", {})
        self.renamed_mappings = self.mapping_config.get("renamed_mappings", {})
        self.object_mappings = self.mapping_config.get("object_mappings", {})
        self.list_mappings = self.mapping_config.get("list_mappings", {})
        self.convenience_mappings = self.mapping_config.get("convenience_mappings", {})
        self.file_mappings = self.mapping_config.get("file_mappings", {})
        self.meta_fields = self.mapping_config.get("meta_fields", {})
        
        # Combine all field mappings for easier lookup
        self.all_mappings = {
            **self.direct_mappings,
            **self.renamed_mappings,
            **self.object_mappings,
            **self.list_mappings,
            **self.convenience_mappings,
            **self.file_mappings,
            **self.meta_fields
        }
    
    def validate_form(self, form_data: Dict[str, Any]) -> ValidationResult:
        """Main validation method"""
        result = ValidationResult()
        
        # Validate all mapped fields
        for field_name, field_config in self.all_mappings.items():
            if field_name in form_data:
                self._validate_field(field_name, form_data[field_name], field_config, result)
            elif field_config.get("required", False):
                result.add_error(field_name, f"Required field '{field_name}' is missing")
        
        # Validate list fields specifically
        self._validate_list_fields(form_data, result)
        
        # Validate object fields specifically
        self._validate_object_fields(form_data, result)
        
        return result
    
    def _validate_field(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate a single field"""
        field_type = config.get("type", "string")
        required = config.get("required", False)
        
        # Check if required field is empty
        if required and self._is_empty(value):
            result.add_error(field_name, f"Required field '{field_name}' cannot be empty")
            return
        
        # Skip validation if field is empty and not required
        if self._is_empty(value) and not required:
            return
        
        # Type-specific validation
        if field_type == "string":
            self._validate_string(field_name, value, config, result)
        elif field_type == "boolean":
            self._validate_boolean(field_name, value, config, result)
        elif field_type == "enum":
            self._validate_enum(field_name, value, config, result)
        elif field_type == "date":
            self._validate_date(field_name, value, config, result)
        elif field_type == "email":
            self._validate_email(field_name, value, config, result)
        elif field_type == "url" or field_type == "file_url":
            self._validate_url(field_name, value, config, result)
        elif field_type == "ontology":
            self._validate_ontology(field_name, value, config, result)
        elif field_type == "object":
            # Object validation handled separately
            pass
        elif field_type == "object_list":
            # List validation handled separately
            pass
        elif field_type == "workflow":
            self._validate_workflow(field_name, value, config, result)
    
    def _validate_string(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate string fields"""
        if not isinstance(value, str):
            result.add_error(field_name, f"Field '{field_name}' must be a string, got {type(value).__name__}")
            return
        
        # Check minimum length if specified
        min_length = config.get("min_length", 0)
        if len(value.strip()) < min_length:
            result.add_error(field_name, f"Field '{field_name}' must be at least {min_length} characters long")
    
    def _validate_boolean(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate boolean fields"""
        if not isinstance(value, bool):
            result.add_error(field_name, f"Field '{field_name}' must be true or false, got {type(value).__name__}")
    
    def _validate_enum(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate enum fields"""
        allowed_values = config.get("values", [])
        if value not in allowed_values:
            result.add_error(field_name, f"Field '{field_name}' must be one of {allowed_values}, got '{value}'")
    
    def _validate_date(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate date fields"""
        if isinstance(value, str):
            try:
                # Try to parse ISO date format
                datetime.fromisoformat(value.replace('Z', '+00:00'))
            except ValueError:
                result.add_error(field_name, f"Field '{field_name}' must be a valid date in ISO format (YYYY-MM-DD), got '{value}'")
        else:
            result.add_error(field_name, f"Field '{field_name}' must be a date string, got {type(value).__name__}")
    
    def _validate_email(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate email fields"""
        if not isinstance(value, str):
            result.add_error(field_name, f"Field '{field_name}' must be a string, got {type(value).__name__}")
            return
        
        # Basic email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, value):
            result.add_error(field_name, f"Field '{field_name}' must be a valid email address, got '{value}'")
    
    def _validate_url(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate URL fields"""
        if not isinstance(value, str):
            result.add_error(field_name, f"Field '{field_name}' must be a string, got {type(value).__name__}")
            return
        
        try:
            parsed = urlparse(value)
            if not all([parsed.scheme, parsed.netloc]):
                result.add_error(field_name, f"Field '{field_name}' must be a valid URL, got '{value}'")
        except Exception:
            result.add_error(field_name, f"Field '{field_name}' must be a valid URL, got '{value}'")
    
    def _validate_ontology(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate ontology fields"""
        if not isinstance(value, str):
            result.add_error(field_name, f"Field '{field_name}' must be a string, got {type(value).__name__}")
            return
        
        # Basic ontology validation - should not be empty if required
        if not value.strip():
            result.add_error(field_name, f"Field '{field_name}' requires a valid ontology term")
    
    def _validate_workflow(self, field_name: str, value: Any, config: Dict[str, Any], result: ValidationResult):
        """Validate workflow fields"""
        allowed_values = config.get("values", [])
        if allowed_values and value not in allowed_values:
            result.add_error(field_name, f"Field '{field_name}' must be one of {allowed_values}, got '{value}'")
    
    def _validate_list_fields(self, form_data: Dict[str, Any], result: ValidationResult):
        """Validate list/array fields"""
        for field_name, field_config in self.list_mappings.items():
            if field_name in form_data:
                value = form_data[field_name]
                
                if not isinstance(value, list):
                    result.add_error(field_name, f"Field '{field_name}' must be a list/array, got {type(value).__name__}")
                    continue
                
                # Validate each item in the list
                for i, item in enumerate(value):
                    if not isinstance(item, dict):
                        result.add_error(f"{field_name}[{i}]", f"List item must be an object, got {type(item).__name__}")
                        continue
                    
                    # Validate required fields in list items
                    entity = field_config.get("entity", "")
                    self._validate_list_item(f"{field_name}[{i}]", item, entity, result)
    
    def _validate_list_item(self, field_path: str, item: Dict[str, Any], entity: str, result: ValidationResult):
        """Validate individual items in lists"""
        # Basic validation for common list item fields
        if entity == "Disease":
            if "name" in item and self._is_empty(item["name"]):
                result.add_error(f"{field_path}.name", "Disease name cannot be empty")
        
        elif entity == "Publication":
            if "doi" in item and item["doi"] and not self._is_empty(item["doi"]):
                self._validate_url(f"{field_path}.doi", item["doi"], {"type": "url"}, result)
        
        elif entity == "Contact":
            if "e_mail" in item and item["e_mail"] and not self._is_empty(item["e_mail"]):
                self._validate_email(f"{field_path}.e_mail", item["e_mail"], {"type": "email"}, result)
        
        elif entity == "Institute":
            required_fields = ["name"]
            for req_field in required_fields:
                if req_field in item and self._is_empty(item[req_field]):
                    result.add_error(f"{field_path}.{req_field}", f"Institute {req_field} cannot be empty")
    
    def _validate_object_fields(self, form_data: Dict[str, Any], result: ValidationResult):
        """Validate complex object fields"""
        for field_name, field_config in self.object_mappings.items():
            if field_name in form_data and form_data[field_name] is not None:
                value = form_data[field_name]
                
                if not isinstance(value, dict):
                    result.add_error(field_name, f"Field '{field_name}' must be an object, got {type(value).__name__}")
                    continue
                
                entity = field_config.get("entity", "")
                self._validate_object_item(field_name, value, entity, result)
    
    def _validate_object_item(self, field_path: str, obj: Dict[str, Any], entity: str, result: ValidationResult):
        """Validate individual object fields"""
        if entity == "Ethics":
            # Validate ethics object
            if "approval_date" in obj and obj["approval_date"]:
                self._validate_date(f"{field_path}.approval_date", obj["approval_date"], {"type": "date"}, result)
            
            if "ethics_number" in obj and not isinstance(obj["ethics_number"], int):
                result.add_error(f"{field_path}.ethics_number", "Ethics number must be an integer")
        
        elif entity in ["CellLineDerivedInducedPluripotent", "CellLineDerivationEmbryonic"]:
            # Validate derivation objects
            if "derivation_year" in obj and obj["derivation_year"]:
                year = obj["derivation_year"]
                if not isinstance(year, int) or year < 1990 or year > datetime.now().year + 1:
                    result.add_error(f"{field_path}.derivation_year", f"Derivation year must be between 1990 and {datetime.now().year + 1}")
    
    def _is_empty(self, value: Any) -> bool:
        """Check if a value is considered empty"""
        if value is None:
            return True
        if isinstance(value, str):
            return value.strip() == ""
        if isinstance(value, (list, dict)):
            return len(value) == 0
        return False


def validate_curation_form(form_data: Dict[str, Any], mapping_file_path: str) -> Dict[str, Any]:
    """
    Main validation function
    
    Args:
        form_data: Dictionary containing the curation form data
        mapping_file_path: Path to the CurationFormMapping.json file
    
    Returns:
        Dictionary with validation results:
        {
            "is_valid": bool,
            "errors": List[Dict[str, str]],
            "error_count": int
        }
    """
    validator = CurationFormValidator(mapping_file_path)
    result = validator.validate_form(form_data)
    return result.to_dict()


def validate_from_files(form_file_path: str, mapping_file_path: str) -> Dict[str, Any]:
    """
    Validate form data from JSON files
    
    Args:
        form_file_path: Path to the form data JSON file
        mapping_file_path: Path to the mapping configuration JSON file
    
    Returns:
        Dictionary with validation results
    """
    # Load form data
    with open(form_file_path, 'r') as f:
        form_data = json.load(f)
    
    return validate_curation_form(form_data, mapping_file_path)


# Command line interface
if __name__ == "__main__":
    import argparse
    import sys
    
    parser = argparse.ArgumentParser(description="Validate curation form data")
    parser.add_argument("form_file", help="Path to the form data JSON file")
    parser.add_argument("mapping_file", help="Path to the mapping configuration JSON file")
    parser.add_argument("--output", "-o", help="Output file for validation results (JSON)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    try:
        # Validate the form
        result = validate_from_files(args.form_file, args.mapping_file)
        
        # Output results
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"Validation results saved to {args.output}")
        else:
            print(json.dumps(result, indent=2))
        
        # Exit with appropriate code
        sys.exit(0 if result["is_valid"] else 1)
        
    except Exception as e:
        print(f"Error during validation: {str(e)}", file=sys.stderr)
        sys.exit(2)

"""
EXAMPLE OUTPUT

=== VALID FORM EXAMPLE ===

Input:
{
    "cell_line_id": "ASCR-001",
    "cell_line_alt_name": "iPSC Cell Line 1",
    "hpscreg_name": "hPSCReg123456",
    "cell_type": "iPSC",
    "clinical_use": false,
    "commercial_use": false,
    "research_use": true,
    "publish": true,
    "registered_with_hpscreg": true,
    "associated_polymorphism": "rs12345678",
    "biopsy_location": "skin fibroblast",
    "donor_age": "25-29",
    "donor_sex": "Female",
    "donor_disease_phenotype": "healthy control",
    "donor_polymorphism": "rs87654321",
    "simple_contact_email": "researcher@university.edu.au",
    "simple_publication_doi": "https://doi.org/10.1038/example",
    "embargo_date": "2025-12-31",
    "diseases": [
        {
            "name": "Healthy Control",
            "mondo_onto_id": "MONDO:0000001"
        }
    ],
    "generator_institutes": [
        {
            "name": "University Research Center",
            "city": "Sydney",
            "country": "Australia"
        }
    ],
    "owner_institutes": [
        {
            "name": "Stem Cell Institute",
            "city": "Melbourne",
            "country": "Australia"
        }
    ]
}

Output:
{
    "is_valid": true,
    "errors": [],
    "error_count": 0
}

=== INVALID FORM EXAMPLE ===

Input:
{
    "cell_line_id": "",
    "cell_line_alt_name": null,
    "hpscreg_name": "hPSCReg123456",
    "cell_type": "InvalidCellType",
    "clinical_use": "not_boolean",
    "commercial_use": false,
    "research_use": true,
    "publish": true,
    "registered_with_hpscreg": true,
    "donor_sex": "InvalidSex",
    "simple_contact_email": "not-an-email",
    "simple_publication_doi": "not-a-url",
    "embargo_date": "2025-13-45",
    "diseases": [
        {
            "name": ""
        }
    ],
    "generator_institutes": [
        {
            "name": "",
            "city": "Sydney",
            "country": "Australia"
        }
    ]
}

Output:
{
    "is_valid": false,
    "error_count": 12,
    "errors": [
        {
            "field": "cell_line_id",
            "message": "Required field 'cell_line_id' cannot be empty",
            "type": "field"
        },
        {
            "field": "cell_line_alt_name",
            "message": "Required field 'cell_line_alt_name' cannot be empty",
            "type": "field"
        },
        {
            "field": "cell_type",
            "message": "Field 'cell_type' must be one of ['iPSC', 'ESC'], got 'InvalidCellType'",
            "type": "field"
        },
        {
            "field": "clinical_use",
            "message": "Field 'clinical_use' must be true or false, got str",
            "type": "field"
        },
        {
            "field": "embargo_date",
            "message": "Field 'embargo_date' must be a valid date in ISO format (YYYY-MM-DD), got '2025-13-45'",
            "type": "field"
        },
        {
            "field": "associated_polymorphism",
            "message": "Required field 'associated_polymorphism' is missing",
            "type": "field"
        },
        {
            "field": "biopsy_location",
            "message": "Required field 'biopsy_location' is missing",
            "type": "field"
        },
        {
            "field": "donor_sex",
            "message": "Field 'donor_sex' must be one of ['Male', 'Female', 'Unknown'], got 'InvalidSex'",
            "type": "field"
        },
        {
            "field": "donor_disease_phenotype",
            "message": "Required field 'donor_disease_phenotype' is missing",
            "type": "field"
        },
        {
            "field": "donor_polymorphism",
            "message": "Required field 'donor_polymorphism' is missing",
            "type": "field"
        },
        {
            "field": "simple_publication_doi",
            "message": "Field 'simple_publication_doi' must be a valid URL, got 'not-a-url'",
            "type": "field"
        },
        {
            "field": "simple_contact_email",
            "message": "Field 'simple_contact_email' must be a valid email address, got 'not-an-email'",
            "type": "field"
        },
        {
            "field": "diseases[0].name",
            "message": "Disease name cannot be empty",
            "type": "field"
        },
        {
            "field": "generator_institutes[0].name",
            "message": "Institute name cannot be empty",
            "type": "field"
        }
    ]
}

=== USAGE IN WEB APPLICATIONS ===

# Django View Example:
if result["is_valid"]:
    # Save to database and return success
    return JsonResponse({"success": True, "message": "Form saved successfully"})
else:
    # Group errors by field for frontend display
    field_errors = {}
    for error in result["errors"]:
        field = error["field"]
        if field not in field_errors:
            field_errors[field] = []
        field_errors[field].append(error["message"])
    
    return JsonResponse({
        "success": False,
        "errors": field_errors,
        "message": f"Please fix {result['error_count']} validation errors"
    }, status=400)

# Frontend JavaScript Example:
// Display errors next to form fields
Object.entries(result.errors).forEach(([field, messages]) => {
    const fieldElement = document.querySelector(`[name="${field}"]`);
    if (fieldElement) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500';
        errorDiv.textContent = messages.join('; ');
        fieldElement.parentNode.appendChild(errorDiv);
    }
});
"""