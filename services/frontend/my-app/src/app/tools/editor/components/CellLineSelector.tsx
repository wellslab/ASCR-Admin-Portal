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
  const { groupedCellLines, isLoading } = useCellLineData();
  const { state, actions } = useEditor();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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
                        <button
                          key={v.filename}
                          onClick={() => handleSelectVersion(v.filename)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
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
    </div>
  );
}
