'use client';

import React, { useState } from 'react';
import { useCellLineData, CellLineGroup, CellLineVersion } from '../hooks/useCellLineData';
import { useEditor } from './EditorContext';

const LOCATION_BADGE: Record<string, string> = {
  working:    'bg-amber-100 text-amber-800',
  ready:      'bg-blue-100 text-blue-800',
  registered: 'bg-green-100 text-green-800',
};

export function CellLineSelector() {
  const { groupedCellLines, isLoading, deleteCellLine } = useCellLineData();
  const { state, actions } = useEditor();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = groupedCellLines.filter(g =>
    g.base_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGroup = (baseName: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(baseName) ? next.delete(baseName) : next.add(baseName);
      return next;
    });
  };

  const handleSelectVersion = async (filename: string) => {
    await actions.selectCellLine(filename);
  };

  const handleDeleteClick = (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();
    setConfirmDelete(filename);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteCellLine(confirmDelete);
      // If the deleted line was selected, the editor will retain the stale view
      // until the user selects another cell line.
    } finally {
      setConfirmDelete(null);
    }
  };

  const selectedFilename = state.cellLineData?.id;

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Select Cell Line</h3>

      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search cell lines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="space-y-0.5 max-h-64 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">No cell lines found</p>
        ) : (
          filtered.map((group: CellLineGroup) => {
            const isExpanded = expandedGroups.has(group.base_name);
            const isGroupSelected = group.versions.some(v => v.filename === selectedFilename);

            return (
              <div key={group.base_name}>
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.base_name)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                    isGroupSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <span className="font-medium">{group.base_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{group.versions.length}</span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Versions */}
                {isExpanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {group.versions.map((v: CellLineVersion) => {
                      const isSelected = v.filename === selectedFilename;
                      return (
                        <div key={v.filename} className="flex items-center gap-1">
                          <button
                            onClick={() => handleSelectVersion(v.filename)}
                            className={`flex-1 text-left px-3 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-blue-100 border border-blue-200 text-blue-900'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <span>{v.version !== null ? `v${v.version}` : v.filename}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${LOCATION_BADGE[v.location] ?? ''}`}>
                              {v.location}
                            </span>
                          </button>
                          {v.location === 'working' && (
                            <button
                              onClick={(e) => handleDeleteClick(e, v.filename)}
                              className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {state.cellLineData && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <span>Selected:</span>
          <span className="font-medium text-gray-800">{state.cellLineData.id}</span>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 max-w-sm w-full mx-4">
            <p className="text-sm font-medium text-gray-900 mb-1">Delete cell line?</p>
            <p className="text-xs text-gray-500 mb-4 break-all">{confirmDelete}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
