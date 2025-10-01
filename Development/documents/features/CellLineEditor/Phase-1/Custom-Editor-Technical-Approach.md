# Custom Editor Technical Approach

## Overview

We're building a **custom pseudo-text-editor** that looks and feels like a traditional text editor (Monaco/VSCode style) but provides controlled editing behavior for JSON cell line data. This document outlines the technical approach for implementing this custom component.

## Core Requirements from Wireframes

### Visual Requirements
- Line numbers on the left (starting from 1)
- Clean `field: value` display without JSON syntax (no quotes, braces, commas)
- Collapsible sections with ▼/▶ arrows for nested objects/arrays
- Text editor styling (monospace font, syntax highlighting colors)
- Error indicators (🔴) on lines with validation issues

### Behavioral Requirements
- **Value-only editing**: Click field values to edit, field names are read-only
- **Collapsible folding**: Click ▼/▶ to expand/collapse nested structures
- **Array management**: Add/remove array items with visual controls
- **Validation feedback**: Real-time error highlighting and messages
- **No JSON syntax exposure**: Users never see quotes, braces, or commas

## Technical Architecture

### Core Data Flow
```
JSON Data (Backend) → Display Lines (Frontend) → Visual Rendering
     ↓                        ↓                        ↓
Field metadata          Line-by-line               User Interface
Schema rules           representation              Interactive elements
```

### Component Structure

```typescript
interface CustomEditorProps {
  value: any;                    // Raw JSON object from backend
  schema: FieldSchema;           // Field metadata from schema API
  onChange: (value: any) => void; // Callback when data changes
  onValidation: (errors: ValidationError[]) => void;
}

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

## Implementation Steps

### Phase 1: JSON-to-Lines Parser

Create a parser that converts JSON objects into displayable lines:

```typescript
const parseJSONToLines = (data: any, schema: FieldSchema): DisplayLine[] => {
  const lines: DisplayLine[] = [];
  let lineNumber = 1;
  
  const parseObject = (obj: any, path: string[] = [], indent: number = 0) => {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key];
      const fieldSchema = getFieldSchema(currentPath, schema);
      
      if (typeof value === 'object' && value !== null) {
        // Object or array - create collapsible section
        lines.push({
          lineNumber: lineNumber++,
          type: Array.isArray(value) ? 'array' : 'object',
          fieldPath: currentPath,
          displayText: `${'  '.repeat(indent)}${key}:`,
          isCollapsible: true,
          isCollapsed: false, // default expanded
          isEditable: false,
          value: value
        });
        
        // Recursively parse nested content
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            parseArrayItem(item, [...currentPath, index.toString()], indent + 1);
          });
        } else {
          parseObject(value, currentPath, indent + 1);
        }
      } else {
        // Simple field - create editable line
        lines.push({
          lineNumber: lineNumber++,
          type: 'field',
          fieldPath: currentPath,
          displayText: `${'  '.repeat(indent)}${key}: ${value}`,
          isCollapsible: false,
          isCollapsed: false,
          isEditable: true,
          value: value
        });
      }
    });
  };
  
  parseObject(data);
  return lines;
};
```

### Phase 2: Line Rendering Component

Create a component that renders each line with appropriate controls:

```typescript
const EditorLine: React.FC<{
  line: DisplayLine;
  onEdit: (path: string[], newValue: any) => void;
  onToggleCollapse: (path: string[]) => void;
}> = ({ line, onEdit, onToggleCollapse }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(line.value);
  
  const handleValueClick = () => {
    if (line.isEditable) {
      setIsEditing(true);
    }
  };
  
  const handleSave = () => {
    onEdit(line.fieldPath, editValue);
    setIsEditing(false);
  };
  
  return (
    <div className="editor-line">
      <span className="line-number">{line.lineNumber}</span>
      
      {line.isCollapsible && (
        <button 
          className="collapse-button"
          onClick={() => onToggleCollapse(line.fieldPath)}
        >
          {line.isCollapsed ? '▶' : '▼'}
        </button>
      )}
      
      <span className="line-content">
        {isEditing ? (
          <InlineEditor 
            value={editValue}
            onChange={setEditValue}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            fieldType={getFieldType(line.fieldPath)}
          />
        ) : (
          <span 
            onClick={handleValueClick}
            className={line.isEditable ? 'editable-value' : 'readonly-field'}
          >
            {line.displayText}
          </span>
        )}
      </span>
      
      {line.validation && (
        <span className="error-indicator">🔴</span>
      )}
    </div>
  );
};
```

### Phase 3: Inline Editing Components

Create specialized editors for different field types:

```typescript
const InlineEditor: React.FC<{
  value: any;
  onChange: (value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  fieldType: FieldType;
}> = ({ value, onChange, onSave, onCancel, fieldType }) => {
  switch (fieldType.type) {
    case 'CharField':
      if (fieldType.choices) {
        return <SelectEditor {...props} options={fieldType.choices} />;
      }
      return <TextEditor {...props} maxLength={fieldType.max_length} />;
      
    case 'IntegerField':
      return <NumberEditor {...props} />;
      
    case 'BooleanField':
      return <BooleanEditor {...props} />;
      
    case 'JSONField':
      // Handle arrays differently
      if (fieldType.json_schema?.type === 'array') {
        return <ArrayEditor {...props} />;
      }
      return <TextEditor {...props} />;
      
    default:
      return <TextEditor {...props} />;
  }
};
```

### Phase 4: Array Management

Special handling for JSON arrays with add/remove controls:

```typescript
const ArrayEditor: React.FC<ArrayEditorProps> = ({ 
  items, 
  onAddItem, 
  onRemoveItem, 
  onEditItem 
}) => {
  return (
    <div className="array-editor">
      {items.map((item, index) => (
        <div key={index} className="array-item">
          <InlineEditor 
            value={item}
            onChange={(newValue) => onEditItem(index, newValue)}
            fieldType={getArrayItemType()}
          />
          <button 
            className="remove-item"
            onClick={() => onRemoveItem(index)}
          >
            ➖ Remove
          </button>
        </div>
      ))}
      <button 
        className="add-item"
        onClick={onAddItem}
      >
        ➕ Add Item
      </button>
    </div>
  );
};
```

## Styling Approach

### Text Editor Aesthetics
```css
.custom-editor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #fafafa;
  border: 1px solid #ddd;
  padding: 0;
}

.editor-line {
  display: flex;
  align-items: center;
  min-height: 21px;
  border-bottom: 1px solid transparent;
}

.editor-line:hover {
  background: #f0f0f0;
}

.line-number {
  width: 40px;
  text-align: right;
  padding-right: 10px;
  color: #999;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
}

.collapse-button {
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 4px;
}

.editable-value {
  cursor: pointer;
  padding: 1px 4px;
  border-radius: 2px;
}

.editable-value:hover {
  background: #e6f3ff;
  border: 1px solid #0078d4;
}

.readonly-field {
  color: #666;
}

.error-indicator {
  margin-left: 8px;
  font-size: 12px;
}
```

## Benefits of This Approach

### For Users
- **Familiar Interface**: Looks like editing config files or code
- **No JSON Complexity**: Never see quotes, braces, or syntax errors
- **Clear Hierarchy**: Indentation shows data structure naturally
- **Precise Control**: Edit only values, never accidentally break structure

### For Developers  
- **Full Control**: Every interaction can be customized
- **Schema Integration**: Direct mapping between schema and UI behavior
- **Validation Integration**: Real-time feedback at the line level
- **Diff-Friendly**: Clean line-by-line structure for version comparison

## Technical Challenges & Solutions

### Challenge: Performance with Large JSON
**Solution**: Virtual scrolling for large objects, lazy rendering of collapsed sections

### Challenge: Maintaining JSON Structure Integrity
**Solution**: Internal JSON state separate from display state, with serialization/deserialization

### Challenge: Complex Nested Array Editing
**Solution**: Specialized array editors with visual add/remove controls

### Challenge: Real-time Validation
**Solution**: Debounced validation with line-level error indicators

## Implementation Timeline

**Week 1**: JSON parser and basic line rendering
**Week 2**: Inline editing and collapsible sections  
**Week 3**: Array management and validation integration
**Week 4**: Styling, performance optimization, and testing

This custom editor approach will give us exactly the interface shown in the wireframes while maintaining full control over the editing experience. 