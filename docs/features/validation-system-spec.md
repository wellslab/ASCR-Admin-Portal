# Cell Line Data Validation Specification

## Overview
Implement a comprehensive three-layer validation system for cell line curation data to ensure data integrity, provide clear user feedback, and prevent invalid data from being saved to storage.

## Core Requirements

### 1. Validation Architecture

**Three-Layer Defense Strategy:**

1. **Prevention Layer (Frontend)**
   - Schema-aware form field rendering
   - Dropdown selects for enum fields
   - Type-specific inputs (number, boolean, date)
   - Client-side validation feedback

2. **Detection Layer (Backend)**
   - Pydantic model validation
   - Automatic FastAPI validation
   - Comprehensive error messages
   - HTTP 422 status for validation failures

3. **Communication Layer (Frontend)**
   - Parse backend validation errors
   - Display user-friendly error messages
   - Field-level error highlighting
   - Clear, actionable feedback

### 2. Schema-Driven Field Rendering

**Schema Endpoint:** `GET /cellline-schema`

Returns comprehensive field metadata for all sections:
```json
{
  "sections": {
    "cell_line": {
      "model_name": "CellLine",
      "fields": {
        "cell_type": {
          "type": "select",
          "required": true,
          "choices": [
            "human embryonic stem cell (hESC)",
            "human induced pluripotent stem cell (hiPSC)"
          ],
          "description": "Type of cell line."
        },
        "co2_concentration": {
          "type": "number",
          "number_type": "float",
          "required": false,
          "description": "CO2 concentration."
        },
        "frozen": {
          "type": "boolean",
          "required": true,
          "description": "Whether stock was frozen."
        }
      }
    }
  }
}
```

**Field Types:**
- `select` - Enum fields, rendered as dropdown
- `text` - String fields, rendered as text input
- `number` - Numeric fields (integer or float)
- `boolean` - Boolean fields, rendered as switch/checkbox
- `date` - Date fields, rendered as date picker

### 3. Backend Validation Rules

**Pydantic Model Enforcement:**

All API endpoints that accept cell line data use `CellLineCurationForm` Pydantic model:

```python
@app.put("/working/cell-line/{filename}")
async def update_cell_line(
    filename: str,
    cell_line_data: CellLineCurationForm,  # Pydantic validation
    ...
):
```

**Validation Rules:**
- **Required Fields:** Fields without `Optional` or default values must be present
- **Enum Fields (Literal):** Must match one of the defined literal values exactly
- **String Max Length:** Cannot exceed specified `max_length`
- **Numeric Types:** Must be valid integers or floats
- **Boolean Types:** Must be true/false
- **Date Format:** Must be valid ISO 8601 date format

**Example Validation Errors:**

Invalid cell_type:
```json
{
  "detail": [{
    "type": "literal_error",
    "loc": ["body", "cell_line", 0, "cell_type"],
    "msg": "Input should be 'human embryonic stem cell (hESC)' or 'human induced pluripotent stem cell (hiPSC)'",
    "input": "invalid_type"
  }]
}
```

Invalid numeric field:
```json
{
  "detail": [{
    "type": "float_parsing",
    "loc": ["body", "culture_medium", 0, "co2_concentration"],
    "msg": "Input should be a valid number",
    "input": "not_a_number"
  }]
}
```

### 4. Error Message Format

**Backend Response (HTTP 422):**

FastAPI automatically returns structured validation errors:
```json
{
  "detail": [
    {
      "type": "literal_error",
      "loc": ["body", "cell_line", 0, "cell_type"],
      "msg": "Input should be 'human embryonic stem cell (hESC)' or ...",
      "input": "invalid_value"
    }
  ]
}
```

**Frontend Display:**

Parse and format for users:
```
Validation Errors:
• cell_line → cell_type: Input should be 'human embryonic stem cell (hESC)' or 'human induced pluripotent stem cell (hiPSC)' (got: "invalid_value")
• culture_medium → co2_concentration: Input should be a valid number (got: "not_a_number")
```

**Error Parsing Logic:**
```typescript
const parseValidationErrors = (errorData: any): string[] => {
  return errorData.detail.map((error: any) => {
    const location = error.loc?.slice(1).join(' → ') || 'Unknown field';
    const message = error.msg || 'Invalid value';
    const input = error.input !== undefined ? ` (got: "${error.input}")` : '';
    return `${location}: ${message}${input}`;
  });
};
```

### 5. Frontend Implementation

**CellLineEditor Component:**

1. **Schema Fetching:**
   ```typescript
   useEffect(() => {
     const fetchSchema = async () => {
       const response = await fetch('http://localhost:8001/cellline-schema');
       const schemaData = await response.json();
       setSchema(schemaData);
     };
     fetchSchema();
   }, []);
   ```

2. **Field Rendering:**
   ```typescript
   const FieldEditor = ({ fieldName, value, inputName, fieldSchema }) => {
     const fieldType = fieldSchema?.type || 'text';

     if (fieldType === 'select' && fieldSchema?.choices) {
       return (
         <Select defaultValue={value}>
           {fieldSchema.choices.map(choice => (
             <MenuItem value={choice}>{choice}</MenuItem>
           ))}
         </Select>
       );
     } else if (fieldType === 'boolean') {
       return <Switch defaultChecked={value} />;
     } else if (fieldType === 'number') {
       return <TextField type="number" />;
     } else {
       return <TextField />;
     }
   };
   ```

3. **Error Display:**
   ```typescript
   {validationErrors.length > 0 && (
     <Alert severity="error">
       <Typography>Validation Errors:</Typography>
       {validationErrors.map(error => (
         <Typography>• {error}</Typography>
       ))}
     </Alert>
   )}
   ```

### 6. Save Workflow with Validation

**Flow:**
1. User edits cell line data in form
2. User clicks "Save"
3. Frontend collects form data and converts types
4. Frontend sends PUT request to backend
5. Backend validates against Pydantic model
6. If valid: Save to storage, return success
7. If invalid: Return HTTP 422 with detailed errors
8. Frontend catches 422, parses errors, displays alert

**Type Conversion on Save:**
```typescript
// Convert form values to proper types
if (fieldSchema?.type === 'number') {
  value = parseFloat(value);
} else if (fieldSchema?.type === 'boolean') {
  value = (value === 'on');
}
```

## Implementation Plan

### Phase 1: Backend Validation ✓

**Changes:**
- Update `POST /working/cell-line` endpoint parameter type
- Update `PUT /working/cell-line/{filename}` endpoint parameter type
- Change from `cell_line_data: dict` to `cell_line_data: CellLineCurationForm`
- Add `.model_dump()` to convert Pydantic model to dict for storage

**Impact:**
- FastAPI automatically validates all incoming data
- Returns HTTP 422 with detailed errors for invalid data
- No invalid data can reach storage layer

### Phase 2: Schema Enhancement ✓

**Changes:**
- Update `utils.get_frontend_schema()` function
- Extract nested model field definitions
- Return field-level metadata (type, choices, required, description)
- Support for all field types (select, text, number, boolean, date)

**Schema Structure:**
```python
{
  "sections": {
    "cell_line": {
      "fields": {
        "field_name": {
          "type": "select|text|number|boolean",
          "required": True/False,
          "choices": [...],  # For select fields
          "description": "..."
        }
      }
    }
  }
}
```

### Phase 3: Frontend Field Rendering ✓

**Changes:**
- Update `CellLineEditor` to fetch schema on mount
- Pass schema to `Section` and `InstanceEditor` components
- Update `FieldEditor` to render based on field type
- Add required field indicators (*)
- Implement dropdown selects for enum fields
- Implement type-specific inputs (number, boolean)

### Phase 4: Error Handling & Display ✓

**Changes:**
- Add `validationErrors` state to curation page
- Update `saveCellLine` to catch HTTP 422 responses
- Implement `parseValidationErrors` function
- Pass errors to `CellLineEditor` component
- Display errors in Alert component with close button
- Clear errors on successful save or discard

### Phase 5: Testing ✓

**Test Coverage:**
1. **Valid data passes validation**
2. **Invalid enum values rejected (HTTP 422)**
3. **Missing required fields rejected**
4. **Invalid type conversions rejected** (string for number, etc.)
5. **Max length violations rejected**
6. **Multiple errors returned together**
7. **Optional fields can be null**
8. **Update endpoint validates data**

## Data Dictionary Integration

**Source of Truth:** `data_dictionaries/2025_12_ascr_data_dictionary_v1.0.xlsx`

**Model Generation:** `data_dictionaries/make_data_dictionary.py`

Generates `curation_models.py` with all Pydantic models including:
- Field types (str, int, float, bool, date)
- Enum constraints (Literal types)
- Required vs optional fields
- Max length constraints
- Field descriptions

**Update Workflow:**
1. Modify data dictionary Excel file
2. Document changes in `stefan_data_dictionary_change_record.md`
3. Run `python data_dictionaries/make_data_dictionary.py`
4. Regenerated `curation_models.py` automatically includes new validation rules
5. Backend and frontend automatically enforce new rules

## Validation Rules by Field Type

### Enum Fields (Literal)

**Examples:**
- `cell_type`: Must be "human embryonic stem cell (hESC)" or "human induced pluripotent stem cell (hiPSC)"
- `status`: Must be "Backup" or "Characterised"
- `genotype`: Must be "Patient Control" or "Gene Corrected"

**Enforcement:**
- Backend: Pydantic Literal type validation
- Frontend: Dropdown select (prevents invalid input)

### String Fields

**Constraints:**
- `max_length` enforced (e.g., 100 characters)
- Optional fields can be null or empty string

**Examples:**
- `hpscreg_name`: max_length=100
- `cell_line_alt_name`: max_length=100, optional

### Numeric Fields

**Types:**
- Integer: Whole numbers only
- Float: Decimal numbers allowed

**Examples:**
- `co2_concentration`: Optional[float]
- `year`: int (required)

**Frontend:**
- Rendered as `<input type="number">`
- Step="any" for floats, step="1" for integers

### Boolean Fields

**Values:** true or false only

**Examples:**
- `frozen`: bool (required)
- `research_use`: bool (required)

**Frontend:**
- Rendered as Switch component
- Form value: 'on' if checked, undefined if not

### Date Fields

**Format:** ISO 8601 date format (YYYY-MM-DD)

**Examples:**
- `embargo_date`: Optional[date]
- `derivation_year`: Optional[date]

## User Experience Considerations

### 1. Progressive Enhancement

**Level 1 - No Validation (Current State):**
- User enters invalid data
- Data saved to storage
- Corruption accumulates
- Downstream systems fail

**Level 2 - Backend Validation (Phase 1):**
- User enters invalid data
- Backend rejects with error
- User sees generic error message
- Must guess what's wrong

**Level 3 - With Dropdowns (Phase 2-3):**
- User cannot enter invalid enum values
- Dropdowns show only valid options
- Reduces but doesn't eliminate errors

**Level 4 - Full Validation (All Phases):**
- Dropdowns prevent enum errors
- Backend validates all data
- Clear error messages show exactly what's wrong
- Field names and expected values shown
- User can fix issues quickly

### 2. Error Message Quality

**Bad Error Message:**
```
Error: Validation failed
```

**Good Error Message:**
```
cell_line → cell_type: Input should be 'human embryonic stem cell (hESC)'
or 'human induced pluripotent stem cell (hiPSC)' (got: "stem cell")
```

**Components of Good Error:**
1. **Location:** Which section and field
2. **Problem:** What validation rule failed
3. **Expected:** What values are acceptable
4. **Actual:** What value was provided

### 3. Field Indicators

**Required Fields:**
- Show asterisk (*) next to field label
- Defined in schema as `"required": true`

**Optional Fields:**
- No indicator
- Can be null or empty

### 4. Real-time vs Submit Validation

**Current Approach: Submit Validation**
- Validation occurs only on save
- All errors returned at once
- User can fix multiple issues together

**Future Enhancement: Real-time Validation**
- Validate fields as user types
- Show inline errors immediately
- Better UX but more complex

## Performance Considerations

### Schema Caching

**Current:** Fetch schema once on component mount
```typescript
useEffect(() => {
  fetchSchema();
}, []); // Empty deps = once only
```

**Benefits:**
- Single API call per page load
- Schema unlikely to change during session
- Fast field rendering

### Validation Performance

**Backend:**
- Pydantic validation is very fast (<1ms for typical payloads)
- No database queries required
- In-memory validation only

**Frontend:**
- Schema lookup: O(1) using object keys
- Field rendering: Minimal overhead
- Error parsing: O(n) where n = number of errors

## Testing Strategy

### Backend Tests (`test_validation.py`)

**Test Categories:**
1. **Valid Data Tests**
   - Ensure valid data passes through
   - No false positives

2. **Enum Validation Tests**
   - Invalid cell_type rejected
   - Invalid status rejected
   - Invalid genotype rejected

3. **Type Validation Tests**
   - Non-numeric for float field rejected
   - Non-boolean for boolean field rejected
   - Invalid date format rejected

4. **Constraint Tests**
   - Max length violations rejected
   - Required field omissions rejected

5. **Multiple Error Tests**
   - Multiple errors returned together
   - All errors included in response

6. **Optional Field Tests**
   - Optional fields can be null
   - Optional fields can be omitted

### Frontend Tests (Future)

**Component Tests:**
1. **FieldEditor Rendering**
   - Enum fields render as Select
   - Boolean fields render as Switch
   - Number fields render with type="number"
   - Required fields show asterisk

2. **Error Display**
   - Validation errors shown in Alert
   - Error can be dismissed
   - Errors cleared on successful save

3. **Schema Integration**
   - Schema fetched on mount
   - Schema used for field rendering
   - Missing schema handled gracefully

## Migration & Deployment

### Backward Compatibility

**Breaking Change:** API now rejects invalid data

**Migration Plan:**
1. Deploy backend changes first
2. Existing working files may have invalid data
3. Users will encounter validation errors on save
4. Users must fix data to save successfully

**Mitigation:**
1. Create data validation script to identify invalid data
2. Notify users of invalid data before deployment
3. Provide clear error messages to guide fixes

### Deployment Steps

1. **Backend Deployment**
   - Deploy updated `main.py` with Pydantic validation
   - Deploy updated `utils.py` with enhanced schema
   - Test `/cellline-schema` endpoint

2. **Frontend Deployment**
   - Deploy updated `CellLineEditor.tsx`
   - Deploy updated `page.tsx` (curation page)
   - Test schema fetching and field rendering

3. **Verification**
   - Create test cell line with valid data
   - Attempt to save with invalid enum value
   - Verify HTTP 422 returned
   - Verify error displayed in frontend
   - Verify dropdown prevents invalid input

## Critical Files

**Backend:**
- `/services/backend/main.py` - API endpoints with Pydantic validation
- `/services/backend/utils.py` - Schema generation with nested field extraction
- `/data_dictionaries/curation_models.py` - Pydantic models (generated)
- `/services/backend/tests/test_validation.py` - Validation tests

**Frontend:**
- `/services/frontend/my-app/src/app/components/CellLineEditor.tsx` - Schema-aware editor
- `/services/frontend/my-app/src/app/tools/curation/page.tsx` - Error handling
- `/services/frontend/my-app/src/app/components/FieldEditor.tsx` - Field type rendering (part of CellLineEditor)

**Data Dictionary:**
- `/data_dictionaries/2025_12_ascr_data_dictionary_v1.0.xlsx` - Source of truth
- `/data_dictionaries/make_data_dictionary.py` - Model generator
- `/data_dictionaries/stefan_data_dictionary_change_record.md` - Change log

## Success Criteria

1. ✅ Backend rejects invalid enum values (HTTP 422)
2. ✅ Backend rejects invalid numeric values
3. ✅ Backend rejects missing required fields
4. ✅ Backend returns detailed error messages with field locations
5. ✅ Frontend fetches and uses schema for field rendering
6. ✅ Enum fields rendered as dropdown selects
7. ✅ Boolean fields rendered as switches
8. ✅ Number fields rendered with type="number"
9. ✅ Validation errors displayed in user-friendly format
10. ✅ Errors show section, field, problem, and expected values
11. ✅ Errors can be dismissed by user
12. ✅ Errors cleared on successful save
13. ✅ Required fields show asterisk indicator
14. ✅ Comprehensive test coverage for validation scenarios

## Open Questions & Future Enhancements

### 1. Real-time Validation
- Should validation occur on field blur?
- Trade-off: Better UX vs increased complexity
- Pydantic doesn't natively support partial validation

### 2. Field-Level Error Highlighting
- Highlight invalid fields in red
- Scroll to first error on validation failure
- Requires mapping error location to form fields

### 3. Validation Warnings vs Errors
- Some fields may want "soft" warnings
- Example: "Unusual value, please confirm"
- Doesn't block save but alerts user

### 4. Cross-Field Validation
- Example: If field A is set, field B is required
- Pydantic supports via `model_validator`
- More complex to implement and display

### 5. Async Validation
- Check if hpscreg_name already exists
- Validate URLs are reachable
- Requires backend API calls during editing

### 6. Validation Profiles
- Different validation rules for different user roles
- Example: Admin can bypass certain validations
- More complex authorization logic

### 7. Bulk Validation
- Validate all working files at once
- Generate report of invalid data
- Help clean up existing data

## Timeline

**Phase 1 (Backend):** 1 hour
**Phase 2 (Schema):** 1 hour
**Phase 3 (Frontend Fields):** 2 hours
**Phase 4 (Error Display):** 1 hour
**Phase 5 (Testing):** 1 hour
**Documentation:** 1 hour

**Total:** 7 hours of development work
