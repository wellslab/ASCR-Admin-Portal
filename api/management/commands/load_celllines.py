import json
import os
import time
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from api.models import CellLineTemplate


class Command(BaseCommand):
    help = 'Load cell line data from JSON files into the CellLineTemplate model'

    def add_arguments(self, parser):
        parser.add_argument(
            'json_directory',
            type=str,
            help='Directory containing JSON files to load'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be imported without actually importing',
        )
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help='Overwrite existing records with same hpscreg_id',
        )

    def handle(self, *args, **options):
        json_directory = options['json_directory']
        dry_run = options['dry_run']
        overwrite = options['overwrite']

        # Validate directory exists
        if not os.path.exists(json_directory):
            raise CommandError(f'Directory "{json_directory}" does not exist.')

        # Find all JSON files
        json_files = []
        for root, dirs, files in os.walk(json_directory):
            for file in files:
                if file.lower().endswith('.json'):
                    json_files.append(os.path.join(root, file))

        if not json_files:
            self.stdout.write(
                self.style.WARNING(f'No JSON files found in "{json_directory}"')
            )
            return

        self.stdout.write(f'Found {len(json_files)} JSON files to process')

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No data will be saved'))

        successful_imports = 0
        failed_imports = 0
        skipped_imports = 0

        start_time = time.time()

        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                # Extract hpscreg_id to check for existing records
                hpscreg_id = data.get('CellLine_hpscreg_id')
                if not hpscreg_id:
                    self.stdout.write(
                        self.style.ERROR(f'No hpscreg_id found in {json_file}')
                    )
                    failed_imports += 1
                    continue

                # Check if record already exists
                existing_record = None
                try:
                    existing_record = CellLineTemplate.objects.get(
                        CellLine_hpscreg_id=hpscreg_id
                    )
                except CellLineTemplate.DoesNotExist:
                    pass

                if existing_record and not overwrite:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Record {hpscreg_id} already exists, skipping '
                            f'(use --overwrite to replace): {json_file}'
                        )
                    )
                    skipped_imports += 1
                    continue

                if dry_run:
                    action = "UPDATE" if existing_record else "CREATE"
                    self.stdout.write(f'{action}: {hpscreg_id} from {json_file}')
                    successful_imports += 1
                    continue

                # Create or update the record
                with transaction.atomic():
                    # Prepare data for model creation/update
                    model_data = self.prepare_model_data(data)
                    
                    if existing_record:
                        # Update existing record
                        for field, value in model_data.items():
                            setattr(existing_record, field, value)
                        existing_record.save()
                        self.stdout.write(
                            self.style.SUCCESS(f'Updated: {hpscreg_id}')
                        )
                    else:
                        # Create new record
                        CellLineTemplate.objects.create(**model_data)
                        self.stdout.write(
                            self.style.SUCCESS(f'Created: {hpscreg_id}')
                        )

                successful_imports += 1

            except json.JSONDecodeError as e:
                self.stdout.write(
                    self.style.ERROR(f'Invalid JSON in {json_file}: {e}')
                )
                failed_imports += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error processing {json_file}: {e}')
                )
                failed_imports += 1

        end_time = time.time()
        processing_time = end_time - start_time

        # Summary
        self.stdout.write("\n" + "="*50)
        self.stdout.write("IMPORT SUMMARY")
        self.stdout.write("="*50)
        self.stdout.write(f'Total files processed: {len(json_files)}')
        self.stdout.write(f'Successful imports: {successful_imports}')
        self.stdout.write(f'Failed imports: {failed_imports}')
        self.stdout.write(f'Skipped imports: {skipped_imports}')
        self.stdout.write(f'Processing time: {processing_time:.2f} seconds')
        
        if not dry_run:
            total_records = CellLineTemplate.objects.count()
            self.stdout.write(f'Total records in database: {total_records}')

        if successful_imports > 0 and not dry_run:
            # Performance test
            self.stdout.write("\n" + "="*50)
            self.stdout.write("PERFORMANCE TEST")
            self.stdout.write("="*50)
            self.perform_performance_test()

    def prepare_model_data(self, json_data):
        """
        Prepare JSON data for model creation by handling field mappings and defaults.
        """
        model_data = {}
        
        # Define all the model fields and their mappings
        field_mappings = {
            # Basic CellLine fields
            'CellLine_hpscreg_id': 'CellLine_hpscreg_id',
            'CellLine_alt_names': 'CellLine_alt_names',
            'CellLine_cell_line_type': 'CellLine_cell_line_type',
            'CellLine_source_cell_type': 'CellLine_source_cell_type',
            'CellLine_source_tissue': 'CellLine_source_tissue',
            'CellLine_source': 'CellLine_source',
            'CellLine_frozen': 'CellLine_frozen',
            
            # Publication fields
            'CellLine_publication_doi': 'CellLine_publication_doi',
            'CellLine_publication_pmid': 'CellLine_publication_pmid',
            'CellLine_publication_title': 'CellLine_publication_title',
            'CellLine_publication_first_author': 'CellLine_publication_first_author',
            'CellLine_publication_last_author': 'CellLine_publication_last_author',
            'CellLine_publication_journal': 'CellLine_publication_journal',
            'CellLine_publication_year': 'CellLine_publication_year',
            
            # Donor fields - handle the name/description mapping
            'CellLine_donor_age': 'CellLine_donor_age',  # Now handles both numbers and "Newborn"
            'CellLine_donor_sex': 'CellLine_donor_sex',
            'CellLine_donor_disease': 'CellLine_donor_disease_name',  # Map to disease_name
            
            # Contact fields
            'CellLine_contact_name': 'CellLine_contact_name',
            'CellLine_contact_email': 'CellLine_contact_email',
            'CellLine_contact_phone': 'CellLine_contact_phone',
            'CellLine_maintainer': 'CellLine_maintainer',
            'CellLine_producer': 'CellLine_producer',
            
            # Genomic Alteration fields
            'GenomicAlteration_performed': 'GenomicAlteration_performed',
            'GenomicAlteration_mutation_type': 'GenomicAlteration_mutation_type',
            'GenomicAlteration_cytoband': 'GenomicAlteration_cytoband',
            'GenomicAlteration_delivery_method': 'GenomicAlteration_delivery_method',
            'GenomicAlteration_loci_name': 'GenomicAlteration_loci_name',
            'GenomicAlteration_loci_chromosome': 'GenomicAlteration_loci_chromosome',
            'GenomicAlteration_loci_start': 'GenomicAlteration_loci_start',
            'GenomicAlteration_loci_end': 'GenomicAlteration_loci_end',
            'GenomicAlteration_loci_group': 'GenomicAlteration_loci_group',
            'GenomicAlteration_loci_disease': 'GenomicAlteration_loci_disease',
            'GenomicAlteration_description': 'GenomicAlteration_description',
            'GenomicAlteration_genotype': 'GenomicAlteration_genotype',
            
            # Pluripotency Characterisation fields
            'PluripotencyCharacterisation_cell_type': 'PluripotencyCharacterisation_cell_type',
            'PluripotencyCharacterisation_shown_potency': 'PluripotencyCharacterisation_shown_potency',
            'PluripotencyCharacterisation_marker_list': 'PluripotencyCharacterisation_marker_list',
            'PluripotencyCharacterisation_method': 'PluripotencyCharacterisation_method',
            'PluripotencyCharacterisation_differentiation_profile': 'PluripotencyCharacterisation_differentiation_profile',
            
            # Reprogramming Method fields
            'ReprogrammingMethod_vector_type': 'ReprogrammingMethod_vector_type',
            'ReprogrammingMethod_vector_name': 'ReprogrammingMethod_vector_name',
            'ReprogrammingMethod_kit': 'ReprogrammingMethod_kit',
            'ReprogrammingMethod_detected': 'ReprogrammingMethod_detected',
            
            # Genomic Characterisation fields
            'GenomicCharacterisation_passage_number': 'GenomicCharacterisation_passage_number',
            'GenomicCharacterisation_karyotype': 'GenomicCharacterisation_karyotype',
            'GenomicCharacterisation_karyotype_method': 'GenomicCharacterisation_karyotype_method',
            'GenomicCharacterisation_summary': 'GenomicCharacterisation_summary',
            
            # STR Results fields - handle underscore difference
            'STRResults_exists': 'STR_Results_exists',
            'STRResults_loci': 'STR_Results_loci',
            'STRResults_group': 'STR_Results_group',
            'STRResults_allele_1': 'STR_Results_allele_1',
            'STRResults_allele_2': 'STR_Results_allele_2',
            
            # Induced Derivation fields
            'InducedDerivation_i_source_cell_type': 'InducedDerivation_i_source_cell_type',
            'InducedDerivation_i_cell_origin': 'InducedDerivation_i_cell_origin',
            'InducedDerivation_derivation_year': 'InducedDerivation_derivation_year',
            'InducedDerivation_vector_type': 'InducedDerivation_vector_type',
            'InducedDerivation_vector_name': 'InducedDerivation_vector_name',
            'InducedDerivation_kit_name': 'InducedDerivation_kit_name',
            
            # Microbiology/Virology Screening fields
            'MicrobiologyVirologyScreening_performed': 'MicrobiologyVirologyScreening_performed',
            'MicrobiologyVirologyScreening_hiv1': 'MicrobiologyVirologyScreening_hiv1',
            'MicrobiologyVirologyScreening_hiv2': 'MicrobiologyVirologyScreening_hiv2',
            'MicrobiologyVirologyScreening_hep_b': 'MicrobiologyVirologyScreening_hep_b',
            'MicrobiologyVirologyScreening_hep_c': 'MicrobiologyVirologyScreening_hep_c',
            'MicrobiologyVirologyScreening_mycoplasma': 'MicrobiologyVirologyScreening_mycoplasma',
            'MicrobiologyVirologyScreening_other': 'MicrobiologyVirologyScreening_other',
            'MicrobiologyVirologyScreening_other_result': 'MicrobiologyVirologyScreening_other_result',
            
            # Culture Medium fields
            'CultureMedium_co2_concentration': 'CultureMedium_co2_concentration',
            'CultureMedium_o2_concentration': 'CultureMedium_o2_concentration',
            'CultureMedium_passage_method': 'CultureMedium_passage_method',
            'CultureMedium_base_medium': 'CultureMedium_base_medium',
            'CultureMedium_base_coat': 'CultureMedium_base_coat',
            
            # Ethics field (handled separately as JSON)
            'Ethics': 'Ethics',
        }

        # Map JSON data to model fields
        for model_field, json_field in field_mappings.items():
            if json_field in json_data:
                value = json_data[json_field]
                # Handle None values and empty strings appropriately
                if value is not None and value != '':
                    model_data[model_field] = value

        # Handle JSON fields specially
        if 'CellLine_alt_names' in json_data:
            model_data['CellLine_alt_names'] = json_data['CellLine_alt_names'] or []
        
        if 'Ethics' in json_data:
            model_data['Ethics'] = json_data['Ethics'] or []
            
        if 'PluripotencyCharacterisation_marker_list' in json_data:
            model_data['PluripotencyCharacterisation_marker_list'] = (
                json_data['PluripotencyCharacterisation_marker_list'] or []
            )

        return model_data

    def perform_performance_test(self):
        """
        Test query performance on the loaded data.
        """
        try:
            # Test 1: Count all records
            start_time = time.time()
            count = CellLineTemplate.objects.count()
            end_time = time.time()
            self.stdout.write(f'Count query: {count} records in {end_time - start_time:.4f}s')

            # Test 2: List first 10 records
            start_time = time.time()
            records = list(CellLineTemplate.objects.all()[:10])
            end_time = time.time()
            self.stdout.write(f'List query (10 records): {end_time - start_time:.4f}s')

            # Test 3: Search by cell line type
            start_time = time.time()
            hiPSC_count = CellLineTemplate.objects.filter(
                CellLine_cell_line_type='hiPSC'
            ).count()
            end_time = time.time()
            self.stdout.write(f'Filter query (hiPSC): {hiPSC_count} records in {end_time - start_time:.4f}s')

            # Performance assessment
            if end_time - start_time < 1.0:
                self.stdout.write(self.style.SUCCESS('✓ Performance: All queries under 1 second'))
            else:
                self.stdout.write(self.style.WARNING('⚠ Performance: Some queries over 1 second'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Performance test failed: {e}')) 