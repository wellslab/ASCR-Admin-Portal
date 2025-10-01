# CellLineEditor Phase 3: Advanced Features Implementation Plan

## Overview & Context

**Phase 3 Goal**: Implement advanced features for production-ready CellLineEditor including search & performance optimizations, security & concurrency controls, and advanced diff features.

**Duration**: 2-3 weeks (3 sprints)  
**Prerequisites**: Phase 1 (Core Editor) and Phase 2 (Version Control) must be completed  
**Target Users**: Dr. Suzy Butcher and other curators working with 300-3000 cell lines

## Technical Context Summary

### Data Scale & Performance Requirements
- **Cell Line Count**: 300-3000 cell lines in production
- **Cell Line Size**: 4KB-10KB each (~150 fields with nesting)
- **Performance Target**: Sub-2 second load times
- **Memory Strategy**: Keep only current + comparison cell line in memory
- **Concurrent Users**: Multiple curators may work simultaneously

### Architecture Foundation
- **Backend**: Django with PostgreSQL, existing authentication system
- **Frontend**: Next.js with React Context state management
- **Models**: CellLine, CellLineVersion with JSONField storage
- **Lock Strategy**: Simple boolean lock with user tracking and automatic expiration

---

## Sprint 7: Search & Performance Optimization (Week 1)

### 7.1 Cell Line Search Implementation

#### 7.1.1 Backend Search API Enhancement
**File**: `api/views.py`
```python
class CellLineViewSet(viewsets.ModelViewSet):
    def list(self, request):
        queryset = CellLine.objects.all()
        
        # Search functionality
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(hpscreg_id__icontains=search) |
                Q(metadata__cell_line_name__icontains=search)
            )
        
        # Ordering
        ordering = request.query_params.get('ordering', '-modified_on')
        queryset = queryset.order_by(ordering)
        
        # Pagination
        page_size = int(request.query_params.get('page_size', 10))
        paginator = PageNumberPagination()
        paginator.page_size = page_size
        
        return paginator.get_paginated_response(
            CellLineListSerializer(queryset, many=True).data
        )
```

#### 7.1.2 Enhanced CellLineSelector Component
**File**: `src/app/components/CellLineEditor/CellLineSelector.tsx`

**Features to Implement**:
- Real-time search with debouncing (300ms delay)
- Virtual scrolling for 3000+ items using `react-window`
- Keyboard navigation (arrow keys, enter)
- Recent/favorites list
- Search filters: locked status, last modified date range

**Search State Management**:
```typescript
interface SearchState {
  query: string;
  results: CellLineSummary[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  totalCount: number;
  filters: {
    onlyUnlocked: boolean;
    modifiedAfter?: Date;
    modifiedBefore?: Date;
  };
}
```

#### 7.1.3 Search Performance Optimizations
- **Database Indexes**: Add GIN index on metadata jsonb field for text search
- **Query Optimization**: Limit returned fields in list view, full data only on selection
- **Caching**: Implement Redis cache for common search queries (1 hour TTL)

### 7.2 Rendering Performance Optimization

#### 7.2.1 Virtual Scrolling Implementation
**Component**: `VirtualizedCellLineList.tsx`
- Use `react-window` for cell line selector
- Fixed height rows (60px each)
- Implement overscan for smooth scrolling
- Lazy load cell line preview data

#### 7.2.2 Editor Performance Enhancements
**Memory Management**:
```typescript
// Lazy loading for field groups
const useFieldGroupData = (groupName: string, isExpanded: boolean) => {
  return useMemo(() => {
    if (!isExpanded) return null;
    return loadFieldGroupData(groupName);
  }, [groupName, isExpanded]);
};

// Schema caching
const useCachedSchema = () => {
  return useMemo(() => processSchema(rawSchema), [rawSchema]);
};
```

#### 7.2.3 Bundle Size Optimization
- Code splitting for editor components
- Lazy loading of DiffViewer
- Tree shaking optimization for Monaco Editor
- Analyze and reduce bundle size by 20%

### 7.3 Database Performance Optimization

#### 7.3.1 Database Indexes
```sql
-- Add indexes for performance
CREATE INDEX idx_cellline_hpscreg_id ON cellline(hpscreg_id);
CREATE INDEX idx_cellline_modified_on ON cellline(modified_on);
CREATE INDEX idx_cellline_is_locked ON cellline(is_locked);
CREATE INDEX idx_cellline_search ON cellline USING GIN ((metadata->'cell_line_name'));

-- Version table indexes
CREATE INDEX idx_cellline_version_created_on ON cellline_version(created_on);
CREATE INDEX idx_cellline_version_cellline_version ON cellline_version(cell_line_id, version_number);
```

#### 7.3.2 Query Optimization
- Implement select_related/prefetch_related for version queries
- Add database query monitoring and optimization
- Implement connection pooling configuration

### 7.4 Sprint 7 Testing Requirements

#### Performance Testing
- Load test with 3000 cell lines
- Search performance with various query patterns
- Memory usage monitoring during long editing sessions
- Bundle size verification (target: <500KB gzipped)

#### Search Functionality Testing
- Search accuracy and relevance
- Debouncing behavior verification
- Virtual scrolling edge cases
- Keyboard navigation testing

### 7.4 Sprint 7 Deliverables
- ✅ Cell line search with real-time results
- ✅ Virtual scrolling for large datasets
- ✅ Performance optimizations (sub-2s load times)
- ✅ Database indexes and query optimization
- ✅ Bundle size optimization

---

## Sprint 8: Security & Concurrency (Week 2)

### 8.1 Concurrent Editing Prevention

#### 8.1.1 Enhanced Lock Management System
**Backend Implementation**: `api/views.py`
```python
class CellLineLockManager:
    LOCK_TIMEOUT_MINUTES = 30
    
    @staticmethod
    def acquire_lock(cell_line, user):
        """Acquire edit lock with conflict detection"""
        if cell_line.is_locked:
            if cell_line.locked_by != user.username:
                # Check if lock has expired
                if cell_line.locked_at:
                    expired = timezone.now() - cell_line.locked_at
                    if expired.total_seconds() > (30 * 60):  # 30 minutes
                        # Auto-release expired lock
                        cell_line.is_locked = False
                        cell_line.locked_by = None
                        cell_line.locked_at = None
                    else:
                        raise LockConflictException(cell_line.locked_by, cell_line.locked_at)
        
        cell_line.is_locked = True
        cell_line.locked_by = user.username
        cell_line.locked_at = timezone.now()
        cell_line.save()
        
        return True
```

#### 8.1.2 Frontend Lock Management
**Component**: `LockManager.tsx`
- Auto-acquire lock when opening editor
- Browser beforeunload event handling
- Heartbeat mechanism to maintain lock
- Visual indicators for locked resources
- Grace period handling for unsaved changes

**Lock State Management**:
```typescript
interface LockState {
  isLocked: boolean;
  lockedBy: string | null;
  lockedAt: Date | null;
  hasUnsavedChanges: boolean;
  lockHeartbeatInterval: NodeJS.Timeout | null;
}

// Browser close detection
useEffect(() => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
    
    // Release lock using sendBeacon for reliability
    navigator.sendBeacon(
      `/api/celllines/${hpscreg_id}/lock/`,
      JSON.stringify({ method: 'DELETE' })
    );
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges, hpscreg_id]);
```

#### 8.1.3 Lock Conflict Resolution
- **Conflict Detection**: Real-time lock status checking
- **User Notification**: Clear messaging about conflicts
- **Graceful Degradation**: Read-only mode when locked by others
- **Lock Stealing**: Admin override capability (future enhancement)

### 8.2 Authentication & Authorization Enhancement

#### 8.2.1 Permission System Integration
**Django Permissions**: Enhance existing permission system
```python
class CellLinePermissions(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        # Read permissions for all authenticated users
        if view.action in ['list', 'retrieve']:
            return True
            
        # Write permissions only for editors
        if view.action in ['create', 'update', 'partial_update']:
            return request.user.has_perm('api.change_cellline')
            
        # Delete permissions only for admin
        if view.action == 'destroy':
            return request.user.has_perm('api.delete_cellline')
            
        return False
```

#### 8.2.2 Frontend Permission Handling
**Component**: `PermissionProvider.tsx`
- Context provider for user permissions
- Conditional rendering based on permissions
- Graceful degradation for read-only users
- Permission-aware UI components

### 8.3 Audit Trail Implementation

#### 8.3.1 Enhanced Audit Model
```python
class CellLineAuditLog(models.Model):
    cell_line = models.ForeignKey(CellLine, on_delete=models.CASCADE)
    action = models.CharField(max_length=50)  # 'created', 'updated', 'deleted', 'locked', 'unlocked'
    user = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(blank=True, null=True)  # Action-specific metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        db_table = 'cellline_audit_log'
        indexes = [
            models.Index(fields=['cell_line', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
        ]
```

#### 8.3.2 Audit Trail Integration
- **Automatic Logging**: All CRUD operations logged
- **User Context**: IP address, user agent tracking
- **Change Details**: Field-level change tracking
- **Retention Policy**: 1 year retention with archival

### 8.4 Security Enhancements

#### 8.4.1 Input Validation & Sanitization
- **XSS Prevention**: Sanitize all user inputs in metadata
- **JSON Injection**: Validate JSON structure before storage
- **Schema Enforcement**: Strict schema validation on save
- **Rate Limiting**: Implement rate limiting for API endpoints

#### 8.4.2 CSRF & API Security
- **CSRF Tokens**: Ensure CSRF protection for all state-changing operations
- **API Versioning**: Version API endpoints for backward compatibility
- **Error Handling**: Secure error messages (no sensitive data exposure)

### 8.5 Sprint 8 Testing Requirements

#### Security Testing
- Permission boundary testing
- Lock mechanism stress testing
- CSRF protection verification
- Input validation edge cases
- SQL injection prevention testing

#### Concurrency Testing
- Multiple user lock conflicts
- Lock expiration scenarios
- Browser close detection
- Network interruption during lock operations

### 8.5 Sprint 8 Deliverables
- ✅ Robust concurrent editing prevention
- ✅ Enhanced authentication/authorization
- ✅ Complete audit trail system
- ✅ Security hardening implementation
- ✅ Lock conflict resolution UI

---

## Sprint 9: Advanced Diff Features (Week 3)

### 9.1 Selective Field Revert Capabilities

#### 9.1.1 Field-Level Revert System
**Component**: `SelectiveRevertManager.tsx`
```typescript
interface RevertableChange {
  fieldPath: string;
  currentValue: any;
  previousValue: any;
  changeType: 'added' | 'deleted' | 'modified';
  canRevert: boolean;
}

const useSelectiveRevert = (currentData: CellLineData, comparisonData: CellLineData) => {
  const [selectedChanges, setSelectedChanges] = useState<Set<string>>(new Set());
  
  const revertableChanges = useMemo(() => {
    return computeFieldLevelDiff(currentData, comparisonData);
  }, [currentData, comparisonData]);
  
  const revertSelectedFields = useCallback(() => {
    const revertedData = { ...currentData };
    selectedChanges.forEach(fieldPath => {
      const change = revertableChanges.find(c => c.fieldPath === fieldPath);
      if (change) {
        setNestedValue(revertedData, fieldPath, change.previousValue);
      }
    });
    return revertedData;
  }, [currentData, selectedChanges, revertableChanges]);
  
  return { revertableChanges, selectedChanges, setSelectedChanges, revertSelectedFields };
};
```

#### 9.1.2 Field-Level Diff Computation
**Utility**: `diffUtils.ts`
- Deep comparison algorithm for nested JSON structures
- Path-based change tracking
- Change classification (addition, deletion, modification)
- Conflict detection for simultaneous edits

### 9.2 Copy From Version X Functionality

#### 9.2.1 Version Copy Interface
**Component**: `VersionCopyManager.tsx`
- Version selector dropdown
- Preview of changes before copy
- Selective field copying
- Conflict resolution for partial copies

**Implementation Strategy**:
```typescript
interface CopyOperation {
  sourceVersion: number;
  targetFields: string[];
  conflictResolution: 'overwrite' | 'merge' | 'skip';
}

const executeCopyOperation = async (operation: CopyOperation) => {
  const sourceData = await fetchCellLineVersion(hpscreg_id, operation.sourceVersion);
  const updatedData = { ...currentData };
  
  operation.targetFields.forEach(fieldPath => {
    const sourceValue = getNestedValue(sourceData.metadata, fieldPath);
    setNestedValue(updatedData, fieldPath, sourceValue);
  });
  
  return updatedData;
};
```

#### 9.2.2 Bulk Copy Operations
- **Full Version Copy**: Replace all fields with version X
- **Section Copy**: Copy entire nested objects
- **Multi-Field Copy**: Select multiple individual fields
- **Smart Merge**: Intelligent conflict resolution

### 9.3 Advanced Diff Visualization

#### 9.3.1 Enhanced DiffViewer Component
**File**: `src/app/components/CellLineEditor/DiffViewer/AdvancedDiffViewer.tsx`

**New Features**:
- **Word-Level Highlighting**: Highlight changed words within lines
- **Semantic Diff**: Understand JSON structure for better diff presentation
- **Fold Unchanged Sections**: Collapse identical sections for focus
- **Split View Options**: Side-by-side, inline, or unified diff views

#### 9.3.2 Change Statistics Enhancement
```typescript
interface AdvancedChangeStats {
  additions: number;
  deletions: number;
  modifications: number;
  fieldCount: {
    affected: number;
    total: number;
  };
  sections: {
    [sectionName: string]: {
      additions: number;
      deletions: number;
      modifications: number;
    };
  };
}
```

#### 9.3.3 Diff Filter Options
- **Show Only Changes**: Hide unchanged lines
- **Filter by Change Type**: Show only additions, deletions, or modifications
- **Section Filtering**: Focus on specific sections (donor_info, culture_conditions, etc.)
- **Search Within Diff**: Find specific changes

### 9.4 Advanced User Interface Enhancements

#### 9.4.1 Keyboard Shortcuts
**Implementation**: `KeyboardShortcuts.tsx`
- `Ctrl+S`: Save current changes
- `Ctrl+Z`: Undo last change
- `Ctrl+Shift+Z`: Redo last change
- `Ctrl+F`: Search within editor
- `Ctrl+D`: Toggle diff view
- `Ctrl+R`: Revert selected changes

#### 9.4.2 Context Menus
- Right-click context menus for fields
- Quick actions: copy, revert, compare with version
- Section-level operations

#### 9.4.3 Visual Improvements
- **Change Indicators**: Visual markers for modified fields
- **Progress Indicators**: Show save progress, validation status
- **Loading States**: Skeleton screens for better UX
- **Error States**: Friendly error messages with recovery options

### 9.5 Performance Optimizations for Advanced Features

#### 9.5.1 Diff Computation Optimization
- **Web Workers**: Move heavy diff computation to web workers
- **Memoization**: Cache diff results for unchanged data
- **Incremental Updates**: Only recompute changed sections

#### 9.5.2 Memory Management
- **Lazy Loading**: Load version data only when needed
- **Cleanup**: Automatic cleanup of unused version data
- **Efficient Data Structures**: Use appropriate data structures for diff operations

### 9.6 Sprint 9 Testing Requirements

#### Advanced Feature Testing
- Field-level revert accuracy testing
- Version copy operation validation
- Diff visualization correctness
- Keyboard shortcut functionality
- Context menu interactions

#### Performance Testing
- Diff computation performance with large datasets
- Memory usage during complex operations
- UI responsiveness during heavy operations

#### User Experience Testing
- Workflow efficiency improvements
- Error handling and recovery
- Accessibility compliance verification

### 9.6 Sprint 9 Deliverables
- ✅ Field-level revert capabilities
- ✅ Copy from version X functionality
- ✅ Advanced diff visualization
- ✅ Keyboard shortcuts and context menus
- ✅ Performance optimizations

---

## Integration Testing & Quality Assurance

### End-to-End Testing Scenarios
1. **Complete Editor Workflow**: Select → Edit → Save → Compare → Revert
2. **Concurrent User Scenarios**: Multiple users, lock conflicts, resolution
3. **Performance Under Load**: 3000 cell lines, complex diff operations
4. **Error Recovery**: Network failures, validation errors, lock timeouts

### Browser Compatibility Testing
- **Primary**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Responsive**: Desktop focus, tablet acceptable
- **Accessibility**: WCAG 2.1 AA compliance

### Security Testing
- **Penetration Testing**: Input validation, XSS prevention
- **Authorization Testing**: Permission boundaries, privilege escalation
- **Data Integrity**: Concurrent edit conflicts, lock mechanism

---

## Production Deployment Checklist

### Performance Monitoring
- Database query monitoring
- Frontend performance metrics
- Memory usage tracking
- Error rate monitoring

### Security Hardening
- HTTPS enforcement
- CSP header configuration
- Rate limiting implementation
- Audit log monitoring

### Backup & Recovery
- Database backup verification
- Version data integrity checks
- Recovery procedure documentation

---

## Success Metrics & KPIs

### Technical Metrics
- **Load Time**: <2 seconds for editor interface
- **Search Performance**: <500ms for search results
- **Memory Usage**: <100MB for extended editing sessions
- **Error Rate**: <0.1% for save operations

### User Experience Metrics
- **Task Completion Rate**: >95% for common editing workflows
- **User Satisfaction**: Positive feedback from Dr. Butcher
- **Learning Curve**: <30 minutes for new user onboarding

### Business Metrics
- **Data Integrity**: Zero data loss incidents
- **Concurrent Usage**: Support for 10+ simultaneous editors
- **Audit Compliance**: 100% action traceability

---

## Risk Mitigation & Contingency Plans

### High-Risk Areas
1. **Performance Degradation**: Implement circuit breakers and graceful degradation
2. **Data Corruption**: Robust validation and rollback mechanisms
3. **Security Vulnerabilities**: Regular security audits and updates
4. **User Adoption**: Comprehensive training and documentation

### Rollback Procedures
- Database migration rollback scripts
- Frontend version rollback capability
- Configuration rollback procedures
- User communication plan for issues

---

## Post-Phase 3 Handoff Documentation

### Technical Documentation
- API documentation with examples
- Component documentation and props
- Database schema documentation
- Deployment and configuration guide

### User Documentation
- User manual for Dr. Butcher
- Troubleshooting guide
- Feature overview and tutorials
- Best practices guide

### Maintenance Documentation
- Monitoring and alerting setup
- Backup and recovery procedures
- Security update procedures
- Performance optimization guide

---

**Total Phase 3 Duration**: 3 weeks  
**Estimated Effort**: 120-140 hours  
**Team Size**: 2-3 developers recommended  
**Dependencies**: Phases 1 & 2 completion, database migration (TODO-1)

This comprehensive plan ensures Phase 3 delivers a production-ready, secure, and performant CellLineEditor with all advanced features required for Dr. Butcher's workflow. 