# TASK-FE-1: Custom Editor Frontend Implementation

**Task ID**: TASK-FE-1  
**Phase**: 1 (Core Editor)  
**Sprint**: 2 (Custom Editor Foundation)  
**Assignee**: Frontend Implementation Agent  
**Estimated Duration**: 1.5-2 weeks  
**Dependencies**: ✅ TASK-BE-1 (Schema Introspection API completed)

## Task Overview

Build the **custom pseudo-text-editor** component that displays cell line data in a clean, text-editor-like interface without exposing JSON syntax. This implements the core editor interface specified in the wireframes for Dr. Suzy Butcher's cell line editing workflow.

## User Context

**End User**: Dr. Suzy Butcher (biology researcher, non-technical)  
**Use Case**: Edit complex cell line metadata (150+ fields) through an intuitive interface  
**Key Requirement**: "Text editor feel" without JSON complexity - users see clean `field: value` format

## Technical Specifications

### Core Architecture: Custom Pseudo-Text-Editor

**Visual Requirements**:
- Line numbers on the left (starting from 1)
- Clean `field: value` display without JSON syntax (no quotes, braces, commas)
- Collapsible sections with ▼/▶ arrows for nested objects/arrays
- Monospace font with text editor styling
- Error indicators (🔴) on lines with validation issues

**Behavioral Requirements**:
- **Value-only editing**: Click field values to edit, field names are read-only
- **Collapsible folding**: Click ▼/▶ to expand/collapse nested structures
- **Array management**: Add/remove array items with visual controls
- **Real-time validation**: Error highlighting with user-friendly messages

### Backend Integration

**Available APIs** (from completed TASK-BE-1):
- `GET /api/editor/cellline-schema/` - Field metadata for 77 fields
- `GET /api/editor/celllines/{id}/` - Retrieve cell line data
- `PUT /api/editor/celllines/{id}/` - Save changes
- `GET /api/editor/celllines/new_template/` - Blank template

**Schema API Response Structure**:
```typescript
interface FieldSchema {
  [fieldName: string]: {
    type: 'CharField' | 'JSONField' | 'IntegerField' | 'BooleanField';
    required: boolean;
    max_length?: number;
    choices?: string[];
    json_schema?: any;
    help_text?: string;
  }
}
```

## Implementation Requirements

### 1. Core Data Flow Implementation

Create the JSON-to-display-lines parser:

```typescript
interface DisplayLine {
  lineNumber: number;
  type: 'field' | 'object' | 'array_item' | 'array_control';
  fieldPath: string[];           // e.g., ['culture_conditions', 'medium']
  displayText: string;           // e.g., "    medium: mTeSR1"
  isCollapsible: boolean;
  isCollapsed: boolean;
  isEditable: boolean;           // true for values, false for field names
  value: any;                    // actual field value for editing
  validation?: ValidationError;
}
```

### 2. Component Architecture

**Main Component**: `CustomCellLineEditor`
- Props: `cellLineId`, `schema`, `onSave`, `onValidation`
- State: `displayLines`, `editingLine`, `validationErrors`
- Renders: Line-by-line editor interface

**Sub-Components**:
- `EditorLine` - Individual line rendering with edit controls
- `InlineEditor` - Type-specific value editors (text, select, boolean, array)
- `ArrayEditor` - Specialized component for array field management
- `CollapsibleSection` - Handles expand/collapse for nested objects

### 3. Editing Behavior

**Value-Only Editing**:
- Field names are read-only (styled as labels)
- Field values are clickable and editable
- No exposure of JSON syntax (quotes, braces, commas)

**Inline Editing**:
- Click value to enter edit mode
- Type-appropriate editors based on schema metadata
- Save on Enter/blur, cancel on Escape
- Real-time validation feedback

**Array Management**:
- Visual add/remove controls (➕ Add Item, ➖ Remove)
- Dynamic array item editing
- Proper index management

### 4. Visual Design Requirements

**Text Editor Aesthetics**:
```css
.custom-editor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #fafafa;
  border: 1px solid #ddd;
}

.line-number {
  width: 40px;
  text-align: right;
  color: #999;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
}

.editable-value:hover {
  background: #e6f3ff;
  border: 1px solid #0078d4;
  cursor: pointer;
}
```

## Acceptance Criteria

### ✅ Core Editor Display
- [ ] **JSON-to-lines parser** converts cell line data to displayable lines
- [ ] **Line numbers** start from 1 and increment properly
- [ ] **Clean formatting** shows `field: value` without JSON syntax
- [ ] **Indentation** reflects nested object hierarchy
- [ ] **Monospace styling** provides text editor appearance

### ✅ Interactive Editing
- [ ] **Value-only editing** - click values to edit, field names read-only
- [ ] **Inline editors** appear for text, select, boolean field types
- [ ] **Save on Enter/blur** commits changes properly
- [ ] **Cancel on Escape** discards changes and restores original value
- [ ] **Field validation** shows errors inline with 🔴 indicators

### ✅ Collapsible Sections
- [ ] **Nested objects** display with ▼/▶ arrows
- [ ] **Click to collapse** hides nested content and shows ▶
- [ ] **Click to expand** shows nested content and displays ▼
- [ ] **State persistence** maintains collapse state during editing

### ✅ Array Management
- [ ] **Array fields** display with proper item management
- [ ] **Add item** button (➕) creates new array entries
- [ ] **Remove item** button (➖) deletes specific array entries
- [ ] **Array validation** handles empty arrays appropriately

### ✅ Backend Integration
- [ ] **Schema API** integration fetches field metadata on component mount
- [ ] **Cell line loading** retrieves data via `/api/editor/celllines/{id}/`
- [ ] **Save functionality** sends updates via `PUT /api/editor/celllines/{id}/`
- [ ] **Error handling** displays API errors to user appropriately

### ✅ User Experience
- [ ] **Loading states** show appropriate spinners/indicators
- [ ] **Error messages** are user-friendly (not technical)
- [ ] **Performance** handles 150+ fields without lag
- [ ] **Responsive design** works on standard desktop screen sizes

## Testing Instructions

### 1. Component Testing
```bash
# Start the frontend development server
docker-compose up -d frontend

# Navigate to editor page
http://localhost:3000/tools/editor/{cellLineId}
```

### 2. Data Integration Testing
- Load existing cell line: `AIBNi001-A` (77 fields)
- Verify all field types render correctly
- Test editing various field types (text, boolean, arrays)
- Confirm save operations persist data

### 3. Schema Integration Testing
- Verify schema API data shapes inline editors correctly
- Test validation rules from schema (required fields, max length)
- Confirm choice fields render as select dropdowns

### 4. User Experience Testing
- Navigate through 150+ fields efficiently
- Test collapsible sections for complex nested objects
- Verify array add/remove operations work intuitively

## Success Indicators

### Functional Success
- Dr. Suzy Butcher can edit cell line without seeing JSON syntax
- All 150+ fields are accessible and editable
- Changes save correctly and persist in database
- Validation prevents invalid data entry

### Technical Success
- Component renders 150+ fields with good performance
- Schema integration provides proper field typing
- Error handling gracefully manages API failures
- Code follows React/TypeScript best practices

### User Experience Success
- Interface feels like editing a configuration file
- No technical knowledge required to use editor
- Clear visual feedback for all user actions
- Intuitive navigation through complex data structures

## Implementation Notes

### File Structure
```
src/app/tools/editor/
├── page.tsx                    # Editor page route
├── components/
│   ├── CustomCellLineEditor.tsx   # Main editor component
│   ├── EditorLine.tsx             # Individual line component
│   ├── InlineEditor.tsx           # Value editing component
│   ├── ArrayEditor.tsx            # Array management component
│   └── CollapsibleSection.tsx     # Expand/collapse component
├── hooks/
│   ├── useCellLineData.tsx        # Data fetching hook
│   └── useSchemaData.tsx          # Schema fetching hook
└── types/
    └── editor.ts                  # TypeScript interfaces
```

### Key Dependencies
- React 19.0.0 (already installed)
- TypeScript (configured)
- Existing API client setup
- TailwindCSS for styling

### Performance Considerations
- Virtual scrolling for large field counts (if needed)
- Debounced validation for real-time feedback
- Lazy loading of collapsed sections

## Completion Report Format

Submit completion report following the established template with:
- **Status**: ✅/⚠️/❌ with explanation
- **Acceptance Criteria**: Checkbox verification of all requirements
- **Demo Evidence**: Screenshots or video of working editor
- **Integration Testing**: Proof of backend API integration
- **User Experience**: Assessment of interface usability
- **Performance**: Load times and responsiveness metrics
- **Handoff Notes**: Any important information for next phase

## Getting Started

1. **Review Dependencies**: Confirm TASK-BE-1 completion report and API availability
2. **Study Technical Approach**: Read `Custom-Editor-Technical-Approach.md` thoroughly
3. **Environment Setup**: Ensure Docker environment is running
4. **Schema Exploration**: Test `/api/editor/cellline-schema/` endpoint
5. **Component Architecture**: Plan component hierarchy before coding
6. **Incremental Development**: Build parser → renderer → editor → integration

---

**This task implements the core custom editor interface for Phase 1 Sprint 2. Success here enables Phase 1 Sprint 3 (Interactive Editing) and ultimately Dr. Suzy Butcher's seamless cell line editing workflow.** 