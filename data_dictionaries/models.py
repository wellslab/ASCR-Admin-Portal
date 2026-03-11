# Source of truth for the ASCR cell line schema.
# Edit this file directly when the schema changes.
# Run generate_artifacts.py after editing to regenerate downstream artifacts (JSON schema, etc.).
#
# Constraints applied from the previous data dictionary where fields match.
# Fields introduced in this schema without a prior equivalent remain as Optional[str].
from __future__ import annotations

from datetime import date
from typing import List, Literal, Optional

from pydantic import BaseModel, Field, model_validator


class General(BaseModel):
    aushpscreg_name: Optional[str] = None
    hpscreg_name: Optional[str] = Field(default=None, max_length=100)
    hpscreg_synonym: List[str] = Field(default_factory=list)
    cell_line_alt_name: List[str] = Field(default_factory=list)
    curation_status: Optional[Literal[
        "Not yet reviewed by Australian Stem Cell Registry",
        "Reviewed by Australian Stem Cell Registry",
        "Reviewed and Updated by Australian Stem Cell Registry",
        "Flagged for further review",
    ]] = None
    certificate_of_pluripotency_characterisation: Optional[bool] = None
    description: Optional[str] = None
    registered_with_hpscreg: Optional[Literal[
        "Not Registered", "Registered", "To be Updated", "Cannot be Registered"
    ]] = None
    publish: Optional[bool] = None
    embargo_date: Optional[date] = None
    cell_type: Optional[Literal[
        "human embryonic stem cell (hESC)",
        "human induced pluripotent stem cell (hiPSC)",
    ]] = None
    frozen: Optional[bool] = None
    available_third_parties: Optional[str] = None
    research_use: Optional[bool] = None
    clinical_use: Optional[bool] = None
    commercial_use: Optional[bool] = None
    availability_notes: Optional[str] = None
    status: Optional[Literal["Backup", "Characterised"]] = None
    biopsy_location_name: Optional[str] = None
    biopsy_location_ontology_id: Optional[str] = None
    genotype_locus: List[str] = Field(default_factory=list)
    genotype: List[Literal["Patient Control", "Gene Corrected"]] = Field(default_factory=list)
    associated_polymorphism: List[str] = Field(default_factory=list)
    subclone_of: Optional[str] = None
    parent_of: List[str] = Field(default_factory=list)


class JSONOutputSchema(BaseModel):
    general: Optional[General] = None
    generator: Optional[ContactDetails] = None
    owner: List[ContactDetails] = Field(default_factory=list)
    distributor: List[ContactDetails] = Field(default_factory=list)
    ethics: List[Ethics] = Field(default_factory=list)
    xrefs: List[Xref] = Field(default_factory=list)
    publications: List[Publication] = Field(default_factory=list)
    genomic_alteration: List[GenomicAlteration] = Field(default_factory=list)
    genomic_characterisation: List[GenomicCharacterisation] = Field(default_factory=list)
    additional_genomic_characterisation: Optional[AdditionalGenomicCharacterisation] = None
    screening: Optional[MicrobiologyVirologyScreening] = None
    derivation_ipsc: Optional[DerivationIpsc] = None
    derivation_esc: Optional[DerivationEsc] = None
    culture_conditions: Optional[CultureConditions] = None

    @model_validator(mode='after')
    def enforce_derivation_section(self) -> 'JSONOutputSchema':
        # Null out the derivation section that doesn't match the cell line type.
        cell_type = self.general.cell_type if self.general else None
        if cell_type == "human induced pluripotent stem cell (hiPSC)":
            self.derivation_esc = None
        elif cell_type == "human embryonic stem cell (hESC)":
            self.derivation_ipsc = None
        return self
    undiff_characterisation: Optional[UndifferentiatedCharacterisation] = None
    differentiated_cell_analysis: Optional[DifferentiatedCellAnalysis] = None
    donor: Optional[Donor] = None
    external_cell_line_source: Optional[ExternalCellLineSource] = None


class Donor(BaseModel):
    age: Optional[Literal[
        "Unknown", "Embryo", "Fetal", "Neonate",
        "1-4", "5-9", "10-14", "15-19", "20-24", "25-29",
        "30-34", "35-39", "40-44", "45-49", "50-54", "55-59",
        "60-64", "65-69", "70-74", "75-79", "80-84", "85-89", "89+",
    ]] = None
    sex: Optional[Literal["Male", "Female", "Other", "Unknown"]] = None
    genomic_characterisation: List[GenomicCharacterisation] = Field(default_factory=list)
    diseases: List[Disease] = Field(default_factory=list)
    disease_phenotypes: List[str] = Field(default_factory=list)
    non_disease_phenotypes: List[str] = Field(default_factory=list)
    dcv_carrier: Optional[str] = None
    dcv_affected: Optional[str] = None
    variants: List[Variation] = Field(default_factory=list)
    xrefs: List[Xref] = Field(default_factory=list)


class ExternalCellLineSource(BaseModel):
    name: Optional[str] = Field(default=None, max_length=100)
    provider: Optional[str] = Field(default=None, max_length=500)
    provider_cat_num: Optional[str] = Field(default=None, max_length=100)
    provider_cat_url: Optional[str] = None
    lot_number: Optional[str] = Field(default=None, max_length=100)
    tissue_of_origin_name: Optional[str] = None
    tissue_ontology: Optional[str] = None
    cell_type_name: Optional[str] = None
    cell_type_ontology: Optional[str] = None
    variants: List[Variation] = Field(default_factory=list)
    xrefs: List[Xref] = Field(default_factory=list)
    diseases: List[Disease] = Field(default_factory=list)


class CultureConditions(BaseModel):
    co2_concentration: Optional[float] = None
    o2_concentration: Optional[float] = None
    rho_kinase_used: Optional[bool] = None
    rho_kinase_used_notes: Optional[str] = None
    passage_method: Optional[Literal[
        "Enzymatically", "Enzyme-free cell dissociation", "Mechanically", "Other", "Not specified",
    ]] = None
    other_passage_method: Optional[str] = Field(default=None, max_length=100)
    feeder_cells_flag: Optional[str] = None
    feeder_cell_name: Optional[str] = None
    feeder_cell_ontology_id: Optional[str] = None
    culture_medium_items: List[MediumComponentItems] = Field(default_factory=list)


class DerivationIpsc(BaseModel):
    passage_number: Optional[str] = Field(default=None, max_length=10)
    i_source_cell_type_name: Optional[str] = None
    i_source_cell_type_ontology: Optional[str] = None
    i_source_cell_type_additional_info: Optional[str] = Field(default=None, max_length=500)
    i_source_cell_origin_name: Optional[str] = None
    i_source_cell_origin_ontology: Optional[str] = None
    derivation_year: Optional[date] = None
    reason_no_derivation_year: Optional[str] = Field(default=None, max_length=500)
    derived_under_xeno_free_conditions: Optional[bool] = None
    derived_under_gmp: Optional[bool] = None
    available_as_clinical_grade: Optional[bool] = None
    i_reprogramming_vector_type: Optional[Literal[
        "Not integrated", "Integrated", "None", "Vector free",
    ]] = None
    clonal_line: Optional[str] = None
    selection_criteria_for_clones: Optional[str] = Field(default=None, max_length=500)
    integrated_vector: Optional[IntegratedVector] = None
    non_integrated_vector: Optional[NonIntegratedVector] = None
    vector_free_reprogram: Optional[VectorFreeReprogram] = None


class NonIntegratedVector(BaseModel):
    non_int_vector_type: Optional[Literal["Episomal", "Sendai Virus", "AAV", "Other"]] = None
    reprogramming_kit: Optional[KitDetails] = None
    vector_details: List[VectorDetails] = Field(default_factory=list)
    non_int_other_vector: Optional[str] = Field(default=None, max_length=500)
    vector_detection: Optional[VectorDetection] = None


class IntegratedVector(BaseModel):
    int_rep_vector_type: Optional[str] = None  # renamed from int_rep_vector; no direct enum match
    int_rep_virus_type: Optional[Literal["Adenovirus", "Retrovirus", "Lentivirus", "Other"]] = None
    int_rep_virus_other: Optional[str] = Field(default=None, max_length=100)
    int_rep_trans_type: Optional[Literal["PiggyBac", "Sleeping Beauty", "Other"]] = None
    int_rep_trans_type_other: Optional[str] = Field(default=None, max_length=100)
    int_rep_vector_other: Optional[str] = None
    reprogramming_kit: Optional[KitDetails] = None
    vector_details: List[VectorDetails] = Field(default_factory=list)
    excisable: Optional[bool] = None
    silenced: Optional[Literal["Yes", "No", "Unknown"]] = None
    vector_detection: Optional[VectorDetection] = None


class VectorFreeReprogram(BaseModel):
    genes: List[VectorFreeReprogramGenes] = Field(default_factory=list)
    kit_details: Optional[KitDetails] = None
    small_molecule_flag: Optional[bool] = None
    small_molecule_reprogramming: List[SmallMoleculeReprogram] = Field(default_factory=list)


class SmallMoleculeReprogram(BaseModel):
    small_molecule_name: Optional[str] = None
    small_molecule_chembank: Optional[str] = None
    small_molecule_ontology: Optional[str] = None


class UndifferentiatedCharacterisation(BaseModel):
    epi_pluri_test: Optional[bool] = None
    epi_pluri_score: Optional[float] = None
    epi_pluri_mcpg: Optional[bool] = None
    epi_pluri_oct4: Optional[bool] = None
    pluri_test: Optional[bool] = None
    pluri_test_score: Optional[float] = None
    pluri_novelty_score: Optional[float] = None
    pluri_test_microarray_url: Optional[str] = None
    morphology_file: Optional[str] = None
    other: Optional[str] = Field(default=None, max_length=100)
    undiff_scorecard: Optional[HpscScorecard] = None
    marker_analysis: List[MarkerAnalysis] = Field(default_factory=list)


class DifferentiatedCellAnalysis(BaseModel):
    scorecard_results: Optional[DiffScorecard] = None
    diff_germlayer: List[DiffGermlayerAnalysis] = Field(default_factory=list)
    diff_other: List[DiffOtherAnalysis] = Field(default_factory=list)


class DerivationEsc(BaseModel):
    e_nhmrc_licence_number: Optional[str] = Field(default=None, max_length=100)
    pgd_embryo: Optional[bool] = None       # was e_preimplant_genetic_diagnosis
    supernumerary: Optional[bool] = None    # was e_supernumerary
    derivation_year: Optional[date] = None
    reason_no_derivation_year: Optional[str] = Field(default=None, max_length=100)
    separation_of_research_and_ivf: Optional[bool] = None  # was separation_of_research_and_ivf_treat
    other_hesc_source: Optional[Literal[
        "Somatic Cell Nuclear Transfer (SCNT)", "Pathogenesis", "Other",
    ]] = None
    other_hesc_source_other: Optional[str] = Field(default=None, max_length=100)
    embryo_stage: Optional[Literal[
        "Blastula with ICM and Trophoblast", "Cleavage (Mitosis)", "Compaction", "Morula", "Zygot",
    ]] = None
    expansion_status: Optional[Literal[
        "Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5", "Stage 6",
    ]] = None
    icm_morphology: Optional[Literal["Type A", "Type B", "Type C", "Type D", "Type E"]] = None
    trophectoderm_morphology: Optional[Literal["Type A", "Type B", "Type G"]] = None
    zp_removal_technique: Optional[Literal[
        "Chemical", "Enzymatic", "Manual", "Mechanical", "Spontaneous", "Other",
    ]] = None
    zp_removal_technique_other: Optional[str] = Field(default=None, max_length=100)
    cell_isolation: Optional[Literal[
        "Immunosurgery", "Laser", "mechanical trophectoderm and icm isolated", "None", "Other",
    ]] = None
    cell_isolation_other: Optional[str] = Field(default=None, max_length=100)
    cell_seeding: Optional[Literal["Embryo", "Isolated ICM", "Single cell", "Other"]] = None
    cell_seeding_other: Optional[str] = Field(default=None, max_length=100)
    derived_under_gmp: Optional[bool] = None
    derived_under_xeno_free: Optional[bool] = None
    available_as_clinical_grade: Optional[bool] = None
    clonal_line: Optional[str] = None
    selection_criteria_for_clones: Optional[str] = None


class ContactDetails(BaseModel):
    institute: Optional[str] = Field(default=None, max_length=100)
    institute_ror: Optional[str] = None
    group_name: Optional[str] = Field(default=None, max_length=100)
    company_name: Optional[str] = None
    contact_first_name: Optional[str] = Field(default=None, max_length=255)
    contact_last_name: Optional[str] = Field(default=None, max_length=255)
    contact_initials: Optional[str] = Field(default=None, max_length=4)
    email: Optional[str] = None
    phone_number: Optional[str] = Field(default=None, max_length=128)
    contact_orcid: Optional[str] = None


class Ethics(BaseModel):
    submitted_ethics_clearance: Optional[Literal["Yes", "No", "Unknown"]] = None
    ethics_number: Optional[str] = Field(default=None, max_length=100)
    approval_date: Optional[date] = None
    institutional_HREC: Optional[str] = Field(default=None, max_length=500)
    consent_form: Optional[str] = None
    consent_for_specific_research: Optional[bool] = None
    consent_for_future_research: Optional[bool] = None
    consent_for_global_distribution: Optional[bool] = None


class Xref(BaseModel):
    xref_id: Optional[str] = Field(default=None, max_length=100)
    db_name: Optional[str] = Field(default=None, max_length=100)
    db_url: Optional[str] = None
    xref_url: Optional[str] = None


class Publication(BaseModel):
    doi: Optional[str] = None
    pmid: Optional[str] = Field(default=None, max_length=100)
    first_author: Optional[str] = Field(default=None, max_length=100)
    last_author: Optional[str] = Field(default=None, max_length=100)
    journal: Optional[str] = Field(default=None, max_length=150)
    title: Optional[str] = Field(default=None, max_length=255)
    year: Optional[int] = None


class GenomicAlteration(BaseModel):
    alteration_type: Optional[str] = None  # renamed from mutation_type; enum may be added later
    isogenic_purpose: Optional[str] = None
    summary: Optional[str] = None
    delivery_method: Optional[str] = Field(default=None, max_length=500)
    variation_details: Optional[Variation] = None


class Variation(BaseModel):
    zygosity: Optional[str] = None
    gene: Optional[Loci] = None
    cytoband: Optional[str] = Field(default=None, max_length=100)
    genotype: Optional[str] = Field(default=None, max_length=500)
    genomic_coord: Optional[str] = None
    coding_coord: Optional[str] = None
    rna_coord: Optional[str] = None
    protein_coord: Optional[str] = None
    summary: Optional[str] = None
    xrefs: List[Xref] = Field(default_factory=list)
    disease: List[Disease] = Field(default_factory=list)


class Disease(BaseModel):
    name: Optional[str] = Field(default=None, max_length=100)
    free_text: Optional[str] = None
    omim_url: Optional[str] = None
    omim_id: Optional[str] = Field(default=None, max_length=100)
    icd11_url: Optional[str] = None
    icd11_id: Optional[str] = Field(default=None, max_length=100)
    ontology_id: Optional[str] = None


class GenomicCharacterisation(BaseModel):
    passage_number: Optional[str] = Field(default=None, max_length=10)
    karyotyped: Optional[Literal["YES", "NO", "UNKNOWN"]] = None
    karyotype: Optional[str] = Field(default=None, max_length=100)
    karyotype_method: Optional[Literal[
        "G-banding",
        "Q-banding",
        "Spectral Karyotyping",
        "Comparative genomic hybridisation",
        "Array comparative genomic hybridisation",
        "Molecular karyotyping by SNP array",
        "Karyolite BoBs",
        "Exome sequencing",
        "Methylation profiling",
        "Other",
    ]] = None
    karyotype_method_other: Optional[str] = Field(default=None, max_length=100)
    summary: Optional[str] = Field(default=None, max_length=1500)
    karyogram: Optional[str] = None
    data_url: Optional[str] = None
    data_file: Optional[str] = None


class MediumComponentItems(BaseModel):
    name: Optional[str] = Field(default=None, max_length=100)
    amount: Optional[str] = Field(default=None, max_length=20)
    unit: Optional[Literal[
        "Percent",
        "Milliliter",
        "Microliter",
        "Millimolar",
        "Micromolar",
        "Milligram per milliliter",
        "Microgram per milliliter",
        "Nanogram per milliliter",
        "Nanomolar",
        "Unit per milliliter",
        "Unit",
    ]] = None
    company: Optional[str] = Field(default=None, max_length=100)
    type: Optional[Literal["Base Medium", "Main Protein", "Supplement", "Base Coat", "Serum"]] = None


class MicrobiologyVirologyScreening(BaseModel):
    performed: Optional[bool] = None
    hiv1: Optional[Literal["Positive", "Negative", "Not Done"]] = None
    hiv2: Optional[Literal["Positive", "Negative", "Not Done"]] = None
    hep_b: Optional[Literal["Positive", "Negative", "Not Done"]] = None
    hep_c: Optional[Literal["Positive", "Negative", "Not Done"]] = None
    mycoplasma: Optional[Literal["Positive", "Negative", "Not Done"]] = None
    other: Optional[str] = Field(default=None, max_length=100)
    other_result: Optional[Literal["Positive", "Negative", "Not Done"]] = None


class AdditionalGenomicCharacterisation(BaseModel):
    hla_typing_flag: Optional[bool] = None
    hla_results: List[HlaResult] = Field(default_factory=list)
    str_analysis_flag: Optional[bool] = None
    str_results: List[StrOrFingerprinting] = Field(default_factory=list)
    fingerprinting_analysis_flag: Optional[bool] = None
    fingerprinting_analysis_results: List[StrOrFingerprinting] = Field(default_factory=list)
    genome_wide_or_functional_data: Optional[bool] = None
    summary: Optional[str] = None


class HlaResult(BaseModel):
    loci_group: Optional[Literal["HLA Class I", "HLA Class II", "Non HLA Genes"]] = None
    locus_name: Optional[Loci] = None
    allele_1: Optional[str] = Field(default=None, max_length=100)
    allele_2: Optional[str] = Field(default=None, max_length=100)


class StrOrFingerprinting(BaseModel):
    loci_name: Optional[Loci] = None
    allele_1: Optional[str] = Field(default=None, max_length=100)
    allele_2: Optional[str] = Field(default=None, max_length=100)


class HpscScorecard(BaseModel):
    self_renewal: Optional[bool] = None
    endoderm: Optional[bool] = None
    mesoderm: Optional[bool] = None
    ectoderm: Optional[bool] = None
    scorecard_file: Optional[str] = None


class MarkerAnalysis(BaseModel):
    marker_name: Optional[Loci] = None
    result_file: Optional[str] = None
    method_name: Optional[str] = None
    free_text: Optional[str] = None


class DiffScorecard(BaseModel):
    s_card_diff_protocol: Optional[str] = None
    diff_scorecard: Optional[HpscScorecard] = None


class DiffGermlayerAnalysis(BaseModel):
    gl_diff_protocol: Optional[str] = None
    germ_layer: Optional[Literal["Endoderm", "Ectoderm", "Mesoderm", "Trophectoderm"]] = None
    show_potency: Optional[bool] = None
    marker_analysis: List[MarkerAnalysis] = Field(default_factory=list)


class DiffOtherAnalysis(BaseModel):
    do_diff_protocol: Optional[str] = None
    end_cell_type_name: Optional[str] = None
    end_cell_type_ontology_id: Optional[str] = None
    marker_analysis: List[MarkerAnalysis] = Field(default_factory=list)
    publication: Optional[Publication] = None


class KitDetails(BaseModel):
    name: Optional[str] = None
    supplier: Optional[str] = None
    cat_no: Optional[str] = None
    file: Optional[str] = None
    notes: Optional[str] = None
    gene: List[Loci] = Field(default_factory=list)


class VectorDetails(BaseModel):
    name: Optional[str] = None
    supplier: Optional[str] = None
    cat_no: Optional[str] = None
    file: Optional[str] = None
    notes: Optional[str] = None
    gene: List[Loci] = Field(default_factory=list)


class Loci(BaseModel):
    name: Optional[str] = Field(default=None, max_length=100)
    chromosome: Optional[str] = Field(default=None, max_length=100)
    start: Optional[int] = None
    end: Optional[int] = None
    group: Optional[str] = Field(default=None, max_length=100)
    ncbi_id: Optional[str] = None
    ncbi_url: Optional[str] = None
    ebi_id: Optional[str] = None
    ebi_url: Optional[str] = None
    ensg_id: Optional[str] = None
    ensg_url: Optional[str] = None


class VectorDetection(BaseModel):
    detected_reprogramming_vector: Optional[Literal["Yes", "No", "Unknown"]] = None
    method_used_immune_marker_staining: Optional[bool] = None
    method_used_pcr: Optional[bool] = None
    method_used_rtpcr: Optional[bool] = None
    method_used_seq: Optional[bool] = None
    detected_vector_notes: Optional[str] = Field(default=None, max_length=500)
    reprogramming_expression_silence_file: Optional[str] = None


class VectorFreeReprogramGenes(BaseModel):
    type: Optional[Literal["mRNA", "Protein"]] = None
    loci_name: Optional[Loci] = None
    allele_1: Optional[str] = Field(default=None, max_length=100)
    allele_2: Optional[str] = Field(default=None, max_length=100)


# model_rebuild() calls are required because of forward references (from __future__ import annotations)
General.model_rebuild()
JSONOutputSchema.model_rebuild()
Donor.model_rebuild()
ExternalCellLineSource.model_rebuild()
CultureConditions.model_rebuild()
DerivationIpsc.model_rebuild()
NonIntegratedVector.model_rebuild()
IntegratedVector.model_rebuild()
VectorFreeReprogram.model_rebuild()
SmallMoleculeReprogram.model_rebuild()
UndifferentiatedCharacterisation.model_rebuild()
DifferentiatedCellAnalysis.model_rebuild()
DerivationEsc.model_rebuild()
ContactDetails.model_rebuild()
Ethics.model_rebuild()
Xref.model_rebuild()
Publication.model_rebuild()
GenomicAlteration.model_rebuild()
Variation.model_rebuild()
Disease.model_rebuild()
GenomicCharacterisation.model_rebuild()
MediumComponentItems.model_rebuild()
MicrobiologyVirologyScreening.model_rebuild()
AdditionalGenomicCharacterisation.model_rebuild()
HlaResult.model_rebuild()
StrOrFingerprinting.model_rebuild()
HpscScorecard.model_rebuild()
MarkerAnalysis.model_rebuild()
DiffScorecard.model_rebuild()
DiffGermlayerAnalysis.model_rebuild()
DiffOtherAnalysis.model_rebuild()
KitDetails.model_rebuild()
VectorDetails.model_rebuild()
Loci.model_rebuild()
VectorDetection.model_rebuild()
VectorFreeReprogramGenes.model_rebuild()
