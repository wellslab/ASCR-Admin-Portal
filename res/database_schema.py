from typing import List, Literal, Optional
from pydantic import BaseModel

class VectorFreeReprogrammingGenes(BaseModel):
    id: int
    VectorFreeReprogramming: int # foreign key to VectorFreeReprogramming
    Gene_Loci: int # foreign key to Loci
    Type: Literal['mrna', 'protein', 'mirna']
    allele_1: str
    allele_2: str
    

class SmallMolecule(BaseModel):
    id: int
    VectorFreeReprogramming: int # foreign key to VectorFreeReprogramming
    name: str
    chembank_id: str
    
    
class VectorFreeReprogramming(BaseModel):
    id: int
    CellLineDerivationPluripotent: int # foreign key to CellLineDerivationPluripotent
    mRNA: bool
    protein: bool
    small_molecule: bool
    miRNA: bool
    kit_name: str
    
    
class IntegratedVector(BaseModel):
    id: int
    vector_name: str
    int_reprogramming_vector: Literal['virus', 'plasmid', 'transposon', 'other']
    int_reprogramming_vector_other: str
    int_rep_virus_type: Literal['adenovirus', 'retrovirus', 'lentivirus', 'other']
    int_rep_virus_type_other: str
    int_rep_trans_type: Literal['PiggyBack transposon', 'Sleeping beauty', 'other']
    int_rep_trans_type_other: str
    excisable: bool
    silenced: Literal['yes', 'no', 'unknown']
    absence_of_reprogramming_vector: bool
    vector_silencing_notes: str
    
    
class NonIntegratedVector(BaseModel):
    id: int
    vector_name: str
    non_int_vector: Literal['episomal', 'sandai virus', 'aav', 'other']
    non_int_vector_other: str
    detected_reprogramming_vector: Literal['yes', 'no', 'unknown']
    detected_reprogramming_vector_notes: str
    
    
    
class CellLineDerivationPluripotent(BaseModel):
    id: int
    passage_number: int
    i_source_cell_type: str
    i_source_cell_origin: str
    i_source_cell_type_additional_info: str
    i_reprogramming_vector_type: Literal['non-integrated', 'integrated', 'vector-free', 'none']
    DerivationIpsIntegratedVector: int # foreign key to IntegratedVector
    DerivationIpsNonIntegratedVector: int # foreign key to  NonIntegratedVector
    vector_map_file: str # path to file
    method_used_immune_marker_staining: bool
    method_used_pcr: bool
    method_used_rtpcr: bool
    method_used_sequencing: bool
    reprogramming_expression_silence_file: str # path to file
    derivation_year: int
    reason_no_derivation_year: str
    selection_criteria_for_clones: str
    derived_under_xeno_free_conditions: bool
    derivation_under_gmp: bool
    available_as_clinical_grade: bool
    
    
class iPDGene(BaseModel):
    id: int
    CellLineDerivationPluipotent: int # foreign key to CellLineDerivationPluripotent
    Gene_Loci: int # foreign key to Loci
    allele_1: str
    allele_2: str

class Loci(BaseModel):
    id: int
    Name: str
    Group: str
    ncbi_url: str
    ebi_url: str
    associated_disease: str
    start: int
    end: int
    chromosome: str
    genome_version: str

class HLAResults(BaseModel):
    id: int
    addional_genomic_characteristation: int # foreign key to AdditionalGenomicCharacteristation
    loci: int # foreign key to Loci
    group: Literal['HLA-type-1', 'HLA-type-2', 'Non-HLA']
    allele_1: str
    allele_2: str   


class AdditionalGenomicCharacteristation(BaseModel):
    id: int
    GenomicCharacteristation: int # foreign key to GenomicCharacteristation
    hla_typing: bool
    genome_wide_or_functional_analysis: bool
    fingerprint_analysis: bool
    str_analysis: bool
    
    
    
class GenomicCharacteristation(BaseModel):
    id: int
    passage_number: int
    summary: str
    karyotype: str
    karyotype_method: Literal['G-Banding', 'Spectral', 'Comparative Genomic Hybridisation(CGH)', 'Array CGH', 'Molecular Kartotyping by SNP array', 'Karyolite BoBs']
    other_method: str
    karyogram: str # file url
    data_url: str # data url
    data_file: str # file url
    
    
class StrOrFingerprinting(BaseModel):
    id: int
    Locus: int # foreign key to Loci
    AdditionalGenomicCharacteristation: int # foreign key to AdditionalGenomicCharacteristation
    allele_1: str
    allele_2: str   
    

class CellLine(BaseModel):
    id: int
    hpscreg_name: str
    cell_line_alt_name: str
    registered_with_hpscreg: bool
    published_with_hpsreg: bool
    source: int # foreign key to CellLineSource
    genomic_characterisation: int # foreign key to GenomicCharacteristation
    pluripotency_characterisation_protocol: int # foreign key to PluripotencyCharacterisationProtocol
    undifferentiated_characterisation_protocol: int # foreign key to UndifferentiatedCharacterisationProtocol
    generator_group: int # foreign key to GeneratorGroup
    owner_group: int # foreign key to OwnerGroup
    registration_requirements: int # foreign key to RegistrationRequirements
    screening_contaminants: int # foreign key to ScreeningContaminants
    culture_medium: int # foreign key to CultureMedium
    biopsy_location: str
    cell_type: Literal['hESC', 'hiPSC']
    status: Literal['backup', 'characterised']
    genotype: Literal['patient control', 'gene-corrected']
    genotype_locus: str
    frozen: bool
    certificate_of_pluripotency_characterisation: bool
    associated_polymorphism: str
    research_use: bool
    clinical_use: bool
    commercial_use: bool    
    embargo_date: str  # Could be changed to datetime if needed
    
    
   

class Publication(BaseModel):
    id: int
    doi: str
    pmid: str
    first_author: str
    last_author: str
    journal: str
    year: int


class CellLinePublication(BaseModel):
    id: int
    Cell_Line: int  # Foreign key to CellLine
    Publication: int  # Foreign key to Publication


class Group(BaseModel):
    id: int
    Group_Institute: int  # Foreign key to Group_Institute
    name: str
    type: Literal['Manufacture', 'Research', 'Biobank', 'Other']
    contact: int  # Foreign key to Contact


class GroupInstitute(BaseModel):
    id: int
    Group_ID: int  # Foreign key to Group
    Institute_ID: int  # Foreign key to Institute 


class Contact(BaseModel):
    id: int
    e_mail: str
    phone: str  # Using str instead of numeric as phone numbers often contain special characters


class RegUser(BaseModel):
    id: int
    group: int  # Foreign key to Group
    first_name: str
    last_name: str
    password: str
    e_mail: str
    orcid_id: str

class RegistrationRequirements(BaseModel):
    id: int
    reg_user: int  # Foreign key to RegUser
    ethics: int  # Foreign key to Ethics (not shown in image)
    submitted_ethics_clearance: bool
    
    
class Institute(BaseModel):
    id: int
    name: str
    city: str
    country: str
    
    
class DonorSource(BaseModel):
    id: int
    age: int  # enum type in DB
    sex: Literal['male', 'female']
    polymorphism: str  # text - Ontology
    xref_id: str
    xref_url: str

class CellLineSource(BaseModel):
    id: int
    external_cell_line: int  # foreign key to ExternalCellLineSource
    donor: int  # foreign key to DonorSource
    aust_reg_parental_cell_line: int  # foreign key to CellLine

class DonorDisease(BaseModel):
    id: int
    donor: int  # foreign key to DonorSource
    disease: int  # foreign key to Disease
        
class Disease(BaseModel):
    id: int
    name: str
    description: str
    omim_id: str
    omim_url: str 
    icd11_url: str
    icd11_id: str

class ExternalCellLineSource(BaseModel):
    id: int
    name: str
    xref_id: str
    xref_url: str
    disease_phenotype: int # Foreign key to Disease
    tissue: str
    cell_type: str # Ontology term
    provider: str
    provider_cat_num: str
    provider_url: str
    lot_number: str
    source: int # Foreign key to CellLineSource

class Ethics(BaseModel):
    id: int
    ethics_number: str # not null
    approval_date: str # not null
    consent_form: str # file url
    consent_for_specific_research: bool
    consent_for_future_research: bool 
    consent_for_global_distribution: bool
    institutional_hrec: str


class xRefs(BaseModel):
    id: int
    cell_line_ID: int # foreign key to CellLine
    db_url: str
    xref_url: str 
    db_name: str


class GenomicAlteration(BaseModel):
    id: int
    mutation_type: Literal['variant', 'transgen expression', 'knock out', 'knock in', 'isogenic modification']
    cytoband: str
    delivery_method: str
    loci: int  # foreign key to Loci
    description: str
    genotype: str
    disease: int  # foreign key to Disease

class Synonym(BaseModel):
    id: int
    cell_line: int  # foreign key to CellLine
    synonym: str

class GenomicModification(BaseModel):
    id: int
    Cell_Line_id: int  # foreign key to CellLine
    Genomic_alteration_id: int  # foreign key to GenomicAlteration

class CultureMedium(BaseModel):
    id: int
    culture_medium_items: int  # foreign key to culture_medium_items
    co2_concentration: float
    o2_concentration: float
    passage_method: Literal['Enzymatically', 'Enzyme-free cell dissociation', 'mechanically', 'other']
    other_passage_message: str
    methods_io_id: str
    rho_kinase_used: bool
    

class MediumComponentItems(BaseModel):
    id: int
    name: str
    amount: float
    unit: str  # Note: This appears to be an enum in the DB but values aren't shown
    company: str | None  # can be NULL
    type: Literal['Base_medium', 'main protein', 'supplement', 'base coat']

class CultureMediumItems(BaseModel):
    id: int
    Culture_Medium: int  # foreign key to Culture_Medium
    Medium_commercial_item: int  # foreign key to Medium_commercial_item

class UndifferentiatedCharacterisationProtocol(BaseModel):
    id: int
    markers: str
    pluripotency_tests: Literal['EpiPluriScore', 'PluriTest', 'Morphology', 'hPSC Scorecard', 'Other']
    epi_pluri_score: int
    epi_pluri_mcpg: bool
    epi_Pluri_oct4: bool
    pluri_test_score: float
    pluri_novelty_score: float
    pluri_test_mircoarray_url: str  # url type
    hpsc_scorecard_self_renewal: bool
    hpsc_scorecard_endoderm: bool
    hpsc_scorecard_mesoderm: bool
    hpsc_scorecard_ectoderm: bool
    other: str

class MicrobiologyVirologyScreening(BaseModel):
    id: int
    performed: bool
    hiv1: Literal['pos', 'neg', 'not done']
    hiv2: Literal['pos', 'neg', 'not done']
    hep_b: Literal['pos', 'neg', 'not done']
    hep_c: Literal['pos', 'neg', 'not done']
    mycoplasma: Literal['pos', 'neg', 'not done']
    other: str

class CharacterisationProtocolResult(BaseModel):
    id: int
    cell_type: Literal['endoderm', 'mesoderm', 'ectoderm', 'trophectoderm']
    shown_potency: bool
    marker_list: str
    method: str
    differentiation_profile: Literal['in vivo teratoma', 'in vitro spontaneous differentiation', 
                                  'in vitro directed differentiation', 'scorecard', 'other']
    transcriptome_data_url: str


class PluripotencyCharacterisationProtocol(BaseModel):
    id: int
    Cell_Line_ID: int  # foreign key to Cell_Line
    Characterisation_protocol_results_ID: int  # foreign key to CharacterisationProtocolResult


class CellLineDerivationEmbryonic(BaseModel):
    id: int
    Cell_Line_id: int  # foreign key to CellLine
    e_nhmrc_licence_number: str
    e_supernumerary: bool
    separation_of_research_and_ivf_treat: bool
    other_hesc_source: Literal['Somatic Cell Nuclear Transfer (SCNT)', 'Pathogenesis', 'other']
    other_hesc_source_other: str
    e_preimplantation_genetic_diagnostic_embryo: bool
    derivation_year: int
    reason_no_derivation_year: str
    embryo_stage: Literal['Blastula with ICM and Trophoblast', 'Cleavage (Mitosis)', 'Compaction', 'Morula', 'Zygote']
    expansion_status: Literal['stage 1', 'stage 2', 'stage 3', 'stage 4', 'stage 5', 'stage 6']
    icm_morphology: Literal['type A', 'type B', 'type C', 'type D', 'type E']
    trophectoderm_morphology: Literal['type A', 'type B', 'type g']
    zp_removal_technique: Literal['chemical', 'enzymatic', 'manual', 'mechanical', 'spontaneous', 'other']
    zp_removal_tech_other: str
    cell_isolation: Literal['immunosurgery', 'laser', 'mechanical', 'trophectoderm and icm isolated', 'none', 'other']
    cell_iso_other: str
    cell_seeding: Literal['embryo', 'isolated icm', 'single cell', 'other']
    cell_seeding_other: str
    derived_under_xeno_free_conditions: bool
    derivation_under_gmp: bool
    available_as_clinical_grade: bool



class CellLineTemplate(BaseModel):
    """
    Flattened model representing the subset of fields used in the JSON export format.
    This combines data from multiple related tables into a single denormalized structure.
    """
    # CellLine fields
    CellLine_hpscreg_id: str
    CellLine_alt_names: List[str]
    CellLine_cell_line_type: Literal['hESC', 'hiPSC']
    CellLine_source_cell_type: str
    CellLine_source_tissue: str
    CellLine_source: str
    CellLine_frozen: bool
    
    # Publication fields
    CellLine_publication_doi: str
    CellLine_publication_pmid: str
    CellLine_publication_title: str
    CellLine_publication_first_author: str
    CellLine_publication_last_author: str
    CellLine_publication_journal: str
    CellLine_publication_year: int
    
    # Donor fields
    CellLine_donor_age: int
    CellLine_donor_sex: Literal['male', 'female']  # Updated to match DonorSource schema
    CellLine_donor_disease: str
    
    # Contact fields
    CellLine_contact_name: str
    CellLine_contact_email: str
    CellLine_contact_phone: str
    CellLine_maintainer: str
    CellLine_producer: str
    
    # Genomic Alteration fields
    GenomicAlteration_performed: bool
    GenomicAlteration_mutation_type: Literal['variant', 'transgen expression', 'knock out', 'knock in', 'isogenic modification']
    GenomicAlteration_cytoband: str
    GenomicAlteration_delivery_method: str
    GenomicAlteration_loci_name: str
    GenomicAlteration_loci_chromosome: str
    GenomicAlteration_loci_start: int
    GenomicAlteration_loci_end: int
    GenomicAlteration_loci_group: str
    GenomicAlteration_loci_disease: str
    GenomicAlteration_description: str
    GenomicAlteration_genotype: str
    
    # Pluripotency Characterisation fields
    PluripotencyCharacterisation_cell_type: Literal['endoderm', 'mesoderm', 'ectoderm', 'trophectoderm']
    PluripotencyCharacterisation_shown_potency: bool
    PluripotencyCharacterisation_marker_list: List[str]
    PluripotencyCharacterisation_method: str
    PluripotencyCharacterisation_differentiation_profile: Literal['in vivo teratoma', 'in vitro spontaneous differentiation', 
                                                                'in vitro directed differentiation', 'scorecard', 'other']
    
    # Reprogramming Method fields
    ReprogrammingMethod_vector_type: Literal['non-integrated', 'integrated', 'vector-free', 'none']
    ReprogrammingMethod_vector_name: str
    ReprogrammingMethod_kit: str
    ReprogrammingMethod_detected: bool
    
    # Genomic Characterisation fields
    GenomicCharacterisation_passage_number: int
    GenomicCharacterisation_karyotype: str
    GenomicCharacterisation_karyotype_method: Literal['G-Banding', 'Spectral', 'Comparative Genomic Hybridisation(CGH)', 
                                                     'Array CGH', 'Molecular Kartotyping by SNP array', 'Karyolite BoBs']
    GenomicCharacterisation_summary: str
    
    # STR Results fields
    STRResults_exists: bool
    STRResults_loci: int
    STRResults_group: Literal['HLA-type-1', 'HLA-type-2', 'Non-HLA']
    STRResults_allele_1: str
    STRResults_allele_2: str
    
    # Induced Derivation fields
    InducedDerivation_i_source_cell_type: str
    InducedDerivation_i_cell_origin: str
    InducedDerivation_derivation_year: str
    InducedDerivation_vector_type: Literal['non-integrated', 'integrated', 'vector-free', 'none']
    InducedDerivation_vector_name: str
    InducedDerivation_kit_name: str
    
    # Ethics fields (as nested structure)
    Ethics: List[dict]  # Each dict contains: ethics_number, institute, approval_date
    
    # Microbiology/Virology Screening fields
    MicrobiologyVirologyScreening_performed: bool
    MicrobiologyVirologyScreening_hiv1: Literal['pos', 'neg', 'not done']
    MicrobiologyVirologyScreening_hiv2: Literal['pos', 'neg', 'not done']
    MicrobiologyVirologyScreening_hep_b: Literal['pos', 'neg', 'not done']
    MicrobiologyVirologyScreening_hep_c: Literal['pos', 'neg', 'not done']
    MicrobiologyVirologyScreening_mycoplasma: Literal['pos', 'neg', 'not done']
    MicrobiologyVirologyScreening_other: str
    MicrobiologyVirologyScreening_other_result: str
    
    # Culture Medium fields
    CultureMedium_co2_concentration: float
    CultureMedium_o2_concentration: float
    CultureMedium_passage_method: Literal['Enzymatically', 'Enzyme-free cell dissociation', 'mechanically', 'other']
    CultureMedium_base_medium: str
    CultureMedium_base_coat: str



