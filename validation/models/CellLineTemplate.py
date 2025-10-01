from pydantic import BaseModel
from typing import List, Literal

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