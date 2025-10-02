# Enum Discrepancies Between CSV Data Dictionary and Pydantic Models

## Overview
This document outlines fields that are marked as ENUM in the CSV data dictionary but are not properly defined as `Literal` types in the pydantic models. These need to be fixed to ensure proper validation and form generation.

## Critical Issues Found

### Fields Currently Missing Literal Enum Values

| Table | Field | CSV Enum Values | Current Pydantic Type | Status |
|-------|-------|----------------|---------------------|---------|
| **GenomicCharacterisation** | `karyotype_method` | `[Ag-NOR banding, C-banding, G-banding, R-banding, Q-banding, T-banding, Spectral karyotyping, Multiplex FISH, CGH, Array CGH, Molecular karyotyping by SNP array, KaryoLite BoBs, Digital karyotyping, Whole genome sequencing, Exome sequencing, Methylation profiling, Other]` | `str` | ❌ Missing |
| **GenomicCharacterisation** | `karyotype` | Not specified in CSV | `str` | ❓ Needs CSV values |
| **GenomicAlteration** | `delivery_method` | Uses ontology reference | `str` | ❓ Ontology-based |
| **Publication** | `journal` | Drop-down from NCBI + other | `str` | ❓ External source |
| **DonorSource** | `age` | `[Embryonic, Fetal, Neonate, 1-4, 5-9, 10-14, 15-19, 20-24, 25-29, 30-34, 35-39, 40-44, 45-49, 50-54, 55-59, 60-64, 65-69, 70-74, 75-79, 80-84, 85-89, 89+]` | `str` | ❌ Missing |

### Fields Already Correctly Defined

| Table | Field | Status |
|-------|-------|---------|
| **CellLine** | `status` | ✅ Correctly defined as `Literal["backup", "characterised"]` |
| **CellLine** | `genotype` | ✅ Correctly defined as `Literal["patient control", "gene-corrected"]` |
| **Group** | `type` | ✅ Correctly defined as `Literal["Manufacture", "Research", "Biobank", "Other"]` |
| **DonorSource** | `sex` | ✅ Correctly defined as `Literal["Male", "Female", "Unknown"]` |
| **MediumComponentItems** | `type` | ✅ Correctly defined as `Literal["Base Medium", "Main Protein", "Supplement", "Base Coat", "Serum"]` |
| **MicrobiologyVirologyScreening** | `hiv1`, `hiv2`, `hep_b`, `hep_c`, `mycoplasma`, `other` | ✅ Correctly defined as `Literal["Positive", "Negative", "Not done"]` |
| **GenomicAlteration** | `modification_type` | ✅ Correctly defined as `Literal["variant", "transgene expression", "Gene knock out", "Gene knock in", "isogenic modification"]` |
| **CharacterisationProtocolResult** | `cell_type` | ✅ Correctly defined as `Literal["Endoderm", "Ectoderm", "Mesoderm", "Trophectoderm"]` |
| **CharacterisationProtocolResult** | `differentiation_profile` | ✅ Correctly defined as `Literal["In vivo teratoma", "In vitro spontaneous", "In vitro directed", "hPSC Scorecard", "Other"]` |

### Fields Needing Investigation

| Table | Field | CSV Values | Issue |
|-------|-------|------------|--------|
| **HlaResults** | `group` | `[HLA Class I, HLA Class II, Non HLA Genes]` | ❌ Missing from pydantic |
| **IntegratedVector** | `int_reprogramming_vector` | `[virus, plasmid, transposon, other]` | ❌ Missing from pydantic |
| **IntegratedVector** | `int_rep_virus_type` | `[adenovirus, retrovirus, lentivirus, other]` | ❌ Missing from pydantic |
| **IntegratedVector** | `int_rep_trans_type` | `[PiggyBack transposon, Sleeping beauty, other]` | ❌ Missing from pydantic |
| **IntegratedVector** | `silenced` | `[yes, no, unknown]` | ✅ Already defined |
| **NonIntegratedVector** | `non_int_vector` | `[episomal, sendai virus, aav, other]` | ✅ Already defined |
| **NonIntegratedVector** | `detected_reprogramming_vector` | `[yes, no, unknown]` | ❌ Missing from pydantic |
| **CellLineDerivationinducedPluripotent** | `i_reprogramming_vector_type` | `[non-integrated, intergrated, none]` | ✅ Already defined |
| **VectorFreeReprogrammingGenes** | `type` | `[mrna, protein, mirna]` | ✅ Already defined |

### Embryonic Derivation Fields (CSV truncated, need full values)

| Field | Status |
|-------|---------|
| `other_hesc_source` | ❌ CSV truncated - need full enum values |
| `embryo_stage` | ❌ CSV truncated - need full enum values |
| `expansion_status` | ❌ CSV truncated - need full enum values |
| `icm_morphology` | ✅ Correctly defined |
| `trophectoderm_morphology` | ❌ Need to fix field name (has space) |
| `zp_removal_technique` | ❌ CSV truncated - need full enum values |
| `cell_isolation` | ❌ CSV truncated - need full enum values |
| `cell_seeding` | ✅ Correctly defined |

## Recommendations

### Immediate Actions Required

1. **Fix `karyotype_method` enum** - Most critical as it has complete enum values available
2. **Add missing enum values** for HLA results, integrated vector fields, and derivation fields
3. **Get complete enum values** for truncated fields in embryonic derivation
4. **Investigate ontology-based enums** for fields that reference external ontologies

### Form Impact

These missing enums affect:
- **Form validation** - Users can enter invalid values
- **UI generation** - Can't create proper dropdown/select components  
- **Database integrity** - Invalid values may be stored
- **User experience** - No guidance on valid options

### Next Steps

1. Extract complete enum values from CSV (handle truncated entries)
2. Update pydantic models with proper `Literal` type annotations
3. Regenerate forms with enum-aware field types
4. Update field_types.json to indicate which fields are enums vs free text

## Example Fix

**Current:**
```python
karyotype_method: str = Field(description="Karyotype method", max_length=100)
```

**Should be:**
```python
karyotype_method: Literal[
    "Ag-NOR banding", "C-banding", "G-banding", "R-banding", 
    "Q-banding", "T-banding", "Spectral karyotyping", "Multiplex FISH", 
    "CGH", "Array CGH", "Molecular karyotyping by SNP array", 
    "KaryoLite BoBs", "Digital karyotyping", "Whole genome sequencing", 
    "Exome sequencing", "Methylation profiling", "Other"
] = Field(description="Karyotype method")
```