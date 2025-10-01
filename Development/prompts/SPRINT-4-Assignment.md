# SPRINT-4: Integration & Polish - Final Implementation

## Sprint Overview
**Sprint**: 4 (Integration & Polish)
**Duration**: 5-7 hours
**Dependencies**: ✅ Sprint 1 (Backend Foundation), Sprint 2 (Frontend Foundation) & Sprint 3 (Core Integration) - COMPLETED
**Priority**: High - Final integration and production readiness

## Objective
Complete the CurationApp implementation with cell line browser integration and final UI/UX polish. This sprint represents the final phase of the CurationApp development, ensuring production readiness and seamless integration with the existing ASCR AdminPortal ecosystem.

## Context
Sprints 1, 2, and 3 have successfully established:
- ✅ **Backend Infrastructure**: Complete API endpoints, Celery tasks, and data models
- ✅ **Frontend Interface**: Curation page with multi-select and real-time updates
- ✅ **Real-time System**: 3-second polling with status dashboard and error handling
- ✅ **Production Config**: Environment-aware API configuration with CORS fixes
- ✅ **Error Handling**: Comprehensive error modal with categorization and troubleshooting

Sprint 4 focuses on final integration and polish to complete the production-ready CurationApp.

## Sprint Requirements

### 1. Cell Line Browser Integration

#### 1.1 Add Curation Source Filtering
**File**: `api/front-end/my-app/src/app/tools/editor/page.tsx`

Update the existing cell line browser to include curation source filtering:
```typescript
// Add to existing filter options
const filterOptions = [
  // ... existing filters
  {
    key: 'curation_source',
    label: 'Curation Source',
    type: 'select',
    options: [
      { value: '', label: 'All Sources' },
      { value: 'hpscreg', label: 'HPSCREG' },
      { value: 'LLM', label: 'LLM Generated' },
      { value: 'institution', label: 'Institution' },
      { value: 'manual', label: 'Manual Entry' }
    ]
  }
];

// Update the filter state to include curation_source
const [filters, setFilters] = useState({
  // ... existing filters
  curation_source: ''
});

// Update the API call to include curation_source filter
const fetchCellLines = async () => {
  const params = new URLSearchParams();
  // ... existing params
  if (filters.curation_source) {
    params.append('curation_source', filters.curation_source);
  }
  
  const response = await fetch(`/api/celllines/?${params}`);
  // ... rest of the function
};
```

#### 1.2 Update Cell Line API Endpoint
**File**: `api/editor/views.py`

Add curation source filtering to the existing cell line listing endpoint:
```python
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CellLineTemplate
from .serializers import CellLineTemplateSerializer

class CellLineTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CellLineTemplate.objects.all()
    serializer_class = CellLineTemplateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'CellLine_cell_line_type',
        'CellLine_source_cell_type', 
        'CellLine_source_tissue',
        'curation_source'  # Add this field
    ]
    search_fields = [
        'CellLine_hpscreg_id',
        'CellLine_alt_names',
        'CellLine_source_cell_type',
        'CellLine_source_tissue'
    ]
    ordering_fields = ['CellLine_hpscreg_id', 'created_on', 'modified_on']
    ordering = ['-modified_on']
```

#### 1.3 Add Curation Source Display
**File**: `api/front-end/my-app/src/app/tools/editor/components/CellLineCard.tsx`

Update cell line cards to display curation source:
```typescript
interface CellLineTemplate {
  // ... existing fields
  curation_source: 'hpscreg' | 'LLM' | 'institution' | 'manual';
}

const getCurationSourceBadge = (source: string) => {
  const sourceConfig = {
    hpscreg: { label: 'HPSCREG', color: 'bg-blue-100 text-blue-800' },
    LLM: { label: 'LLM Generated', color: 'bg-green-100 text-green-800' },
    institution: { label: 'Institution', color: 'bg-purple-100 text-purple-800' },
    manual: { label: 'Manual Entry', color: 'bg-gray-100 text-gray-800' }
  };

  const config = sourceConfig[source as keyof typeof sourceConfig] || sourceConfig.manual;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export function CellLineCard({ cellLine }: { cellLine: CellLineTemplate }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {cellLine.CellLine_hpscreg_id}
        </h3>
        {getCurationSourceBadge(cellLine.curation_source)}
      </div>
      
      {/* ... existing card content */}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Source: {cellLine.CellLine_source_cell_type}</span>
          <span>Tissue: {cellLine.CellLine_source_tissue}</span>
        </div>
      </div>
    </div>
  );
}
```

### 2. UI/UX Polish & Testing

#### 2.1 Enhanced Loading States
**File**: `api/front-end/my-app/src/app/tools/curation/components/LoadingStates.tsx`

Create comprehensive loading components:
```typescript
import { ClockIcon } from '@heroicons/react/24/outline';

export function SkeletonTable() {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProcessingIndicator({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center space-x-3">
        <ClockIcon className="h-6 w-6 text-blue-600 animate-spin" />
        <span className="text-gray-600 font-medium">{message}</span>
      </div>
    </div>
  );
}

export function EmptyState({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action?: React.ReactNode; 
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

#### 2.2 Performance Optimizations
**File**: `api/front-end/my-app/src/app/tools/curation/hooks/useOptimizedPolling.ts`

Create optimized polling hook with performance improvements:
```typescript
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface UseOptimizedPollingOptions {
  pollInterval: number;
  maxRetries: number;
  retryDelay: number;
  enabled: boolean;
}

export function useOptimizedPolling<T>(
  fetchFunction: () => Promise<T>,
  options: UseOptimizedPollingOptions
) {
  const { pollInterval, maxRetries, retryDelay, enabled } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchTimeRef = useRef<number>(0);

  const fetchData = useCallback(async (isRetry = false) => {
    if (loading) return; // Prevent concurrent requests
    
    try {
      setLoading(true);
      setError(null);
      
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      lastFetchTimeRef.current = Date.now();
      
      const result = await fetchFunction();
      setData(result);
      setRetryCount(0); // Reset retry count on success
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Implement retry logic
      if (isRetry && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchData(true), retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, loading, retryCount, maxRetries, retryDelay]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    fetchData();
    intervalRef.current = setInterval(fetchData, pollInterval);
  }, [fetchData, pollInterval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Memoized refresh function
  const refresh = useMemo(() => () => fetchData(), [fetchData]);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [enabled, startPolling, stopPolling]);

  return {
    data,
    loading,
    error,
    retryCount,
    refresh,
    startPolling,
    stopPolling,
    lastFetchTime: lastFetchTimeRef.current
  };
}
```

#### 2.3 Accessibility Enhancements
**File**: `api/front-end/my-app/src/app/tools/curation/components/AccessibilityEnhancements.tsx`

Create accessibility-focused components:
```typescript
import { useEffect, useRef } from 'react';

// Screen reader announcements
export function useScreenReaderAnnouncement() {
  const announcementRef = useRef<HTMLDivElement>(null);
  
  const announce = (message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
      announcementRef.current.setAttribute('aria-live', 'polite');
    }
  };
  
  return { announce, announcementRef };
}

// Focus management
export function useFocusManagement() {
  const focusRef = useRef<HTMLDivElement>(null);
  
  const focusFirstInteractive = () => {
    if (focusRef.current) {
      const firstInteractive = focusRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstInteractive) {
        firstInteractive.focus();
      }
    }
  };
  
  return { focusRef, focusFirstInteractive };
}

// Keyboard navigation
export function useKeyboardNavigation() {
  const handleKeyDown = (event: KeyboardEvent, onEnter?: () => void, onEscape?: () => void) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        onEnter?.();
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
    }
  };
  
  return { handleKeyDown };
}

// Skip link for keyboard users
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
    >
      Skip to main content
    </a>
  );
}

// Loading announcement
export function LoadingAnnouncement({ isLoading, message }: { isLoading: boolean; message: string }) {
  const { announce } = useScreenReaderAnnouncement();
  
  useEffect(() => {
    if (isLoading) {
      announce(message);
    }
  }, [isLoading, message, announce]);
  
  return null;
}
```

### 3. Comprehensive Testing

#### 3.1 End-to-End Testing
**File**: `api/front-end/my-app/src/app/tools/curation/__tests__/e2e.test.tsx`

Create comprehensive end-to-end tests:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurationPage } from '../page';

// Mock the API calls
global.fetch = jest.fn();

describe('CurationApp End-to-End', () => {
  const user = userEvent.setup();
  
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('complete curation workflow', async () => {
    const mockArticles = [
      { id: 1, filename: 'test1.pdf', curation_status: 'pending' },
      { id: 2, filename: 'test2.pdf', curation_status: 'pending' }
    ];

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ articles: mockArticles })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'queued', task_id: 'test-task-id' })
      })
      .mockResolvedValue({
        ok: true,
        json: async () => ({ 
          articles: mockArticles.map(a => ({ ...a, curation_status: 'processing' })),
          total_count: 2,
          processing_count: 2,
          completed_count: 0,
          failed_count: 0
        })
      });

    render(<CurationPage />);
    
    // Wait for articles to load
    await waitFor(() => {
      expect(screen.getByText('test1.pdf')).toBeInTheDocument();
    });

    // Select articles
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // Select first article
    await user.click(checkboxes[2]); // Select second article

    // Start curation
    const startButton = screen.getByText('Start Curation');
    await user.click(startButton);

    // Confirm curation
    const confirmButton = screen.getByText('Confirm');
    await user.click(confirmButton);

    // Verify polling starts
    await waitFor(() => {
      expect(screen.getByText('Live status updates active')).toBeInTheDocument();
    });

    // Verify status updates
    await waitFor(() => {
      expect(screen.getByText('Processing')).toBeInTheDocument();
    });
  });

  test('error handling workflow', async () => {
    const mockArticles = [
      { id: 1, filename: 'test1.pdf', curation_status: 'failed' }
    ];

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ articles: mockArticles })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          article_id: 1,
          error_message: 'OpenAI API key is invalid',
          curation_status: 'failed',
          failed_at: '2025-01-01T00:00:00Z'
        })
      });

    render(<CurationPage />);
    
    await waitFor(() => {
      expect(screen.getByText('test1.pdf')).toBeInTheDocument();
    });

    // Click on failed status
    const failedStatus = screen.getByText('Failed');
    await user.click(failedStatus);

    // Verify error modal opens
    await waitFor(() => {
      expect(screen.getByText('Curation Error Details')).toBeInTheDocument();
      expect(screen.getByText('OpenAI API key is invalid')).toBeInTheDocument();
    });
  });
});
```

#### 3.2 Performance Testing
**File**: `api/front-end/my-app/src/app/tools/curation/__tests__/performance.test.tsx`

Create performance-focused tests:
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { CurationPage } from '../page';

describe('Performance Tests', () => {
  test('handles large article lists efficiently', async () => {
    const largeArticleList = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      filename: `article${i + 1}.pdf`,
      curation_status: 'pending' as const
    }));

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ articles: largeArticleList })
    });

    const startTime = performance.now();
    
    render(<CurationPage />);
    
    await waitFor(() => {
      expect(screen.getByText('article1.pdf')).toBeInTheDocument();
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 1 second
    expect(renderTime).toBeLessThan(1000);
  });

  test('polling performance remains stable', async () => {
    // Test implementation for polling performance
  });
});
```

### 4. Production Readiness

#### 4.1 Environment Configuration
**File**: `api/front-end/my-app/src/lib/config.ts`

Create comprehensive environment configuration:
```typescript
interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  polling: {
    interval: number;
    maxRetries: number;
    retryDelay: number;
  };
  features: {
    maxConcurrentCuration: number;
    enableRealTimeUpdates: boolean;
    enableErrorReporting: boolean;
  };
}

export const config: AppConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    retries: parseInt(process.env.NEXT_PUBLIC_API_RETRIES || '3')
  },
  polling: {
    interval: parseInt(process.env.NEXT_PUBLIC_POLLING_INTERVAL || '3000'),
    maxRetries: parseInt(process.env.NEXT_PUBLIC_POLLING_MAX_RETRIES || '5'),
    retryDelay: parseInt(process.env.NEXT_PUBLIC_POLLING_RETRY_DELAY || '1000')
  },
  features: {
    maxConcurrentCuration: parseInt(process.env.NEXT_PUBLIC_MAX_CURATION || '20'),
    enableRealTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME !== 'false',
    enableErrorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING !== 'false'
  }
};

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
```

#### 4.2 Error Reporting
**File**: `api/front-end/my-app/src/lib/errorReporting.ts`

Create error reporting system:
```typescript
interface ErrorReport {
  message: string;
  stack?: string;
  component?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

class ErrorReporter {
  private isEnabled: boolean;
  private endpoint: string;

  constructor() {
    this.isEnabled = process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true';
    this.endpoint = process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT || '/api/errors';
  }

  report(error: Error, component?: string) {
    if (!this.isEnabled) return;

    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      component,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Send error report
    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport)
    }).catch(() => {
      // Silently fail if error reporting fails
    });
  }

  capturePromiseRejection(reason: any, promise: Promise<any>) {
    if (reason instanceof Error) {
      this.report(reason, 'Promise Rejection');
    }
  }
}

export const errorReporter = new ErrorReporter();

// Global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorReporter.report(event.error, 'Global Error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorReporter.capturePromiseRejection(event.reason, event.promise);
  });
}
```

## Integration Points

### Dependencies Met from Previous Sprints
- ✅ **Backend APIs**: All endpoints tested and production-ready
- ✅ **Frontend Interface**: Complete curation page with real-time updates
- ✅ **Real-time System**: Optimized polling with status dashboard
- ✅ **Error Handling**: Comprehensive error modal with categorization
- ✅ **Production Config**: Environment-aware API configuration

### Sprint 4 Enables
- **Production Deployment**: Complete production-ready CurationApp
- **User Experience**: Polished interface for Dr. Suzy Butcher
- **Integration**: Seamless cell line browser integration

## Deliverables Checklist

### 1. Cell Line Browser Integration
- [ ] Add curation_source filter to existing cell line browser
- [ ] Update cell line API endpoint to support curation_source filtering
- [ ] Display curation source badges on cell line cards
- [ ] Test filtering functionality with different curation sources

### 2. UI/UX Polish
- [ ] Enhanced loading states and skeleton components
- [ ] Performance optimizations for large datasets
- [ ] Accessibility enhancements (ARIA labels, keyboard navigation)
- [ ] Responsive design improvements

### 3. Testing & Quality Assurance
- [ ] End-to-end testing of complete curation workflow
- [ ] Performance testing for large article lists
- [ ] Accessibility testing compliance
- [ ] Cross-browser compatibility testing

### 4. Production Readiness
- [ ] Environment configuration for development and production
- [ ] Error reporting system implementation
- [ ] Performance monitoring setup
- [ ] Documentation for deployment and maintenance

## Success Criteria
- [ ] Cell line browser includes curation source filtering
- [ ] All UI components are polished and production-ready
- [ ] Performance remains optimal with large datasets
- [ ] Accessibility compliance meets WCAG 2.1 AA standards
- [ ] Complete end-to-end testing coverage
- [ ] Production deployment configuration ready
- [ ] CurationApp is ready for Dr. Suzy Butcher's use

## Notes for Implementation
- Focus on production readiness and user experience
- Ensure all components are accessible and performant
- Test with realistic data volumes
- Document any configuration requirements
- Consider future scalability and maintenance

## Performance Considerations
- Implement virtual scrolling for large article lists
- Optimize bundle size and loading performance
- Use proper caching strategies
- Monitor real-time update performance
- Implement proper error boundaries

## Completion Report Requirements
After completing this sprint, provide a comprehensive report including:
1. Summary of cell line browser integration
2. UI/UX polish and accessibility improvements
3. Performance optimizations and testing results
4. Production readiness assessment
5. Deployment configuration and documentation
6. Any issues encountered and resolutions
7. Final handoff notes for production deployment

**File**: `documents/features/CurationApp/SPRINT-4-Completion-Report.md` 