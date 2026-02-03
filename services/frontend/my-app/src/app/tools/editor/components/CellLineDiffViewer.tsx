'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Box, Typography, Collapse, IconButton, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSynchronizedScrolling } from '../hooks/useSynchronizedScrolling';

interface CellLineDiffViewerProps {
  originalValue: string;
  modifiedValue: string;
  originalTitle?: string;
  modifiedTitle?: string;
  showDifferencesOnly?: boolean;
}

interface SectionDiff {
  sectionName: string;
  hasChanges: boolean;
  originalData: any;
  modifiedData: any;
}

// Convert snake_case to Title Case for display
const formatSectionName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Convert snake_case to Title Case for field names
const formatFieldName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface FieldViewerProps {
  fieldName: string;
  value: any;
  onFieldClick: (fieldName: string, value: any, event: React.MouseEvent) => void;
}

const FieldViewer = ({ fieldName, value, onFieldClick }: FieldViewerProps) => {
  const theme = useTheme();
  const displayValue = value === null || value === undefined ? '' : String(value);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, py: 0.25 }}>
      <Typography
        variant="caption"
        sx={{
          minWidth: 140,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          fontSize: '0.75rem',
        }}
      >
        {formatFieldName(fieldName)}
      </Typography>
      <Typography
        variant="caption"
        onClick={(e) => onFieldClick(fieldName, displayValue, e)}
        sx={{
          flex: 1,
          color: theme.palette.text.primary,
          fontSize: '0.75rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};

interface InstanceViewerProps {
  instance: Record<string, any>;
  instanceIndex: number;
  onFieldClick: (fieldName: string, value: any, event: React.MouseEvent) => void;
}

const InstanceViewer = ({ instance, instanceIndex, onFieldClick }: InstanceViewerProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1,
        mb: 0.5,
        backgroundColor: theme.palette.grey[50],
        borderRadius: 1,
        border: `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
        Instance {instanceIndex + 1}
      </Typography>
      {Object.entries(instance).map(([fieldName, value]) => (
        <FieldViewer key={fieldName} fieldName={fieldName} value={value} onFieldClick={onFieldClick} />
      ))}
    </Box>
  );
};

interface SectionViewerProps {
  sectionName: string;
  instances: any[];
  hasChanges: boolean;
  expanded: boolean;
  onToggle: () => void;
  onFieldClick: (fieldName: string, value: any, event: React.MouseEvent) => void;
}

const SectionViewer = ({ sectionName, instances, hasChanges, expanded, onToggle, onFieldClick }: SectionViewerProps) => {
  const theme = useTheme();
  const hasData = instances && instances.length > 0;

  return (
    <Box sx={{ mb: 1 }}>
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0.75,
          px: 1,
          backgroundColor: hasChanges ? '#fef9e7' : theme.palette.grey[100],
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: hasChanges ? '#fdf3d0' : theme.palette.grey[200],
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {formatSectionName(sectionName)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            ({instances?.length || 0})
          </Typography>
        </Box>
        <IconButton size="small" sx={{ p: 0.25 }}>
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ pt: 0.5 }}>
          {hasData ? (
            instances.map((instance, index) => (
              <InstanceViewer key={index} instance={instance} instanceIndex={index} onFieldClick={onFieldClick} />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, fontStyle: 'italic', fontSize: '0.75rem' }}>
              No data available
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export function CellLineDiffViewer({
  originalValue,
  modifiedValue,
  originalTitle = 'Previous Version',
  modifiedTitle = 'Current Version',
  showDifferencesOnly = false,
}: CellLineDiffViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [popoverAnchor, setPopoverAnchor] = useState<{ top: number; left: number } | null>(null);
  const [popoverFieldName, setPopoverFieldName] = useState('');
  const [popoverFieldValue, setPopoverFieldValue] = useState('');

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Enable synchronized scrolling
  useSynchronizedScrolling(leftPanelRef, rightPanelRef, true);

  const sectionDiffs = useMemo(() => {
    try {
      const original = JSON.parse(originalValue);
      const modified = JSON.parse(modifiedValue);

      // Deep equality check
      const deepEqual = (obj1: any, obj2: any): boolean => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      };

      // Define the order based on CellLineCurationForm
      const fieldOrder = [
        'cell_line',
        'external_cell_line_source',
        'contact',
        'institute',
        'group',
        'ethics',
        'registration_requirements',
        'x_ref',
        'publication',
        'donor_source',
        'disease',
        'medium_component_items',
        'culture_medium',
        'microbiology_virology_screening',
        'genomic_alteration',
        'characterisation_protocol_result',
        'undifferentiated_characterisation',
        'hpsc_scorecard',
        'un_diff_characterisation_expression_marker_method',
        'characterisation_method',
        'genomic_characterisation',
        'additional_genomic_characterisation',
        'hla_result',
        'str_or_fingerprinting',
        'loci',
        'vector_free_reprogram',
        'integrated_vector',
        'non_integrated_vector',
        'cell_line_derivation_induced_pluripotent',
        'cell_line_derivation_embryonic',
        'synonym',
        'idp_gene',
        'vector_free_reprogramming_genes',
        'small_molecule',
        'ontology',
        'synonyms'
      ];

      // Get all unique keys from both objects
      const allKeys = new Set([
        ...Object.keys(original || {}),
        ...Object.keys(modified || {})
      ]);

      const diffs: SectionDiff[] = [];
      allKeys.forEach(key => {
        const originalData = original?.[key];
        const modifiedData = modified?.[key];
        const hasChanges = !deepEqual(originalData, modifiedData);

        diffs.push({
          sectionName: key,
          hasChanges,
          originalData,
          modifiedData
        });
      });

      // Sort by CellLineCurationForm field order
      return diffs.sort((a, b) => {
        const indexA = fieldOrder.indexOf(a.sectionName);
        const indexB = fieldOrder.indexOf(b.sectionName);

        // If both are in the fieldOrder, sort by that order
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        // If only one is in fieldOrder, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        // If neither is in fieldOrder, sort alphabetically
        return a.sectionName.localeCompare(b.sectionName);
      });
    } catch (error) {
      console.error('Error parsing JSON for diff:', error);
      return [];
    }
  }, [originalValue, modifiedValue]);

  // Initialize expanded state - auto-expand changed sections
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    sectionDiffs.forEach(diff => {
      initialExpanded[diff.sectionName] = diff.hasChanges;
    });
    setExpandedSections(initialExpanded);
  }, [sectionDiffs]);

  const filteredDiffs = showDifferencesOnly
    ? sectionDiffs.filter(diff => diff.hasChanges)
    : sectionDiffs;

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const handleFieldClick = (fieldName: string, value: any, event: React.MouseEvent) => {
    setPopoverFieldName(fieldName);
    setPopoverFieldValue(value);
    setPopoverAnchor({
      top: event.clientY,
      left: event.clientX,
    });
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  if (sectionDiffs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          No data to compare
        </Typography>
      </Box>
    );
  }

  // Normalize data to array format for consistent rendering
  const normalizeData = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') return [data];
    return [{ value: data }];
  };

  return (
    <Box>
      {/* Field Value Popover */}
      <Popover
        open={Boolean(popoverAnchor)}
        onClose={handlePopoverClose}
        anchorReference="anchorPosition"
        anchorPosition={popoverAnchor || undefined}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 400 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" gutterBottom display="block">
            {formatFieldName(popoverFieldName)}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {popoverFieldValue}
          </Typography>
        </Box>
      </Popover>

      {/* Side-by-side comparison */}
      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 320px)' }}>
        {/* Left Panel - Original */}
        <Box
          ref={leftPanelRef}
          sx={{
            flex: 1,
            overflow: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.300',
              borderRadius: '4px',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
            {originalTitle}
          </Typography>
          {filteredDiffs.map((diff) => (
            <SectionViewer
              key={`left-${diff.sectionName}`}
              sectionName={diff.sectionName}
              instances={normalizeData(diff.originalData)}
              hasChanges={diff.hasChanges}
              expanded={expandedSections[diff.sectionName] || false}
              onToggle={() => toggleSection(diff.sectionName)}
              onFieldClick={handleFieldClick}
            />
          ))}
        </Box>

        {/* Right Panel - Modified */}
        <Box
          ref={rightPanelRef}
          sx={{
            flex: 1,
            overflow: 'auto',
            pl: 1,
            borderLeft: 1,
            borderColor: 'divider',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.300',
              borderRadius: '4px',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
            {modifiedTitle}
          </Typography>
          {filteredDiffs.map((diff) => (
            <SectionViewer
              key={`right-${diff.sectionName}`}
              sectionName={diff.sectionName}
              instances={normalizeData(diff.modifiedData)}
              hasChanges={diff.hasChanges}
              expanded={expandedSections[diff.sectionName] || false}
              onToggle={() => toggleSection(diff.sectionName)}
              onFieldClick={handleFieldClick}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
