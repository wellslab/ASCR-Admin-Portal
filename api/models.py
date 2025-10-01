from django.db import models
from django.utils import timezone
from datetime import timedelta
from pydantic import BaseModel
from typing import List, Literal



class Ethics(BaseModel):
    ethics_number: str
    institute: str
    approval_date: str



class CellLineTemplatePydantic(BaseModel):
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
    Ethics: List[Ethics]
    
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
    
    # Work status for curation workflow
    work_status: Literal['in progress', 'for review', 'reviewed']





class Article(models.Model):
    
    # Fields
    filename = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
    pubmed_id = models.IntegerField(null=True, blank=True)
    
    is_curated = models.BooleanField(default=False)
    
    transcription_status = models.CharField(max_length=100, default='pending')
    transcription_content = models.TextField(blank=True)
    
    # Foreign key to CurationObjects
    curation_status = models.CharField(max_length=100, default='pending')
    curation_object = models.ForeignKey('CurationObject', on_delete=models.CASCADE, null=True, blank=True)
    
    # Curation error tracking
    curation_error = models.TextField(blank=True, null=True)
    
    # Curation processing timestamp
    curation_started_at = models.DateTimeField(null=True, blank=True)
    
    def start_curation(self):
        """Mark article as starting curation process"""
        self.curation_status = 'processing'
        self.curation_started_at = timezone.now()
        self.curation_error = None
        self.save()

    def complete_curation(self):
        """Mark article as successfully curated"""
        self.curation_status = 'completed'
        self.curation_started_at = None
        self.curation_error = None
        self.save()

    def fail_curation(self, error_message):
        """Mark article as failed curation with error"""
        self.curation_status = 'failed'
        self.curation_started_at = None
        self.curation_error = error_message
        self.save()
    
    

class CurationObject(models.Model):
    hpscreg_id = models.CharField(max_length=100, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
        
        
        
        
class CellLineTemplate(models.Model):
    """
    Django model representing cell line data with JSON storage for complex nested structures.
    Based on the Pydantic CellLineTemplate schema.
    """
    
    # Primary identifier
    CellLine_hpscreg_id = models.CharField(max_length=100, unique=True, primary_key=True)
    
    # Basic CellLine fields
    CellLine_alt_names = models.JSONField(default=list)  # List[str]
    CellLine_cell_line_type = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    CellLine_source_cell_type = models.CharField(max_length=200)
    CellLine_source_tissue = models.CharField(max_length=200)
    CellLine_source = models.CharField(max_length=200)
    CellLine_frozen = models.BooleanField(default=False)
    
    # Publication fields
    CellLine_publication_doi = models.CharField(max_length=200, blank=True)
    CellLine_publication_pmid = models.CharField(max_length=50, blank=True)
    CellLine_publication_title = models.TextField(blank=True)
    CellLine_publication_first_author = models.CharField(max_length=200, blank=True)
    CellLine_publication_last_author = models.CharField(max_length=200, blank=True)
    CellLine_publication_journal = models.CharField(max_length=200, blank=True)
    CellLine_publication_year = models.IntegerField(null=True, blank=True)
    
    # Donor fields  
    CellLine_donor_age = models.CharField(max_length=20, blank=True, null=True)  # Changed to CharField to handle "Newborn"
    CellLine_donor_sex = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    CellLine_donor_disease = models.CharField(max_length=500, blank=True)
    
    # Contact fields
    CellLine_contact_name = models.CharField(max_length=200, blank=True)
    CellLine_contact_email = models.EmailField(blank=True)
    CellLine_contact_phone = models.CharField(max_length=50, blank=True)
    CellLine_maintainer = models.CharField(max_length=200, blank=True)
    CellLine_producer = models.CharField(max_length=200, blank=True)
    
    # Genomic Alteration fields
    GenomicAlteration_performed = models.BooleanField(default=False)
    GenomicAlteration_mutation_type = models.CharField(max_length=100, blank=True)  # Removed choices constraint
    GenomicAlteration_cytoband = models.CharField(max_length=100, blank=True)
    GenomicAlteration_delivery_method = models.CharField(max_length=200, blank=True)
    GenomicAlteration_loci_name = models.CharField(max_length=200, blank=True)
    GenomicAlteration_loci_chromosome = models.CharField(max_length=10, blank=True)
    GenomicAlteration_loci_start = models.IntegerField(null=True, blank=True)
    GenomicAlteration_loci_end = models.IntegerField(null=True, blank=True)
    GenomicAlteration_loci_group = models.CharField(max_length=200, blank=True)
    GenomicAlteration_loci_disease = models.CharField(max_length=500, blank=True)
    GenomicAlteration_description = models.TextField(blank=True)
    GenomicAlteration_genotype = models.CharField(max_length=500, blank=True)
    
    # Pluripotency Characterisation fields
    PluripotencyCharacterisation_cell_type = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    PluripotencyCharacterisation_shown_potency = models.BooleanField(default=False)
    PluripotencyCharacterisation_marker_list = models.JSONField(default=list)  # List[str]
    PluripotencyCharacterisation_method = models.CharField(max_length=200, blank=True)
    PluripotencyCharacterisation_differentiation_profile = models.CharField(max_length=100, blank=True)  # Removed choices constraint
    
    # Reprogramming Method fields
    ReprogrammingMethod_vector_type = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    ReprogrammingMethod_vector_name = models.CharField(max_length=200, blank=True)
    ReprogrammingMethod_kit = models.CharField(max_length=200, blank=True)
    ReprogrammingMethod_detected = models.BooleanField(default=False)
    
    # Genomic Characterisation fields
    GenomicCharacterisation_passage_number = models.IntegerField(null=True, blank=True)
    GenomicCharacterisation_karyotype = models.CharField(max_length=500, blank=True)
    GenomicCharacterisation_karyotype_method = models.CharField(max_length=100, blank=True)  # Removed choices constraint
    GenomicCharacterisation_summary = models.TextField(blank=True)
    
    # STR Results fields
    STRResults_exists = models.BooleanField(default=False)
    STRResults_loci = models.IntegerField(null=True, blank=True)
    STRResults_group = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    STRResults_allele_1 = models.CharField(max_length=100, blank=True)
    STRResults_allele_2 = models.CharField(max_length=100, blank=True)
    
    # Induced Derivation fields
    InducedDerivation_i_source_cell_type = models.CharField(max_length=200, blank=True)
    InducedDerivation_i_cell_origin = models.CharField(max_length=200, blank=True)
    InducedDerivation_derivation_year = models.CharField(max_length=10, blank=True)
    InducedDerivation_vector_type = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    InducedDerivation_vector_name = models.CharField(max_length=200, blank=True)
    InducedDerivation_kit_name = models.CharField(max_length=200, blank=True)
    
    # Ethics fields (stored as JSON array of objects)
    Ethics = models.JSONField(default=list)  # List[dict] with ethics_number, institute, approval_date
    
    # Microbiology/Virology Screening fields
    MicrobiologyVirologyScreening_performed = models.BooleanField(default=False)
    MicrobiologyVirologyScreening_hiv1 = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    MicrobiologyVirologyScreening_hiv2 = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    MicrobiologyVirologyScreening_hep_b = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    MicrobiologyVirologyScreening_hep_c = models.CharField(max_length=50, blank=True)  # Removed choices constraint
    MicrobiologyVirologyScreening_mycoplasma = models.CharField(max_length=100, blank=True)  # Removed choices constraint
    MicrobiologyVirologyScreening_other = models.CharField(max_length=200, blank=True)
    MicrobiologyVirologyScreening_other_result = models.CharField(max_length=100, blank=True)
    
    # Culture Medium fields
    CultureMedium_co2_concentration = models.FloatField(null=True, blank=True)
    CultureMedium_o2_concentration = models.FloatField(null=True, blank=True)
    CultureMedium_passage_method = models.CharField(max_length=100, blank=True)  # Removed choices constraint
    CultureMedium_base_medium = models.CharField(max_length=200, blank=True)
    CultureMedium_base_coat = models.CharField(max_length=200, blank=True)
    
    # Curation source tracking
    curation_source = models.CharField(
        max_length=50,
        choices=[
            ('hpscreg', 'HPSCREG'),
            ('LLM', 'LLM Generated'),
            ('institution', 'Institution'),
            ('manual', 'Manual Entry'),
        ],
        default='manual',
        blank=True
    )
    
    # Work status for curation workflow
    work_status = models.CharField(
        max_length=20,
        choices=[
            ('in progress', 'In Progress'),
            ('for review', 'For Review'),
            ('reviewed', 'Reviewed'),
        ],
        default='in progress',
        blank=True
    )
    
    # Source article link - tracks which article this cell line was curated from
    source_article = models.ForeignKey(
        'TranscribedArticle',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='curated_cell_lines',
        help_text='The article from which this cell line was curated'
    )
    
    # Metadata fields
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
    
    # Editor locking mechanism fields
    is_locked = models.BooleanField(default=False)
    locked_by = models.CharField(max_length=100, null=True, blank=True)
    locked_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'cellline_template'
        verbose_name = 'Cell Line Template'
        verbose_name_plural = 'Cell Line Templates'
    
    def __str__(self):
        return self.CellLine_hpscreg_id
    
    def lock_for_editing(self, user_identifier):
        """Lock cell line for editing by specific user"""
        self.is_locked = True
        self.locked_by = user_identifier
        self.locked_at = timezone.now()
        self.save()
        
    def unlock(self):
        """Unlock cell line after editing"""
        self.is_locked = False
        self.locked_by = None
        self.locked_at = None
        self.save()
        
    def is_lock_expired(self, timeout_minutes=30):
        """Check if the lock has expired"""
        if not self.is_locked or not self.locked_at:
            return True
        return timezone.now() > self.locked_at + timedelta(minutes=timeout_minutes)
    
    def create_version(self, user_identifier='system', change_summary=''):
        """
        Create a new version snapshot of this cell line's current state.
        Returns the created CellLineVersion instance.
        """
        # Get next version number
        latest_version = self.versions.filter(is_archived=False).first()
        next_version = (latest_version.version_number + 1) if latest_version else 1
        
        # Serialize current data to metadata
        from .editor.serializers import CellLineTemplateSerializer
        serializer = CellLineTemplateSerializer(self)
        metadata = serializer.data
        
        # Create version record
        version = CellLineVersion.objects.create(
            cell_line=self,
            version_number=next_version,
            metadata=metadata,
            created_by=user_identifier,
            change_summary=change_summary
        )
        
        # Implement retention policy - keep only last 10 versions
        self._archive_old_versions()
        
        return version
    
    def _archive_old_versions(self):
        """
        Archive versions beyond the last 10 to maintain retention policy.
        """
        active_versions = self.versions.filter(is_archived=False).order_by('-version_number')
        if active_versions.count() > 10:
            versions_to_archive = active_versions[10:]
            CellLineVersion.objects.filter(
                id__in=[v.id for v in versions_to_archive]
            ).update(is_archived=True)
    
    def get_version_history(self, limit=10):
        """
        Get the version history for this cell line.
        Returns the most recent 10 versions by default.
        """
        return self.versions.filter(is_archived=False)[:limit]
        
        
        
        
class CellLineVersion(models.Model):
    """
    Version history storing complete snapshots of cell line metadata.
    Enables Dr. Suzy Butcher's edit-to-compare workflow.
    """
    cell_line = models.ForeignKey(CellLineTemplate, on_delete=models.CASCADE, related_name='versions')
    version_number = models.PositiveIntegerField()
    metadata = models.JSONField()  # Complete snapshot of metadata at this version
    
    # Version metadata
    created_by = models.CharField(max_length=100, default='system')
    created_on = models.DateTimeField(auto_now_add=True)
    change_summary = models.TextField(blank=True)
    
    # Version retention management
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'cellline_version'
        unique_together = ['cell_line', 'version_number']
        indexes = [
            models.Index(fields=['cell_line', 'version_number']),
            models.Index(fields=['created_on']),
            models.Index(fields=['is_archived']),
        ]
        ordering = ['-version_number']
    
    def __str__(self):
        return f"{self.cell_line.CellLine_hpscreg_id} v{self.version_number}"
        
        
        
        
class TranscribedArticle(models.Model):
    """
    Consolidated model for transcribed articles that combines transcription and curation functionality.
    This replaces the separate Article and TranscriptionRecord models.
    """
    
    # Basic identification
    filename = models.CharField(max_length=100)
    pubmed_id = models.IntegerField(null=True, blank=True)
    
    # Transcription fields
    transcription_status = models.CharField(
        max_length=20, 
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    transcription_content = models.TextField(blank=True)
    transcription_error = models.TextField(blank=True, null=True)
    
    # Curation fields
    curation_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    curation_error = models.TextField(blank=True, null=True)
    curation_started_at = models.DateTimeField(null=True, blank=True)
    is_curated = models.BooleanField(default=False)
    
    # Timestamps
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transcribed_article'
        verbose_name = 'Transcribed Article'
        verbose_name_plural = 'Transcribed Articles'
        ordering = ['-created_on']
    
    def __str__(self):
        return f"{self.filename} (PMID: {self.pubmed_id})"
    
    def start_transcription(self):
        """Mark article as starting transcription process"""
        self.transcription_status = 'processing'
        self.transcription_error = None
        self.save()
    
    def complete_transcription(self, content):
        """Mark article as successfully transcribed"""
        self.transcription_status = 'completed'
        self.transcription_content = content
        self.transcription_error = None
        self.save()
    
    def fail_transcription(self, error_message):
        """Mark article as failed transcription with error"""
        self.transcription_status = 'failed'
        self.transcription_error = error_message
        self.save()
    
    def start_curation(self):
        """Mark article as starting curation process"""
        self.curation_status = 'processing'
        self.curation_started_at = timezone.now()
        self.curation_error = None
        self.save()

    def complete_curation(self):
        """Mark article as successfully curated"""
        self.curation_status = 'completed'
        self.curation_started_at = None
        self.curation_error = None
        self.is_curated = True
        self.save()

    def fail_curation(self, error_message):
        """Mark article as failed curation with error"""
        self.curation_status = 'failed'
        self.curation_started_at = None
        self.curation_error = error_message
        self.save()
        
        
        
        