# TASK-UX-2: Structured Template Diff Algorithm

**Project**: ASCR Web Services - CellLineEditor  
**Phase**: Phase 2 Sprint 6 - UX Optimization  
**Task Type**: Frontend Implementation  
**Estimated Duration**: 3-4 days  
**Dependencies**: TASK-UX-1 (Side-by-Side Layout)  

## Task Objective

Implement the core diff algorithm that compares two cell line versions and produces structured difference data for visualization. The algorithm must handle nested objects, arrays, and maintain schema field ordering for consistent presentation across all 150+ fields.

## Context & Background

Dr. Suzy Butcher needs to see exactly what has changed between cell line versions with complete field visibility. This requires a sophisticated diff algorithm that goes beyond simple text comparison to provide semantic field-level analysis with proper handling of complex nested data structures.

**Current State**: Side-by-side layout ready to receive comparison data  
**Target State**: Intelligent diff engine that produces structured change data for visualization

## Algorithm Specifications

### **Diff Strategy: Structured Template Diff**
- **Schema-based comparison**: All 150+ fields displayed in both panels using schema ordering
- **Field-level semantic analysis**: Compare actual data values, not serialized text
- **Complete data visibility**: Show all fields (changed and unchanged) for curation assessment
- **Nested object support**: Handle complex hierarchical data structures
- **Array handling**: Index-based comparison with clear missing item indicators

### **Field Change Categories**
The algorithm must categorize each field into one of these states:

1. **UNCHANGED**: Field values are identical
2. **MODIFIED**: Field values differ between versions  
3. **ADDED**: Field has value in right version, empty/null in left version
4. **REMOVED**: Field has value in left version, empty/null in right version
5. **NOT_SET**: Field is empty/null in both versions

### **Comparison Function Signature**
```typescript
interface DiffResult {
  fieldPath: string;
  changeType: 'UNCHANGED' | 'MODIFIED' | 'ADDED' | 'REMOVED' | 'NOT_SET';
  leftValue: any;
  rightValue: any;
  hasNestedChanges?: boolean;
  children?: DiffResult[];
}

function generateStructuredDiff(
  leftVersion: CellLineData,
  rightVersion: CellLineData,
  schema: FieldSchema[]
): DiffResult[]
```

## Implementation Requirements

### **Core Algorithm Components**

#### **1. Schema-Based Field Processing**
```typescript
// Process all schema fields to ensure complete visibility
function processSchemaFields(
  leftData: any,
  rightData: any,
  schemaFields: FieldSchema[]
): DiffResult[] {
  return schemaFields.map(field => {
    const leftValue = getFieldValue(leftData, field.path);
    const rightValue = getFieldValue(rightData, field.path);
    
    return generateFieldDiff(field, leftValue, rightValue);
  });
}
```

#### **2. Field Value Comparison**
```typescript
function generateFieldDiff(
  field: FieldSchema,
  leftValue: any,
  rightValue: any
): DiffResult {
  const changeType = determineChangeType(leftValue, rightValue);
  
  if (field.type === 'object') {
    return processNestedObject(field, leftValue, rightValue);
  } else if (field.type === 'array') {
    return processArrayField(field, leftValue, rightValue);
  } else {
    return processPrimitiveField(field, leftValue, rightValue, changeType);
  }
}
```

#### **3. Change Type Detection**
```typescript
function determineChangeType(leftValue: any, rightValue: any): ChangeType {
  const leftEmpty = isEmptyValue(leftValue);
  const rightEmpty = isEmptyValue(rightValue);
  
  if (leftEmpty && rightEmpty) return 'NOT_SET';
  if (leftEmpty && !rightEmpty) return 'ADDED';
  if (!leftEmpty && rightEmpty) return 'REMOVED';
  if (deepEqual(leftValue, rightValue)) return 'UNCHANGED';
  return 'MODIFIED';
}

function isEmptyValue(value: any): boolean {
  return value === null || 
         value === undefined || 
         value === '' || 
         (Array.isArray(value) && value.length === 0);
}
```

### **Nested Object Handling**

#### **Hierarchical Diff Processing**
```typescript
function processNestedObject(
  field: FieldSchema,
  leftValue: any,
  rightValue: any
): DiffResult {
  const children = field.children?.map(childField => {
    const leftChild = leftValue?.[childField.key] ?? null;
    const rightChild = rightValue?.[childField.key] ?? null;
    return generateFieldDiff(childField, leftChild, rightChild);
  }) || [];
  
  const hasNestedChanges = children.some(child => 
    child.changeType !== 'UNCHANGED' && child.changeType !== 'NOT_SET'
  );
  
  const changeType = determineChangeType(leftValue, rightValue);
  
  return {
    fieldPath: field.path,
    changeType: hasNestedChanges ? 'MODIFIED' : changeType,
    leftValue,
    rightValue,
    hasNestedChanges,
    children
  };
}
```

### **Array Field Handling**

#### **Index-Based Array Comparison**
```typescript
function processArrayField(
  field: FieldSchema,
  leftArray: any[],
  rightArray: any[]
): DiffResult {
  const leftArr = leftArray || [];
  const rightArr = rightArray || [];
  const maxLength = Math.max(leftArr.length, rightArr.length);
  
  const children: DiffResult[] = [];
  
  for (let i = 0; i < maxLength; i++) {
    const leftItem = i < leftArr.length ? leftArr[i] : null;
    const rightItem = i < rightArr.length ? rightArr[i] : null;
    
    children.push({
      fieldPath: `${field.path}[${i}]`,
      changeType: determineChangeType(leftItem, rightItem),
      leftValue: leftItem,
      rightValue: rightItem,
      children: field.itemSchema ? 
        processArrayItemFields(field.itemSchema, leftItem, rightItem, i) : 
        undefined
    });
  }
  
  const hasChanges = children.some(child => 
    child.changeType !== 'UNCHANGED' && child.changeType !== 'NOT_SET'
  );
  
  return {
    fieldPath: field.path,
    changeType: hasChanges ? 'MODIFIED' : determineChangeType(leftArr, rightArr),
    leftValue: leftArr,
    rightValue: rightArr,
    hasNestedChanges: hasChanges,
    children
  };
}
```

#### **Array Item Field Processing**
```typescript
function processArrayItemFields(
  itemSchema: FieldSchema[],
  leftItem: any,
  rightItem: any,
  index: number
): DiffResult[] {
  return itemSchema.map(fieldSchema => {
    const leftValue = leftItem?.[fieldSchema.key] ?? null;
    const rightValue = rightItem?.[fieldSchema.key] ?? null;
    
    return {
      fieldPath: `${fieldSchema.path}[${index}].${fieldSchema.key}`,
      changeType: determineChangeType(leftValue, rightValue),
      leftValue,
      rightValue
    };
  });
}
```

## Performance Requirements

### **Optimization Strategies**
- **Memoization**: Cache diff results for version pairs to avoid recomputation
- **Lazy evaluation**: Process nested objects only when expanded in UI
- **Incremental updates**: Update only changed portions when versions switch
- **Virtual processing**: Handle large arrays efficiently

### **Performance Targets**
- **Diff computation**: < 200ms for complete 150+ field comparison
- **Memory usage**: < 50MB for diff result storage
- **UI responsiveness**: Non-blocking computation using requestIdleCallback
- **Cache efficiency**: 90% cache hit rate for version re-selections

### **Caching Implementation**
```typescript
class DiffCache {
  private cache = new Map<string, DiffResult[]>();
  
  getCacheKey(leftVersionId: string, rightVersionId: string): string {
    return `${leftVersionId}:${rightVersionId}`;
  }
  
  getDiff(leftVersionId: string, rightVersionId: string): DiffResult[] | null {
    return this.cache.get(this.getCacheKey(leftVersionId, rightVersionId)) || null;
  }
  
  setDiff(leftVersionId: string, rightVersionId: string, diff: DiffResult[]): void {
    this.cache.set(this.getCacheKey(leftVersionId, rightVersionId), diff);
  }
}
```

## Integration Requirements

### **API Integration**
```typescript
// Fetch version data for comparison
async function fetchVersionData(cellLineId: string, versionId: string): Promise<CellLineData> {
  const response = await fetch(`/api/editor/celllines/${cellLineId}/versions/${versionId}/`);
  return response.json();
}

// Get schema for consistent field ordering
async function fetchCellLineSchema(): Promise<FieldSchema[]> {
  const response = await fetch('/api/editor/celllines/schema/');
  return response.json();
}
```

### **Component Integration Points**
```typescript
interface DiffEngineProps {
  leftVersionId: string | null;
  rightVersionId: string | null;
  leftCellLineId: string | null;
  rightCellLineId: string | null;
  onDiffReady: (diff: DiffResult[]) => void;
  onError: (error: string) => void;
}

export function DiffEngine({ 
  leftVersionId, 
  rightVersionId, 
  leftCellLineId, 
  rightCellLineId, 
  onDiffReady, 
  onError 
}: DiffEngineProps) {
  // Implementation here
}
```

## Data Structures & Types

### **Core Types**
```typescript
interface FieldSchema {
  key: string;
  path: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  label: string;
  children?: FieldSchema[];
  itemSchema?: FieldSchema[]; // For array items
}

interface CellLineData {
  id: string;
  version_number: number;
  created_at: string;
  data: Record<string, any>;
}

interface DiffResult {
  fieldPath: string;
  changeType: 'UNCHANGED' | 'MODIFIED' | 'ADDED' | 'REMOVED' | 'NOT_SET';
  leftValue: any;
  rightValue: any;
  hasNestedChanges?: boolean;
  children?: DiffResult[];
}
```

## Edge Cases & Error Handling

### **Data Edge Cases**
- **Malformed JSON**: Graceful handling with error reporting
- **Missing schema fields**: Default handling for unknown fields
- **Circular references**: Detection and safe handling
- **Large nested objects**: Memory-efficient processing
- **Mixed data types**: Proper type coercion and comparison

### **Algorithm Edge Cases**
- **Identical versions**: Efficient early return with all fields marked UNCHANGED
- **Empty versions**: Handle null/undefined version data gracefully
- **Schema changes**: Handle fields that exist in data but not in schema
- **Version format differences**: Normalize data before comparison

### **Error Handling Strategy**
```typescript
try {
  const diff = generateStructuredDiff(leftVersion, rightVersion, schema);
  onDiffReady(diff);
} catch (error) {
  console.error('Diff generation failed:', error);
  onError('Failed to compare versions. Please try again.');
}
```

## Testing Requirements

### **Unit Test Cases**
- **Primitive field comparison**: Test all change type scenarios
- **Nested object handling**: Multi-level hierarchy comparison
- **Array comparison**: Various length and content scenarios
- **Edge cases**: Empty values, null data, malformed input
- **Performance tests**: Large data set comparison benchmarks

### **Test Data Scenarios**
```typescript
// Test case examples
const testCases = [
  {
    name: 'identical_versions',
    left: { donor_age: 45, donor_sex: 'Female' },
    right: { donor_age: 45, donor_sex: 'Female' },
    expected: 'UNCHANGED'
  },
  {
    name: 'modified_field',
    left: { donor_age: 45 },
    right: { donor_age: 46 },
    expected: 'MODIFIED'
  },
  {
    name: 'added_field',
    left: { donor_age: null },
    right: { donor_age: 45 },
    expected: 'ADDED'
  }
  // Additional test cases...
];
```

## Acceptance Criteria

### **Functional Requirements**
- ✅ Algorithm correctly identifies all 5 change types (UNCHANGED, MODIFIED, ADDED, REMOVED, NOT_SET)
- ✅ Nested objects processed with proper hierarchy preservation
- ✅ Arrays compared using index-based strategy with missing item handling
- ✅ Schema field ordering maintained across all comparisons
- ✅ Complete field visibility (all 150+ fields processed)
- ✅ Performance targets met (< 200ms computation time)

### **Technical Requirements**
- ✅ TypeScript interfaces fully defined and implemented
- ✅ Caching system implemented with 90% hit rate
- ✅ Error handling covers all edge cases
- ✅ Memory usage stays under 50MB for large comparisons
- ✅ Non-blocking computation preserves UI responsiveness

### **Integration Requirements**
- ✅ Clean integration with TASK-UX-1 layout components
- ✅ Proper error propagation to UI layer
- ✅ Efficient data flow from API to diff engine
- ✅ Ready for TASK-UX-3 visual highlighting integration

## Files to Create/Modify

### **New Files**
- `api/front-end/my-app/src/app/tools/editor/components/DiffEngine.tsx`
- `api/front-end/my-app/src/app/tools/editor/utils/diffAlgorithm.ts`
- `api/front-end/my-app/src/app/tools/editor/utils/diffCache.ts`
- `api/front-end/my-app/src/app/tools/editor/types/diff.ts`

### **Files to Modify**
- `api/front-end/my-app/src/app/tools/editor/components/VersionControlLayout.tsx` - Integrate diff engine
- `api/front-end/my-app/src/app/tools/editor/hooks/useVersionControl.tsx` - Add diff state management

## Completion Report Requirements

Upon task completion, provide:

1. **Algorithm Summary**: Description of diff strategy and implementation approach
2. **Performance Results**: Benchmark results for various data sizes
3. **Test Coverage**: Unit test results and edge case handling verification
4. **Integration Details**: How the diff engine connects to layout and future components
5. **Caching Analysis**: Cache performance metrics and hit rate data
6. **Next Steps**: Specific recommendations for TASK-UX-3 visual highlighting

## Notes

- Focus on correctness and performance - this is the foundation for all visual components
- Ensure deterministic results for consistent user experience
- Design for extensibility - future validation rules may need diff integration
- Test with real cell line data from the existing 120 records 