# CellLineEditor Phase 2: Version Control Integration

## Overview

**Phase 2 Duration**: 2-3 weeks
**Focus**: Complete version control system with version storage, comparison interface, and seamless edit-to-compare workflow

## Sprint Breakdown

### Sprint 4: Version Storage (1 week)
- Implement version creation on save
- Build version retrieval and listing APIs  
- Create version history timeline UI

### Sprint 5: Comparison Interface (1.5 weeks)
- Build side-by-side comparison layout
- Implement field-level diff highlighting
- Add version selection controls

### Sprint 6: Polish & Integration (0.5 weeks)
- Seamless edit-to-compare workflow
- UI/UX refinements for version features
- Testing and bug fixes

## Database Models (Already Implemented in Phase 1)

### CellLineVersion Model
```python
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

### Key Version Control Decisions
- **Full Snapshots**: Each version stores complete metadata (not deltas)
- **Benefits**: Simple implementation, fast version retrieval, no reconstruction needed
- **Trade-offs**: Higher storage usage, but acceptable given 4-10KB size per version
- **Last 10 Versions**: Automatic cleanup beyond 10 versions per cell line
- **Soft Deletion**: Use `is_archived` flag rather than hard deletion
- **Background Cleanup**: Periodic task to archive old versions

## API Endpoints for Phase 2

### Version Management APIs
```
GET    /api/celllines/{hpscreg_id}/versions/           # List version history
GET    /api/celllines/{hpscreg_id}/versions/{version}/ # Get specific version data
```

### Request/Response Formats

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

#### Specific Version Data Response
```json
{
  "hpscreg_id": "UCSFi001-A",
  "version_number": 4,
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
  "created_by": "dr.butcher",
  "created_on": "2024-01-10T14:20:00Z"
}
```

## Frontend Component Architecture

### State Management Updates

#### Enhanced EditorState for Version Control
```typescript
interface EditorState {
  originalCellLine: CellLineData;     // Original data from database
  currentCellLine: CellLineData;      // Current data with user edits
  comparisonCellLine?: CellLineData;  // When comparing with previous version
  mode: 'edit' | 'compare';          // Current editor mode
  validationErrors: ValidationError[]; // Errors from last save attempt
  isSaving: boolean;                  // Loading state during save operation
  
  // Version control specific state
  versionHistory: VersionInfo[];      // List of available versions
  isLoadingVersions: boolean;         // Loading state for version history
  selectedVersionNumber?: number;     // Currently selected version for comparison
}

interface VersionInfo {
  version_number: number;
  created_by: string;
  created_on: string;
}
```

#### New State Actions for Version Control
```typescript
type EditorAction = 
  | { type: 'LOAD_CELL_LINE'; payload: CellLineData }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: any } }
  | { type: 'SET_MODE'; payload: 'edit' | 'compare' }
  | { type: 'LOAD_COMPARISON'; payload: CellLineData }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationError[] }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SAVE_SUCCESS'; payload: CellLineData }
  | { type: 'CLEAR_COMPARISON' }
  
  // New version control actions
  | { type: 'LOAD_VERSION_HISTORY'; payload: VersionInfo[] }
  | { type: 'SET_LOADING_VERSIONS'; payload: boolean }
  | { type: 'SELECT_VERSION_FOR_COMPARISON'; payload: number }
  | { type: 'LOAD_VERSION_DATA'; payload: CellLineData };
```

### Key Components to Implement

#### 1. VersionPanel Component
**File**: `src/app/components/CellLineEditor/VersionPanel.tsx`

**Purpose**: Version history timeline interface

**Features**:
- List last 10 versions with timestamps and authors
- Click to select version for comparison
- Visual indication of current version vs. selected comparison version
- Loading states for version history fetch

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
```

#### 2. DiffViewer Components
**Base Directory**: `src/app/components/CellLineEditor/DiffViewer/`

##### DiffViewer Main Component
**File**: `CellLineDiffViewer.tsx`

**Purpose**: GitHub-style side-by-side comparison

**Interface**:
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

**Features**:
- Side-by-side comparison with line numbers
- Line-by-line highlighting (green/red/yellow)
- Clean JSON formatting for readable diffs

##### ChangeStatistics Component
**File**: `ChangeStatistics.tsx`

**Purpose**: Display diff statistics summary

**Features**:
- "+3 additions -1 deletion 2 changes" format
- Color-coded statistics (green/red/yellow)
- Percentage of file changed

##### SelectiveApply Component
**File**: `SelectiveApply.tsx`

**Purpose**: Allow selective application of changes

**Features**:
- Checkboxes for individual line changes
- "Apply selected changes" button
- Bulk select/deselect options

##### DiffOptions Component
**File**: `DiffOptions.tsx`

**Purpose**: Diff viewing options and controls

**Features**:
- Toggle: "Show only differences"
- Toggle: "Word-level diff" vs "Line-level diff"
- Toggle: "Side-by-side" vs "Unified view"

#### 3. EditorContainer Mode Management
**File**: `src/app/components/CellLineEditor/EditorContainer.tsx`

**Enhanced to support**:
- Mode toggle between 'edit' and 'compare'
- Conditional rendering of PseudoEditor vs DiffViewer
- State synchronization between edit and comparison modes

#### 4. EditorHeader Updates
**File**: `src/app/components/CellLineEditor/EditorHeader.tsx`

**New Features**:
- Mode toggle button (Edit/Compare)
- Version indicator showing current vs comparison version
- Save button state management in comparison mode

## Data Flow Architecture for Version Control

### Version Comparison Flow
```
1. User clicks version in VersionPanel
2. Fetch specific version data from API
3. Update EditorState with comparison data
4. Switch mode to 'compare'
5. Render DiffViewer with original vs comparison data
6. Show change statistics and selective apply options
```

### Seamless Edit-to-Compare Workflow
```
1. User editing in PseudoEditor
2. Click "Compare with Version X" button
3. Preserve current edits in state
4. Fetch version X data
5. Show diff between current edits and version X
6. Option to apply changes from version X
7. Return to edit mode with applied changes
```

### Version Creation on Save Flow
```
1. User clicks Save in editor
2. Validate current data
3. If valid, create new version entry
4. Increment version number
5. Store complete metadata snapshot
6. Update CellLine main record
7. Update version history in frontend state
```

## Diff Visualization Strategy

### Granularity
**Line-level highlighting** (like GitHub/Git diffs)

### Visual Indicators
- **Modified lines**: Yellow/orange background on changed JSON lines
- **Added lines**: Green background for new lines in current version  
- **Removed lines**: Red background for lines removed from previous version
- **Change Statistics**: "+3 additions -1 deletion 2 changes" summary
- **Selective Apply**: Checkboxes to apply individual line changes back to editor

### JSON Formatting for Clean Diffs
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

## Performance Considerations

### Data Management Strategy
- **Typical cell line size**: 4KB - 10KB
- **Memory strategy**: Keep only current + comparison cell line in memory
- **Version loading**: On-demand fetching when user selects specific version
- **Cache strategy**: Cache recently accessed versions in memory

### Rendering Optimizations
- **Virtual scrolling**: For version history if >50 versions
- **Lazy loading**: Load version data only when selected for comparison
- **Debounced diff calculation**: For real-time diff updates
- **Memoized components**: Version list items and diff lines

## File Organization Structure

```
src/app/components/CellLineEditor/
├── CellLineEditor.tsx              // Main page component
├── CellLineSelector.tsx            // Search and selection
├── EditorContainer.tsx             // Mode management (edit vs diff)
├── EditorHeader.tsx                // Save/cancel controls, file indicator
├── PseudoEditor/                   // (From Phase 1)
│   ├── CellLineEditor.tsx          // Main pseudo-editor wrapper
│   ├── SchemaValidation.tsx        // Real-time validation logic
│   ├── FieldRenderer.tsx           // Field name and value rendering
│   ├── ValueEditor.tsx             // Inline value editing components
│   ├── JSONConverter.tsx           // Hidden JSON structure management
│   └── types.ts                    // Shared interfaces
├── DiffViewer/                     // NEW FOR PHASE 2
│   ├── CellLineDiffViewer.tsx      // GitHub-style diff component
│   ├── ChangeStatistics.tsx        // +/- change summary
│   ├── SelectiveApply.tsx          // Checkbox selection for changes
│   └── DiffOptions.tsx             // Diff viewing options
├── VersionPanel.tsx                // NEW FOR PHASE 2 - Version history timeline
├── ValidationDisplay.tsx           // Error messages with line numbers
├── NetworkErrorDisplay.tsx         // Network error handling
└── context/
    ├── EditorContext.tsx           // ENHANCED FOR PHASE 2 - State management
    └── types.ts                    // ENHANCED FOR PHASE 2 - Context type definitions
```

## Technical Dependencies

### Required NPM Packages
```json
{
  "react-diff-viewer-continued": "^3.3.1",
  "lodash": "^4.17.21"
}
```

### Integration with Existing System
- **State Management**: Extend existing EditorContext
- **API Client**: Use existing API patterns and error handling
- **Styling**: Follow existing design system
- **Components**: Integrate with AppLayout, Navbar, Sidebar

## Error Handling for Version Control

### Version Loading Failures
```typescript
// Handle version fetch errors
try {
  const versionData = await api.get(`/api/celllines/${hpscreg_id}/versions/${version}/`);
  dispatch({ type: 'LOAD_VERSION_DATA', payload: versionData });
} catch (error) {
  // Show error message in version panel
  setVersionError('Failed to load version data. Please try again.');
}
```

### Version History Loading
```typescript
// Handle version history fetch errors
try {
  const versionHistory = await api.get(`/api/celllines/${hpscreg_id}/versions/`);
  dispatch({ type: 'LOAD_VERSION_HISTORY', payload: versionHistory.versions });
} catch (error) {
  // Show fallback UI or error state
  setVersionHistoryError('Version history unavailable');
}
```

## Testing Strategy for Phase 2

### Unit Tests
- VersionPanel component rendering and interactions
- DiffViewer diff calculation accuracy
- State management for version control actions
- JSON formatting consistency

### Integration Tests
- End-to-end version comparison workflow
- Save operation creating new versions
- Mode switching between edit and compare
- API integration for version endpoints

### Visual Regression Tests
- Diff highlighting accuracy
- Version timeline UI consistency
- Change statistics display

## Implementation Order

### Sprint 4: Version Storage (Week 1)
1. **Day 1-2**: Implement version creation on save
   - Update save API to create version entries
   - Test version number incrementing
   - Verify complete metadata snapshots

2. **Day 3-4**: Build version retrieval APIs
   - Implement GET /versions/ endpoint
   - Implement GET /versions/{version}/ endpoint
   - Add proper error handling and permissions

3. **Day 5**: Create basic VersionPanel component
   - Version history list UI
   - Basic click handlers for version selection
   - Loading states

### Sprint 5: Comparison Interface (Week 2-2.5)
1. **Day 1-3**: Implement DiffViewer components
   - CellLineDiffViewer main component
   - Side-by-side layout with line numbers
   - Basic diff highlighting (green/red/yellow)

2. **Day 4-5**: Add ChangeStatistics component
   - Calculate and display diff statistics
   - "+X additions -Y deletions Z changes" format
   - Visual statistics indicators

3. **Day 6-7**: Implement version selection workflow
   - Integrate VersionPanel with EditorContainer
   - State management for comparison mode
   - API calls for version data fetching

### Sprint 6: Polish & Integration (Week 3)
1. **Day 1-2**: Selective apply functionality
   - SelectiveApply component with checkboxes
   - Logic to apply individual changes back to editor
   - Bulk select/deselect options

2. **Day 3**: UI/UX refinements
   - Smooth transitions between edit/compare modes
   - Visual polish for diff highlighting
   - Responsive design adjustments

3. **Day 4-5**: Testing and bug fixes
   - End-to-end workflow testing
   - Performance optimization
   - Edge case handling

## Success Criteria

### Technical Metrics
- Version creation on every save operation
- Last 10 versions displayed in timeline
- Sub-2 second diff calculation for typical cell lines
- Accurate line-by-line diff highlighting

### User Experience Metrics
- Seamless transition between edit and compare modes
- Clear visual indication of changes between versions
- Intuitive version selection and comparison workflow
- No data loss during version operations

## Deliverables

### Complete Version Control System
- ✅ Version creation and storage on save
- ✅ Version history retrieval and display
- ✅ Version timeline UI component

### Side-by-Side Comparison Interface
- ✅ GitHub-style diff viewer
- ✅ Line-by-line change highlighting
- ✅ Change statistics display
- ✅ Version selection controls

### Advanced Features
- ✅ Selective apply for individual changes
- ✅ Seamless edit-to-compare workflow
- ✅ Last 10 versions automatic cleanup
- ✅ Performance optimized for 150+ field data

---

*This Phase 2 implementation guide extracts all version control architecture from the main Architecture.md document and provides concrete implementation steps for the 2-3 week development sprint.* 