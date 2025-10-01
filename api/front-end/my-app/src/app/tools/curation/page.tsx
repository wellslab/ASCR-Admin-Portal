'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArticlesTable } from './components/ArticlesTable';
import { ErrorModal } from './components/ErrorModal';
import { ErrorBoundary } from '../editor/components/ErrorBoundary';
import { useStatusPolling } from './hooks/useStatusPolling';
import { API_ENDPOINTS } from '../../../lib/api';
import CustomCellLineEditor from '../editor/components/CustomCellLineEditor';

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

interface CellLine {
  CellLine_hpscreg_id: string;
  CellLine_cell_line_type: string;
  CellLine_source_cell_type: string;
  work_status: string;
  source_article: number;
  created_on: string;
  modified_on: string;
  [key: string]: any;
}

interface CurationResult {
  article_id: number;
  article_pubmed_id: number | null;
  status: 'processing' | 'completed' | 'failed';
  cell_lines: CellLine[];
  total_found?: number;
  error?: string;
}

export default function CurationPage() {
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [errorDetailsLoading, setErrorDetailsLoading] = useState(false);
  
  // New state for three-section workflow
  const [curationResults, setCurationResults] = useState<Map<number, CurationResult>>(new Map());
  const [allCuratedCellLines, setAllCuratedCellLines] = useState<CellLine[]>([]);
  const [selectedCellLineId, setSelectedCellLineId] = useState<string | null>(null);
  const [selectedCellLineData, setSelectedCellLineData] = useState<CellLine | null>(null);
  const [curationInProgress, setCurationInProgress] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [curationError, setCurationError] = useState<string | null>(null);
  
  // Track cell lines that have been reviewed and saved (persist across refreshes)
  const [reviewedCellLineIds, setReviewedCellLineIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('curation-reviewed-cell-lines');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

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
      const response = await fetch(API_ENDPOINTS.CURATION.ARTICLES);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setInitialArticles(data.articles);
    } catch (err) {
      setInitialError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setInitialLoading(false);
    }
  };

  // Real-time status polling with seamless background updates
  const {
    articles,
    status,
    loading: pollingLoading,
    error: pollingError,
    refresh,
    startPolling,
    stopPolling
  } = useStatusPolling(initialArticles, isPolling, 3000);

  // Start polling when curation is initiated
  const handleCurationStart = useCallback(() => {
    setIsPolling(true);
    setCurationInProgress(true);
    setSelectedArticles([]);
    setCurationResults(new Map());
    setAllCuratedCellLines([]);
    setSelectedCellLineId(null);
    setSelectedCellLineData(null);
    
    // Clear reviewed cell lines for new curation session
    setReviewedCellLineIds(new Set());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('curation-reviewed-cell-lines');
    }
    
    // Initial refresh to get updated status
    refresh();
  }, [refresh]);

  // Fetch cell lines for completed articles
  const fetchCellLinesForArticle = useCallback(async (articleId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.CURATION.BASE}/${articleId}/celllines/`);
      if (!response.ok) throw new Error('Failed to fetch cell lines');
      const data = await response.json();
      
      const result: CurationResult = {
        article_id: data.article_id,
        article_pubmed_id: data.article_pubmed_id,
        status: 'completed',
        cell_lines: data.cell_lines,
        total_found: data.count
      };
      
      return result;
    } catch (error) {
      console.error(`Failed to fetch cell lines for article ${articleId}:`, error);
      return {
        article_id: articleId,
        article_pubmed_id: null,
        status: 'failed' as const,
        cell_lines: [],
        error: error instanceof Error ? error.message : 'Failed to fetch cell lines'
      };
    }
  }, []);

  // Update curation results when articles complete (only for new completions)
  useEffect(() => {
    if (articles.length > 0) {
      articles.forEach(async (article) => {
        // Only fetch if article is completed AND we don't already have its results
        if (article.curation_status === 'completed' && !curationResults.has(article.id)) {
          const result = await fetchCellLinesForArticle(article.id);
          setCurationResults(prev => new Map(prev.set(article.id, result)));
        }
      });
    }
  }, [articles, fetchCellLinesForArticle]); // Removed curationResults from dependencies to prevent re-fetching

  // Update flattened cell lines list when curation results change, filtering out reviewed ones
  useEffect(() => {
    const flattenedCellLines: CellLine[] = [];
    curationResults.forEach(result => {
      // Only include cell lines that haven't been reviewed yet
      const unreviewedCellLines = result.cell_lines.filter(
        cellLine => !reviewedCellLineIds.has(cellLine.CellLine_hpscreg_id)
      );
      flattenedCellLines.push(...unreviewedCellLines);
    });
    setAllCuratedCellLines(flattenedCellLines);
    
    // Auto-select first cell line if none is currently selected and we have cell lines
    if (flattenedCellLines.length > 0 && !selectedCellLineId) {
      const firstCellLine = flattenedCellLines[0];
      setSelectedCellLineId(firstCellLine.CellLine_hpscreg_id);
      setSelectedCellLineData(firstCellLine);
    }
    
    // Clear selection if no cell lines are left
    if (flattenedCellLines.length === 0 && selectedCellLineId) {
      setSelectedCellLineId(null);
      setSelectedCellLineData(null);
    }
  }, [curationResults, reviewedCellLineIds, selectedCellLineId]);

  // Stop polling when all processing is complete
  useEffect(() => {
    if (status && status.processing_count === 0 && isPolling) {
      // Wait a bit to ensure all updates are processed
      const timeout = setTimeout(() => {
        setIsPolling(false);
        setCurationInProgress(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [status, isPolling]);

  // Handle error modal
  const handleErrorClick = useCallback(async (articleId: number) => {
    setErrorDetailsLoading(true);
    setErrorModalOpen(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.CURATION.ERROR_DETAILS(articleId));
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

  // Handle retry functionality
  const handleRetryClick = useCallback(async (articleId: number) => {
    try {
      const response = await fetch(API_ENDPOINTS.CURATION.RETRY(articleId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to retry curation');
      }

      // Start polling to track the retried article
      setIsPolling(true);
      
      // Refresh immediately to show processing status
      refresh();
    } catch (err) {
      console.error('Retry failed:', err);
      throw err; // Re-throw so the table component can handle it
    }
  }, [refresh]);

  // Handle cell line selection for editing
  const handleCellLineSelect = useCallback((cellLineId: string) => {
    setSelectedCellLineId(cellLineId);
    const cellLine = allCuratedCellLines.find(cl => cl.CellLine_hpscreg_id === cellLineId);
    setSelectedCellLineData(cellLine || null);
  }, [allCuratedCellLines]);

  // Handle cell line save success - mark as reviewed and auto-select next
  const handleCellLineSave = useCallback((savedData: any) => {
    const cellLineId = savedData.CellLine_hpscreg_id;
    
    // Find the next cell line to select before removing the current one
    const currentIndex = allCuratedCellLines.findIndex(
      cl => cl.CellLine_hpscreg_id === cellLineId
    );
    
    const nextCellLine = allCuratedCellLines[currentIndex + 1] || allCuratedCellLines[currentIndex - 1];
    
    // Mark this cell line as reviewed and persist to localStorage
    setReviewedCellLineIds(prev => {
      const newSet = new Set(prev);
      newSet.add(cellLineId);
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('curation-reviewed-cell-lines', JSON.stringify([...newSet]));
      }
      return newSet;
    });
    
    // Auto-select the next cell line for smooth workflow, or clear if none left
    if (nextCellLine) {
      setSelectedCellLineId(nextCellLine.CellLine_hpscreg_id);
      setSelectedCellLineData(nextCellLine);
    } else {
      setSelectedCellLineId(null);
      setSelectedCellLineData(null);
    }
  }, [allCuratedCellLines]);

  // Handle cell line save error
  const handleCellLineError = useCallback((error: string) => {
    console.error('Cell line save error:', error);
    // The error is already displayed in the editor component
  }, []);

  // Handle curation start button click
  const handleCurationStartClick = useCallback(() => {
    if (selectedArticles.length === 0) {
      setCurationError('Please select at least one article to curate.');
      return;
    }

    if (selectedArticles.length > 20) {
      setCurationError('Maximum 20 articles can be curated at once.');
      return;
    }

    setShowConfirmation(true);
  }, [selectedArticles]);

  // Handle confirmed bulk curation start
  const handleConfirmedCurationStart = useCallback(async () => {
    setShowConfirmation(false);
    setCurationError(null);

    try {
      const response = await fetch(API_ENDPOINTS.CURATION.BULK_CURATE, {
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

      // Start the curation workflow
      handleCurationStart();
    } catch (err) {
      setCurationError(err instanceof Error ? err.message : 'Failed to start curation');
    }
  }, [selectedArticles, handleCurationStart]);

  // Combine loading states
  const isLoading = initialLoading || (isPolling && pollingLoading);
  const error = initialError || pollingError;

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-7xl mx-auto">

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


        {/* Article Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Article Selection</h2>
          
          <ArticlesTable
            articles={articles}
            selectedArticles={selectedArticles}
            onSelectionChange={setSelectedArticles}
            loading={isLoading}
            onStartCuration={handleCurationStartClick}
            onErrorClick={handleErrorClick}
            onRetryClick={handleRetryClick}
            isPolling={isPolling}
          />

          {/* Error Display */}
          {curationError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{curationError}</p>
            </div>
          )}
        </div>

        {/* Curation Results */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Curation Results</h2>
          {curationInProgress || curationResults.size > 0 || articles.some(article => article.curation_status === 'completed') ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Show failed results */}
              {Array.from(curationResults.entries()).map(([articleId, result]) => {
                return result.status === 'failed' ? (
                  <div key={articleId} className="mb-4 last:mb-0">
                    <div className="text-red-600">
                      ✗ Failed to process article {result.article_pubmed_id || articleId}: {result.error}
                    </div>
                  </div>
                ) : null;
              }).filter(Boolean)}
              
              {/* Processing articles */}
              {articles
                .filter(article => 
                  selectedArticles.includes(article.id) && 
                  article.curation_status === 'processing' && 
                  !curationResults.has(article.id)
                )
                .map(article => (
                  <div key={article.id} className="mb-4 text-blue-600">
                    Processing article {article.pubmed_id || article.id}...
                  </div>
                ))
              }
              
              {/* Article cards with cell lines grouped by article */}
              {curationResults.size > 0 && (
                <div>
                  <div className="max-h-96 overflow-y-auto space-y-4">
                    {Array.from(curationResults.entries()).map(([articleId, result]) => {
                      if (result.status !== 'completed') return null;
                      
                      // Filter out reviewed cell lines for this article
                      const unreviewedCellLines = result.cell_lines.filter(
                        cellLine => !reviewedCellLineIds.has(cellLine.CellLine_hpscreg_id)
                      );
                      
                      if (unreviewedCellLines.length === 0) return null;
                      
                      // Find the article to get its filename
                      const article = articles.find(a => a.id === articleId);
                      
                      return (
                        <div key={articleId} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                          {/* Card header */}
                          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h4 className="text-sm text-gray-900 italic">
                              Title: {unreviewedCellLines[0]?.CellLine_publication_title || article?.filename || `Article ${articleId}`}
                            </h4>
                            <span className="text-xs text-gray-500">
                              PubMed: {result.article_pubmed_id || 'N/A'}
                            </span>
                          </div>
                          
                          {/* Cell lines table */}
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {unreviewedCellLines.map((cellLine) => (
                                  <tr 
                                    key={cellLine.CellLine_hpscreg_id}
                                    className={`cursor-pointer hover:bg-gray-50 ${
                                      selectedCellLineId === cellLine.CellLine_hpscreg_id ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => handleCellLineSelect(cellLine.CellLine_hpscreg_id)}
                                  >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {cellLine.CellLine_hpscreg_id}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {cellLine.CellLine_cell_line_type}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {cellLine.CellLine_source_cell_type || 'Unknown'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        cellLine.work_status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                                        cellLine.work_status === 'for review' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {cellLine.work_status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center text-gray-500">
              Results will appear here when curation is started
            </div>
          )}
        </div>

        {/* Cell Line Editor */}
        {selectedCellLineId && selectedCellLineData && (
          <div className="mb-8">
            <CustomCellLineEditor 
              initialCellLineId={selectedCellLineId} 
              hideSelector={true}
              onSave={handleCellLineSave}
              onError={handleCellLineError}
            />
          </div>
        )}

        <ErrorModal
          isOpen={errorModalOpen}
          onClose={handleErrorModalClose}
          errorDetails={errorDetails}
          loading={errorDetailsLoading}
        />

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
                    onClick={handleConfirmedCurationStart}
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
    </ErrorBoundary>
  );
} 