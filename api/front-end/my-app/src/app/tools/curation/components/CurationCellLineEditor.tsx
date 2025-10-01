'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSchemaData } from '../../editor/hooks/useSchemaData';
import { ErrorBoundary } from '../../editor/components/ErrorBoundary';
import { DisplayLine, CellLineData, FieldSchema } from '../../editor/types/editor';
import EditorLine from '../../editor/components/EditorLine';
import { API_ENDPOINTS } from '../../../../lib/api';
import { DuplicateHandlingModal } from './DuplicateHandlingDialog';

interface CurationCellLineEditorProps {
  cellLineId: string;
  cellLineData: any;
  onSave?: (savedData: any) => void;
  onError?: (error: string) => void;
}

// Parse JSON data to display lines (borrowed from CustomCellLineEditor)
function parseDataToLines(data: any, schema: FieldSchema, path: string[] = [], indentLevel: number = 0, globalLineNumber: { current: number } = { current: 1 }): DisplayLine[] {
  const lines: DisplayLine[] = [];

  function addLine(
    type: DisplayLine['type'],
    fieldPath: string[],
    displayText: string,
    value: any,
    isCollapsible: boolean = false,
    isEditable: boolean = false,
    customIndentLevel?: number
  ): DisplayLine {
    const line: DisplayLine = {
      lineNumber: globalLineNumber.current++,
      type,
      fieldPath,
      displayText,
      isCollapsible,
      isCollapsed: true,
      isEditable,
      value,
      indentLevel: customIndentLevel !== undefined ? customIndentLevel : indentLevel,
    };
    lines.push(line);
    return line;
  }

  if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      const currentPath = [...path, key];
      const fieldSchema = schema[key];

      if (Array.isArray(value)) {
        // Array field
        addLine('object', currentPath, `${key}`, value, true, false, indentLevel);
        value.forEach((item, index) => {
          const itemPath = [...currentPath, index.toString()];
          if (typeof item === 'object' && item !== null) {
            lines.push(...parseDataToLines(item, fieldSchema || {}, itemPath, indentLevel + 1, globalLineNumber));
          } else {
            addLine('value', itemPath, `[${index}]: ${item}`, item, false, true, indentLevel + 1);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        // Nested object
        addLine('object', currentPath, `${key}`, value, true, false, indentLevel);
        lines.push(...parseDataToLines(value, fieldSchema || {}, currentPath, indentLevel + 1, globalLineNumber));
      } else {
        // Primitive value
        const isEditable = fieldSchema?.editable !== false;
        addLine('value', currentPath, `${key}: ${value}`, value, false, isEditable, indentLevel);
      }
    });
  }

  return lines;
}

export default function CurationCellLineEditor({ 
  cellLineId, 
  cellLineData, 
  onSave, 
  onError 
}: CurationCellLineEditorProps) {
  const { schema, isLoading: schemaLoading, error: schemaError } = useSchemaData();
  
  const [displayLines, setDisplayLines] = useState<DisplayLine[]>([]);
  const [editingLine, setEditingLine] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [changeHistory, setChangeHistory] = useState<any[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [workingData, setWorkingData] = useState<CellLineData | null>(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateError, setDuplicateError] = useState<{
    existing_id: string;
    current_id: string;
    message: string;
  } | null>(null);
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);

  // Initialize working data when cellLineData changes
  useEffect(() => {
    if (cellLineData) {
      setWorkingData({ ...cellLineData });
    }
  }, [cellLineData]);

  // Generate display lines when data or schema changes
  const parsedLines = useMemo(() => {
    if (!workingData || !schema) return [];
    try {
      return parseDataToLines(workingData, schema);
    } catch (error) {
      console.error('Error parsing data to lines:', error);
      return [];
    }
  }, [workingData, schema]);

  useEffect(() => {
    setDisplayLines(parsedLines);
  }, [parsedLines]);

  // Handle field value changes
  const handleValueChange = (lineNumber: number, newValue: any) => {
    const line = displayLines.find(l => l.lineNumber === lineNumber);
    if (!line || !workingData) return;

    // Save current state to history for undo
    setChangeHistory(prev => [...prev, { ...workingData }]);
    setCanUndo(true);

    // Update the working data
    const newData = { ...workingData };
    let current = newData;
    
    // Navigate to the field and update it
    for (let i = 0; i < line.fieldPath.length - 1; i++) {
      const key = line.fieldPath[i];
      if (current[key] === undefined) {
        current[key] = {};
      }
      current = current[key];
    }
    
    const finalKey = line.fieldPath[line.fieldPath.length - 1];
    current[finalKey] = newValue;
    
    setWorkingData(newData);
    setSaveError(null);
  };

  // Handle save
  const handleSave = async (forceReplace: boolean = false) => {
    if (!workingData) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const saveData = forceReplace 
        ? { ...workingData, force_replace: true }
        : workingData;

      const response = await fetch(API_ENDPOINTS.CURATION.SAVE_CELLLINE(cellLineId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === 'duplicate_id' && !forceReplace) {
          // Show duplicate handling dialog
          setDuplicateError({
            existing_id: result.existing_id,
            current_id: result.current_id,
            message: result.message
          });
          setPendingSaveData(workingData);
          setDuplicateDialogOpen(true);
          return;
        } else {
          throw new Error(result.error || result.message || 'Failed to save cell line');
        }
      }

      // Clear change history on successful save
      setChangeHistory([]);
      setCanUndo(false);
      
      onSave?.(result.cell_line);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save cell line';
      setSaveError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle duplicate replacement
  const handleDuplicateReplace = async () => {
    if (!pendingSaveData) return;
    
    try {
      await handleSave(true);
      setDuplicateDialogOpen(false);
      setDuplicateError(null);
      setPendingSaveData(null);
    } catch (error) {
      console.error('Replace failed:', error);
    }
  };

  // Handle duplicate dialog close
  const handleDuplicateDialogClose = () => {
    setDuplicateDialogOpen(false);
    setDuplicateError(null);
    setPendingSaveData(null);
  };

  // Handle undo
  const handleUndo = () => {
    if (changeHistory.length === 0) return;
    
    const lastState = changeHistory[changeHistory.length - 1];
    setWorkingData(lastState);
    setChangeHistory(prev => prev.slice(0, -1));
    setCanUndo(changeHistory.length > 1);
  };

  // Handle revert to original
  const handleRevert = () => {
    if (cellLineData) {
      setWorkingData({ ...cellLineData });
      setChangeHistory([]);
      setCanUndo(false);
      setSaveError(null);
    }
  };

  const hasChanges = workingData && cellLineData && 
    JSON.stringify(workingData) !== JSON.stringify(cellLineData);

  if (schemaLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading schema...</div>
      </div>
    );
  }

  if (schemaError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading schema: {schemaError}</p>
      </div>
    );
  }

  if (!workingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading cell line data...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {/* Action buttons */}
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                hasChanges && !isSaving
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              onClick={handleUndo}
              disabled={!canUndo || isSaving}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                canUndo && !isSaving
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Undo
            </button>
            
            <button
              onClick={handleRevert}
              disabled={!hasChanges || isSaving}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                hasChanges && !isSaving
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Revert All
            </button>
          </div>

          {hasChanges && (
            <div className="text-sm text-amber-600 font-medium">
              Unsaved changes
            </div>
          )}
        </div>

        {/* Error display */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{saveError}</p>
          </div>
        )}

        {/* Editor lines */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="max-h-[600px] overflow-y-auto p-4">
            {displayLines.map((line) => (
              <EditorLine
                key={line.lineNumber}
                line={line}
                isEditing={editingLine === line.lineNumber}
                onStartEdit={() => setEditingLine(line.lineNumber)}
                onFinishEdit={() => setEditingLine(null)}
                onValueChange={(newValue) => handleValueChange(line.lineNumber, newValue)}
              />
            ))}
          </div>
        </div>
        
        {/* Duplicate handling dialog */}
        <DuplicateHandlingModal
          isOpen={duplicateDialogOpen}
          onClose={handleDuplicateDialogClose}
          duplicateError={duplicateError}
          onReplace={handleDuplicateReplace}
        />
      </div>
    </ErrorBoundary>
  );
}