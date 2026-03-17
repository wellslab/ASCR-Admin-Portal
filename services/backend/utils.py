from typing import Dict, Any, List, Tuple, Union, Literal, get_args, get_origin
from pydantic import BaseModel
from pydantic.fields import FieldInfo
from fastapi import WebSocket
import logging
import base64
import json
import os
from pathlib import Path

logger = logging.getLogger(__name__)

# Helper functions for common operations


def _resolve_field_type(field_def: Dict[str, Any], definitions: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively resolve the type schema for a single JSON schema field definition."""
    schema: Dict[str, Any] = {}
    field_type = field_def.get("type")

    # Unwrap Optional (anyOf with null)
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
            # List[SubModel] — object array
            nested_ref = items_def["$ref"].split("/")[-1]
            nested_def = definitions.get(nested_ref, {})
            schema["type"] = "text"
            schema["is_object_array"] = True
            schema["fields"] = {
                nf: _resolve_field_type(nd, definitions)
                for nf, nd in nested_def.get("properties", {}).items()
            }
        else:
            # List[primitive]
            schema["type"] = "text"
            schema["is_array"] = True
    elif "$ref" in field_def:
        # Optional[SubModel] — nested single object
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
    """
    Generate a frontend-friendly schema from a Pydantic model.
    Extracts nested model field information for proper rendering in the editor.
    """
    try:
        # Get the full JSON schema from Pydantic
        full_schema = model_class.model_json_schema()
        definitions = full_schema.get("$defs", {})

        # Build schema for each section (top-level array fields)
        sections_schema = {}
        properties = full_schema.get("properties", {})

        for section_name, section_def in properties.items():
            model_ref = None

            # Array section: List[SubModel]
            if section_def.get("type") == "array":
                items_def = section_def.get("items", {})
                if "$ref" in items_def:
                    model_ref = items_def["$ref"].split("/")[-1]
                    is_list = True

            # Optional object section: Optional[SubModel] -> anyOf [{$ref: ...}, {type: null}]
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
            "description": f"Schema for {model_class.__name__} model"
        }

    except Exception as e:
        logger.error(f"Error generating frontend schema for {model_class.__name__}: {str(e)}")
        raise Exception(f"Schema generation failed: {str(e)}")

def _create_placeholder_instance(model_class: type, overrides: Dict[str, Any] = None) -> Dict[str, Any]:
    """Create an instance of a Pydantic model with placeholder values."""
    overrides = overrides or {}
    instance_data = {}

    for field_name, field_info in model_class.model_fields.items():
        # Use override if provided
        if field_name in overrides:
            instance_data[field_name] = overrides[field_name]
            continue

        annotation = field_info.annotation

        # Handle Optional types - extract inner type
        origin = get_origin(annotation)
        if origin is type(None) or annotation is type(None):
            instance_data[field_name] = None
            continue

        # Check if it's Optional (Union with None)
        is_optional = False
        inner_type = annotation
        if hasattr(annotation, '__origin__'):
            args = get_args(annotation)
            if type(None) in args:
                is_optional = True
                inner_type = next((a for a in args if a is not type(None)), str)

        # Handle Literal (enum) types
        if get_origin(inner_type) is Literal:
            instance_data[field_name] = None if is_optional else get_args(inner_type)[0]
        # Handle List types
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
            # Nested model — None if optional, otherwise recurse
            instance_data[field_name] = None if is_optional else _create_placeholder_instance(inner_type)
        else:
            instance_data[field_name] = None

    return instance_data


def generate_empty_form(form_class: type, hpscreg_name: str = "", cell_type: str = "") -> Dict[str, Any]:
    """Generate an empty form with placeholder values for all fields.

    If cell_type is provided, pre-populates general.cell_type and omits the
    derivation section that doesn't apply to the cell line type.
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
            # List[SubModel] -> single placeholder instance in a list
            if args and hasattr(args[0], 'model_fields'):
                result[field_name] = [_create_placeholder_instance(args[0])]
            else:
                result[field_name] = []

        elif origin is Union:
            # Optional[SubModel] -> single placeholder instance (not a list)
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


def queue_curation_tasks(files: List[Dict[str, str]], curate_task_func) -> Dict[str, Any]:
    if not files:
        raise ValueError("No files provided for curation.")
    
    tasks = []
    for uploaded_file in files:
        try:
            # Decode base64 file data to bytes
            pdf_bytes = base64.b64decode(uploaded_file["file_data"])
            
            # Queue Celery task
            task = curate_task_func.apply_async(args=[uploaded_file["filename"], pdf_bytes])
            
            tasks.append({
                "filename": uploaded_file["filename"],
                "task_id": task.id
            })
            
        except Exception as e:
            logger.error(f"Failed to queue curation for {uploaded_file['filename']}: {str(e)}")
            raise Exception(f"Failed to queue {uploaded_file['filename']}: {str(e)}")
    
    return {
        "status": "queued",
        "total_files": len(files),
        "tasks": tasks,
        "message": "Curation tasks queued; track progress via Celery backend."
    }

class ConnectionManager:
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        if self.active_connections:
            logger.info(f"Broadcasting to {len(self.active_connections)} clients: {message}")
            for connection in self.active_connections.copy():
                try:
                    await connection.send_json(message)
                except:
                    # Remove dead connections
                    self.active_connections.remove(connection)

# Global connection manager instance
websocket_manager = ConnectionManager()

async def broadcast_task_completion(notification_data: Dict[str, Any]):
    await websocket_manager.broadcast({
        "type": notification_data["type"],
        "task_id": notification_data["task_id"],
        "filename": notification_data["filename"],
        "result": notification_data["result"],
        "timestamp": notification_data["timestamp"]
    })


async def broadcast_task_progress(progress_data: Dict[str, Any]):
    """Broadcast task progress update to all connected WebSocket clients"""
    await websocket_manager.broadcast({
        "type": progress_data["type"],
        "task_id": progress_data["task_id"],
        "stage": progress_data["stage"],
        "status": progress_data["status"],
        "message": progress_data["message"],
        "data": progress_data.get("data", {}),
        "timestamp": progress_data["timestamp"]
    })


# Note: The following functions have been moved/replaced:
# - Cell line CRUD operations: moved to datastore.py (CellLineDataStore class)
# - Cell line validation: moved to validation.py (CellLineValidation class)
# - Cell line saving: moved to tasks.py (_save_cell_lines function using datastore)