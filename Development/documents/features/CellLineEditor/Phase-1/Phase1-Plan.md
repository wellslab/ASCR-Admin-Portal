# CellLineEditor Phase 1 - Detailed Implementation Plan

## Overview
This document provides specific, actionable tasks for implementing Phase 1 of the CellLineEditor. Each task includes context, acceptance criteria, and implementation details for agent allocation.

**Duration**: 3-4 weeks  
**Goal**: Functional JSON editor with schema-driven validation and basic save functionality

## Prerequisites Validation

### TASK-PRE-1: Verify Database Migration Completion
**Agent**: Backend  
**Effort**: 1 day  
**Dependencies**: None

**Context**: Ensure cell line data has been migrated from filesystem to database before starting editor development.

**Acceptance Criteria**:
- [ ] Cell line JSON files are stored in database instead of filesystem
- [ ] Migration script completed successfully
- [ ] Data integrity verified (no data loss during migration)
- [ ] Performance acceptable for 300-3000 records

**Implementation Details**:
- Check current database for cell line tables
- Verify JSON data is accessible via Django ORM
- Test query performance for list/search operations
- Document any migration issues found

---

## Sprint 1: Foundation (Week 1)

### Backend Tasks

### TASK-BE-1: Implement Database Models
**Agent**: Backend  
**Effort**: 2-3 days  
**Dependencies**: TASK-PRE-1

**Context**: Create Django models to store cell line data with proper versioning support (for future phases).

**Acceptance Criteria**:
- [ ] `CellLine` model with JSONField for metadata storage
- [ ] `CellLineVersion` model for version history (future use)
- [ ] Proper database indexes for performance
- [ ] Django migrations created and tested
- [ ] Model methods for JSON validation

**Implementation Details**:
```python
# models.py structure needed
class CellLine(models.Model):
    hpscreg_id = models.CharField(max_length=50, unique=True, primary_key=True)
    metadata = models.JSONField()  # Stores 150+ fields
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=PROTECT)
    
    class Meta:
        indexes = [
            models.Index(fields=['hpscreg_id']),
            models.Index(fields=['created_on']),
        ]

class CellLineVersion(models.Model):
    cell_line = models.ForeignKey(CellLine, on_delete=CASCADE)
    version_number = models.PositiveIntegerField()
    metadata = models.JSONField()
    created_on = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=PROTECT)
```

**Files to Modify**:
- `api/models.py` - Add new models
- `api/migrations/` - New migration files

### TASK-BE-2: Schema Introspection API
**Agent**: Backend  
**Effort**: 2 days  
**Dependencies**: None

**Context**: Create API endpoint that converts Pydantic schema to JSON Schema format for frontend form generation.

**Acceptance Criteria**:
- [ ] `/api/schema/cellline/` endpoint returns JSON Schema
- [ ] Schema includes field types, required fields, validation rules
- [ ] Nested objects and arrays properly described
- [ ] Caching mechanism implemented
- [ ] Fallback for embedded schema if Pydantic unavailable

**Implementation Details**:
```python
# views.py endpoint structure
@api_view(['GET'])
def get_cellline_schema(request):
    # Convert Pydantic model to JSON Schema
    # Cache result for performance
    # Return schema with proper field definitions
    
# Expected JSON Schema output format:
{
    "type": "object",
    "properties": {
        "hpscreg_id": {"type": "string", "required": True},
        "donor_information": {
            "type": "object",
            "properties": {
                "age": {"type": "integer", "minimum": 0},
                "gender": {"type": "string", "enum": ["M", "F", "U"]}
            }
        },
        "culture_conditions": {
            "type": "array",
            "items": {"type": "object", "properties": {...}}
        }
    }
}
```

**Files to Create**:
- `api/schema_views.py` - Schema endpoint logic
- `api/schema_utils.py` - Pydantic to JSON Schema conversion

### TASK-BE-3: Basic CRUD Endpoints
**Agent**: Backend  
**Effort**: 3 days  
**Dependencies**: TASK-BE-1

**Context**: Implement RESTful API endpoints for cell line data management with proper validation.

**Acceptance Criteria**:
- [ ] `GET /api/celllines/` - Paginated list with search
- [ ] `GET /api/celllines/{hpscreg_id}/` - Get specific cell line
- [ ] `POST /api/celllines/` - Create new cell line
- [ ] `PUT /api/celllines/{hpscreg_id}/` - Update existing cell line
- [ ] Server-side validation using Pydantic models
- [ ] Proper error responses with field-level details
- [ ] Authentication and permission checks

**Implementation Details**:
```python
# Expected API response formats:

# GET /api/celllines/
{
    "count": 2847,
    "next": "http://api/celllines/?page=2",
    "previous": null,
    "results": [
        {
            "hpscreg_id": "BCRTi001-A",
            "metadata": {...},
            "created_on": "2024-01-01T00:00:00Z",
            "modified_on": "2024-01-01T00:00:00Z"
        }
    ]
}

# POST /api/celllines/ error response:
{
    "errors": {
        "donor_information.age": ["Age must be a positive integer"],
        "hpscreg_id": ["This field is required"]
    }
}
```

**Files to Modify**:
- `api/views.py` - CRUD endpoint logic
- `api/serializers.py` - Request/response serialization
- `api/urls.py` - URL routing

### Frontend Tasks

### TASK-FE-1: Project Structure Setup
**Agent**: Frontend  
**Effort**: 1 day  
**Dependencies**: None

**Context**: Set up the component directory structure and TypeScript interfaces for the cell line editor.

**Acceptance Criteria**:
- [ ] Directory structure created as per architecture
- [ ] TypeScript interfaces defined for all data types
- [ ] Basic component shells created
- [ ] Routing configured for `/tools/celllines/`

**Implementation Details**:
```
src/app/tools/celllines/
├── page.tsx                     # Main page component
├── components/
│   ├── CellLineSelector.tsx     # Search/select interface
│   ├── EditorContainer.tsx      # State management wrapper
│   ├── EditorHeader.tsx         # Save/cancel controls
│   ├── PseudoEditor/
│   │   ├── CellLineEditor.tsx   # Main editor component
│   │   ├── FieldRenderer.tsx    # Field name display
│   │   ├── ValueEditor.tsx      # Value editing components
│   │   ├── CollapsibleSections.tsx
│   │   └── types.ts
│   ├── ValidationDisplay.tsx    # Error display
│   └── NetworkErrorDisplay.tsx  # Network errors
├── context/
│   ├── EditorContext.tsx        # State management
│   └── types.ts                 # Context types
└── utils/
    ├── api.ts                   # API client functions
    ├── validation.ts            # Client-side validation
    └── jsonUtils.ts             # JSON manipulation
```

**Files to Create**:
- All component shells with basic TypeScript interfaces
- `types.ts` files with comprehensive type definitions

### TASK-FE-2: Core Types and Interfaces
**Agent**: Frontend  
**Effort**: 1 day  
**Dependencies**: TASK-FE-1

**Context**: Define TypeScript interfaces that match backend API and support frontend state management.

**Acceptance Criteria**:
- [ ] `CellLineData` interface matches API response
- [ ] `EditorState` interface supports all editor modes
- [ ] `ValidationError` interface handles field-level errors
- [ ] `FieldDefinition` interface for schema-driven rendering
- [ ] `EditorAction` types for state updates

**Implementation Details**:
```typescript
// context/types.ts
export interface CellLineData {
  hpscreg_id: string;
  metadata: Record<string, any>;
  created_on?: string;
  modified_on?: string;
  created_by?: string;
}

export interface EditorState {
  currentCellLine: CellLineData | null;
  originalCellLine: CellLineData | null;
  validationErrors: ValidationError[];
  isSaving: boolean;
  isLoading: boolean;
  isDirty: boolean;
  mode: 'edit' | 'readonly' | 'create';
  expandedSections: Set<string>;
}

export interface FieldDefinition {
  path: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  required: boolean;
  label: string;
  validation?: ValidationRule[];
  children?: FieldDefinition[];
}
```

**Files to Create**:
- `context/types.ts` - Core interfaces
- `components/PseudoEditor/types.ts` - Editor-specific types

### TASK-FE-3: State Management Implementation
**Agent**: Frontend  
**Effort**: 2 days  
**Dependencies**: TASK-FE-2

**Context**: Implement EditorContext with useReducer for managing complex editor state.

**Acceptance Criteria**:
- [ ] EditorContext provides state and dispatch functions
- [ ] State updates handle nested field modifications
- [ ] Dirty state tracking for unsaved changes
- [ ] Loading and error states properly managed
- [ ] Undo/redo capability foundation (data structure)

**Implementation Details**:
```typescript
// context/EditorContext.tsx
const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
} | null>(null);

// Actions needed:
// LOAD_CELL_LINE, UPDATE_FIELD_VALUE, SET_VALIDATION_ERRORS,
// SET_LOADING, SET_SAVING, TOGGLE_SECTION, RESET_EDITOR
```

**Files to Create**:
- `context/EditorContext.tsx` - Context implementation
- `context/EditorReducer.ts` - State reducer logic

---

## Sprint 2: Dynamic Form Generation (Weeks 2-2.5)

### TASK-FE-4: Schema Processing Engine
**Agent**: Frontend  
**Effort**: 3 days  
**Dependencies**: TASK-BE-2, TASK-FE-3

**Context**: Convert JSON Schema from backend into renderable field definitions for form generation.

**Acceptance Criteria**:
- [ ] Parse JSON Schema into `FieldDefinition` objects
- [ ] Handle nested objects with proper path resolution
- [ ] Process array schemas with item type information
- [ ] Map schema types to appropriate input components
- [ ] Support for validation rules and required fields

**Implementation Details**:
```typescript
// utils/schemaProcessor.ts
export function processSchema(jsonSchema: any): FieldDefinition[] {
  // Convert JSON Schema properties to FieldDefinition array
  // Handle nested objects recursively
  // Process array items and their schemas
  // Generate field paths (e.g., "donor_information.age")
}

export function getFieldByPath(fields: FieldDefinition[], path: string): FieldDefinition | null {
  // Navigate nested structure to find specific field
}
```

**Files to Create**:
- `utils/schemaProcessor.ts` - Schema conversion logic
- `utils/fieldPathUtils.ts` - Path resolution utilities

### TASK-FE-5: Basic Field Components
**Agent**: Frontend  
**Effort**: 4 days  
**Dependencies**: TASK-FE-4

**Context**: Create input components for different data types with inline editing capability.

**Acceptance Criteria**:
- [ ] `TextFieldEditor` - String inputs with validation feedback
- [ ] `NumberFieldEditor` - Numeric inputs with type checking
- [ ] `BooleanFieldEditor` - Checkbox/toggle with proper styling
- [ ] `DateFieldEditor` - Date picker component
- [ ] `SelectFieldEditor` - Dropdown for enum values
- [ ] Click-to-edit functionality for all field types
- [ ] Consistent styling and validation display

**Implementation Details**:
```typescript
// components/PseudoEditor/ValueEditor.tsx
interface ValueEditorProps {
  field: FieldDefinition;
  value: any;
  onChange: (newValue: any) => void;
  onBlur?: () => void;
  error?: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

// Each field component should:
// 1. Display value in read-only mode
// 2. Switch to edit mode on click
// 3. Handle validation and error display
// 4. Submit changes on blur or Enter
// 5. Cancel changes on Escape
```

**Files to Create**:
- `components/PseudoEditor/ValueEditor.tsx` - Main value editor
- `components/PseudoEditor/FieldEditors/` - Individual field components

### TASK-FE-6: Pseudo-Editor Foundation
**Agent**: Frontend  
**Effort**: 3 days  
**Dependencies**: TASK-FE-5

**Context**: Create the main pseudo-editor component that displays data in editor-like format without JSON syntax.

**Acceptance Criteria**:
- [ ] Line-based display of field names and values
- [ ] Field names are read-only, values are editable
- [ ] No JSON syntax visible (no braces, brackets, quotes)
- [ ] Proper indentation for nested structures
- [ ] Tab navigation between editable fields
- [ ] Keyboard shortcuts (Enter to edit, Escape to cancel)

**Implementation Details**:
```typescript
// components/PseudoEditor/CellLineEditor.tsx
interface PseudoEditorProps {
  cellLineData: CellLineData;
  schema: FieldDefinition[];
  onDataChange: (newData: CellLineData) => void;
  validationErrors: ValidationError[];
}

// Display format:
// hpscreg_id: BCRTi001-A
// donor_information:
//   age: 25
//   gender: M
//   ethnicity: Caucasian
// culture_conditions:
//   [1] medium_type: mTeSR1
//   [2] medium_type: E8
```

**Files to Create**:
- `components/PseudoEditor/CellLineEditor.tsx` - Main editor
- `components/PseudoEditor/FieldRenderer.tsx` - Field name display

### TASK-FE-7: API Integration
**Agent**: Frontend  
**Effort**: 2 days  
**Dependencies**: TASK-BE-3, TASK-FE-6

**Context**: Integrate frontend components with backend API endpoints for data loading and saving.

**Acceptance Criteria**:
- [ ] API client functions for all CRUD operations
- [ ] Error handling for network failures
- [ ] Loading states during API calls
- [ ] Data transformation between API and editor formats
- [ ] Authentication token handling

**Implementation Details**:
```typescript
// utils/api.ts
export async function fetchCellLines(page?: number, search?: string): Promise<CellLineListResponse> {
  // GET /api/celllines/ with pagination and search
}

export async function fetchCellLine(hpscreg_id: string): Promise<CellLineData> {
  // GET /api/celllines/{hpscreg_id}/
}

export async function saveCellLine(data: CellLineData): Promise<CellLineData> {
  // POST or PUT /api/celllines/
}

export async function fetchSchema(): Promise<any> {
  // GET /api/schema/cellline/
}
```

**Files to Create**:
- `utils/api.ts` - API client functions
- `utils/errorHandling.ts` - Error processing utilities

---

## Sprint 3: Nested Structures and Completion (Weeks 3-4)

### TASK-FE-8: Collapsible Sections
**Agent**: Frontend  
**Effort**: 2 days  
**Dependencies**: TASK-FE-6

**Context**: Implement expand/collapse functionality for nested objects to improve navigation.

**Acceptance Criteria**:
- [ ] Nested objects can be expanded/collapsed
- [ ] Visual indicators for expandable sections
- [ ] Proper indentation hierarchy maintained
- [ ] Expansion state preserved during editing
- [ ] Section headers show field count and status

**Implementation Details**:
```typescript
// components/PseudoEditor/CollapsibleSection.tsx
interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  level: number;  // Nesting depth for indentation
  children: React.ReactNode;
  fieldCount?: number;
  hasErrors?: boolean;
}
```

**Files to Create**:
- `components/PseudoEditor/CollapsibleSections.tsx` - Section management

### TASK-FE-9: Array Management Interface
**Agent**: Frontend  
**Effort**: 3 days  
**Dependencies**: TASK-FE-8

**Context**: Create intuitive interface for editing arrays of objects or primitives.

**Acceptance Criteria**:
- [ ] Add/remove array items with +/- buttons
- [ ] Reorder array items (up/down arrows or drag-and-drop)
- [ ] Edit individual array item properties
- [ ] Handle arrays of primitives vs. arrays of objects
- [ ] Delete confirmation for array item removal
- [ ] Add new items from schema templates

**Implementation Details**:
```typescript
// components/PseudoEditor/ArrayEditor.tsx
interface ArrayEditorProps {
  field: FieldDefinition;
  value: any[];
  onChange: (newArray: any[]) => void;
  path: string;
}

// Display format for arrays:
// culture_conditions: [3 items]
//   [1] ▲▼ ✕
//       medium_type: mTeSR1
//       passage_number: 5
//   [2] ▲▼ ✕
//       medium_type: E8
//       passage_number: 8
//   [+] Add new item
```

**Files to Create**:
- `components/PseudoEditor/ArrayEditor.tsx` - Array management
- `components/PseudoEditor/ArrayItem.tsx` - Individual array items

### TASK-FE-10: Cell Line Selection Interface
**Agent**: Frontend  
**Effort**: 3 days  
**Dependencies**: TASK-FE-7

**Context**: Create search and selection interface for existing cell lines with "Add New" capability.

**Acceptance Criteria**:
- [ ] Search functionality with real-time filtering
- [ ] Paginated results for large datasets
- [ ] Cell line metadata preview in search results
- [ ] "Add New Cell Line" button and workflow
- [ ] Recent/favorite cell lines shortcuts
- [ ] Keyboard navigation support

**Implementation Details**:
```typescript
// components/CellLineSelector.tsx
interface CellLineSelectorProps {
  onSelect: (cellLine: CellLineData | 'new') => void;
  onCancel: () => void;
}

// Features needed:
// - Search input with debounced API calls
// - Infinite scroll or pagination
// - Card-based display of search results
// - Quick access to recently edited cell lines
```

**Files to Create**:
- `components/CellLineSelector.tsx` - Main selector interface
- `components/CellLineCard.tsx` - Individual cell line display

### TASK-FE-11: Validation and Error Handling
**Agent**: Frontend  
**Effort**: 2 days  
**Dependencies**: TASK-FE-9

**Context**: Implement comprehensive validation display and error handling throughout the editor.

**Acceptance Criteria**:
- [ ] Real-time field validation on blur
- [ ] Error highlighting for invalid fields
- [ ] Error message tooltips with specific validation failures
- [ ] Prevent save when validation errors exist
- [ ] Network error handling with retry functionality
- [ ] User-friendly error messages

**Implementation Details**:
```typescript
// components/ValidationDisplay.tsx
interface ValidationDisplayProps {
  errors: ValidationError[];
  onErrorClick: (fieldPath: string) => void;  // Navigate to error field
}

// Error handling patterns:
// 1. Field-level validation on blur
// 2. Form-level validation before save
// 3. Server-side validation error display
// 4. Network error recovery
```

**Files to Create**:
- `components/ValidationDisplay.tsx` - Error message display
- `components/NetworkErrorDisplay.tsx` - Network error handling
- `utils/validation.ts` - Client-side validation logic

### TASK-FE-12: Final Integration and Polish
**Agent**: Frontend  
**Effort**: 2 days  
**Dependencies**: All previous frontend tasks

**Context**: Complete the editor integration, add polish features, and ensure production readiness.

**Acceptance Criteria**:
- [ ] All components integrated into main page
- [ ] Consistent styling and responsive design
- [ ] Loading indicators for all async operations
- [ ] Keyboard shortcuts and accessibility features
- [ ] Performance optimization for large cell lines
- [ ] Browser compatibility testing

**Implementation Details**:
```typescript
// Main page integration:
// - CellLineSelector for initial selection
// - EditorContainer with state management
// - EditorHeader with save/cancel controls
// - PseudoEditor for main editing
// - ValidationDisplay for errors
// - NetworkErrorDisplay for API issues
```

**Files to Modify**:
- `page.tsx` - Complete integration
- All components - Final polish and optimization

---

## Testing Tasks

### TASK-TEST-1: Unit Tests
**Agent**: Frontend  
**Effort**: 3 days  
**Dependencies**: All development tasks

**Context**: Create comprehensive unit tests for all components and utilities.

**Test Coverage**:
- [ ] Schema processing and field generation
- [ ] State management and reducer logic
- [ ] Field editor components
- [ ] API client functions
- [ ] Validation utilities
- [ ] JSON manipulation functions

### TASK-TEST-2: Integration Tests
**Agent**: Backend + Frontend  
**Effort**: 2 days  
**Dependencies**: TASK-TEST-1

**Context**: Create end-to-end tests for complete workflows.

**Test Scenarios**:
- [ ] Complete cell line editing workflow
- [ ] New cell line creation
- [ ] Validation error handling
- [ ] Search and selection functionality

### TASK-TEST-3: Performance Testing
**Agent**: Backend + Frontend  
**Effort**: 1 day  
**Dependencies**: TASK-TEST-2

**Context**: Verify performance requirements with realistic data sizes.

**Performance Targets**:
- [ ] Editor loads in under 2 seconds
- [ ] Save operations complete in under 3 seconds
- [ ] Search through 3000+ cell lines performs well
- [ ] No memory leaks during extended editing

---

## Dependencies and Critical Path

### Critical Path:
1. **TASK-PRE-1** → **TASK-BE-1** → **TASK-BE-3** → **TASK-FE-7**
2. **TASK-FE-1** → **TASK-FE-2** → **TASK-FE-3** → **TASK-FE-6**
3. **TASK-BE-2** → **TASK-FE-4** → **TASK-FE-5**

### Parallel Work Opportunities:
- **TASK-BE-2** can be developed in parallel with **TASK-BE-1**
- **TASK-FE-1** through **TASK-FE-3** can proceed independently
- **TASK-FE-10** can be developed in parallel with **TASK-FE-8** and **TASK-FE-9**

### Risk Mitigation:
- Start **TASK-FE-4** early to identify schema processing issues
- Implement **TASK-FE-11** incrementally throughout development
- Regular integration testing between backend and frontend teams

## Success Criteria

### Phase 1 Complete When:
- [ ] All tasks marked as complete with acceptance criteria met
- [ ] Manual testing scenarios pass with Dr. Butcher feedback
- [ ] Performance requirements met for target data sizes
- [ ] Code review completed for all components
- [ ] Documentation updated and deployment ready

### Handoff Readiness:
- [ ] Core editor stable and production-ready
- [ ] Version control infrastructure in place (unused)
- [ ] Architecture supports Phase 2 comparison features
- [ ] User feedback collected and Phase 2 requirements refined 