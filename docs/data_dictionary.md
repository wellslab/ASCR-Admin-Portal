*Generated on 2025-10-02 12:11:51 from data_dictionary.py*

> This document provides a business-friendly view of the ASCR database schema.
> Each table represents a different aspect of stem cell registry data.

# ASCR Data Dictionary

## Table of Contents

- [AdditionalGenomicCharacterisation](#additionalgenomiccharacterisation)
- [CellLine](#cellline)
- [CellLineDerivationEmbryonic](#celllinederivationembryonic)
- [CellLineDerivationInducedPluripotent](#celllinederivationinducedpluripotent)
- [CellLinePublication](#celllinepublication)
- [CellLineSource](#celllinesource)
- [CharacterisationMethod](#characterisationmethod)
- [CharacterisationProtocolResult](#characterisationprotocolresult)
- [Contact](#contact)
- [CultureMedium](#culturemedium)
- [CultureMediumItems](#culturemediumitems)
- [Disease](#disease)
- [DonorDisease](#donordisease)
- [DonorSource](#donorsource)
- [Ethics](#ethics)
- [ExternalCellLineSource](#externalcelllinesource)
- [GenomicAlteration](#genomicalteration)
- [GenomicCharacterisation](#genomiccharacterisation)
- [GenomicModification](#genomicmodification)
- [Group](#group)
- [GroupInstitute](#groupinstitute)
- [HlaResults](#hlaresults)
- [HpscScorecard](#hpscscorecard)
- [Institute](#institute)
- [IntegratedVector](#integratedvector)
- [IpdGene](#ipdgene)
- [Loci](#loci)
- [MediumComponentItems](#mediumcomponentitems)
- [MicrobiologyVirologyScreening](#microbiologyvirologyscreening)
- [NonIntegratedVector](#nonintegratedvector)
- [Ontology](#ontology)
- [OntologyParentChild](#ontologyparentchild)
- [OntologySynonym](#ontologysynonym)
- [Publication](#publication)
- [RegUser](#reguser)
- [RegistrationRequirements](#registrationrequirements)
- [SmallMolecule](#smallmolecule)
- [StrOrFingerprinting](#strorfingerprinting)
- [Synonym](#synonym)
- [UndifferentiatedCharacterisation](#undifferentiatedcharacterisation)
- [UndifferentiatedCharacterisationMarkerExpressionMethod](#undifferentiatedcharacterisationmarkerexpressionmethod)
- [VectorFreeReprogramming](#vectorfreereprogramming)
- [VectorFreeReprogrammingGenes](#vectorfreereprogramminggenes)
- [XRefs](#xrefs)

---

## Summary Statistics

- **Total Tables:** 44
- **Total Fields:** 312
- **Primary Keys:** 41
- **Foreign Key Relations:** 42
- **Ontology-Controlled Fields:** 25

---

## AdditionalGenomicCharacterisation

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| additionalgenomiccharacterisation_id | INT | Yes |  |  | Addiitonal Genomic Characterisation ID | Primary Key |  |  |
| fingerprint_analysis | BOOLEAN | Yes |  | TRUE, FALSE | Fingerprint analyis typing done |  |  |  |
| genome_wide_or_functional_analysis | BOOLEAN | Yes |  | TRUE, FALSE | GWAS analysis done |  |  |  |
| genomiccharacterisation_id | INT | Yes |  |  | Genomic Characterisation ID | Foreign Key | [GenomicCharacterisation](#genomiccharacterisation) |  |
| str_analysis | BOOLEAN | Yes |  | TRUE, FALSE | STR analysis done |  |  |  |
| hla_typing | BOOLEAN | No |  | TRUE, FALSE | HLA typing done |  |  |  |

---

## CellLine

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| cell_line_id | VARCHAR | Yes | 100 |  | Aus stem cell registry ID | Primary Key |  |  |
| associated_polymorphism | VARCHAR | Yes | 250 |  | polymorphism associated with the cell line |  |  |  |
| biopsy_location | ONTOLOGY | Yes |  |  | biopsy location of the source tissue | Foreign Key | [Ontology](#ontology) |  |
| cell_line_alt_name | VARCHAR | Yes | 100 |  | Alternate name for the cell line |  |  |  |
| cell_line_source_id | VARCHAR | Yes |  |  | cell line source | Foreign Key | [CellLineSource](#celllinesource) |  |
| clinical_use | BOOLEAN | Yes |  | TRUE, FALSE | cell line's availablity for clinical usage purpose |  |  |  |
| commercial_use | BOOLEAN | Yes |  | TRUE, FALSE | cell line's availablity for commercial usage purpose |  |  |  |
| curation_status | VARCHAR | Yes |  |  | cell line's curation status |  |  |  |
| generator_group | INT | Yes |  |  | ID of the group which the institution belongs to | Foreign Key | [Group](#group) |  |
| hpscreg_name | VARCHAR | Yes | 100 |  | hPSCReg's generated cell line name on registration |  |  |  |
| owner_group | INT | Yes |  |  | ID of the group which the institution belongs to | Foreign Key | [Group](#group) |  |
| publish | BOOLEAN | Yes |  | TRUE, FALSE | whether the line can be published or not |  |  |  |
| registered_with_hpscreg | BOOLEAN | Yes |  | TRUE, FALSE | ID of the registration requirements  |  |  |  |
| registration_requirements | INT | Yes |  |  | ID of the registration details | Foreign Key | [RegistrationRequirements](#registrationrequirements) |  |
| research_use | BOOLEAN | Yes |  | TRUE, FALSE | cell line's availablity for research usage purpose |  |  |  |
| cell_type | VARCHAR | No |  | iPSC, ESC | type of cell line |  |  |  |
| certificate_of_pluripotency_characterisation | BOOLEAN | No |  | TRUE, FALSE | Whether certificate is issued or not |  |  |  |
| culture_medium | INT | No |  |  | culture medium ID of the cell line if there any |  |  |  |
| embargo_date | DATE | No |  | DATE | If there is an embargo date |  |  |  |
| frozen | BOOLEAN | No |  | TRUE, FALSE | if the cell line was frozen |  |  |  |
| genomic_characterisation | INT | No |  |  | ID of the genomic characterisation associated with the cell line |  |  |  |
| genotype | ENUM | No |  | patient control, gene-corrected | genotype type of the cell line |  |  |  |
| genotype_locus | VARCHAR | No | 250 |  | genotype locus of the cell line |  |  |  |
| screening_contaminants | INT | No |  |  | ID of Microbiology Virology Screening performed on the line if there any |  |  |  |
| status | ENUM | No |  | backup, characterised | status of the cell line |  |  |  |
| undifferentiated_characterisation_protocol | INT | No |  |  | ID of the protocol for undifferentiated characterisation |  |  |  |

---

## CellLineDerivationEmbryonic

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| celllinederivationembryonic_id | INT | Yes |  |  | ID for record | Primary Key |  |  |
| available_as_clinical_grade | BOOLEAN | Yes |  | TRUE, FALSE | Indicates if the resulting cell line is available as clinical-grade |  |  |  |
| cell_isolation | ENUM | Yes |  | immunosurgery, laser, mechanical, trophectoderm and icm isolated, none, other | Method used to isolate ICM or other cells  |  |  |  |
| cell_isolation_other | VARCHAR | Yes | 250 |  | Free-text entry for other method used to isolate ICM or other cells  |  |  |  |
| cell_line_id | VARCHAR | Yes |  |  | Aus stem cell registry ID | Foreign Key | [CellLine](#cellline) |  |
| cell_seeding | ENUM | Yes |  | embryo, isolated icm, single cell, other | Technique used to plate cells post-isolation |  |  |  |
| cell_seeding_other | VARCHAR | Yes | 250 |  | Free-text entry for other technique used to plate cells post-isolation |  |  |  |
| derivation_under_gmp | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether derivation followed Good Manufacturing Practice |  |  |  |
| derivation_year | INT | Yes |  | List of years | Year in which derivation of the hESC line was performed |  |  |  |
| derived_under_xeno_free_conditions | ENUM | Yes |  | TRUE, FALSE | Indicates whether the derivation was performed without animal products |  |  |  |
| e_nhmrc_licence_number | VARCHAR | Yes | 100 |  | NHMRC License number |  |  |  |
| e_preimplantation_genetic_diagnostic_embryo | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether the embryo was created as part of PGD (preimplantation genetic diagnosis) |  |  |  |
| e_supernumerary | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether the embryo used was a supernumerary embryo |  |  |  |
| embryo_stage | ENUM | Yes |  | Blastula with ICM and Trophoblast, Cleavage (Mitosis), Compaction, Morula, Zygote | Developmental stage of the embryo at the time of derivation |  |  |  |
| expansion_status | ENUM | Yes |  | stage 1, stage 2, stage 3, stage 4, stage 5, stage 6 | 	Indicates whether the cell line has undergone expansion |  |  |  |
| icm_morphology | ENUM | Yes |  | type A, type B, type C, type D, type E | Morphological quality of the inner cell mass (ICM) used in derivation |  |  |  |
| other_hesc_source | ENUM | Yes |  | Somatic Cell Nuclear Transfer (SCNT), Pathogenesis, other | Indicates if the hESC line was derived from a source other than supernumerary IVF embryos |  |  |  |
| other_hesc_source_other | VARCHAR | Yes | 100 |  | Description of other source |  |  |  |
| reason_no_derivation_year | VARCHAR | Yes | 250 |  | Explain if year is unknown |  |  |  |
| separation_of_research_and_ivf_treat | BOOLEAN | Yes |  | TRUE, FALSE | Describes whether IVF treatment and research decision-making processes were clearly separated |  |  |  |
| trophectoderm_morphology | ENUM | Yes |  | type A, type B, type G | Morphology of the trophectoderm layer at the time of derivation |  |  |  |
| zp_removal_technique | ENUM | Yes |  | chemical, enzymatic, manual, mechanical, spontaneous, other | Technique used to remove the zona pellucida (ZP) |  |  |  |
| zp_removal_technique_other | VARCHAR | Yes | 250 |  | 	Free-text entry for other techniques to remove ZP |  |  |  |

---

## CellLineDerivationInducedPluripotent

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| celllinederivationinducedpluripotent_id | INT | Yes |  |  | ID for record | Primary Key |  |  |
| available_as_clinical_grade | ENUM | Yes |  | TRUE, FALSE | Indicates if the resulting cell line is available as clinical-grade |  |  |  |
| cell_line_id | REFERENCE | Yes |  |  | Aus stem cell registry ID | Foreign Key | [CellLine](#cellline) |  |
| derivation_under_gmp | ENUM | Yes |  | TRUE, FALSE | Indicates whether derivation followed Good Manufacturing Practice |  |  |  |
| derivation_year | ENUM | Yes |  | List of years | Year in which derivation of the hESC line was performed |  |  |  |
| derivationipsintegratedvector_id | REFERENCE | Yes |  |  | Integrated vector ID | Foreign Key | [IntegratedVector](#integratedvector) |  |
| derivationipsnonintegratedvector_id | REFERENCE | Yes |  |  | Non-integrated vector ID | Foreign Key | [NonIntegratedVector](#nonintegratedvector) |  |
| derived_under_xeno_free_conditions | ENUM | Yes |  | TRUE, FALSE | Indicates whether the derivation was performed without animal products |  |  |  |
| i_reprogramming_vector_type | ENUM | Yes |  | non-integrated, intergrated, none | Type of vector used for reprogramming |  |  |  |
| i_source_cell_origin | VARCHAR | Yes | 100 |  | 	Tissue or organ of origin of the source cell |  |  | http://purl.obolibrary.org/obo/UBERON_0000467 |
| i_source_cell_type | VARCHAR | Yes | 100 |  | 	Cell type used for reprogramming |  |  | http://purl.obolibrary.org/obo/CLO_0000001 |
| i_source_cell_type_additional_info | VARCHAR | Yes | 250 |  | Free-text entry for additional information about source cell type |  |  |  |
| method_used_immune_marker_staining | ENUM | Yes |  | TRUE, FALSE | Indicates whether immunostaining of pluripotency markers is done  |  |  |  |
| method_used_pcr | ENUM | Yes |  | TRUE, FALSE | Indicates whether PCR-based detection of reprogramming is done |  |  |  |
| method_used_rtpcr | ENUM | Yes |  | TRUE, FALSE | Indicates whether reverse transcriptase PCR method is used |  |  |  |
| method_used_seq | ENUM | Yes |  | TRUE, FALSE | Indicates whether sequencing is done |  |  |  |
| passage_number | INT | Yes |  |  | Passage number |  |  |  |
| reason_no_derivation_year | VARCHAR | Yes | 250 |  | Explain if year is unknown |  |  |  |
| reprogramming_expression_silence_file | VARCHAR | Yes | 100 |  | File showing reprogramming expression |  |  |  |
| selection_criteria_for_clones | VARCHAR | Yes | 250 |  | Description of how iPSC clones were selected |  |  |  |
| vector_map_file | VARCHAR | Yes | 25 |  | 	Vector plasmid map  |  |  |  |

---

## CellLinePublication

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| cell_line_publication_id | VARCHAR | Yes | 100 |  | Cell line publication id | Primary Key |  |  |
| cell_line_id | REFERENCE | Yes |  |  | Aus stem cell registry ID | Foreign Key | [CellLine](#cellline) |  |
| publication_id | REFERENCE | Yes |  |  | Publication id | Foreign Key | [Publication](#publication) |  |

---

## CellLineSource

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| donor_source_id | VARCHAR | Yes | 100 |  | Donor source ID | Primary Key |  |  |
| cell_line_source_id | VARCHAR | Yes |  |  | Cell line source id | Foreign Key | [CellLineSource](#celllinesource) |  |
| external_cell_line_id | VARCHAR | Yes |  |  | External cell line source id | Foreign Key | [ExternalCellLineSource](#externalcelllinesource) |  |
| aust_reg_parental_cell_line | VARCHAR | No |  |  | ID of parental cell line |  |  |  |
| donor_id | VARCHAR | No |  |  | ID of stem cell line donor |  |  |  |

---

## CharacterisationMethod

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| characterisation_method_id | VARCHAR | No | 100 |  | Characterisation method | Primary Key |  |  |
| characterisation_method | ONTOLOGY | No | 100 |  | Characterisation method name |  |  | http://www.ebi.ac.uk/efo/EFO_0000001 |
| characterisation_method_description | VARCHAR | No | 250 |  | Characterisation method description |  |  |  |

---

## CharacterisationProtocolResult

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| characterisationprotocolresult_id | INT | Yes |  |  | ID for Record | Primary Key |  |  |
| cell_line_id | VARCHAR | Yes |  |  | Aus stem cell registry ID | Foreign Key | [CellLine](#cellline) |  |
| cell_type | ENUM | Yes |  | Endoderm, Ectoderm, Mesoderm, Trophectoderm | Type of the germ layer |  |  |  |
| shown_potency | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether the characterisation shows potency or not |  |  |  |
| characterisation_method_id | VARCHAR | No | 100 |  | Characterisation method |  |  |  |
| differentiation_profile | ENUM | No |  | In vivo teratoma, In vitro spontaneous, In vitro directed, hPSC Scorecard, Other | Differentiation profile |  |  |  |
| hpsc_scorecard | FILE | No | 100 |  | HPSC Scorecard |  |  |  |
| marker_list | VARCHAR | No | 100 |  | List of markers shown |  |  |  |
| method_file | URL | No | 100 |  | File path or url to the characterisation protocol method |  |  |  |
| morphology_url | URL | No | 100 |  | URL to dataset showing cell morphology |  |  |  |
| transcriptome_data_url | URL | No | 100 |  | Link to the raw transcriptome data |  |  |  |

---

## Contact

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| contact | INT | Yes |  |  | No description provided | Primary Key |  |  |
| e_mail | email | Yes | 100 |  | email of the contact |  |  |  |
| phone_number | INT | Yes |  |  | phone of the contact |  |  |  |

---

## CultureMedium

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| culturemedium_id | INT | Yes |  |  | ID for culture medium | Primary Key |  |  |
| co2_concentration | FLOAT | Yes |  |  | CO2 concentration |  |  |  |
| culture_medium_items | ONTOLOGY | Yes |  |  | Components for culture medium | Foreign Key | [Culturemediumitems](#culturemediumitems) |  |
| o2_concentration | FLOAT | Yes |  |  | O2 Concentration |  |  |  |
| passage_method | VARCHAR | Yes |  | Enzymatically, Enzyme-free cell dissociation, mechanically, other | Method used for cell passage |  |  |  |
| other_passage_method | VARCHAR | No | 250 |  | Other cell passage method |  |  |  |
| rho_kinase_used | BOOLEAN | No |  | TRUE, FALSE | Whether Rho Kinase been used at cryo, passage or thaw.  |  |  |  |

---

## CultureMediumItems

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| culture_medium_items_id | INT | Yes |  |  | culture medium items id | Primary Key |  |  |
| culture_medium | REFERENCE | Yes |  |  | id for culture medium | Foreign Key | [CultureMedium](#culturemedium) |  |
| medium_component_item | REFERENCE | Yes |  |  | Id for medium commercial items | Foreign Key | [MediumComponentItems](#mediumcomponentitems) |  |

---

## Disease

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| disease_id | INT | Yes |  |  | Disease ID | Primary Key |  |  |
| mondo_onto_id | ONTOLOGY | Yes |  |  | Mondo ID for the disease | Foreign Key | [Ontology](#ontology) |  |
| name | ONTOLOGY | Yes |  |  | Disease name |  |  | http://purl.obolibrary.org/obo/MONDO_0700096 |
| description | VARCHAR | No | 250 |  | Disease description |  |  |  |
| icd11_id | VARCHAR | No |  |  | OMIN ID |  |  | https://icd.who.int/dev11/ |
| icd11_url | URL | No |  |  | ICD11 entry url |  |  | https://icd.who.int/dev11/ |
| omim_id | VARCHAR | No |  |  | OMIM ID |  |  | https://omim.org/ |
| omim_url | URL | No |  |  | OMIM entry url |  |  | https://omim.org/ |

---

## DonorDisease

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| donor_disease_id | INT | Yes |  |  | Donor disease ID | Primary Key |  |  |
| disease_id | INT | Yes |  |  | Disease ID | Foreign Key | [Disease](#disease) |  |
| donor_id | INT | Yes |  |  | Donor ID | Foreign Key | [DonorSource](#donorsource) |  |

---

## DonorSource

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| donor_source_id | VARCHAR | Yes | 100 |  | Donor source ID | Primary Key |  |  |
| sex | ENUM | Yes |  | Male, Female, Unknown | genetic sex of the dono |  |  |  |
| age | ENUM | No |  | EM, FE, NEO, A1_4, A5_9, A10_14, A15_19, A20_24, A25_29, A30_34, A35_39, A40_44, A45_49, A50_54, A55_59, A60_64, A65_69, A70_74, A75_79, A80_84, A85_89, A89P | Age of the donor |  |  |  |
| disease_phenotype | ONTOLOGY | No | 100 |  | phenotype associated with the disease diagnosed for the donor |  |  | http://purl.obolibrary.org/obo/mondo/mondo-international.owl |
| polymorphism | VARCHAR | No | 250 |  | polymorphism associated with the donor |  |  |  |

---

## Ethics

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| approval_date | DATE | Yes |  | Date | date of ethics approval |  |  |  |
| ethics_number | INT | Yes |  |  | ethics number associated with the cell line |  |  |  |
| consent_for_future_research | BOOLEAN | No |  | TRUE, FALSE | Whether consent permits unforeseen future research, without further consent. |  |  |  |
| consent_for_global_distribution | BOOLEAN | No |  | TRUE, FALSE | Whether consent prevents cells derived from the donated biosample from being made available to researchers anywhere in the world. |  |  |  |
| consent_for_specific_research | BOOLEAN | No |  | TRUE, FALSE | Whether consent pertains to a specific research project. |  |  |  |
| consent_form | FILE | No | 1 |  | template of donor consent form acquired by cell line generator |  |  |  |
| institutional_hrec | VARCHAR | No |  |  | No description provided |  |  |  |

---

## ExternalCellLineSource

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| external_cell_line_id | VARCHAR | Yes | 100 |  | External cell line source id | Primary Key |  |  |
| cell_type | ONTOLOGY | Yes | 100 |  | Cell type |  |  | http://purl.obolibrary.org/obo/cl.owl |
| disease_phenotype | ONTOLOGY | Yes |  |  | Disease phenotype | Foreign Key | [Disease](#disease) |  |
| name | VARCHAR | Yes | 100 |  | Name of external cell line source |  |  |  |
| provider | VARCHAR | Yes | 100 |  | Cell line provider |  |  |  |
| tissue | ONTOLOGY | Yes | 100 |  | Tissue type |  |  | http://purl.obolibrary.org/obo/uberon.owl |
| xref_id | VARCHAR | Yes |  |  | No description provided | Foreign Key | [XRefs](#xrefs) |  |
| xref_url | URL | Yes | 100 |  | No description provided |  |  | https://www.ebi.ac.uk/spot/oxo/ |
| lot_number | VARCHAR | No | 100 |  | Provider lot number |  |  |  |
| provider_cat_num | VARCHAR | No | 100 |  | Provider name |  |  |  |
| provider_url | VARCHAR | No | 100 |  | Provider url |  |  |  |

---

## GenomicAlteration

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| genomic_alteration_id | INT | Yes |  |  | Genomic alteration ID | Primary Key |  |  |
| cytoband | VARCHAR | Yes | 100 |  | location of Chromosome/cytoband |  |  |  |
| delivery_method | ENUM | Yes | 100 |  | Delivery method of genomic alteration |  |  | http://purl.obolibrary.org/obo/OBI_0000094 |
| description | VARCHAR | Yes | 100 |  | any other description - NCBI or EBI id - HUGO |  |  |  |
| genotype | VARCHAR | Yes | 100 |  | genotype |  |  |  |
| loci | ONTOLOGY | Yes | 100 |  | loci of genomic alteration.  |  |  | http://purl.obolibrary.org/obo/so.owl |
| modification_type | ENUM | Yes |  | variant, transgene expression, Gene knock out, Gene knock in, isogenic modification | type of genomic alteration |  |  |  |
| disease_name | ONTOLOGY | No | 100 |  | name of disease associated with the gene modification. OMIM? |  |  | http://purl.obolibrary.org/obo/MONDO_0700096 |

---

## GenomicCharacterisation

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| genomiccharacterisation_id | INT | Yes |  |  | Genomic Characterisation ID | Primary Key |  |  |
| karyotype | ENUM | Yes |  | Missing | Karyotype |  |  |  |
| karyotype_method | ENUM | Yes |  | Ag-NOR banding, C-banding, G-banding, R-banding, Q-banding, T-banding, Spectral karyotyping, Multiplex FISH, CGH, Array CGH, Molecular karyotyping by SNP array, KaryoLite BoBs, Digital karyotyping, Whole genome sequencing, Exome sequencing, Methylation profiling, Other | Karyotype method |  |  |  |
| passage_number | INT | Yes |  |  | Passage number |  |  |  |
| data_file | URL | No | 100 |  | File url |  |  |  |
| data_url | URL | No | 100 |  | Data url |  |  |  |
| karyogram | URL | No | 100 |  | Karyogram url file |  |  |  |
| other_method | VARCHAR | No | 100 |  | Other Karyotype method |  |  |  |
| summary | VARCHAR | No | 250 |  | Summary of genomic characterisation |  |  |  |

---

## GenomicModification

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| genomic_modification_id | INT | Yes |  |  | Genomic modification ID | Primary Key |  |  |
| cell_line_id | REFERENCE | Yes |  |  | Aus stem cell registry ID | Foreign Key | [CellLine](#cellline) |  |
| genomic_alteration_id | REFERENCE | Yes |  |  | Genomic alteration ID | Foreign Key | [GenomicAlteration](#genomicalteration) |  |

---

## Group

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| group_id | INT | Yes |  |  | group ID | Primary Key |  |  |
| contact | INT | Yes |  |  | contact ID of the group | Foreign Key | [Contact](#contact) |  |
| name | VARCHAR | Yes | 100 |  | name of the group |  |  |  |
| type | ENUM | Yes |  | Manufacture, Research, Biobank, Other | type of the group |  |  |  |

---

## GroupInstitute

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| group_id | REFERENCE | Yes |  |  | ID of the group | Foreign Key | [Group](#group) |  |
| institute_id | REFERENCE | Yes |  |  | ID of the institute associated with this group | Foreign Key | [Institute](#institute) |  |

---

## HlaResults

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| hlaresults_id | INT | Yes |  |  | HLA Results ID | Primary Key |  |  |
| additionalgenomiccharacterisation_id | INT | Yes |  |  | Addiitonal Genomic Characterisation ID | Foreign Key | [AdditionalGenomicCharacterisation](#additionalgenomiccharacterisation) |  |
| loci_id | INT | Yes |  |  | Loci ID | Foreign Key | [Loci](#loci) |  |
| group | ENUM | No |  | HLA Class I, HLA Class II, Non HLA Genes | HLA type |  |  |  |
| hlaallele_1 | VARCHAR | No | 100 |  | First HLA Allele |  |  |  |
| hlaallele_2 | VARCHAR | No | 100 |  | Second HLA Allele |  |  |  |

---

## HpscScorecard

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| hpsc_scorecard_id | INT | Yes |  |  | hPSC scorecard ID | Primary Key |  |  |
| hpsc_scorecard_ectoderm | ENUM | No |  | TRUE, FALSE | hPSC Scorecard ectoderm |  |  |  |
| hpsc_scorecard_endoderm | ENUM | No |  | TRUE, FALSE | hPSC Scorecard endoderm |  |  |  |
| hpsc_scorecard_mesoderm | ENUM | No |  | TRUE, FALSE | hPSC Scorecard mesoderm |  |  |  |
| hpsc_scorecard_self_renewal | ENUM | No |  | TRUE, FALSE | hPSC Scorecard self-renewal |  |  |  |
| scorecard_file | VARCHAR | No |  |  | hPSC Scorecard file |  |  |  |

---

## Institute

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| institute_id | INT | Yes |  |  | institute ID | Primary Key |  |  |
| city | VARCHAR | Yes |  | List of cities | city name of institution that registered/generated the cell line |  |  |  |
| country | VARCHAR | Yes |  | List of countries | country name of institution that registered/generated the cell line |  |  |  |
| name | VARCHAR | Yes |  | List of institutes + other | name of institution that registered/generated the cell line |  |  |  |

---

## IntegratedVector

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| derivationipsintegratedvector_id | INT | Yes |  |  | ID for record | Primary Key |  |  |
| absence_of_reprogramming_vector | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether the reprogramming vector is absent |  |  |  |
| excisable | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether the integrating vector is designed to be excisable |  |  |  |
| int_rep_trans_type | ENUM | No |  | PiggyBack transposon, Sleeping beauty, other | System used to deliver the vector |  |  |  |
| int_rep_trans_type_other | VARCHAR | No | 250 |  | Free-text to capture other types of system used to deliver the vector |  |  |  |
| int_rep_virus_type | ENUM | No |  | adenovirus, retrovirus, lentivirus, other | Specify virus type if the vector is viral |  |  |  |
| int_rep_virus_type_other | VARCHAR | No | 250 |  | Free-text to capture other type of virus type |  |  |  |
| int_reprogramming_vector | ENUM | No |  | virus, plasmid, transposon, other | Tpe of integrating reprogramming vector |  |  |  |
| int_reprogramming_vector_other | VARCHAR | No | 250 |  | Free-text to capture other type of integrating reprogramming vector |  |  |  |
| silenced | ENUM | No |  | yes, no, unknown | Indicates whether the gene expression has been silenced |  |  |  |
| vector_silencing_notes | VARCHAR | No | 250 |  | Free-text field for additional information on silencing |  |  |  |

---

## IpdGene

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| ipdgene_id | INT | Yes |  |  | IPD Gene ID | Primary Key |  |  |
| allele_1 | VARCHAR | Yes | 100 |  | First allele observed at gene locus |  |  |  |
| allele_2 | VARCHAR | Yes | 100 |  | Second allele observed at gene locus |  |  |  |
| celllinederivationinducedpluripotent_id | REFERENCE | Yes |  |  | iPSC ID | Foreign Key | [CellLineDerivationInducedPluripotent](#celllinederivationinducedpluripotent) |  |
| loci_id | VARCHAR | No |  |  | Loci ID |  |  |  |

---

## Loci

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| loci_id | INT | No |  |  | Loci ID | Primary Key |  |  |
| strbase_id | VARCHAR | Yes | 10 |  | STR Base ID |  |  | https://strbase.nist.gov/Information/Type-18_Record |
| associated_disease | URL | No |  |  | Disease associated with loci |  |  |  |
| chromosome | INT | No |  |  | Chromome location |  |  |  |
| ebi_url | URL | No | 250 |  | Link to EBI/Ensembl entry |  |  |  |
| end | INT | No |  |  | End position |  |  |  |
| genome_version | VARCHAR | No | 100 |  | Genome version  |  |  |  |
| group | ENUM | No |  | Missing | Loci group |  |  |  |
| name | VARCHAR | No | 25 |  | Loci name |  |  |  |
| ncbi_url | URL | No | 250 |  | 	Link to NCBI entry |  |  |  |
| start | INT | No |  |  | Start position |  |  |  |

---

## MediumComponentItems

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| medium_component_items | INT | Yes |  |  | Medium id | Primary Key |  |  |
| name | VARCHAR | Yes | 100 |  | name of item |  |  |  |
| amount | FLOAT | No |  |  | the number of the unit |  |  |  |
| company | TEXT  | No | 100 |  | name of company |  |  |  |
| type | ENUM | No |  | Base Medium, Main Protein, Supplement, Base Coat, Serum | type of medium commercial items |  |  |  |
| unit | VARCHAR | No |  |  | Units for materials |  |  |  |

---

## MicrobiologyVirologyScreening

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| screening_id | INT | Yes |  | TRUE, FALSE | ID of screening information | Primary Key |  |  |
| other | ENUM | Yes |  | Positive, Negative, Not done | Other test performed if there any |  |  |  |
| hep_b | ENUM | No |  | Positive, Negative, Not done | whether perform Hep B test and if result is available, choose from the options |  |  |  |
| hep_c | ENUM | No |  | Positive, Negative, Not done | whether perform Hep C test and if result is available, choose from the options |  |  |  |
| hiv1 | ENUM | No |  | Positive, Negative, Not done | whether perform HIV1 test and if result is available,  choose from options |  |  |  |
| hiv2 | ENUM | No |  | Positive, Negative, Not done | whether perform HIV2 test and if result is available, choose from the options |  |  |  |
| mycoplasma | ENUM | No |  | Positive, Negative, Not done | whether perform Mycoplasma test and if result is available, choose from the options |  |  |  |
| performed | BOOLEAN | No |  | TRUE, FALSE | whether the Microbiology_Virology_Screening was performed |  |  |  |

---

## NonIntegratedVector

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| derivationipsintegratedvector_id | INT | Yes |  |  | ID for record | Primary Key |  |  |
| non_int_vector | ENUM | Yes |  | episomal, sendai virus, aav, other | name or type of non-integrating vector  |  |  |  |
| detected_reprogramming_vector | ENUM | No |  | yes, no, unknown | Indicates whether any reprogramming vectors were detected |  |  |  |
| detected_reprogramming_vector_notes | VARCHAR | No | 250 |  | Notes on how vector detection was performed  |  |  |  |
| non_int_vector_other | VARCHAR | No | 250 |  | Free-text to capture other type of non-integrating vector  |  |  |  |

---

## Ontology

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| ontology_id | INT | Yes |  |  | Ontology ID | Primary Key |  |  |
| ontology_identifier | ONTOLOGY | Yes |  |  | Identifier of ontology in ontology database |  |  |  |
| definition | VARCHAR | No |  |  | Definition of ontology term |  |  |  |
| lowest_lvl_for_search | BOOLEAN | No |  | TRUE, FALSE | TBA - level for filtering and searching |  |  |  |
| ontology_db_name | VARCHAR | No |  |  | Name of ontology database |  |  |  |
| term | VARCHAR | No |  |  | Text label for ontology_identifier |  |  |  |
| url | URL | No | 100 |  | URL to web entry for ontology_identifier |  |  |  |

---

## OntologyParentChild

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| ontologyparentchild_id | INT | Yes |  |  | ontologyparentchild ID | Primary Key |  |  |
| child | INT | No |  |  | ID of child/ren of ontology term |  |  |  |
| parent | INT | No |  |  | ID of parent of ontology term |  |  |  |

---

## OntologySynonym

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| ontologysynonym_id | INT | Yes |  |  | No description provided | Primary Key |  |  |
| ontology_id | INT | No |  |  | No description provided |  |  |  |
| synonym_of_ontology_term | VARCHAR | No |  |  | No description provided |  |  |  |

---

## Publication

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| publication_id | VARCHAR | Yes | 100 |  | Local identifier for publications | Primary Key |  |  |
| doi | URL | Yes | 100 |  | DOI ID of the publication |  |  |  |
| first_author | VARCHAR | No | 100 |  | Name of first author |  |  |  |
| journal | ENUM | No | 100 |  | journal name |  |  |  |
| last_author | VARCHAR | No | 100 |  | Name of last author |  |  |  |
| pmid | VARCHAR | No | 100 |  | PubMed ID of the publication |  |  |  |
| title | VARCHAR | No | 100 |  | Title of the publication |  |  |  |
| year | DATE | No |  | Drop-down list of years | year of publication |  |  |  |

---

## RegUser

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| user_id | INT | Yes |  |  | user ID who registered the cell line | Primary Key |  |  |
| email | VARCHAR | Yes | 250 |  | Email of the user |  |  |  |
| first_name | CHAR | Yes | 20 |  | First name of the user |  |  |  |
| group_id | INT | Yes |  |  | group ID from which the user belongs to | Foreign Key | [Group](#group) |  |
| last_name | CHAR | Yes | 20 |  | Last name of the user |  |  |  |
| orcid_id | INT | Yes |  |  | ORCID ID of the user |  |  |  |
| password | VARCHAR | Yes | 25 |  | Hashed password of the user |  |  |  |

---

## RegistrationRequirements

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| ethics | INT | Yes |  |  | ethics ID associated with the cell line | Foreign Key | [Ethics](#ethics) |  |
| reg_user | INT | Yes |  |  | user ID who registered the cell line | Foreign Key | [RegUser](#reguser) |  |
| submitted_ethics_clearance | BOOLEAN | Yes |  | TRUE, FALSE | whether ethics clearance has been submitted |  |  |  |

---

## SmallMolecule

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| smallmolecule_id | INT | Yes |  |  | Small molecule ID | Primary Key |  |  |
| chembank_id | URL | Yes | 100 |  | Chembank database id for the small molecule |  |  |  |
| name | VARCHAR | Yes | 100 |  | Small molecule name |  |  |  |
| vectorfreeprogramming_id | INT | Yes |  |  | Vector-free reprogramming ID | Foreign Key | [VectorFreeReprogramming](#vectorfreereprogramming) |  |

---

## StrOrFingerprinting

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| id | INT | Yes |  |  | StrOrFingerprinting ID | Primary Key |  |  |
| Additonal_Genomic_Characterisation_ID | INT | Yes |  |  | additionalgenomiccharacterisation_id |  |  |  |
| loci_id | INT | Yes |  |  | Loci ID | Foreign Key | [Loci](#loci) |  |
| strallele_1 | VARCHAR | No | 100 |  | First STR allele at a given locus |  |  |  |
| strallele_2 | VARCHAR | No | 100 |  | Second STR allele at a given locus |  |  |  |

---

## Synonym

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| synonym_id | INT | Yes |  |  | ID for record | Primary Key |  |  |
| cell_line_id | VARCHAR | Yes |  |  | Aus stem cell registry ID | Foreign Key | [CellLine](#cellline) |  |
| synonym | VARCHAR | No | 25 |  | Cell line synonym |  |  |  |

---

## UndifferentiatedCharacterisation

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| epi_pluri_mcpg | BOOLEAN | Yes |  | TRUE, FALSE | EpiPluri mCpG for undifferentiated characterisation |  |  |  |
| epi_pluri_oct4 | BOOLEAN | Yes |  | TRUE, FALSE | EpiPluri OCT4 for undifferentiated characterisation |  |  |  |
| epi_pluri_score | INT | Yes |  |  | EpiPluri Score for undifferentiated characterisation |  |  |  |
| epi_pluri_score_flag | BOOLEAN | Yes |  |  | EpiPluri Score for undifferentiated characterisation |  |  |  |
| hpsc_scorecard_id | INT | Yes |  |  | hPSC scorecard ID | Foreign Key | [HpscScorecard](#hpscscorecard) |  |
| markers | VARCHAR | Yes | 100 |  | Marker list shown for undifferentiation characterisation |  |  |  |
| pluri_novelty_score | FLOAT | Yes |  |  | Pluritest_novelty_score for undifferentiated characterisation |  |  |  |
| pluri_test | BOOLEAN | Yes |  | TRUE, FALSE | Whether there is a pluripotency test for undifferentiated characterisation |  |  |  |
| pluri_test_microarray_url | URL | Yes | 100 |  | Pluritest_url_mircoarray_data for undifferentiated characterisation |  |  |  |
| pluri_test_score | FLOAT | Yes |  |  | Pluritest_score for undifferentiated characterisation |  |  |  |
| morphology_file | FILE | No | 100 |  | Dataset showing cell morphology |  |  |  |
| other | VARCHAR | No | 100 |  | Other test if there any |  |  |  |

---

## UndifferentiatedCharacterisationMarkerExpressionMethod

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| undifferentiationcharacterisationmarkerexpressionmethod_id | INT | Yes |  |  | Undifferentiated Characterisation Marker Expression Method ID | Primary Key |  |  |
| characterisation_method_id | VARCHAR | No | 100 |  | Characterisation method | Primary Key |  |  |
| undifferentiationcharacterisation_id | INT | Yes |  |  | Undifferentiated Characterisation Marker Expression Methods | Foreign Key | [UndifferentiatedCharacterisation](#undifferentiatedcharacterisation) |  |
| characterisation_method_file | FILE | No | 100 |  | File or URL containing result (image, data, etc.) |  |  |  |
| marker | ENUM | No |  | Missing | Marker used to assess undifferentiated state |  |  |  |

---

## VectorFreeReprogramming

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| vectorfreereprogramming_id | INT | Yes |  |  | ID for record | Primary Key |  |  |
| celllinederivationinducedpluripotent_id | INT | Yes |  |  | Cell line ips ID | Foreign Key | [CellLineDerivationInducedPluripotent](#celllinederivationinducedpluripotent) |  |
| kit_name | VARCHAR | Yes | 250 |  | Name of the commercial kit used for vector-free reprogramming |  |  |  |
| mRNA | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether mRNA was used to induce reprogramming |  |  |  |
| miRNA | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether micro-RNA was used to induce reprogramming |  |  |  |
| protein | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether protein was used to induce reprogramming |  |  |  |
| small_molecule | BOOLEAN | Yes |  | TRUE, FALSE | Indicates whether small molecules were used to induce reprogramming |  |  |  |

---

## VectorFreeReprogrammingGenes

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| vectorfreereprogramminggene_id | INT | Yes |  |  | Vector-free reprogramming gene ID | Primary Key |  |  |
| allele_1 | VARCHAR | Yes | 100 |  | First allele observed at gene locus |  |  |  |
| allele_2 | VARCHAR | Yes | 100 |  | Second allele observed at gene locus |  |  |  |
| type | ENUM | Yes |  | mrna, protein, mirna | Type of genomic feature |  |  |  |
| vectorfreereprogramming_id | INT | Yes |  |  | Vector-free reprogramming ID | Foreign Key | [VectorFreeReprogramming](#vectorfreereprogramming) |  |
| loci_id | INT | No |  |  | Loci ID |  |  |  |

---

## XRefs

| Field Name | Data Type | Required | Max Length | Accepted Values | Description | Key Type | Nested Model | External Links |
|------------|-----------|----------|------------|-----------------|-------------|----------|--------------|----------------|
| xref_id | INT | Yes |  |  | Identifier for cross-reference entry | Primary Key |  |  |
| cell_line_id | REFERENCE | Yes |  |  | Aus stem cell registry ID | Foreign Key | [CellLine](#cellline) |  |
| db_id | VARCHAR | Yes | 100 |  | ID of the external database the cell line is referenced in |  |  |  |
| db_name | VARCHAR | Yes | 100 |  | Name of the external database the cell line is referenced in |  |  |  |
| db_url | VARCHAR | Yes | 250 |  | URL pointing to the external database the cell line is referenced in |  |  |  |
| xref_url | VARCHAR | Yes | 250 |  | Full URL pointing to the external database entry for the cell line |  |  |  |

---

## Legend

- **✅ Yes**: Field is required and must have a value
- **❌ No**: Field is optional and can be empty
- **Primary Key**: Unique identifier for this table
- **Reference to [Table]**: Links to another table (click to navigate)
- **Ontology Controlled**: Values must come from a specific controlled vocabulary
- **Enum**: Field accepts only the listed values

---

*This documentation is automatically generated from the Pydantic models.*
*Last updated: 2025-10-02 12:11:51*