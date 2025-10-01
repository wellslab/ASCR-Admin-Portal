# SPRINT-2: Frontend Foundation - Complete User Interface

## Sprint Overview
**Sprint**: 2 (Frontend Foundation)
**Duration**: 9-12 hours
**Dependencies**: ✅ Sprint 1 (Backend Foundation) - COMPLETED
**Priority**: High - User interface foundation for CurationApp

## Objective
Create complete frontend interface for the CurationApp including curation page, articles table with multi-select functionality, and curation action controls. This sprint establishes the user interface foundation that will connect to the completed backend infrastructure from Sprint 1.

## Context
Sprint 1 successfully established the complete backend infrastructure with:
- ✅ **API Endpoints**: 4/4 implemented and tested
- ✅ **Data Models**: Enhanced with curation fields
- ✅ **Celery Tasks**: Background processing ready
- ✅ **Testing**: 6/6 tests passing

Sprint 2 builds the frontend interface that Dr. Suzy Butcher will use to select and curate articles through the AI-assisted workflow.

## Sprint Requirements

### 1. Curation Page Structure

#### 1.1 Page Creation
**File**: `api/front-end/my-app/src/app/tools/curation/page.tsx`

Create the main curation page with proper layout:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '../../components/AppLayout';
import { ArticlesTable } from './components/ArticlesTable';
import { CurationActions } from './components/CurationActions';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface Article {
  id: number;
  filename: string;
  pubmed_id: number | null;
  created_on: string;
  modified_on: string;
  curation_status: 'pending' | 'processing' | 'completed' | 'failed';
  curation_error: string | null;
  curation_started_at: string | null;
  transcription_status: string;
  is_curated: boolean;
  approximate_tokens: number;
}

export default function CurationPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/curation/articles/');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <ErrorBoundary>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Article Curation</h1>
            <p className="text-gray-600 mt-2">
              Select articles to curate using AI-assisted processing. 
              Maximum 20 articles can be processed at once.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchArticles}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          )}

          <ArticlesTable
            articles={articles}
            selectedArticles={selectedArticles}
            onSelectionChange={setSelectedArticles}
            loading={loading}
            onRefresh={fetchArticles}
          />

          <CurationActions
            selectedArticles={selectedArticles}
            onCurationStart={() => {
              // Refresh articles after curation starts
              fetchArticles();
              setSelectedArticles([]);
            }}
          />
        </div>
      </ErrorBoundary>
    </AppLayout>
  );
}
```

#### 1.2 Navigation Integration
**File**: `api/front-end/my-app/src/app/components/Sidebar.tsx`

Add curation link to existing navigation:
```typescript
// Add to the existing navigation items
{
  name: 'Curation',
  href: '/tools/curation',
  icon: BeakerIcon, // or appropriate icon
  current: pathname === '/tools/curation',
}
```

### 2. Articles Table with Multi-Select

#### 2.1 ArticlesTable Component
**File**: `api/front-end/my-app/src/app/tools/curation/components/ArticlesTable.tsx`

Create comprehensive table component:
```typescript
'use client';

import { useState, useCallback } from 'react';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Article {
  id: number;
  filename: string;
  pubmed_id: number | null;
  created_on: string;
  modified_on: string;
  curation_status: 'pending' | 'processing' | 'completed' | 'failed';
  curation_error: string | null;
  approximate_tokens: number;
}

interface ArticlesTableProps {
  articles: Article[];
  selectedArticles: number[];
  onSelectionChange: (selected: number[]) => void;
  loading: boolean;
  onRefresh: () => void;
}

export function ArticlesTable({ 
  articles, 
  selectedArticles, 
  onSelectionChange, 
  loading,
  onRefresh 
}: ArticlesTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article;
    direction: 'asc' | 'desc';
  }>({
    key: 'modified_on',
    direction: 'desc'
  });

  const handleSelectAll = useCallback(() => {
    if (selectedArticles.length === articles.length) {
      onSelectionChange([]);
    } else {
      const selectableArticles = articles
        .filter(article => article.curation_status !== 'processing')
        .slice(0, 20)
        .map(article => article.id);
      onSelectionChange(selectableArticles);
    }
  }, [articles, selectedArticles, onSelectionChange]);

  const handleArticleSelect = useCallback((articleId: number) => {
    const article = articles.find(a => a.id === articleId);
    if (article?.curation_status === 'processing') return;

    if (selectedArticles.includes(articleId)) {
      onSelectionChange(selectedArticles.filter(id => id !== articleId));
    } else if (selectedArticles.length < 20) {
      onSelectionChange([...selectedArticles, articleId]);
    }
  }, [articles, selectedArticles, onSelectionChange]);

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-blue-700 font-medium">Processing</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center">
            <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-700 font-medium">Completed</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center">
            <XMarkIcon className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-red-700 font-medium">Failed</span>
          </div>
        );
      default:
        return (
          <span className="text-gray-500 font-medium">Pending</span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const sortedArticles = [...articles].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Articles</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {selectedArticles.length} of {articles.length} selected
              {selectedArticles.length > 0 && ` (max 20)`}
            </span>
            <button
              onClick={onRefresh}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedArticles.length === articles.length && articles.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Filename
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PubMed ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tokens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedArticles.map((article) => (
              <tr 
                key={article.id}
                className={`hover:bg-gray-50 ${
                  selectedArticles.includes(article.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.id)}
                    onChange={() => handleArticleSelect(article.id)}
                    disabled={article.curation_status === 'processing'}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {article.filename}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {article.pubmed_id || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {article.approximate_tokens.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(article.created_on)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(article.modified_on)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusIndicator(article.curation_status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {articles.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No articles available for curation.
        </div>
      )}
    </div>
  );
}
```

### 3. Curation Action Interface

#### 3.1 CurationActions Component
**File**: `api/front-end/my-app/src/app/tools/curation/components/CurationActions.tsx`

Create action controls with validation:
```typescript
'use client';

import { useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/outline';

interface CurationActionsProps {
  selectedArticles: number[];
  onCurationStart: () => void;
}

export function CurationActions({ selectedArticles, onCurationStart }: CurationActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartCuration = async () => {
    if (selectedArticles.length === 0) {
      setError('Please select at least one article to curate.');
      return;
    }

    if (selectedArticles.length > 20) {
      setError('Maximum 20 articles can be curated at once.');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmCuration = async () => {
    setIsProcessing(true);
    setError(null);
    setShowConfirmation(false);

    try {
      const response = await fetch('/api/curation/bulk_curate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_ids: selectedArticles
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start curation');
      }

      onCurationStart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start curation');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-6 bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Curation Actions</h3>
          <p className="text-sm text-gray-500 mt-1">
            {selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''} selected
            {selectedArticles.length > 0 && ` (${selectedArticles.length}/20)`}
          </p>
        </div>
        
        <button
          onClick={handleStartCuration}
          disabled={selectedArticles.length === 0 || isProcessing}
          className={`
            inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
            ${selectedArticles.length === 0 || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }
          `}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <PlayIcon className="-ml-1 mr-2 h-4 w-4" />
              Start Curation
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {selectedArticles.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <strong>Note:</strong> Curation processing may take up to 5 minutes per article. 
            You can monitor progress in the articles table above.
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Confirm Curation</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to start curation for {selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''}?
                  This process may take several minutes to complete.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmCuration}
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Testing Requirements

### 3.1 Component Testing
**File**: `api/front-end/my-app/src/app/tools/curation/__tests__/CurationPage.test.tsx`

Create comprehensive component tests:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CurationPage } from '../page';

// Mock the API calls
global.fetch = jest.fn();

describe('CurationPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('renders curation page with loading state', () => {
    render(<CurationPage />);
    expect(screen.getByText('Article Curation')).toBeInTheDocument();
  });

  test('handles article selection correctly', async () => {
    const mockArticles = [
      { id: 1, filename: 'test1.pdf', curation_status: 'pending' },
      { id: 2, filename: 'test2.pdf', curation_status: 'pending' }
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ articles: mockArticles })
    });

    render(<CurationPage />);
    
    await waitFor(() => {
      expect(screen.getByText('test1.pdf')).toBeInTheDocument();
    });
    
    // Test selection logic
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first article
    
    expect(screen.getByText('1 article selected')).toBeInTheDocument();
  });

  test('validates maximum selection limit', async () => {
    // Test with 21 articles to verify 20-item limit
    const mockArticles = Array.from({ length: 21 }, (_, i) => ({
      id: i + 1,
      filename: `test${i + 1}.pdf`,
      curation_status: 'pending'
    }));

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ articles: mockArticles })
    });

    render(<CurationPage />);
    
    // Test selection limit logic
    // Implementation depends on component behavior
  });
});
```

### 3.2 Integration Testing
**File**: `api/front-end/my-app/src/app/tools/curation/__tests__/integration.test.tsx`

Test integration with backend APIs:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CurationPage } from '../page';

describe('CurationPage Integration', () => {
  test('integrates with backend API endpoints', async () => {
    // Mock successful API responses
    const mockArticles = {
      articles: [
        {
          id: 1,
          filename: 'test.pdf',
          pubmed_id: 12345,
          curation_status: 'pending',
          approximate_tokens: 1000,
          created_on: '2025-01-01T00:00:00Z',
          modified_on: '2025-01-01T00:00:00Z'
        }
      ]
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'queued', task_id: 'test-task-id' })
      });

    render(<CurationPage />);
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    // Test curation workflow
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    const startButton = screen.getByText('Start Curation');
    fireEvent.click(startButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/curation/bulk_curate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_ids: [1] })
      });
    });
  });
});
```

## Integration Points

### Dependencies Met from Sprint 1
- ✅ **API Endpoints**: All 4 endpoints available and tested
- ✅ **Data Models**: Article serializer with curation fields
- ✅ **Mock Data**: 5 CellLineTemplate records for testing
- ✅ **Error Handling**: Proper HTTP status codes and error messages

### Sprint 2 Enables
- **Sprint 3**: Real-time status updates and error display
- **Sprint 4**: UI/UX polish and cell line browser integration

## Deliverables Checklist

### 1. Page Structure
- [ ] Curation page created at `/tools/curation/page.tsx`
- [ ] Navigation link added to Sidebar.tsx
- [ ] Responsive layout with AppLayout integration
- [ ] Error boundary and loading states implemented

### 2. Articles Table
- [ ] ArticlesTable component with multi-select functionality
- [ ] Sorting and filtering capabilities
- [ ] Status indicators (pending, processing, completed, failed)
- [ ] 20-item selection limit enforced
- [ ] Bulk selection controls (Select All, Clear Selection)

### 3. Curation Actions
- [ ] CurationActions component with validation
- [ ] Start Curation button with confirmation dialog
- [ ] Progress indicators and loading states
- [ ] Error handling and user feedback

### 4. Testing & Polish
- [ ] Component tests for all major functionality
- [ ] Integration tests with backend APIs
- [ ] Responsive design validation
- [ ] Accessibility compliance (ARIA labels, keyboard navigation)

## Success Criteria
- [ ] Complete curation page accessible at `/tools/curation`
- [ ] Articles table displays all articles with proper status
- [ ] Multi-select functionality works with 20-item limit
- [ ] Bulk curation integrates with backend API
- [ ] Error handling provides clear user feedback
- [ ] Responsive design works on all screen sizes
- [ ] Navigation integration seamless
- [ ] Ready for Sprint 3 real-time updates

## Notes for Implementation
- Use existing component patterns from RecordsTable.tsx
- Follow Tailwind CSS conventions used in the project
- Implement proper TypeScript types for all props
- Use existing icon library (Heroicons)
- Test with mock data from Sprint 1 backend
- Consider accessibility from the start
- Implement proper error boundaries

## Performance Considerations
- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo
- Consider virtual scrolling for large article lists
- Efficient state management for selections

## Completion Report Requirements
After completing this sprint, provide a comprehensive report including:
1. Summary of all components implemented
2. Integration testing results with backend APIs
3. User experience validation
4. Performance metrics and optimizations
5. Accessibility compliance verification
6. Any issues encountered and resolutions
7. Preparation notes for Sprint 3

**File**: `documents/features/CurationApp/SPRINT-2-Completion-Report.md` 