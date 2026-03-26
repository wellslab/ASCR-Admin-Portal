# Validation

**Source files:** `services/backend/validation.py`, `data_dictionaries/models.py`

## Responsibilities

- **Run curation schema validation** — validates cell line data against generated Pydantic models during the AI curation pipeline and at the API boundary.
- **Feedback errors to the frontend** — returns structured validation errors that the editor displays at the field level.
- **Export curation schema to frontend** — produces field descriptors and empty form structures that the editor uses to render the correct input type for each field.

---

## Run curation schema validation

The schema for all cell line data is defined in `data_dictionaries/models.py`. This file is the single source of truth for the curation schema and is edited directly when the schema needs to change.

The top-level model is `JSONOutputSchema`, which is the authoritative definition of a cell line record. It contains section fields covering general identity, contact and organisational details, ethics approval, donors, characterisation results, culture conditions, derivation method, genome editing, and disease-related metadata. String fields that can only take a fixed set of values are typed as `Literal[...]` enumerations, which Pydantic enforces strictly. Most fields are `Optional`, reflecting that scientific publications rarely contain complete metadata.

### In the AI curation pipeline

After the normalisation agent produces a `JSONOutputSchema` instance, the Celery task passes it to `CellLineValidation.validate()` in `validation.py`. This attempts to construct a `JSONOutputSchema` Pydantic model from the normalised data. If construction succeeds, the cell line is marked `validation_status: "success"` and passed to the save step. If Pydantic raises a `ValidationError`, the cell line is marked `validation_status: "failed"` with the full error details preserved. Failed cell lines are not saved to disk.

### At the API boundary

When a curator saves a cell line through the editor, the request body is typed as `JSONOutputSchema` in the FastAPI endpoint definition. FastAPI validates the incoming JSON automatically before the endpoint handler runs. Both paths — AI pipeline and manual editing — enforce exactly the same set of constraints.

---

## Feedback errors to the frontend

When validation fails at the API boundary, FastAPI returns HTTP 422 with a structured error body. Each entry identifies the field path, the rule that failed, the invalid input, and an explanation of what was expected. The frontend editor parses these and displays them at the field level, so the curator sees precisely which field needs correcting and why.

---

## Export curation schema to frontend

`validation.py` contains two utilities that describe the schema to the frontend for rendering the editor.

`get_frontend_schema(model_class)` inspects the JSON schema produced by Pydantic and transforms it into a frontend-friendly representation. For each section of `JSONOutputSchema`, it produces field descriptors that include the field type, whether the field is required, a description string from the Pydantic field metadata, and for `Literal` fields, the list of permitted values. The type names used — `"select"`, `"text"`, `"number"`, `"boolean"`, `"object"` — are the same names the frontend editor uses to decide which input widget to render.

`generate_empty_form(form_class, hpscreg_name, cell_type)` produces an empty form structure for a new cell line, with all string fields set to `None`, list fields set to empty lists, and numeric fields set to `0`. If a `cell_type` is provided, the appropriate derivation section is pre-populated and the irrelevant one omitted. If an `hpscreg_name` is provided, it is pre-populated in the `general` section.

For full method documentation, see the [Validation API reference](../reference/validation.md).

---

## Updating the schema

To add, remove, or change a field, edit `data_dictionaries/models.py` directly. Both backend validation and the frontend editor derive from this file, so they will reflect the change on next deployment without any further steps.

If the change affects existing records — for example, a field is renamed or a new required field is added — use the **Migrate Schema** button on the Settings page to apply the updated schema to all existing cell line files in `working/`.

---

## Dependencies

`validation.py` imports `JSONOutputSchema` from `data_dictionaries/models.py` and uses Pydantic's standard validation mechanisms. `CellLineValidation` is used in `tasks.py` as part of the AI curation pipeline. The `get_frontend_schema` and `generate_empty_form` functions are called from the `/cellline-schema` and `/get-empty-form` endpoints in `main.py`.

---

## FAQ

**How do I change the schema?**

Edit `data_dictionaries/models.py` directly. It is the single source of truth for the curation schema.

**What if a cell line fails validation in the AI pipeline but others from the same publication pass?**

The failed cell line is excluded from the save step while the others are saved normally. The task result records the failure with full Pydantic error details so the curator can inspect it in the Task History panel.

**Where do the field descriptions in the editor come from?**

From the Pydantic field metadata in `data_dictionaries/models.py`. Changing a field description means editing the field's metadata in that file directly.
