# Curation App Enhancement Implementation Plan

## Current Code Analysis

**Critical Bug Found in Current Implementation:**

In `api/curation/curate.py`:
- `curate_article_with_openai()` returns `List[str]` (line 85) - a list of JSON strings
- The function finds cell lines using `find_cell_lines_in_article()` 
- For each cell line found, it calls `extract_cell_line_metadata()` which returns a JSON string
- It collects all these JSON strings into `curation_results` list and returns it

In `api/tasks.py`:
- Line 79: `curation_json = curate_article_with_openai(article.transcription_content)` - receives a list
- Line 80: `curation_result = json.loads(curation_json)` - **ERROR**: trying to parse a list as JSON
- Lines 83-90: Only creates ONE CellLineTemplate record

**The iteration logic to create multiple CellLineTemplate records is missing.**

## 1. Backend Changes

### Critical Bug Fix - Update `tasks.py`

**Current broken code:**
```python
curation_json = curate_article_with_openai(article.transcription_content)  # Returns List[str]
curation_result = json.loads(curation_json)  # BREAKS - can't parse list
```

**Fixed code needed:**
```python
curation_results_json_list = curate_article_with_openai(article.transcription_content)  # List[str]
created_cell_lines = []

for curation_json in curation_results_json_list:
    curation_result = json.loads(curation_json)  # Parse individual JSON string
    
    cell_line_template, created = CellLineTemplate.objects.update_or_create(
        CellLine_hpscreg_id=curation_result.get('CellLine_hpscreg_id'),
        defaults={
            **curation_result,
            'curation_source': 'LLM',
            'work_status': 'in progress',
            'source_article': article  # Link back to source article
        }
    )
    created_cell_lines.append({
        'cell_line_id': cell_line_template.CellLine_hpscreg_id,
        'created': created
    })

return {
    'status': 'success',
    'article_id': article_id,
    'cell_lines': created_cell_lines,
    'total_found': len(created_cell_lines)
}
```

### Database Schema Updates
- Add `source_article` ForeignKey field to `CellLineTemplate` model pointing to `TranscribedArticle`
- This tracks which article each cell line originated from

```python
# In models.py
class CellLineTemplate(models.Model):
    # ... existing fields ...
    source_article = models.ForeignKey(
        'TranscribedArticle', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='curated_cell_lines'
    )
```

### New API Endpoints
- `GET /api/curation/{article_id}/celllines/` - Get cell lines curated from specific article
- `PUT /api/curation/celllines/{cellline_id}/` - Save edited cell line data
- Keep existing bulk curation endpoints (no need for single-article specific endpoint)

### Enhanced ViewSet Methods
- `get_article_celllines()` - Return cell lines from specific article
- `save_cellline()` - Save edited cell line with duplicate handling

## 2. Frontend Changes

### Modified Page Structure (`page.tsx`)

**Section 1: Article Selection (Enhanced)**
- Keep existing `ArticlesTable` with multi-selection capability
- Keep existing bulk curation "Start Curation" functionality
- Users can select one or multiple articles as before

**Section 2: Real-time Curated Results Display (New)**
- New component: `CurationResultsSection`
- Shows progress for each article being curated: "Processing article <pubmed_id>"
- As each article completes, shows: "There were <number> unique stem cell lines found in article <pubmed_id>"
- Displays accumulated table of all cell lines from all selected articles
- Real-time updates as curation results become available
- Each cell line row is clickable

**Section 3: Cell Line Editor (Enhanced)**
- Integrate existing `CustomCellLineEditor` component
- Loads when user clicks on cell line in section 2
- Enhanced save functionality with duplicate detection dialog

### New Components to Create
1. `CurationResultsSection.tsx` - Manages section 2 with real-time updates
2. `CurationProgress.tsx` - Shows per-article processing status
3. `AllCuratedCellLinesTable.tsx` - Combined table of cell lines from all curated articles
4. `DuplicateHandlingDialog.tsx` - "Replace/Cancel" modal for duplicate cell lines

### State Management
- `selectedArticles` - Articles selected for curation (existing)
- `curationResults` - Map of article_id to curation results and cell lines
- `allCuratedCellLines` - Flattened array of all cell lines from current curation session
- `selectedCellLineId` - Currently selected cell line for editing
- `curationInProgress` - Track overall curation progress

## 3. Workflow Logic

### Multi-Article Curation Flow
1. User selects one or more articles → clicks "Start Curation" (existing bulk flow)
2. Section 2 shows progress for each article: "Processing article <pubmed_id>"
3. As each article completes curation:
   - Shows "Found <number> cell lines in article <pubmed_id>"
   - Adds cell lines to the combined table
   - Table grows incrementally as more articles complete
4. User clicks any cell line in table → loads in section 3 editor
5. User edits and saves → handles duplicates if needed

### Real-time Updates
- Use existing polling mechanism to track curation progress
- Poll for both article status AND newly discovered cell lines
- Update section 2 display as results arrive
- Continue polling until all selected articles complete

### Duplicate Handling
- Check if `CellLine_hpscreg_id` already exists when saving edits
- Show dialog: "These cell lines have already been curated" with Replace/Cancel
- If Replace: update existing records
- If Cancel: abort save operation

## 4. Key Technical Decisions

### No Single-Article Specialization
- Reuse existing bulk curation infrastructure
- Handle single article as "bulk curation with array length 1"
- Section 2 adapts to show results whether 1 or multiple articles selected

### LLM-Discovered Identifiers
- Trust LLM to extract correct `CellLine_hpscreg_id` from article text
- No artificial ID generation - use exactly what LLM finds
- Handle cases where LLM finds multiple cell lines with different IDs in same article

### Editor Integration
- Reuse existing `CustomCellLineEditor` with minimal modifications
- Add curation-specific save logic that handles duplicates
- Maintain existing undo/revert functionality

### Polling Strategy
- Use existing `useStatusPolling` hook pattern
- Poll for article curation status and cell lines
- Stop polling when curation complete

## 5. Files to Create/Modify

### Backend
- **Modify** `api/models.py` - Add source_article field + create migration
- **Modify** `api/curation/views.py` - Add new endpoints
- **Fix** `api/tasks.py` - Fix critical bug with list iteration
- **Update** `src/lib/api.ts` - Add new endpoints

### Frontend
- **Modify** `api/front-end/my-app/src/app/tools/curation/page.tsx` - Add sections 2 & 3
- **Create** `components/CurationResultsSection.tsx`
- **Create** `components/CurationProgress.tsx`
- **Create** `components/AllCuratedCellLinesTable.tsx`
- **Create** `components/DuplicateHandlingDialog.tsx`

## 6. Implementation Priority

### Phase 1: Fix Critical Bug
1. Fix the `tasks.py` iteration logic
2. Add source_article field to model
3. Test that multiple cell lines are created correctly

### Phase 2: Frontend Structure
1. Create the three-section layout
2. Implement basic real-time updates
3. Add cell line table display

### Phase 3: Editor Integration
1. Integrate existing editor component
2. Add duplicate handling logic
3. Polish UX and error handling

This approach leverages the existing bulk curation system while adding the real-time results display and cell line editing capabilities specified in the requirements.