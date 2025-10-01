'use client';

import { useState, useEffect, useCallback } from 'react';
import { CellLineData, CellLineTemplate } from '../types/editor';
import { API_ENDPOINTS } from '../../../../lib/api';

export function useCellLineData() {
  const [cellLines, setCellLines] = useState<CellLineTemplate[]>([]);
  const [selectedCellLine, setSelectedCellLine] = useState<CellLineData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch list of available cell lines
  const fetchCellLines = useCallback(async (curationSource?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let allCellLines: any[] = [];
      let url: string | null = API_ENDPOINTS.EDITOR.CELLLINES;
      
      // Add curation source filter to URL if provided
      if (curationSource) {
        url += `?curation_source=${encodeURIComponent(curationSource)}`;
      }
      
      // Fetch all pages of cell lines
      while (url) {
        const response: Response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch cell lines: ${response.statusText}`);
        }
        
        const data: any = await response.json();
        
        // If it's a paginated response
        if (data.results) {
          allCellLines = [...allCellLines, ...data.results];
          url = data.next; // Get next page URL
        } else {
          // If it's a direct array response
          allCellLines = data;
          url = null;
        }
      }
      
      setCellLines(allCellLines);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cell lines');
      console.error('Error fetching cell lines:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch specific cell line by ID
  const fetchCellLine = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.EDITOR.CELLLINE(id));
      if (!response.ok) {
        throw new Error(`Failed to fetch cell line: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      // Extract the actual cell line data from the response
      const cellLineData = responseData.data || responseData;
      
      // Ensure the id field is set for the frontend to use
      if (cellLineData && !cellLineData.id && cellLineData.CellLine_hpscreg_id) {
        cellLineData.id = cellLineData.CellLine_hpscreg_id;
      }
      
      setSelectedCellLine(cellLineData);
      return cellLineData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cell line');
      console.error('Error fetching cell line:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cell line changes
  const saveCellLine = useCallback(async (id: string, data: Partial<CellLineData>) => {
    setIsLoading(true);
    // Don't set global error state here - let the component handle save errors
    
    try {
      // Clean the data before sending - provide defaults for required fields that are empty
      const cleanedData = { ...data };
      
      // Handle required fields that cannot be blank
      const requiredFields = [
        'CellLine_source_cell_type',
        'CellLine_source_tissue', 
        'CellLine_source'
      ];
      
      requiredFields.forEach(field => {
        if (cleanedData[field] === '' || cleanedData[field] === null || cleanedData[field] === undefined) {
          cleanedData[field] = 'Unknown'; // Provide a default value
        }
      });
      
      const response = await fetch(API_ENDPOINTS.EDITOR.CELLLINE(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save cell line: ${response.statusText} - ${errorText}`);
      }
      
      const responseData = await response.json();
      // Extract the actual cell line data from the enhanced save response
      const cellLineData = responseData.data || responseData;
      
      // Ensure the id field is set for the frontend to use
      if (cellLineData && !cellLineData.id && cellLineData.CellLine_hpscreg_id) {
        cellLineData.id = cellLineData.CellLine_hpscreg_id;
      }
      
      setSelectedCellLine(cellLineData);
      
      // Return the full response data so components can access version_info, performance, etc.
      return responseData;
    } catch (err) {
      // Don't set error state for save failures - let component handle them
      console.error('Error saving cell line:', err);
      throw err; // Re-throw so component can catch and handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get new template
  const getNewTemplate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.EDITOR.NEW_TEMPLATE);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      // Extract the template data from the response
      const templateData = responseData.template || responseData;
      setSelectedCellLine(templateData);
      return templateData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch template');
      console.error('Error fetching template:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCellLines();
  }, [fetchCellLines]);

  return {
    cellLines,
    selectedCellLine,
    isLoading,
    error,
    fetchCellLine,
    saveCellLine,
    getNewTemplate,
    refetch: fetchCellLines,
    setSelectedCellLine, // Export the setter for local updates
  };
} 