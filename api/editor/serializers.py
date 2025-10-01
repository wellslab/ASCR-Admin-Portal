from rest_framework import serializers
from api.models import CellLineTemplate, CellLineVersion
import json
from typing import get_type_hints, get_origin, get_args
from pydantic import BaseModel

# Import the Pydantic model for schema generation
# Use safe import with fallback to Django-only schema
PydanticCellLineTemplate = None
try:
    import sys
    import os
    # Get the absolute path to the validation/models directory
    validation_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'validation', 'models')
    if validation_path not in sys.path:
        sys.path.insert(0, validation_path)
    from CellLineTemplate import CellLineTemplate as PydanticCellLineTemplate
except ImportError as e:
    print(f"Pydantic import failed, using Django-only schema: {e}")
    PydanticCellLineTemplate = None


class CellLineTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for CellLineTemplate with basic validation.
    Choice constraints temporarily removed to allow any string values.
    """
    
    class Meta:
        model = CellLineTemplate
        fields = '__all__'
        read_only_fields = ('created_on', 'modified_on', 'is_locked', 'locked_by', 'locked_at')
        
    def validate_CellLine_hpscreg_id(self, value):
        """Ensure hpscreg_id is unique on creation"""
        if self.instance is None:  # Creating new record
            if CellLineTemplate.objects.filter(CellLine_hpscreg_id=value).exists():
                raise serializers.ValidationError("Cell line with this HPS Registry ID already exists.")
        return value
    
    def validate_CellLine_alt_names(self, value):
        """Validate that alt_names is a list of strings"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Alt names must be a list.")
        for name in value:
            if not isinstance(name, str):
                raise serializers.ValidationError("All alt names must be strings.")
        return value
    
    def validate_PluripotencyCharacterisation_marker_list(self, value):
        """Validate that marker_list is a list of strings"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Marker list must be a list.")
        for marker in value:
            if not isinstance(marker, str):
                raise serializers.ValidationError("All markers must be strings.")
        return value
    
    def validate_Ethics(self, value):
        """Validate Ethics field structure with flexible field handling"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Ethics must be a list.")
        
        for i, ethics_item in enumerate(value):
            if not isinstance(ethics_item, dict):
                raise serializers.ValidationError("Each ethics item must be a dictionary.")
            
            # Ensure all required fields exist, creating them if missing
            if 'ethics_number' not in ethics_item:
                ethics_item['ethics_number'] = ''
                
            if 'institute' not in ethics_item:
                # Try to find institute field variants
                ethics_item['institute'] = ethics_item.get('institutional_HREC', ethics_item.get('institution', ''))
                
            if 'approval_date' not in ethics_item:
                ethics_item['approval_date'] = ''
                
        return value


class CellLineSchemaSerializer(serializers.Serializer):
    """
    Serializer for generating schema information from the Pydantic model.
    Used by the schema introspection endpoint.
    """
    pass  # Logic handled in the view


def pydantic_to_json_schema():
    """
    Convert the Pydantic CellLineTemplate model to a JSON schema
    that can be used by the frontend for dynamic form generation.
    """
    try:
        # Check if Pydantic model is available
        if PydanticCellLineTemplate is None:
            return django_only_schema()
            
        # Get the Pydantic model schema
        pydantic_schema = PydanticCellLineTemplate.model_json_schema()
        
        # Transform the schema to include Django field information
        model = CellLineTemplate
        django_fields = {}
        
        for field in model._meta.get_fields():
            field_info = {
                'type': field.__class__.__name__,
                'required': not getattr(field, 'null', True) and not getattr(field, 'blank', True)
            }
            
            # Add field-specific metadata
            if hasattr(field, 'max_length') and field.max_length:
                field_info['max_length'] = field.max_length
                
            if hasattr(field, 'choices') and field.choices:
                field_info['choices'] = [{'value': choice[0], 'label': choice[1]} for choice in field.choices]
                
            # Add help text if available
            if hasattr(field, 'help_text') and field.help_text:
                field_info['help_text'] = field.help_text
                
            # Special handling for JSONFields
            if field.__class__.__name__ == 'JSONField':
                field_name = field.name
                if field_name in pydantic_schema.get('properties', {}):
                    pydantic_field = pydantic_schema['properties'][field_name]
                    field_info['json_schema'] = pydantic_field
                else:
                    field_info['json_schema'] = {
                        'type': 'object',
                        'description': 'JSON field - structure determined dynamically'
                    }
            
            # Add default values (handle Django's NOT_PROVIDED)
            if hasattr(field, 'default') and field.default is not None:
                # Skip Django's NOT_PROVIDED sentinel value
                from django.db.models.fields import NOT_PROVIDED
                if field.default != NOT_PROVIDED:
                    if callable(field.default):
                        try:
                            field_info['default'] = field.default()
                        except:
                            pass  # Skip if default function fails
                    else:
                        field_info['default'] = field.default
                    
            django_fields[field.name] = field_info
        
        # Combine Pydantic schema information with Django field metadata
        combined_schema = {
            'model_name': model.__name__,
            'description': model.__doc__ or '',
            'fields': django_fields,
            'pydantic_schema': pydantic_schema,
            'total_fields': len(django_fields)
        }
        
        return combined_schema
        
    except Exception as e:
        # Fallback to Django-only schema if Pydantic import fails
        return django_only_schema()


def django_only_schema():
    """
    Fallback schema generation using only Django model introspection.
    """
    model = CellLineTemplate
    schema = {
        'model_name': model.__name__,
        'description': model.__doc__ or '',
        'fields': {},
        'total_fields': 0
    }
    
    for field in model._meta.get_fields():
        field_info = {
            'type': field.__class__.__name__,
            'required': not getattr(field, 'null', True) and not getattr(field, 'blank', True)
        }
        
        # Add field-specific metadata
        if hasattr(field, 'max_length') and field.max_length:
            field_info['max_length'] = field.max_length
            
        if hasattr(field, 'choices') and field.choices:
            field_info['choices'] = [{'value': choice[0], 'label': choice[1]} for choice in field.choices]
            
        # Add help text if available
        if hasattr(field, 'help_text') and field.help_text:
            field_info['help_text'] = field.help_text
            
        # Special handling for JSONFields
        if field.__class__.__name__ == 'JSONField':
            field_info['json_schema'] = {
                'type': 'array' if 'list' in field.name.lower() or 'names' in field.name.lower() else 'object',
                'description': 'JSON field structure for custom editor parsing'
            }
        
        # Add default values (handle Django's NOT_PROVIDED)
        if hasattr(field, 'default') and field.default is not None:
            # Skip Django's NOT_PROVIDED sentinel value
            from django.db.models.fields import NOT_PROVIDED
            if field.default != NOT_PROVIDED:
                if callable(field.default):
                    try:
                        field_info['default'] = field.default()
                    except:
                        pass  # Skip if default function fails
                else:
                    field_info['default'] = field.default
                
        schema['fields'][field.name] = field_info
    
    schema['total_fields'] = len(schema['fields'])
    return schema 


class CellLineVersionSerializer(serializers.ModelSerializer):
    """
    Serializer for CellLineVersion listing (version history).
    Used for the version history endpoint.
    """
    class Meta:
        model = CellLineVersion
        fields = ['version_number', 'created_by', 'created_on', 'change_summary']
        read_only_fields = ['version_number', 'created_by', 'created_on']


class CellLineVersionDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed CellLineVersion data including complete metadata.
    Used for specific version retrieval endpoint.
    """
    hpscreg_id = serializers.CharField(source='cell_line.CellLine_hpscreg_id', read_only=True)
    
    class Meta:
        model = CellLineVersion
        fields = ['version_number', 'metadata', 'created_by', 'created_on', 'change_summary', 'hpscreg_id']
        read_only_fields = ['version_number', 'metadata', 'created_by', 'created_on', 'hpscreg_id'] 