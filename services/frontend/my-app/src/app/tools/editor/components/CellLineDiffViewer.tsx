'use client';

import React, { useMemo, useState, useRef } from 'react';
import { Box, Typography, Collapse, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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

const formatName = (name: string): string =>
  name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const displayScalar = (value: any): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'string') return value.trim() || '—';
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value) && value.every(v => typeof v !== 'object' || v === null)) {
    return value.length > 0 ? value.join(', ') : '—';
  }
  return '';
};

const isNestedObject = (val: any): val is Record<string, any> =>
  val !== null && val !== undefined && typeof val === 'object' && !Array.isArray(val);

const isObjectArray = (val: any): boolean =>
  Array.isArray(val) && val.some(v => v !== null && typeof v === 'object');

const FieldRows = ({
  leftObj,
  rightObj,
  indent = 0,
}: {
  leftObj: Record<string, any> | null;
  rightObj: Record<string, any> | null;
  indent?: number;
}) => {
  const theme = useTheme();
  const allKeys = Array.from(new Set([
    ...Object.keys(leftObj || {}),
    ...Object.keys(rightObj || {}),
  ]));

  if (allKeys.length === 0) {
    return (
      <Box sx={{ pl: indent * 2 + 1, py: 0.5 }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.disabled, fontSize: '0.7rem', fontStyle: 'italic' }}>
          No data
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {allKeys.map(key => {
        const leftVal = leftObj?.[key] ?? null;
        const rightVal = rightObj?.[key] ?? null;

        if (isObjectArray(leftVal) || isObjectArray(rightVal)) {
          const leftArr = Array.isArray(leftVal) ? leftVal : [];
          const rightArr = Array.isArray(rightVal) ? rightVal : [];
          const itemCount = Math.max(leftArr.length, rightArr.length);

          return (
            <React.Fragment key={key}>
              <Box sx={{ pl: indent * 2 + 1, pt: 0.75, pb: 0.25 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary, fontSize: '0.7rem' }}>
                  {formatName(key)}
                </Typography>
              </Box>
              {itemCount === 0 ? (
                <Box sx={{ pl: (indent + 1) * 2 + 1, py: 0.25 }}>
                  <Typography variant="caption" sx={{ color: theme.palette.text.disabled, fontSize: '0.7rem', fontStyle: 'italic' }}>
                    No entries
                  </Typography>
                </Box>
              ) : (
                Array.from({ length: itemCount }).map((_, i) => (
                  <React.Fragment key={i}>
                    <Box sx={{ pl: (indent + 1) * 2 + 1, pt: 0.5, pb: 0.25 }}>
                      <Typography variant="caption" sx={{ color: theme.palette.text.disabled, fontSize: '0.65rem', fontStyle: 'italic' }}>
                        Item {i + 1}
                      </Typography>
                    </Box>
                    <FieldRows
                      leftObj={isNestedObject(leftArr[i]) ? leftArr[i] : null}
                      rightObj={isNestedObject(rightArr[i]) ? rightArr[i] : null}
                      indent={indent + 2}
                    />
                  </React.Fragment>
                ))
              )}
            </React.Fragment>
          );
        }

        if (isNestedObject(leftVal) || isNestedObject(rightVal)) {
          return (
            <React.Fragment key={key}>
              <Box sx={{ pl: indent * 2 + 1, pt: 0.75, pb: 0.25 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary, fontSize: '0.7rem' }}>
                  {formatName(key)}
                </Typography>
              </Box>
              <FieldRows
                leftObj={isNestedObject(leftVal) ? leftVal : null}
                rightObj={isNestedObject(rightVal) ? rightVal : null}
                indent={indent + 1}
              />
            </React.Fragment>
          );
        }

        return (
          <Box
            key={key}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              py: 0.3,
              pl: indent * 2 + 1,
              '&:nth-of-type(even)': { backgroundColor: theme.palette.grey[50] },
            }}
          >
            <Typography variant="caption" sx={{ width: '28%', flexShrink: 0, fontWeight: 500, color: theme.palette.text.secondary, fontSize: '0.7rem' }}>
              {formatName(key)}
            </Typography>
            <Typography variant="caption" sx={{ width: '36%', fontSize: '0.7rem', color: theme.palette.text.primary, wordBreak: 'break-word', pr: 1 }}>
              {displayScalar(leftVal)}
            </Typography>
            <Typography variant="caption" sx={{ width: '36%', fontSize: '0.7rem', color: theme.palette.text.primary, wordBreak: 'break-word' }}>
              {displayScalar(rightVal)}
            </Typography>
          </Box>
        );
      })}
    </>
  );
};

const normalizeInstances = (data: any): Array<Record<string, any> | null> => {
  if (data === null || data === undefined) return [null];
  if (Array.isArray(data)) return data.length > 0 ? data : [null];
  if (typeof data === 'object') return [data];
  return [null];
};

interface SectionRowProps {
  diff: SectionDiff;
  expanded: boolean;
  onToggle: () => void;
  originalTitle: string;
  modifiedTitle: string;
  sectionRef: (el: HTMLDivElement | null) => void;
}

const SectionRow = ({ diff, expanded, onToggle, originalTitle, modifiedTitle, sectionRef }: SectionRowProps) => {
  const theme = useTheme();
  const { sectionName, hasChanges, originalData, modifiedData } = diff;

  const leftInstances = normalizeInstances(originalData);
  const rightInstances = normalizeInstances(modifiedData);
  const instanceCount = Math.max(leftInstances.length, rightInstances.length);
  const isList = instanceCount > 1 || (Array.isArray(originalData) || Array.isArray(modifiedData));

  return (
    <Box ref={sectionRef} sx={{ mb: 1 }}>
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0.75,
          px: 1,
          backgroundColor: hasChanges ? '#fef9e7' : theme.palette.grey[100],
          borderRadius: expanded ? '4px 4px 0 0' : 1,
          cursor: 'pointer',
          '&:hover': { backgroundColor: hasChanges ? '#fdf3d0' : theme.palette.grey[200] },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight={600} fontSize="0.8rem" sx={{ color: hasChanges ? '#b7791f' : 'inherit' }}>
            {formatName(sectionName)}
          </Typography>
          {isList && (
            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
              ({instanceCount})
            </Typography>
          )}
        </Box>
        <IconButton size="small" sx={{ p: 0.25 }}>
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ border: `1px solid ${theme.palette.grey[200]}`, borderTop: 0, borderRadius: '0 0 4px 4px', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', px: 1, py: 0.5, backgroundColor: theme.palette.grey[100], borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
            <Typography variant="caption" sx={{ width: '28%', fontWeight: 600, color: theme.palette.text.secondary, fontSize: '0.65rem' }}>
              Field
            </Typography>
            <Typography variant="caption" sx={{ width: '36%', fontWeight: 600, color: theme.palette.text.secondary, fontSize: '0.65rem' }}>
              {originalTitle || 'Left'}
            </Typography>
            <Typography variant="caption" sx={{ width: '36%', fontWeight: 600, color: theme.palette.text.secondary, fontSize: '0.65rem' }}>
              {modifiedTitle || 'Right'}
            </Typography>
          </Box>
          <Box sx={{ px: 1, py: 0.5 }}>
            {Array.from({ length: instanceCount }).map((_, i) => (
              <React.Fragment key={i}>
                {isList && (
                  <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.disabled, fontSize: '0.65rem', fontStyle: 'italic', pt: i > 0 ? 1 : 0, pb: 0.25 }}>
                    Instance {i + 1}
                  </Typography>
                )}
                <FieldRows
                  leftObj={isNestedObject(leftInstances[i]) ? leftInstances[i] : null}
                  rightObj={isNestedObject(rightInstances[i]) ? rightInstances[i] : null}
                  indent={0}
                />
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export function CellLineDiffViewer({
  originalValue,
  modifiedValue,
  originalTitle = 'Left',
  modifiedTitle = 'Right',
  showDifferencesOnly = false,
}: CellLineDiffViewerProps) {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sectionDiffs = useMemo<SectionDiff[]>(() => {
    try {
      const original = JSON.parse(originalValue);
      const modified = JSON.parse(modifiedValue);
      const deepEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
      const allKeys = Array.from(new Set([
        ...Object.keys(original || {}),
        ...Object.keys(modified || {}),
      ]));
      return allKeys.map(key => ({
        sectionName: key,
        hasChanges: !deepEqual(original?.[key], modified?.[key]),
        originalData: original?.[key] ?? null,
        modifiedData: modified?.[key] ?? null,
      }));
    } catch {
      return [];
    }
  }, [originalValue, modifiedValue]);

  const toggle = (name: string) => {
    setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const scrollToSection = (name: string) => {
    const el = sectionRefs.current[name];
    const container = scrollContainerRef.current;
    if (el && container) {
      const elTop = el.getBoundingClientRect().top;
      const containerTop = container.getBoundingClientRect().top;
      container.scrollBy({ top: elTop - containerTop - 8, behavior: 'smooth' });
    }
  };

  const filteredDiffs = showDifferencesOnly
    ? sectionDiffs.filter(d => d.hasChanges)
    : sectionDiffs;

  if (filteredDiffs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          {showDifferencesOnly ? 'No differences found.' : 'No data to compare.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, maxHeight: 'calc(100vh - 320px)' }}>
      {/* Sections list */}
      <Box ref={scrollContainerRef} sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
        {filteredDiffs.map(diff => (
          <SectionRow
            key={diff.sectionName}
            diff={diff}
            expanded={expandedSections[diff.sectionName] || false}
            onToggle={() => toggle(diff.sectionName)}
            originalTitle={originalTitle}
            modifiedTitle={modifiedTitle}
            sectionRef={el => { sectionRefs.current[diff.sectionName] = el; }}
          />
        ))}
      </Box>

      {/* Table of contents */}
      <Box
        sx={{
          width: 180,
          flexShrink: 0,
          overflow: 'auto',
          borderLeft: `1px solid ${theme.palette.grey[200]}`,
          pl: 1.5,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
          Sections
        </Typography>
        {filteredDiffs.map(diff => (
          <Box
            key={diff.sectionName}
            onClick={() => scrollToSection(diff.sectionName)}
            sx={{
              py: 0.4,
              px: 0.75,
              mb: 0.25,
              borderRadius: 0.5,
              cursor: 'pointer',
              backgroundColor: diff.hasChanges ? '#fef9e7' : 'transparent',
              '&:hover': { backgroundColor: diff.hasChanges ? '#fdf3d0' : theme.palette.grey[100] },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.7rem',
                color: diff.hasChanges ? '#b7791f' : theme.palette.text.secondary,
                fontWeight: diff.hasChanges ? 600 : 400,
                lineHeight: 1.4,
                display: 'block',
              }}
            >
              {formatName(diff.sectionName)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
