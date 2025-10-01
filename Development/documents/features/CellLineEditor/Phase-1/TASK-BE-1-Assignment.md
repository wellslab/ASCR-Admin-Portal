# TASK ASSIGNMENT: BE-1 - Schema Introspection API & Backend Foundation

## Task Overview
**Task ID**: TASK-BE-1  
**Assignee**: Backend Agent  
**Phase**: Phase 1, Sprint 1  
**Estimated Effort**: 2-3 days  
**Priority**: High (Critical Path)  
**Dependencies**: TASK-PRE-1 (Complete)  

## Project Context

You are implementing the **CellLineEditor Phase 1** backend foundation for the ASCR Web Services project. This Django + Next.js application manages stem cell research data for Dr. Suzy Butcher (principal curator). The CellLineEditor will allow editing of complex JSON-structured cell line metadata through an intuitive web interface.

**Repository**: `/Users/StefanMacbook/Documents/research-project/ascr-web-services`  
**Tech Stack**: Django 5.0.2 + DRF 3.14.0, PostgreSQL, Next.js 15.3.4  
**Current Data**: 120 CellLineTemplate records with 150+ fields each  
**User Profile**: Non-technical biology researcher needing intuitive interface  

## Task Description

Create the backend API foundation that will power the custom CellLineEditor frontend. The frontend will implement a custom pseudo-text-editor that displays clean field:value pairs without JSON syntax. You'll build a schema introspection API that provides field metadata, validation rules, and JSON structure information to enable this custom editor approach.

## Technical Requirements

### 1. Schema Introspection API Endpoint

Create a comprehensive API endpoint that provides complete schema information for the `CellLineTemplate` model to enable dynamic frontend form generation.

**Endpoint**: `GET /api/editor/cellline-schema/`

**Response Structure**:
```json
{
  "model_name": "CellLineTemplate",
  "fields": {
    "CellLine_hpscreg_id": {
      "type": "CharField",
      "required": true,
      "max_length": 100,
      "unique": true,
      "help_text": "Unique identifier for the cell line"
    },
    "CellLine_cell_line_type": {
      "type": "CharField",
      "required": true,
      "choices": [
        ["hESC", "Human Embryonic Stem Cell"],
        ["hiPSC", "Human Induced Pluripotent Stem Cell"]
      ]
    },
    "CellLine_alt_names": {
      "type": "JSONField",
      "required": false,
      "json_schema": {
        "type": "array",
        "items": {"type": "string"}
      }
    }
    // ... all other fields with their validation metadata
  }
}
```

### 2. CRUD API Endpoints

Implement full CRUD operations for cell line management:

**Cell Line List/Create**: `GET/POST /api/editor/celllines/`
- List all cell lines with pagination
- Create new cell lines with validation
- Support filtering and search

**Cell Line Detail**: `GET/PUT/PATCH/DELETE /api/editor/celllines/{hpscreg_id}/`
- Retrieve single cell line by hpscreg_id
- Update existing cell lines
- Delete cell lines (with confirmation)

**New Cell Line Template**: `GET /api/editor/celllines/new-template/`
- Return blank cell line template populated from schema
- Used for creating new cell lines from scratch

### 3. Enhanced Django Model

Extend the existing `CellLineTemplate` model with editor-specific functionality:

```python
# Add to api/models.py
class CellLineTemplate(models.Model):
    # ... existing fields ...
    
    # Editor metadata
    is_locked = models.BooleanField(default=False)
    locked_by = models.CharField(max_length=100, null=True, blank=True)
    locked_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Cell Line Template"
        verbose_name_plural = "Cell Line Templates"
        
    def lock_for_editing(self, user_identifier):
        """Lock cell line for editing by specific user"""
        self.is_locked = True
        self.locked_by = user_identifier
        self.locked_at = timezone.now()
        self.save()
        
    def unlock(self):
        """Unlock cell line after editing"""
        self.is_locked = False
        self.locked_by = None
        self.locked_at = None
        self.save()
        
    def is_lock_expired(self, timeout_minutes=30):
        """Check if lock has expired"""
        if not self.is_locked or not self.locked_at:
            return True
        return timezone.now() - self.locked_at > timedelta(minutes=timeout_minutes)
```

### 4. Django REST Framework Integration

Create comprehensive serializers and viewsets:

```python
# Create api/editor/serializers.py
from rest_framework import serializers
from api.models import CellLineTemplate

class CellLineTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CellLineTemplate
        fields = '__all__'
        
    def validate_CellLine_hpscreg_id(self, value):
        """Ensure hpscreg_id is unique"""
        if self.instance is None:  # Creating new record
            if CellLineTemplate.objects.filter(CellLine_hpscreg_id=value).exists():
                raise serializers.ValidationError("Cell line with this HPS Registry ID already exists.")
        return value

class CellLineSchemaSerializer(serializers.Serializer):
    """Serializer for schema introspection endpoint"""
    pass  # Logic handled in view
```

## Implementation Steps

### Step 1: Create Editor App Structure
```bash
# Create dedicated editor app structure
mkdir -p api/editor
touch api/editor/__init__.py
touch api/editor/serializers.py
touch api/editor/views.py
# Note: urls.py already exists
```

### Step 2: Implement Schema Introspection
```python
# In api/editor/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.apps import apps
from api.models import CellLineTemplate

@api_view(['GET'])
def cellline_schema(request):
    """Return complete schema information for CellLineTemplate model"""
    model = CellLineTemplate
    schema = {
        'model_name': model.__name__,
        'fields': {}
    }
    
    # Introspect all model fields
    for field in model._meta.get_fields():
        field_info = {
            'type': field.__class__.__name__,
            'required': not field.null
        }
        
        # Add field-specific metadata
        if hasattr(field, 'max_length') and field.max_length:
            field_info['max_length'] = field.max_length
            
        if hasattr(field, 'choices') and field.choices:
            field_info['choices'] = field.choices
            
        # Add help text if available
        if hasattr(field, 'help_text') and field.help_text:
            field_info['help_text'] = field.help_text
            
        # Add JSON schema information for JSONFields
        if field.__class__.__name__ == 'JSONField':
            # For arrays and objects, provide structure information
            field_info['json_schema'] = {
                'type': 'object',  # or 'array' - will be determined from actual Pydantic schema
                'description': 'JSON field structure for custom editor parsing'
            }
            
        schema['fields'][field.name] = field_info
    
    return Response(schema)
```

### Step 3: Implement CRUD ViewSet
```python
# In api/editor/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import CellLineTemplateSerializer

class CellLineTemplateViewSet(viewsets.ModelViewSet):
    queryset = CellLineTemplate.objects.all()
    serializer_class = CellLineTemplateSerializer
    lookup_field = 'CellLine_hpscreg_id'
    
    @action(detail=False, methods=['get'])
    def new_template(self, request):
        """Return blank template for creating new cell lines"""
        # Create empty instance with default values
        template_data = {}
        for field in CellLineTemplate._meta.get_fields():
            if hasattr(field, 'default') and field.default is not None:
                template_data[field.name] = field.default
            else:
                template_data[field.name] = None
                
        return Response(template_data)
    
    def perform_create(self, serializer):
        """Custom create logic with locking"""
        instance = serializer.save()
        # Auto-lock for editing
        instance.lock_for_editing('system')
        
    def perform_update(self, serializer):
        """Custom update logic"""
        instance = serializer.save()
        # Unlock after successful update
        instance.unlock()
```

### Step 4: Configure URLs
```python
# Update api/editor/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'celllines', views.CellLineTemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cellline-schema/', views.cellline_schema, name='cellline-schema'),
]
```

### Step 5: Model Migration
```bash
# Create and apply migration for model changes
python manage.py makemigrations
python manage.py migrate
```

## Acceptance Criteria

Your task is complete when ALL of the following are implemented and tested:

### ✅ Schema Introspection API
- [ ] **GET /api/editor/cellline-schema/** endpoint returns complete field metadata
- [ ] **Field types** correctly identified (CharField, JSONField, etc.)
- [ ] **Validation rules** included (required, max_length, choices)
- [ ] **Field metadata** complete for text editor validation
- [ ] **Choice fields** include all available options
- [ ] **JSON fields** include schema information for arrays/objects

### ✅ CRUD API Endpoints  
- [ ] **GET /api/editor/celllines/** lists all cell lines with pagination
- [ ] **POST /api/editor/celllines/** creates new cell lines with validation
- [ ] **GET /api/editor/celllines/{id}/** retrieves single cell line
- [ ] **PUT/PATCH /api/editor/celllines/{id}/** updates existing cell lines
- [ ] **DELETE /api/editor/celllines/{id}/** removes cell lines
- [ ] **GET /api/editor/celllines/new-template/** returns blank template

### ✅ Model Enhancements
- [ ] **Locking mechanism** implemented (is_locked, locked_by, locked_at)
- [ ] **Lock methods** work correctly (lock_for_editing, unlock, is_lock_expired)
- [ ] **Database migration** applied successfully
- [ ] **Existing data** remains intact (120 records preserved)

### ✅ API Integration
- [ ] **DRF serializers** handle all field types correctly
- [ ] **Validation** prevents duplicate hpscreg_id values
- [ ] **Error handling** provides clear error messages
- [ ] **URL routing** configured and accessible

### ✅ Testing & Quality
- [ ] **API endpoints** tested with sample requests
- [ ] **Schema endpoint** returns valid JSON structure
- [ ] **CRUD operations** work with existing data
- [ ] **Performance** acceptable for 120+ records

## Testing Instructions

### Test Schema Introspection
```bash
# Test schema endpoint
curl -X GET http://localhost:8000/api/editor/cellline-schema/ | jq

# Expected: Complete schema with all 150+ fields
```

### Test CRUD Operations
```bash
# List all cell lines
curl -X GET http://localhost:8000/api/editor/celllines/ | jq

# Get specific cell line (use actual hpscreg_id from database)
curl -X GET http://localhost:8000/api/editor/celllines/AIBNi001-A/ | jq

# Get new template
curl -X GET http://localhost:8000/api/editor/celllines/new-template/ | jq
```

### Test with Django Shell
```python
# Test model enhancements
from api.models import CellLineTemplate

# Test locking mechanism
cell_line = CellLineTemplate.objects.first()
cell_line.lock_for_editing('test_user')
print(f"Locked: {cell_line.is_locked}")
print(f"Locked by: {cell_line.locked_by}")

cell_line.unlock()
print(f"Unlocked: {cell_line.is_locked}")
```

## Deliverables

### 1. Code Implementation
- **api/editor/views.py** - Schema introspection and CRUD viewsets
- **api/editor/serializers.py** - DRF serializers for cell lines  
- **api/editor/urls.py** - Updated URL routing
- **api/models.py** - Enhanced CellLineTemplate model

### 2. Database Migration
- **Migration file** for model changes
- **Verification** that existing data is preserved

### 3. Testing Report
Create: `documents/features/CellLineEditor/Phase-1/TASK-BE-1-Report.md`

Include:
- API endpoint testing results
- Schema introspection output sample
- CRUD operation verification
- Performance metrics with 120 records
- Any issues encountered and resolutions

## Success Indicators

### ✅ Ready for Frontend Development
- Backend APIs provide all data needed for dynamic form generation
- Schema introspection enables automatic UI component selection
- CRUD operations support full editing workflow
- No blocking issues for Phase 1 Sprint 2

### ⚠️ Issues to Address
- Performance problems with large datasets
- Schema introspection missing critical field information  
- CRUD operations not working with existing data
- Migration problems affecting data integrity

### ❌ Critical Failures
- Cannot access existing cell line data
- Schema endpoint returns incomplete information
- CRUD operations fail or corrupt data
- Migration destroys existing records

## Getting Started

1. **Verify Environment**: Ensure Django development environment is ready
2. **Check Current Data**: Confirm 120 CellLineTemplate records are accessible
3. **Review Model Structure**: Understand existing CellLineTemplate fields
4. **Plan Implementation**: Start with schema introspection, then CRUD APIs
5. **Test Incrementally**: Verify each component before moving to the next

## Questions or Blockers?

If you encounter issues with:
- Model field introspection complexity
- DRF serializer configuration
- URL routing conflicts
- Database migration problems

Document them thoroughly in your report with proposed solutions.

## Timeline

**Expected Completion**: 2-3 business days  
**Critical Path**: Schema introspection API blocks frontend development  
**Next Task**: TASK-FE-1 (Frontend editor foundation) depends on this completion

---

**Note**: This task establishes the critical backend foundation for the custom pseudo-text-editor frontend. The schema introspection API provides the metadata needed for the frontend to:
- Display clean field:value pairs without JSON syntax
- Validate individual field values as users edit
- Determine which fields are collapsible (nested objects/arrays)
- Provide appropriate input controls (text, dropdown for choices, etc.)

The custom editor approach means the frontend will maintain the JSON structure internally while presenting a clean, text-editor-like interface to users. 