"""
Pydantic models for Stem Cell Registry Data Dictionary
Generated from data_dictionary.yaml
"""

from pydantic import BaseModel, Field, field_validator, HttpUrl
from typing import Optional, List
from datetime import date
from enum import Enum

# Enums for constrained values
class CellLineTypeEnum(str, Enum):
    IPSC = "iPSC"
    ESC = "ESC"

class GenotypeEnum(str, Enum):
    PATIENT_CONTROL = "patient control"
    GENE_CORRECTED = "gene-corrected"

class ReprogrammingVectorEnum(str, Enum):
    SENDAI_VIRUS = "Sendai virus"
    EPISOMAL = "Episomal"
    LENTIVIRAL = "Lentiviral"
    RETROVIRAL = "Retroviral"
    MRNA = "mRNA"
    MIRNA = "miRNA"
    PROTEIN = "Protein"

class StatusEnum(str, Enum):
    BACKUP = "backup"
    CHARACTERISED = "characterised"

class SexEnum(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    UNKNOWN = "Unknown"

class AgeEnum(str, Enum):
    EMBRYONIC = "Embryonic"
    FETAL = "Fetal"
    NEONATE = "Neonate"
    AGE_1_4 = "1-4"
    AGE_5_9 = "5-9"
    AGE_10_14 = "10-14"
    AGE_15_19 = "15-19"
    AGE_20_24 = "20-24"
    AGE_25_29 = "25-29"
    AGE_30_34 = "30-34"
    AGE_35_39 = "35-39"
    AGE_40_44 = "40-44"
    AGE_45_49 = "45-49"
    AGE_50_54 = "50-54"
    AGE_55_59 = "55-59"
    AGE_60_64 = "60-64"
    AGE_65_69 = "65-69"
    AGE_70_74 = "70-74"
    AGE_75_79 = "75-79"
    AGE_80_84 = "80-84"
    AGE_85_89 = "85-89"
    AGE_89_PLUS = "89+"

class KaryotypeEnum(str, Enum):
    NORMAL = "normal"
    ABNORMAL = "abnormal"
    MOSAIC = "mosaic"
    COMPLEX = "complex"
    NOT_AVAILABLE = "not available"

class GroupTypeEnum(str, Enum):
    MANUFACTURE = "Manufacture"
    RESEARCH = "Research"
    BIOBANK = "Biobank"
    OTHER = "Other"

class MutationTypeEnum(str, Enum):
    VARIANT = "variant"
    TRANSGEN_EXPRESSION = "transgen expression"
    KNOCK_OUT = "knock out"
    KNOCK_IN = "knock in"
    ISOGENIC_MODIFICATION = "isogenic modification"

class CellLayerEnum(str, Enum):
    ENDODERM = "Endoderm"
    ECTODERM = "Ectoderm"
    MESODERM = "Mesoderm"
    TROPHECTODERM = "Trophectoderm"

class ScreeningResultEnum(str, Enum):
    POSITIVE = "Positive"
    NEGATIVE = "Negative"
    NOT_DONE = "Not done"

class HLATypeEnum(str, Enum):
    HLA_TYPE_1 = "HLA-type-1"
    HLA_TYPE_2 = "HLA-type-2"
    NON_HLA = "Non-HLA"

# Base models
class AdditionalGenomicCharacterisation(BaseModel):
    """Additional Genomic Characterisation model"""
    additionalgenomiccharacterisation_id: int = Field(..., description="Additional Genomic Characterisation ID")
    fingerprint_analysis: bool = Field(..., description="Fingerprint analysis typing done")
    genome_wide_or_functional_analysis: bool = Field(..., description="GWAS analysis done")
    genomiccharacterisation_id: int = Field(..., description="Genomic Characterisation ID")
    hla_typing: Optional[bool] = Field(None, description="HLA typing done")
    str_analysis: bool = Field(..., description="STR analysis done")

class CellLine(BaseModel):
    """Main Cell Line model"""
    cell_line_id: str = Field(..., description="Aus stem cell registry ID")
    associated_polymorphism: str = Field(..., description="Polymorphism associated with the cell line")
    biopsy_location: str = Field(..., description="Biopsy location of the source tissue")
    cell_line_alt_name: str = Field(..., description="Alternate name for the cell line")
    cell_type: Optional[CellTypeEnum] = Field(None, description="Type of cell line")
    certificate_of_pluripotency_characterisation: Optional[bool] = Field(None, description="Whether certificate is issued or not")
    clinical_use: bool = Field(..., description="Cell line's availability for clinical usage purpose")
    commercial_use: bool = Field(..., description="Cell line's availability for commercial usage purpose")
    culture_medium: Optional[int] = Field(None, description="Culture medium ID of the cell line if there any")
    donor_source: int = Field(..., description="ID of the source donor from which the line was generated")
    embargo_date: Optional[date] = Field(None, description="If there is an embargo date")
    frozen: Optional[bool] = Field(None, description="If the cell line was frozen")
    generator_group: int = Field(..., description="ID of the group which the institution belongs to")
    genomic_characterisation: Optional[int] = Field(None, description="ID of the genomic characterisation associated with the cell line")
    genomic_modifications: Optional[int] = Field(None, description="Genomic modification ID of the cell line if there any")
    genotype: Optional[GenotypeEnum] = Field(None, description="Genotype type of the cell line")
    genotype_locus: Optional[str] = Field(None, description="Genotype locus of the cell line")
    hpscreg_name: str = Field(..., description="hPSCReg's generated cell line name on registration")
    owner_group: int = Field(..., description="ID of the group which the institution belongs to")
    pluripotency_characterisation_protocol: Optional[int] = Field(None, description="ID of the pluripotency characterisation protocol associated with the cell line")
    publish: bool = Field(..., description="Whether the line can be published or not")
    registered_with_hpscreg: bool = Field(..., description="ID of the registration requirements")
    registration_requirements: int = Field(..., description="ID of the registration details")
    reprogramming_vector: ReprogrammingVectorEnum = Field(..., description="Reprogramming vector name used for the cell line")
    research_use: bool = Field(..., description="Cell line's availability for research usage purpose")
    screening_contaminants: Optional[int] = Field(None, description="ID of Microbiology Virology Screening performed on the line if there any")
    source: int = Field(..., description="Cell line source")
    status: Optional[StatusEnum] = Field(None, description="Status of the cell line")
    undifferentiated_charactarisation_protocol: Optional[int] = Field(None, description="ID of the protocol for undifferentiated characterisation")


class CellLineDerivationEmbryonic(BaseModel):
    """Cell Line Derivation Embryonic model"""
    celllinederivationembryonic_id: int = Field(..., description="ID for record")
    Cell_line_id: int = Field(..., description="Cell line ID")
    available_as_clinical_grade: bool = Field(..., description="Indicates if the resulting cell line is available as clinical-grade")
    cell_isolation: str = Field(..., description="Method used to isolate ICM or other cells")
    cell_isolation_other: str = Field(..., description="Free-text entry for other method used to isolate ICM or other cells")
    cell_seeding: str = Field(..., description="Technique used to plate cells post-isolation")
    cell_seeding_other: str = Field(..., description="Free-text entry for other technique used to plate cells post-isolation")
    derivation_under_gmp: bool = Field(..., description="Indicates whether derivation followed Good Manufacturing Practice")
    derivation_year: int = Field(..., description="Year in which derivation of the hESC line was performed")
    derived_under_xeno_free_conditions: bool = Field(..., description="Indicates whether the derivation was performed without animal products")
    e_nhmrc_licence_number: str = Field(..., description="NHMRC License number")
    e_preimplantation_genetic_diagnostic_embryo: bool = Field(..., description="Indicates whether the embryo was created as part of PGD")
    e_supernumerary: bool = Field(..., description="Indicates whether the embryo used was a supernumerary embryo")
    embryo_stage: str = Field(..., description="Developmental stage of the embryo at the time of derivation")
    expansion_status: str = Field(..., description="Indicates whether the cell line has undergone expansion")
    icm_morphology: str = Field(..., description="Morphological quality of the inner cell mass (ICM) used in derivation")
    other_hesc_source: str = Field(..., description="Indicates if the hESC line was derived from a source other than supernumerary IVF embryos")
    other_hesc_source_other: str = Field(..., description="Description of other source")
    reason_no_derivation_year: str = Field(..., description="Explain if year is unknown")
    seperation_of_research_and_ivf_treat: bool = Field(..., description="Describes whether IVF treatment and research decision-making processes were clearly separated")
    trophectoderm_morphology: str = Field(..., description="Morphology of the trophectoderm layer at the time of derivation")
    zp_removal_technique: str = Field(..., description="Technique used to remove the zona pellucida (ZP)")
    zp_removal_technique_other: str = Field(..., description="Free-text entry for other techniques to remove ZP")


class CellLineDerivedInducedPluripotent(BaseModel):
    """Cell Line Derived Induced Pluripotent model"""
    celllinederivedinducedpluripotent_id: int = Field(..., description="ID for record")
    available_as_clinical_grade: bool = Field(..., description="Indicates if the resulting cell line is available as clinical-grade")
    cell_line_id: int = Field(..., description="Aus stem cell registry ID")
    derivation_under_gmp: bool = Field(..., description="Indicates whether derivation followed Good Manufacturing Practice")
    derivation_year: int = Field(..., description="Year in which derivation of the hESC line was performed")
    derivationipsintegratedvector_id: int = Field(..., description="derivationipsintegratedvector_id")
    derived_under_xeno_free_conditions: bool = Field(..., description="Indicates whether the derivation was performed without animal products")
    i_reprogramming_vector_type: str = Field(..., description="Type of vector used for reprogramming")
    i_source_cell_origin: str = Field(..., description="Tissue or organ of origin of the source cell")
    i_source_cell_type: str = Field(..., description="Cell type used for reprogramming")
    i_source_cell_type_additional_info: str = Field(..., description="Free-text entry for additional information about source cell type")
    method_used_immune_marker_staining: bool = Field(..., description="Indicates whether immunostaining of pluripotency markers is done")
    method_used_pcr: bool = Field(..., description="Indicates whether PCR-based detection of reprogramming is done")
    method_used_rtpcr: bool = Field(..., description="Indicates whether reverse transcriptase PCR method is used")
    method_used_seq: bool = Field(..., description="Indicates whether sequencing is done")
    passage_number: int = Field(..., description="Passage number")
    reason_no_derivation_year: str = Field(..., description="Explain if year is unknown")
    reprogramming_expression_silence_file: str = Field(..., description="File showing reprogramming expression")
    selection_criteria_for_clones: str = Field(..., description="Description of how iPSC clones were selected")
    vector_map_file: str = Field(..., description="Vector plasmid map")


class CellLineSource(BaseModel):
    """Cell Line Source model"""
    source_id: str = Field(..., description="Unique id of cell line source")
    cell_line_source_id: str = Field(..., description="Cell line source id")
    aust_reg_parental_cell_line: Optional[str] = Field(None, description="ID of parental cell line")
    donor_id: Optional[str] = Field(None, description="ID of stem cell line donor")


class CellLinePublication(BaseModel):
    """Cell Line Publication model"""
    cell_line_publication_id: int = Field(..., description="Cell line publication id")
    cell_line_id: int = Field(..., description="Cell line id")
    publication_id: int = Field(..., description="Publication id")


class CharacterisationMethod(BaseModel):
    """Characterisation Method model"""
    characterisation_method_id: int = Field(..., description="Characterisation method ID")
    name: Optional[str] = Field(None, description="Characterisation method name")


class CharacterisationProtocolResult(BaseModel):
    """Characterisation Protocol Result model"""
    characterisationprotocolresult_id: int = Field(..., description="ID for Record")
    cell_line_id: int = Field(..., description="Aus stem cell registry ID")
    cell_type: CellLayerEnum = Field(..., description="Type of the germ layer")
    characterisation_method: Optional[str] = Field(None, description="Characterisation method")
    differentiation_profile: Optional[str] = Field(None, description="Differentiation profile")
    marker_list: Optional[str] = Field(None, description="List of markers shown")
    method_file: Optional[HttpUrl] = Field(None, description="File path or url to the characterisation protocol method")
    morphology_url: Optional[HttpUrl] = Field(None, description="URL to dataset showing cell morphology")
    show_potency: bool = Field(..., description="Indicates whether the characterisation shows potency or not")
    transcriptome_data_url: Optional[HttpUrl] = Field(None, description="Link to the raw transcriptome data")


class Contact(BaseModel):
    """Contact model"""
    contact: int = Field(..., description="Contact ID")
    e_mail: str = Field(..., description="Email of the contact")
    phone_number: int = Field(..., description="Phone of the contact")

    @field_validator('e_mail')
    @classmethod
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v


class CultureMedium(BaseModel):
    """Culture Medium model"""
    culturemedium_id: int = Field(..., description="ID for culture medium")
    co2_concentration: str = Field(..., description="CO2 concentration")
    culture_medium_items: str = Field(..., description="Components for culture medium")
    o2_concentration: str = Field(..., description="O2 Concentration")
    other_passage_message: Optional[str] = Field(None, description="Other cell passage method")
    passage_method: str = Field(..., description="Method used for cell passage")


class CultureMediumItems(BaseModel):
    """Culture Medium Items model"""
    culture_medium_items_id: int = Field(..., description="Culture medium items id")
    culture_medium_items: str = Field(..., description="Id for culture medium")
    medium_commercial_item: str = Field(..., description="Id for medium commercial items")


class Disease(BaseModel):
    """Disease model"""
    disease_id: int = Field(..., description="Disease ID")
    description: Optional[str] = Field(None, description="Disease description")
    icd11_id: Optional[str] = Field(None, description="OMIN ID")
    icd11_url: Optional[HttpUrl] = Field(None, description="ICD11 entry url")
    mondo_onto_id: str = Field(..., description="Mondo ID for the disease")
    name: str = Field(..., description="Disease name")
    omim_id: Optional[str] = Field(None, description="OMIM ID")
    omin_url: Optional[HttpUrl] = Field(None, description="OMIM entry url")


class DonorDisease(BaseModel):
    """Donor Disease model"""
    donor_disease_id: int = Field(..., description="Donor disease ID")
    disease_id: int = Field(..., description="Disease ID")
    donor_id: int = Field(..., description="Donor ID")


class DonorSource(BaseModel):
    """Donor Source model"""
    donor_source_id: int = Field(..., description="Donor source ID")
    age: Optional[AgeEnum] = Field(None, description="Age of the donor")
    disease_phenotype: Optional[str] = Field(None, description="Phenotype associated with the disease diagnosed for the donor")
    polymorphism: Optional[str] = Field(None, description="Polymorphism associated with the donor")
    sex: SexEnum = Field(..., description="Genetic sex of the donor")


class Ethics(BaseModel):
    """Ethics model"""
    approval_date: date = Field(..., description="Date of ethics approval")
    consent_form: Optional[str] = Field(None, description="Template of donor consent form acquired by cell line generator")
    ethics_number: int = Field(..., description="Ethics number associated with the cell line")


class ExternalCellLineSource(BaseModel):
    """External Cell Line Source model"""
    external_cell_line_id: str = Field(..., description="External cell line source id")
    cell_type: str = Field(..., description="Cell type")
    disease_phenotype: str = Field(..., description="Disease phenotype")
    name: str = Field(..., description="Name of external cell line source")
    provider: str = Field(..., description="Provider")
    tissue: str = Field(..., description="Tissue")
    xref_id: str = Field(..., description="Cross-reference ID")
    xref_url: HttpUrl = Field(..., description="Cross-reference URL")


class GenomicModification(BaseModel):
    """Genomic Modification model"""
    genomic_modification_id: int = Field(..., description="Genomic modification ID")
    cell_line_id: int = Field(..., description="Aus stem cell registry ID")
    genomic_alteration_id: int = Field(..., description="Genomic alteration ID")


class GenomicAlteration(BaseModel):
    """Genomic Alteration model"""
    genomic_alteration_id: int = Field(..., description="Genomic alteration ID")
    cytoband: str = Field(..., description="Location of Chromosome/cytoband")
    delivery_method: str = Field(..., description="Delivery method of genomic alteration")
    description: str = Field(..., description="Any other description - NCBI or EBI id - HUGO")
    disease_name: Optional[str] = Field(None, description="Name of disease associated with the gene modification")
    genotype: str = Field(..., description="Genotype")
    loci: str = Field(..., description="Loci of genomic alteration")
    mutation_type: MutationTypeEnum = Field(..., description="Type of genomic alteration")


class GenomicCharacterisation(BaseModel):
    """Genomic Characterisation model"""
    genomiccharacterisation_id: int = Field(..., description="Genomic Characterisation ID")
    data_file: Optional[HttpUrl] = Field(None, description="File url")
    data_url: Optional[HttpUrl] = Field(None, description="Data url")
    karyogram: Optional[HttpUrl] = Field(None, description="Karyogram url file")
    karyotype: KaryotypeEnum = Field(..., description="Karyotype")
    karyotype_method: str = Field(..., description="Karyotype method")
    other_method: Optional[str] = Field(None, description="Other Karyotype method")
    passage_number: int = Field(..., description="Passage number")


class Group(BaseModel):
    """Group model"""
    group_id: int = Field(..., description="Group ID")
    contact: int = Field(..., description="Contact ID of the group")
    name: str = Field(..., description="Name of the group")
    type: GroupTypeEnum = Field(..., description="Type of the group")


class GroupInstitute(BaseModel):
    """Group Institute model"""
    group_id: int = Field(..., description="ID of the group")
    institute_id: int = Field(..., description="ID of the institute associated with this group")


class HlaResults(BaseModel):
    """HLA Results model"""
    hlaresults_id: int = Field(..., description="HLA Results ID")
    additionalgenomiccharacterisation_id: int = Field(..., description="Additional Genomic Characterisation ID")
    group: Optional[HLATypeEnum] = Field(None, description="HLA type")
    hlaallele_1: Optional[str] = Field(None, description="First HLA Allele")
    hlaallele_2: Optional[str] = Field(None, description="Second HLA Allele")
    loci_id: int = Field(..., description="Loci ID")


class IPDGene(BaseModel):
    """IPD Gene model"""
    ipdgene_id: int = Field(..., description="IPD Gene ID")
    allele_1: str = Field(..., description="First allele observed at gene locus")
    allele_2: str = Field(..., description="Second allele observed at gene locus")
    celllinederivedinducedpluripotent_id: int = Field(..., description="iPSC ID")
    loci_id: Optional[int] = Field(None, description="Loci ID")


class Institute(BaseModel):
    """Institute model"""
    institute_id: int = Field(..., description="Institute ID")
    city: str = Field(..., description="City name of institution that registered/generated the cell line")
    country: str = Field(..., description="Country name of institution that registered/generated the cell line")
    name: str = Field(..., description="Name of institution that registered/generated the cell line")


class IntegratedVector(BaseModel):
    """Integrated Vector model"""
    derivationipsintegratedvector_id: int = Field(..., description="ID for record")
    absence_of_reprogramming_vector: bool = Field(..., description="Indicates whether the reprogramming vector is absent")
    excisable: bool = Field(..., description="Indicates whether the integrating vector is designed to be excisable")
    int_rep_trans_type: Optional[str] = Field(None, description="System used to deliver the vector")
    int_rep_trans_type_other: Optional[str] = Field(None, description="Free-text to capture other types of system used to deliver the vector")
    int_rep_virus_type: Optional[str] = Field(None, description="Specify virus type if the vector is viral")
    int_rep_virus_type_other: Optional[str] = Field(None, description="Free-text to capture other type of virus type")
    int_reprogramming_vector: Optional[str] = Field(None, description="Type of integrating reprogramming vector")
    int_reprogramming_vector_other: Optional[str] = Field(None, description="Free-text to capture other type of integrating reprogramming vector")
    silenced: Optional[str] = Field(None, description="Indicates whether the gene expression has been silenced")
    vector_silencing_notes: Optional[str] = Field(None, description="Free-text field for additional information on silencing")


class Loci(BaseModel):
    """Loci model"""
    loci_id: Optional[int] = Field(None, description="Loci ID")
    associated_disease: Optional[HttpUrl] = Field(None, description="Disease associated with loci")
    chromosome: Optional[int] = Field(None, description="Chromosome location")
    ebi_url: Optional[HttpUrl] = Field(None, description="Link to EBI/Ensembl entry")
    end: Optional[int] = Field(None, description="End position")
    genome_version: Optional[str] = Field(None, description="Genome version")
    group: Optional[str] = Field(None, description="Loci group")
    name: Optional[str] = Field(None, description="Loci name")
    ncbi_url: Optional[HttpUrl] = Field(None, description="Link to NCBI entry")
    start: Optional[int] = Field(None, description="Start position")


class MediumComponentItems(BaseModel):
    """Medium Component Items model"""
    medium_component_items: int = Field(..., description="Medium id")
    amount: Optional[float] = Field(None, description="The number of the unit")
    company: Optional[str] = Field(None, description="Name of company")
    name: str = Field(..., description="Name of item")
    type: Optional[str] = Field(None, description="Type of medium commercial items")
    unit: Optional[str] = Field(None, description="Units for materials")


class MicrobiologyVirologyScreening(BaseModel):
    """Microbiology Virology Screening model"""
    screening_id: int = Field(..., description="ID of screening information")
    hep_b: Optional[ScreeningResultEnum] = Field(None, description="Whether perform Hep B test and if result is available")
    hep_c: Optional[ScreeningResultEnum] = Field(None, description="Whether perform Hep C test and if result is available")
    hiv1: Optional[ScreeningResultEnum] = Field(None, description="Whether perform HIV1 test and if result is available")
    hiv2: Optional[ScreeningResultEnum] = Field(None, description="Whether perform HIV2 test and if result is available")
    mycoplasma: Optional[ScreeningResultEnum] = Field(None, description="Whether perform Mycoplasma test and if result is available")
    other: ScreeningResultEnum = Field(..., description="Other test performed if there any")
    performed: Optional[bool] = Field(None, description="Whether the Microbiology_Virology_Screening was performed")


class NonIntegratedVector(BaseModel):
    """Non Integrated Vector model"""
    derivationipsintegratedvector_id: int = Field(..., description="ID for record")
    detected_reprogramming_vector: Optional[str] = Field(None, description="Indicates whether any reprogramming vectors were detected")
    detected_reprogramming_vector_notes: Optional[str] = Field(None, description="Notes on how vector detection was performed")
    non_int_vector: str = Field(..., description="Name or type of non-integrating vector")
    non_int_vector_other: Optional[str] = Field(None, description="Free-text to capture other type of non-integrating vector")


class Publication(BaseModel):
    """Publication model"""
    publication_id: int = Field(..., description="Local identifier for publications")
    doi: HttpUrl = Field(..., description="DOI ID of the publication")
    first_author: Optional[str] = Field(None, description="Name of first author")
    journal: Optional[str] = Field(None, description="Journal name")
    last_author: Optional[str] = Field(None, description="Name of last author")
    pmid: Optional[str] = Field(None, description="PubMed ID of the publication")
    year: Optional[date] = Field(None, description="Year of publication")


class RegUser(BaseModel):
    """Registered User model"""
    user_id: int = Field(..., description="User ID who registered the cell line")
    email: str = Field(..., description="Email of the user")
    first_name: str = Field(..., description="First name of the user")
    last_name: str = Field(..., description="Last name of the user")
    group_id: int = Field(..., description="Group ID from which the user belongs to")
    orcid_id: int = Field(..., description="ORCID ID of the user")

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v


class RegistrationRequirements(BaseModel):
    """Registration Requirements model"""
    ethics: int = Field(..., description="Ethics ID associated with the cell line")
    reg_user: int = Field(..., description="User ID who registered the cell line")
    submitted_ethics_clearance: bool = Field(..., description="Whether ethics clearance has been submitted")


class SmallMolecule(BaseModel):
    """Small Molecule model"""
    smallmolecule_id: int = Field(..., description="Small molecule ID")
    chembank_id: HttpUrl = Field(..., description="Chembank database id for the small molecule")
    name: str = Field(..., description="Small molecule name")
    vectorfreeprogramming_id: int = Field(..., description="Vector-free reprogramming ID")


class StrOrFingerprinting(BaseModel):
    """STR or Fingerprinting model"""
    id: int = Field(..., description="StrOrFingerprinting ID")
    additionalgenomiccharacterisation_id: int = Field(..., description="Additional Genomic Characterisation ID")
    loci_id: int = Field(..., description="Loci ID")
    strallele_1: Optional[str] = Field(None, description="First STR allele at a given locus")
    strallele_2: Optional[str] = Field(None, description="Second STR allele at a given locus")


class Synonym(BaseModel):
    """Synonym model"""
    synonym_id: int = Field(..., description="ID for record")
    cell_line_id: int = Field(..., description="Aus stem cell registry ID")
    synonym: Optional[str] = Field(None, description="Cell line synonym")


class UndiferentiatedCharactrisation(BaseModel):
    """Undifferentiated Characterisation model"""
    undifferentiationcharacterisation_id: int = Field(..., description="Undifferentiated Characterisation ID")
    epi_pluri_mcpg: bool = Field(..., description="EpiPluri mCpG for undifferentiated characterisation")
    epi_pluri_oct4: bool = Field(..., description="EpiPluri OCT4 for undifferentiated characterisation")
    epi_pluri_score: int = Field(..., description="EpiPluri Score for undifferentiated characterisation")
    hpsc_scorecard_id: int = Field(..., description="hPSC scorecard ID")
    markers: str = Field(..., description="Marker list shown for undifferentiation characterisation")
    morphology_file: Optional[str] = Field(None, description="Dataset showing cell morphology")
    other: Optional[str] = Field(None, description="Other test if there any")
    pluri_novelty_score: float = Field(..., description="Pluritest_novelty_score for undifferentiated characterisation")
    pluri_test_microarray_url: HttpUrl = Field(..., description="Pluritest_url_mircoarray_data for undifferentiated characterisation")
    pluri_test_score: float = Field(..., description="Pluritest_score for undifferentiated characterisation")
    pluripotency_tests: str = Field(..., description="Pluripotency test used")


class UndifferentiatedCharacterisationMarkerExpressionMethod(BaseModel):
    """Undifferentiated Characterisation Marker Expression Method model"""
    undifferentiationcharacterisationmarkerexpressionmethod_id: int = Field(..., description="Undifferentiated Characterisation Marker Expression Method ID")
    marker: Optional[str] = Field(None, description="Marker used to assess undifferentiated state")
    method: Optional[str] = Field(None, description="Method used to detect marker expression")
    method_file: Optional[str] = Field(None, description="File or URL containing result (image, data, etc.)")
    undifferentiationcharacterisation_id: int = Field(..., description="Undifferentiated Characterisation Marker Expression Methods")


class VectorFreeReprogramming(BaseModel):
    """Vector Free Reprogramming model"""
    vectorfreereprogramming_id: int = Field(..., description="ID for record")
    celllinederivedinducedpluripotent_id: int = Field(..., description="Cell line ips ID")
    kit_name: str = Field(..., description="Name of the commercial kit used for vector-free reprogramming")
    mRNA: bool = Field(..., description="Indicates whether mRNA was used to induce reprogramming")
    miRNA: bool = Field(..., description="Indicates whether micro-RNA was used to induce reprogramming")
    protein: bool = Field(..., description="Indicates whether protein was used to induce reprogramming")
    small_molecule: bool = Field(..., description="Indicates whether small molecules were used to induce reprogramming")


class VectorFreeReprogrammingGene(BaseModel):
    """Vector Free Reprogramming Gene model"""
    vectorfreeprogramminggene_id: int = Field(..., description="Vector-free reprogramming gene ID")
    allele_1: str = Field(..., description="First allele observed at gene locus")
    allele_2: str = Field(..., description="Second allele observed at gene locus")
    loci_id: Optional[int] = Field(None, description="Loci ID")
    type: str = Field(..., description="Type of genomic feature")
    vectorfreeprogramming_id: int = Field(..., description="Vector-free reprogramming ID")


class HPSCScorecard(BaseModel):
    """hPSC Scorecard model"""
    hpsc_scorecard_id: int = Field(..., description="hPSC scorecard ID")
    hpsc_scorecard_ectoderm: Optional[bool] = Field(None, description="hPSC Scorecard ectoderm")
    hpsc_scorecard_endoderm: Optional[bool] = Field(None, description="hPSC Scorecard endoderm")
    hpsc_scorecard_mesoderm: Optional[bool] = Field(None, description="hPSC Scorecard mesoderm")
    hpsc_scorecard_self_renewal: Optional[bool] = Field(None, description="hPSC Scorecard self-renewal")
    scorecard_file: Optional[str] = Field(None, description="hPSC Scorecard file")


class XRefs(BaseModel):
    """Cross References model"""
    xref_id: int = Field(..., description="Identifier for cross-reference entry")
    cell_line_id: int = Field(..., description="Associated cell line ID")
    db_name: str = Field(..., description="Name of the external database the cell line is referenced in")
    xref_url: HttpUrl = Field(..., description="Full URL pointing to the external database entry for the cell line")


# Main registry model that could contain collections of all entities
class StemCellRegistry(BaseModel):
    """Main Stem Cell Registry model containing all entities"""
    cell_lines: Optional[List[CellLine]] = Field(default_factory=list, description="List of cell lines")
    donors: Optional[List[DonorSource]] = Field(default_factory=list, description="List of donor sources")
    publications: Optional[List[Publication]] = Field(default_factory=list, description="List of publications")
    institutes: Optional[List[Institute]] = Field(default_factory=list, description="List of institutes")
    groups: Optional[List[Group]] = Field(default_factory=list, description="List of groups")
    diseases: Optional[List[Disease]] = Field(default_factory=list, description="List of diseases")
    
    class Config:
        """Pydantic configuration"""
        validate_assignment = True
        use_enum_values = True
        extra = "forbid"
        json_encoders = {
            date: lambda v: v.isoformat(),
            HttpUrl: str
        }


# Example usage and validation functions
def validate_cell_line(data: dict) -> CellLine:
    """Validate and create a CellLine instance"""
    return CellLine(**data)

def validate_registry(data: dict) -> StemCellRegistry:
    """Validate and create a StemCellRegistry instance"""
    return StemCellRegistry(**data)


# Default Curation Form Model
class CellLineCurationForm(BaseModel):
    """
    Comprehensive form model for curating all cell line metadata from articles.
    This includes the main cell line data plus all related information a curator
    would typically extract from a scientific publication.
    
    Many fields are lists to accommodate multiple instances (e.g., multiple 
    characterization protocols, multiple publications, etc.)
    """
    
    # === Core Cell Line Information ===
    cell_line_id: Optional[str] = Field(None, description="Aus stem cell registry ID (auto-generated if empty)")
    cell_line_alt_name: Optional[str] = Field(None, description="Alternate name for the cell line")
    hpscreg_name: Optional[str] = Field(None, description="hPSCReg's generated cell line name on registration")
    cell_type: Optional[CellTypeEnum] = Field(None, description="Type of cell line (iPSC/ESC)")
    status: Optional[StatusEnum] = Field(None, description="Status of the cell line")
    
    # === Usage and Availability ===
    clinical_use: bool = Field(False, description="Cell line's availability for clinical usage purpose")
    commercial_use: bool = Field(False, description="Cell line's availability for commercial usage purpose")
    research_use: bool = Field(True, description="Cell line's availability for research usage purpose")
    publish: bool = Field(True, description="Whether the line can be published or not")
    registered_with_hpscreg: bool = Field(False, description="Registered with hPSCReg")
    embargo_date: Optional[date] = Field(None, description="Embargo date if applicable")
    frozen: Optional[bool] = Field(None, description="If the cell line was frozen")
    
    # === Donor Information ===
    donor_age: Optional[AgeEnum] = Field(None, description="Age of the donor")
    donor_sex: Optional[SexEnum] = Field(None, description="Genetic sex of the donor")
    donor_disease_phenotype: Optional[str] = Field(None, description="Phenotype associated with diagnosed disease")
    donor_polymorphism: Optional[str] = Field(None, description="Polymorphism associated with the donor")
    
    # === Disease Information (can have multiple diseases) ===
    diseases: Optional[List[Disease]] = Field(default_factory=list, description="List of diseases associated with donor/cell line")
    
    # === Genomic Information ===
    associated_polymorphism: Optional[str] = Field(None, description="Polymorphism associated with the cell line")
    biopsy_location: Optional[str] = Field(None, description="Biopsy location of the source tissue")
    genotype: Optional[GenotypeEnum] = Field(None, description="Genotype type of the cell line")
    genotype_locus: Optional[str] = Field(None, description="Genotype locus of the cell line")
    
    # === Derivation Information (for iPSC) ===
    ipsc_derivation: Optional[CellLineDerivedInducedPluripotent] = Field(None, description="iPSC derivation details")
    
    # === Derivation Information (for ESC) ===
    esc_derivation: Optional[CellLineDerivationEmbryonic] = Field(None, description="ESC derivation details")
    
    # === Genomic Characterisation (can have multiple) ===
    genomic_characterisations: Optional[List[GenomicCharacterisation]] = Field(default_factory=list, description="List of genomic characterizations")
    
    # === Additional Genomic Tests ===
    additional_genomic_characterisations: Optional[List[AdditionalGenomicCharacterisation]] = Field(default_factory=list, description="Additional genomic characterizations")
    
    # === HLA Results (can have multiple loci) ===
    hla_results: Optional[List[HlaResults]] = Field(default_factory=list, description="HLA typing results for different loci")
    
    # === STR/Fingerprinting Results (can have multiple loci) ===
    str_fingerprinting_results: Optional[List[StrOrFingerprinting]] = Field(default_factory=list, description="STR/fingerprinting results for different loci")
    
    # === Pluripotency Characterisation (multiple methods/tests) ===
    undifferentiated_characterisations: Optional[List[UndiferentiatedCharactrisation]] = Field(default_factory=list, description="Undifferentiated/pluripotency characterizations")
    
    # === Differentiation Characterisation (for each germ layer) ===
    characterisation_protocol_results: Optional[List[CharacterisationProtocolResult]] = Field(default_factory=list, description="Characterization results for ectoderm, mesoderm, endoderm")
    
    # === Culture Conditions (can have multiple protocols) ===
    culture_media: Optional[List[CultureMedium]] = Field(default_factory=list, description="Culture medium conditions used")
    
    # === Screening Results (can be multiple screening protocols) ===
    screening_results: Optional[List[MicrobiologyVirologyScreening]] = Field(default_factory=list, description="Microbiology and virology screening results")
    
    # === Institution and Contact Information ===
    generator_institutes: Optional[List[Institute]] = Field(default_factory=list, description="Institutions that generated the cell line")
    owner_institutes: Optional[List[Institute]] = Field(default_factory=list, description="Institutions that own the cell line")
    contacts: Optional[List[Contact]] = Field(default_factory=list, description="Contact information")
    
    # === Publication Information (can cite multiple papers) ===
    publications: Optional[List[Publication]] = Field(default_factory=list, description="Publications associated with the cell line")
    
    # === Ethics Information ===
    ethics: Optional[Ethics] = Field(None, description="Ethics approval information")
    
    # === Cross-references (multiple databases) ===
    external_references: Optional[List[XRefs]] = Field(default_factory=list, description="External database references")
    synonyms: Optional[List[Synonym]] = Field(default_factory=list, description="Cell line synonyms/alternative names")
    
    # === Genomic Modifications (can have multiple) ===
    genomic_modifications: Optional[List[GenomicModification]] = Field(default_factory=list, description="Genomic modifications applied to the cell line")
    genomic_alterations: Optional[List[GenomicAlteration]] = Field(default_factory=list, description="Details of genomic alterations")
    
    # === Vector Information (for iPSC reprogramming) ===
    integrated_vectors: Optional[List[IntegratedVector]] = Field(default_factory=list, description="Integrated reprogramming vectors")
    non_integrated_vectors: Optional[List[NonIntegratedVector]] = Field(default_factory=list, description="Non-integrated reprogramming vectors")
    vector_free_reprogramming: Optional[List[VectorFreeReprogramming]] = Field(default_factory=list, description="Vector-free reprogramming protocols")
    
    # === Small Molecules (for reprogramming) ===
    small_molecules: Optional[List[SmallMolecule]] = Field(default_factory=list, description="Small molecules used in reprogramming")
    
    # === hPSC Scorecard Results ===
    hpsc_scorecards: Optional[List[HPSCScorecard]] = Field(default_factory=list, description="hPSC scorecard results")
    
    # === Loci Information (genomic loci of interest) ===
    loci: Optional[List[Loci]] = Field(default_factory=list, description="Genomic loci of interest")
    
    # === Curator Information ===
    curator_notes: Optional[str] = Field(None, description="Internal curator notes")
    curation_date: Optional[date] = Field(None, description="Date of curation")
    curation_status: Optional[str] = Field("draft", description="Curation status (draft/review/approved)")
    
    # === Simple fields for common single-value metadata ===
    # These are kept as simple fields for basic form inputs
    simple_disease_name: Optional[str] = Field(None, description="Primary disease name (simple text)")
    simple_publication_doi: Optional[HttpUrl] = Field(None, description="Primary publication DOI")
    simple_publication_pmid: Optional[str] = Field(None, description="Primary publication PMID")
    simple_contact_email: Optional[str] = Field(None, description="Primary contact email")
    simple_generator_institute: Optional[str] = Field(None, description="Primary generating institution name")
    
    # === File URLs (for document uploads) ===
    vector_map_file_url: Optional[HttpUrl] = Field(None, description="Vector plasmid map file")
    reprogramming_expression_file_url: Optional[HttpUrl] = Field(None, description="Reprogramming expression file")
    characterisation_method_file_url: Optional[HttpUrl] = Field(None, description="Characterisation protocol file")
    scorecard_file_url: Optional[HttpUrl] = Field(None, description="hPSC Scorecard file")
    karyogram_file_url: Optional[HttpUrl] = Field(None, description="Karyogram image file")
    morphology_file_url: Optional[HttpUrl] = Field(None, description="Cell morphology images")
    consent_form_file_url: Optional[HttpUrl] = Field(None, description="Consent form template")
    
    class Config:
        """Pydantic configuration for the curation form"""
        validate_assignment = True
        use_enum_values = True
        extra = "forbid"
        json_encoders = {
            date: lambda v: v.isoformat() if v else None,
            HttpUrl: str
        }
        
    @field_validator('simple_contact_email')
    @classmethod
    def validate_contact_email(cls, v):
        """Validate contact email field"""
        if v and '@' not in v:
            raise ValueError('Invalid email format')
        return v


# Export all models for easy importing
__all__ = [
    'AdditionalGenomicCharacterisation', 'CellLine', 'CellLineDerivationEmbryonic',
    'CellLineDerivedInducedPluripotent', 'CellLineSource', 'CellLinePublication',
    'CharacterisationMethod', 'CharacterisationProtocolResult', 'Contact',
    'CultureMedium', 'CultureMediumItems', 'Disease', 'DonorDisease', 'DonorSource',
    'Ethics', 'ExternalCellLineSource', 'GenomicModification', 'GenomicAlteration',
    'GenomicCharacterisation', 'Group', 'GroupInstitute', 'HlaResults', 'IPDGene',
    'Institute', 'IntegratedVector', 'Loci', 'MediumComponentItems',
    'MicrobiologyVirologyScreening', 'NonIntegratedVector', 'Publication', 'RegUser',
    'RegistrationRequirements', 'SmallMolecule', 'StrOrFingerprinting', 'Synonym',
    'UndiferentiatedCharactrisation', 'UndifferentiatedCharacterisationMarkerExpressionMethod',
    'VectorFreeReprogramming', 'VectorFreeReprogrammingGene', 'HPSCScorecard', 'XRefs',
    'StemCellRegistry', 'CellLineCurationForm', 'validate_cell_line', 'validate_registry'
]