# DOCUMENTATION TASK: CurationApp Developer Documentation

## Task Overview
**Task**: Create comprehensive developer documentation for the CurationApp
**Duration**: 3-4 hours
**Priority**: High - Essential for future development and maintenance
**Target Audience**: Future developers working on feature requests or change requests

## Objective
Create clear, comprehensive documentation that enables future developers to:
1. Understand the CurationApp's purpose, design, and architecture
2. Quickly contextualize themselves with the codebase
3. Make informed decisions when implementing changes or new features
4. Navigate the codebase efficiently

## Documentation Structure

### 1. High-Level Overview Section

#### 1.1 Purpose and Context
- **What is the CurationApp?**: AI-assisted curation system for bulk processing of transcription records
- **Who uses it?**: Dr. Suzy Butcher and other principal curators at ASCR
- **What problem does it solve?**: Manual curation of stem cell transcription records is time-consuming and error-prone
- **Integration context**: Part of the larger ASCR AdminPortal ecosystem

#### 1.2 Key Features
- Bulk article selection and curation (up to 20 concurrent requests)
- Real-time status updates with 3-second polling
- Background processing via Celery tasks
- Comprehensive error handling and reporting
- Cell line browser integration with curation source filtering
- Accessibility compliance (WCAG 2.1 AA)

#### 1.3 User Workflow
1. User navigates to `/tools/curation`
2. Selects articles for curation (up to 20 items)
3. Initiates bulk curation process
4. Monitors real-time progress via status dashboard
5. Views detailed error information if failures occur
6. Can filter cell lines by curation source in the editor

### 2. Technical Architecture Section

#### 2.1 System Overview
- **Backend**: Django 5.0.2 + DRF + Celery + PostgreSQL
- **Frontend**: Next.js 15.3.4 + React 19.0.0 + Tailwind CSS
- **Background Processing**: Celery with Redis
- **Real-time Updates**: 3-second polling mechanism
- **Error Handling**: Comprehensive error categorization and reporting

#### 2.2 Data Models
**Article Model** (will be renamed to TranscriptionRecord in future):
- `curation_error`: Stores error messages for failed curations
- `curation_started_at`: Timestamp when curation began
- `curation_status`: Current status (pending, processing, completed, failed)

**CellLineTemplate Model**:
- `curation_source`: Source of curation (hpscreg, LLM, institution, manual)

#### 2.3 API Endpoints
- `GET /api/curation/articles/` - List articles with curation status
- `POST /api/curation/bulk_curate/` - Initiate bulk curation
- `GET /api/curation/status/` - Get real-time status counts
- `GET /api/curation/{id}/error_details/` - Get detailed error information

#### 2.4 Celery Tasks
- `curate_article`: Individual article curation task
- `bulk_curate_articles`: Orchestrates bulk curation process
- Mock OpenAI integration function (ready for real API integration)

### 3. Implementation Details Section

#### 3.1 Frontend Architecture
**Key Components**:
- `CurationPage`: Main page component at `/tools/curation`
- `ArticlesTable`: Multi-select table with status indicators
- `CurationActions`: Bulk curation controls
- `ErrorModal`: Detailed error display
- `StatusDashboard`: Real-time status counts
- `useStatusPolling`: Custom hook for real-time updates

**State Management**:
- React hooks for local state
- Custom polling hook for real-time updates
- Optimized re-rendering with React.memo and useCallback

#### 3.2 Backend Architecture
**Key Files**:
- `api/curation/views.py`: API endpoint implementations
- `api/tasks.py`: Celery task definitions
- `api/models.py`: Data model definitions
- `api/serializers.py`: API serialization logic

**Background Processing**:
- Celery workers handle up to 20 concurrent curation requests
- Task status tracking and error propagation
- Retry logic for transient failures

#### 3.3 Real-time System
**Polling Mechanism**:
- 3-second intervals during active processing
- Automatic start/stop based on processing state
- Request cancellation to prevent race conditions
- AbortController integration for proper cleanup

**Status Updates**:
- Live status indicators with animations
- Real-time counts for all processing states
- Error categorization and troubleshooting guidance

#### 3.4 Error Handling
**Error Categories**:
- OpenAI API errors
- Data processing errors
- Network errors
- Application errors

**Error Display**:
- Modal with detailed error information
- User-friendly troubleshooting tips
- Error reporting system for production monitoring

### 4. Integration Points Section

#### 4.1 Cell Line Browser Integration
**Location**: `/tools/editor` (existing cell line browser)
**Enhancements**:
- Added curation_source filter dropdown
- Server-side filtering for performance
- Visual badges showing curation source
- Real-time updates when filter changes

**Key Files**:
- `api/editor/views.py`: Backend filtering logic
- `CustomCellLineEditor.tsx`: Frontend filter UI
- `CellLineCard.tsx`: Curation source badge display

#### 4.2 Navigation Integration
**Sidebar Integration**: Added "Curation" link to existing navigation
**Layout Integration**: Uses existing AppLayout component
**Routing**: Next.js folder-based routing at `/tools/curation`

### 5. Configuration and Environment Section

#### 5.1 Environment Variables
**Required for Production**:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_ENABLE_ERROR_REPORTING`: Enable error reporting
- `NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT`: Error reporting endpoint
- `NEXT_PUBLIC_ENABLE_PERFORMANCE_METRICS`: Performance monitoring

**Development Defaults**:
- API URL defaults to `http://localhost:8000`
- Error reporting disabled by default
- Performance metrics disabled by default

#### 5.2 Database Configuration
**Required Fields**:
- `curation_source` field in CellLineTemplate model
- `curation_error` and `curation_started_at` fields in Article model
- Migration files available for schema updates

### 6. Development Guidelines Section

#### 6.1 Code Organization
**Frontend Structure**:
```
/tools/curation/
├── components/          # React components
├── hooks/              # Custom React hooks
├── __tests__/          # Test files
└── page.tsx           # Main page component
```

**Backend Structure**:
```
api/
├── curation/           # Curation-specific views and URLs
├── editor/            # Cell line browser integration
├── tasks.py           # Celery task definitions
└── models.py          # Data model definitions
```

#### 6.2 Testing Strategy
**Frontend Testing**:
- Component tests for individual components
- Performance testing utilities for large datasets
- Accessibility testing with ARIA compliance
- End-to-end workflow testing

**Backend Testing**:
- API endpoint tests
- Celery task tests
- Model validation tests
- Integration tests

#### 6.3 Performance Considerations
**Frontend Optimizations**:
- Server-side filtering for large datasets
- Request cancellation to prevent memory leaks
- React.memo and useCallback for efficient re-rendering
- Optimized polling with proper cleanup

**Backend Optimizations**:
- Database indexing on frequently queried fields
- Celery task queuing for concurrent processing
- API response caching where appropriate
- Efficient database queries with select_related/prefetch_related

### 7. Common Development Tasks Section

#### 7.1 Adding New Error Types
1. Update error categorization in `ErrorModal.tsx`
2. Add error handling in Celery tasks
3. Update error display logic
4. Test error scenarios

#### 7.2 Modifying Curation Process
1. Update Celery task logic in `api/tasks.py`
2. Modify API endpoints if needed
3. Update frontend status handling
4. Test with various article types

#### 7.3 Adding New Status Types
1. Update Article model status choices
2. Modify API serializers
3. Update frontend status indicators
4. Add status-specific UI components

#### 7.4 Performance Optimization
1. Use performance monitoring utilities
2. Implement server-side filtering
3. Optimize database queries
4. Monitor real-time update performance

### 8. Troubleshooting Section

#### 8.1 Common Issues
**Real-time Updates Not Working**:
- Check polling hook configuration
- Verify API endpoint responses
- Check network connectivity
- Review browser console for errors

**Curation Process Failing**:
- Check Celery worker status
- Review task logs for errors
- Verify OpenAI API configuration
- Check database connectivity

**Performance Issues**:
- Monitor API response times
- Check database query performance
- Review frontend rendering performance
- Analyze memory usage patterns

#### 8.2 Debugging Tools
**Frontend Debugging**:
- React Developer Tools
- Browser Network tab
- Console logging in custom hooks
- Performance monitoring utilities

**Backend Debugging**:
- Django debug toolbar
- Celery task monitoring
- Database query logging
- API endpoint testing

## Required Completion Reports

To create comprehensive documentation, the Implementation Agent will need access to:

### 1. Sprint Completion Reports
- `documents/features/CurationApp/SPRINT-1-Completion-Report.md`
- `documents/features/CurationApp/SPRINT-2-Completion-Report.md`
- `documents/features/CurationApp/SPRINT-3-Completion-Report.md`
- `documents/features/CurationApp/SPRINT-4-Completion-Report.md`

### 2. Technical Specifications
- `documents/features/CurationApp/CurationApp-Requirements.md`
- `documents/features/CurationApp/CurationApp-Implementation-Plan.md`
- `documents/features/CurationApp/CurationAppBrief.md`

### 3. Code Review Access
The Implementation Agent should review key implementation files:
- `api/curation/views.py`
- `api/tasks.py`
- `api/front-end/my-app/src/app/tools/curation/page.tsx`
- `api/front-end/my-app/src/app/tools/curation/components/`
- `api/front-end/my-app/src/app/tools/curation/hooks/`
- `api/editor/views.py` (for cell line integration)

## Deliverables

### 1. Main Documentation File
**File**: `documents/features/CurationApp/CurationApp-Developer-Documentation.md`

**Content**:
- High-level overview with purpose and context
- Technical architecture details
- Implementation specifics
- Integration points
- Configuration and environment setup
- Development guidelines
- Common development tasks
- Troubleshooting guide

### 2. Quick Reference Guide
**File**: `documents/features/CurationApp/CurationApp-Quick-Reference.md`

**Content**:
- Key file locations and purposes
- Common commands and configurations
- Quick troubleshooting steps
- API endpoint reference
- Environment variable reference

### 3. Architecture Diagram
**File**: `documents/features/CurationApp/CurationApp-Architecture.md`

**Content**:
- System architecture diagram
- Data flow diagrams
- Component interaction diagrams
- API endpoint mapping

## Success Criteria

### Documentation Quality
- [ ] Clear, concise writing suitable for developers
- [ ] Logical organization with appropriate subsections
- [ ] Comprehensive coverage of all major components
- [ ] Practical examples and code snippets where helpful
- [ ] Troubleshooting guidance for common issues

### Developer Usability
- [ ] Enables quick understanding of system purpose and design
- [ ] Provides clear guidance for common development tasks
- [ ] Includes troubleshooting steps for typical issues
- [ ] References key files and code locations
- [ ] Explains integration points with existing systems

### Completeness
- [ ] Covers all major system components
- [ ] Includes configuration and environment setup
- [ ] Documents API endpoints and data models
- [ ] Explains real-time system and error handling
- [ ] Provides development guidelines and best practices

## Notes for Implementation

### Documentation Style Guidelines
- **Be concise but comprehensive**: Include all necessary details without unnecessary verbosity
- **Use clear headings and subsections**: Make it easy to navigate and find specific information
- **Include code examples**: Show actual implementation patterns where helpful
- **Focus on practical guidance**: Emphasize what developers need to know to make changes
- **Maintain consistency**: Use consistent terminology and formatting throughout

### Key Principles
1. **Developer-focused**: Written for developers who need to understand and modify the system
2. **Context-aware**: Explains how the CurationApp fits into the larger ASCR AdminPortal
3. **Practical**: Provides actionable guidance for common development tasks
4. **Maintainable**: Structure that can be easily updated as the system evolves

### Integration Considerations
- **Existing Documentation**: Reference existing project documentation where appropriate
- **Code Comments**: Ensure documentation aligns with code comments and naming conventions
- **Future Changes**: Consider how documentation will need to be updated for future features
- **Team Knowledge**: Document decisions and trade-offs that future developers should understand

## Completion Report Requirements

After completing this documentation task, provide a comprehensive report including:
1. Summary of documentation created
2. Coverage assessment of all major components
3. Usability testing results (if applicable)
4. Any gaps identified and recommendations
5. Maintenance considerations for keeping documentation current
6. Integration with existing project documentation

**File**: `documents/features/CurationApp/DOCUMENTATION-Completion-Report.md` 