'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '@/lib/api-config';
import { CellLineData, CellLineTemplate } from '../types/editor';
import { API_ENDPOINTS } from '../../../../lib/api';

export interface CellLineVersion {
  filename: string;
  location: 'working' | 'ready' | 'registered';
  version: number | null;
}

export interface CellLineGroup {
  base_name: string;
  versions: CellLineVersion[];
}

export function useCellLineData() {
  const [cellLines, setCellLines] = useState<CellLineTemplate[]>([]);
  const [groupedCellLines, setGroupedCellLines] = useState<CellLineGroup[]>([]);
  const [selectedCellLine, setSelectedCellLine] = useState<CellLineData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch grouped cell lines from backend
  const fetchCellLines = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8001/cell-lines/grouped');
      if (!response.ok) {
        throw new Error(`Failed to fetch cell lines: ${response.statusText}`);
      }
      const data = await response.json();
      setGroupedCellLines(data.groups || []);

      // Keep flat list for backwards compatibility
      const flat = (data.groups || []).flatMap((g: CellLineGroup) =>
        g.versions.map((v: CellLineVersion) => ({
          CellLine_hpscreg_id: v.filename,
          id: v.filename,
          curation_source: v.location,
        }))
      );
      setCellLines(flat);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cell lines');
      console.error('Error fetching cell lines:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch specific cell line by ID from new archive service
  const fetchCellLine = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8001/cell-line/${encodeURIComponent(id)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cell line: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      const cellLineData = responseData.data || responseData;

      if (cellLineData && !cellLineData.id) {
        cellLineData.id = id;
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

  // Save cell line changes to archive service
  const saveCellLine = useCallback(async (id: string, data: Partial<CellLineData>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8001/working/cell-line/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save cell line: ${response.statusText} - ${errorText}`);
      }
      
      const responseData = await response.json();
      
      // Update selected cell line with saved data
      setSelectedCellLine(data as CellLineData);
      
      return responseData;
    } catch (err) {
      console.error('Error saving cell line:', err);
      throw err; // Re-throw so component can catch and handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new empty template by fetching from backend
  const getNewTemplate = useCallback(async (hpscreg_name?: string) => {
    try {
      const url = getApiUrl(`/get-empty-form${hpscreg_name ? `?hpscreg_name=${encodeURIComponent(hpscreg_name)}` : ''}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch empty form');
      const emptyTemplate = await response.json();
      setSelectedCellLine(emptyTemplate);
      return emptyTemplate;
    } catch (err) {
      console.error('Error fetching empty template:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCellLines();
  }, [fetchCellLines]);

  return {
    cellLines,
    groupedCellLines,
    selectedCellLine,
    isLoading,
    error,
    fetchCellLine,
    saveCellLine,
    getNewTemplate,
    refetch: fetchCellLines,
    setSelectedCellLine,
  };
} 