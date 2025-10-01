'use client';

import React from 'react';

import { VersionControlLayout } from './VersionControlLayout';
import CustomCellLineEditor from './CustomCellLineEditor';

function EditorContent() {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Content Area */}
          {/* Version Control Interface */}
          <div className="p-6 border-b border-gray-200">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Version Control Interface
              </h2>
              <p className="text-sm text-gray-600">
                Compare cell line versions side-by-side
              </p>
            </div>
            <VersionControlLayout />
          </div>

          {/* Main Content - Cell Line Editor */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Edit Cell Lines
              </h2>
              <p className="text-sm text-gray-600">
                Select and edit cell line metadata
              </p>
            </div>
            <CustomCellLineEditor />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditorContainer({ initialCellLineId }: { initialCellLineId?: string }) {
  return <EditorContent />;
} 