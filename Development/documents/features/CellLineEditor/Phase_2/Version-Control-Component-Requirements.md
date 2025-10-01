# Version Control Component Requirements

**Project**: ASCR Web Services - CellLineEditor  
**Component**: Version Control Interface  
**Phase**: Phase 2 Sprint 6 - UX Optimization  
**Date**: January 2025  

## Executive Summary

This document defines requirements for the Version Control Component that enables Dr. Suzy Butcher to perform side-by-side comparisons of cell line versions with comprehensive data visibility and intuitive diff visualization.

## Core User Story

**As Dr. Suzy Butcher (curator), I want to:**
- Select any two cell line versions (same or different cell lines)
- View them side-by-side with clear diff highlighting
- Assess data completeness and track changes over time
- Navigate efficiently through 150+ fields with quick visual scanning
- Switch between version combinations rapidly for curation workflows

## UI Layout & Structure

### **Side-by-Side Comparison Layout**
```
┌─────────────────────────────────────────────────────────────────┐
│ Version Control Interface                              [≡] [</>] │
├─────────────────────────────────────────────────────────────────┤
│ Select cell line:    Select version:    │ Select cell line:    Select version: │
│ [Dropdown ▼]        [Dropdown ▼]        │ [Dropdown ▼]        [Dropdown ▼]     │
├─────────────────────────────────────────┼─────────────────────────────────────┤
│                                         │                                     │
│           LEFT PANEL                    │           RIGHT PANEL               │
│         (Version A)                     │         (Version B)                 │
│                                         │                                     │
│    [Read-only editor space with         │    [Read-only editor space with     │
│     diff highlighting and               │     diff highlighting and           │
│     complete field visibility]          │     complete field visibility]      │
│                                         │                                     │
└─────────────────────────────────────────┴─────────────────────────────────────┘
```

### **Control Elements**
- **Lock/Unlock Button**: Toggle synchronized scrolling between panels
- **Show Differences Only Toggle**: Filter view to modified/added/removed fields only
- **Version Dropdowns**: Format: "Version 3 (2024-01-15 14:30)"
- **Cell Line Dropdowns**: Standard cell line selector with search capability

## Diff Algorithm & Visualization

### **Diff Strategy: Structured Template Diff**
- **Display all schema fields** in both panels (150+ fields)
- **Schema order maintenance** for consistent navigation
- **Field-level semantic comparison** (not line-by-line text diff)
- **Complete data visibility** for curation quality assessment

### **Field State Categories & Color Coding**
1. **UNCHANGED**: No highlighting, normal text
   ```
   cellline_donor_sex: Female
   ```

2. **MODIFIED**: Yellow highlighting on both panels
   ```
   Left:  cellline_donor_age: 45        (yellow highlight)
   Right: cellline_donor_age: 46        (yellow highlight)
   ```

3. **ADDED IN RIGHT**: Green highlighting across both panels
   ```
   Left:  medical_history: [NOT SET]           (green highlight)
   Right: medical_history: "No known conditions" (green highlight)
   ```

4. **REMOVED IN RIGHT**: Red highlighting across both panels
   ```
   Left:  genetic_background: "Wild type"  (red highlight)
   Right: genetic_background: [NOT SET]    (red highlight)
   ```

5. **NOT SET IN BOTH**: Light gray, minimal emphasis
   ```
   optional_field: [NOT SET]
   ```

### **Visual Design Principles**
- **Color-only indication**: No text labels like "[ADDED]" or "[REMOVED]" 
- **Full-width highlighting**: Color spans across both panels for changed fields, creating horizontal "bands"
- **Clean visual scanning**: Eye catches colored rows first, then reads left vs right content
- **Spatial relationship**: Side-by-side alignment allows immediate left vs right comparison
- **[NOT SET] placeholder**: Consistent empty field indicator across all null/empty values

## Nested Object Handling

### **Expandable Block Strategy**
```
donor_information: ▼                    (yellow highlight across both panels)
   ├─ donor_age: 45 | 46                (yellow highlight across both panels)
   ├─ donor_sex: Female                 (no highlight - unchanged)
   └─ medical_history: [NOT SET] | "Value"  (green highlight across both panels)
```

**Behavior:**
- **Default state**: Collapsed for clean initial view
- **Expansion on click**: Show field-level diffs within nested objects
- **Parent color coding**: Reflects highest-priority child change (red > yellow > green > gray)
- **Indentation hierarchy**: Clear visual nesting with connectors

## Array and List Field Handling

### **Index-Based Alignment Strategy**
Arrays and lists (e.g., Ethics, Publications, etc.) use **index-based comparison** where items are compared by their position in the array rather than content matching.

### **Array Diff Scenarios**

#### **Same Length Arrays - Item Modifications**
```
Ethics: ▼                               (yellow highlight - indicates changes within)
├─ 0:: institute: Royal Brisbane...     (yellow highlight across both panels)
│   ├─ approval_date: (empty) | "2019-01-15"  (green highlight - added)
│   └─ ethics_number: 2019/QRBW/54086   (no highlight - unchanged)
└─ 1:: institute: University of Qld...  (no highlight - unchanged)
    ├─ approval_date: (empty)
    └─ ethics_number: 2019002273
```

#### **Different Length Arrays - Items Added**
```
Ethics: ▼                               (green highlight - indicates array expansion)
├─ 0:: institute: Royal Brisbane...     (no highlight - unchanged)
├─ 1:: institute: University of Qld...  (no highlight - unchanged)
└─ 2:: [NOT SET] | [ITEM 2]             (green highlight across both panels)
    ├─ institute: [NOT SET] | "New Institute"
    ├─ approval_date: [NOT SET] | (empty)
    └─ ethics_number: [NOT SET] | "NEW123"
```

#### **Different Length Arrays - Items Removed**
```
Ethics: ▼                               (red highlight - indicates array contraction)
├─ 0:: institute: Royal Brisbane...     (no highlight - unchanged)
├─ 1:: institute: University of Qld...  (no highlight - unchanged)
└─ 2:: [ITEM 2] | [NOT SET]             (red highlight across both panels)
    ├─ institute: "Removed Institute" | [NOT SET]
    ├─ approval_date: (empty) | [NOT SET]
    └─ ethics_number: "REM123" | [NOT SET]
```

### **Array Handling Rules**
- **Index matching**: Compare item[0] with item[0], item[1] with item[1], etc.
- **Missing indices**: Shorter arrays show `[NOT SET]` for missing items
- **Item labels**: Display as `0::`, `1::`, `2::` etc. for clear index identification
- **Nested field highlighting**: Individual fields within array items highlight independently
- **Parent array highlighting**: Array container reflects the highest-priority change within

### **Visual Hierarchy**
- **Array container**: Shows overall change status (red/yellow/green)
- **Array items**: Individual item blocks with index labels
- **Item fields**: Standard field highlighting within each item
- **Indentation**: Clear nesting structure with connecting lines

## User Interaction & Navigation

### **Scrolling Behavior**
- **Lock Mode (Default)**: Both panels scroll together synchronously
- **Unlock Mode**: Independent scrolling for detailed comparison
- **Lock/Unlock Toggle**: Prominent button with clear visual state

### **Version Selection Workflow**
1. **Cell Line Selection**: Dropdown with search, current selection highlighted
2. **Version Selection**: Chronological list with version number + timestamp
3. **Auto-load**: Immediate diff rendering on selection change
4. **Loading States**: Smooth transitions with progress indicators

### **Filter & Navigation**
- **"Show Differences Only" Toggle**: Hides unchanged fields for focused review
- **Field Search**: Quick navigation to specific fields (future enhancement)
- **Virtual Scrolling**: Performance optimization for 150+ fields

## Performance Requirements

### **Response Time Targets**
- **Version Loading**: < 500ms per version fetch
- **Diff Calculation**: < 200ms client-side processing
- **UI Rendering**: < 300ms for full field display
- **Version Switching**: < 200ms transition time

### **Caching Strategy**
- **Version Data**: Cache fetched versions in browser memory
- **Diff Results**: Cache computed diffs for rapid re-switching
- **Schema Template**: Cache cell line schema for consistent field ordering

## API Integration

### **Endpoint Design**
```
GET /api/editor/celllines/{id}/versions/{version_id}/
Response: Full version metadata + schema-ordered fields

GET /api/editor/celllines/{id}/versions/
Response: Version list with timestamps for dropdown population
```

### **Client-Side Processing**
- **Separate version fetches** for maximum flexibility
- **Client-side diff computation** for responsive version switching
- **Progressive loading** for large datasets

## Accessibility & Responsive Design

### **Accessibility Requirements**
- **Keyboard Navigation**: Tab through version selectors and toggles
- **Screen Reader Support**: Descriptive labels for diff states
- **Color Independence**: Icons/text labels supplement color coding
- **High Contrast**: Ensure diff colors meet WCAG standards

### **Responsive Behavior**
- **Desktop Primary**: Optimized for side-by-side comparison
- **Tablet Support**: Responsive layout with maintained functionality
- **Mobile Considerations**: Stacked panels or alternative layout (future scope)

## Edge Cases & Error Handling

### **Data Edge Cases**
- **Identical Versions**: Clear "No differences" message with full field display
- **Missing Versions**: Graceful handling with error messages
- **Large Nested Objects**: Pagination or lazy loading for massive arrays
- **Invalid JSON**: Robust error handling with user-friendly messages

### **User Experience Edge Cases**
- **Empty Selections**: Clear prompts to guide version selection
- **Network Issues**: Offline state handling and retry mechanisms
- **Concurrent Edits**: Read-only enforcement with clear messaging

## Success Criteria

### **Functional Requirements**
- ✅ Side-by-side comparison of any two cell line versions
- ✅ Complete field visibility with schema-based ordering
- ✅ Clear diff visualization with color coding and change indicators
- ✅ Synchronized and independent scrolling modes
- ✅ Rapid version switching with cached data performance

### **User Experience Requirements**
- ✅ Sub-1-second version switching for immediate workflow
- ✅ Intuitive change identification within 3 seconds of loading
- ✅ Effortless navigation through 150+ fields with virtual scrolling
- ✅ Professional visual polish matching existing editor components

### **Performance Requirements**
- ✅ Support for comparison of versions with 150+ fields
- ✅ Smooth scrolling and interaction with large datasets
- ✅ Responsive UI updates under 500ms for all user actions

## Implementation Priorities

### **Sprint 6 Core Deliverables**
1. **TASK-UX-1**: Complete side-by-side layout with version selectors
2. **TASK-UX-2**: Implement structured template diff algorithm
3. **TASK-UX-3**: Add visual diff highlighting and nested object handling
4. **TASK-UX-4**: Optimize performance with caching and virtual scrolling

### **Future Enhancements (Phase 3)**
- Advanced filtering and search within diffs
- Field-level revert capabilities
- Export comparison reports
- Bulk comparison workflows

---

**Document Status**: Draft v1.0  
**Review Required**: User testing and technical feasibility validation  
**Next Steps**: Implementation planning and Sprint 6 task breakdown 