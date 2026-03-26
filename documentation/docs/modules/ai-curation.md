# AI Curation

**Source files:** `services/backend/curate.py`, `services/backend/tasks.py`

## Responsibilities

- **Start AI curation process** — orchestrates the full pipeline from PDF upload through cell line identification, metadata extraction, normalisation, validation, and saving to `working/`, running as a Celery background task with live progress reporting.
- **Retrieve AI assets** — loads the agent system prompts and controlled vocabulary context from disk at pipeline initialisation time.

---

## Configuration

Before AI curation can run, two values must be set via the **Settings page** in the admin portal:

| Setting | Config key | Description |
|---|---|---|
| OpenAI API key | `OPENAI_API_KEY` | Required. Curation will return HTTP 400 if not set. |
| Model | `SELECTED_MODEL` | Optional. Defaults to `gpt-4.1-mini` if not set. |

Both values are stored in `services/backend/config.json` by the configuration manager. The configuration manager does **not** fall back to environment variables — the Settings page is the only place these values are read from. Setting `OPENAI_API_KEY` as an environment variable will have no effect.

All three AI agents use the same model. There is no per-agent model configuration.

---

## The curation request

The pipeline is initiated by `POST /start-ai-curation`. The request body accepts one or more PDF files:

```json
{
  "files": [
    {
      "filename": "publication.pdf",
      "file_data": "<base64-encoded PDF bytes>"
    }
  ]
}
```

Each file in the array is dispatched as an independent Celery task. The endpoint checks that `OPENAI_API_KEY` is configured before queuing any tasks, and returns HTTP 400 immediately if it is not.

---

## Start AI curation process

When a curation task starts, the PDF is uploaded to the OpenAI Files API and then passed through three agents in sequence.

```
1. Upload       PDF uploaded to OpenAI Files API
2. Initialize   Three agents constructed and configured
3. Identify     Identification agent reads the PDF and returns cell line names
4. Process      For each cell line in parallel:
                  a. Curation agent extracts structured metadata
                  b. Normalisation agent maps values to controlled vocabularies
5. Validate     Pydantic validation against JSONOutputSchema
6. Save         Validated cell lines written to working/
7. Complete     Task marked as completed; progress record updated in Redis
8. Broadcast    Celery worker notifies the backend via HTTP
```

The pipeline runs as a Celery task in the background worker container. Because the pipeline is written using `asyncio`, the task bridges into it using `asyncio.run()` from the synchronous Celery execution context. Progress updates are written to Redis after each stage and relayed to the frontend over WebSocket, giving the curator a live stage-by-stage view in the Task History panel.

After the pipeline completes, each validated cell line is written to `working/`. If a working copy of the same cell line already exists (by `hpscreg_name`), it is overwritten in place rather than creating a duplicate.

### The three agents

**Identification agent** — given the full PDF, returns a list of cell line identifiers mentioned in the paper. It distinguishes newly derived cell lines from controls and references. If no cell lines are found, the pipeline stops with an error.

**Curation agent** — given the full PDF and a specific cell line name, extracts structured metadata for that cell line. Its output type is `JSONOutputSchema` (see below). A separate curation run is performed for each identified cell line. The agent only populates fields that have written instructions in `curation_instructions/llm_curation_instructions.md` — all other fields are explicitly set to `"..."` as a placeholder.

**Normalisation agent** — given the curated metadata for a single cell line and the controlled vocabulary context (`ai_assets/ASCR_ONTOLOGY.json`), maps free-text values to the exact strings defined in the controlled vocabularies. Its output type is also `JSONOutputSchema`. Normalisation runs immediately after curation for each cell line, and both stages run in parallel across all cell lines.

### Structured output schema

Both the curation and normalisation agents use `JSONOutputSchema` as their structured output type. This is the same Pydantic model defined in `data_dictionaries/models.py` that the backend uses to validate all cell line data. Using it as the output type means the OpenAI API enforces the JSON structure of the agent response — the response will always conform to the schema shape, though field values may still fail Pydantic validation (e.g. a `Literal` field containing an unrecognised value).

### Error handling

If any pipeline stage raises an exception, the task catches it, marks the task as failed in Redis, attempts to delete the uploaded PDF from OpenAI, and returns an error result. If a specific cell line fails Pydantic validation after normalisation, it is excluded from the save step while other cell lines from the same publication that passed are saved normally. Failed tasks are visible in the Task History panel and can be retried manually.

---

## Retrieve AI assets

The pipeline uses four files to configure agent behaviour. These are loaded from disk at the start of each pipeline run.

| File | Used by | Purpose |
|---|---|---|
| `services/backend/ai_assets/identification_prompt.md` | Identification agent | Instructs the agent on how to identify cell line identifiers in a paper and what format to return them in. |
| `services/backend/ai_assets/curation_prompt.md` | Curation agent | General curation instructions: task definition, input/output format, and the rule that fields without written instructions must be left as `"..."`. |
| `curation_instructions/llm_curation_instructions.md` | Curation agent | Field-level curation instructions. Lists each field the agent should curate and what to extract for it. Combined with `curation_prompt.md` at runtime. |
| `services/backend/ai_assets/normalisation_prompt.md` | Normalisation agent | Instructs the agent to map curated values to the controlled vocabulary and to flag fields it could not normalise. |

To edit a prompt, open the relevant file and modify it directly. Changes take effect immediately for new curation runs — no restart required. Tasks already queued or in progress will complete using the prompts that were loaded at the time they started.

---

## Which fields are curated

The curation agent is explicitly instructed to only populate fields that have written instructions in `curation_instructions/llm_curation_instructions.md`. For every other field in the schema, the agent inserts `"..."` as a placeholder. This means the set of curated fields is exactly the set listed in that file.

The following fields currently have curation instructions and will be populated by the AI pipeline:

| Section | Fields |
|---|---|
| CellLine | `hpscreg_name`, `cell_line_alt_name`, `cell_type`, `frozen` |
| Contact | `first_name`, `last_name` |
| Publication | `doi`, `pmid`, `first_author`, `last_author`, `journal`, `title`, `year` |
| DonorSource | `age`, `sex` |
| Disease | `name`, `description` |
| CultureMedium | `co2_concentration`, `o2_concentration`, `passage_method` |
| GenomicAlteration | `mutation_type`, `cytoband`, `delivery_method`, `description`, `genotype` |
| CharacterisationProtocolResult | `cell_type`, `show_potency`, `marker_list`, `differentiation_profile` |
| UndifferentiatedCharacterisation | `epi_pluri_score`, `pluri_test_score`, `pluri_novelty_score` |
| GenomicCharacterisation | `passage_number`, `karyotyped`, `karyotype`, `summary` |
| NonIntegratedVector | `non_int_vector_name`, `non_int_vector` |
| CellLineDerivationInducedPluripotent | `derivation_year` |
| CellLineDerivationEmbryonic | `e_preimplant_genetic_diagnosis`, `derivation_year`, `embryo_stage`, `icm_morphology`, `trophectoderm_morphology`, `zp_removal_technique` |

All other fields in the schema will be `null` after curation. A curator reviewing an AI-curated record should expect to find these fields unpopulated and complete them manually where applicable.

To add curation coverage for a new field, add an instruction row for it in `curation_instructions/llm_curation_instructions.md`. The instruction should tell the agent what to look for in the paper and what format to use.

---

## Dependencies

This module depends on the OpenAI Agents SDK (`agents` library), the `openai` Python client, `config_manager` for the API key and model selection, and `storage.py` for writing results to disk. The `TaskProgressManager` from `task_progress.py` is used throughout the task to write stage progress to Redis.

The module is initiated from `main.py` via `POST /start-ai-curation`. The Celery task runs in the separate worker container and communicates back to the FastAPI application via HTTP to broadcast completion events over WebSocket.

---

## FAQ

**How do I set the OpenAI API key?**

Via the Settings page in the admin portal. The key is stored in `services/backend/config.json`. Setting it as an environment variable has no effect — the configuration manager reads only from `config.json`.

**How do I change the model?**

Via the Settings page. The model name is stored as `SELECTED_MODEL` in `config.json`. All three agents use the same model. The default is `gpt-4.1-mini` if no model is configured.

**How do I add or edit curation instructions for a field?**

Open `curation_instructions/llm_curation_instructions.md` and add or edit the instruction row for the relevant field. Changes take effect for new curation runs immediately.

**How do I edit the agent prompts?**

Open the relevant prompt file from the table in the "Retrieve AI assets" section above and edit it directly. No restart is required.

**What happens if the same publication is submitted twice?**

If a working copy of the same cell line already exists (identified by `hpscreg_name`), the task overwrites it in place rather than creating a duplicate. Re-running curation on the same paper updates existing working copies.

**What happens to a cell line that fails Pydantic validation?**

It is excluded from the save step. The task result preserves the Pydantic error details so the curator can inspect them in the Task History panel. Other cell lines from the same publication that passed validation are saved normally.
