# Instructions
The prompt and context contains a research article, the name of a stem cell line, and a JSON schema.
Your task is to extract information about the stem cell line from the research article.
Format your response as a JSON object, enclosed in a JSON codeblock, according to the schema provided in the context.
The rest of this document provides instructions on how to retrieve information for the cell line.

# Cell line information retrieval
Retieve information for the following entities according to the schema:

| Field                     | Where to find the information / how to infer the information                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CellLine.hpscreg_id       | Fill this with the stem cell line name given in the prompt.                                                                                                                                       |
| CellLine.alt_names        | Fill this with alternative names for the cell line if they were used in the article.                                                                                                              |
| CellLine.cell_line_type   | Select the most appropriate literal defined in the schema that corresponds to the type of the stem cell line. e.g. hiPSC or ESC                                                                   |
| CellLine.source_cell_type | Fill this with the type of cell that the cell line was derived from.                                                                                                                              |
| CellLine.publication      | Fill this with the publication details of the article.                                                                                                                                            |
| CellLine.donor            | Fill this with information about the donor of the cell line.                                                                                                                                      |
| CellLine.source_tissue    | Fill this with the location in the body from which the cell line was taken. This should be a tissue, or blood. This should not be a type of cell, but rather more a more general biopsy location. |
| CellLine.source           | If the cell line was derived firsthand from a patient, write donor. Otherwise if the cell line was sourced from an external institution, write external institution.                              |
| CellLine.contact          | Fill this with details about who to contact if someone wanted to ask questions about the cell line. A good contact would be someone from the institution that keeps/owns/maintains the cell line. |
| CellLine.maintainer       | This would be information about which institution is responsible for maintaining the cell line.                                                                                                   |
| CellLine.producer         | This would be information about which institution produced or manufactured the cell line. It might be same as the maintainer in some cases, but not necessarily so.                               |
| CellLine.frozen           | Set this equal to true if there is a stocked/archived date for the cell line mentioned in the article. Otherwise set it equal to false.                                                           |
|                           |                                                                                                                                                                                                   |
## Genomic alteration information retrieval 

Retrieve the following information about what genomic modifications / alterations were performed on the cell line:

| Field                             | Information retrieval instructions                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| GenomicAlteration.mutation_type   | Select the best matching literal in the schema that describes the mutation type for the genomic alteration     |
| GenomicAlteration.cytoband        |                                                                                                                |
| GenomicAlteration.delivery_method | Select the best matching literal in the schema for how the genomic modification was delivered to the cell line |
| GenomicAlteration.loci_name       | Write the loci name of the genomic modification                                                                |
| GenomicAlteration.loci_start      | Write the loci start position                                                                                  |
| GenomicAlteration.loci_end        | Write the loci end position                                                                                    |
| GenomicAlteration.loci_group      | Write the loci group name                                                                                      |
| GenomicAlteration.loci_disease    | Write the name of the disease associated with the loci                                                         |
| GenomicAlteration.description     | Write a description of the genomic modification that was performed on the cell line                            |
| GenomicAlteration.genotype        | Write the genotype for this genomic modification                                                               |
| GenomicAlteration.performed       | Write true if a genomic alteration was performed on the cell line and false otherwise                          |


## Pluripotency characterisation information retrieval
Retrieve information for the following entities regarding how pluripotency was characterised for the cell line:

| Field                                                | Information retrieval instructions                                                                               |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| PluripotencyCharacterisation.cell_type               | Select the best matching literal in the schema for which cell type was used in the pluripotency characterisation |
| PluripotencyCharacterisation.shown_potency           | Set to true if potency was reported in the article and false otherwise                                           |
| PluripotencyCharacterisation.marker_list             | Write a list of markers used in the pluripotency charactersiation                                                |
| PluripotencyCharacterisation.method                  | State the method used for pluripotency characterisation                                                          |
| PluripotencyCharacterisation.differentiation_profile | Select the best matching literal in the schema for the differentiation profile                                   |


## Reprogramming method information retrieval

If the cell line is an induced pluropotent stem cell, retrieve the following information about the reprogramming procedure, otherwise, leave empty strings in the fields:

| Field                           | Information retrieval instructions                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| ReprogrammingMethod.vector_type | Select the best matching literal for the vector type for the reprogramming procedure |
| ReprogrammingMethod.vector_name | Write the name of the vector                                                         |
| ReprogrammingMethod.kit         | Write the name of the reprogramming kit used                                         |
| ReprogrammingMethod.detected    | Write true if there was any reprogramming method detected and false otherwise        |


## Genomic characterisation information retrieval 

Retrieve information for the following entities according to the schema:

| Field                                    | Information retrieval instructions                                                                                                                                                                         |     |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| GenomicCharacterisation.passage_number   | Write the passage number used in the genomic characterisation procedure for the cell line.                                                                                                                 |     |
| GenomicCharacterisation.karyotype        | Write the karyotype of the cell line. This should at minimum include information about species and sex for the cell line. e.g. 46, XX.<br>“Normal” is not a satisfactory response regarding the karyotype. |     |
| GenomicCharacterisation.karyotype_method | Select the most appropriate literal in the schema that matches the karyotyping method used for the cell line.                                                                                              |     |
| GenomicCharacterisation.summary          | Write a clear summary of the karyotyping procedure.                                                                                                                                                        |     |



## STR fingerprinting information retrieval

If short tandem repeat fingerprinting was performed on the cell line retrieve information for the following entities, otherwise, leave empty strings in the fields:

| Field                | Information retrieval instructions                                                |
| -------------------- | --------------------------------------------------------------------------------- |
| STR_results.exists   | Set this to true if STR fingerprinting was done and false otherwise.              |
| STR_results.loci     | Fill this with information about the loci where the str fingerprint was performed |
| STR_results.group    | Select the most appropriate literal stated in the schema for this field.          |
| STR_results.allele_1 | State the first allele for the STR fingerprinting                                 |
| STR_results.allele_2 | State the second allele for the STR fingerprinting results                        |

## Human induced pluropotent stem cells information retrieval

If the cell line is an human induced pluripotent stem cell (hiPSC) then retrieve information for the following entities, otherwise, write empty strings into the fields otherwise:

| Field                                | Information retrieval instructions                                                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| InducedDerivation.i_source_cell_type | Get the cell type for the source cell of the cell line.                                                                                    |
| InducedDerivation.i_cell_origin      | Get the “tissue of origin” for the source cell of the cell line. For example: the tissue of origin might be the liver or the blood.        |
| InducedDerivation.derivation_year    | Get the year the stem cell line was first derived.                                                                                         |
| InducedDerivation.vector_type        | State the type of vector that was used to reprogram / induce pluripotency by selecting the best available literal according to the schema. |
| InducedDerivation.vector_name        | State the name of the reprogramming vector.                                                                                                |
| InducedDerivation.kit_name           | State the name of the reprogramming kit that was used.                                                                                     |


## Embryonic stem cells information retrieval

If the cell line is an embryonic stem cell (ESC) then retrieve information for the following entities, otherwise write empty strings into the fields:

| Field                                              | Information retrieval instructions                                |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| EmbryonicDerivation.embryo_stage                   | State what stage the embryo was at when the cell line was derived |
| EmbryonicDerivation.zp_removal_technique           |                                                                   |
| EmbryonicDerivation.cell_seeding                   |                                                                   |
| EmbryonicDerivation.e_preimplant_genetic_diagnosis |                                                                   |

## Ethics information retrieval 

Retrieve the following information regarding the ethics clearance of the cell line. Note that some cell lines might have multiple ethics clearances, in this case, create multiple Ethics entities which contain the individual clearance information and output this list of Ethics entities.

| Field                     | Information retrieval instructions                       |
| ------------------------- | -------------------------------------------------------- |
| Ethics.ethics_number      | Write the ethics number for the cell line                |
| Ethics.approval_date      | Write the date the ethics approval was granted           |
| Ethics.institutional_HREC | Write the institution associated with the ethics number. |

## Microbiology / virology screening information retrieval 

If microbiology / virology screening was performed for the cell line, retrieve information for the following entities, otherwise leave the fields as empty strings:

| Field                                      | Information retrieval instructions                                                |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| MicrobiologyVirologyScreening.performed    | Set to true if microbiology/virology screening was performed and false otherwise. |
| MicrobiologyVirologyScreening.hiv1         |                                                                                   |
| MicrobiologyVirologyScreening.hiv2         |                                                                                   |
| MicrobiologyVirologyScreening.hep_b        |                                                                                   |
| MicrobiologyVirologyScreening.hep_c        |                                                                                   |
| MicrobiologyVirologyScreening.mycoplasma   |                                                                                   |
| MicrobiologyVirologyScreening.other        |                                                                                   |
| MicrobiologyVirologyScreening.other_result |                                                                                   |

## Culture medium information retrieval

Retrieve the following information regarding the culture conditions and medium of the cell line:

| Field                                  | Information retrieval instructions                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| CultureMedium.co2_concentration        | Get the carbon dioxide concentration used to culture the cell line.                                                                         |
| CultureMedium.o2_concentration         | Get the oxygen concentration used to culture the cell line. If this is not stated in the article then use atmospheric oxygen concentration. |
| CultureMedium.rho_kinase_sed           |                                                                                                                                             |
| CultureMedium.passage_method           | State the passage method that was used to culture the cell line. Select the best response option available in the schema.                   |
| CultureMedium.other_passage_method     |                                                                                                                                             |
| CultureMedium.methods_io_id            |                                                                                                                                             |
| CultureMedium.base_medium              | Write the base medium used to culture the cell line                                                                                         |
| CultureMedium.base_coat                | Write the base coat used in culturing the cell line                                                                                         |
| MediumComponents.medium_component_name |                                                                                                                                             |
| MediumComponents.company               | State the name of the company that manufactures the culture medium.                                                                         |
| MediumComponents.component_type        | Select the best literal, according to the schema, that describes the type of component for this culture medium.                             |


