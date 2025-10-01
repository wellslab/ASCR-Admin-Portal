# TASK-BE-2: Version Storage Backend Implementation

**Phase**: 2 - Version Control Integration  
**Sprint**: 4 - Version Storage  
**Duration**: 1 week  
**Priority**: Critical Path  
**Dependencies**: Phase 1 backend foundation (TASK-BE-1 completed)

## Task Overview

Implement complete version storage backend infrastructure to support Dr. Suzy Butcher's edit-to-compare workflow. This includes version creation on save operations, version retrieval APIs, and database integration with the existing CellLineTemplate model.

## Context & Background

**User Workflow**: Dr. Suzy Butcher needs to compare current cell line edits against previous versions to track changes and maintain data integrity. The version control system must store complete metadata snapshots and provide efficient retrieval for comparison interfaces.

**Technical Foundation**: Building on the successful Phase 1 backend (TASK-BE-1) which provides schema introspection, CRUD operations, and locking mechanisms. The CellLineVersion model design is already documented in Phase2.md.

**Integration Point**: This backend will support the Phase 2 frontend comparison interface, enabling side-by-side version diffs and selective change application.

## Database Schema Implementation

### CellLineVersion Model
```python
class CellLineVersion(models.Model):
    """
    Version history storing complete snapshots of cell line metadata
    """
    cell_line = models.ForeignKey(CellLineTemplate, on_delete=models.CASCADE, related_name='versions')
    version_number = models.PositiveIntegerField()
    metadata = models.JSONField()  # Complete snapshot of metadata at this version
    
    # Version metadata
    created_by = models.CharField(max_length=100, default='system')
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

## API Endpoints to Implement

### 1. Version History Listing
```
GET /api/editor/celllines/{hpscreg_id}/versions/
```

**Response Format:**
```json
{
  "versions": [
    {
      "version_number": 5,
      "created_by": "system",
      "created_on": "2024-01-15T10:30:00Z",
      "change_summary": ""
    },
    {
      "version_number": 4,
      "created_by": "system", 
      "created_on": "2024-01-10T14:20:00Z",
      "change_summary": ""
    }
    // ... up to 10 most recent versions
  ],
  "total_versions": 12,
  "archived_count": 2
}
```

### 2. Specific Version Retrieval
```
GET /api/editor/celllines/{hpscreg_id}/versions/{version_number}/
```

**Response Format:**
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
    // ... complete 150+ field structure
  },
  "created_by": "system",
  "created_on": "2024-01-10T14:20:00Z",
  "change_summary": ""
}
```

### 3. Enhanced Save Operation (Update Existing)
```
PUT /api/editor/celllines/{hpscreg_id}/
```

**Enhanced Behavior:**
- Create new CellLineVersion entry before updating main record
- Increment version number automatically
- Store complete metadata snapshot
- Implement "last 10 versions" retention policy
- Return updated version information in response

## Technical Requirements

### Version Storage Strategy
- **Full Snapshots**: Store complete metadata (not deltas) for simple retrieval
- **Automatic Versioning**: Create version on every successful save operation
- **Retention Policy**: Keep last 10 versions active, archive older versions
- **Performance**: Sub-second version creation and retrieval for 4-10KB cell line data

### Database Migration
```python
# Create migration for CellLineVersion model
python manage.py makemigrations api --name add_cellline_version
python manage.py migrate
```

### Integration with Existing Locking System
- Version creation must respect existing locking mechanism
- Only locked cell lines can create new versions
- Version creation should be atomic with main record update

## Development Environment Setup

**Container Commands:**
```bash
# Backend development (Django)
docker-compose exec web bash

# Database operations
docker-compose exec db psql -U ascr_user ascr_db

# Run migrations
docker-compose exec web python manage.py migrate

# Run tests
docker-compose exec web python manage.py test api.tests.test_versions
```

## Acceptance Criteria

### Database & Models (4 criteria)
1. **✅ CellLineVersion Model**: Implemented with all specified fields and constraints
2. **✅ Migration Applied**: Database migration creates version table successfully
3. **✅ Model Relationships**: ForeignKey relationship to CellLineTemplate works correctly
4. **✅ Indexes Created**: Database indexes for performance on cell_line, version_number, created_on

### Version Creation (5 criteria)
5. **✅ Automatic Version Creation**: Every PUT operation on cell line creates new version
6. **✅ Version Number Increment**: Version numbers increment correctly (1, 2, 3...)
7. **✅ Complete Snapshot**: Full metadata stored in version.metadata field
8. **✅ Atomic Operations**: Version creation and main record update happen atomically
9. **✅ Metadata Preservation**: No data loss during version creation process

### Version Retrieval APIs (4 criteria)
10. **✅ Version History Endpoint**: GET /versions/ returns last 10 versions with metadata
11. **✅ Specific Version Endpoint**: GET /versions/{number}/ returns complete version data
12. **✅ Performance**: Version retrieval completes in <500ms for typical cell lines
13. **✅ Error Handling**: Proper 404 responses for non-existent versions

### Retention Policy (3 criteria)
14. **✅ Last 10 Versions**: Only most recent 10 versions remain active
15. **✅ Archival System**: Older versions marked as is_archived=True (not deleted)
16. **✅ Cleanup Implementation**: Background task or signal for version cleanup

### Integration & Compatibility (4 criteria)
17. **✅ Locking Compatibility**: Version creation works with existing locking mechanism
18. **✅ API Consistency**: New endpoints follow existing API patterns and error handling
19. **✅ Schema Integration**: Compatible with existing schema introspection API
20. **✅ No Breaking Changes**: Existing Phase 1 functionality remains unaffected

## Implementation Guidelines

### File Structure
```
api/
├── models.py                    # Add CellLineVersion model
├── editor/
│   ├── views.py                # Update save view, add version endpoints
│   ├── urls.py                 # Add version URL patterns
│   └── serializers.py          # Add version serializers
├── migrations/
│   └── 000X_add_cellline_version.py  # New migration
└── tests/
    └── test_versions.py        # Version-specific tests
```

### Serializer Implementation
```python
class CellLineVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CellLineVersion
        fields = ['version_number', 'created_by', 'created_on', 'change_summary']

class CellLineVersionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CellLineVersion
        fields = ['version_number', 'metadata', 'created_by', 'created_on', 'change_summary']
```

### Error Handling Requirements
- **404 Not Found**: Non-existent cell lines or version numbers
- **403 Forbidden**: Attempt to create version without proper locking
- **500 Internal**: Database errors during version creation
- **400 Bad Request**: Invalid version number format

## Testing Requirements

### Unit Tests
```python
class CellLineVersionTests(TestCase):
    def test_version_creation_on_save(self):
        # Test automatic version creation
        
    def test_version_number_increment(self):
        # Test sequential version numbering
        
    def test_last_10_versions_retention(self):
        # Test archival of old versions
        
    def test_version_retrieval_api(self):
        # Test version history and detail endpoints
```

### Integration Tests
- End-to-end save operation with version creation
- Version API responses with real cell line data
- Performance testing with 150+ field cell lines
- Concurrent save operations with locking

## Documentation Requirements

### API Documentation Updates
- Update API documentation with new version endpoints
- Include request/response examples
- Document error conditions and status codes

### Database Documentation
- Document CellLineVersion model schema
- Explain version retention policy
- Document database indexes and performance considerations

## Definition of Done

1. **✅ All 20 acceptance criteria verified and tested**
2. **✅ Database migration applied successfully in Docker environment**
3. **✅ API endpoints accessible and returning correct data formats**
4. **✅ Integration tests passing for version workflow**
5. **✅ No performance regression on existing Phase 1 functionality**
6. **✅ Code review completed with clean, maintainable implementation**
7. **✅ Documentation updated for new endpoints and database changes**

## Success Metrics

**Performance Targets:**
- Version creation: <200ms for typical cell line save
- Version retrieval: <500ms for version history
- Version detail: <300ms for specific version data

**Data Integrity:**
- Zero data loss during version creation
- 100% metadata completeness in version snapshots
- Correct version number sequencing across all test scenarios

## Completion Report Format

Please structure your completion report as follows:

### Implementation Summary
- Database changes and migration status
- API endpoints implemented and tested
- Integration with existing locking system

### Technical Achievements
- Performance metrics achieved
- Error handling and edge cases covered
- Testing coverage and results

### Verification Evidence
- API endpoint testing results
- Database query performance measurements
- Integration test outcomes

### Next Phase Readiness
- Frontend integration points available
- API documentation completed
- Any considerations for Phase 2 Sprint 5

---

**Task Assignment Complete**: Ready for Implementation Agent to begin Sprint 4 version storage backend development. Foundation is solid from Phase 1, and this task provides clear path to enable Phase 2 version control features. 