from django.test import TestCase
from django.utils import timezone
from ..models import Article, CellLineTemplate

class ArticleModelTest(TestCase):
    def setUp(self):
        self.article = Article.objects.create(
            filename='test.pdf',
            transcription_content='Test content',
            pubmed_id=12345
        )
    
    def test_start_curation(self):
        """Test that start_curation sets correct status and timestamps"""
        self.article.start_curation()
        self.assertEqual(self.article.curation_status, 'processing')
        self.assertIsNotNone(self.article.curation_started_at)
        self.assertIsNone(self.article.curation_error)
    
    def test_complete_curation(self):
        """Test that complete_curation clears processing fields"""
        self.article.start_curation()
        self.article.complete_curation()
        self.assertEqual(self.article.curation_status, 'completed')
        self.assertIsNone(self.article.curation_started_at)
        self.assertIsNone(self.article.curation_error)
    
    def test_fail_curation(self):
        """Test that fail_curation records error message"""
        error_message = 'Test error'
        self.article.fail_curation(error_message)
        self.assertEqual(self.article.curation_status, 'failed')
        self.assertEqual(self.article.curation_error, error_message)
        self.assertIsNone(self.article.curation_started_at)
    
    def test_curation_workflow(self):
        """Test complete curation workflow"""
        # Start curation
        self.article.start_curation()
        self.assertEqual(self.article.curation_status, 'processing')
        
        # Fail curation
        self.article.fail_curation('AI service unavailable')
        self.assertEqual(self.article.curation_status, 'failed')
        self.assertEqual(self.article.curation_error, 'AI service unavailable')
        
        # Restart and complete
        self.article.start_curation()
        self.article.complete_curation()
        self.assertEqual(self.article.curation_status, 'completed')
        self.assertIsNone(self.article.curation_error)

class CellLineTemplateModelTest(TestCase):
    def test_curation_source_field(self):
        """Test that curation_source field works correctly"""
        cell_line = CellLineTemplate.objects.create(
            CellLine_hpscreg_id='TEST-001',
            CellLine_source_cell_type='Test Cell',
            CellLine_source_tissue='Test Tissue',
            CellLine_source='Test Source',
            curation_source='LLM'
        )
        
        self.assertEqual(cell_line.curation_source, 'LLM')
        
        # Test default value
        cell_line_default = CellLineTemplate.objects.create(
            CellLine_hpscreg_id='TEST-002',
            CellLine_source_cell_type='Test Cell',
            CellLine_source_tissue='Test Tissue',
            CellLine_source='Test Source'
        )
        
        self.assertEqual(cell_line_default.curation_source, 'manual')
    
    def test_curation_source_choices(self):
        """Test that curation_source accepts valid choices"""
        valid_choices = ['hpscreg', 'LLM', 'institution', 'manual']
        
        for choice in valid_choices:
            cell_line = CellLineTemplate.objects.create(
                CellLine_hpscreg_id=f'TEST-{choice}',
                CellLine_source_cell_type='Test Cell',
                CellLine_source_tissue='Test Tissue',
                CellLine_source='Test Source',
                curation_source=choice
            )
            self.assertEqual(cell_line.curation_source, choice) 