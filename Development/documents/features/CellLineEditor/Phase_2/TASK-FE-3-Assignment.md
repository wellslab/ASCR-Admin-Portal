# TASK-FE-3: Frontend Comparison Interface Development

**Type**: Frontend Development  
**Phase**: Phase 2, Sprint 5  
**Duration**: 1.5 weeks  
**Status**: 🚀 Ready for Assignment  
**Prerequisites**: ✅ TASK-BE-2 Complete (Version Storage Infrastructure), ✅ TASK-BE-3 Complete (Field Editing Stabilization)

## Mission

Implement GitHub-style side-by-side comparison interface for cell line version control, completing Dr. Suzy Butcher's edit-to-compare workflow. Build upon the exceptional Phase 1 foundation and robust Sprint 4 backend infrastructure.

## Context

Building on outstanding project momentum:
- **Phase 1**: ✅ Professional custom editor with 98.6% field reliability  
- **Sprint 4**: ✅ Automatic version storage (85ms performance) + comprehensive field validation
- **Current State**: Ready for frontend comparison interface to complete version control system

## Week 1 Objectives: Core Comparison Interface

### 1. Version History Panel Implementation 📊 **HIGH PRIORITY**

**Vision**: GitHub-style version timeline with clickable version selection for comparison

**Component**: `VersionPanel.tsx`  
**Location**: `src/app/tools/editor/components/VersionPanel.tsx`

**Requirements**:
- **Version Timeline**: Display last 10 versions with timestamps and authors
- **Selection Interface**: Click version to select for comparison with current
- **Visual States**:
  - Current version highlighted distinctly
  - Selected comparison version visually indicated
  - Loading states during version history fetch
- **API Integration**: Fetch from `/api/celllines/{hpscreg_id}/versions/`

**Interface**:
```typescript
interface VersionPanelProps {
  versionHistory: VersionInfo[];
  currentVersion: number;
  selectedVersionForComparison?: number;
  isLoading: boolean;
  onVersionSelect: (versionNumber: number) => void;
  onClearComparison: () => void;
}

interface VersionInfo {
  version_number: number;
  created_by: string;
  created_on: string;
}
```

**Acceptance Criteria**:
- [ ] Displays version timeline with timestamps and creation info
- [ ] Click version to select for comparison
- [ ] Clear visual distinction between current and selected versions
- [ ] Loading states handled gracefully
- [ ] API integration working with existing backend
- [ ] Responsive design fitting existing layout

### 2. Enhanced State Management for Version Control 🔧 **HIGH PRIORITY**

**Vision**: Extend existing EditorContext to support comparison mode and version data management

**Files to Update**:
- `src/app/tools/editor/hooks/useCellLineData.tsx`
- `src/app/tools/editor/types/editor.ts`

**Enhanced State Interface**:
```typescript
interface EditorState {
  originalCellLine: CellLineData;     // Original data from database
  currentCellLine: CellLineData;      // Current data with user edits
  comparisonCellLine?: CellLineData;  // When comparing with previous version
  mode: 'edit' | 'compare';          // Current editor mode
  validationErrors: ValidationError[];
  isSaving: boolean;
  
  // NEW: Version control specific state
  versionHistory: VersionInfo[];
  isLoadingVersions: boolean;
  selectedVersionNumber?: number;
}
```

**New State Actions**:
```typescript
type EditorAction = 
  // Existing actions...
  | { type: 'SET_MODE'; payload: 'edit' | 'compare' }
  | { type: 'LOAD_COMPARISON'; payload: CellLineData }
  | { type: 'CLEAR_COMPARISON' }
  | { type: 'LOAD_VERSION_HISTORY'; payload: VersionInfo[] }
  | { type: 'SET_LOADING_VERSIONS'; payload: boolean }
  | { type: 'SELECT_VERSION_FOR_COMPARISON'; payload: number }
  | { type: 'LOAD_VERSION_DATA'; payload: CellLineData };
```

**Acceptance Criteria**:
- [ ] Enhanced state management supports comparison mode
- [ ] Version history loading and management
- [ ] Mode switching between edit and compare
- [ ] Selected version state management
- [ ] API integration for version data fetching
- [ ] Maintains existing functionality without regression

### 3. GitHub-Style Diff Viewer Foundation 🎯 **HIGH PRIORITY**

**Vision**: Side-by-side comparison with line-by-line highlighting (like GitHub/Git diffs)

**Component**: `CellLineDiffViewer.tsx`  
**Location**: `src/app/tools/editor/components/DiffViewer/CellLineDiffViewer.tsx`

**Requirements**:
- **Side-by-Side Layout**: Previous version (left) vs Current version (right)
- **Line Numbers**: Both sides with synchronized scrolling
- **Change Highlighting**:
  - 🟢 **Added lines**: Green background for new content
  - 🔴 **Removed lines**: Red background for deleted content  
  - 🟡 **Modified lines**: Yellow/orange background for changes
- **JSON Formatting**: Clean 2-space indentation for readable diffs

**Dependencies**: Add NPM package
```bash
npm install react-diff-viewer-continued lodash
```

**Interface**:
```typescript
interface CellLineDiffViewerProps {
  originalValue: string;            // Previous version JSON
  modifiedValue: string;            // Current version JSON
  originalTitle?: string;           // "v4 (Previous)"
  modifiedTitle?: string;           // "v5 (Current)"
  showStats?: boolean;              // Show +/- change statistics
}
```

**JSON Formatting Strategy**:
```typescript
const formatCellLineJSON = (data: any): string => {
  // Sort keys alphabetically for consistent ordering
  const sortedData = sortKeysDeep(data);
  // Format with 2-space indentation for clean diffs
  return JSON.stringify(sortedData, null, 2);
};
```

**Acceptance Criteria**:
- [ ] Side-by-side comparison layout with synchronized scrolling
- [ ] Accurate line-by-line diff highlighting (green/red/yellow)
- [ ] Clean JSON formatting with proper indentation
- [ ] Version titles displayed clearly ("v4 (Previous)" / "v5 (Current)")
- [ ] Performance optimized for 150+ field cell line data
- [ ] Professional appearance matching existing design system

## Week 2 Objectives: Integration & Enhancement

### 4. Change Statistics Component 📈 **MEDIUM PRIORITY**

**Vision**: GitHub-style change summary showing additions, deletions, and modifications

**Component**: `ChangeStatistics.tsx`  
**Location**: `src/app/tools/editor/components/DiffViewer/ChangeStatistics.tsx`

**Requirements**:
- **Statistics Format**: "+3 additions -1 deletion 2 changes"
- **Color Coding**: Green for additions, red for deletions, yellow for changes
- **Percentage Change**: Show percentage of file changed
- **Visual Design**: Clean, professional statistics display

**Interface**:
```typescript
interface ChangeStatisticsProps {
  additions: number;
  deletions: number;
  modifications: number;
  totalLines: number;
}
```

**Acceptance Criteria**:
- [ ] Accurate calculation of additions, deletions, modifications
- [ ] Color-coded statistics display (green/red/yellow)
- [ ] Percentage change calculation and display
- [ ] Clean integration with diff viewer
- [ ] Performance optimized for real-time calculation

### 5. Mode Management & Container Integration 🔄 **HIGH PRIORITY**

**Vision**: Seamless switching between editing and comparison modes with preserved state

**Files to Update**:
- `src/app/tools/editor/page.tsx` (Main editor page)
- `src/app/tools/editor/components/EditorLine.tsx` (if needed for mode handling)

**Requirements**:
- **Mode Toggle**: Button to switch between "Edit" and "Compare" modes
- **Conditional Rendering**: 
  - Edit mode: Show existing pseudo-text-editor
  - Compare mode: Show side-by-side diff viewer
- **State Preservation**: Maintain current edits when switching to compare mode
- **Visual Indicators**: Clear indication of current mode

**Layout Strategy**:
```
[Edit Mode]
┌─────────────────────────────────────┐
│ Editor Header (Save/Cancel)         │
├─────────────────────────────────────┤
│ Custom Pseudo-Text-Editor           │
│ (existing Phase 1 implementation)   │
└─────────────────────────────────────┘

[Compare Mode]  
┌─────────────────────────────────────┐
│ Compare Header (Back to Edit)       │
├─────┬─────────────────────────┬─────┤
│ Ver │ Diff Viewer             │ Ver │
│ His │ (Side-by-side)         │ Sel │
│ tory│                        │     │
└─────┴─────────────────────────┴─────┘
```

**Acceptance Criteria**:
- [ ] Clean mode switching with toggle button
- [ ] Conditional rendering between editor and diff viewer
- [ ] Current edits preserved during mode switches
- [ ] Clear visual indicators for current mode
- [ ] Layout adapts appropriately for comparison interface
- [ ] No loss of functionality in either mode

### 6. Version Selection Workflow Integration ⚡ **HIGH PRIORITY**

**Vision**: Complete workflow from version selection to diff display with error handling

**Data Flow**:
```
1. User clicks version in VersionPanel
2. Fetch specific version data from API
3. Update EditorState with comparison data
4. Switch mode to 'compare'
5. Render DiffViewer with original vs comparison data
6. Show change statistics and version info
```

**API Integration**:
- **Version History**: `GET /api/celllines/{hpscreg_id}/versions/`
- **Specific Version**: `GET /api/celllines/{hpscreg_id}/versions/{version}/`

**Error Handling Strategy**:
```typescript
// Handle version fetch errors
try {
  const versionData = await api.get(`/api/celllines/${hpscreg_id}/versions/${version}/`);
  dispatch({ type: 'LOAD_VERSION_DATA', payload: versionData });
} catch (error) {
  setVersionError('Failed to load version data. Please try again.');
}
```

**Acceptance Criteria**:
- [ ] Complete version selection to diff display workflow
- [ ] API integration working with robust error handling
- [ ] Loading states during version data fetching
- [ ] Graceful error handling with user feedback
- [ ] Performance optimized (target: <2 seconds for typical cell lines)
- [ ] Version data properly formatted for diff display

## Technical Environment

### Development Setup
```bash
# Backend (ensure Sprint 4 APIs are running)
docker-compose exec web python manage.py runserver

# Frontend  
docker-compose exec frontend npm run dev
docker-compose exec frontend npm install react-diff-viewer-continued lodash

# Access
Frontend: http://localhost:3000/tools/editor
Backend APIs: 
- Version History: http://localhost:8000/api/celllines/{id}/versions/
- Specific Version: http://localhost:8000/api/celllines/{id}/versions/{version}/
```

### Key Files for Implementation
- **Main Editor Page**: `src/app/tools/editor/page.tsx`
- **State Management**: `src/app/tools/editor/hooks/useCellLineData.tsx`
- **Types**: `src/app/tools/editor/types/editor.ts`
- **Existing Components**: All Phase 1 components remain functional

### Existing Foundation to Build Upon
- ✅ **TASK-FE-1**: Custom pseudo-text-editor (92% complete, production ready)
- ✅ **TASK-FE-2**: Modal editing, syntax highlighting, array management (16+ enhancements)
- ✅ **TASK-BE-2**: Version storage infrastructure (85ms performance, exceeds targets)
- ✅ **TASK-BE-3**: Field editing validation (98.6% success rate, zero critical errors)

## Success Criteria

### Week 1 Success
- [ ] VersionPanel component functional and integrated
- [ ] Enhanced state management supporting comparison mode
- [ ] Basic GitHub-style diff viewer displaying comparisons
- [ ] Mode switching between edit and compare working
- [ ] API integration for version history and specific versions

### Week 2 Success  
- [ ] Change statistics component complete and accurate
- [ ] Seamless version selection to diff display workflow
- [ ] Professional comparison interface with proper styling
- [ ] Error handling robust with user feedback
- [ ] Performance targets met (sub-2 second diff calculation)
- [ ] Complete edit-to-compare user workflow functional

### Overall Sprint 5 Success
- [ ] **Complete Version Control UI**: Professional GitHub-style comparison interface
- [ ] **Seamless Workflow**: Edit-to-compare functionality as specified in wireframes
- [ ] **Performance Excellence**: Fast version loading and diff calculation 
- [ ] **User Experience**: Intuitive version selection and comparison
- [ ] **Foundation for Phase 3**: Robust platform for validation framework integration
- [ ] **Zero Regression**: All Phase 1 functionality maintained and enhanced

## Implementation Notes

### Performance Optimization Strategy
- **Data Management**: Keep only current + comparison cell line in memory (4-10KB each)
- **Lazy Loading**: Load version data only when selected for comparison
- **Memoized Components**: Version list items and diff lines for smooth scrolling
- **Debounced Calculation**: For real-time diff updates during version switching

### Integration with Existing Design System
- Follow existing color scheme and component patterns from Phase 1
- Use established button styles and layout patterns
- Maintain consistency with existing navigation and headers
- Ensure responsive design matches existing editor interface

### Testing Strategy
- **Component Testing**: VersionPanel, DiffViewer, ChangeStatistics
- **Integration Testing**: End-to-end version comparison workflow
- **Performance Testing**: Diff calculation with 150+ field data
- **Error Handling**: API failures, network issues, invalid version data

## Delivery Requirements

### Code Quality Standards
- TypeScript with proper typing (following existing patterns)
- React component best practices with proper state management
- Clean, documented code with inline comments for complex logic
- Error handling with user-friendly messages
- Performance optimized for production use

### Documentation Updates
- Update component documentation for new version control features
- Add API integration examples for version endpoints
- Document new state management patterns for future development

### Testing and Validation
- Test with actual cell line data from development database
- Validate diff accuracy across different field types and structures
- Verify performance with largest available cell line records
- Test error scenarios and recovery workflows

## Implementation Agent Instructions

### Development Environment Verification
Before starting, verify:
1. Sprint 4 backend APIs are functional and accessible
2. Version storage working (check with existing cell line)
3. Frontend development environment running properly
4. NPM package installation permissions working

### Implementation Order (Recommended)
1. **Day 1-2**: VersionPanel component and basic state management
2. **Day 3-4**: CellLineDiffViewer foundation with basic side-by-side layout
3. **Day 5-6**: API integration and version selection workflow
4. **Day 7-8**: ChangeStatistics component and mode management
5. **Day 9-10**: Polish, testing, and performance optimization

### Completion Report Format
Please structure your completion report with:
- **Implementation Summary**: What was built and how
- **Technical Decisions**: Key architectural choices made
- **Performance Results**: Actual performance measurements vs targets
- **Testing Results**: What was tested and results
- **Known Issues**: Any limitations or areas for future improvement
- **Integration Notes**: How components integrate with existing system

---

**Sprint 5 Success Criteria**: Complete GitHub-style comparison interface enabling Dr. Suzy Butcher's edit-to-compare workflow, building on exceptional Phase 1 and Sprint 4 foundations. Target: Professional version control interface ready for production use with robust performance and error handling. 