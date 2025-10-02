"""
ASCR Data Dictionary - Pydantic Models

Auto-generated from admin_portal_data_dictionary.csv
Contains comprehensive field definitions with validation, constraints, and relationships.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date

# Original CSV Data Types Mapping
# Maps table.field -> original CSV data type constants
ORIGINAL_DATA_TYPES = {
    "AdditionalGenomicCharacterisation.additionalgenomiccharacterisation_id": "INT",
    "AdditionalGenomicCharacterisation.fingerprint_analysis": "BOOLEAN",
    "AdditionalGenomicCharacterisation.genome_wide_or_functional_analysis": "BOOLEAN",
    "AdditionalGenomicCharacterisation.genomiccharacterisation_id": "INT",
    "AdditionalGenomicCharacterisation.hla_typing": "BOOLEAN",
    "AdditionalGenomicCharacterisation.str_analysis": "BOOLEAN",
    "CellLine.associated_polymorphism": "TEXT",
    "CellLine.biopsy_location": "ONTOLOGY",
    "CellLine.cell_line_alt_name": "VARCHAR",
    "CellLine.cell_line_id": "VARCHAR",
    "CellLine.cell_line_source_id": "VARCHAR",
    "CellLine.cell_type": "VARCHAR",
    "CellLine.certificate_of_pluripotency_characterisation": "BOOLEAN",
    "CellLine.clinical_use": "BOOLEAN",
    "CellLine.commercial_use": "BOOLEAN",
    "CellLine.culture_medium": "INT",
    "CellLine.curation_status": "TEXT",
    "CellLine.embargo_date": "DATE",
    "CellLine.frozen": "BOOLEAN",
    "CellLine.generator_group": "INT",
    "CellLine.genomic_characterisation": "INT",
    "CellLine.genotype": "ENUM",
    "CellLine.genotype_locus": "TEXT",
    "CellLine.hpscreg_name": "VARCHAR",
    "CellLine.owner_group": "INT",
    "CellLine.publish": "BOOLEAN",
    "CellLine.registered_with_hpscreg": "BOOLEAN",
    "CellLine.registration_requirements": "INT",
    "CellLine.research_use": "BOOLEAN",
    "CellLine.screening_contaminants": "INT",
    "CellLine.status": "ENUM",
    "CellLine.undifferentiated_characterisation_protocol": "INT",
    "CellLineDerivationEmbryonic.available_as_clinical_grade": "BOOLEAN",
    "CellLineDerivationEmbryonic.cell_isolation": "ENUM",
    "CellLineDerivationEmbryonic.cell_isolation_other": "TEXT",
    "CellLineDerivationEmbryonic.cell_line_id": "VARCHAR",
    "CellLineDerivationEmbryonic.cell_seeding": "ENUM",
    "CellLineDerivationEmbryonic.cell_seeding_other": "TEXT",
    "CellLineDerivationEmbryonic.celllinederivationembryonic_id": "INT",
    "CellLineDerivationEmbryonic.derivation_under_gmp": "BOOLEAN",
    "CellLineDerivationEmbryonic.derivation_year": "INT",
    "CellLineDerivationEmbryonic.derived_under_xeno-free_conditions": "BOOLEAN",
    "CellLineDerivationEmbryonic.e_nhmrc_licence_number": "TEXT",
    "CellLineDerivationEmbryonic.e_preimplantation_genetic_diagnostic_embryo": "BOOLEAN",
    "CellLineDerivationEmbryonic.e_supernumerary": "BOOLEAN",
    "CellLineDerivationEmbryonic.embryo_stage": "ENUM",
    "CellLineDerivationEmbryonic.expansion_status": "ENUM",
    "CellLineDerivationEmbryonic.icm_morphology": "ENUM",
    "CellLineDerivationEmbryonic.other_hesc_source": "ENUM",
    "CellLineDerivationEmbryonic.other_hesc_source_other": "TEXT",
    "CellLineDerivationEmbryonic.reason_no_derivation_year": "TEXT",
    "CellLineDerivationEmbryonic.separation_of_research_and_ivf_treat": "BOOLEAN",
    "CellLineDerivationEmbryonic.trophectoderm morphology": "ENUM",
    "CellLineDerivationEmbryonic.zp_removal_technique": "ENUM",
    "CellLineDerivationEmbryonic.zp_removal_technique_other": "TEXT",
    "CellLineDerivationinducedPluripotent.available_as_clinical_grade": "BOOLEAN",
    "CellLineDerivationinducedPluripotent.cell_line_id": "VARCHAR",
    "CellLineDerivationinducedPluripotent.celllinederivationinducedpluripotent_id": "INT",
    "CellLineDerivationinducedPluripotent.derivation_under_gmp": "BOOLEAN",
    "CellLineDerivationinducedPluripotent.derivation_year": "INT",
    "CellLineDerivationinducedPluripotent.derivationipsintegratedvector_id": "INT",
    "CellLineDerivationinducedPluripotent.derivationipsnonintegratedvector_id": "INT",
    "CellLineDerivationinducedPluripotent.derived_under_xeno-free_conditions": "BOOLEAN",
    "CellLineDerivationinducedPluripotent.i_reprogramming_vector_type": "ENUM",
    "CellLineDerivationinducedPluripotent.i_source_cell_origin": "ONTOLOGY",
    "CellLineDerivationinducedPluripotent.i_source_cell_type": "ONTOLOGY",
    "CellLineDerivationinducedPluripotent.i_source_cell_type_additional_info": "TEXT",
    "CellLineDerivationinducedPluripotent.method_used_immune_marker_staining": "BOOLEAN",
    "CellLineDerivationinducedPluripotent.method_used_pcr": "BOOLEAN",
    "CellLineDerivationinducedPluripotent.method_used_rtpcr": "BOOLEAN",
    "CellLineDerivationinducedPluripotent.method_used_seq": "BOOLEAN",
    "CellLineDerivationinducedPluripotent.passage_number": "INT",
    "CellLineDerivationinducedPluripotent.reason_no_derivation_year": "TEXT",
    "CellLineDerivationinducedPluripotent.reprogramming_expression_silence_file": "FILE",
    "CellLineDerivationinducedPluripotent.selection_criteria_for_clones": "TEXT",
    "CellLineDerivationinducedPluripotent.vector_map_file": "FILE",
    "CellLineSource.aust_reg_parental_cell_line": "VARCHAR",
    "CellLineSource.cell_line_source_id": "VARCHAR",
    "CellLineSource.donor_id": "VARCHAR",
    "CellLineSource.donor_source_id": "VARCHAR",
    "CellLineSource.external_cell_line_id": "VARCHAR",
    "Cell_Line_Publication.cell_line_id": "VARCHAR",
    "Cell_Line_Publication.cell_line_publication_id": "VARCHAR",
    "Cell_Line_Publication.publication_id": "VARCHAR",
    "CharacterisationMethod.characterisation_method": "ONTOLOGY",
    "CharacterisationMethod.characterisation_method_description": "TEXT",
    "CharacterisationMethod.characterisation_method_id": "TEXT",
    "CharacterisationProtocolResult.cell_line_id": "VARCHAR",
    "CharacterisationProtocolResult.cell_type": "ENUM",
    "CharacterisationProtocolResult.characterisation_method_id": "TEXT",
    "CharacterisationProtocolResult.characterisationprotocolresult_id": "INT",
    "CharacterisationProtocolResult.differentiation_profile": "ENUM",
    "CharacterisationProtocolResult.hpsc_scorecard": "FILE",
    "CharacterisationProtocolResult.marker_list": "TEXT",
    "CharacterisationProtocolResult.method_file": "URL",
    "CharacterisationProtocolResult.morphology_url": "URL",
    "CharacterisationProtocolResult.shown_potency": "BOOLEAN",
    "CharacterisationProtocolResult.transcriptome_data_url": "URL",
    "Contact.contact": "INT",
    "Contact.e_mail": "email",
    "Contact.phone_number": "INT",
    "CultureMedium.co2_concentration": "FLOAT",
    "CultureMedium.culture_medium_items": "ONTOLOGY",
    "CultureMedium.culturemedium_id": "INT",
    "CultureMedium.o2_concentration": "FLOAT",
    "CultureMedium.other_passage_method": "VARCHAR",
    "CultureMedium.passage_method": "VARCHAR",
    "CultureMedium.rho_kinase_used": "BOOLEAN",
    "Culture_Medium_Items.culture_medium": "ONTOLOGY",
    "Culture_Medium_Items.culture_medium_items_id": "INT",
    "Culture_Medium_Items.medium_component_item": "ONTOLOGY",
    "Disease.description": "VARCHAR",
    "Disease.disease_id": "INT",
    "Disease.icd11_id": "VARCHAR",
    "Disease.icd11_url": "URL",
    "Disease.mondo_onto_id": "ONTOLOGY",
    "Disease.name": "ONTOLOGY",
    "Disease.omim_id": "VARCHAR",
    "Disease.omim_url": "URL",
    "DonorDisease.disease_id": "INT",
    "DonorDisease.donor_disease_id": "INT",
    "DonorDisease.donor_id": "INT",
    "DonorSource.age": "ENUM",
    "DonorSource.disease_phenotype": "ONTOLOGY",
    "DonorSource.donor_source_id": "VARCHAR",
    "DonorSource.polymorphism": "VARCHAR",
    "DonorSource.sex": "ENUM",
    "Ethics.approval_date": "DATE",
    "Ethics.consent_for_future_research": "BOOLEAN",
    "Ethics.consent_for_global_distribution": "BOOLEAN",
    "Ethics.consent_for_specific_research": "BOOLEAN",
    "Ethics.consent_form": "FILE",
    "Ethics.ethics_number": "INT",
    "Ethics.institutional_hrec": "",
    "ExternalCellLineSource.cell_type": "ONTOLOGY",
    "ExternalCellLineSource.disease_phenotype": "ONTOLOGY",
    "ExternalCellLineSource.external_cell_line_id": "VARCHAR",
    "ExternalCellLineSource.lot number": "VARCHAR",
    "ExternalCellLineSource.name": "TEXT",
    "ExternalCellLineSource.provider": "VARCHAR",
    "ExternalCellLineSource.provider cat num": "VARCHAR",
    "ExternalCellLineSource.provider url": "URL",
    "ExternalCellLineSource.tissue": "ONTOLOGY",
    "ExternalCellLineSource.xref_id": "VARCHAR",
    "ExternalCellLineSource.xref_url": "URL",
    "Genomic modification.cell_line_id": "VARCHAR",
    "Genomic modification.genomic_alteration_id": "INT",
    "Genomic modification.genomic_modification_id": "INT",
    "GenomicAlteration.cytoband": "VARCHAR",
    "GenomicAlteration.delivery_method": "ENUM",
    "GenomicAlteration.description": "TEXT",
    "GenomicAlteration.disease_name": "ONTOLOGY",
    "GenomicAlteration.genomic_alteration_id": "INT",
    "GenomicAlteration.genotype": "VARCHAR",
    "GenomicAlteration.loci": "ONTOLOGY",
    "GenomicAlteration.modification_type": "ENUM",
    "GenomicCharacterisation.data_file": "URL",
    "GenomicCharacterisation.data_url": "URL",
    "GenomicCharacterisation.genomiccharacterisation_id": "INT",
    "GenomicCharacterisation.karyogram": "URL",
    "GenomicCharacterisation.karyotype": "ENUM",
    "GenomicCharacterisation.karyotype_method": "ENUM",
    "GenomicCharacterisation.other_method": "TEXT",
    "GenomicCharacterisation.passage_number": "INT",
    "GenomicCharacterisation.summary": "TEXT",
    "Group.contact": "INT",
    "Group.group_id": "INT",
    "Group.name": "TEXT",
    "Group.type": "ENUM",
    "Group_Institute.group_id": "INT",
    "Group_Institute.institute_id": "INT",
    "HlaResults.additionalgenomiccharacterisation_id": "INT",
    "HlaResults.group": "ENUM",
    "HlaResults.hlaallele_1": "TEXT",
    "HlaResults.hlaallele_2": "TEXT",
    "HlaResults.hlaresults_id": "INT",
    "HlaResults.loci_id": "INT",
    "IPDGene.allele_1": "TEXT",
    "IPDGene.allele_2": "TEXT",
    "IPDGene.celllinederivationinducedpluripotent_id": "INT",
    "IPDGene.ipdgene_id": "INT",
    "IPDGene.loci_id": "INT",
    "Institute.city": "TEXT",
    "Institute.country": "TEXT",
    "Institute.institute_id": "INT",
    "Institute.name": "TEXT",
    "IntegratedVector.absence_of_reprogramming_vector": "BOOLEAN",
    "IntegratedVector.derivationipsintegratedvector_id": "INT",
    "IntegratedVector.excisable": "BOOLEAN",
    "IntegratedVector.int_rep_trans_type": "ENUM",
    "IntegratedVector.int_rep_trans_type_other": "TEXT",
    "IntegratedVector.int_rep_virus_type": "ENUM",
    "IntegratedVector.int_rep_virus_type_other": "TEXT",
    "IntegratedVector.int_reprogramming_vector": "ENUM",
    "IntegratedVector.int_reprogramming_vector_other": "TEXT",
    "IntegratedVector.silenced": "ENUM",
    "IntegratedVector.vector_silencing_notes": "TEXT",
    "Loci.associated_disease": "URL",
    "Loci.chromosome": "INT",
    "Loci.ebi_url": "URL",
    "Loci.end": "INT",
    "Loci.genome_version": "VARCHAR",
    "Loci.group": "ENUM",
    "Loci.loci_id": "INT",
    "Loci.name": "VARCHAR",
    "Loci.ncbi_url": "URL",
    "Loci.start": "INT",
    "Loci.strbase_id": "VARCHAR",
    "MediumComponentItems.amount": "FLOAT",
    "MediumComponentItems.company": "TEXT ",
    "MediumComponentItems.medium_component_items": "INT",
    "MediumComponentItems.name": "TEXT",
    "MediumComponentItems.type": "ENUM",
    "MediumComponentItems.unit": "VARCHAR",
    "MicrobiologyVirologyScreening.hep_b": "ENUM",
    "MicrobiologyVirologyScreening.hep_c": "ENUM",
    "MicrobiologyVirologyScreening.hiv1": "ENUM",
    "MicrobiologyVirologyScreening.hiv2": "ENUM",
    "MicrobiologyVirologyScreening.mycoplasma": "ENUM",
    "MicrobiologyVirologyScreening.other": "ENUM",
    "MicrobiologyVirologyScreening.performed": "BOOLEAN",
    "MicrobiologyVirologyScreening.screening_id": "INT",
    "NonIntegratedVector.derivationipsintegratedvector_id": "INT",
    "NonIntegratedVector.detected_reprogramming_vector": "ENUM",
    "NonIntegratedVector.detected_reprogramming_vector_notes": "TEXT",
    "NonIntegratedVector.non_int_vector": "ENUM",
    "NonIntegratedVector.non_int_vector_other": "TEXT",
    "Ontology.definition": "TEXT",
    "Ontology.lowest_lvl_for_search": "BOOLEAN",
    "Ontology.ontology_db_name": "TEXT",
    "Ontology.ontology_id": "INT",
    "Ontology.ontology_identifier": "ONTOLOGY",
    "Ontology.term": "TEXT",
    "Ontology.url": "URL",
    "OntologyParentChild.child": "INT",
    "OntologyParentChild.ontologyparentchild_id": "INT",
    "OntologyParentChild.parent": "INT",
    "OntologySynonym.ontology_id": "INT",
    "OntologySynonym.ontologysynonym_id": "INT",
    "OntologySynonym.synonym of ontology term": "TEXT",
    "Publication.doi": "URL",
    "Publication.first_author": "TEXT",
    "Publication.journal": "ENUM",
    "Publication.last_author": "TEXT",
    "Publication.pmid": "TEXT",
    "Publication.publication_id": "VARCHAR",
    "Publication.title": "VARCHAR",
    "Publication.year": "DATE",
    "RegUser.email": "VARCHAR",
    "RegUser.first_name": "CHAR",
    "RegUser.group_id": "INT",
    "RegUser.last_name": "CHAR",
    "RegUser.orcid_id": "INT",
    "RegUser.password": "TEXT",
    "RegUser.user_id": "INT",
    "RegistrationRequirements.ethics": "INT",
    "RegistrationRequirements.reg_user": "INT",
    "RegistrationRequirements.submitted_ethics_clearance": "BOOLEAN",
    "SmallMolecule.chembank_id": "URL",
    "SmallMolecule.name": "TEXT",
    "SmallMolecule.smallmolecule_id": "INT",
    "SmallMolecule.vectorfreeprogramming_id": "INT",
    "StrOrFingerprinting.Additonal Genomic Characterisation ID": "INT",
    "StrOrFingerprinting.id": "INT",
    "StrOrFingerprinting.loci_id": "INT",
    "StrOrFingerprinting.strallele_1": "TEXT",
    "StrOrFingerprinting.strallele_2": "TEXT",
    "Synonym.cell_line_id": "VARCHAR",
    "Synonym.synonym": "TEXT",
    "Synonym.synonym_id": "INT",
    "UndifferentiatedCharacterisation.epi_pluri_mcpg": "BOOLEAN",
    "UndifferentiatedCharacterisation.epi_pluri_oct4": "BOOLEAN",
    "UndifferentiatedCharacterisation.epi_pluri_score": "INT",
    "UndifferentiatedCharacterisation.epi_pluri_score_flag": "BOOLEAN",
    "UndifferentiatedCharacterisation.hpsc_scorecard_id": "INT",
    "UndifferentiatedCharacterisation.markers": "TEXT",
    "UndifferentiatedCharacterisation.morphology_file": "FILE",
    "UndifferentiatedCharacterisation.other": "TEXT",
    "UndifferentiatedCharacterisation.pluri_novelty_score": "FLOAT",
    "UndifferentiatedCharacterisation.pluri_test": "BOOLEAN",
    "UndifferentiatedCharacterisation.pluri_test_microarray_url": "URL",
    "UndifferentiatedCharacterisation.pluri_test_score": "FLOAT",
    "UndifferentiatedCharacterisationMarkerExpressionMethod.characterisation_method_file": "FILE",
    "UndifferentiatedCharacterisationMarkerExpressionMethod.characterisation_method_id": "TEXT",
    "UndifferentiatedCharacterisationMarkerExpressionMethod.marker": "ENUM",
    "UndifferentiatedCharacterisationMarkerExpressionMethod.undifferentiationcharacterisation_id": "INT",
    "UndifferentiatedCharacterisationMarkerExpressionMethod.undifferentiationcharacterisationmarkerexpressionmethod_id": "INT",
    "VectorFreeReprogramming.celllinederivationinducedpluripotent_id": "INT",
    "VectorFreeReprogramming.kit_name": "TEXT",
    "VectorFreeReprogramming.mRNA": "BOOLEAN",
    "VectorFreeReprogramming.miRNA": "BOOLEAN",
    "VectorFreeReprogramming.protein": "BOOLEAN",
    "VectorFreeReprogramming.small_molecule": "BOOLEAN",
    "VectorFreeReprogramming.vectorfreereprogramming_id": "INT",
    "VectorFreeReprogrammingGenes.allele_1": "TEXT",
    "VectorFreeReprogrammingGenes.allele_2": "TEXT",
    "VectorFreeReprogrammingGenes.loci_id": "INT",
    "VectorFreeReprogrammingGenes.type": "ENUM",
    "VectorFreeReprogrammingGenes.vectorfreereprogramming_id": "INT",
    "VectorFreeReprogrammingGenes.vectorfreereprogramminggene_id": "INT",
    "hpsc_scorecard.hpsc_scorecard_ectoderm": "BOOLEAN",
    "hpsc_scorecard.hpsc_scorecard_endoderm": "BOOLEAN",
    "hpsc_scorecard.hpsc_scorecard_id": "INT",
    "hpsc_scorecard.hpsc_scorecard_mesoderm": "BOOLEAN",
    "hpsc_scorecard.hpsc_scorecard_self_renewal": "BOOLEAN",
    "hpsc_scorecard.scorecard_file": "FILE",
    "xRefs.cell_line_id": "VARCHAR",
    "xRefs.db_id": "VARCHAR",
    "xRefs.db_name": "VARCHAR",
    "xRefs.db_url": "URL",
    "xRefs.xref_id": "INT",
    "xRefs.xref_url": "URL",
}

class CellLine(BaseModel):
    """
    CellLine model
    """
    cell_line_id: str = Field(description="Aus stem cell registry ID", max_length=100, json_schema_extra={"primary_key": True})
    cell_line_alt_name: str = Field(description="Alternate name for the cell line", max_length=100)
    hpscreg_name: str = Field(description="hPSCReg's generated cell line name on registration", max_length=100)
    registered_with_hpscreg: Literal["TRUE", "FALSE"] = Field(description="ID of the registration requirements ")
    publish: Literal["TRUE", "FALSE"] = Field(description="whether the line can be published or not")
    cell_line_source_id: CellLineSource = Field(description="cell line source")
    genomic_characterisation: Optional[GenomicCharacterisation] = Field(description="ID of the genomic characterisation associated with the cell line")
    undifferentiated_characterisation_protocol: Optional[UndifferentiatedCharacterisation] = Field(description="ID of the protocol for undifferentiated characterisation")
    generator_group: Group = Field(description="ID of the group which the institution belongs to")
    owner_group: Group = Field(description="ID of the group which the institution belongs to")
    registration_requirements: RegistrationRequirements = Field(description="ID of the registration details")
    screening_contaminants: Optional[MicrobiologyVirologyScreening] = Field(description="ID of Microbiology Virology Screening performed on the line if there any")
    culture_medium: Optional[CultureMedium] = Field(description="culture medium ID of the cell line if there any")
    biopsy_location: Ontology = Field(description="biopsy location of the source tissue")
    cell_type: Optional[Literal["iPSC", "ESC"]] = Field(description="type of cell line")
    status: Optional[Literal["backup", "characterised"]] = Field(description="status of the cell line")
    genotype: Optional[Literal["patient control", "gene-corrected"]] = Field(description="genotype type of the cell line")
    genotype_locus: Optional[str] = Field(description="genotype locus of the cell line", max_length=250)
    frozen: Optional[Literal["TRUE", "FALSE"]] = Field(description="if the cell line was frozen")
    certificate_of_pluripotency_characterisation: Optional[Literal["TRUE", "FALSE"]] = Field(description="Whether certificate is issued or not")
    associated_polymorphism: str = Field(description="polymorphism associated with the cell line", max_length=250)
    research_use: Literal["TRUE", "FALSE"] = Field(description="cell line's availablity for research usage purpose")
    clinical_use: Literal["TRUE", "FALSE"] = Field(description="cell line's availablity for clinical usage purpose")
    commercial_use: Literal["TRUE", "FALSE"] = Field(description="cell line's availablity for commercial usage purpose")
    curation_status: str = Field(description="cell line's curation status")
    embargo_date: Optional[Literal["DATE"]] = Field(description="If there is an embargo date")


class CellLineSource(BaseModel):
    """
    CellLineSource model
    """
    cell_line_source_id: CellLineSource = Field(description="Cell line source id")
    donor_id: Optional[DonorSource] = Field(description="ID of stem cell line donor")
    aust_reg_parental_cell_line: Optional[CellLine] = Field(description="ID of parental cell line")
    external_cell_line_id: ExternalCellLineSource = Field(description="External cell line source id")
    donor_source_id: str = Field(description="Donor source ID", max_length=100, json_schema_extra={"primary_key": True})


class ExternalCellLineSource(BaseModel):
    """
    ExternalCellLineSource model
    """
    external_cell_line_id: str = Field(description="External cell line source id", max_length=100, json_schema_extra={"primary_key": True})
    name: str = Field(description="Name of external cell line source", max_length=100, json_schema_extra={"ontology": True})
    xref_id: XRefs = Field()
    xref_url: str = Field(max_length=100, json_schema_extra={"ontology": True, "ontology_link": "https://www.ebi.ac.uk/spot/oxo/"})
    disease_phenotype: Disease = Field(description="Disease phenotype")
    tissue: str = Field(description="Tissue type", max_length=100, json_schema_extra={"ontology": True, "ontology_link": "http://purl.obolibrary.org/obo/uberon.owl"})
    cell_type: str = Field(description="Cell type", max_length=100, json_schema_extra={"ontology": True, "ontology_link": "http://purl.obolibrary.org/obo/cl.owl"})
    provider: str = Field(description="Cell line provider", max_length=100)
    provider_cat_num: Optional[str] = Field(description="Provider name", max_length=100)
    provider_url: Optional[str] = Field(description="Provider url", max_length=100)
    lot_number: Optional[str] = Field(description="Provider lot number", max_length=100)


class Contact(BaseModel):
    """
    Contact model
    """
    contact: int = Field(json_schema_extra={"primary_key": True})
    e_mail: str = Field(description="email of the contact", max_length=100)
    phone_number: int = Field(description="phone of the contact")


class Institute(BaseModel):
    """
    Institute model
    """
    institute_id: int = Field(description="institute ID", json_schema_extra={"primary_key": True})
    name: Literal["List of institutes + other"] = Field(description="name of institution that registered/generated the cell line")
    city: Literal["List of cities"] = Field(description="city name of institution that registered/generated the cell line")
    country: Literal["List of countries"] = Field(description="country name of institution that registered/generated the cell line")


class Group(BaseModel):
    """
    Group model
    """
    group_id: int = Field(description="group ID", json_schema_extra={"primary_key": True})
    name: str = Field(description="name of the group", max_length=100)
    contact: Contact = Field(description="contact ID of the group")
    type: Literal["Manufacture", "Research", "Biobank", "Other"] = Field(description="type of the group")


class GroupInstitute(BaseModel):
    """
    Group_Institute model
    """
    group_id: Group = Field(description="ID of the group")
    institute_id: Institute = Field(description="ID of the institute associated with this group")


class Ethics(BaseModel):
    """
    Ethics model
    """
    ethics_number: int = Field(description="ethics number associated with the cell line")
    approval_date: Literal["Date"] = Field(description="date of ethics approval")
    consent_form: Optional[str] = Field(description="template of donor consent form acquired by cell line generator", max_length=1)
    consent_for_specific_research: Optional[Literal["TRUE", "FALSE"]] = Field(description="Whether consent pertains to a specific research project.")
    consent_for_future_research: Optional[Literal["TRUE", "FALSE"]] = Field(description="Whether consent permits unforeseen future research, without further consent.")
    consent_for_global_distribution: Optional[Literal["TRUE", "FALSE"]] = Field(description="Whether consent prevents cells derived from the donated biosample from being made available to researchers anywhere in the world.")
    institutional_hrec: Optional[str] = None


class RegUser(BaseModel):
    """
    RegUser model
    """
    user_id: int = Field(description="user ID who registered the cell line", json_schema_extra={"primary_key": True})
    group_id: Group = Field(description="group ID from which the user belongs to")
    orcid_id: int = Field(description="ORCID ID of the user")
    first_name: str = Field(description="First name of the user", max_length=20)
    last_name: str = Field(description="Last name of the user", max_length=20)
    password: str = Field(description="Hashed password of the user", max_length=25)
    email: str = Field(description="Email of the user", max_length=250)


class RegistrationRequirements(BaseModel):
    """
    RegistrationRequirements model
    """
    reg_user: RegUser = Field(description="user ID who registered the cell line")
    ethics: Ethics = Field(description="ethics ID associated with the cell line")
    submitted_ethics_clearance: Literal["TRUE", "FALSE"] = Field(description="whether ethics clearance has been submitted")


class XRefs(BaseModel):
    """
    xRefs model
    """
    xref_id: int = Field(description="Identifier for cross-reference entry", json_schema_extra={"primary_key": True})
    cell_line_id: CellLine = Field(description="Aus stem cell registry ID")
    xref_url: str = Field(description="Full URL pointing to the external database entry for the cell line", max_length=250)
    db_url: str = Field(description="URL pointing to the external database the cell line is referenced in", max_length=250)
    db_id: str = Field(description="ID of the external database the cell line is referenced in", max_length=100)
    db_name: str = Field(description="Name of the external database the cell line is referenced in", max_length=100)


class Publication(BaseModel):
    """
    Publication model
    """
    publication_id: str = Field(description="Local identifier for publications", max_length=100, json_schema_extra={"primary_key": True})
    doi: str = Field(description="DOI ID of the publication", max_length=100)
    title: Optional[str] = Field(description="Title of the publication", max_length=100)
    pmid: Optional[str] = Field(description="PubMed ID of the publication", max_length=100)
    first_author: Optional[str] = Field(description="Name of first author", max_length=100)
    last_author: Optional[str] = Field(description="Name of last author", max_length=100)
    journal: Optional[str] = Field(description="journal name", max_length=100)
    year: Optional[Literal["Drop-down list of years"]] = Field(description="year of publication")


class CellLinePublication(BaseModel):
    """
    Cell_Line_Publication model
    """
    cell_line_publication_id: str = Field(description="Cell line publication id", max_length=100, json_schema_extra={"primary_key": True})
    cell_line_id: CellLine = Field(description="Aus stem cell registry ID")
    publication_id: Publication = Field(description="Publication id")


class DonorSource(BaseModel):
    """
    DonorSource model
    """
    donor_source_id: str = Field(description="Donor source ID", max_length=100, json_schema_extra={"primary_key": True})
    age: Optional[Literal["EM", "FE", "NEO", "A1_4", "A5_9", "A10_14", "A15_19", "A20_24", "A25_29", "A30_34", "A35_39", "A40_44", "A45_49", "A50_54", "A55_59", "A60_64", "A65_69", "A70_74", "A75_79", "A80_84", "A85_89", "A89P"]] = Field(description="Age of the donor")
    sex: Literal["Male", "Female", "Unknown"] = Field(description="genetic sex of the dono")
    disease_phenotype: Optional[str] = Field(description="phenotype associated with the disease diagnosed for the donor", max_length=100, json_schema_extra={"ontology": True, "ontology_link": "http://purl.obolibrary.org/obo/mondo/mondo-international.owl"})
    polymorphism: Optional[str] = Field(description="polymorphism associated with the donor", max_length=250)


class DonorDisease(BaseModel):
    """
    DonorDisease model
    """
    donor_disease_id: int = Field(description="Donor disease ID", json_schema_extra={"primary_key": True})
    donor_id: DonorSource = Field(description="Donor ID")
    disease_id: Disease = Field(description="Disease ID")


class Disease(BaseModel):
    """
    Disease model
    """
    disease_id: int = Field(description="Disease ID", json_schema_extra={"primary_key": True})
    description: Optional[str] = Field(description="Disease description", max_length=250)
    name: str = Field(description="Disease name", json_schema_extra={"ontology": True, "ontology_link": "http://purl.obolibrary.org/obo/MONDO_0700096"})
    mondo_onto_id: Ontology = Field(description="Mondo ID for the disease")
    omim_id: Optional[str] = Field(description="OMIM ID", json_schema_extra={"ontology": True, "ontology_link": "https://omim.org/"})
    omim_url: Optional[str] = Field(description="OMIM entry url", json_schema_extra={"ontology": True, "ontology_link": "https://omim.org/"})
    icd11_id: Optional[str] = Field(description="OMIN ID", json_schema_extra={"ontology": True, "ontology_link": "https://icd.who.int/dev11/"})
    icd11_url: Optional[str] = Field(description="ICD11 entry url", json_schema_extra={"ontology": True, "ontology_link": "https://icd.who.int/dev11/"})


class MediumComponentItems(BaseModel):
    """
    MediumComponentItems model
    """
    name: str = Field(description="name of item", max_length=100, json_schema_extra={"ontology": True})
    medium_component_items: int = Field(description="Medium id", json_schema_extra={"primary_key": True})
    amount: Optional[float] = Field(description="the number of the unit")
    unit: Optional[str] = Field(description="Units for materials", json_schema_extra={"ontology": True})
    company: Optional[str] = Field(description="name of company", max_length=100)
    type: Optional[Literal["Base Medium", "Main Protein", "Supplement", "Base Coat", "Serum"]] = Field(description="type of medium commercial items")


class CultureMediumItems(BaseModel):
    """
    Culture_Medium_Items model
    """
    culture_medium_items_id: int = Field(description="culture medium items id", json_schema_extra={"primary_key": True})
    culture_medium: CultureMedium = Field(description="id for culture medium")
    medium_component_item: MediumComponentItems = Field(description="Id for medium commercial items")


class CultureMedium(BaseModel):
    """
    CultureMedium model
    """
    culturemedium_id: int = Field(description="ID for culture medium", json_schema_extra={"primary_key": True})
    culture_medium_items: Culturemediumitems = Field(description="Components for culture medium")
    co2_concentration: float = Field(description="CO2 concentration", json_schema_extra={"ontology": True})
    o2_concentration: float = Field(description="O2 Concentration", json_schema_extra={"ontology": True})
    passage_method: Literal["Enzymatically", "Enzyme-free cell dissociation", "mechanically", "other"] = Field(description="Method used for cell passage")
    other_passage_method: Optional[str] = Field(description="Other cell passage method", max_length=250)
    rho_kinase_used: Optional[Literal["TRUE", "FALSE"]] = Field(description="Whether Rho Kinase been used at cryo, passage or thaw. ")


class MicrobiologyVirologyScreening(BaseModel):
    """
    MicrobiologyVirologyScreening model
    """
    screening_id: Literal["TRUE", "FALSE"] = Field(description="ID of screening information", json_schema_extra={"primary_key": True})
    performed: Optional[Literal["TRUE", "FALSE"]] = Field(description="whether the Microbiology_Virology_Screening was performed")
    hiv1: Optional[Literal["Positive", "Negative", "Not done"]] = Field(description="whether perform HIV1 test and if result is available,  choose from options")
    hiv2: Optional[Literal["Positive", "Negative", "Not done"]] = Field(description="whether perform HIV2 test and if result is available, choose from the options")
    hep_b: Optional[Literal["Positive", "Negative", "Not done"]] = Field(description="whether perform Hep B test and if result is available, choose from the options")
    hep_c: Optional[Literal["Positive", "Negative", "Not done"]] = Field(description="whether perform Hep C test and if result is available, choose from the options")
    mycoplasma: Optional[Literal["Positive", "Negative", "Not done"]] = Field(description="whether perform Mycoplasma test and if result is available, choose from the options")
    other: Literal["Positive", "Negative", "Not done"] = Field(description="Other test performed if there any")


class GenomicAlteration(BaseModel):
    """
    GenomicAlteration model
    """
    modification_type: Literal["variant", "transgene expression", "Gene knock out", "Gene knock in", "isogenic modification"] = Field(description="type of genomic alteration")
    genomic_alteration_id: int = Field(description="Genomic alteration ID", json_schema_extra={"primary_key": True})
    cytoband: str = Field(description="location of Chromosome/cytoband", max_length=100)
    delivery_method: str = Field(description="Delivery method of genomic alteration", max_length=100, json_schema_extra={"ontology": True, "ontology_link": "http://purl.obolibrary.org/obo/OBI_0000094"})
    loci: str = Field(description="loci of genomic alteration. ", max_length=100, json_schema_extra={"ontology": True, "ontology_link": "http://purl.obolibrary.org/obo/so.owl"})
    description: str = Field(description="any other description - NCBI or EBI id - HUGO", max_length=100, json_schema_extra={"ontology": True})
    genotype: str = Field(description="genotype", max_length=100, json_schema_extra={"ontology": True})
    disease_name: Optional[str] = Field(description="name of disease associated with the gene modification. OMIM?", max_length=100, json_schema_extra={"reference_url": "http://purl.obolibrary.org/obo/MONDO_0700096"})


class CharacterisationProtocolResult(BaseModel):
    """
    CharacterisationProtocolResult model
    """
    characterisationprotocolresult_id: int = Field(description="ID for Record", json_schema_extra={"primary_key": True})
    cell_line_id: CellLine = Field(description="Aus stem cell registry ID")
    cell_type: Literal["Endoderm", "Ectoderm", "Mesoderm", "Trophectoderm"] = Field(description="Type of the germ layer")
    shown_potency: Literal["TRUE", "FALSE"] = Field(description="Indicates whether the characterisation shows potency or not")
    marker_list: Optional[str] = Field(description="List of markers shown", max_length=100)
    characterisation_method_id: Optional[str] = Field(description="Characterisation method", max_length=100)
    method_file: Optional[str] = Field(description="File path or url to the characterisation protocol method", max_length=100)
    differentiation_profile: Optional[Literal["In vivo teratoma", "In vitro spontaneous", "In vitro directed", "hPSC Scorecard", "Other"]] = Field(description="Differentiation profile")
    hpsc_scorecard: Optional[str] = Field(description="HPSC Scorecard", max_length=100)
    morphology_url: Optional[str] = Field(description="URL to dataset showing cell morphology", max_length=100)
    transcriptome_data_url: Optional[str] = Field(description="Link to the raw transcriptome data", max_length=100)


class UndifferentiatedCharacterisation(BaseModel):
    """
    UndifferentiatedCharacterisation model
    """
    markers: str = Field(description="Marker list shown for undifferentiation characterisation", max_length=100)
    epi_pluri_score_flag: bool = Field(description="EpiPluri Score for undifferentiated characterisation")
    epi_pluri_score: int = Field(description="EpiPluri Score for undifferentiated characterisation")
    epi_pluri_mcpg: Literal["TRUE", "FALSE"] = Field(description="EpiPluri mCpG for undifferentiated characterisation")
    epi_pluri_oct4: Literal["TRUE", "FALSE"] = Field(description="EpiPluri OCT4 for undifferentiated characterisation")
    pluri_test: Literal["TRUE", "FALSE"] = Field(description="Whether there is a pluripotency test for undifferentiated characterisation")
    pluri_test_score: float = Field(description="Pluritest_score for undifferentiated characterisation")
    pluri_novelty_score: float = Field(description="Pluritest_novelty_score for undifferentiated characterisation")
    pluri_test_microarray_url: str = Field(description="Pluritest_url_mircoarray_data for undifferentiated characterisation", max_length=100)
    hpsc_scorecard_id: HpscScorecard = Field(description="hPSC scorecard ID")
    morphology_file: Optional[str] = Field(description="Dataset showing cell morphology", max_length=100)
    other: Optional[str] = Field(description="Other test if there any", max_length=100)


class HpscScorecard(BaseModel):
    """
    hpsc_scorecard model
    """
    hpsc_scorecard_id: int = Field(description="hPSC scorecard ID", json_schema_extra={"primary_key": True})
    hpsc_scorecard_self_renewal: Optional[Literal["TRUE", "FALSE"]] = Field(description="hPSC Scorecard self-renewal")
    hpsc_scorecard_endoderm: Optional[Literal["TRUE", "FALSE"]] = Field(description="hPSC Scorecard endoderm")
    hpsc_scorecard_mesoderm: Optional[Literal["TRUE", "FALSE"]] = Field(description="hPSC Scorecard mesoderm")
    hpsc_scorecard_ectoderm: Optional[Literal["TRUE", "FALSE"]] = Field(description="hPSC Scorecard ectoderm")
    scorecard_file: Optional[str] = Field(description="hPSC Scorecard file")


class UndifferentiatedCharacterisationMarkerExpressionMethod(BaseModel):
    """
    UndifferentiatedCharacterisationMarkerExpressionMethod model
    """
    undifferentiationcharacterisationmarkerexpressionmethod_id: int = Field(description="Undifferentiated Characterisation Marker Expression Method ID", json_schema_extra={"primary_key": True})
    undifferentiationcharacterisation_id: UndifferentiatedCharacterisation = Field(description="Undifferentiated Characterisation Marker Expression Methods")
    marker: Optional[Literal["Missing"]] = Field(description="Marker used to assess undifferentiated state")
    characterisation_method_id: Optional[str] = Field(description="Characterisation method", max_length=100, json_schema_extra={"primary_key": True})
    characterisation_method_file: Optional[str] = Field(description="File or URL containing result (image, data, etc.)", max_length=100)


class CharacterisationMethod(BaseModel):
    """
    CharacterisationMethod model
    """
    characterisation_method_id: Optional[str] = Field(description="Characterisation method", max_length=100, json_schema_extra={"primary_key": True})
    characterisation_method_description: Optional[str] = Field(description="Characterisation method description", max_length=250)
    characterisation_method: Optional[str] = Field(description="Characterisation method name", max_length=100, json_schema_extra={"ontology": True, "ontology_link": "http://www.ebi.ac.uk/efo/EFO_0000001"})


class GenomicCharacterisation(BaseModel):
    """
    GenomicCharacterisation model
    """
    genomiccharacterisation_id: int = Field(description="Genomic Characterisation ID", json_schema_extra={"primary_key": True})
    passage_number: int = Field(description="Passage number")
    karyotype: Literal["Missing"] = Field(description="Karyotype")
    karyotype_method: Literal["Ag-NOR banding", "C-banding", "G-banding", "R-banding", "Q-banding", "T-banding", "Spectral karyotyping", "Multiplex FISH", "CGH", "Array CGH", "Molecular karyotyping by SNP array", "KaryoLite BoBs", "Digital karyotyping", "Whole genome sequencing", "Exome sequencing", "Methylation profiling", "Other"] = Field(description="Karyotype method")
    other_method: Optional[str] = Field(description="Other Karyotype method", max_length=100)
    karyogram: Optional[str] = Field(description="Karyogram url file", max_length=100)
    data_url: Optional[str] = Field(description="Data url", max_length=100)
    summary: Optional[str] = Field(description="Summary of genomic characterisation", max_length=250)
    data_file: Optional[str] = Field(description="File url", max_length=100)


class AdditionalGenomicCharacterisation(BaseModel):
    """
    AdditionalGenomicCharacterisation model
    """
    additionalgenomiccharacterisation_id: int = Field(description="Addiitonal Genomic Characterisation ID", json_schema_extra={"primary_key": True})
    genomiccharacterisation_id: GenomicCharacterisation = Field(description="Genomic Characterisation ID")
    hla_typing: Optional[Literal["TRUE", "FALSE"]] = Field(description="HLA typing done")
    fingerprint_analysis: Literal["TRUE", "FALSE"] = Field(description="Fingerprint analyis typing done")
    genome_wide_or_functional_analysis: Literal["TRUE", "FALSE"] = Field(description="GWAS analysis done")
    str_analysis: Literal["TRUE", "FALSE"] = Field(description="STR analysis done")


class HlaResults(BaseModel):
    """
    HlaResults model
    """
    hlaresults_id: int = Field(description="HLA Results ID", json_schema_extra={"primary_key": True})
    loci_id: Loci = Field(description="Loci ID")
    additionalgenomiccharacterisation_id: AdditionalGenomicCharacterisation = Field(description="Addiitonal Genomic Characterisation ID")
    group: Optional[Literal["HLA Class I", "HLA Class II", "Non HLA Genes"]] = Field(description="HLA type")
    hlaallele_1: Optional[str] = Field(description="First HLA Allele", max_length=100, json_schema_extra={"ontology": True})
    hlaallele_2: Optional[str] = Field(description="Second HLA Allele", max_length=100, json_schema_extra={"ontology": True})


class StrOrFingerprinting(BaseModel):
    """
    StrOrFingerprinting model
    """
    id: int = Field(description="StrOrFingerprinting ID", json_schema_extra={"primary_key": True})
    loci_id: Loci = Field(description="Loci ID")
    Additonal_Genomic_Characterisation_ID: int = Field(description="additionalgenomiccharacterisation_id")
    strallele_1: Optional[str] = Field(description="First STR allele at a given locus", max_length=100)
    strallele_2: Optional[str] = Field(description="Second STR allele at a given locus", max_length=100)


class Loci(BaseModel):
    """
    Loci model
    """
    loci_id: Optional[int] = Field(description="Loci ID", json_schema_extra={"primary_key": True})
    name: Optional[str] = Field(description="Loci name", max_length=25)
    group: Optional[Literal["Missing"]] = Field(description="Loci group")
    ncbi_url: Optional[str] = Field(description="	Link to NCBI entry", max_length=250)
    ebi_url: Optional[str] = Field(description="Link to EBI/Ensembl entry", max_length=250)
    strbase_id: str = Field(description="STR Base ID", max_length=10, json_schema_extra={"reference_url": "https://strbase.nist.gov/Information/Type-18_Record"})
    associated_disease: Optional[Disease] = Field(description="Disease associated with loci")
    start: Optional[int] = Field(description="Start position")
    end: Optional[int] = Field(description="End position")
    chromosome: Optional[int] = Field(description="Chromome location")
    genome_version: Optional[str] = Field(description="Genome version ", max_length=100)


class VectorFreeReprogramming(BaseModel):
    """
    VectorFreeReprogramming model
    """
    vectorfreereprogramming_id: int = Field(description="ID for record", json_schema_extra={"primary_key": True})
    celllinederivationinducedpluripotent_id: CellLineDerivationInducedPluripotent = Field(description="Cell line ips ID")
    mRNA: Literal["TRUE", "FALSE"] = Field(description="Indicates whether mRNA was used to induce reprogramming")
    protein: Literal["TRUE", "FALSE"] = Field(description="Indicates whether protein was used to induce reprogramming")
    small_molecule: Literal["TRUE", "FALSE"] = Field(description="Indicates whether small molecules were used to induce reprogramming")
    miRNA: Literal["TRUE", "FALSE"] = Field(description="Indicates whether micro-RNA was used to induce reprogramming")
    kit_name: str = Field(description="Name of the commercial kit used for vector-free reprogramming", max_length=250)


class IntegratedVector(BaseModel):
    """
    IntegratedVector model
    """
    derivationipsintegratedvector_id: int = Field(description="ID for record", json_schema_extra={"primary_key": True})
    int_reprogramming_vector: Optional[Literal["virus", "plasmid", "transposon", "other"]] = Field(description="Tpe of integrating reprogramming vector")
    int_reprogramming_vector_other: Optional[str] = Field(description="Free-text to capture other type of integrating reprogramming vector", max_length=250)
    int_rep_virus_type: Optional[Literal["adenovirus", "retrovirus", "lentivirus", "other"]] = Field(description="Specify virus type if the vector is viral")
    int_rep_virus_type_other: Optional[str] = Field(description="Free-text to capture other type of virus type", max_length=250)
    int_rep_trans_type: Optional[Literal["PiggyBack transposon", "Sleeping beauty", "other"]] = Field(description="System used to deliver the vector")
    int_rep_trans_type_other: Optional[str] = Field(description="Free-text to capture other types of system used to deliver the vector", max_length=250)
    excisable: Literal["TRUE", "FALSE"] = Field(description="Indicates whether the integrating vector is designed to be excisable")
    silenced: Optional[Literal["yes", "no", "unknown"]] = Field(description="Indicates whether the gene expression has been silenced")
    absence_of_reprogramming_vector: Literal["TRUE", "FALSE"] = Field(description="Indicates whether the reprogramming vector is absent")
    vector_silencing_notes: Optional[str] = Field(description="Free-text field for additional information on silencing", max_length=250)


class NonIntegratedVector(BaseModel):
    """
    NonIntegratedVector model
    """
    derivationipsintegratedvector_id: int = Field(description="ID for record", json_schema_extra={"primary_key": True})
    non_int_vector: Literal["episomal", "sendai virus", "aav", "other"] = Field(description="name or type of non-integrating vector ")
    non_int_vector_other: Optional[str] = Field(description="Free-text to capture other type of non-integrating vector ", max_length=250)
    detected_reprogramming_vector: Optional[Literal["yes", "no", "unknown"]] = Field(description="Indicates whether any reprogramming vectors were detected")
    detected_reprogramming_vector_notes: Optional[str] = Field(description="Notes on how vector detection was performed ", max_length=250)


class CellLineDerivationInducedPluripotent(BaseModel):
    """
    CellLineDerivationinducedPluripotent model
    """
    celllinederivationinducedpluripotent_id: int = Field(description="ID for record", json_schema_extra={"primary_key": True})
    cell_line_id: CellLine = Field(description="Aus stem cell registry ID")
    passage_number: int = Field(description="Passage number")
    i_source_cell_type: str = Field(description="	Cell type used for reprogramming", max_length=100, json_schema_extra={"ontology": True, "ontology_link": "http://purl.obolibrary.org/obo/CLO_0000001"})
    i_source_cell_origin: str = Field(description="	Tissue or organ of origin of the source cell", max_length=100, json_schema_extra={"ontology": True, "ontology_link": "http://purl.obolibrary.org/obo/UBERON_0000467"})
    i_source_cell_type_additional_info: str = Field(description="Free-text entry for additional information about source cell type", max_length=250)
    i_reprogramming_vector_type: Literal["non-integrated", "intergrated", "none"] = Field(description="Type of vector used for reprogramming")
    derivationipsintegratedvector_id: IntegratedVector = Field(description="Integrated vector ID")
    derivationipsnonintegratedvector_id: NonIntegratedVector = Field(description="Non-integrated vector ID")
    vector_map_file: str = Field(description="	Vector plasmid map ", max_length=25)
    method_used_immune_marker_staining: Literal["TRUE", "FALSE"] = Field(description="Indicates whether immunostaining of pluripotency markers is done ")
    method_used_pcr: Literal["TRUE", "FALSE"] = Field(description="Indicates whether PCR-based detection of reprogramming is done")
    method_used_rtpcr: Literal["TRUE", "FALSE"] = Field(description="Indicates whether reverse transcriptase PCR method is used")
    method_used_seq: Literal["TRUE", "FALSE"] = Field(description="Indicates whether sequencing is done")
    reprogramming_expression_silence_file: str = Field(description="File showing reprogramming expression", max_length=100)
    derivation_year: Literal["List of years"] = Field(description="Year in which derivation of the hESC line was performed")
    reason_no_derivation_year: str = Field(description="Explain if year is unknown", max_length=250)
    selection_criteria_for_clones: str = Field(description="Description of how iPSC clones were selected", max_length=250)
    derived_under_xeno_free_conditions: Literal["TRUE", "FALSE"] = Field(description="Indicates whether the derivation was performed without animal products")
    derivation_under_gmp: Literal["TRUE", "FALSE"] = Field(description="Indicates whether derivation followed Good Manufacturing Practice")
    available_as_clinical_grade: Literal["TRUE", "FALSE"] = Field(description="Indicates if the resulting cell line is available as clinical-grade")


class CellLineDerivationEmbryonic(BaseModel):
    """
    CellLineDerivationEmbryonic model
    """
    celllinederivationembryonic_id: int = Field(description="ID for record", json_schema_extra={"primary_key": True})
    cell_line_id: CellLine = Field(description="Aus stem cell registry ID")
    e_nhmrc_licence_number: str = Field(description="NHMRC License number", max_length=100)
    e_supernumerary: Literal["TRUE", "FALSE"] = Field(description="Indicates whether the embryo used was a supernumerary embryo")
    separation_of_research_and_ivf_treat: Literal["TRUE", "FALSE"] = Field(description="Describes whether IVF treatment and research decision-making processes were clearly separated")
    other_hesc_source: Literal["Somatic Cell Nuclear Transfer (SCNT)", "Pathogenesis", "other"] = Field(description="Indicates if the hESC line was derived from a source other than supernumerary IVF embryos")
    other_hesc_source_other: str = Field(description="Description of other source", max_length=100)
    e_preimplantation_genetic_diagnostic_embryo: Literal["TRUE", "FALSE"] = Field(description="Indicates whether the embryo was created as part of PGD (preimplantation genetic diagnosis)")
    derivation_year: Literal["List of years"] = Field(description="Year in which derivation of the hESC line was performed")
    reason_no_derivation_year: str = Field(description="Explain if year is unknown", max_length=250)
    embryo_stage: Literal["Blastula with ICM and Trophoblast", "Cleavage (Mitosis)", "Compaction", "Morula", "Zygote"] = Field(description="Developmental stage of the embryo at the time of derivation")
    expansion_status: Literal["stage 1", "stage 2", "stage 3", "stage 4", "stage 5", "stage 6"] = Field(description="	Indicates whether the cell line has undergone expansion")
    icm_morphology: Literal["type A", "type B", "type C", "type D", "type E"] = Field(description="Morphological quality of the inner cell mass (ICM) used in derivation")
    trophectoderm_morphology: Literal["type A", "type B", "type G"] = Field(description="Morphology of the trophectoderm layer at the time of derivation")
    zp_removal_technique: Literal["chemical", "enzymatic", "manual", "mechanical", "spontaneous", "other"] = Field(description="Technique used to remove the zona pellucida (ZP)")
    zp_removal_technique_other: str = Field(description="	Free-text entry for other techniques to remove ZP", max_length=250)
    cell_isolation: Literal["immunosurgery", "laser", "mechanical", "trophectoderm and icm isolated", "none", "other"] = Field(description="Method used to isolate ICM or other cells ")
    cell_isolation_other: str = Field(description="Free-text entry for other method used to isolate ICM or other cells ", max_length=250)
    cell_seeding: Literal["embryo", "isolated icm", "single cell", "other"] = Field(description="Technique used to plate cells post-isolation")
    cell_seeding_other: str = Field(description="Free-text entry for other technique used to plate cells post-isolation", max_length=250)
    derived_under_xeno_free_conditions: Literal["TRUE", "FALSE"] = Field(description="Indicates whether the derivation was performed without animal products")
    derivation_under_gmp: Literal["TRUE", "FALSE"] = Field(description="Indicates whether derivation followed Good Manufacturing Practice")
    available_as_clinical_grade: Literal["TRUE", "FALSE"] = Field(description="Indicates if the resulting cell line is available as clinical-grade")


class Synonym(BaseModel):
    """
    Synonym model
    """
    synonym_id: int = Field(description="ID for record", json_schema_extra={"primary_key": True})
    cell_line_id: CellLine = Field(description="Aus stem cell registry ID")
    synonym: Optional[str] = Field(description="Cell line synonym", max_length=25)


class GenomicModification(BaseModel):
    """
    Genomic modification model
    """
    genomic_modification_id: int = Field(description="Genomic modification ID", json_schema_extra={"primary_key": True})
    genomic_alteration_id: GenomicAlteration = Field(description="Genomic alteration ID")
    cell_line_id: CellLine = Field(description="Aus stem cell registry ID")


class IpdGene(BaseModel):
    """
    IPDGene model
    """
    ipdgene_id: int = Field(description="IPD Gene ID", json_schema_extra={"primary_key": True})
    celllinederivationinducedpluripotent_id: CellLineDerivationInducedPluripotent = Field(description="iPSC ID")
    loci_id: Optional[Loci] = Field(description="Loci ID")
    allele_1: str = Field(description="First allele observed at gene locus", max_length=100)
    allele_2: str = Field(description="Second allele observed at gene locus", max_length=100)


class VectorFreeReprogrammingGenes(BaseModel):
    """
    VectorFreeReprogrammingGenes model
    """
    vectorfreereprogramminggene_id: int = Field(description="Vector-free reprogramming gene ID", json_schema_extra={"primary_key": True})
    vectorfreereprogramming_id: VectorFreeReprogramming = Field(description="Vector-free reprogramming ID")
    loci_id: Optional[Loci] = Field(description="Loci ID")
    type: Literal["mrna", "protein", "mirna"] = Field(description="Type of genomic feature")
    allele_1: str = Field(description="First allele observed at gene locus", max_length=100)
    allele_2: str = Field(description="Second allele observed at gene locus", max_length=100)


class SmallMolecule(BaseModel):
    """
    SmallMolecule model
    """
    smallmolecule_id: int = Field(description="Small molecule ID", json_schema_extra={"primary_key": True})
    vectorfreeprogramming_id: VectorFreeReprogramming = Field(description="Vector-free reprogramming ID")
    name: str = Field(description="Small molecule name", max_length=100)
    chembank_id: str = Field(description="Chembank database id for the small molecule", max_length=100)


class Ontology(BaseModel):
    """
    Ontology model
    """
    ontology_id: int = Field(description="Ontology ID", json_schema_extra={"primary_key": True})
    term: Optional[str] = Field(description="Text label for ontology_identifier")
    definition: Optional[str] = Field(description="Definition of ontology term")
    ontology_db_name: Optional[str] = Field(description="Name of ontology database")
    lowest_lvl_for_search: Optional[Literal["TRUE", "FALSE"]] = Field(description="TBA - level for filtering and searching", json_schema_extra={"ontology": True})
    url: Optional[str] = Field(description="URL to web entry for ontology_identifier", max_length=100)
    ontology_identifier: str = Field(description="Identifier of ontology in ontology database", json_schema_extra={"ontology": True})


class OntologyParentChild(BaseModel):
    """
    OntologyParentChild model
    """
    ontologyparentchild_id: int = Field(description="ontologyparentchild ID", json_schema_extra={"primary_key": True})
    parent: Optional[Ontology] = Field(description="ID of parent of ontology term")
    child: Optional[Ontology] = Field(description="ID of child/ren of ontology term")


class OntologySynonym(BaseModel):
    """
    OntologySynonym model
    """
    ontologysynonym_id: int = Field(json_schema_extra={"primary_key": True})
    ontology_id: Optional[Ontology] = None
    synonym_of_ontology_term: Optional[str] = None


# Data Dictionary Metadata
# This file was generated from CSV containing:
# - 44 tables
# - 312 total fields
# - 55 foreign key relationships
# - 100 unique enum values across all fields