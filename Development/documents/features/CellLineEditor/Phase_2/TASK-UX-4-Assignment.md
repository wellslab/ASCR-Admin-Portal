# TASK-UX-4: Performance Optimization with Caching and Virtual Scrolling

**Project**: ASCR Web Services - CellLineEditor  
**Phase**: Phase 2 Sprint 6 - UX Optimization  
**Task Type**: Frontend Implementation  
**Estimated Duration**: 2-3 days  
**Dependencies**: TASK-UX-1 (Layout), TASK-UX-2 (Diff Algorithm), TASK-UX-3 (Visual Highlighting)  

## Task Objective

Implement comprehensive performance optimizations to ensure smooth operation with 150+ fields, rapid version switching, and responsive user interactions. Focus on caching strategies, virtual scrolling, and memory management for production-ready performance.

## Context & Background

Dr. Suzy Butcher needs instant responsiveness when comparing versions during curation workflows. With 150+ fields per cell line and potential for frequent version switching, the system must maintain sub-second performance while handling large datasets efficiently.

**Current State**: Complete functional diff interface with visual highlighting  
**Target State**: Production-optimized version control system meeting all performance targets

## Performance Requirements & Targets

### **Response Time Targets**
- **Version Loading**: < 500ms per version fetch from API
- **Diff Calculation**: < 200ms client-side processing for 150+ fields
- **UI Rendering**: < 300ms for complete field display with highlighting
- **Version Switching**: < 200ms transition between cached versions
- **Scroll Performance**: 60fps during synchronized scrolling
- **Filter Operations**: < 100ms for show differences toggle

### **Memory Management Targets**
- **Version Cache**: Max 100MB for cached version data
- **Diff Cache**: Max 50MB for computed diff results
- **Component Memory**: < 200MB total browser memory usage
- **Garbage Collection**: Minimal GC pressure during normal operation

## Caching Strategy Implementation

### **Multi-Level Caching Architecture**
```typescript
interface CacheManager {
  versionCache: LRUCache<string, CellLineData>;
  diffCache: LRUCache<string, DiffResult[]>;
  schemaCache: Map<string, FieldSchema[]>;
  
  // Cache operations
  getVersion(cellLineId: string, versionId: string): Promise<CellLineData>;
  getDiff(leftKey: string, rightKey: string): DiffResult[] | null;
  setDiff(leftKey: string, rightKey: string, diff: DiffResult[]): void;
  invalidateCache(cellLineId?: string): void;
}
```

### **Version Data Caching**
```typescript
class VersionCacheManager {
  private cache: LRUCache<string, CellLineData>;
  private fetchPromises: Map<string, Promise<CellLineData>>;
  
  constructor(maxSize: number = 50) {
    this.cache = new LRUCache({ max: maxSize, maxAge: 1000 * 60 * 10 }); // 10 min TTL
    this.fetchPromises = new Map();
  }
  
  async getVersion(cellLineId: string, versionId: string): Promise<CellLineData> {
    const cacheKey = `${cellLineId}:${versionId}`;
    
    // Return cached version if available
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    
    // Deduplicate concurrent requests
    const existingPromise = this.fetchPromises.get(cacheKey);
    if (existingPromise) return existingPromise;
    
    // Fetch and cache
    const fetchPromise = this.fetchFromAPI(cellLineId, versionId)
      .then(data => {
        this.cache.set(cacheKey, data);
        this.fetchPromises.delete(cacheKey);
        return data;
      })
      .catch(error => {
        this.fetchPromises.delete(cacheKey);
        throw error;
      });
    
    this.fetchPromises.set(cacheKey, fetchPromise);
    return fetchPromise;
  }
  
  private async fetchFromAPI(cellLineId: string, versionId: string): Promise<CellLineData> {
    const response = await fetch(`/api/editor/celllines/${cellLineId}/versions/${versionId}/`);
    if (!response.ok) throw new Error(`Failed to fetch version: ${response.statusText}`);
    return response.json();
  }
}
```

### **Diff Result Caching**
```typescript
class DiffCacheManager {
  private cache: LRUCache<string, DiffResult[]>;
  
  constructor(maxSize: number = 30) {
    this.cache = new LRUCache({ max: maxSize });
  }
  
  getCacheKey(leftVersionId: string, rightVersionId: string): string {
    // Normalize key order for bidirectional lookups
    return [leftVersionId, rightVersionId].sort().join(':');
  }
  
  getDiff(leftVersionId: string, rightVersionId: string): DiffResult[] | null {
    const key = this.getCacheKey(leftVersionId, rightVersionId);
    return this.cache.get(key) || null;
  }
  
  setDiff(leftVersionId: string, rightVersionId: string, diff: DiffResult[]): void {
    const key = this.getCacheKey(leftVersionId, rightVersionId);
    this.cache.set(key, diff);
  }
  
  invalidate(versionId?: string): void {
    if (!versionId) {
      this.cache.reset();
      return;
    }
    
    // Remove all diffs involving the specified version
    const keysToDelete = Array.from(this.cache.keys())
      .filter(key => key.includes(versionId));
    
    keysToDelete.forEach(key => this.cache.del(key));
  }
}
```

## Virtual Scrolling Implementation

### **Virtual List Component**
```typescript
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';

interface VirtualDiffListProps {
  diffResults: DiffResult[];
  showDifferencesOnly: boolean;
  isScrollLocked: boolean;
  onItemExpand: (fieldPath: string) => void;
}

function VirtualDiffList({ 
  diffResults, 
  showDifferencesOnly, 
  isScrollLocked,
  onItemExpand 
}: VirtualDiffListProps) {
  const [leftListRef, setLeftListRef] = useState<FixedSizeList | null>(null);
  const [rightListRef, setRightListRef] = useState<FixedSizeList | null>(null);
  
  // Synchronized scrolling for virtual lists
  const handleScroll = useCallback(({ scrollTop }: { scrollTop: number }) => {
    if (isScrollLocked) {
      leftListRef?.scrollTo(scrollTop);
      rightListRef?.scrollTo(scrollTop);
    }
  }, [isScrollLocked, leftListRef, rightListRef]);
  
  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={style}>
      <DiffField
        diffResult={diffResults[index]}
        showDifferencesOnly={showDifferencesOnly}
        onExpand={onItemExpand}
      />
    </div>
  );
  
  return (
    <div className="virtual-diff-container">
      <div className="virtual-panel">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              ref={setLeftListRef}
              height={height}
              width={width}
              itemCount={diffResults.length}
              itemSize={60} // Estimated row height
              onScroll={handleScroll}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
      
      <div className="virtual-panel">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              ref={setRightListRef}
              height={height}
              width={width}
              itemCount={diffResults.length}
              itemSize={60}
              onScroll={handleScroll}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
```

### **Dynamic Item Sizing**
```typescript
import { VariableSizeList } from 'react-window';

interface DynamicVirtualListProps {
  diffResults: DiffResult[];
  expandedFields: Set<string>;
}

function DynamicVirtualList({ diffResults, expandedFields }: DynamicVirtualListProps) {
  const getItemSize = useCallback((index: number): number => {
    const diffResult = diffResults[index];
    const baseHeight = 48; // Base field height
    
    if (!expandedFields.has(diffResult.fieldPath)) {
      return baseHeight;
    }
    
    // Calculate expanded height based on children
    const childrenHeight = (diffResult.children?.length || 0) * 40;
    return baseHeight + childrenHeight;
  }, [diffResults, expandedFields]);
  
  return (
    <AutoSizer>
      {({ height, width }) => (
        <VariableSizeList
          height={height}
          width={width}
          itemCount={diffResults.length}
          itemSize={getItemSize}
        >
          {Row}
        </VariableSizeList>
      )}
    </AutoSizer>
  );
}
```

## Component Optimization

### **Memoization Strategy**
```typescript
// Memoize expensive diff field components
const MemoizedDiffField = React.memo(DiffField, (prevProps, nextProps) => {
  return (
    prevProps.diffResult.fieldPath === nextProps.diffResult.fieldPath &&
    prevProps.diffResult.changeType === nextProps.diffResult.changeType &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.showDifferencesOnly === nextProps.showDifferencesOnly &&
    JSON.stringify(prevProps.diffResult.leftValue) === JSON.stringify(nextProps.diffResult.leftValue) &&
    JSON.stringify(prevProps.diffResult.rightValue) === JSON.stringify(nextProps.diffResult.rightValue)
  );
});

// Memoize diff computation
const useMemoizedDiff = (
  leftVersion: CellLineData | null, 
  rightVersion: CellLineData | null,
  schema: FieldSchema[]
) => {
  return useMemo(() => {
    if (!leftVersion || !rightVersion) return [];
    return generateStructuredDiff(leftVersion, rightVersion, schema);
  }, [leftVersion, rightVersion, schema]);
};

// Memoize filtered results
const useMemoizedFilteredDiff = (
  diffResults: DiffResult[],
  showDifferencesOnly: boolean
) => {
  return useMemo(() => {
    return filterDiffResults(diffResults, showDifferencesOnly);
  }, [diffResults, showDifferencesOnly]);
};
```

### **Debounced Operations**
```typescript
import { debounce } from 'lodash';

// Debounce version selection to prevent rapid API calls
const useDebouncedVersionSelection = () => {
  const [pendingSelection, setPendingSelection] = useState<{
    cellLineId: string;
    versionId: string;
    panel: 'left' | 'right';
  } | null>(null);
  
  const debouncedSelect = useMemo(
    () => debounce((cellLineId: string, versionId: string, panel: 'left' | 'right') => {
      // Actual version fetch logic
      fetchAndSetVersion(cellLineId, versionId, panel);
    }, 300),
    []
  );
  
  const selectVersion = (cellLineId: string, versionId: string, panel: 'left' | 'right') => {
    setPendingSelection({ cellLineId, versionId, panel });
    debouncedSelect(cellLineId, versionId, panel);
  };
  
  return { selectVersion, pendingSelection };
};

// Debounce search/filter operations
const useDebouncedFilter = (
  diffResults: DiffResult[],
  showDifferencesOnly: boolean
) => {
  const [filteredResults, setFilteredResults] = useState<DiffResult[]>([]);
  
  const debouncedFilter = useMemo(
    () => debounce((results: DiffResult[], showOnly: boolean) => {
      setFilteredResults(filterDiffResults(results, showOnly));
    }, 150),
    []
  );
  
  useEffect(() => {
    debouncedFilter(diffResults, showDifferencesOnly);
  }, [diffResults, showDifferencesOnly, debouncedFilter]);
  
  return filteredResults;
};
```

## Memory Management

### **Garbage Collection Optimization**
```typescript
// Cleanup hook for preventing memory leaks
const useMemoryCleanup = () => {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  
  const addTimeout = (timeout: NodeJS.Timeout) => {
    timeoutsRef.current.add(timeout);
  };
  
  const addInterval = (interval: NodeJS.Timeout) => {
    intervalsRef.current.add(interval);
  };
  
  useEffect(() => {
    return () => {
      // Cleanup all timeouts and intervals
      timeoutsRef.current.forEach(clearTimeout);
      intervalsRef.current.forEach(clearInterval);
      
      // Clear references
      timeoutsRef.current.clear();
      intervalsRef.current.clear();
    };
  }, []);
  
  return { addTimeout, addInterval };
};

// WeakMap for component references to prevent memory leaks
const componentCache = new WeakMap<DiffResult, React.ReactElement>();

const getCachedComponent = (diffResult: DiffResult): React.ReactElement | null => {
  return componentCache.get(diffResult) || null;
};

const setCachedComponent = (diffResult: DiffResult, component: React.ReactElement): void => {
  componentCache.set(diffResult, component);
};
```

### **Large Dataset Handling**
```typescript
// Pagination for extremely large diff results
interface PaginatedDiffProps {
  diffResults: DiffResult[];
  pageSize: number;
}

function PaginatedDiff({ diffResults, pageSize = 100 }: PaginatedDiffProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const paginatedResults = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return diffResults.slice(start, end);
  }, [diffResults, currentPage, pageSize]);
  
  const totalPages = Math.ceil(diffResults.length / pageSize);
  
  return (
    <div className="paginated-diff">
      <VirtualDiffList diffResults={paginatedResults} />
      
      <div className="pagination-controls">
        <button 
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
        
        <span>Page {currentPage + 1} of {totalPages}</span>
        
        <button 
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## Performance Monitoring

### **Performance Metrics Collection**
```typescript
interface PerformanceMetrics {
  versionLoadTime: number;
  diffComputeTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  
  startTiming(operation: string): () => number {
    const start = performance.now();
    return () => performance.now() - start;
  }
  
  recordMetric(type: keyof PerformanceMetrics, value: number): void {
    // Store in local metrics array or send to analytics
    console.log(`Performance: ${type} = ${value}ms`);
  }
  
  getAverageMetric(type: keyof PerformanceMetrics): number {
    const values = this.metrics.map(m => m[type]).filter(v => v > 0);
    return values.reduce((sum, val) => sum + val, 0) / values.length || 0;
  }
  
  getCacheHitRate(cache: LRUCache<string, any>): number {
    // Calculate cache hit rate from cache statistics
    return 0.9; // Placeholder
  }
}

// Usage in components
const performanceMonitor = new PerformanceMonitor();

const usePerfTracking = (operationName: string) => {
  const track = useCallback((fn: () => void) => {
    const endTiming = performanceMonitor.startTiming(operationName);
    fn();
    const duration = endTiming();
    performanceMonitor.recordMetric('renderTime', duration);
  }, [operationName]);
  
  return { track };
};
```

### **Real-time Performance Dashboard**
```typescript
// Dev-only performance overlay
function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const interval = setInterval(() => {
      setMetrics({
        versionLoadTime: performanceMonitor.getAverageMetric('versionLoadTime'),
        diffComputeTime: performanceMonitor.getAverageMetric('diffComputeTime'),
        renderTime: performanceMonitor.getAverageMetric('renderTime'),
        memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
        cacheHitRate: 0.9 // From cache manager
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!metrics || process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="performance-dashboard">
      <h4>Performance Metrics</h4>
      <div>Version Load: {metrics.versionLoadTime.toFixed(1)}ms</div>
      <div>Diff Compute: {metrics.diffComputeTime.toFixed(1)}ms</div>
      <div>Render Time: {metrics.renderTime.toFixed(1)}ms</div>
      <div>Memory Usage: {metrics.memoryUsage.toFixed(1)}MB</div>
      <div>Cache Hit Rate: {(metrics.cacheHitRate * 100).toFixed(1)}%</div>
    </div>
  );
}
```

## Load Testing & Benchmarks

### **Performance Test Scenarios**
```typescript
const performanceTests = [
  {
    name: 'large_field_comparison',
    description: 'Compare versions with 200+ fields',
    setup: () => generateLargeFieldTestData(200),
    expectations: {
      diffComputeTime: 200, // ms
      renderTime: 300,      // ms
      memoryUsage: 50       // MB
    }
  },
  {
    name: 'rapid_version_switching',
    description: 'Switch between 10 different version pairs rapidly',
    setup: () => generateVersionSwitchingTest(10),
    expectations: {
      versionLoadTime: 100, // ms (cached)
      transitionTime: 200   // ms
    }
  },
  {
    name: 'nested_object_expansion',
    description: 'Expand large nested objects with 50+ children',
    setup: () => generateNestedObjectTest(50),
    expectations: {
      expansionTime: 150,   // ms
      scrollPerformance: 16 // ms (60fps)
    }
  }
];

async function runPerformanceTests(): Promise<void> {
  for (const test of performanceTests) {
    console.log(`Running test: ${test.name}`);
    
    const testData = test.setup();
    const results = await executePerformanceTest(testData);
    
    // Validate against expectations
    Object.entries(test.expectations).forEach(([metric, expected]) => {
      const actual = results[metric];
      const passed = actual <= expected;
      console.log(`${metric}: ${actual}ms (expected: <=${expected}ms) ${passed ? '✅' : '❌'}`);
    });
  }
}
```

## Integration & Deployment

### **Performance Configuration**
```typescript
interface PerformanceConfig {
  cacheSettings: {
    versionCacheSize: number;
    diffCacheSize: number;
    cacheTTL: number;
  };
  virtualScrolling: {
    enabled: boolean;
    itemHeight: number;
    overscan: number;
  };
  debouncing: {
    versionSelectionDelay: number;
    filterDelay: number;
    searchDelay: number;
  };
}

const defaultConfig: PerformanceConfig = {
  cacheSettings: {
    versionCacheSize: 50,
    diffCacheSize: 30,
    cacheTTL: 600000 // 10 minutes
  },
  virtualScrolling: {
    enabled: true,
    itemHeight: 60,
    overscan: 5
  },
  debouncing: {
    versionSelectionDelay: 300,
    filterDelay: 150,
    searchDelay: 200
  }
};
```

### **Production Optimizations**
```typescript
// Code splitting for large libraries
const VirtualizedComponents = lazy(() => import('./VirtualizedComponents'));
const PerformanceDashboard = lazy(() => import('./PerformanceDashboard'));

// Service Worker for aggressive caching
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration);
    })
    .catch(error => {
      console.log('SW registration failed:', error);
    });
}

// Production bundle optimization
const ProductionOptimizedDiffViewer = React.memo(DiffViewer, (prev, next) => {
  // Deep comparison only in development
  if (process.env.NODE_ENV === 'development') {
    return JSON.stringify(prev) === JSON.stringify(next);
  }
  
  // Shallow comparison in production for performance
  return (
    prev.diffResults === next.diffResults &&
    prev.showDifferencesOnly === next.showDifferencesOnly
  );
});
```

## Acceptance Criteria

### **Performance Targets Met**
- ✅ Version loading < 500ms (API) + < 100ms (cached)
- ✅ Diff computation < 200ms for 150+ fields
- ✅ UI rendering < 300ms for complete interface
- ✅ Version switching < 200ms for cached versions
- ✅ Scroll performance maintains 60fps
- ✅ Memory usage < 200MB total

### **Caching Effectiveness**
- ✅ Version cache hit rate > 80% during normal usage
- ✅ Diff cache hit rate > 90% for version re-comparisons
- ✅ Cache invalidation works correctly on data updates
- ✅ Memory usage stays within limits with full caches

### **User Experience**
- ✅ No perceivable lag during version switching
- ✅ Smooth scrolling with synchronized panels
- ✅ Responsive filtering and search operations
- ✅ No UI freezing during large dataset operations

### **Production Readiness**
- ✅ Performance monitoring integrated
- ✅ Error handling for performance edge cases
- ✅ Graceful degradation for low-memory environments
- ✅ Clean integration with existing components

## Files to Create/Modify

### **New Files**
- `api/front-end/my-app/src/app/tools/editor/utils/cacheManager.ts`
- `api/front-end/my-app/src/app/tools/editor/utils/performanceMonitor.ts`
- `api/front-end/my-app/src/app/tools/editor/components/VirtualizedDiffViewer.tsx`
- `api/front-end/my-app/src/app/tools/editor/hooks/usePerformanceOptimization.tsx`
- `api/front-end/my-app/src/app/tools/editor/hooks/useDebouncedOperations.tsx`
- `api/front-end/my-app/src/app/tools/editor/config/performanceConfig.ts`

### **Files to Modify**
- `api/front-end/my-app/src/app/tools/editor/components/VersionControlLayout.tsx` - Integrate optimizations
- `api/front-end/my-app/src/app/tools/editor/components/DiffViewer.tsx` - Add virtualization
- `api/front-end/my-app/src/app/tools/editor/hooks/useVersionControl.tsx` - Add caching
- `api/front-end/my-app/package.json` - Add performance dependencies

## Dependencies to Add
```json
{
  "react-window": "^1.8.8",
  "react-virtualized-auto-sizer": "^1.0.20",
  "lru-cache": "^7.18.3",
  "lodash": "^4.17.21"
}
```

## Completion Report Requirements

Upon task completion, provide:

1. **Performance Benchmark Results**: Complete test suite results with timing data
2. **Cache Efficiency Analysis**: Hit rates and memory usage statistics
3. **Memory Profiling**: Browser memory usage analysis under various scenarios
4. **Load Testing Results**: Performance under stress conditions
5. **Integration Verification**: Confirmation all optimizations work with existing components
6. **Production Recommendations**: Deployment configuration and monitoring setup

## Notes

- Focus on production-ready performance, not just development environment
- Ensure optimizations don't compromise functionality or user experience
- Test with realistic data sizes and usage patterns
- Monitor memory usage carefully to prevent leaks
- Document performance characteristics for future maintenance 
- Remember we are operating a docker setup described in `/docker-compose.yaml`