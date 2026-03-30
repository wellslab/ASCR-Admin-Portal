from typing import Dict, Any, List, Tuple, Union, Literal, get_args, get_origin
import logging
from pydantic import BaseModel, ValidationError
from data_dictionaries.models import JSONOutputSchema

logger = logging.getLogger(__name__)

class CellLineValidation:
    """
    Cell line validation pipeline for processing curated cell line data.
    Validates against JSONOutputSchema Pydantic model.
    """

    def __init__(self):
        """Initialize the validation pipeline"""
        self.logger = logger

    def validate(self, cell_line_data: Dict[str, Any]) -> Dict[str, Any]:

        cell_line_id = cell_line_data.get("cell_line_id", "unknown")
        self.logger.info(f"Starting validation pipeline for cell line: {cell_line_id}")

        try:
            # Run validation pipeline steps
            result = self._validate_single_cell_line(cell_line_data)
            self.logger.info(f"Validation pipeline completed successfully for {cell_line_id}")
            return result

        except Exception as e:
            self.logger.error(f"Validation failed for cell line {cell_line_id}: {str(e)}")
            return {
                "cell_line_id": cell_line_id,
                "validation_status": "failed",
                "validation_error": str(e),
                "original_data": cell_line_data
            }

    def _validate_single_cell_line(self, cell_line_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate a single cell line against the JSONOutputSchema Pydantic model.

        Args:
            cell_line_data: Dict containing cell_line_id and normalized_data

        Returns:
            Dict with validation results including validated_data if successful
        """
        cell_line_id = cell_line_data.get("cell_line_id", "unknown")
        normalized_data = cell_line_data.get("normalized_data", {})

        try:
            # Validate against JSONOutputSchema Pydantic model
            validated_form = JSONOutputSchema(**normalized_data)

            return {
                "cell_line_id": cell_line_id,
                "validation_status": "success",
                "validated_data": validated_form.model_dump(),
                "processing_times": cell_line_data.get("processing_times", {})
            }

        except ValidationError as e:
            self.logger.warning(f"Pydantic validation failed for {cell_line_id}: {str(e)}")
            return {
                "cell_line_id": cell_line_id,
                "validation_status": "failed",
                "validation_error": str(e),
                "validation_details": e.errors(),
                "original_data": normalized_data
            }


# ---------------------------------------------------------------------------
# Schema and form generation — used by the API to serve the frontend editor
# ---------------------------------------------------------------------------

def _resolve_field_type(field_def: Dict[str, Any], definitions: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively resolve the type schema for a single JSON schema field definition."""
    schema: Dict[str, Any] = {}
    field_type = field_def.get("type")

    if "anyOf" in field_def:
        non_null = [t for t in field_def["anyOf"] if t.get("type") != "null"]
        if non_null:
            field_def = non_null[0]
            field_type = field_def.get("type")

    if "enum" in field_def:
        schema["type"] = "select"
        schema["choices"] = field_def["enum"]
    elif field_type == "string":
        schema["type"] = "text"
        if "maxLength" in field_def:
            schema["max_length"] = field_def["maxLength"]
    elif field_type == "integer":
        schema["type"] = "number"
        schema["number_type"] = "integer"
    elif field_type == "number":
        schema["type"] = "number"
        schema["number_type"] = "float"
    elif field_type == "boolean":
        schema["type"] = "boolean"
    elif field_type == "array":
        items_def = field_def.get("items", {})
        if "$ref" in items_def:
            nested_ref = items_def["$ref"].split("/")[-1]
            nested_def = definitions.get(nested_ref, {})
            schema["type"] = "text"
            schema["is_object_array"] = True
            schema["fields"] = {
                nf: _resolve_field_type(nd, definitions)
                for nf, nd in nested_def.get("properties", {}).items()
            }
        else:
            schema["type"] = "text"
            schema["is_array"] = True
    elif "$ref" in field_def:
        nested_ref = field_def["$ref"].split("/")[-1]
        nested_def = definitions.get(nested_ref, {})
        schema["type"] = "object"
        schema["fields"] = {
            nf: _resolve_field_type(nd, definitions)
            for nf, nd in nested_def.get("properties", {}).items()
        }
    else:
        schema["type"] = "text"

    return schema


def get_frontend_schema(model_class: BaseModel) -> Dict[str, Any]:
    """Generate a frontend-friendly schema from a Pydantic model.

    Extracts nested model field information for rendering in the cell line editor.
    """
    try:
        full_schema = model_class.model_json_schema()
        definitions = full_schema.get("$defs", {})
        sections_schema = {}
        properties = full_schema.get("properties", {})

        for section_name, section_def in properties.items():
            model_ref = None

            if section_def.get("type") == "array":
                items_def = section_def.get("items", {})
                if "$ref" in items_def:
                    model_ref = items_def["$ref"].split("/")[-1]
                    is_list = True
            elif "anyOf" in section_def:
                refs = [t for t in section_def["anyOf"] if "$ref" in t]
                if refs:
                    model_ref = refs[0]["$ref"].split("/")[-1]
                    is_list = False

            if model_ref:
                nested_model_def = definitions.get(model_ref, {})
                nested_properties = nested_model_def.get("properties", {})
                nested_required = nested_model_def.get("required", [])

                fields_schema = {
                    field_name: {
                        "required": field_name in nested_required,
                        "description": field_def.get("description", ""),
                        **_resolve_field_type(field_def, definitions),
                    }
                    for field_name, field_def in nested_properties.items()
                }

                sections_schema[section_name] = {
                    "fields": fields_schema,
                    "model_name": model_ref,
                    "is_list": is_list,
                }

        return {
            "sections": sections_schema,
            "model_name": model_class.__name__,
            "description": f"Schema for {model_class.__name__} model",
        }

    except Exception as e:
        logger.error(f"Error generating frontend schema for {model_class.__name__}: {str(e)}")
        raise Exception(f"Schema generation failed: {str(e)}")


def _create_placeholder_instance(model_class: type, overrides: Dict[str, Any] = None) -> Dict[str, Any]:
    """Create an instance of a Pydantic model with placeholder values."""
    overrides = overrides or {}
    instance_data = {}

    for field_name, field_info in model_class.model_fields.items():
        if field_name in overrides:
            instance_data[field_name] = overrides[field_name]
            continue

        annotation = field_info.annotation
        origin = get_origin(annotation)
        if origin is type(None) or annotation is type(None):
            instance_data[field_name] = None
            continue

        is_optional = False
        inner_type = annotation
        if hasattr(annotation, '__origin__'):
            args = get_args(annotation)
            if type(None) in args:
                is_optional = True
                inner_type = next((a for a in args if a is not type(None)), str)

        if get_origin(inner_type) is Literal:
            instance_data[field_name] = None if is_optional else get_args(inner_type)[0]
        elif get_origin(inner_type) is list:
            instance_data[field_name] = []
        elif inner_type == str:
            instance_data[field_name] = None
        elif inner_type == int:
            instance_data[field_name] = 0 if not is_optional else None
        elif inner_type == float:
            instance_data[field_name] = 0.0 if not is_optional else None
        elif inner_type == bool:
            instance_data[field_name] = False if not is_optional else None
        elif hasattr(inner_type, '__name__') and inner_type.__name__ in ('date', 'datetime'):
            instance_data[field_name] = None
        elif hasattr(inner_type, 'model_fields'):
            instance_data[field_name] = None if is_optional else _create_placeholder_instance(inner_type)
        else:
            instance_data[field_name] = None

    return instance_data


def generate_empty_form(form_class: type, hpscreg_name: str = "", cell_type: str = "") -> Dict[str, Any]:
    """Generate an empty form with placeholder values for all fields.

    If cell_type is provided, pre-populates general.cell_type and omits the
    derivation section that does not apply to that cell line type.
    """
    IPSC_VALUE = "human induced pluripotent stem cell (hiPSC)"
    ESC_VALUE = "human embryonic stem cell (hESC)"
    exclude_field = None
    if cell_type == IPSC_VALUE:
        exclude_field = "derivation_esc"
    elif cell_type == ESC_VALUE:
        exclude_field = "derivation_ipsc"

    result = {}

    for field_name, field_info in form_class.model_fields.items():
        if field_name == exclude_field:
            result[field_name] = None
            continue

        annotation = field_info.annotation
        origin = get_origin(annotation)
        args = get_args(annotation)

        if origin is list:
            if args and hasattr(args[0], 'model_fields'):
                result[field_name] = [_create_placeholder_instance(args[0])]
            else:
                result[field_name] = []
        elif origin is Union:
            non_none = [a for a in args if a is not type(None)]
            if non_none and hasattr(non_none[0], 'model_fields'):
                overrides = {}
                if field_name == "general":
                    if hpscreg_name:
                        overrides["hpscreg_name"] = hpscreg_name
                    if cell_type:
                        overrides["cell_type"] = cell_type
                result[field_name] = _create_placeholder_instance(non_none[0], overrides)
            else:
                result[field_name] = None
        else:
            result[field_name] = None

    return result