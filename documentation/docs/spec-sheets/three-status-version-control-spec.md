# Version Control & Three-Status System Specification

## Overview
Implement a comprehensive version control system with three-status workflow (Working, Ready, Registered) for cell line curation data.

## Core Requirements

### 1. Three-Status System

**Status Definitions:**
- **Working**: Cell lines being created or edited (draft status)
- **Ready**: Cell lines ready for ingestion into the ASCR registry database (finalized, awaiting ingestion)
- **Registered**: Cell lines successfully ingested into the ASCR registry database (final status)

**Implementation:** Directory-based storage
```
services/backend/data/
├── working/        # Working status files
│   ├── index.json
│   └── CellLine*_v*.json
├── ready/          # Ready status files
│   ├── index.json
│   └── CellLine*_v*.json
├── registered/     # Registered status files
│   ├── index.json
│   └── CellLine*_v*.json
└── ingestion_log.csv
```

### 2. Version Control Strategy

**Global Versioning:**
- Version numbers increment globally across ALL directories
- Format: `{base_name}_v{version}.json` (e.g., `CellLine001_v0.json`, `CellLine001_v5.json`)
- Version starts at 0 for new cell lines
- Every save operation creates a new version

**Version History Retention:**
- All versions kept in all directories (no automatic deletion)
- Working directory: Accumulates all draft versions
- Ready directory: Contains finalized versions awaiting ingestion
- Registered directory: Contains successfully ingested versions

**Example Version Flow:**
```
1. Create new: CellLine001_v0.json → working/
2. Edit + Save: CellLine001_v1.json → working/ (v0 remains)
3. Edit + Save: CellLine001_v2.json → working/ (v0, v1 remain)
4. Move to Ready: CellLine001_v2.json → ready/ (moved from working/)
5. ASCR registry database ingests v2, updates log
6. Auto-move: CellLine001_v2.json → registered/ (moved from ready/)
```

### 3. Duplicate Name Handling

**Auto-Versioning Strategy:**
- When saving a cell line (LLM or manual creation):
  1. Extract base name from `hpscreg_name`
  2. Search for existing versions in ALL directories (working/, ready/, registered/)
  3. Find maximum version number across all locations
  4. Create new file with version = max + 1
  5. Save to working/ directory

**Impact:**
- No name conflicts - duplicate names automatically become new versions
- Applies to both LLM-generated and manually created cell lines
- Simple, predictable behavior

### 4. Status Transitions

**Working → Ready** (User-initiated):
- User clicks "Move to Ready" in frontend
- File physically moved from working/ to ready/ directory
- Version number unchanged
- File removed from working/ index, added to ready/ index

**Ready → Registered** (Automatic):
- Background job polls ingestion log every 5 minutes
- When log contains matching filename with "success" status:
  1. Move file from ready/ to registered/ directory
  2. Update indexes accordingly
  3. Optionally: Update frontend cache/state

**Registered → Ready/Working** (Edge case):
- Not part of normal workflow
- Could be implemented later for corrections/rollbacks if needed

### 5. Ingestion Log File

**Format:** CSV with minimal fields
```csv
filename,timestamp,status
CellLine001_v2.json,2025-01-15T10:30:00Z,success
CellLine002_v0.json,2025-01-15T10:31:00Z,success
CellLine003_v1.json,2025-01-15T10:32:00Z,failed
```

**Fields:**
- `filename`: Full filename including version (e.g., `CellLine001_v2.json`)
- `timestamp`: ISO 8601 format ingestion time
- `status`: `success`, `failed`, or `partial`

**Location:** `services/backend/data/ingestion_log.csv` (shared directory accessible by both the admin portal and the ASCR registry system)

**Management:**
- Written by the ASCR registry system after ingestion attempts
- Read by ASCR backend every 5 minutes
- Append-only (no deletion, for audit trail)

### 6. Version Control UI

**Dedicated Page:** `/tools/version-control` (or similar route)

**Layout:** Two-column comparison interface

**Components:**
1. **Cell Line Selector** (shared or per-column)
   - Dropdown showing all available cell line base names
   - Fetches from `GET /get-all-cell-lines` (deduplicated base names)

2. **Left Panel:**
   - Version selector dropdown (all versions for selected cell line)
   - Display version number, creation date, status
   - Cell line data viewer

3. **Right Panel:**
   - Independent version selector
   - Same display as left panel

4. **Diff Display:**
   - Shows field-by-field comparison
   - Highlights changed fields
   - Option to show "All fields" or "Differences only"
   - Reuse existing `DiffEngine` component

**Features:**
- Select different versions of the same cell line
- Select different cell lines for comparison
- Export diff report (optional enhancement)

## Implementation Plan

### Phase 1: Backend Storage Layer

**Files to Modify:**
- `services/backend/storage.py`
- `services/backend/version_control.py`
- `services/backend/data_transport.py`

**Changes:**

1. **FileStorage (`storage.py`)**
   - Add "registered" directory support
   - Update `_get_directory_path()` to handle 3 directories
   - Ensure index management works for registered/
   - Add `list_files("registered")`

2. **VersionControl (`version_control.py`)**
   - New method: `get_max_version_across_all_directories(base_name, storage: StorageInterface)`
     - Check working/, ready/, registered/ for files matching base_name
     - Extract version numbers from all matches
     - Return highest version found (or -1 if none)

   - New method: `get_next_global_version(base_name, storage: StorageInterface)`
     - Call `get_max_version_across_all_directories()`
     - Return max + 1

   - Update `create_versioned_filename()` to always use version suffix (no more plain names)

3. **DataTransport (`data_transport.py`)**
   - New method: `save_with_auto_versioning(cell_line_data: dict, storage, version_control)`
     - Extract hpscreg_name from data
     - Get next global version number
     - Create versioned filename
     - Save to working/ directory
     - Return created filename and version

   - Update `move_to_ready_with_versioning()` → rename to `move_to_ready()`
     - Remove versioning logic (version already assigned)
     - Simple file move from working/ to ready/

   - New method: `move_to_registered(filename: str)`
     - Move file from ready/ to registered/
     - Update indexes

### Phase 2: Ingestion Log Monitor

**New File:** `services/backend/ingestion_monitor.py`

**Implementation:**
```python
class IngestionMonitor:
    def __init__(self, log_path: str, storage: StorageInterface, data_transport: DataTransport):
        self.log_path = log_path
        self.storage = storage
        self.data_transport = data_transport
        self.last_processed_line = 0

    def check_and_process_log(self):
        """Read new lines from CSV, process successful ingestions"""
        # Read CSV from last_processed_line
        # For each new line with status="success":
        #   - Check if file exists in ready/
        #   - If yes, call data_transport.move_to_registered(filename)
        # Update last_processed_line

    def run_periodic(self, interval_seconds=300):
        """Run check every 5 minutes"""
        # Use APScheduler or Celery beat for scheduling
```

**Integration Options:**
1. **Celery Periodic Task** (Recommended)
   - Add to existing `services/background_processor/worker.py`
   - Use Celery beat for scheduling
   - Reuse existing Redis connection

2. **FastAPI Background Task**
   - Use `@app.on_event("startup")` to launch background thread
   - Simpler but less robust than Celery

### Phase 3: Backend API Updates

**File:** `services/backend/main.py`

**Endpoint Changes:**

1. **POST `/working/cell-line`** (Create)
   - Update to use `data_transport.save_with_auto_versioning()`
   - Remove manual filename logic
   - Return created filename with version

2. **PUT `/working/cell-line/{filename}`** (Update/Save)
   - Instead of updating existing file, create new version
   - Extract hpscreg_name from data
   - Call `save_with_auto_versioning()`
   - Return new filename (e.g., changed from v1 to v2)

3. **POST `/cell-line/{filename}/move-to-ready`**
   - Simplify to use `data_transport.move_to_ready(filename)`
   - No versioning needed (already versioned)

4. **GET `/registered/files`** (New)
   - Return list of files in registered/ directory
   - Similar to `/working/files` and `/ready/files`

5. **GET `/get-all-cell-lines`**
   - Update to include registered location
   - Check all three directories
   - Return: `{ name: string, location: "working" | "ready" | "registered" }`

6. **GET `/stats`**
   - Add `registered_count` to response
   - Count files in registered/ directory

7. **GET `/cell-line/{filename}`**
   - Update search order: working → ready → registered

### Phase 4: Frontend Updates

**Files to Modify:**
- `services/frontend/my-app/src/app/tools/curation/page.tsx`

**Changes:**

1. **Status Filtering**
   - Add "Registered" checkbox to filter controls
   - Update `filterReady`, `filterWorking` → add `filterRegistered` state
   - Filter cell lines by location: "working" | "ready" | "registered"

2. **Cell Line List Display**
   - Update secondary text to show three statuses
   - Color coding: Working (blue), Ready (yellow), Registered (green) - optional

3. **Save Behavior**
   - Update `saveCellLine()` to handle new filename in response
   - Backend may return different filename (new version created)
   - Update `selectedCellLine` state if filename changed

4. **Move to Ready Button**
   - No changes needed (just calls existing endpoint)

5. **Auto-refresh on Registered**
   - Consider WebSocket notification when status changes to Registered
   - Or rely on existing 5-second polling

### Phase 5: Version Control Page

**New File:** `services/frontend/my-app/src/app/tools/version-control/page.tsx`

**Component Structure:**
```tsx
export default function VersionControlPage() {
  const [cellLineName, setCellLineName] = useState<string>('');
  const [leftVersion, setLeftVersion] = useState<number | null>(null);
  const [rightVersion, setRightVersion] = useState<number | null>(null);
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  // Fetch cell line names
  // Fetch available versions for selected cell line
  // Fetch data for selected versions
  // Compute diff using DiffEngine

  return (
    <Box sx={{ display: 'flex', height: '100vh', gap: 2 }}>
      {/* Header: Cell line selector, version selectors */}
      <Box sx={{ p: 2 }}>
        <CellLineSelector value={cellLineName} onChange={setCellLineName} />
        <FormControlLabel
          control={<Checkbox checked={showDiffOnly} onChange={...} />}
          label="Show differences only"
        />
      </Box>

      {/* Two-column layout */}
      <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>
        {/* Left panel */}
        <Card flex={1}>
          <VersionSelector
            cellLineName={cellLineName}
            value={leftVersion}
            onChange={setLeftVersion}
          />
          <CellLineDataViewer data={leftData} />
        </Card>

        {/* Right panel */}
        <Card flex={1}>
          <VersionSelector
            cellLineName={cellLineName}
            value={rightVersion}
            onChange={setRightVersion}
          />
          <CellLineDataViewer data={rightData} />
        </Card>
      </Box>

      {/* Diff display (optional separate panel) */}
      {leftData && rightData && (
        <DiffViewer
          leftData={leftData}
          rightData={rightData}
          showDiffOnly={showDiffOnly}
        />
      )}
    </Box>
  );
}
```

**Reusable Components:**
- `CellLineSelector`: Dropdown of all cell line base names
- `VersionSelector`: Dropdown of versions for selected cell line (with dates, status)
- `CellLineDataViewer`: Display cell line data (reuse from existing editor)
- `DiffViewer`: Reuse existing `VirtualizedDiffViewer` and `DiffEngine`

**API Calls:**
- `GET /get-all-cell-lines` → Get cell line names
- `GET /cell-line/{base_name}/versions` → Get available versions
- `GET /cell-line/{filename}` → Get version data (for left and right panels)

## Data Model Updates

**Option 1: No changes to CellLineCurationForm**
- Status inferred from file location (directory)
- Simpler, no schema changes

**Option 2: Add status field (Optional enhancement)**
- Add `status: Literal["Working", "Ready", "Registered"]` to CellLine model
- Redundant with directory location but provides validation
- Update data dictionary and regenerate models

**Recommendation:** Start with Option 1, add Option 2 later if needed for validation or reporting.

## Testing Strategy

### Backend Tests

1. **Version Control Tests:**
   - Test `get_max_version_across_all_directories()` with files in different directories
   - Test global version incrementing
   - Test auto-versioning on duplicate names

2. **Storage Tests:**
   - Test file operations in all 3 directories
   - Test index management for registered/
   - Test move operations between directories

3. **Ingestion Monitor Tests:**
   - Test CSV parsing
   - Test file moving from ready/ to registered/
   - Test handling of failed ingestion status
   - Test incremental log reading (last_processed_line)

4. **API Endpoint Tests:**
   - Test save creates new version
   - Test move to ready
   - Test registered file listing
   - Test stats include registered count

### Frontend Tests

1. **Curation Page:**
   - Test three-status filtering
   - Test save updates filename if version changed
   - Test display of registered status

2. **Version Control Page:**
   - Test cell line selection
   - Test version selection (left and right)
   - Test diff computation
   - Test "show differences only" filter

### Integration Tests

1. **End-to-End Workflow:**
   - Create cell line → working/v0
   - Edit → working/v1
   - Move to ready → ready/v1
   - Simulate ingestion log update → registered/v1
   - Verify version control page shows all versions

2. **Duplicate Handling:**
   - LLM creates cell line with existing name
   - Verify new version created
   - Manual user creates with existing name
   - Verify new version created

## Migration Plan

### Data Migration

**Existing Files:** Files in current working/ and ready/ may not have version suffixes

**Migration Script:**
```python
# migrate_to_versioned.py
# 1. Scan working/ and ready/ directories
# 2. For each file without version suffix:
#    - Extract base name
#    - Rename to {base_name}_v0.json
# 3. Update indexes
# 4. Create registered/ directory with empty index
```

**Timing:** Run before deploying new backend code

### Deployment Steps

1. Stop services
2. Run migration script
3. Deploy new backend code
4. Deploy frontend code
5. Start ingestion monitor
6. Verify all systems operational

## Performance Considerations

1. **Index Performance:**
   - Index files enable O(1) base name lookup
   - No need to scan directories

2. **Log File Growth:**
   - CSV append-only, could grow large over time
   - Consider log rotation after X months
   - Or archive old entries

3. **Version History:**
   - Unlimited versions could consume disk space
   - Consider future cleanup policy (keep last N versions)
   - Not part of initial implementation

4. **Ingestion Monitor:**
   - 5-minute polling is lightweight
   - Only reads new lines from CSV (incremental)
   - Move operations are fast (same filesystem)

## Open Questions & Future Enhancements

1. **Version Cleanup:**
   - Should old versions in working/ ever be auto-deleted?
   - Consider policy: Keep only last 5 Working versions?

2. **Rollback Feature:**
   - Allow user to revert to previous version?
   - Would need UI to select version and "restore" to working/

3. **Batch Operations:**
   - Move multiple files to Ready at once?
   - Bulk download from Registered?

4. **Audit Trail:**
   - Track who made each version?
   - Timestamp for each save?
   - Add metadata to JSON files?

5. **Ingestion Log Visualization:**
   - Dashboard showing ingestion success/failure rates?
   - Alerts for failed ingestions?

## Critical Files

**Backend:**
- `/services/backend/storage.py` - Storage layer with 3-directory support
- `/services/backend/version_control.py` - Global versioning logic
- `/services/backend/data_transport.py` - Auto-versioning save, status transitions
- `/services/backend/main.py` - API endpoints
- `/services/backend/ingestion_monitor.py` - NEW - Log polling service

**Frontend:**
- `/services/frontend/my-app/src/app/tools/curation/page.tsx` - Three-status UI
- `/services/frontend/my-app/src/app/tools/version-control/page.tsx` - NEW - Diff viewer page

**Infrastructure:**
- `services/backend/data/ingestion_log.csv` - NEW - Shared CSV file
- `services/backend/data/registered/` - NEW - Registered directory

## Success Criteria

1. ✅ New cell lines created with v0 in working/
2. ✅ Every save creates new version with global version number
3. ✅ Duplicate names auto-version correctly
4. ✅ Move to Ready works without creating new version
5. ✅ Ingestion monitor auto-moves files to registered/
6. ✅ Frontend shows three statuses correctly
7. ✅ Version control page allows side-by-side comparison
8. ✅ All existing functionality continues to work
9. ✅ Migration script successfully updates existing files

## Timeline Estimate

**Phase 1 (Backend Storage):** 2-3 hours
**Phase 2 (Ingestion Monitor):** 1-2 hours
**Phase 3 (Backend API):** 2-3 hours
**Phase 4 (Frontend Updates):** 2-3 hours
**Phase 5 (Version Control Page):** 3-4 hours
**Testing & Migration:** 2-3 hours

**Total:** 12-18 hours of development work
