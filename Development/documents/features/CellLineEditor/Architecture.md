# CellLineEditor Frontend Architecture

## Overview

This document captures the finalized frontend component architecture for the CellLineEditor feature. These decisions were made during the design phase and should be followed during implementation.

## Core Design Principles

1. **Text Editor Interface**: Monaco Editor (VSCode-like) for editing JSON with raw field names
2. **Schema-Driven Validation**: Real-time validation and auto-completion based on Pydantic schema
3. **Raw Data Visibility**: Users work directly with JSON structure using exact schema field names
4. **GitHub-Style Diffs**: Line-by-line comparison for version control like Git/GitHub
5. **No Optimistic Updates**: UI shows only real accepted state from server
6. **Manual Save Only**: No auto-save complexity, clear user control

## Data Models Architecture

### Database Schema Design

**Storage Strategy**: Single JSONField approach for cell line metadata (150+ fields with nesting)
**Version Strategy**: Full snapshot storage for simplicity and reliability
**Model Integration**: Separate CellLine model with OneToOne relationship to existing CurationObject

### Django Models

```python
class CellLine(models.Model):
    """
    Main cell line model storing current metadata and lock state
    """
    hpscreg_id = models.CharField(max_length=100, unique=True)
    metadata = models.JSONField()  # Complete cell line metadata (~150 fields)
    curation_object = models.OneToOneField(CurationObject, on_delete=models.CASCADE)
    
    # Concurrency control
    is_locked = models.BooleanField(default=False)
    locked_by = models.CharField(max_length=100, null=True, blank=True)
    locked_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cellline'
        indexes = [
            models.Index(fields=['hpscreg_id']),
            models.Index(fields=['is_locked']),
        ]

class CellLineVersion(models.Model):
    """
    Version history storing complete snapshots of cell line metadata
    """
    cell_line = models.ForeignKey(CellLine, on_delete=models.CASCADE, related_name='versions')
    version_number = models.PositiveIntegerField()
    metadata = models.JSONField()  # Complete snapshot of metadata at this version
    
    # Version metadata
    created_by = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    change_summary = models.TextField(blank=True)
    
    # Version retention management
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'cellline_version'
        unique_together = ['cell_line', 'version_number']
        indexes = [
            models.Index(fields=['cell_line', 'version_number']),
            models.Index(fields=['created_on']),
            models.Index(fields=['is_archived']),
        ]
        ordering = ['-version_number']
```

### Key Architectural Decisions

#### 1. JSON Storage Strategy
- **Single JSONField**: All 150+ cell line fields stored in one `metadata` JSONField
- **Benefits**: Flexible schema evolution, efficient for nested structures, simple queries
- **Trade-offs**: No SQL-level validation, potential for large field sizes (4-10KB per cell line)

#### 2. Version Control Strategy
- **Full Snapshots**: Each version stores complete metadata (not deltas)
- **Benefits**: Simple implementation, fast version retrieval, no reconstruction needed
- **Trade-offs**: Higher storage usage, but acceptable given 4-10KB size per version

#### 3. Concurrency Control
- **Simple Locking**: Boolean `is_locked` flag with user and timestamp tracking
- **Lock Expiration**: Automatic cleanup after 30 minutes of inactivity
- **Implementation**: Middleware or background task to clear expired locks

#### 4. Version Retention
- **Last 10 Versions**: Automatic cleanup beyond 10 versions per cell line
- **Soft Deletion**: Use `is_archived` flag rather than hard deletion
- **Background Cleanup**: Periodic task to archive old versions

#### 5. Model Integration
- **OneToOne with CurationObject**: Maintains compatibility with existing audit/curation system
- **Separate Model**: CellLine model dedicated to editor functionality
- **Foreign Key Cascade**: Versions automatically deleted if parent CellLine is deleted

### Database Migration Strategy

#### Migration from Filesystem JSON Files
```python
# Migration script structure
def migrate_json_files_to_database():
    """
    Migrate existing cell_line_X.json files to database
    """
    for json_file in glob.glob('cell_line_*.json'):
        # Parse hpscreg_id from filename
        # Create CurationObject entry
        # Create CellLine entry with metadata
        # Create initial version entry
```

#### Prerequisites
- **TODO-1**: Complete filesystem to database migration before Phase 1 implementation
- **Validation**: Ensure all existing JSON files conform to expected schema
- **Backup Strategy**: Full backup of filesystem JSON files before migration

## Component Hierarchy

```
CellLineEditor (main page)
├── CellLineSelector (search/select existing or "Add New")
├── EditorContainer (manages edit vs comparison modes)
│   ├── EditorHeader (save, cancel, mode toggle, file indicator)
│   ├── PseudoEditor (custom editor with hidden JSON syntax)
│   │   ├── SchemaValidation (real-time validation with line highlighting)
│   │   ├── FieldRenderer (displays field names as read-only)
│   │   ├── ValueEditor (inline editing for values only)
│   │   ├── JSONConverter (maintains hidden JSON structure)
│   │   └── CollapsibleSections (nested structure folding)
│   ├── DiffViewer (GitHub-style side-by-side comparison)
│   │   ├── ChangeStatistics (+additions, -deletions, ~modifications)
│   │   ├── CleanSyntaxDiff (diff without JSON syntax clutter)
│   │   ├── SelectiveApply (checkboxes for individual changes)
│   │   └── DiffOptions (show only differences, etc.)
│   └── ValidationDisplay (error messages with line numbers)
├── VersionPanel (version history timeline)
└── NetworkErrorDisplay (simple error message + retry prompt)
```

## State Management Strategy

**Approach**: React Context + useReducer

### State Structure
```typescript
interface EditorState {
  originalCellLine: CellLineData;     // Original data from database
  currentCellLine: CellLineData;      // Current data with user edits
  comparisonCellLine?: CellLineData;  // When comparing with previous version
  mode: 'edit' | 'compare';          // Current editor mode
  validationErrors: ValidationError[]; // Errors from last save attempt
  isSaving: boolean;                  // Loading state during save operation
}

interface CellLineData {
  hpscreg_id: string;
  metadata: Record<string, any>;      // 150+ fields as JSON
  version_number?: number;
  created_by?: string;
  created_on?: string;
}

interface ValidationError {
  field: string;
  message: string;
}
```

### State Actions
```typescript
type EditorAction = 
  | { type: 'LOAD_CELL_LINE'; payload: CellLineData }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: any } }
  | { type: 'SET_MODE'; payload: 'edit' | 'compare' }
  | { type: 'LOAD_COMPARISON'; payload: CellLineData }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationError[] }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SAVE_SUCCESS'; payload: CellLineData }
  | { type: 'CLEAR_COMPARISON' };
```

## Key Component Designs

### PseudoEditor Component

**File Organization**: Custom pseudo-text-editor implementation
- `PseudoEditor/CellLineEditor.tsx` - Main pseudo-editor wrapper
- `PseudoEditor/SchemaValidation.tsx` - Real-time validation logic
- `PseudoEditor/FieldRenderer.tsx` - Field name and value rendering
- `PseudoEditor/ValueEditor.tsx` - Inline value editing components
- `PseudoEditor/JSONConverter.tsx` - Hidden JSON structure management
- `PseudoEditor/types.ts` - Shared interfaces

**Interface**:
```typescript
interface CellLinePseudoEditorProps {
  data: CellLineData;               // Structured cell line data object
  schema: JsonSchema;               // Pydantic schema as JSON Schema
  mode: 'edit' | 'readonly';
  onChange?: (data: CellLineData) => void;
  onValidation?: (errors: ValidationError[]) => void;
  onSave?: () => void;
}
```

**Pseudo-Editor Configuration**:
```typescript
const editorFeatures = {
  lineNumbers: true,
  collapsibleSections: true,
  valueOnlyEditing: true,            // Only values are editable
  hiddenJSONStructure: true,         // JSON syntax completely hidden
  inlineValidation: true,
  tabNavigation: true                // Tab between editable values
};
```

**Value-Only Editing Strategy**: 
- **No JSON Syntax**: Quotes, braces, brackets, commas completely hidden from user
- **Field Names Read-Only**: All field names displayed but cannot be edited
- **Values Editable**: Only field values can be clicked and edited in-place
- **Structure Preserved**: JSON structure maintained internally, invisible to user
- **Error-Proof**: Impossible to create JSON syntax errors

### DiffViewer Component

**GitHub-Style Diff Implementation**:
```typescript
interface CellLineDiffViewerProps {
  originalValue: string;            // Previous version JSON
  modifiedValue: string;            // Current version JSON
  originalTitle?: string;           // "v4 (Previous)"
  modifiedTitle?: string;           // "v5 (Current)"
  showStats?: boolean;              // Show +/- change statistics
  onSelectChange?: (selectedLines: number[]) => void;
}
```

**Diff Features**:
- Side-by-side comparison with line numbers
- Change statistics: "+3 additions -1 deletion 2 changes"
- Line-by-line highlighting (green/red/yellow)
- Selective apply with checkboxes
- Filter options (show only differences, word-level diff)

### Schema Validation Integration

**Real-time Validation Strategy**:
```typescript
// Monaco JSON language configuration with custom schema
monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
  schemas: [{
    uri: 'cellline://schema.json',
    fileMatch: ['*.cellline.json'],
    schema: pydanticSchemaAsJsonSchema
  }]
});
```

**Custom Validation Beyond Schema**:
- Business logic validation (e.g., hpscreg_id uniqueness)
- Cross-field validation
- Required field validation with context-aware messages

### JSON Formatting Component

**Consistent Formatting for Clean Diffs**:
```typescript
const formatCellLineJSON = (data: any): string => {
  // Sort keys alphabetically for consistent ordering
  const sortedData = sortKeysDeep(data);
  
  // Format with 2-space indentation
  return JSON.stringify(sortedData, null, 2);
};
```

**Benefits**:
- Each field on separate line for granular diffs
- Consistent key ordering prevents false diffs
- Proper indentation shows JSON hierarchy clearly

## Data Flow Architecture

### User Interaction Flow
```
User Input → UnifiedField → EditorContainer State Update → Re-render
```

### Save Operation Flow
```
Save Button → Validation → API Call → Success/Error Display
                               ↓
Network Success → Update original data → Clear dirty state
Network Error → Show error message + retry button
```

### Version Comparison Flow
```
Version Select → Fetch comparison data → Update state → Re-render with diff highlighting
```

**No Optimistic Updates**: UI only shows data confirmed by server

## Performance Considerations

### Data Management
- **Typical cell line size**: 4KB - 10KB
- **Memory strategy**: Keep only current + comparison cell line in memory
- **Version loading**: On-demand fetching when user selects specific version

### Rendering Optimizations
- **Schema caching**: `useMemo` for processed schema
- **Virtual scrolling**: For cell line selector (3000+ items)
- **Lazy loading**: Field groups expand on-demand
- **Debounced inputs**: For search functionality

## Validation Strategy

### Validation Framework Architecture

**Validation Layer**: Separate validation layer in Django backend
- **Includes Pydantic Model**: Pydantic model validation integrated within the layer
- **Server-Side Validation**: All validation logic runs on Django backend for security and single source of truth
- **Custom Business Rules**: Framework supports domain-specific validation rules beyond schema (TODO: Design implementation)

**Timing**: Validation occurs only on save attempt
- No real-time validation during typing
- No validation on field blur
- Clear validation errors displayed after save attempt
- Simple and predictable for non-technical users

### Error Display Strategy

**Visual Error Indication**:
- **Red Field Highlighting**: Fields with validation errors highlighted with red background/border
- **Hover Tooltips**: Error messages displayed in tooltips when hovering over highlighted fields
- **Nested Object Support**: Error highlighting and tooltips work at any nesting level within JSON structure
- **Field Path Resolution**: Frontend parses field paths (e.g., "nested.object.field") to highlight correct components

**Error Response Format**:
```json
{
  "errors": {
    "field_path": "Error message",
    "nested.object.field": "Another error message", 
    "array_field[0].sub_field": "Array item error message"
  }
}
```

**Error Handling Workflow**:
1. User clicks "Save" button
2. Frontend sends data to Django validation endpoint
3. Server runs validation layer (Pydantic + custom rules)
4. If validation fails, server returns field-specific error messages
5. Frontend highlights problematic fields and shows tooltips
6. Save operation prevented until all errors resolved
7. Error messages cleared on successful save

## Error Handling

### Network Failures
- Display simple error message: "Network failure occurred"
- Provide retry button
- No complex retry logic or offline capabilities

### Validation Failures
- Display field-level error messages
- Highlight problematic fields
- Prevent save until errors resolved
- Clear error messages on successful save

## Diff Visualization

**Granularity**: Line-level highlighting (like GitHub/Git diffs)

**Visual Indicators**:
- **Modified lines**: Yellow/orange background on changed JSON lines
- **Added lines**: Green background for new lines in current version
- **Removed lines**: Red background for lines removed from previous version
- **Change Statistics**: "+3 additions -1 deletion 2 changes" summary
- **Selective Apply**: Checkboxes to apply individual line changes back to editor

## File Organization Structure

```
src/app/components/CellLineEditor/
├── CellLineEditor.tsx              // Main page component
├── CellLineSelector.tsx            // Search and selection
├── EditorContainer.tsx             // Mode management (edit vs diff)
├── EditorHeader.tsx                // Save/cancel controls, file indicator
├── MonacoEditor/
│   ├── CellLineEditor.tsx          // Main Monaco editor wrapper
│   ├── SchemaValidation.tsx        // Real-time validation logic
│   ├── AutoCompletion.tsx          // Schema-aware completions
│   ├── JSONFormatting.tsx          // Consistent formatting
│   └── types.ts                    // Monaco-specific interfaces
├── DiffViewer/
│   ├── CellLineDiffViewer.tsx      // GitHub-style diff component
│   ├── ChangeStatistics.tsx        // +/- change summary
│   ├── SelectiveApply.tsx          // Checkbox selection for changes
│   └── DiffOptions.tsx             // Diff viewing options
├── VersionPanel.tsx                // Version history timeline
├── ValidationDisplay.tsx           // Error messages with line numbers
├── NetworkErrorDisplay.tsx         // Network error handling
└── context/
    ├── EditorContext.tsx           // State management
    └── types.ts                    // Context type definitions
```

## API Design & Integration

### REST Endpoints

#### Cell Line Management
```
GET    /api/celllines/                           # List cell lines (paginated, searchable)
GET    /api/celllines/{hpscreg_id}/              # Get specific cell line details
POST   /api/celllines/                           # Create new cell line
PUT    /api/celllines/{hpscreg_id}/              # Update existing cell line
DELETE /api/celllines/{hpscreg_id}/              # Delete cell line (if needed)
```

#### Version Management
```
GET    /api/celllines/{hpscreg_id}/versions/           # List version history
GET    /api/celllines/{hpscreg_id}/versions/{version}/ # Get specific version data
```

#### Lock Management
```
POST   /api/celllines/{hpscreg_id}/lock/    # Acquire edit lock (auto on editor open)
DELETE /api/celllines/{hpscreg_id}/lock/    # Release edit lock (on save/browser close)
GET    /api/celllines/{hpscreg_id}/lock/    # Check current lock status
```

#### Schema & Validation
```
GET    /api/schema/cellline/               # Get JSON schema (for development)
POST   /api/celllines/validate/            # Validate cell line data
```

### Request/Response Formats

#### Cell Line List Response
```json
{
  "count": 2847,
  "next": "/api/celllines/?page=2&search=UCSF",
  "previous": null,
  "page_size": 10,
  "results": [
    {
      "hpscreg_id": "UCSFi001-A",
      "display_name": "Human iPSC line UCSFi001-A", 
      "last_modified": "2024-01-15T10:30:00Z",
      "is_locked": false,
      "locked_by": null
    }
  ]
}
```

#### Cell Line Detail Response
```json
{
  "hpscreg_id": "UCSFi001-A",
  "metadata": {
    "cell_line_name": "UCSFi001-A",
    "donor_information": {
      "age": 45,
      "sex": "Female",
      "ethnicity": "Caucasian"
    },
    "culture_conditions": {
      "medium": "mTeSR1",
      "passage_number": 15
    }
    // ... 150+ fields as nested JSON
  },
  "version_number": 5,
  "created_on": "2024-01-01T10:00:00Z",
  "modified_on": "2024-01-15T10:30:00Z",
  "is_locked": false,
  "locked_by": null,
  "locked_at": null
}
```

#### Save Request Format
```json
{
  "metadata": {
    // Complete updated metadata object (150+ fields)
  }
}
```

#### Version History Response
```json
{
  "versions": [
    {
      "version_number": 5,
      "created_by": "dr.butcher",
      "created_on": "2024-01-15T10:30:00Z"
    },
    {
      "version_number": 4,
      "created_by": "dr.butcher",
      "created_on": "2024-01-10T14:20:00Z"
    }
    // ... up to 10 versions (most recent first)
  ]
}
```

### Authentication & Authorization

#### Permission Requirements
```python
# Django permissions
class CellLineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasEditorPermission]
    
    def get_permissions(self):
        """
        Only users with editor permissions can modify cell lines
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), HasEditorPermission()]
        return [IsAuthenticated()]
```

#### User Context in Responses
```json
{
  "current_user": "dr.butcher",
  "can_edit": true,
  "permissions": ["cellline.edit", "cellline.create"]
}
```

### Error Handling Patterns

#### Validation Errors (400 Bad Request)
```json
{
  "error": "validation_failed",
  "message": "Cell line data validation failed",
  "field_errors": [
    {
      "field": "donor_information.age",
      "message": "Age must be between 0 and 120"
    },
    {
      "field": "culture_conditions.passage_number",
      "message": "Passage number is required"
    }
  ]
}
```

#### Lock Conflicts (409 Conflict)
```json
{
  "error": "resource_locked", 
  "message": "Cell line is currently being edited by another user",
  "locked_by": "other.user",
  "locked_at": "2024-01-15T10:00:00Z"
}
```

#### Permission Denied (403 Forbidden)
```json
{
  "error": "permission_denied",
  "message": "You do not have permission to edit cell lines"
}
```

#### Network/Server Errors (500 Internal Server Error)
```json
{
  "error": "server_error",
  "message": "An unexpected error occurred. Please try again later.",
  "error_id": "uuid-for-server-logging"
}
```

### Lock Management Implementation

#### Browser-Aware Lock Strategy
```javascript
// Frontend: Auto-acquire lock when opening editor
useEffect(() => {
  const acquireLock = async () => {
    try {
      await api.post(`/api/celllines/${hpscreg_id}/lock/`);
      setIsLocked(true);
    } catch (error) {
      // Handle lock conflict
    }
  };
  
  acquireLock();
  
  // Release lock on browser close/tab close
  const handleBeforeUnload = () => {
    navigator.sendBeacon(`/api/celllines/${hpscreg_id}/lock/`, 
                        JSON.stringify({method: 'DELETE'}));
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hpscreg_id]);
```

#### Backend Lock Management
```python
# No automatic lock expiration - only released on save or browser close
class CellLineLockView(APIView):
    def post(self, request, hpscreg_id):
        """Acquire edit lock"""
        cell_line = get_object_or_404(CellLine, hpscreg_id=hpscreg_id)
        
        if cell_line.is_locked and cell_line.locked_by != request.user.username:
            return Response({
                "error": "resource_locked",
                "locked_by": cell_line.locked_by,
                "locked_at": cell_line.locked_at
            }, status=409)
            
        cell_line.is_locked = True
        cell_line.locked_by = request.user.username
        cell_line.locked_at = timezone.now()
        cell_line.save()
        
        return Response({"locked": True})
    
    def delete(self, request, hpscreg_id):
        """Release edit lock"""
        cell_line = get_object_or_404(CellLine, hpscreg_id=hpscreg_id)
        cell_line.is_locked = False
        cell_line.locked_by = None
        cell_line.locked_at = None
        cell_line.save()
        
        return Response({"locked": False})
```

### Performance Optimizations

#### Pagination Settings
- **Page Size**: 10 cell lines per page (adjustable)
- **Search**: Simple text search across `hpscreg_id` and `display_name`
- **Ordering**: Most recently modified first

#### Caching Strategy
- **Schema Responses**: Cache schema API responses
- **Version Data**: Cache version history per cell line
- **Search Results**: Cache search results for common queries

### Integration Points

#### With Existing Django System
- **Authentication**: Use existing Django authentication system
- **Permissions**: Integrate with Django's permission framework
- **Models**: OneToOne relationship with existing CurationObject model
- **Admin**: Django admin interface for cell line management

#### With Next.js Frontend
- **Layout**: Integrate with existing AppLayout, Navbar, Sidebar components
- **Routing**: Add to existing Next.js routing structure at `/tools/celllines/`
- **Styling**: Follow existing design system and CSS patterns
- **API Client**: Use existing API client patterns and error handling

## Implementation Phases

These components should be built in this order for dependency management:

1. **Phase 1**: EditorContext, MonacoEditor integration, basic JSON editing
2. **Phase 2**: Schema validation, auto-completion, JSON formatting
3. **Phase 3**: Version management, DiffViewer, GitHub-style comparison
4. **Phase 4**: Selective apply, advanced diff options, performance optimizations

## Technical Dependencies

### Required NPM Packages
```json
{
  "react-diff-viewer-continued": "^3.3.1",
  "ajv": "^8.12.0",
  "lodash": "^4.17.21"
}
```

### Key Technical Requirements
- **Custom Pseudo-Editor**: React component that looks like text editor but hides JSON syntax
- **JSON Schema Validation**: Real-time validation using Pydantic schema
- **Value-Only Editing**: Only field values editable, field names and structure protected
- **Hidden Structure Management**: JSON structure maintained internally, invisible to user
- **Clean Diff Generation**: Line-by-line diff without JSON syntax clutter
- **Performance**: Handle 150+ field structured data efficiently

### Pseudo-Editor Implementation

**Custom Editor Structure**:
```typescript
// Pseudo-editor that renders clean field:value pairs
const PseudoEditor: React.FC<PseudoEditorProps> = ({ data, schema, onChange }) => {
  const [lineData, setLineData] = useState<LineItem[]>([]);
  
  // Convert structured data to line-based representation
  const dataToLines = (obj: any, path: string = '', indent: number = 0): LineItem[] => {
    const lines: LineItem[] = [];
    
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Section header (collapsible)
        lines.push({
          lineNumber: lines.length + 1,
          type: 'section',
          fieldName: key,
          value: null,
          indent,
          isCollapsible: true,
          isExpanded: true
        });
        
        // Nested content
        lines.push(...dataToLines(value, `${path}.${key}`, indent + 1));
      } else {
        // Field with editable value
        lines.push({
          lineNumber: lines.length + 1,
          type: 'field',
          fieldName: key,
          value: value,
          indent,
          path: `${path}.${key}`
        });
      }
    });
    
    return lines;
  };
  
  return (
    <div className="pseudo-editor">
      {lineData.map(line => (
        <EditorLine
          key={line.lineNumber}
          line={line}
          onChange={(newValue) => handleValueChange(line.path, newValue)}
        />
      ))}
    </div>
  );
};
```

**Value Editing Component**:
```typescript
// Inline value editor for each field
const ValueEditor: React.FC<{ value: any; onChange: (value: any) => void }> = ({ 
  value, onChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  
  return (
    <span 
      className="value-editor"
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => {
            onChange(editValue);
            setIsEditing(false);
          }}
          autoFocus
        />
      ) : (
        <span className="display-value">{value}</span>
      )}
    </span>
  );
};
```

**Visual Styling**:
```css
.pseudo-editor {
  font-family: 'Monaco', 'Courier New', monospace;
  background: #ffffff;
  border: 1px solid #e1e4e8;
}

.field-name {
  color: #6f42c1;
  font-weight: normal;
  cursor: default;
}

.display-value {
  color: #032f62;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
}

.display-value:hover {
  background-color: #f1f8ff;
  border: 1px solid #c8e1ff;
}

.value-editor input {
  border: 2px solid #0366d6;
  padding: 2px 4px;
  font-family: inherit;
}
```

## Notes for Implementation

- **Raw Field Names**: Use exact schema field names (snake_case), no friendly mapping
- **Browser support**: Modern browsers with Monaco Editor support (Chrome, Firefox, Safari, Edge)
- **Text Editor Focus**: Desktop-optimized interface, tablet acceptable
- **Accessibility**: Standard editor accessibility practices (keyboard navigation, screen reader support)
- **Testing strategy**: Unit tests for Monaco integration, diff viewer, integration tests for full workflow

---

*This architecture document reflects the text editor approach decided in Design Conversation 4. Any significant architectural changes should be documented here.* 