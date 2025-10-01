# SPRINT-3: Core Integration - Processing & Status Management

## Sprint Overview
**Sprint**: 3 (Core Integration)
**Duration**: 9-11 hours
**Dependencies**: ✅ Sprint 1 (Backend Foundation) & Sprint 2 (Frontend Foundation) - COMPLETED
**Priority**: High - Core processing workflow and real-time status management

## Objective
Implement complete bulk processing workflow with real-time status updates and comprehensive error handling. This sprint connects the completed frontend and backend infrastructure to create a seamless AI-assisted curation experience for Dr. Suzy Butcher.

## Context
Sprints 1 and 2 have successfully established:
- ✅ **Backend Infrastructure**: Complete API endpoints, Celery tasks, and data models
- ✅ **Frontend Interface**: Curation page with multi-select and action controls
- ✅ **API Integration**: Verified communication between frontend and backend
- ✅ **Testing Foundation**: Component tests and integration testing infrastructure

Sprint 3 focuses on real-time processing workflow and enhanced user experience.

## Sprint Requirements

### 1. Real-time Status Updates

#### 1.1 Status Polling Implementation
**File**: `api/front-end/my-app/src/app/tools/curation/hooks/useStatusPolling.ts`

Create custom hook for real-time status updates:
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

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

interface StatusResponse {
  articles: Article[];
  total_count: number;
  processing_count: number;
  completed_count: number;
  failed_count: number;
}

export function useStatusPolling(
  initialArticles: Article[],
  isPolling: boolean = false,
  pollInterval: number = 3000
) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/curation/status/', {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: StatusResponse = await response.json();
      setArticles(data.articles);
      setStatus(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    // Initial fetch
    fetchStatus();
    
    // Start polling
    pollingRef.current = setInterval(fetchStatus, pollInterval);
  }, [fetchStatus, pollInterval]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPolling) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isPolling, startPolling, stopPolling]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    articles,
    status,
    loading,
    error,
    refresh,
    startPolling,
    stopPolling
  };
}
```

#### 1.2 Enhanced ArticlesTable with Real-time Updates
**File**: `api/front-end/my-app/src/app/tools/curation/components/ArticlesTable.tsx`

Update existing component to support real-time updates:
```typescript
'use client';

import { useState, useCallback, useEffect } from 'react';
import { CheckIcon, XMarkIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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
  onErrorClick?: (articleId: number) => void;
  isPolling?: boolean;
}

export function ArticlesTable({ 
  articles, 
  selectedArticles, 
  onSelectionChange, 
  loading,
  onRefresh,
  onErrorClick,
  isPolling = false
}: ArticlesTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article;
    direction: 'asc' | 'desc';
  }>({
    key: 'modified_on',
    direction: 'desc'
  });

  // Auto-refresh when polling is active
  useEffect(() => {
    if (isPolling && !loading) {
      const interval = setInterval(() => {
        onRefresh();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isPolling, loading, onRefresh]);

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

  const getStatusIndicator = (article: Article) => {
    switch (article.curation_status) {
      case 'processing':
        return (
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 text-blue-500 mr-1 animate-pulse" />
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
            <button
              onClick={() => onErrorClick?.(article.id)}
              className="flex items-center hover:bg-red-50 p-1 rounded transition-colors"
              title="Click to view error details"
            >
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-700 font-medium">Failed</span>
            </button>
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading && articles.length === 0) {
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
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-medium text-gray-900">Articles</h2>
            {isPolling && (
              <div className="flex items-center text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                Live updates
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {selectedArticles.length} of {articles.length} selected
              {selectedArticles.length > 0 && ` (max 20)`}
            </span>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
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
                className={`hover:bg-gray-50 transition-colors ${
                  selectedArticles.includes(article.id) ? 'bg-blue-50' : ''
                } ${
                  article.curation_status === 'processing' ? 'bg-blue-25' : ''
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
                  {getStatusIndicator(article)}
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

### 2. Enhanced Error Display Modal

#### 2.1 ErrorModal Component
**File**: `api/front-end/my-app/src/app/tools/curation/components/ErrorModal.tsx`

Create comprehensive error display modal:
```typescript
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorDetails {
  article_id: number;
  error_message: string;
  curation_status: string;
  failed_at: string;
  filename?: string;
  pubmed_id?: number | null;
}

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorDetails: ErrorDetails | null;
  loading?: boolean;
}

export function ErrorModal({ isOpen, onClose, errorDetails, loading = false }: ErrorModalProps) {
  const categorizeError = (errorMessage: string) => {
    const lowerError = errorMessage.toLowerCase();
    
    if (lowerError.includes('openai') || lowerError.includes('api key') || lowerError.includes('token limit')) {
      return {
        category: 'OpenAI API Error',
        severity: 'high',
        description: 'Issue with OpenAI API integration'
      };
    } else if (lowerError.includes('parsing') || lowerError.includes('json') || lowerError.includes('format')) {
      return {
        category: 'Data Processing Error',
        severity: 'medium',
        description: 'Issue with data parsing or formatting'
      };
    } else if (lowerError.includes('timeout') || lowerError.includes('connection')) {
      return {
        category: 'Network Error',
        severity: 'medium',
        description: 'Network connectivity issue'
      };
    } else {
      return {
        category: 'Application Error',
        severity: 'low',
        description: 'General application error'
      };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading error details...</span>
                  </div>
                ) : errorDetails ? (
                  <div>
                    <div className="flex items-center">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Curation Error Details
                        </Dialog.Title>
                      </div>
                    </div>

                    <div className="mt-6 space-y-6">
                      {/* Article Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Article Information</h4>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <dt className="font-medium text-gray-500">Article ID:</dt>
                            <dd className="text-gray-900">{errorDetails.article_id}</dd>
                          </div>
                          {errorDetails.filename && (
                            <div>
                              <dt className="font-medium text-gray-500">Filename:</dt>
                              <dd className="text-gray-900">{errorDetails.filename}</dd>
                            </div>
                          )}
                          {errorDetails.pubmed_id && (
                            <div>
                              <dt className="font-medium text-gray-500">PubMed ID:</dt>
                              <dd className="text-gray-900">{errorDetails.pubmed_id}</dd>
                            </div>
                          )}
                          <div>
                            <dt className="font-medium text-gray-500">Failed At:</dt>
                            <dd className="text-gray-900">{formatDate(errorDetails.failed_at)}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Error Categorization */}
                      {(() => {
                        const errorInfo = categorizeError(errorDetails.error_message);
                        return (
                          <div className={`rounded-lg p-4 border ${getSeverityColor(errorInfo.severity)}`}>
                            <h4 className="text-sm font-medium mb-2">Error Category</h4>
                            <p className="text-sm font-medium">{errorInfo.category}</p>
                            <p className="text-sm mt-1">{errorInfo.description}</p>
                          </div>
                        );
                      })()}

                      {/* Error Message */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Error Message</h4>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <pre className="text-sm text-red-800 whitespace-pre-wrap font-mono">
                            {errorDetails.error_message}
                          </pre>
                        </div>
                      </div>

                      {/* Troubleshooting Tips */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Troubleshooting Tips</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Check if the article content is properly formatted</li>
                          <li>• Verify that the transcription process completed successfully</li>
                          <li>• Contact support if the error persists</li>
                          <li>• You can retry curation once the issue is resolved</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No error details available.</p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
```

### 3. Enhanced Curation Page with Real-time Updates

#### 3.1 Updated Curation Page
**File**: `api/front-end/my-app/src/app/tools/curation/page.tsx`

Update existing page to include real-time updates and error handling:
```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '../../components/AppLayout';
import { ArticlesTable } from './components/ArticlesTable';
import { CurationActions } from './components/CurationActions';
import { ErrorModal } from './components/ErrorModal';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useStatusPolling } from './hooks/useStatusPolling';

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

interface ErrorDetails {
  article_id: number;
  error_message: string;
  curation_status: string;
  failed_at: string;
  filename?: string;
  pubmed_id?: number | null;
}

export default function CurationPage() {
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [errorDetailsLoading, setErrorDetailsLoading] = useState(false);

  // Initial articles fetch
  const [initialArticles, setInitialArticles] = useState<Article[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialArticles();
  }, []);

  const fetchInitialArticles = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch('/api/curation/articles/');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setInitialArticles(data.articles);
    } catch (err) {
      setInitialError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setInitialLoading(false);
    }
  };

  // Real-time status polling
  const {
    articles,
    status,
    loading: pollingLoading,
    error: pollingError,
    refresh,
    startPolling,
    stopPolling
  } = useStatusPolling(initialArticles, isPolling);

  // Start polling when curation is initiated
  const handleCurationStart = useCallback(() => {
    setIsPolling(true);
    setSelectedArticles([]);
    // Initial refresh to get updated status
    refresh();
  }, [refresh]);

  // Stop polling when all processing is complete
  useEffect(() => {
    if (status && status.processing_count === 0 && isPolling) {
      // Wait a bit to ensure all updates are processed
      const timeout = setTimeout(() => {
        setIsPolling(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [status, isPolling]);

  // Handle error modal
  const handleErrorClick = useCallback(async (articleId: number) => {
    setErrorDetailsLoading(true);
    setErrorModalOpen(true);
    
    try {
      const response = await fetch(`/api/curation/${articleId}/error_details/`);
      if (!response.ok) throw new Error('Failed to fetch error details');
      
      const data = await response.json();
      setErrorDetails(data);
    } catch (err) {
      setErrorDetails({
        article_id: articleId,
        error_message: 'Failed to load error details',
        curation_status: 'failed',
        failed_at: new Date().toISOString()
      });
    } finally {
      setErrorDetailsLoading(false);
    }
  }, []);

  const handleErrorModalClose = useCallback(() => {
    setErrorModalOpen(false);
    setErrorDetails(null);
  }, []);

  // Combine loading states
  const isLoading = initialLoading || (isPolling && pollingLoading);
  const error = initialError || pollingError;

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
            {isPolling && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
                Live status updates active
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchInitialArticles}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          )}

          {status && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{status.total_count}</div>
                <div className="text-sm text-gray-500">Total Articles</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{status.processing_count}</div>
                <div className="text-sm text-gray-500">Processing</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{status.completed_count}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-red-600">{status.failed_count}</div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
            </div>
          )}

          <ArticlesTable
            articles={articles}
            selectedArticles={selectedArticles}
            onSelectionChange={setSelectedArticles}
            loading={isLoading}
            onRefresh={refresh}
            onErrorClick={handleErrorClick}
            isPolling={isPolling}
          />

          <CurationActions
            selectedArticles={selectedArticles}
            onCurationStart={handleCurationStart}
            isProcessing={isPolling}
          />

          <ErrorModal
            isOpen={errorModalOpen}
            onClose={handleErrorModalClose}
            errorDetails={errorDetails}
            loading={errorDetailsLoading}
          />
        </div>
      </ErrorBoundary>
    </AppLayout>
  );
}
```

## Testing Requirements

### 3.1 Real-time Updates Testing
**File**: `api/front-end/my-app/src/app/tools/curation/__tests__/realTimeUpdates.test.tsx`

Create comprehensive real-time testing:
```typescript
import { render, screen, waitFor, act } from '@testing-library/react';
import { CurationPage } from '../page';

// Mock the API calls
global.fetch = jest.fn();

describe('Real-time Updates', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('starts polling when curation is initiated', async () => {
    const mockArticles = [
      { id: 1, filename: 'test1.pdf', curation_status: 'pending' },
      { id: 2, filename: 'test2.pdf', curation_status: 'processing' }
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
          articles: mockArticles,
          total_count: 2,
          processing_count: 1,
          completed_count: 0,
          failed_count: 0
        })
      });

    render(<CurationPage />);
    
    await waitFor(() => {
      expect(screen.getByText('test1.pdf')).toBeInTheDocument();
    });

    // Start curation
    const checkbox = screen.getAllByRole('checkbox')[1];
    checkbox.click();
    
    const startButton = screen.getByText('Start Curation');
    startButton.click();
    
    const confirmButton = screen.getByText('Confirm');
    confirmButton.click();

    // Verify polling starts
    await waitFor(() => {
      expect(screen.getByText('Live status updates active')).toBeInTheDocument();
    });

    // Advance timers to trigger polling
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/curation/status/', expect.any(Object));
    });
  });

  test('stops polling when all processing is complete', async () => {
    // Test implementation for polling stop logic
  });
});
```

### 3.2 Error Modal Testing
**File**: `api/front-end/my-app/src/app/tools/curation/__tests__/errorModal.test.tsx`

Test error display functionality:
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorModal } from '../components/ErrorModal';

describe('ErrorModal', () => {
  const mockErrorDetails = {
    article_id: 1,
    error_message: 'OpenAI API key is invalid',
    curation_status: 'failed',
    failed_at: '2025-01-01T00:00:00Z',
    filename: 'test.pdf',
    pubmed_id: 12345
  };

  test('displays error details correctly', () => {
    render(
      <ErrorModal
        isOpen={true}
        onClose={jest.fn()}
        errorDetails={mockErrorDetails}
      />
    );

    expect(screen.getByText('Curation Error Details')).toBeInTheDocument();
    expect(screen.getByText('Article ID:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('OpenAI API key is invalid')).toBeInTheDocument();
  });

  test('categorizes errors correctly', () => {
    render(
      <ErrorModal
        isOpen={true}
        onClose={jest.fn()}
        errorDetails={mockErrorDetails}
      />
    );

    expect(screen.getByText('Error Category')).toBeInTheDocument();
    expect(screen.getByText('OpenAI API Error')).toBeInTheDocument();
  });
});
```

## Integration Points

### Dependencies Met from Previous Sprints
- ✅ **Backend APIs**: All endpoints tested and ready for real-time integration
- ✅ **Frontend Interface**: Complete curation page with multi-select
- ✅ **Data Models**: Enhanced with curation fields and status tracking
- ✅ **Mock Data**: 13 articles available for testing real-time updates

### Sprint 3 Enables
- **Sprint 4**: UI/UX polish and cell line browser integration
- **Production Readiness**: Complete workflow for Dr. Suzy Butcher

## Deliverables Checklist

### 1. Real-time Status Updates
- [ ] useStatusPolling hook with 3-second polling
- [ ] Enhanced ArticlesTable with live updates
- [ ] Status indicators with animations
- [ ] Automatic polling start/stop logic
- [ ] Performance optimization for polling

### 2. Error Display Modal
- [ ] ErrorModal component with detailed error information
- [ ] Error categorization (OpenAI API, Data Processing, Network, Application)
- [ ] Troubleshooting tips and guidance
- [ ] Accessibility compliance
- [ ] Loading states for error details

### 3. Enhanced User Experience
- [ ] Status dashboard with counts
- [ ] Live update indicators
- [ ] Smooth status transitions
- [ ] Error click handling
- [ ] Performance optimizations

### 4. Testing & Integration
- [ ] Real-time updates testing
- [ ] Error modal testing
- [ ] Integration testing with backend APIs
- [ ] Performance testing for polling
- [ ] Accessibility testing

## Success Criteria
- [ ] Real-time status updates work with 3-second polling
- [ ] Error modal displays comprehensive error information
- [ ] Status transitions are smooth and responsive
- [ ] Polling automatically starts/stops based on processing state
- [ ] Error categorization provides useful troubleshooting guidance
- [ ] Performance remains optimal during real-time updates
- [ ] Ready for Sprint 4 final polish

## Notes for Implementation
- Use AbortController for proper request cancellation
- Implement exponential backoff for failed polling requests
- Consider WebSocket alternative for better real-time performance
- Optimize re-renders with React.memo and useCallback
- Ensure proper cleanup of intervals and timeouts
- Test with various network conditions and error scenarios

## Performance Considerations
- Debounce status updates to prevent excessive re-renders
- Use React.memo for expensive components
- Implement proper loading states to prevent UI blocking
- Consider virtual scrolling for large article lists
- Optimize API calls with proper caching headers

## Completion Report Requirements
After completing this sprint, provide a comprehensive report including:
1. Summary of real-time updates implementation
2. Error handling and modal functionality
3. Performance metrics and optimizations
4. Testing results and coverage
5. User experience improvements
6. Any issues encountered and resolutions
7. Preparation notes for Sprint 4

**File**: `documents/features/CurationApp/SPRINT-3-Completion-Report.md` 