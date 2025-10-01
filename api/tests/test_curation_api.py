from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from ..models import Article, CellLineTemplate

class CurationAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.article = Article.objects.create(
            filename='test.pdf',
            transcription_content='Test content',
            pubmed_id=12345
        )
    
    def test_bulk_curate_endpoint(self):
        """Test bulk curation endpoint with valid data"""
        response = self.client.post('/api/curation/bulk_curate/', {
            'article_ids': [self.article.id]
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'queued')
        self.assertEqual(response.data['article_count'], 1)
        self.assertIn('task_id', response.data)
    
    def test_bulk_curate_empty_list(self):
        """Test bulk curation with empty article list"""
        response = self.client.post('/api/curation/bulk_curate/', {
            'article_ids': []
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    def test_bulk_curate_too_many_articles(self):
        """Test bulk curation with more than 20 articles"""
        # Create 21 articles
        article_ids = []
        for i in range(21):
            article = Article.objects.create(
                filename=f'test{i}.pdf',
                transcription_content=f'Test content {i}',
                pubmed_id=i
            )
            article_ids.append(article.id)
        
        response = self.client.post('/api/curation/bulk_curate/', {
            'article_ids': article_ids
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Maximum 20 articles', response.data['error'])
    
    def test_bulk_curate_nonexistent_article(self):
        """Test bulk curation with non-existent article ID"""
        response = self.client.post('/api/curation/bulk_curate/', {
            'article_ids': [999999]
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('not found', response.data['error'])
    
    def test_bulk_curate_already_processing(self):
        """Test bulk curation with already processing articles"""
        self.article.start_curation()
        
        response = self.client.post('/api/curation/bulk_curate/', {
            'article_ids': [self.article.id]
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already being processed', response.data['error'])
    
    def test_status_endpoint(self):
        """Test curation status endpoint"""
        response = self.client.get('/api/curation/status/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('articles', response.data)
        self.assertIn('total_count', response.data)
        self.assertIn('processing_count', response.data)
        self.assertIn('completed_count', response.data)
        self.assertIn('failed_count', response.data)
        
        # Verify counts
        self.assertEqual(response.data['total_count'], 1)
        self.assertEqual(response.data['processing_count'], 0)
        self.assertEqual(response.data['completed_count'], 0)
        self.assertEqual(response.data['failed_count'], 0)
    
    def test_error_details_endpoint(self):
        """Test error details endpoint"""
        # First fail the curation
        self.article.fail_curation('Test error message')
        
        response = self.client.get(f'/api/curation/{self.article.id}/error_details/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['article_id'], self.article.id)
        self.assertEqual(response.data['error_message'], 'Test error message')
        self.assertEqual(response.data['curation_status'], 'failed')
    
    def test_error_details_for_non_failed_article(self):
        """Test error details endpoint for non-failed article"""
        response = self.client.get(f'/api/curation/{self.article.id}/error_details/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('not failed', response.data['error'])
    
    def test_articles_endpoint(self):
        """Test articles listing endpoint"""
        response = self.client.get('/api/curation/articles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('articles', response.data)
        self.assertIn('count', response.data)
        self.assertEqual(response.data['count'], 1)
        
        # Verify article data includes curation fields
        article_data = response.data['articles'][0]
        self.assertIn('curation_status', article_data)
        self.assertIn('curation_error', article_data)
        self.assertIn('curation_started_at', article_data)
        self.assertIn('approximate_tokens', article_data)

class CurationTasksTest(TestCase):
    def setUp(self):
        self.article = Article.objects.create(
            filename='test.pdf',
            transcription_content='Test content for curation',
            pubmed_id=12345
        )
    
    def test_mock_curation_function(self):
        """Test that mock curation function returns expected data"""
        from ..tasks import mock_curation_function
        
        result = mock_curation_function('Test content')
        
        # Check required fields are present
        self.assertIn('CellLine_hpscreg_id', result)
        self.assertIn('CellLine_source_cell_type', result)
        self.assertIn('CellLine_source_tissue', result)
        self.assertIn('CellLine_source', result)
        
        # Check that ID has expected format
        self.assertTrue(result['CellLine_hpscreg_id'].startswith('MOCK-'))
        self.assertEqual(len(result['CellLine_hpscreg_id']), 13)  # MOCK- + 8 characters
        
        # Check some expected values
        self.assertEqual(result['CellLine_source_cell_type'], 'Induced Pluripotent Stem Cell')
        self.assertEqual(result['CellLine_source_tissue'], 'Dermal Fibroblast')
        self.assertEqual(result['CellLine_publication_year'], 2024) 