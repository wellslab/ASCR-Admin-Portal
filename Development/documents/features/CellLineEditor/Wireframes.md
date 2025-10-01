# CellLineEditor Wireframes & User Flow Design

## Design Conversation 4: User Flow & Wireframes ✅ **COMPLETED**

### Overview
This document maps the complete user journey for the CellLineEditor feature, from cell line selection through editing and version comparison. These wireframes support Dr. Butcher's workflows for both editing existing cell lines and creating new ones.

## 1. Cell Line Search/Selection Page

### URL: `/tools/celllines/`

```
┌─────────────────────────────────────────────────────────────────┐
│ [ASCR Logo] Navigation Breadcrumb > Tools > Cell Lines         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────┐  ┌──────────────────┐  │
│  │ 🔍 Search cell lines (hpscreg_id)   │  │ ➕ Add Cell Line │  │
│  │     [Search with autocomplete]       │  │                  │  │
│  └─────────────────────────────────────┘  └──────────────────┘  │
│                                                                 │
│  ┌─ Search Results (10 per page) ────────────────────────────┐  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ UCSFi001-A                          🔒 [Locked]     │  │  │
│  │  │ Human iPSC line UCSFi001-A                          │  │  │
│  │  │ Last modified: 2024-01-15 10:30                     │  │  │
│  │  │ Modified by: dr.butcher                [Edit] ────┐ │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ UCSFi002-B                                          │  │  │
│  │  │ Human iPSC line UCSFi002-B (Parkinson's)            │  │  │
│  │  │ Last modified: 2024-01-10 14:20                     │  │  │
│  │  │ Modified by: dr.butcher                [Edit] ────┐ │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  [...8 more cell line cards...]                          │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Pagination: ◀ Prev [1] 2 3...285 Next ▶            │  │  │
│  │  │ Showing 1-10 of 2,847 cell lines                    │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features:
- **Prominent Search**: Autocomplete for hpscreg_id with 300ms debounce
- **Add Cell Line Button**: High-contrast call-to-action for new cell line creation
- **Card Layout**: Each cell line as a distinct card with clear visual hierarchy
- **Lock Indicators**: Clear visual indication when cell line is being edited
- **Quick Actions**: Direct "Edit" button on each card
- **Pagination**: Standard pagination with count display

### User Interactions:
1. **Search**: Real-time filtering as user types
2. **Click "Edit"**: Navigate to editor for existing cell line
3. **Click "Add Cell Line"**: Navigate to blank template editor
4. **Pagination**: Navigate through large dataset (2,847 cell lines)

---

## 2. Text Editor Interface (Monaco/VSCode-style)

### URL: `/tools/celllines/edit/{hpscreg_id}` or `/tools/celllines/new`

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [ASCR Logo] Navigation > Tools > Cell Lines > Edit UCSFi001-A                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─ Editor Header ──────────────────────────────────────────────────────────────┐ │
│ │ 📝 UCSFi001-A.json                     [Edit Mode] [Compare Mode]           │ │
│ │                                                        [Cancel] [💾 Save]   │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─ Editor Pane ────────────────────────────────────────┐ ┌─ Version Panel ───┐ │
│ │ Ln 1, Col 1    UCSFi001-A.json    ⚠️ 2 errors       │ │                   │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │ 📚 Version History│ │
│ │ │  1  hpscreg_id: UCSFi001-A                        │ │ │                   │ │
│ │ │  2  cell_line_name: UCSFi001-A                    │ │ │ ┌───────────────┐ │ │
│ │ │  3  description: Human iPSC line...               │ │ │ │ v5 (Current)   │ │ │
│ │ │  4  donor_information                           ▼ │ │ │ │ 2024-01-15     │ │ │
│ │ │  5    age: 45                          🔴 Error   │ │ │ │ dr.butcher     │ │ │
│ │ │  6    sex: Female                                 │ │ │ [Compare] ──┐  │ │ │
│ │ │  7    ethnicity: Caucasian                       │ │ │             │  │ │ │
│ │ │  8  culture_conditions                          ▶ │ │ │ ┌─────────────┐ │ │
│ │ │  9  characterization_data                       ▶ │ │ │ │ v4          │ │ │
│ │ │ 10  publications                                ▶ │ │ │ │ 2024-01-10  │ │ │
│ │ │ 11  quality_control                             ▶ │ │ │ │ dr.butcher  │ │ │
│ │ │ 12  derived_cell_types                          ▶ │ │ │ │ [Compare] ──┤ │ │
│ │ │                                                   │ │ │ │             │ │ │
│ │ │                                                   │ │ │ │ [...8 more]  │ │ │
│ │ │                                                   │ │ │ └─────────────────┘ │
│ │ │                                                     │ │ │                   │ │
│ │ │ ⚠️ Line 6: age must be between 0 and 120          │ │ │ 🔒 Edit Lock      │ │
│ │ │ ⚠️ Line 3: cell_line_name is required             │ │ │ ✓ dr.butcher      │ │
│ │ └─────────────────────────────────────────────────────┘ │ │ Since 10:30 AM    │ │
│ └─────────────────────────────────────────────────────────┘ │                   │ │
│                                                             └───────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Pseudo-Text Editor Features:
- **Line Numbers**: Standard code editor line numbering
- **Clean Syntax**: No JSON quotes, braces, or commas - just field:value pairs
- **Collapsible Sections**: ▼/▶ arrows for nested objects and arrays
- **Error Indicators**: 🔴 markers on lines with validation errors
- **Cursor Position**: "Ln 1, Col 1" indicator in status bar
- **File-like Experience**: Shows ".json" extension but hides JSON complexity

### Editor Interaction Patterns:
1. **Value-Only Editing**: Click any value to edit in-place (field names are not editable)
2. **Collapsible Lines**: Click ▼/▶ to expand/collapse nested structures
3. **Error Navigation**: Click error messages to jump to problematic lines
4. **Keyboard Shortcuts**: Standard editor shortcuts (Ctrl+S to save, Ctrl+F to find)
5. **Tab Navigation**: Tab between editable values, skip field names

### Technical Implementation:
- **Custom Pseudo-Editor**: React component that mimics text editor appearance
- **Hidden JSON Structure**: Internally maintains JSON but displays clean field:value format
- **Real-time Validation**: Line-level error highlighting as user types
- **Folding Providers**: Custom logic for nested object/array collapsing
- **Value-Only Editing**: Inline editing components for values, field names are display-only
- **Schema Integration**: Validation based on Pydantic schema, no JSON syntax errors possible

---

## 3. Text Editor Nested Structures (Raw Field Names)

### 3A. Collapsed vs Expanded Object Editing

```
┌─ Pseudo-Editor: Collapsed Sections ─────────────────────────────────┐
│                                                                     │
│  10  culture_conditions                                          ▶ │
│  20  characterization_data                                       ▶ │
│  30  publications                                                ▶ │
│  40  quality_control                                             ▶ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ Pseudo-Editor: Expanded Section (culture_conditions) ──────────────┐
│                                                                     │
│  10  culture_conditions                                          ▼ │
│  11    medium: mTeSR1                                              │
│  12    growth_factors                                            ▼ │
│  13      fgf2_concentration: 10                                    │
│  14      fgf2_concentration_unit: ng/ml                            │
│  15      tgf_beta1_concentration: 2                                │
│  16      tgf_beta1_concentration_unit: ng/ml                       │
│  17    passage_number: 15                                          │
│  18    subculture_method: enzymatic                                │
│  19    coating_matrix: vitronectin                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3B. Array Editing with Clean Syntax

```
┌─ Pseudo-Editor: Array Management ───────────────────────────────────┐
│                                                                     │
│  30  publications                                                ▼ │
│  31    Publication 1                             [➖ Remove Item]  │
│  32      title: Generation of iPSC line UCSFi001-A                 │
│  33      authors: Smith, J., Doe, A., et al.                       │
│  34      journal: Stem Cell Research                               │
│  35      doi: 10.1016/j.stemcr.2024.01.001                         │
│  36      pubmed_id: 38123456                                        │
│  37    Publication 2                             [➖ Remove Item]  │
│  38      title: Characterization of UCSFi001-A pluripotency        │
│  39      authors: Doe, A., Smith, J., et al.                       │
│  40      journal: Nature Methods                                   │
│  41      doi: 10.1038/nmeth.2024.002                               │
│  42      pubmed_id: 38234567                                        │
│  43                               [➕ Add Publication]              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Pseudo-Editor Features for Nested Structures:
- **Raw Field Names**: Exactly as defined in schema (snake_case, no friendly mapping)
- **Line Numbers**: Each field/value on separate line for clean diffs
- **Collapsible Sections**: Click ▼/▶ to expand/collapse nested structures
- **Contextual Controls**: [➖ Remove] and [➕ Add] buttons appear on hover/focus
- **Clean Syntax**: No JSON quotes, braces, brackets, or commas visible
- **Value-Only Editing**: Click any value to edit in-place, field names are read-only

### Value-Only Editing (No JSON Syntax Visible)

```
┌─ Clean Interface: Only Values Editable ─────────────────────────────┐
│                                                                     │
│  10  culture_conditions              ← Section name: READ-ONLY      │
│  11    medium: mTeSR1                ← Field name: READ-ONLY        │
│              ^^^^^^                  ← Value: EDITABLE              │
│  12    passage_number: 15            ← Field name: READ-ONLY        │
│                       ^^             ← Value: EDITABLE              │
│  13  publications                    ← Section name: READ-ONLY      │
│  14    Publication 1                 ← Array item: READ-ONLY        │
│  15      title: Generation of...     ← Field name: READ-ONLY        │
│                ^^^^^^^^^^^^^         ← Value: EDITABLE              │
│                                                                     │
│ 🔒 Field names (grayed): Display-only, cannot be edited             │
│ ✏️ Field values (highlighted): Click to edit in-place               │
│ 🏗️ No JSON syntax visible: Structure maintained internally          │
└─────────────────────────────────────────────────────────────────────┘
```

**Clean Interface Strategy**:
- **No JSON Syntax**: No quotes, braces, brackets, or commas visible to user
- **Field Names Read-Only**: `culture_conditions`, `medium` etc. cannot be edited
- **Values Editable**: `mTeSR1`, `15`, `Generation of...` can be clicked and edited
- **Structure Preserved**: JSON structure maintained internally, invisible to user
- **Error-Proof**: Impossible to create JSON syntax errors

---

## 4. GitHub/IDE-Style Diff Interface

### Compare Mode Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [ASCR Logo] Navigation > Tools > Cell Lines > Compare UCSFi001-A               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─ Diff Header ────────────────────────────────────────────────────────────────┐ │
│ │ 📊 UCSFi001-A.json - Comparing v5 vs v4    [Edit Mode] [Compare Mode]      │ │
│ │ 🟢 +3 additions  🔴 -1 deletion  🟡 2 changes    [Cancel] [Apply Selected] │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─ Diff View ──────────────────────────────────────┐ ┌─ Version Panel ───────┐ │
│ │      v4 (Previous)         │      v5 (Current)   │ │                       │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │ 📚 Select Versions    │ │
│ │ │    1 │ {                │    1 │ {              │ │ │                       │ │
│ │ │    2 │   "hpscreg_id":  │    2 │   "hpscreg_id":│ │ │ v5 vs ┌─────────────┐ │ │
│ │ │    3 │   "cell_line_na… │    3 │   "cell_line_n…│ │ │       │ ● v4        │ │ │
│ │ │ 🔴 4 │   "description": │      │                │ │ │       │ ○ v3        │ │ │
│ │ │      │   "Old descript…"│      │                │ │ │       │ ○ v2        │ │ │
│ │ │    5 │   "donor_inform… │    4 │   "donor_infor…│ │ │       │ ○ v1        │ │ │
│ │ │    6 │     "age": 44,   │ 🟡 5 │     "age": 45, │ │ │       └─────────────┘ │ │
│ │ │    7 │     "sex": "Fem… │    6 │     "sex": "Fe…│ │ │                       │ │
│ │ │    8 │     "ethnicity": │    7 │     "ethnicity"│ │ │ ┌───────────────────┐ │ │
│ │ │      │                  │ 🟢 8 │     "genetic_b…│ │ │ │ 🔍 Diff Options   │ │ │
│ │ │      │                  │ 🟢 9 │     "medical_h…│ │ │ │                   │ │ │
│ │ │    9 │   },             │   10 │   },           │ │ │ │ ☐ Show only      │ │ │
│ │ │   10 │   "culture_cond… │   11 │   "culture_co… │ │ │ │   differences    │ │ │
│ │ │   11 │   "characteri…"  │   12 │   "character…" │ │ │ │                   │ │ │
│ │ │   12 │ }                │   13 │ }              │ │ │ │ ☐ Word-level diff │ │ │
│ │ │      │                  │      │                │ │ │ │                   │ │ │
│ │ │ [Select All Changes] ────┼───── [Select All Changes] │ │ │ ☐ Ignore         │ │ │
│ │ │ ☐ Line 4 (Remove)        │      ☐ Line 5 (Modify)   │ │ │   whitespace     │ │ │
│ │ │ ☐ Line 6 (Change age)    │      ☐ Lines 8-9 (Add)   │ │ │                   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ └───────────────────┘ │
│ │                                                         │                       │ │
│ │ ⚠️ Line 4: "description" field removed - was required  │                       │ │
│ │ ✓ Line 5: Age changed from 44 to 45 (valid range)      │                       │ │
│ │ ✓ Lines 8-9: Added genetic background and medical hist │                       │ │
│ └─────────────────────────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### GitHub-Style Diff Features:
- **Split View**: Side-by-side comparison with line numbers
- **Line-by-Line Highlighting**: 
  - 🟢 **Green**: Added lines in current version
  - 🔴 **Red**: Removed lines from previous version  
  - 🟡 **Yellow**: Modified lines (field value changes)
  - **White**: Unchanged lines
- **Change Statistics**: "+3 additions -1 deletion 2 changes" summary
- **Selective Apply**: Checkboxes to apply individual changes
- **Validation Feedback**: Real-time validation of proposed changes

### Diff Interaction Patterns:
1. **Line Selection**: Click lines to select/deselect for applying
2. **Change Navigation**: Click change statistics to jump between modifications
3. **Batch Operations**: "Select All Changes" for bulk selection
4. **Apply Selected**: Apply only checked changes back to edit mode
5. **Diff Options**: Toggle word-level vs line-level differences

### Technical Implementation:
- **react-diff-viewer-continued**: Modern React diff component
- **Monaco Editor Diff**: Built-in diff capabilities with custom JSON parsing
- **Line-Level Granularity**: Each JSON field on separate line for clean diffs
- **JSON Formatting**: Consistent indentation and field ordering for accurate comparison

---

## 5. Mobile/Responsive Considerations

### Tablet View (768px - 1024px)

```
┌─────────────────────────────────────────────────────┐
│ [☰] ASCR > Tools > Cell Lines > Edit UCSFi001-A    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─ Editor Header (Stacked) ─────────────────────────┐ │
│ │ 📝 UCSFi001-A - Human iPSC line                  │ │
│ │ [Edit Mode] [Compare Mode]                        │ │
│ │ [Cancel] [💾 Save]                                │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─ Main Content (Full Width) ─────────────────────┐ │
│ │                                                 │ │
│ │ ┌─ Basic Information ▼ ───────────────────────┐ │ │
│ │ │                                             │ │ │
│ │ │ Cell Line Name *                            │ │ │
│ │ │ ┌─────────────────────────────────────────┐ │ │ │
│ │ │ │ UCSFi001-A                              │ │ │ │
│ │ │ └─────────────────────────────────────────┘ │ │ │
│ │ │                                             │ │ │
│ │ │ [...other fields...]                       │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ │                                                 │ │
│ │ [...more sections...]                           │ │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─ Version Panel (Collapsible) ───────────────────┐ │
│ │ 📚 Version History ▼                            │ │
│ │ [v5] [v4] [v3] [v2] [v1] [...] [Show All]       │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)

```
┌─────────────────────────────────┐
│ [☰] ASCR > Tools > Cell Lines   │
├─────────────────────────────────┤
│                                 │
│ ┌─ Editor Header (Minimal) ────┐ │
│ │ 📝 UCSFi001-A                │ │
│ │ [Edit] [Compare]              │ │
│ │ [Cancel] [Save]               │ │
│ └───────────────────────────────┘ │
│                                 │
│ ┌─ Content (Stacked) ──────────┐ │
│ │                             │ │
│ │ ┌─ Basic Info ▼ ──────────┐ │ │
│ │ │                         │ │ │
│ │ │ Cell Line Name *        │ │ │
│ │ │ ┌─────────────────────┐ │ │ │
│ │ │ │ UCSFi001-A         │ │ │ │
│ │ │ └─────────────────────┘ │ │ │
│ │ │                         │ │ │
│ │ │ hpscreg_id *            │ │ │
│ │ │ ┌─────────────────────┐ │ │ │
│ │ │ │ UCSFi001-A         │ │ │ │
│ │ │ └─────────────────────┘ │ │ │
│ │ └─────────────────────────┘ │ │
│ │                             │ │
│ │ [...more sections...]       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─ Floating Actions ──────────┐ │
│ │ 📚 Versions  🔄 Compare      │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Responsive Breakpoints:
- **Desktop (>1024px)**: Three-column layout with sidebar
- **Tablet (768-1024px)**: Two-column layout, collapsible version panel
- **Mobile (<768px)**: Single column, floating action buttons

---

## 6. Interaction States & Feedback

### Loading States

```
┌─ Field Loading Example ──────────────────────────────────────────┐
│                                                                  │
│ Cell Line Name *                                                 │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ ⏳ Loading...                                                 │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌─ Save Loading State ─────────────────────────────────────────────┐
│                        [Cancel] [⏳ Saving...]                  │
└──────────────────────────────────────────────────────────────────┘
```

### Error States

```
┌─ Validation Error Example ───────────────────────────────────────┐
│                                                                  │
│ Age *                                                            │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 150                                          🔴               │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ⚠️ Age must be between 0 and 120                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌─ Network Error Banner ───────────────────────────────────────────┐
│ ⚠️ Network error occurred. Please check your connection.         │
│                                               [Retry] [Dismiss] │
└──────────────────────────────────────────────────────────────────┘
```

### Success States

```
┌─ Save Success Banner ────────────────────────────────────────────┐
│ ✅ Cell line UCSFi001-A saved successfully.                     │
│                                                     [Dismiss] │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Navigation Patterns

### Breadcrumb Navigation
```
ASCR > Tools > Cell Lines > Edit UCSFi001-A
   ↑      ↑        ↑             ↑
  Home   Tools   List View    Current Edit
```

### Modal Patterns (for Add Cell Line)

```
┌─ Add New Cell Line Modal ────────────────────────────────────────┐
│                                                              [✕] │
│                                                                  │
│  Create New Cell Line                                            │
│                                                                  │
│  hpscreg_id * (provided by Dr. Butcher)                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ⚠️ This ID must be unique and follow the format: ORGi###-L     │
│                                                                  │
│                                        [Cancel] [Create & Edit] │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Accessibility Considerations

### Keyboard Navigation
- **Tab Order**: Logical flow through form fields
- **Focus Indicators**: Clear visual focus on all interactive elements
- **Skip Links**: "Skip to main content" for screen readers

### Screen Reader Support
- **ARIA Labels**: Comprehensive labeling for complex interactions
- **Live Regions**: Announcements for save status and validation errors
- **Semantic HTML**: Proper heading hierarchy and form structure

### Visual Accessibility
- **Color Contrast**: WCAG AA compliance for all text/background combinations
- **Color Independence**: Diff highlighting uses symbols + color
- **Font Sizing**: Respects user browser font size settings

---

## 9. Performance Considerations

### Lazy Loading Patterns
- **Field Groups**: Collapsed sections don't render internal fields until expanded
- **Version Data**: Version comparison data loaded on-demand
- **Search Results**: Virtualized scrolling for large cell line lists

### Caching Strategy
- **Schema Cache**: Processed schema cached in component state
- **Version Cache**: Recently viewed versions cached locally
- **Search Cache**: Search results cached for common queries

---

## Implementation Priority

### Phase 1: Core Editor (Weeks 1-4)
1. Cell line search/selection page
2. Basic editor layout with collapsible sections
3. UnifiedField components for all field types
4. Save functionality with validation feedback

### Phase 2: Advanced Features (Weeks 5-7)
1. Version history panel
2. Comparison interface with diff highlighting  
3. Array/object editing patterns
4. Responsive design implementation

### Phase 3: Polish & Performance (Weeks 8-10)
1. Loading states and error handling
2. Accessibility improvements
3. Performance optimizations
4. User testing and refinements

---

## React Implementation for Text Editor Approach

### Core Libraries

**Primary Editor:**
```bash
npm install @monaco-editor/react
npm install monaco-editor
```

**Diff Viewer:**
```bash
npm install react-diff-viewer-continued
npm install diff  # For generating diffs
```

**JSON Processing:**
```bash
npm install jsonc-parser  # For JSON with comments/validation
npm install json-schema-to-typescript  # For schema-based types
```

### Key Implementation Components

#### 1. Monaco Editor Setup
```typescript
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Custom JSON language with schema validation
const registerCellLineLanguage = (schema: any) => {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [{
      uri: 'cellline://schema.json',
      fileMatch: ['*.cellline.json'],
      schema: schema
    }]
  });
};
```

#### 2. Text Editor Component
```typescript
interface CellLineEditorProps {
  value: string;           // JSON string of cell line data
  schema: JsonSchema;      // Pydantic schema as JSON Schema
  onChange: (value: string) => void;
  onValidation: (errors: ValidationError[]) => void;
}

const CellLineEditor: React.FC<CellLineEditorProps> = ({
  value, schema, onChange, onValidation
}) => {
  return (
    <Editor
      height="600px"
      language="json"
      value={value}
      onChange={onChange}
      theme="vs-light"
      options={{
        lineNumbers: 'on',
        folding: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true
      }}
      onValidate={onValidation}
    />
  );
};
```

#### 3. Diff Viewer Component
```typescript
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

const CellLineDiffViewer: React.FC<{
  oldValue: string;
  newValue: string;
  oldTitle?: string;
  newTitle?: string;
}> = ({ oldValue, newValue, oldTitle, newTitle }) => {
  return (
    <ReactDiffViewer
      oldValue={oldValue}
      newValue={newValue}
      splitView={true}
      compareMethod={DiffMethod.LINES}
      leftTitle={oldTitle || "Previous Version"}
      rightTitle={newTitle || "Current Version"}
      showDiffStats={true}
      useDarkTheme={false}
      styles={{
        variables: {
          light: {
            codeFoldGutterBackground: '#f7f7f7',
            codeFoldBackground: '#f1f8ff'
          }
        }
      }}
    />
  );
};
```

#### 4. JSON Formatting for Consistent Diffs
```typescript
// Ensure consistent formatting for clean diffs
const formatCellLineJSON = (data: any): string => {
  // Sort keys to ensure consistent ordering
  const sortedData = sortKeysDeep(data);
  
  // Format with consistent indentation (2 spaces)
  return JSON.stringify(sortedData, null, 2);
};

const sortKeysDeep = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sortKeysDeep);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = sortKeysDeep(obj[key]);
        return sorted;
      }, {} as any);
  }
  return obj;
};
```

### Schema-Based Features

#### Auto-completion
```typescript
// Register custom completions based on schema
monaco.languages.registerCompletionItemProvider('json', {
  provideCompletionItems: (model, position) => {
    // Parse current JSON context
    // Provide field name suggestions based on schema
    // Show validation hints and field types
  }
});
```

#### Custom Validation
```typescript
// Real-time validation beyond basic JSON schema
const validateCellLine = (jsonString: string, schema: JsonSchema): ValidationError[] => {
  try {
    const data = JSON.parse(jsonString);
    
    // Use Ajv or similar for schema validation
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (!valid) {
      return validate.errors?.map(error => ({
        line: getLineNumber(jsonString, error.instancePath),
        message: error.message || 'Validation error',
        field: error.instancePath
      })) || [];
    }
    
    return [];
  } catch (error) {
    return [{ line: 1, message: 'Invalid JSON syntax', field: '' }];
  }
};
```

### Benefits of Text Editor Approach

1. **Familiar Interface**: Feels like editing config files or code
2. **Raw Data Visibility**: Users see exactly what's being stored
3. **Clean Diffs**: Line-by-line comparison like Git/GitHub
4. **Powerful Features**: Search, replace, multi-cursor editing, folding
5. **Schema Integration**: Auto-completion and validation without hiding structure
6. **Copy/Paste Friendly**: Easy to copy field values or entire sections
7. **Version Control Feel**: Natural for users familiar with Git workflows

### Technical Challenges & Solutions

**Challenge**: Maintaining JSON validity during editing
**Solution**: Parse and validate on every change, show syntax errors immediately

**Challenge**: Schema-aware editing without losing raw data feel  
**Solution**: Subtle auto-completion and validation hints, no field mapping

**Challenge**: Consistent formatting for reliable diffs
**Solution**: Auto-format JSON on save with consistent key ordering

**Challenge**: Large JSON performance in text editor
**Solution**: Monaco Editor handles large files well, lazy loading for version history

This text editor approach is definitely feasible and would provide a unique, developer-friendly experience while still being intuitive for users comfortable with structured data editing.

---

*These wireframes provide the foundation for implementation and should be referenced during development. Any significant UI changes should be documented here.* 