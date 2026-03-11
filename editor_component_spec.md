# CellLineEditor Component Spec

This document describes the design and behaviour of the `CellLineEditor` component as used in the Curation page. Its purpose is to serve as a reference when investigating bugs, evaluating new feature requests, or understanding why the component behaves a certain way.

---

## 1. Overview

`CellLineEditor` is a form-based editor for cell line metadata. It is rendered in the Curation page after the user selects a cell line from the working or ready list. It allows the user to edit all fields of the cell line's JSON data structure, add or remove array entries, and save changes back to the backend.

The component lives at:
```
services/frontend/my-app/src/app/components/CellLineEditor.tsx
```

It is used in the Curation page at:
```
services/frontend/my-app/src/app/tools/curation/page.tsx
```

The component does not manage its own persistence — it delegates all save and load operations to the parent via callbacks.

Cell lines are either iPSC ("human induced pluripotent stem cell (hiPSC)") or ESC ("human embryonic stem cell (hESC)"). These two types have mutually exclusive derivation sections (`derivation_ipsc` and `derivation_esc`). The editor uses `general.cell_type` to determine which derivation section to show and hides the other entirely. `general.cell_type` is always expected to be set before the editor renders a form; if it is absent, the editor shows a blocking prompt instead.

---

## 2. Component Tree

`CellLineEditor` is a single file with all sub-components defined internally. None of the sub-components are exported.

```
CellLineEditor
├── Section                  (one per top-level section in the data)
│   └── InstanceEditor       (one per instance within the section)
│       ├── FieldEditor      (one per scalar field)
│       ├── SubObjectEditor  (for nested single objects)
│       │   ├── FieldEditor
│       │   ├── SubObjectEditor (recursive)
│       │   └── SubArrayEditor (recursive)
│       └── SubArrayEditor   (for arrays of objects)
│           └── SubArrayItem (one per array item, collapsible)
│               ├── FieldEditor
│               ├── SubObjectEditor
│               └── SubArrayEditor (recursive)
└── TableOfContents          (right sidebar, lists section names)
```

**Sub-component responsibilities:**

| Component | Responsibility |
|---|---|
| `Section` | Renders a collapsible top-level section. Shows item count. Handles empty-state display. |
| `InstanceEditor` | Renders one instance (one object) within a section. Shows delete button if the section is a list. Dispatches rendering to `FieldEditor`, `SubObjectEditor`, or `SubArrayEditor` per field. |
| `FieldEditor` | Renders a single scalar field as a labelled input. Chooses the input widget based on field type. |
| `SubObjectEditor` | Renders a nested plain object as an indented block with a heading. Recurses into its own fields. |
| `SubArrayEditor` | Renders an array of objects as a collapsible labelled list. Shows item count. |
| `SubArrayItem` | Renders one item in a `SubArrayEditor`. Collapsible. Shows delete icon with confirmation popover. Recurses into its own fields. |
| `TableOfContents` | Fixed right sidebar listing section names. Clicking a section name scrolls to it. Only sections that are rendered appear in the TOC — the hidden derivation section is excluded. |

---

## 3. Props Interface

```typescript
interface CellLineEditorProps {
  data: Record<string, any[] | Record<string, any>>;
  cellLineName: string;
  filename: string;
  lastModified: string | null;
  onSave: (data: Record<string, any[] | Record<string, any>>) => void;
  onCreate: (name: string, cellType: string) => void;
  onDiscard: () => void;
  validationErrors?: string[];
  onClearErrors?: () => void;
}
```

| Prop | Description |
|---|---|
| `data` | The cell line metadata object. Top-level keys are section names. Each section is either an array of objects or a single object. |
| `cellLineName` | Display name shown in the editor header. |
| `filename` | The cell line's filename (e.g. `AIBNi001-A_v1.json`). Used by the parent for routing save requests. |
| `lastModified` | ISO datetime string shown in the header, or `null`. |
| `onSave` | Called when the user clicks Save. Receives the full denormalized data object. |
| `onCreate` | Called when the user creates a new cell line. Receives the name string and the selected cell type (`"human induced pluripotent stem cell (hiPSC)"` or `"human embryonic stem cell (hESC)"`). |
| `onDiscard` | Called when the user confirms Reset. The parent re-fetches from the backend and increments `editorKey` to force a full re-render. |
| `validationErrors` | Array of error strings to display at the top of the editor. Provided by the parent after a failed save. |
| `onClearErrors` | Called when the user dismisses the error alert, or at the start of each save attempt. |

---

## 4. Data Normalization

The data passed in via the `data` prop has an inconsistent structure: some sections are a single plain object, others are an array of objects. To simplify rendering, the component normalizes everything to arrays internally on every render.

**Normalization (on read):**
```
{ general: { name: "X" } }     →  { general: [{ name: "X" }] }
{ donors: [{ id: 1 }, ...] }   →  { donors: [{ id: 1 }, ...] }   (unchanged)
```

**Denormalization (on save):**
Before calling `onSave`, the component restores the original structure by checking whether the original `data` prop had an array or object for each section.

```
{ general: [{ name: "X" }] }   →  { general: { name: "X" } }     (was object)
{ donors: [{ id: 1 }, ...] }   →  { donors: [{ id: 1 }, ...] }   (was array)
```

This means sections that were originally objects will always be saved back as objects, even if the editor internally treats them as single-element arrays.

**Cell type extraction:**
Immediately after normalization, the component reads `general.cell_type` from the raw `data` prop (before normalization, handling both object and array shapes). This value is used to determine which derivation section to hide and whether to show the cell-type selection prompt. See Section 7.

---

## 5. Schema Loading

The component fetches the cell line schema from the backend on mount:

```
GET /cellline-schema
```

The schema is stored in local state and used throughout the component for:
- Determining whether a section is a list (`is_list: true`) or a single object
- Selecting the correct input widget for each field (`type`, `choices`, `number_type`)
- Building the list of addable arrays (`is_object_array: true`)
- Constructing empty instances when a section or array field has no existing data

Schema shape (relevant parts):
```typescript
{
  sections: {
    [sectionName]: {
      is_list: boolean,
      fields: {
        [fieldName]: {
          type: 'text' | 'number' | 'boolean' | 'select',
          number_type?: 'float' | 'int',
          choices?: string[],
          is_array?: boolean,        // primitive array (rendered as CSV)
          is_object_array?: boolean, // array of objects (rendered with SubArrayEditor)
          fields?: { ... }           // for nested object types
        }
      }
    }
  }
}
```

If the schema fetch fails, the editor still renders using the raw data shape, but field-type-specific widgets (select dropdowns, number inputs) fall back to plain text inputs.

---

## 6. Field Types and Rendering

All scalar fields are rendered by `FieldEditor`. The widget chosen depends on the `type` property in the schema. If no schema is available for a field, it defaults to a plain text input.

| Schema type | Widget | Notes |
|---|---|---|
| `text` (default) | `TextField` | Empty string saved as `null`. |
| `number` | `TextField type="number"` | `step="any"` for `float`, `step="1"` for `int`. Parsed with `parseFloat` on save. Empty value saved as `null`. |
| `boolean` | `Select` dropdown | Options: `True` / `False`. Default is `false` if the current value is not `true`. Saved as a boolean (`true`/`false`), not a string. |
| `select` | `Select` dropdown | Options populated from `choices` array in schema. |

**Primitive arrays (`is_array: true`):**
Rendered as a single `TextField` where items are displayed and entered as a comma-separated string. On save, the string is split on commas and trimmed to produce an array of strings. An empty string saves as an empty array `[]`.

**Object arrays and nested objects** are handled by `SubArrayEditor` and `SubObjectEditor` respectively — see Section 8.

---

## 7. Section and Instance Rendering

Each top-level key in `normalizedData` is rendered as a `Section`, with the exception of the derivation section that does not apply to the current cell line type (see below).

**Section header** shows:
- Formatted section name (snake_case → Title Case)
- Item count in parentheses

**Instance rendering:**
Each item in a section's array is passed to `InstanceEditor`. `InstanceEditor` iterates over the instance's fields and dispatches to the appropriate sub-component based on the value type and schema.

**Empty-state behaviour:**

| Condition | What is shown |
|---|---|
| Section is a list (`is_list: true`) with no items | "No entries." text, plus an Add item button below |
| Section is not a list and has no data | An `InstanceEditor` is rendered using a schema-derived empty instance (all fields `null`) |

**Deletable instances:**
If the section is marked as a list (via schema `is_list` or because `data[sectionName]` was originally an array), each `InstanceEditor` shows a delete icon. Clicking it shows a confirmation popover. On confirm, the instance is spliced out and `onSave` is called immediately.

**Derivation section gating (iPSC / ESC):**
The `general.cell_type` field determines which derivation section is rendered:
- `"human induced pluripotent stem cell (hiPSC)"` → `derivation_esc` is hidden
- `"human embryonic stem cell (hESC)"` → `derivation_ipsc` is hidden

The hidden section is excluded from both the form render loop and the `TableOfContents`. If `general.cell_type` is not set in the data, the editor does not render the form at all. Instead it shows a blocking prompt: a warning, the raw curation data as a scrollable JSON block, and an iPSC / ESC toggle. When the user selects a type and clicks Continue, the component injects the chosen value into `general.cell_type` and calls `onSave` immediately, which causes the parent to re-render the editor with the updated data and the appropriate form.

**How cell_type is guaranteed to be set:**
- **Create new line flow:** The "New" popover requires the user to select iPSC or ESC (via a toggle button group) before the Create button is enabled. The selected type is passed to `onCreate(name, cellType)`, which the parent forwards to `GET /get-empty-form?cell_type=...`. The returned empty form has `general.cell_type` pre-populated and only contains the relevant derivation section.
- **AI curation flow:** The AI determines and populates `general.cell_type`. If the curation returns without it set, the blocking prompt described above handles the fallback.

---

## 8. Nested Object and Array Rendering

`InstanceEditor` inspects each field value and routes it to the correct renderer:

| Value type | Renderer |
|---|---|
| Scalar (string, number, boolean, null) | `FieldEditor` |
| Primitive array (`is_array` in schema, or non-object array) | `FieldEditor` (CSV display) |
| Plain object | `SubObjectEditor` |
| Array of objects | `SubArrayEditor` |

**`SubObjectEditor`:**
Renders a nested object as an indented block with a bold heading. Recurses into its fields using the same dispatch logic.

**`SubArrayEditor`:**
Renders an array of objects as a collapsible labelled list with an item count. Each item is rendered by `SubArrayItem`.

**`SubArrayItem`:**
Renders one item in an object array. Starts expanded. Shows a delete icon with a confirmation popover. Recurses into the item's fields using the same dispatch logic.

**Empty object arrays:**
If a field is an object array but currently has no items (i.e. `[]`), `SubArrayEditor` is still rendered (showing zero items). The user can add items via the inline `+` button at the bottom of the `SubArrayEditor`.

---

## 9. Adding Array Items

Items are added via inline `+` buttons rendered directly within the list. There is no central Add Entry dialog.

**Where `+` buttons appear:**

- **Top-level list sections (`is_list: true`):** A `+` button is rendered below the section's content (below all instances). Clicking it calls `onAddItem(sectionName)`.
- **Nested object array fields (`SubArrayEditor`):** A `+` button is rendered at the bottom of each `SubArrayEditor`'s expanded item list, at any depth. Clicking it calls `onAddItem(inputPrefix)`, where `inputPrefix` is the dot-notation path to the array (e.g. `donors.0.hla_results`).

**Prop threading:**
`onAddItem(inputPrefix: string)` is passed as a prop from `CellLineEditor` → `Section` → `InstanceEditor` → `SubObjectEditor` / `SubArrayEditor` → `SubArrayItem`, at every level of the tree.

**`handleAddItem` logic:**

1. Collects current form data (so any unsaved edits are preserved).
2. Parses `inputPrefix` into a path by splitting on `.`.
3. Navigates the collected data to the target array using the path.
4. If the target array already has items, a new empty item is created using `createEmptyItem`, which mirrors the structure of the first existing item with all leaf values set to `null`.
5. If the target array is empty (or the first item has no keys), the schema is used as a fallback: non-numeric segments of `inputPrefix` are used to navigate `schema.sections[sectionName]` through `.fields` until the array field definition is found. An empty item is constructed from that definition's `fields`.
6. The new item is pushed into the array and `onSave` is called immediately with the updated data.

---

## 10. Removing Array Items

Delete buttons appear on:
- `InstanceEditor` — when its section is a list
- `SubArrayItem` — always (nested items are always deletable)

Clicking delete shows a confirmation popover ("Delete Instance N?" or "Delete Entry N?"). On confirm:

1. `handleDeleteItem` is called with the item's path as an array of keys/indices.
2. The current form data is collected first (preserving any unsaved edits).
3. The item is spliced out of its parent array.
4. `onSave` is called immediately with the updated data.

There is no undo for deletions. The only recovery is Reset (which re-fetches from the backend).

---

## 11. Form Data Collection and Save Flow

The editor uses an **uncontrolled form**. Input values are not tracked in React state — they are read directly from the DOM via the `FormData` API when the user clicks Save or triggers an add/delete operation.

**`inputName` convention:**
Every input has a `name` attribute using dot-notation that encodes its full path:

```
{sectionName}.{instanceIndex}.{fieldName}
{sectionName}.{instanceIndex}.{fieldName}.{subFieldName}
{sectionName}.{instanceIndex}.{fieldName}.{subArrayIndex}.{leafField}
```

Example: `donors.0.hla_results.2.allele`

**`collectNormalizedFormData`:**

1. Deep-clones `normalizedData` as the base.
2. Iterates all `FormData` entries.
3. Splits each key by `.` to get the path.
4. Applies type coercion based on schema:
   - Primitive array: split CSV string → string array
   - `number`: `parseFloat`, empty → `null`
   - `boolean`: `"true"` → `true`, anything else → `false`
   - Text: empty string → `null`
5. Sets the value at the correct nested path using `setNestedValue`.

**Save flow:**

```
User clicks Save
  → handleSave()
  → onClearErrors()
  → collectNormalizedFormData()  (reads DOM)
  → denormalize()                (restores original object/array structure)
  → onSave(data)                 (parent's saveCellLine())
```

The parent (`saveCellLine` in curation/page.tsx) then calls either:
- `POST /working/cell-line` for new cell lines
- `PUT /working/cell-line/{filename}` for existing ones

On success, the parent updates `editedMetadata` with the saved data. On error, it sets `validationErrors` which are passed back into the editor.

**Backend enforcement of cell type:**
A `@model_validator` on `JSONOutputSchema` (in `data_dictionaries/models.py`) runs on every save. It reads `general.cell_type` and nulls out whichever derivation section does not apply. This acts as a safety net independent of frontend behaviour — saved data will never contain both `derivation_ipsc` and `derivation_esc` populated simultaneously.

---

## 12. Validation and Error Display

**Client-side:**
There is no client-side field validation. The component does not enforce required fields, character limits, or enum constraints before saving. Type coercion (number parsing, boolean conversion, CSV splitting) happens during form data collection, but no errors are raised if the result is invalid.

**Server-side (Pydantic):**
The backend validates the full data object on save. Errors are returned as HTTP 422 with a Pydantic detail array. The curation page parses these into human-readable strings:

```
"path → to → field: error message (got: "value")"
```

409 conflicts (duplicate cell line name) and unexpected errors are also converted to error strings.

**Error display:**
Errors are passed to the editor via `validationErrors` and shown as a dismissible `Alert` at the top of the component. Each error is shown as a bullet point.

Errors are cleared:
- When the user dismisses the alert (calls `onClearErrors`)
- At the start of each new save attempt

Errors are not cleared on Reset — the parent's `onDiscard` handler explicitly sets `validationErrors` to `[]` before calling `setEditorKey`.

---

## 13. Known Limitations and Gaps

**No client-side validation:**
The schema contains `choices`, `type`, and field definitions that could be used to validate input before saving. Currently, none of this is enforced client-side. Invalid values only surface after a round-trip to the backend.

**Boolean defaults:**
`FieldEditor` renders the boolean select with `defaultValue` set from the initial data. If the field is `null` in the data, the select renders with an empty string default, which does not match either `"true"` or `"false"`. The select will appear blank, and saving will store `false` (because `value === 'true'` is the only truthy check). This can produce unexpected behaviour for fields that should be `null` (not set) vs. explicitly `false`.

**Queued / Working toggle:**
The toggle in the header is UI-only state (`isQueued`). It is not saved to the backend and does not affect the save payload. It has no functional effect in the current implementation.

**`isSaving` state is never set:**
The `isSaving` local state disables the Save button during saving, but it is never set to `true` — the `handleSave` function does not set it. As a result the Save button is never visually disabled during a save operation.

**Primitive array editing:**
Primitive arrays (e.g. a list of strings) are edited as a comma-separated text field. There is no per-item editing, add/remove UI, or way to include commas in individual values.

**No undo:**
There is no undo stack. Deleting an item and then clicking Reset is the only way to recover deleted data, and only if the data was previously saved.

**Schema fetch failure is silent:**
If the schema fetch fails, the editor renders using data shape only. Fields lose their type-specific widgets, `is_list` detection falls back to checking whether the original data key was an array, and the Add Entry dialog may not show all available lists. No error is shown to the user.
