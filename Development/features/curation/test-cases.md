# Curation App Enhancement - Test Cases

## Overview
This document contains comprehensive test cases for the enhanced curation app implementation. The tests cover the three-section layout, real-time curation results display, cell line editor integration, and all backend modifications including the critical bug fixes.

## Test Case Categories
- **BE-XXX**: Backend test cases
- **FE-XXX**: Frontend test cases  
- **INT-XXX**: Integration test cases
- **PERF-XXX**: Performance test cases
- **ERR-XXX**: Error handling test cases
- **EDGE-XXX**: Edge case test cases

---

# Backend Test Cases

## BE-001: Multiple Cell Lines Creation Fix

**Motivation:** Verify the critical bug fix in tasks.py where the code was trying to json.loads() a list instead of iterating through individual JSON strings returned by OpenAI.

**Preconditions:**
- Database contains at least one TranscribedArticle with transcription_content
- OpenAI API key is configured
- Celery worker is running

**Test Steps:**
1. Create a mock OpenAI response that returns multiple cell lines (List[str] with 3 JSON strings)
2. Trigger curate_article_task with a valid article_id
3. Monitor the task execution and database changes
4. Verify multiple CellLineTemplate records are created

**Expected Results:**
- Task completes successfully without JSON parsing errors
- Three separate CellLineTemplate records are created in database
- Each record has unique CellLine_hpscreg_id extracted by LLM
- All records have curation_source='LLM' and work_status='in progress'

**Failure Scenarios:**
- Single cell line response: Should create only one record (not fail)
- Malformed JSON in list: Should fail gracefully with specific error message
- Empty list from OpenAI: Should complete with zero cell lines created

**Pass Criteria:**
- No JSON parsing exceptions in logs
- Number of CellLineTemplate records created matches OpenAI response count
- All created records properly linked to source article

## BE-002: Source Article Field Integration

**Motivation:** Ensure the new source_article foreign key properly links cell lines back to their originating articles for the three-section workflow.

**Preconditions:**
- Database migration has been applied
- CellLineTemplate model includes source_article field
- At least one TranscribedArticle exists

**Test Steps:**
1. Run curation on a specific article
2. Verify created cell lines have source_article field populated
3. Test querying cell lines by source article
4. Test cascade behavior when article is deleted

**Expected Results:**
- source_article field is populated with correct TranscribedArticle reference
- Reverse lookup (article.curated_cell_lines.all()) works correctly
- Foreign key constraints are enforced

**Failure Scenarios:**
- Invalid article reference: Should raise database constraint error
- Null source_article: Should be allowed (for existing data)

**Pass Criteria:**
- All new cell lines have proper source_article linkage
- Database queries for article-specific cell lines return correct results
- No orphaned references after article deletion

## BE-003: New API Endpoints Functionality

**Motivation:** Validate the new API endpoints required for the three-section workflow, specifically getting cell lines by article and saving edited cell line data.

**Preconditions:**
- Django server is running
- Database contains curated cell lines linked to articles
- API authentication is configured

**Test Steps:**
1. Test GET /api/curation/{article_id}/celllines/ with valid article_id
2. Test GET /api/curation/{article_id}/celllines/ with invalid article_id  
3. Test PUT /api/curation/celllines/{cellline_id}/ with valid data
4. Test PUT /api/curation/celllines/{cellline_id}/ with invalid cellline_id

**Expected Results:**
- GET returns JSON array of cell lines with proper serialization
- PUT successfully updates cell line data and returns updated object
- Proper HTTP status codes (200, 404, 400)

**Failure Scenarios:**
- Article with no cell lines: Should return empty array (200 status)
- Invalid article_id: Should return 404 Not Found
- Invalid cellline_id: Should return 404 Not Found
- Malformed PUT data: Should return 400 Bad Request with validation errors

**Pass Criteria:**
- All endpoints return expected HTTP status codes
- Response data matches expected schema
- Database changes persist correctly after PUT requests

## BE-004: Duplicate Cell Line Handling

**Motivation:** Ensure the system properly handles cases where CellLine_hpscreg_id already exists in the database, which occurs during re-curation of articles.

**Preconditions:**
- Database contains existing CellLineTemplate with known CellLine_hpscreg_id
- Curation system configured to detect duplicates

**Test Steps:**
1. Create cell line with CellLine_hpscreg_id "TEST001"
2. Run curation that attempts to create another cell line with "TEST001"
3. Verify update_or_create logic works correctly
4. Test both update and create scenarios

**Expected Results:**
- update_or_create returns (object, False) for existing records
- update_or_create returns (object, True) for new records
- Existing data is preserved unless explicitly updated

**Failure Scenarios:**
- Database constraint violation: Should be handled by update_or_create
- Concurrent duplicate creation: Should be handled by database constraints

**Pass Criteria:**
- No database constraint violation errors
- Existing records are updated, not duplicated
- Created flag accurately reflects whether record was new or existing

## BE-005: Database Migration Validation

**Motivation:** Ensure the source_article field migration applies correctly and doesn't break existing data or functionality.

**Preconditions:**
- Clean database or database backup available
- Django migration system functional

**Test Steps:**
1. Apply migration that adds source_article field
2. Verify field exists with correct constraints (nullable, foreign key)
3. Test that existing CellLineTemplate records are unaffected
4. Verify new records can be created with source_article populated

**Expected Results:**
- Migration applies without errors
- Field exists as nullable foreign key to TranscribedArticle
- Existing data remains intact
- No performance impact on existing queries

**Failure Scenarios:**
- Migration rollback: Should cleanly remove the field
- Data corruption during migration: Should be detected and reported

**Pass Criteria:**
- Migration completes successfully
- Database schema matches expected structure
- All existing functionality continues to work

## BE-006: OpenAI Response Processing

**Motivation:** Verify the system correctly processes various OpenAI response formats and handles the transition from single cell line to multiple cell lines per article.

**Preconditions:**
- OpenAI API configured and accessible
- Test articles with known cell line content

**Test Steps:**
1. Test with article containing single cell line
2. Test with article containing multiple cell lines
3. Test with article containing no cell lines
4. Test with malformed OpenAI response

**Expected Results:**
- Single cell line: Creates one CellLineTemplate record
- Multiple cell lines: Creates multiple CellLineTemplate records
- No cell lines: Completes successfully with no records created
- Each record has proper CellLine_hpscreg_id extracted by LLM

**Failure Scenarios:**
- OpenAI timeout: Should fail with timeout error
- Invalid JSON response: Should fail with parsing error
- Missing required fields: Should fail with validation error

**Pass Criteria:**
- Response processing handles all valid scenarios
- Error handling provides meaningful feedback
- No data corruption from malformed responses

---

# Frontend Test Cases

## FE-001: Three-Section Layout Structure

**Motivation:** Ensure the curation page displays three distinct sections as specified: article selection, curation results, and cell line editor.

**Preconditions:**
- Curation page loads successfully
- Browser supports required CSS features

**Test Steps:**
1. Navigate to /tools/curation
2. Verify three sections are visible and properly arranged
3. Test responsive behavior on different screen sizes
4. Verify each section has appropriate headers and content areas

**Expected Results:**
- Three clearly defined sections displayed vertically
- Section 1: Article selection table and curation controls
- Section 2: Curation results and cell line table (initially empty)
- Section 3: Cell line editor (initially empty/disabled)

**Failure Scenarios:**
- Small screen: Sections should stack appropriately without horizontal scrolling
- CSS loading failure: Should have basic fallback styling

**Pass Criteria:**
- All three sections visible and properly styled
- Layout remains functional across browser sizes
- Clear visual separation between sections

## FE-002: Multi-Article Selection Workflow

**Motivation:** Verify the enhanced article selection supports both single and multiple article curation as specified in requirements.

**Preconditions:**
- Database contains multiple TranscribedArticle records
- Articles have various curation statuses

**Test Steps:**
1. Load curation page with populated articles table
2. Test selecting single article and clicking "Start Curation"
3. Test selecting multiple articles and clicking "Start Curation"  
4. Verify proper state management during selection

**Expected Results:**
- Article selection works via checkboxes
- "Start Curation" button enables when articles selected
- Selected articles highlighted in table
- Selection state persists during UI updates

**Failure Scenarios:**
- No articles selected: "Start Curation" should remain disabled
- All articles already processing: Should show appropriate message

**Pass Criteria:**
- Multi-selection works correctly
- UI feedback matches selection state
- Curation can be initiated with 1 or multiple articles

## FE-003: Real-Time Curation Progress Display

**Motivation:** Ensure Section 2 displays real-time progress updates as articles are processed, showing "Processing article <pubmed_id>" during curation.

**Preconditions:**
- Curation has been initiated on one or more articles
- Polling system is functional

**Test Steps:**
1. Start curation on multiple articles
2. Observe Section 2 during processing
3. Verify progress updates appear for each article
4. Confirm status changes from "Processing" to completion

**Expected Results:**
- Section 2 shows "Processing article <pubmed_id>" for each article
- Updates appear in real-time via polling
- Progress indicators are clearly visible
- Status updates reflect actual backend processing

**Failure Scenarios:**
- Polling failure: Should show connection error message
- Stale data: Should recover when polling resumes

**Pass Criteria:**
- Real-time updates work correctly
- Progress display matches actual processing status
- UI remains responsive during updates

## FE-004: Cell Line Table Population

**Motivation:** Verify that Section 2 correctly displays the table of curated cell lines as results become available, showing the total count and making rows clickable.

**Preconditions:**
- Articles have completed curation with cell lines found
- Cell line data is available via API

**Test Steps:**
1. Complete curation on articles containing cell lines
2. Verify Section 2 shows "Found <number> cell lines in article <pubmed_id>"
3. Confirm cell line table populates with correct data
4. Test clicking on cell line rows

**Expected Results:**
- Success message shows correct cell line count per article
- Table displays all cell lines from all curated articles
- Rows are clickable and show hover effects
- Table includes relevant columns (ID, work_status, source article)

**Failure Scenarios:**
- Articles with no cell lines: Should show "0 cell lines found" message
- Table loading error: Should display error message

**Pass Criteria:**
- Cell line count matches actual results
- Table displays complete cell line data
- Row clicking works for editor integration

## FE-005: Cell Line Editor Integration

**Motivation:** Ensure Section 3 properly integrates the existing CustomCellLineEditor component and loads selected cell line data for editing.

**Preconditions:**
- Cell lines are available for selection in Section 2
- CustomCellLineEditor component is functional

**Test Steps:**
1. Click on a cell line row in Section 2
2. Verify Section 3 loads with cell line data
3. Test editing functionality within the curation context
4. Verify save functionality works correctly

**Expected Results:**
- Section 3 activates when cell line is selected
- Editor loads with correct cell line data
- All editor features work (undo, revert, field editing)
- Save button functions and persists changes

**Failure Scenarios:**
- Editor loading failure: Should show error message in Section 3
- Data loading error: Should indicate which cell line failed to load

**Pass Criteria:**
- Seamless integration with existing editor component
- All editor functionality preserved
- Save functionality works within curation context

## FE-006: Duplicate Handling Dialog

**Motivation:** Verify the duplicate handling dialog appears when saving cell lines that already exist, providing "Replace" or "Cancel" options as specified.

**Preconditions:**
- Cell line with duplicate CellLine_hpscreg_id exists in database
- User has edited cell line data in Section 3

**Test Steps:**
1. Edit a cell line that has a duplicate CellLine_hpscreg_id in database
2. Click save and verify dialog appears
3. Test "Replace" option and verify data updates
4. Test "Cancel" option and verify no changes made
5. Test dialog behavior with multiple duplicates

**Expected Results:**
- Dialog appears with clear message about duplicates
- "Replace" option updates existing records
- "Cancel" option aborts save operation
- Dialog handles multiple duplicates appropriately

**Failure Scenarios:**
- Dialog doesn't appear: User should be notified of duplicate issue
- Network error during save: Should show connection error

**Pass Criteria:**
- Dialog appears for all duplicate scenarios
- Both options work as expected
- User receives clear feedback about actions taken

## FE-007: State Management Across Sections

**Motivation:** Ensure proper state management across all three sections, with changes in one section appropriately reflected in others.

**Preconditions:**
- All three sections are functional
- Multiple articles and cell lines available

**Test Steps:**
1. Select articles in Section 1, verify Section 2 responds
2. Start curation, verify all sections update appropriately
3. Select cell line in Section 2, verify Section 3 loads
4. Edit cell line in Section 3, verify changes persist

**Expected Results:**
- Section interactions update global state correctly
- State changes are reflected across all relevant sections
- No state desynchronization between sections

**Failure Scenarios:**
- State corruption: Should be recoverable with page refresh
- Concurrent state changes: Should handle gracefully

**Pass Criteria:**
- Consistent state across all sections
- Section interactions work seamlessly
- No unexpected state resets

## FE-008: Polling Start/Stop Logic

**Motivation:** Verify the polling system starts when curation begins and stops when all processing is complete, managing resources efficiently.

**Preconditions:**
- Polling hooks are implemented
- Curation system functional

**Test Steps:**
1. Verify no polling occurs on initial page load
2. Start curation and confirm polling begins
3. Monitor polling frequency during processing
4. Verify polling stops when all articles complete
5. Test manual polling stop/start

**Expected Results:**
- Polling starts only when curation is active
- Polling interval is appropriate (not too frequent/infrequent)
- Polling stops automatically when processing complete
- Manual control works correctly

**Failure Scenarios:**
- Polling never stops: Should have timeout mechanism
- Polling too frequent: Should implement rate limiting

**Pass Criteria:**
- Efficient resource usage with appropriate polling
- Automatic start/stop logic works correctly
- Manual controls function as expected

---

# Integration Test Cases

## INT-001: End-to-End Curation Workflow

**Motivation:** Validate the complete user journey from article selection through cell line editing and saving, ensuring all components work together seamlessly.

**Preconditions:**
- Fresh database with test articles containing transcription content
- All services (Django, Celery, Redis) running
- Frontend and backend properly connected

**Test Steps:**
1. Load curation page and select 2 articles for curation
2. Click "Start Curation" and monitor progress in Section 2
3. Wait for completion and verify cell lines appear in table
4. Click on first cell line and verify Section 3 loads
5. Edit cell line data and save successfully
6. Select second cell line and repeat editing process

**Expected Results:**
- Complete workflow executes without errors
- Data flows correctly between all components
- Final saved data persists correctly in database
- User receives appropriate feedback at each step

**Failure Scenarios:**
- Partial failure: System should handle gracefully and show specific error
- Network interruption: Should recover when connection restored

**Pass Criteria:**
- Entire workflow completes successfully
- Data integrity maintained throughout
- User experience is smooth and informative

## INT-002: Real-Time Polling Integration

**Motivation:** Ensure the frontend polling system correctly communicates with backend APIs to provide real-time updates during curation processing.

**Preconditions:**
- Curation system configured with appropriate polling intervals
- Multiple test articles ready for curation

**Test Steps:**
1. Monitor network requests before starting curation
2. Start curation and verify polling requests begin
3. Observe polling behavior during processing
4. Verify polling stops when processing complete
5. Test polling recovery after temporary network failure

**Expected Results:**
- Polling requests only occur when curation active
- API responses correctly update frontend state
- Polling frequency is appropriate for real-time feel
- Network errors handled gracefully

**Failure Scenarios:**
- API timeout: Should retry with exponential backoff
- Invalid response: Should handle without breaking UI

**Pass Criteria:**
- Seamless real-time updates throughout curation
- Efficient network usage
- Robust error recovery

## INT-003: Cross-Component Communication

**Motivation:** Verify that state changes and user interactions in one section properly trigger updates in other sections, maintaining data consistency.

**Preconditions:**
- All three sections functional with shared state management
- Test data available for interactions

**Test Steps:**
1. Select articles in Section 1, verify Section 2 responds
2. Complete curation, verify Section 2 updates with results
3. Select cell line in Section 2, verify Section 3 loads correctly
4. Edit data in Section 3, verify changes are reflected appropriately
5. Test rapid switching between different selections

**Expected Results:**
- All sections respond correctly to state changes
- Data consistency maintained across components
- No lag or incorrect data display during transitions

**Failure Scenarios:**
- Rapid state changes: Should queue or debounce appropriately
- Component unmounting: Should clean up state correctly

**Pass Criteria:**
- Smooth communication between all sections
- Data consistency maintained at all times
- Responsive user interface

## INT-004: Data Consistency Validation

**Motivation:** Ensure data remains consistent between frontend display and backend storage throughout the curation workflow, preventing data corruption or loss.

**Preconditions:**
- Database in known state
- Full curation workflow functional

**Test Steps:**
1. Record initial database state
2. Execute complete curation workflow
3. Verify frontend displays match backend data at each step
4. Test edge cases like concurrent access
5. Validate final database state matches expectations

**Expected Results:**
- Frontend displays always reflect actual backend data
- No data loss during transitions or updates
- Database constraints maintained throughout

**Failure Scenarios:**
- Data corruption: Should be detectable and recoverable
- Concurrent access: Should handle with appropriate locking

**Pass Criteria:**
- Perfect data consistency maintained
- No data loss or corruption
- All constraints and relationships preserved

---

# Performance Test Cases

## PERF-001: Large Dataset Handling

**Motivation:** Ensure the system performs adequately when processing large numbers of articles or cell lines, maintaining responsive user interface.

**Preconditions:**
- Database populated with 50+ articles
- Articles contain varying amounts of content
- System monitoring tools available

**Test Steps:**
1. Load curation page with 50+ articles in table
2. Select 10 articles for simultaneous curation
3. Monitor memory usage and response times
4. Test UI responsiveness during heavy processing
5. Verify large cell line tables render efficiently

**Expected Results:**
- Page loads within 3 seconds regardless of article count
- UI remains responsive during processing
- Memory usage stays within acceptable limits
- Large tables use virtualization or pagination

**Failure Scenarios:**
- Memory exhaustion: Should implement pagination or virtualization
- UI freezing: Should use background processing with progress indicators

**Pass Criteria:**
- Acceptable performance with large datasets
- UI remains responsive at all times
- Memory usage within system limits

## PERF-002: Concurrent User Scenarios

**Motivation:** Validate system behavior when multiple users are curating articles simultaneously, ensuring data integrity and performance.

**Preconditions:**
- Multiple user accounts or sessions available
- Sufficient test data for concurrent access
- Database supports concurrent transactions

**Test Steps:**
1. Have 3 users simultaneously access curation page
2. Each user selects different articles for curation
3. Monitor database performance and locking behavior
4. Test overlapping curation requests
5. Verify data integrity after concurrent operations

**Expected Results:**
- System handles concurrent users without conflicts
- Database performance remains acceptable
- No data corruption from concurrent access
- Appropriate locking prevents conflicts

**Failure Scenarios:**
- Database deadlock: Should retry with exponential backoff
- Resource contention: Should queue requests appropriately

**Pass Criteria:**
- System supports expected concurrent user load
- Data integrity maintained under concurrent access
- Performance degrades gracefully with increased load

## PERF-003: Memory and Resource Usage

**Motivation:** Ensure the application uses system resources efficiently, preventing memory leaks and excessive resource consumption during extended use.

**Preconditions:**
- System monitoring tools configured
- Long-running test scenarios prepared

**Test Steps:**
1. Monitor baseline memory usage
2. Execute multiple curation cycles
3. Observe memory usage patterns over time
4. Test garbage collection effectiveness
5. Monitor CPU and network resource usage

**Expected Results:**
- Memory usage remains stable over time
- No memory leaks detected
- CPU usage is reasonable during processing
- Network requests are optimized

**Failure Scenarios:**
- Memory leak: Should be detectable through monitoring
- Resource exhaustion: Should implement appropriate limits

**Pass Criteria:**
- Stable resource usage over extended periods
- No detectable memory leaks
- Efficient use of system resources

---

# Error Handling Test Cases

## ERR-001: OpenAI Service Failures

**Motivation:** Ensure the system handles OpenAI API failures gracefully, providing meaningful feedback to users and maintaining system stability.

**Preconditions:**
- OpenAI API configured
- Test scenarios for various failure modes

**Test Steps:**
1. Test with invalid API key
2. Simulate network timeout to OpenAI
3. Test with malformed OpenAI response
4. Test with rate limiting from OpenAI
5. Verify error reporting and user feedback

**Expected Results:**
- Clear error messages for different failure types
- System remains stable during API failures
- Users receive actionable feedback
- Failed articles can be retried

**Failure Scenarios:**
- Complete OpenAI outage: Should queue requests for later retry
- Partial response corruption: Should fail safely without data corruption

**Pass Criteria:**
- Graceful handling of all OpenAI failure modes
- Clear user communication about issues
- System stability maintained

## ERR-002: Network Interruption Recovery

**Motivation:** Verify the system recovers gracefully from network interruptions, maintaining user progress and providing appropriate feedback.

**Preconditions:**
- Network simulation tools available
- Active curation sessions for testing

**Test Steps:**
1. Start curation process
2. Simulate network interruption during processing
3. Verify UI behavior during disconnection
4. Restore network and verify recovery
5. Test various interruption scenarios

**Expected Results:**
- UI indicates network problems clearly
- Automatic recovery when network restored
- Minimal loss of user progress
- Appropriate retry mechanisms

**Failure Scenarios:**
- Extended outage: Should persist state locally when possible
- Partial connectivity: Should detect and handle appropriately

**Pass Criteria:**
- Robust recovery from network issues
- User progress preserved where possible
- Clear communication about network status

## ERR-003: Database Constraint Violations

**Motivation:** Ensure database integrity is maintained and violations are handled gracefully with appropriate user feedback.

**Preconditions:**
- Database constraints configured correctly
- Test scenarios for constraint violations

**Test Steps:**
1. Attempt to create duplicate CellLine_hpscreg_id
2. Test foreign key constraint violations
3. Test field validation constraints
4. Verify rollback behavior on constraint errors
5. Test concurrent constraint violations

**Expected Results:**
- Constraint violations prevent data corruption
- Clear error messages for users
- Transaction rollback on violations
- System stability maintained

**Failure Scenarios:**
- Database corruption: Should be prevented by constraints
- Concurrent violations: Should be handled with appropriate locking

**Pass Criteria:**
- Database integrity always maintained
- User-friendly error messages
- No system crashes from constraint violations

## ERR-004: Invalid User Input Handling

**Motivation:** Verify the system handles invalid user input gracefully without compromising functionality or data integrity.

**Preconditions:**
- Input validation configured on all forms
- Test cases for various invalid inputs

**Test Steps:**
1. Test invalid article selections
2. Test malformed cell line data in editor
3. Test invalid API requests
4. Test XSS and injection attempts
5. Verify input sanitization

**Expected Results:**
- Invalid input rejected with clear messages
- No security vulnerabilities from input
- System remains functional after invalid input
- Data integrity preserved

**Failure Scenarios:**
- Security attack: Should be blocked and logged
- Malformed data: Should be sanitized or rejected

**Pass Criteria:**
- Robust input validation throughout system
- Security maintained against malicious input
- Clear feedback for invalid input

---

# Edge Cases

## EDGE-001: Articles with No Cell Lines Found

**Motivation:** Handle the scenario where OpenAI processing finds no cell lines in an article, ensuring appropriate user feedback and system behavior.

**Preconditions:**
- Articles with content that contains no cell line information
- OpenAI configured to return empty results appropriately

**Test Steps:**
1. Select article known to contain no cell lines
2. Start curation process
3. Wait for completion
4. Verify Section 2 shows appropriate message
5. Confirm no database records created

**Expected Results:**
- Section 2 shows "0 cell lines found in article <pubmed_id>"
- Article marked as completed with success status
- No invalid CellLineTemplate records created
- User can proceed with other articles

**Failure Scenarios:**
- System error interpreting empty results: Should handle gracefully
- UI showing loading state indefinitely: Should timeout appropriately

**Pass Criteria:**
- Clear feedback for articles with no results
- System continues functioning normally
- No spurious database entries

## EDGE-002: Malformed Article Content

**Motivation:** Ensure the system handles articles with corrupted, incomplete, or unusually formatted transcription content without crashing.

**Preconditions:**
- Articles with various content issues (empty, corrupted, unusual formatting)
- Error handling configured

**Test Steps:**
1. Test article with empty transcription content
2. Test article with binary/corrupted content
3. Test article with extremely long content
4. Test article with special characters/encoding issues
5. Verify error handling for each scenario

**Expected Results:**
- Graceful handling of all content issues
- Clear error messages for processing failures
- System remains stable
- Failed articles can be identified and retried

**Failure Scenarios:**
- Content causing system crash: Should be caught and handled
- Memory exhaustion from large content: Should implement limits

**Pass Criteria:**
- Robust handling of malformed content
- System stability maintained
- Appropriate error reporting

## EDGE-003: Concurrent Curation Conflicts

**Motivation:** Handle scenarios where multiple users attempt to curate the same articles or edit the same cell lines simultaneously.

**Preconditions:**
- Multiple user sessions or concurrent access capability
- Database locking mechanisms configured

**Test Steps:**
1. Have two users select same article for curation
2. Test simultaneous curation initiation
3. Test concurrent editing of same cell line
4. Verify conflict resolution mechanisms
5. Test data consistency after conflicts

**Expected Results:**
- Appropriate locking prevents data corruption
- Clear feedback about conflicts to users
- One user succeeds while others receive conflict messages
- Data integrity maintained throughout

**Failure Scenarios:**
- Database deadlock: Should timeout and retry appropriately
- Lost updates: Should be prevented by proper locking

**Pass Criteria:**
- Data integrity maintained under concurrent access
- Clear conflict resolution
- No data loss or corruption from concurrent operations