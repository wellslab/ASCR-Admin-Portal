# TASK-UX-3: Visual Diff Highlighting and Nested Object Handling

**Project**: ASCR Web Services - CellLineEditor  
**Phase**: Phase 2 Sprint 6 - UX Optimization  
**Task Type**: Frontend Implementation  
**Estimated Duration**: 3-4 days  
**Dependencies**: TASK-UX-1 (Layout), TASK-UX-2 (Diff Algorithm)  

## Task Objective

Implement the visual highlighting system that renders diff results from TASK-UX-2 with color-coded indicators, expandable nested objects, and professional visual design. Create intuitive visual scanning for Dr. Suzy Butcher to quickly identify changes across 150+ fields.

## Context & Background

Dr. Suzy Butcher needs to visually scan differences between cell line versions quickly and efficiently. The visual highlighting system must provide immediate visual cues about what has changed while maintaining clean, professional appearance for extended curation sessions.

**Current State**: Layout structure ready, diff algorithm producing structured change data  
**Target State**: Complete visual diff interface with color-coded highlighting and interactive nested object exploration

## Visual Design Specifications

### **Color Coding System**
Based on the 5 change types from TASK-UX-2:

1. **UNCHANGED**: No highlighting, normal text color
   ```css
   background: transparent;
   color: #333333;
   ```

2. **MODIFIED**: Yellow highlighting across both panels
   ```css
   background: #FFF3CD;
   border-left: 4px solid #FFE066;
   color: #856404;
   ```

3. **ADDED**: Green highlighting across both panels  
   ```css
   background: #D4E6D4;
   border-left: 4px solid #28A745;
   color: #155724;
   ```

4. **REMOVED**: Red highlighting across both panels
   ```css
   background: #F8D7DA;
   border-left: 4px solid #DC3545;
   color: #721C24;
   ```

5. **NOT_SET**: Light gray, minimal emphasis
   ```css
   background: #F8F9FA;
   color: #6C757D;
   font-style: italic;
   ```

### **Full-Width Color Highlighting**
- **Horizontal bands**: Color spans across both panels for changed fields
- **Visual scanning**: Eye catches colored rows first, then reads left vs right content
- **Subtle borders**: Left border accent for change type identification
- **Consistent spacing**: Maintain field alignment regardless of highlighting

### **Field Value Display**
```typescript
// Display format for different field states
const fieldDisplayFormats = {
  UNCHANGED: "donor_age: 45",
  MODIFIED: "donor_age: 45 → 46", // Optional arrow for clarity
  ADDED: "medical_history: [NOT SET] → \"No known conditions\"",
  REMOVED: "genetic_background: \"Wild type\" → [NOT SET]",
  NOT_SET: "optional_field: [NOT SET]"
};
```

## Component Structure

### **Core Components to Implement**

#### **1. DiffViewer Component**
```typescript
interface DiffViewerProps {
  diffResults: DiffResult[];
  showDifferencesOnly: boolean;
  onFieldExpand?: (fieldPath: string) => void;
  onFieldCollapse?: (fieldPath: string) => void;
}

export function DiffViewer({ 
  diffResults, 
  showDifferencesOnly, 
  onFieldExpand, 
  onFieldCollapse 
}: DiffViewerProps) {
  // Implementation here
}
```

#### **2. DiffField Component**
```typescript
interface DiffFieldProps {
  diffResult: DiffResult;
  isExpanded?: boolean;
  indentLevel?: number;
  showDifferencesOnly: boolean;
}

function DiffField({ 
  diffResult, 
  isExpanded, 
  indentLevel = 0, 
  showDifferencesOnly 
}: DiffFieldProps) {
  // Implementation here
}
```

#### **3. FieldValue Component**
```typescript
interface FieldValueProps {
  value: any;
  changeType: ChangeType;
  side: 'left' | 'right';
  fieldPath: string;
}

function FieldValue({ value, changeType, side, fieldPath }: FieldValueProps) {
  // Implementation here
}
```

## Nested Object Handling

### **Expandable Block Strategy**
```typescript
// Nested object display example
const nestedObjectRender = `
donor_information: ▼                    (yellow highlight across both panels)
   ├─ donor_age: 45 | 46                (yellow highlight across both panels)
   ├─ donor_sex: Female                 (no highlight - unchanged)
   └─ medical_history: [NOT SET] | "Value"  (green highlight across both panels)
`;
```

### **Expansion State Management**
```typescript
interface NestedObjectState {
  expandedFields: Set<string>;
  toggleExpansion: (fieldPath: string) => void;
  isExpanded: (fieldPath: string) => boolean;
}

const useNestedObjectState = (): NestedObjectState => {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  
  const toggleExpansion = (fieldPath: string) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldPath)) {
        newSet.delete(fieldPath);
      } else {
        newSet.add(fieldPath);
      }
      return newSet;
    });
  };
  
  const isExpanded = (fieldPath: string) => expandedFields.has(fieldPath);
  
  return { expandedFields, toggleExpansion, isExpanded };
};
```

### **Visual Hierarchy Design**
```css
/* Indentation for nested fields */
.field-indent-0 { margin-left: 0; }
.field-indent-1 { margin-left: 20px; }
.field-indent-2 { margin-left: 40px; }
.field-indent-3 { margin-left: 60px; }

/* Expansion indicators */
.expansion-indicator {
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;
}

.expansion-indicator.expanded {
  transform: rotate(90deg);
}

/* Connecting lines for nested hierarchy */
.nested-connector {
  border-left: 1px solid #dee2e6;
  margin-left: 10px;
  padding-left: 10px;
}
```

## Array and List Field Handling

### **Array Item Display**
```typescript
// Array rendering with index labels
const arrayRender = `
Ethics: ▼                               (green highlight - indicates array expansion)
├─ 0:: institute: Royal Brisbane...     (no highlight - unchanged)
├─ 1:: institute: University of Qld...  (no highlight - unchanged)
└─ 2:: [NOT SET] | [ITEM 2]             (green highlight across both panels)
    ├─ institute: [NOT SET] | "New Institute"
    ├─ approval_date: [NOT SET] | (empty)
    └─ ethics_number: [NOT SET] | "NEW123"
`;
```

### **Array Visualization Components**
```typescript
interface ArrayFieldProps {
  arrayDiff: DiffResult;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  showDifferencesOnly: boolean;
}

function ArrayField({ 
  arrayDiff, 
  isExpanded, 
  onToggleExpansion, 
  showDifferencesOnly 
}: ArrayFieldProps) {
  return (
    <div className={`array-field ${getHighlightClass(arrayDiff.changeType)}`}>
      <div className="array-header" onClick={onToggleExpansion}>
        <span className={`expansion-indicator ${isExpanded ? 'expanded' : ''}`}>▶</span>
        <span className="field-label">{arrayDiff.fieldPath}:</span>
        <span className="array-summary">
          {arrayDiff.leftValue?.length || 0} → {arrayDiff.rightValue?.length || 0} items
        </span>
      </div>
      
      {isExpanded && (
        <div className="array-items">
          {arrayDiff.children?.map((itemDiff, index) => (
            <ArrayItem 
              key={`${arrayDiff.fieldPath}[${index}]`}
              itemDiff={itemDiff}
              index={index}
              showDifferencesOnly={showDifferencesOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### **Array Item Component**
```typescript
function ArrayItem({ 
  itemDiff, 
  index, 
  showDifferencesOnly 
}: {
  itemDiff: DiffResult;
  index: number;
  showDifferencesOnly: boolean;
}) {
  return (
    <div className={`array-item ${getHighlightClass(itemDiff.changeType)}`}>
      <div className="item-index">{index}::</div>
      <div className="item-content">
        {itemDiff.children?.map(fieldDiff => (
          <DiffField 
            key={fieldDiff.fieldPath}
            diffResult={fieldDiff}
            indentLevel={2}
            showDifferencesOnly={showDifferencesOnly}
          />
        ))}
      </div>
    </div>
  );
}
```

## Filter Implementation

### **Show Differences Only Toggle**
```typescript
function filterDiffResults(
  diffResults: DiffResult[], 
  showDifferencesOnly: boolean
): DiffResult[] {
  if (!showDifferencesOnly) return diffResults;
  
  return diffResults.filter(result => {
    if (result.changeType === 'UNCHANGED' || result.changeType === 'NOT_SET') {
      return false;
    }
    
    // For nested objects, check if any children have changes
    if (result.children) {
      const hasChangedChildren = result.children.some(child => 
        child.changeType !== 'UNCHANGED' && child.changeType !== 'NOT_SET'
      );
      return hasChangedChildren;
    }
    
    return true;
  });
}
```

### **Filter UI Integration**
```typescript
// Connect to toggle from TASK-UX-1
function useDiffFilter(
  diffResults: DiffResult[], 
  showDifferencesOnly: boolean
) {
  return useMemo(() => {
    return filterDiffResults(diffResults, showDifferencesOnly);
  }, [diffResults, showDifferencesOnly]);
}
```

## Performance Optimization

### **Virtual Scrolling for Large Datasets**
```typescript
import { FixedSizeList as List } from 'react-window';

interface VirtualizedDiffViewerProps {
  diffResults: DiffResult[];
  height: number;
  itemHeight: number;
}

function VirtualizedDiffViewer({ 
  diffResults, 
  height, 
  itemHeight 
}: VirtualizedDiffViewerProps) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <DiffField diffResult={diffResults[index]} />
    </div>
  );
  
  return (
    <List
      height={height}
      itemCount={diffResults.length}
      itemSize={itemHeight}
      itemData={diffResults}
    >
      {Row}
    </List>
  );
}
```

### **Memoization for Rendering Performance**
```typescript
const MemoizedDiffField = React.memo(DiffField, (prevProps, nextProps) => {
  return (
    prevProps.diffResult.fieldPath === nextProps.diffResult.fieldPath &&
    prevProps.diffResult.changeType === nextProps.diffResult.changeType &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.showDifferencesOnly === nextProps.showDifferencesOnly
  );
});
```

## Responsive Design

### **Panel Layout Adaptation**
```css
/* Desktop: side-by-side panels */
.diff-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  min-height: 600px;
}

.diff-panel {
  overflow-y: auto;
  padding: 16px;
  background: white;
}

/* Tablet: maintain side-by-side but smaller */
@media (max-width: 1024px) {
  .diff-container {
    font-size: 14px;
  }
  
  .diff-panel {
    padding: 12px;
  }
}

/* Mobile: stacked panels (future enhancement) */
@media (max-width: 768px) {
  .diff-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
```

### **Highlight Responsive Behavior**
```css
/* Ensure highlights work across responsive breakpoints */
.field-highlight {
  margin: 0 -16px;
  padding: 8px 16px;
  border-radius: 4px;
}

@media (max-width: 1024px) {
  .field-highlight {
    margin: 0 -12px;
    padding: 6px 12px;
  }
}
```

## Integration Requirements

### **Connection to Existing Components**
```typescript
// Integration with layout from TASK-UX-1
interface VersionControlIntegrationProps {
  leftVersionData: CellLineData | null;
  rightVersionData: CellLineData | null;
  diffResults: DiffResult[];
  isLoading: boolean;
  showDifferencesOnly: boolean;
  isScrollLocked: boolean;
}

function VersionControlIntegration({
  leftVersionData,
  rightVersionData,
  diffResults,
  isLoading,
  showDifferencesOnly,
  isScrollLocked
}: VersionControlIntegrationProps) {
  // Render integrated layout with diff visualization
}
```

### **Scroll Synchronization**
```typescript
function useSynchronizedScrolling(
  leftPanelRef: RefObject<HTMLDivElement>,
  rightPanelRef: RefObject<HTMLDivElement>,
  isLocked: boolean
) {
  useEffect(() => {
    if (!isLocked || !leftPanelRef.current || !rightPanelRef.current) return;
    
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    
    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      return () => {
        target.scrollTop = source.scrollTop;
      };
    };
    
    const leftToRight = syncScroll(leftPanel, rightPanel);
    const rightToLeft = syncScroll(rightPanel, leftPanel);
    
    leftPanel.addEventListener('scroll', leftToRight);
    rightPanel.addEventListener('scroll', rightToLeft);
    
    return () => {
      leftPanel.removeEventListener('scroll', leftToRight);
      rightPanel.removeEventListener('scroll', rightToLeft);
    };
  }, [leftPanelRef, rightPanelRef, isLocked]);
}
```

## Accessibility Requirements

### **WCAG Compliance**
```typescript
// Screen reader support
const getAriaLabel = (diffResult: DiffResult): string => {
  switch (diffResult.changeType) {
    case 'ADDED':
      return `${diffResult.fieldPath}: Added value ${diffResult.rightValue}`;
    case 'REMOVED':
      return `${diffResult.fieldPath}: Removed value ${diffResult.leftValue}`;
    case 'MODIFIED':
      return `${diffResult.fieldPath}: Changed from ${diffResult.leftValue} to ${diffResult.rightValue}`;
    case 'UNCHANGED':
      return `${diffResult.fieldPath}: Unchanged value ${diffResult.leftValue}`;
    default:
      return `${diffResult.fieldPath}: No value set`;
  }
};
```

### **Keyboard Navigation**
```typescript
// Tab navigation through expanded/collapsed sections
const useKeyboardNavigation = () => {
  const handleKeyDown = (event: KeyboardEvent, fieldPath: string) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleExpansion(fieldPath);
        break;
      case 'ArrowRight':
        if (!isExpanded(fieldPath)) {
          toggleExpansion(fieldPath);
        }
        break;
      case 'ArrowLeft':
        if (isExpanded(fieldPath)) {
          toggleExpansion(fieldPath);
        }
        break;
    }
  };
  
  return { handleKeyDown };
};
```

## Testing Requirements

### **Visual Testing Scenarios**
- **Color contrast**: Verify all highlight colors meet WCAG AA standards
- **Layout stability**: Ensure highlighting doesn't affect field alignment
- **Expansion animations**: Smooth expand/collapse transitions
- **Scroll synchronization**: Verify locked scrolling works correctly
- **Filter functionality**: Test show differences toggle behavior

### **Cross-Browser Testing**
- Chrome, Firefox, Safari, Edge compatibility
- Responsive behavior across screen sizes
- Performance with 150+ fields
- Scroll performance with large nested objects

### **Data Scenario Testing**
```typescript
const testScenarios = [
  {
    name: 'all_change_types',
    description: 'Verify all 5 change types render with correct colors',
    data: generateTestDataWithAllChangeTypes()
  },
  {
    name: 'deep_nesting',
    description: 'Test nested objects 4+ levels deep',
    data: generateDeeplyNestedTestData()
  },
  {
    name: 'large_arrays',
    description: 'Test arrays with 20+ items',
    data: generateLargeArrayTestData()
  },
  {
    name: 'mixed_changes',
    description: 'Complex scenario with all data types',
    data: generateMixedChangeTestData()
  }
];
```

## Acceptance Criteria

### **Visual Requirements**
- ✅ All 5 change types display with correct color highlighting
- ✅ Full-width color bands span both panels for changed fields
- ✅ Nested objects expand/collapse smoothly with proper indentation
- ✅ Array items display with clear index labels and item alignment
- ✅ [NOT SET] placeholder consistent across all empty values
- ✅ Professional appearance matching existing editor design

### **Functionality Requirements**
- ✅ Show differences toggle filters view correctly
- ✅ Scroll synchronization works when locked
- ✅ Independent scrolling works when unlocked
- ✅ Keyboard navigation supports expand/collapse operations
- ✅ Screen reader compatibility with descriptive labels

### **Performance Requirements**
- ✅ Smooth rendering with 150+ fields
- ✅ Responsive expand/collapse animations < 200ms
- ✅ Virtual scrolling handles large datasets efficiently
- ✅ No visual lag during filtering operations

### **Integration Requirements**
- ✅ Seamless integration with TASK-UX-1 layout
- ✅ Proper consumption of TASK-UX-2 diff data
- ✅ Ready for TASK-UX-4 performance optimization
- ✅ Clean component architecture for maintainability

## Files to Create/Modify

### **New Files**
- `api/front-end/my-app/src/app/tools/editor/components/DiffViewer.tsx`
- `api/front-end/my-app/src/app/tools/editor/components/DiffField.tsx`
- `api/front-end/my-app/src/app/tools/editor/components/FieldValue.tsx`
- `api/front-end/my-app/src/app/tools/editor/components/ArrayField.tsx`
- `api/front-end/my-app/src/app/tools/editor/styles/diffViewer.css`
- `api/front-end/my-app/src/app/tools/editor/hooks/useNestedObjectState.tsx`
- `api/front-end/my-app/src/app/tools/editor/hooks/useSynchronizedScrolling.tsx`

### **Files to Modify**
- `api/front-end/my-app/src/app/tools/editor/components/VersionControlLayout.tsx` - Integrate diff viewer
- `api/front-end/my-app/src/app/globals.css` - Add diff highlighting styles

## Completion Report Requirements

Upon task completion, provide:

1. **Visual Design Summary**: Screenshots of all change type highlighting
2. **Component Architecture**: Description of component hierarchy and data flow
3. **Performance Analysis**: Rendering performance with large datasets
4. **Accessibility Testing**: WCAG compliance verification results
5. **Integration Testing**: Verification of connection to layout and diff engine
6. **Cross-Browser Results**: Compatibility testing across target browsers

## Notes

- Prioritize visual clarity and professional appearance
- Ensure color choices are accessible for color-blind users
- Test extensively with real cell line data for realistic scenarios
- Focus on smooth user experience during expand/collapse operations 