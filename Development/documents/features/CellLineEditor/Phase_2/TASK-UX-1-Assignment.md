# TASK-UX-1: Side-by-Side Layout with Version Selectors

**Project**: ASCR Web Services - CellLineEditor  
**Phase**: Phase 2 Sprint 6 - UX Optimization  
**Task Type**: Frontend Implementation  
**Estimated Duration**: 2-3 days  
**Dependencies**: None (standalone task)  

## Task Objective

Implement the complete side-by-side layout structure for the Version Control Component, including all control elements, version selectors, and responsive panel layout that will host the diff comparison interface.

## Context & Background

Dr. Suzy Butcher needs to compare cell line versions side-by-side to assess data completeness and track changes over time. This task creates the foundational layout structure that enables two-panel comparison with intuitive version selection controls.

**Current State**: Version control backend is complete, diff viewer exists but needs UX optimization  
**Target State**: Professional side-by-side layout with complete version selection interface

## Technical Specifications

### **Component Structure**
Create a new component: `VersionControlLayout.tsx` in `/api/front-end/my-app/src/app/tools/editor/components/`

### **Layout Requirements**
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
│    [Editor content area ready           │    [Editor content area ready       │
│     for diff integration]               │     for diff integration]           │
│                                         │                                     │
└─────────────────────────────────────────┴─────────────────────────────────────┘
```

### **Control Elements Implementation**

#### **Header Controls (Top Right)**
- **Lock/Unlock Button (`[≡]`)**: Toggle synchronized scrolling
  - Active state: Locked (blue/green indicator)
  - Inactive state: Unlocked (gray indicator)
  - Icon: Use scroll-link icon or chain icon
- **Show Differences Toggle (`[</>]`)**: Filter to show only changed fields
  - Active state: "Differences Only" (blue/green indicator)  
  - Inactive state: "Show All" (gray indicator)
  - Icon: Use diff/code comparison icon

#### **Version Selector Controls**
- **Cell Line Dropdowns**: 
  - Format: Standard cell line names (e.g., "AIBNi001-A", "MCRIi015-A")
  - Include search functionality for quick navigation
  - Default: First dropdown pre-selected, second empty
- **Version Dropdowns**:
  - Format: "Version 3 (2024-01-15 14:30)"
  - Chronological order (newest first)
  - Only populate when cell line is selected
  - Include "Select version..." placeholder

### **Panel Layout Requirements**
- **Equal width split**: 50/50 division with thin border separator
- **Synchronized heights**: Both panels maintain equal height
- **Content containers**: Ready to receive editor components
- **Scroll containers**: Prepared for synchronized/independent scrolling modes
- **Loading states**: Placeholder areas with loading spinners

### **State Management**
```typescript
interface VersionControlState {
  leftCellLine: string | null;
  leftVersion: string | null;
  rightCellLine: string | null;
  rightVersion: string | null;
  isScrollLocked: boolean;
  showDifferencesOnly: boolean;
  isLoading: {
    leftPanel: boolean;
    rightPanel: boolean;
  };
}
```

### **Event Handlers Required**
- `onCellLineSelect(panel: 'left' | 'right', cellLineId: string)`
- `onVersionSelect(panel: 'left' | 'right', versionId: string)`
- `onToggleScrollLock()`
- `onToggleShowDifferences()`

## API Integration Points

### **Endpoints to Use**
```typescript
// Cell line list for dropdowns
GET /api/editor/celllines/
Response: [{ id: string, name: string }]

// Version list for selected cell line
GET /api/editor/celllines/{id}/versions/
Response: [{ id: string, version_number: number, created_at: string }]
```

### **Data Fetching Requirements**
- **Cell lines**: Fetch once on component mount, cache in state
- **Versions**: Fetch when cell line selected, cache per cell line
- **Loading indicators**: Show during all API calls
- **Error handling**: Display user-friendly messages for failed requests

## Styling Requirements

### **Design System Alignment**
- Use existing editor component styling patterns
- Match current color scheme and typography
- Consistent with existing dropdown and button styles
- Professional appearance matching rest of application

### **Responsive Behavior**
- **Desktop primary**: Optimized for side-by-side comparison
- **Minimum width**: 1200px for comfortable comparison
- **Panel scaling**: Maintain 50/50 split across screen sizes
- **Control accessibility**: Ensure dropdowns and buttons remain usable

### **Visual Hierarchy**
- **Clear separation**: Visible border between panels
- **Control prominence**: Header controls easily discoverable
- **Selection clarity**: Active selections clearly highlighted
- **Loading feedback**: Obvious loading states during data fetching

## Integration Points

### **Existing Components to Connect**
- Import and integrate with existing `EditorContext` for consistent data flow
- Connect to version control hooks: `useVersionControl.tsx`
- Prepare integration points for future diff rendering components

### **Props Interface**
```typescript
interface VersionControlLayoutProps {
  onComparisonReady?: (leftData: any, rightData: any) => void;
  className?: string;
}
```

## Acceptance Criteria

### **Functional Requirements**
- ✅ Complete side-by-side layout renders without errors
- ✅ All four dropdowns (2 cell lines, 2 versions) function correctly
- ✅ Lock/unlock toggle changes state and shows visual feedback
- ✅ Show differences toggle changes state and shows visual feedback
- ✅ Cell line selection populates corresponding version dropdown
- ✅ Loading states display during API calls
- ✅ Error messages show for failed API requests

### **User Experience Requirements**
- ✅ Dropdowns open smoothly with search functionality
- ✅ Version format displays clearly: "Version X (YYYY-MM-DD HH:MM)"
- ✅ Visual feedback immediate for all control interactions
- ✅ Layout remains stable during loading/data changes
- ✅ Professional appearance consistent with existing components

### **Technical Requirements**
- ✅ TypeScript interfaces defined for all state and props
- ✅ Proper error boundaries and loading state handling
- ✅ Clean component structure ready for diff integration
- ✅ Performance optimized (no unnecessary re-renders)

## Files to Create/Modify

### **New Files**
- `api/front-end/my-app/src/app/tools/editor/components/VersionControlLayout.tsx`
- `api/front-end/my-app/src/app/tools/editor/components/VersionSelector.tsx` (helper component)

### **Files to Modify**
- `api/front-end/my-app/src/app/tools/editor/page.tsx` - Add version control route/tab
- Update existing editor navigation to include version control access

## Testing & Validation

### **Manual Testing Checklist**
- [ ] Layout renders correctly in various browser widths
- [ ] All dropdowns populate with correct data
- [ ] State toggles work and show visual feedback
- [ ] Loading states appear during API calls
- [ ] Error states display user-friendly messages
- [ ] Panel areas are ready for content integration

### **Edge Cases to Handle**
- No cell lines available (empty database)
- Cell line with no versions
- API timeout/failure scenarios
- Very long cell line names in dropdowns

## Completion Report Requirements

Upon task completion, provide:

1. **Implementation Summary**: Brief description of components created
2. **Technical Details**: Key architectural decisions and patterns used
3. **Integration Notes**: How the component connects to existing systems
4. **Testing Results**: Manual testing checklist completion
5. **Next Steps**: Recommendations for TASK-UX-2 integration
6. **Code Locations**: Specific files created/modified with line numbers

## Notes

- This task focuses on layout and controls only - diff rendering comes in TASK-UX-2
- Prioritize clean, maintainable code structure for future diff integration
- Ensure responsive design principles for professional appearance
- Test thoroughly with existing cell line data in the system 