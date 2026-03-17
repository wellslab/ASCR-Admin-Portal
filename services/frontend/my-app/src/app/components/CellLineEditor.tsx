'use client';

import { Box, Typography, TextField, IconButton, Collapse, Button, ButtonGroup, Switch, FormControlLabel, Popover, Select, MenuItem, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTheme } from '@mui/material/styles';
import { getApiUrl } from '@/lib/api-config';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState, useRef, useEffect, useMemo } from 'react';

// Convert snake_case to Title Case for display
const formatFieldName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Convert snake_case key to Section Title (e.g., cell_line -> Cell Line)
const formatSectionName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const isObjectArray = (val: any): val is Record<string, any>[] =>
  Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0] !== null;

const isPlainObject = (val: any): val is Record<string, any> =>
  val !== null && typeof val === 'object' && !Array.isArray(val);

// Recursively set a value at an arbitrary dot-path within a nested object/array structure.
// Number-like parts are treated as array indices; strings are object keys.
// Preserves array types: if the current value is a primitive array, parses rawValue as CSV.
const setNestedValue = (obj: any, parts: string[], rawValue: string): void => {
  if (parts.length === 1) {
    const currentVal = obj[parts[0]];
    if (Array.isArray(currentVal) && !isObjectArray(currentVal)) {
      obj[parts[0]] = rawValue ? rawValue.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    } else {
      obj[parts[0]] = rawValue || null;
    }
    return;
  }
  const [head, ...tail] = parts;
  if (!isNaN(parseInt(tail[0]))) {
    if (!Array.isArray(obj[head])) obj[head] = [];
    const idx = parseInt(tail[0]);
    if (!obj[head][idx]) obj[head][idx] = {};
    setNestedValue(obj[head][idx], tail.slice(1), rawValue);
  } else {
    if (!isPlainObject(obj[head])) obj[head] = {};
    setNestedValue(obj[head], tail, rawValue);
  }
};

// Convert a dot-separated inputPrefix like "general.0.hla_results.2" into a typed path array.
const pathFromPrefix = (prefix: string): (string | number)[] =>
  prefix.split('.').map(p => /^\d+$/.test(p) ? parseInt(p) : p);


// Build an empty item using the first existing item as a structural template.
const createEmptyItem = (template: Record<string, any>): Record<string, any> => {
  const empty: Record<string, any> = {};
  for (const [key, val] of Object.entries(template)) {
    if (Array.isArray(val)) empty[key] = [];
    else if (isPlainObject(val)) empty[key] = createEmptyItem(val);
    else empty[key] = null;
  }
  return empty;
};

interface FieldEditorProps {
  fieldName: string;
  value: any;
  inputName: string;
  fieldSchema?: any;
}

const FieldEditor = ({ fieldName, value, inputName, fieldSchema }: FieldEditorProps) => {
  const theme = useTheme();
  const defaultValue = value === null || value === undefined ? '' : String(value);
  const fieldType = fieldSchema?.type || 'text';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, py: 0.25 }}>
      <Typography
        variant="caption"
        sx={{
          minWidth: 160,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          fontSize: '0.75rem',
        }}
      >
        {formatFieldName(fieldName)}
      </Typography>
      {fieldType === 'select' && fieldSchema?.choices ? (
        <Select
          size="small"
          name={inputName}
          defaultValue={defaultValue}
          fullWidth
          sx={{ backgroundColor: theme.palette.background.paper, fontSize: '0.8rem' }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                '& .MuiMenuItem-root': { fontSize: '0.8rem' },
              },
            },
          }}
        >
          {fieldSchema.choices.map((choice: string) => (
            <MenuItem key={choice} value={choice}>{choice}</MenuItem>
          ))}
        </Select>
      ) : fieldType === 'boolean' ? (
        <Select
          size="small"
          name={inputName}
          defaultValue={value === true || value === 'true' ? 'true' : value === false || value === 'false' ? 'false' : ''}
          fullWidth
          sx={{ backgroundColor: theme.palette.background.paper, fontSize: '0.8rem' }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                '& .MuiMenuItem-root': { fontSize: '0.8rem' },
              },
            },
          }}
        >
          <MenuItem value=""><em>— not set</em></MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      ) : fieldType === 'number' ? (
        <TextField
          size="small"
          name={inputName}
          type="number"
          defaultValue={defaultValue}
          inputProps={{ step: fieldSchema?.number_type === 'float' ? 'any' : '1' }}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.background.paper, fontSize: '0.8rem' },
          }}
        />
      ) : (
        <TextField
          size="small"
          name={inputName}
          defaultValue={defaultValue}
          fullWidth
          multiline
          minRows={1}
          sx={{
            '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.background.paper, fontSize: '0.8rem' },
          }}
        />
      )}
    </Box>
  );
};

// Nested single object — rendered as an indented sub-heading with its fields
interface SubObjectEditorProps {
  fieldName: string;
  obj: Record<string, any>;
  inputPrefix: string;
  fieldsSchema?: Record<string, any>;
  onDeleteItem?: (path: (string | number)[]) => void;
  onAddItem?: (inputPrefix: string) => void;
}

const SubObjectEditor = ({ fieldName, obj, inputPrefix, fieldsSchema, onDeleteItem, onAddItem }: SubObjectEditorProps) => {
  const theme = useTheme();
  return (
    <Box sx={{ mt: 0.5, mb: 0.5 }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.75rem', display: 'block', mb: 0.25 }}
      >
        {formatFieldName(fieldName)}
      </Typography>
      <Box sx={{ pl: 2, borderLeft: `2px solid ${theme.palette.grey[200]}` }}>
        {Object.entries(obj).map(([subKey, subVal]) => {
          const subPrefix = `${inputPrefix}.${subKey}`;
          const subFieldSchema = fieldsSchema?.[subKey];
          if (isObjectArray(subVal)) return <SubArrayEditor key={subKey} fieldName={subKey} arr={subVal} inputPrefix={subPrefix} itemSchema={subFieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
          if (Array.isArray(subVal) && subFieldSchema?.is_object_array) return <SubArrayEditor key={subKey} fieldName={subKey} arr={[]} inputPrefix={subPrefix} itemSchema={subFieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
          if (isPlainObject(subVal)) return <SubObjectEditor key={subKey} fieldName={subKey} obj={subVal} inputPrefix={subPrefix} fieldsSchema={subFieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
          if (subVal === null && subFieldSchema?.type === 'object') {
            const emptyObj = Object.fromEntries(Object.entries(subFieldSchema.fields || {}).map(([k, fs]: [string, any]) => [k, (fs?.is_array || fs?.is_object_array) ? [] : null]));
            return <SubObjectEditor key={subKey} fieldName={subKey} obj={emptyObj} inputPrefix={subPrefix} fieldsSchema={subFieldSchema.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
          }
          return <FieldEditor key={subKey} fieldName={subKey} value={subVal} inputName={subPrefix} fieldSchema={subFieldSchema} />;
        })}
      </Box>
    </Box>
  );
};

// One item inside a SubArrayEditor — collapsible, labelled by its first field value
interface SubArrayItemProps {
  item: Record<string, any>;
  inputPrefix: string;
  index: number;
  fieldsSchema?: Record<string, any>;
  onDeleteItem?: (path: (string | number)[]) => void;
  onAddItem?: (inputPrefix: string) => void;
}

const SubArrayItem = ({ item, inputPrefix, index, fieldsSchema, onDeleteItem, onAddItem }: SubArrayItemProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [deleteAnchor, setDeleteAnchor] = useState<HTMLButtonElement | null>(null);
  const entries = Object.entries(item);
  const label = `Entry ${index + 1}`;

  return (
    <Box sx={{ mb: 0.5, border: `1px solid ${theme.palette.grey[200]}`, borderRadius: 1, overflow: 'hidden' }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 1, py: 0.5, cursor: 'pointer', backgroundColor: theme.palette.grey[50],
          '&:hover': { backgroundColor: theme.palette.grey[100] },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {onDeleteItem && (
            <>
              <IconButton
                size="small"
                sx={{ p: 0.25, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                onClick={(e) => { e.stopPropagation(); setDeleteAnchor(e.currentTarget); }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <Popover
                open={Boolean(deleteAnchor)}
                anchorEl={deleteAnchor}
                onClose={() => setDeleteAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180 }}>
                  <Typography variant="body2" fontWeight={500}>Delete {label}?</Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button size="small" onClick={() => setDeleteAnchor(null)}>No</Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => { setDeleteAnchor(null); onDeleteItem(pathFromPrefix(inputPrefix)); }}
                    >
                      Yes
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </>
          )}
          <IconButton size="small" sx={{ p: 0.25 }}>
            {expanded ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 1 }}>
          {entries.map(([subKey, subVal]) => {
            const subPrefix = `${inputPrefix}.${subKey}`;
            const subFieldSchema = fieldsSchema?.[subKey];
            if (isObjectArray(subVal)) return <SubArrayEditor key={subKey} fieldName={subKey} arr={subVal} inputPrefix={subPrefix} itemSchema={subFieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
            if (Array.isArray(subVal) && subFieldSchema?.is_object_array) return <SubArrayEditor key={subKey} fieldName={subKey} arr={[]} inputPrefix={subPrefix} itemSchema={subFieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
            if (isPlainObject(subVal)) return <SubObjectEditor key={subKey} fieldName={subKey} obj={subVal} inputPrefix={subPrefix} fieldsSchema={subFieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
            if (subVal === null && subFieldSchema?.type === 'object') {
              const emptyObj = Object.fromEntries(Object.entries(subFieldSchema.fields || {}).map(([k, fs]: [string, any]) => [k, (fs?.is_array || fs?.is_object_array) ? [] : null]));
              return <SubObjectEditor key={subKey} fieldName={subKey} obj={emptyObj} inputPrefix={subPrefix} fieldsSchema={subFieldSchema.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
            }
            return <FieldEditor key={subKey} fieldName={subKey} value={subVal} inputName={subPrefix} fieldSchema={subFieldSchema} />;
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

// Array of objects — collapsible list
interface SubArrayEditorProps {
  fieldName: string;
  arr: Record<string, any>[];
  inputPrefix: string;
  itemSchema?: Record<string, any>;
  onDeleteItem?: (path: (string | number)[]) => void;
  onAddItem?: (inputPrefix: string) => void;
}

const SubArrayEditor = ({ fieldName, arr, inputPrefix, itemSchema, onDeleteItem, onAddItem }: SubArrayEditorProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{ mt: 0.5, mb: 0.5 }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', py: 0.25,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.75rem' }}>
            {formatFieldName(fieldName)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            ({arr.length})
          </Typography>
        </Box>
        <IconButton size="small" sx={{ p: 0.25 }}>
          {expanded ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ pl: 2, borderLeft: `2px solid ${theme.palette.grey[200]}` }}>
          {arr.map((item, i) => (
            <SubArrayItem
              key={i}
              item={item}
              inputPrefix={`${inputPrefix}.${i}`}
              index={i}
              fieldsSchema={itemSchema}
              onDeleteItem={onDeleteItem}
              onAddItem={onAddItem}
            />
          ))}
          {onAddItem && (
            <Button
              size="small"
              onClick={() => onAddItem(inputPrefix)}
              startIcon={<AddIcon sx={{ fontSize: 12 }} />}
              sx={{ mt: 0.5, fontSize: '0.7rem', color: theme.palette.text.secondary, textTransform: 'none', width: '100%', justifyContent: 'center' }}
            >
              Add item
            </Button>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

interface InstanceEditorProps {
  instance: Record<string, any>;
  instanceIndex: number;
  sectionName: string;
  sectionSchema?: any;
  deletable?: boolean;
  onDeleteItem?: (path: (string | number)[]) => void;
  onAddItem?: (inputPrefix: string) => void;
}

const InstanceEditor = ({ instance, instanceIndex, sectionName, sectionSchema, deletable, onDeleteItem, onAddItem }: InstanceEditorProps) => {
  const theme = useTheme();
  const [deleteAnchor, setDeleteAnchor] = useState<HTMLButtonElement | null>(null);
  const fieldsSchema = sectionSchema?.fields || {};
  const label = `Instance ${instanceIndex + 1}`;

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          {label}
        </Typography>
        {deletable && onDeleteItem && (
          <>
            <IconButton
              size="small"
              sx={{ p: 0.25, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
              onClick={(e) => setDeleteAnchor(e.currentTarget)}
            >
              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <Popover
              open={Boolean(deleteAnchor)}
              anchorEl={deleteAnchor}
              onClose={() => setDeleteAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180 }}>
                <Typography variant="body2" fontWeight={500}>Delete {label}?</Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button size="small" onClick={() => setDeleteAnchor(null)}>No</Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => { setDeleteAnchor(null); onDeleteItem([sectionName, instanceIndex]); }}
                  >
                    Yes
                  </Button>
                </Box>
              </Box>
            </Popover>
          </>
        )}
      </Box>
      {Object.entries(instance).map(([fieldName, value]) => {
        const inputPrefix = `${sectionName}.${instanceIndex}.${fieldName}`;
        const fieldSchema = fieldsSchema[fieldName];
        if (isObjectArray(value)) {
          return <SubArrayEditor key={fieldName} fieldName={fieldName} arr={value} inputPrefix={inputPrefix} itemSchema={fieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
        }
        if (Array.isArray(value) && fieldSchema?.is_object_array) {
          return <SubArrayEditor key={fieldName} fieldName={fieldName} arr={[]} inputPrefix={inputPrefix} itemSchema={fieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
        }
        if (isPlainObject(value)) {
          return <SubObjectEditor key={fieldName} fieldName={fieldName} obj={value} inputPrefix={inputPrefix} fieldsSchema={fieldSchema?.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
        }
        // null value for an Optional[SubModel] field — render as empty nested object
        if (value === null && fieldSchema?.type === 'object') {
          const emptyObj = Object.fromEntries(Object.entries(fieldSchema.fields || {}).map(([k, fs]: [string, any]) => [k, (fs?.is_array || fs?.is_object_array) ? [] : null]));
          return <SubObjectEditor key={fieldName} fieldName={fieldName} obj={emptyObj} inputPrefix={inputPrefix} fieldsSchema={fieldSchema.fields} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />;
        }
        return (
          <FieldEditor
            key={fieldName}
            fieldName={fieldName}
            value={value}
            inputName={inputPrefix}
            fieldSchema={fieldSchema}
          />
        );
      })}
    </Box>
  );
};

interface SectionProps {
  sectionName: string;
  sectionId: string;
  instances: any[];
  sectionSchema?: any;
  sectionIsArray?: boolean;
  onDeleteItem?: (path: (string | number)[]) => void;
  onAddItem?: (inputPrefix: string) => void;
}

const Section = ({ sectionName, sectionId, instances, sectionSchema, sectionIsArray, onDeleteItem, onAddItem }: SectionProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  const hasData = instances && instances.length > 0;

  // Build an empty instance from schema fields when section has no data
  const emptyInstance = useMemo(() => {
    if (!sectionSchema?.fields) return null;
    return Object.fromEntries(Object.keys(sectionSchema.fields).map(key => [key, (sectionSchema.fields[key]?.is_array || sectionSchema.fields[key]?.is_object_array) ? [] : null]));
  }, [sectionSchema]);

  return (
    <Box id={sectionId} sx={{ mb: 1, scrollMarginTop: '8px' }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0.75,
          px: 1,
          backgroundColor: theme.palette.grey[100],
          borderRadius: 1,
          cursor: 'pointer',
          position: 'sticky',
          top: -16,
          zIndex: 1,
          pb: 0.5,
          '&:hover': {
            backgroundColor: theme.palette.grey[200],
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
              <InstanceEditor
                key={index}
                instance={instance}
                instanceIndex={index}
                sectionName={sectionName}
                sectionSchema={sectionSchema}
                deletable={sectionIsArray}
                onDeleteItem={onDeleteItem}
                onAddItem={onAddItem}
              />
            ))
          ) : sectionIsArray ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, fontStyle: 'italic' }}>
              No entries.
            </Typography>
          ) : null}
          {sectionIsArray && onAddItem && (
            <Button
              size="small"
              onClick={() => onAddItem(sectionName)}
              startIcon={<AddIcon sx={{ fontSize: 12 }} />}
              sx={{ mt: 0.5, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'none', width: '100%', justifyContent: 'center' }}
            >
              Add item
            </Button>
          )}
          {!sectionIsArray && !hasData && emptyInstance && (
            <InstanceEditor
              instance={emptyInstance}
              instanceIndex={0}
              sectionName={sectionName}
              sectionSchema={sectionSchema}
              deletable={false}
              onDeleteItem={onDeleteItem}
              onAddItem={onAddItem}
            />
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

interface TableOfContentsProps {
  sections: string[];
  onSectionClick: (sectionId: string) => void;
}

const TableOfContents = ({ sections, onSectionClick }: TableOfContentsProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 200,
        flexShrink: 0,
        minHeight: 0,
        borderLeft: `1px solid ${theme.palette.grey[200]}`,
        p: 2,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[300],
          borderRadius: '3px',
        },
      }}
    >
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        SECTIONS
      </Typography>
      {sections.map((sectionName) => (
        <Typography
          key={sectionName}
          variant="body2"
          onClick={() => onSectionClick(`section-${sectionName}`)}
          sx={{
            py: 0.5,
            px: 1,
            cursor: 'pointer',
            borderRadius: 0.5,
            fontSize: '0.8rem',
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.text.primary,
            },
          }}
        >
          {formatSectionName(sectionName)}
        </Typography>
      ))}
    </Box>
  );
};

interface CellLineEditorProps {
  data: Record<string, any[] | Record<string, any>>;
  cellLineName: string;
  filename: string;
  lastModified: string | null;
  location: 'working' | 'ready';
  onSave: (data: Record<string, any[] | Record<string, any>>) => void;
  onCreate: (name: string, cellType: string) => void;
  onDiscard: () => void;
  onStatusChange: (newLocation: 'working' | 'ready') => void;
  validationErrors?: string[];
  onClearErrors?: () => void;
}

const CellLineEditor = ({ data, cellLineName, filename, lastModified, location, onSave, onCreate, onDiscard, onStatusChange, validationErrors = [], onClearErrors }: CellLineEditorProps) => {
  const theme = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [schemaError, setSchemaError] = useState(false);
  const [schemaRetryTick, setSchemaRetryTick] = useState(0);
  const [createAnchor, setCreateAnchor] = useState<HTMLButtonElement | null>(null);
  const [newCellType, setNewCellType] = useState<string>('');
  const [discardAnchor, setDiscardAnchor] = useState<HTMLButtonElement | null>(null);
  const newNameInputRef = useRef<HTMLInputElement>(null);
  const [schema, setSchema] = useState<any>(null);

  // Reset isSaving when parent responds (data updated = success, validationErrors updated = failure)
  useEffect(() => { setIsSaving(false); }, [data, validationErrors]);

  // Fetch schema on mount (and on retry)
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch(getApiUrl('/cellline-schema'));
        if (response.ok) {
          const schemaData = await response.json();
          setSchema(schemaData);
          setSchemaError(false);
        } else {
          setSchemaError(true);
        }
      } catch (error) {
        setSchemaError(true);
      }
    };
    fetchSchema();
  }, [schemaRetryTick]);

  // Normalize: convert single objects to arrays for consistent internal rendering
  const normalizedData: Record<string, any[]> = Object.fromEntries(
    Object.entries(data || {}).map(([key, val]) => [
      key,
      Array.isArray(val) ? val : (val && typeof val === 'object' ? [val] : []),
    ])
  );

  // Extract cell_type from general section (handles both object and array shape)
  const generalSection = data?.general;
  const generalObj = Array.isArray(generalSection) ? generalSection[0] : generalSection;
  const cellType: string = generalObj?.cell_type || '';

  // Section names to hide based on cell type
  const IPSC_VALUE = "human induced pluripotent stem cell (hiPSC)";
  const ESC_VALUE = "human embryonic stem cell (hESC)";
  const hiddenSection = cellType === IPSC_VALUE ? 'derivation_esc'
    : cellType === ESC_VALUE ? 'derivation_ipsc'
    : null;

  const collectNormalizedFormData = (): Record<string, any[]> => {
    const newData: Record<string, any[]> = JSON.parse(JSON.stringify(normalizedData));
    if (!formRef.current) return newData;
    const formData = new FormData(formRef.current);
    for (const [key, value] of formData.entries()) {
      const parts = key.split('.');
      const [sectionName, indexStr, fieldName, ...rest] = parts;
      const index = parseInt(indexStr, 10);
      if (!newData[sectionName]) continue;
      // Initialize slot for sections that had no data (rendered from schema)
      if (!newData[sectionName][index]) newData[sectionName][index] = {};
      if (rest.length === 0) {
        const originalVal = newData[sectionName][index][fieldName];
        const fieldSchema = schema?.sections?.[sectionName]?.fields?.[fieldName];
        if ((Array.isArray(originalVal) && !isObjectArray(originalVal)) || fieldSchema?.is_array) {
          // Preserve array type: parse CSV string back to array (or keep as empty array)
          newData[sectionName][index][fieldName] = (value as string)
            ? (value as string).split(',').map(s => s.trim()).filter(Boolean)
            : [];
        } else if (fieldSchema?.type === 'number') {
          newData[sectionName][index][fieldName] = value ? parseFloat(value as string) : null;
        } else if (fieldSchema?.type === 'boolean') {
          newData[sectionName][index][fieldName] = value === 'true' ? true : value === 'false' ? false : null;
        } else {
          newData[sectionName][index][fieldName] = value || null;
        }
      } else {
        setNestedValue(newData[sectionName][index], [fieldName, ...rest], value as string);
      }
    }
    return newData;
  };

  const denormalize = (newData: Record<string, any[]>): Record<string, any[] | Record<string, any>> => {
    const outputData: Record<string, any[] | Record<string, any>> = {};
    for (const [sectionName, instances] of Object.entries(newData)) {
      const wasArray = Array.isArray(data[sectionName]);
      outputData[sectionName] = wasArray ? instances : (instances[0] ?? null);
    }
    return outputData;
  };

  const handleSave = () => {
    if (onClearErrors) onClearErrors();
    setIsSaving(true);
    onSave(denormalize(collectNormalizedFormData()));
  };

  const handleDeleteItem = (path: (string | number)[]) => {
    const newData = collectNormalizedFormData();
    let parent: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent[path[i]];
      if (parent == null) return;
    }
    const lastIdx = path[path.length - 1];
    if (Array.isArray(parent) && typeof lastIdx === 'number') {
      parent.splice(lastIdx, 1);
    }
    onSave(denormalize(newData));
  };

  const handleAddItem = (inputPrefix: string) => {
    const newData = collectNormalizedFormData();
    const path = pathFromPrefix(inputPrefix);

    // Navigate to the parent object, initializing any null/missing intermediates as {}
    let parent: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      if (parent == null) return;
      if (parent[path[i]] == null) parent[path[i]] = {};
      parent = parent[path[i]];
    }
    if (parent == null) return;

    // Initialize the target array if it is missing (e.g. list field inside a null Optional[SubModel])
    const lastKey = path[path.length - 1];
    if (!Array.isArray(parent[lastKey])) parent[lastKey] = [];
    const target = parent[lastKey];
    if (!Array.isArray(target)) return;

    if (target.length > 0 && Object.keys(target[0]).length > 0) {
      // Clone structure from first existing item
      target.push(createEmptyItem(target[0]));
    } else {
      // Look up item field structure from schema using the inputPrefix path
      const parts = inputPrefix.split('.');
      const sectionName = parts[0];
      const fieldParts = parts.filter(p => !/^\d+$/.test(p)).slice(1);
      let fieldDef: any = schema?.sections?.[sectionName];
      for (const fp of fieldParts) {
        fieldDef = fieldDef?.fields?.[fp];
      }
      const emptyItem = fieldDef?.fields
        ? Object.fromEntries(Object.entries(fieldDef.fields).map(([k, fs]: [string, any]) => [k, (fs?.is_array || fs?.is_object_array) ? [] : null]))
        : {};
      target.push(emptyItem);
    }

    onSave(denormalize(newData));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ block: 'start' });
    }
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No cell line data to display
        </Typography>
      </Box>
    );
  }

  // If cell_type is not set, block rendering and prompt the user to choose
  if (!cellType) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.grey[200]}`, flexShrink: 0 }}>
          <Typography variant="h6" fontWeight={600}>{cellLineName}</Typography>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning">
            The cell line type (<strong>general.cell_type</strong>) is not set in the returned data. Select iPSC or ESC to proceed.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Review the data returned from curation below, then select the correct cell line type.
          </Typography>
          <Box
            component="pre"
            sx={{
              flex: 1,
              overflow: 'auto',
              backgroundColor: theme.palette.grey[100],
              borderRadius: 1,
              p: 2,
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {JSON.stringify(data, null, 2)}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" fontWeight={500}>Select cell line type to continue:</Typography>
            <ToggleButtonGroup
              value={newCellType}
              exclusive
              onChange={(_, val) => { if (val) setNewCellType(val); }}
              size="small"
            >
              <ToggleButton value={IPSC_VALUE} sx={{ fontSize: '0.8rem', px: 3 }}>iPSC</ToggleButton>
              <ToggleButton value={ESC_VALUE} sx={{ fontSize: '0.8rem', px: 3 }}>ESC</ToggleButton>
            </ToggleButtonGroup>
            <Box>
              <Button
                variant="contained"
                size="small"
                disabled={!newCellType}
                onClick={() => {
                  if (!newCellType) return;
                  // Inject cell_type into the data and re-save so the editor can render
                  const updated = JSON.parse(JSON.stringify(data));
                  if (Array.isArray(updated.general)) {
                    if (!updated.general[0]) updated.general[0] = {};
                    updated.general[0].cell_type = newCellType;
                  } else {
                    if (!updated.general) updated.general = {};
                    updated.general.cell_type = newCellType;
                  }
                  onSave(updated);
                }}
                sx={{ backgroundColor: theme.palette.secondary.dark, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const sectionNames = Object.keys(normalizedData).filter(name => name !== hiddenSection);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      {/* Schema fetch error */}
      {schemaError && (
        <Alert severity="warning" sx={{ m: 2, mb: 0 }} action={
          <Button size="small" onClick={() => setSchemaRetryTick(t => t + 1)}>Retry</Button>
        }>
          Schema failed to load — field type widgets unavailable.
        </Alert>
      )}
      {/* Validation errors */}
      {validationErrors && validationErrors.length > 0 && (
        <Alert severity="error" onClose={onClearErrors} sx={{ m: 2, mb: 0 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
            Validation Errors:
          </Typography>
          {validationErrors.map((error, index) => (
            <Typography key={index} variant="body2" sx={{ fontSize: '0.85rem' }}>
              • {error}
            </Typography>
          ))}
        </Alert>
      )}
      {/* Header section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          p: 2,
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {cellLineName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Edited: {lastModified ? new Date(lastModified).toLocaleString() : '—'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <FormControlLabel
            control={
              <Switch
                checked={location === 'ready'}
                onChange={(e) => onStatusChange(e.target.checked ? 'ready' : 'working')}
                size="small"
              />
            }
            label={location === 'ready' ? 'Ready' : 'Working'}
            labelPlacement="start"
            sx={{ mr: 0 }}
          />
          <ButtonGroup
            size="small"
            variant="outlined"
            sx={{
              '& .MuiButton-root': {
                fontSize: '0.75rem',
                px: 1.25,
                py: 0.5,
                whiteSpace: 'nowrap',
                minWidth: 'unset',
                lineHeight: 1.5,
                borderColor: theme.palette.secondary.dark,
                color: theme.palette.secondary.dark,
                '&:hover': {
                  borderColor: theme.palette.secondary.main,
                  backgroundColor: theme.palette.action.hover,
                },
              },
              '& .MuiButton-startIcon': { mr: 0.5 },
              '& .MuiButton-startIcon svg': { fontSize: '0.9rem !important' },
            }}
          >
            <Button
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSaving}
              sx={{
                backgroundColor: `${theme.palette.secondary.dark} !important`,
                color: 'white !important',
                '&:hover': { backgroundColor: `${theme.palette.secondary.main} !important` },
                '&:disabled': { backgroundColor: `${theme.palette.grey[300]} !important`, color: `${theme.palette.grey[500]} !important` },
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button startIcon={<AddIcon />} onClick={(e) => setCreateAnchor(e.currentTarget)}>
              New
            </Button>
            <Button startIcon={<RefreshIcon />} onClick={(e) => setDiscardAnchor(e.currentTarget)}>
              Reset
            </Button>
          </ButtonGroup>

          {/* New cell line popover */}
          <Popover
            open={Boolean(createAnchor)}
            anchorEl={createAnchor}
            onClose={() => { setCreateAnchor(null); setNewCellType(''); }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 280 }}>
              <Typography variant="body2" fontWeight={500}>
                Enter a name for the new cell line
              </Typography>
              <TextField
                size="small"
                placeholder="e.g. AIBNi001-A"
                inputRef={newNameInputRef}
                autoFocus
              />
              <Typography variant="body2" fontWeight={500}>
                Cell line type
              </Typography>
              <ToggleButtonGroup
                value={newCellType}
                exclusive
                onChange={(_, val) => { if (val) setNewCellType(val); }}
                size="small"
                fullWidth
              >
                <ToggleButton value="human induced pluripotent stem cell (hiPSC)" sx={{ fontSize: '0.75rem' }}>
                  iPSC
                </ToggleButton>
                <ToggleButton value="human embryonic stem cell (hESC)" sx={{ fontSize: '0.75rem' }}>
                  ESC
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                size="small"
                disabled={!newCellType}
                onClick={() => {
                  const value = newNameInputRef.current?.value.trim();
                  if (value && newCellType) {
                    onCreate(value, newCellType);
                    setCreateAnchor(null);
                    setNewCellType('');
                  }
                }}
                sx={{ backgroundColor: theme.palette.secondary.dark, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
              >
                Create
              </Button>
            </Box>
          </Popover>

          {/* Reset confirmation popover */}
          <Popover
            open={Boolean(discardAnchor)}
            anchorEl={discardAnchor}
            onClose={() => setDiscardAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 250 }}>
              <Typography variant="body2" fontWeight={500}>
                Are you sure you want to reset changes?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" onClick={() => setDiscardAnchor(null)}>No</Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => { setDiscardAnchor(null); onDiscard(); }}
                  sx={{ backgroundColor: theme.palette.secondary.dark, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
                >
                  Yes
                </Button>
              </Box>
            </Box>
          </Popover>
        </Box>
      </Box>

      {/* Content area */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Main editor area */}
      <Box
        component="form"
        ref={formRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[300],
            borderRadius: '4px',
          },
        }}
      >
        {Object.entries(normalizedData)
          .filter(([sectionName]) => sectionName !== hiddenSection)
          .map(([sectionName, instances]) => (
          <Section
            key={sectionName}
            sectionName={sectionName}
            sectionId={`section-${sectionName}`}
            instances={instances}
            sectionSchema={schema?.sections?.[sectionName]}
            sectionIsArray={schema?.sections?.[sectionName]?.is_list === true || Array.isArray(data[sectionName])}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleAddItem}
          />
        ))}
      </Box>

      {/* Table of Contents */}
      <TableOfContents sections={sectionNames} onSectionClick={scrollToSection} />
      </Box>

    </Box>
  );
};

export default CellLineEditor;
