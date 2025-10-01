from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import CellLineTemplate, CellLineVersion
import json
import time


class CellLineVersionModelTests(TestCase):
    """Test the CellLineVersion model functionality"""
    
    def setUp(self):
        self.cell_line = CellLineTemplate.objects.create(
            CellLine_hpscreg_id='TEST001-A',
            CellLine_cell_line_type='hiPSC',
            CellLine_source_cell_type='fibroblast',
            CellLine_source_tissue='skin',
            CellLine_source='donor'
        )
    
    def test_version_creation(self):
        """Test automatic version creation"""
        # Initially no versions
        self.assertEqual(self.cell_line.versions.count(), 0)
        
        # Create a version
        version = self.cell_line.create_version(user_identifier='test_user')
        
        # Check version was created correctly
        self.assertEqual(version.version_number, 1)
        self.assertEqual(version.created_by, 'test_user')
        self.assertIsNotNone(version.metadata)
        self.assertEqual(self.cell_line.versions.count(), 1)
    
    def test_version_number_increment(self):
        """Test sequential version numbering"""
        # Create multiple versions
        v1 = self.cell_line.create_version()
        v2 = self.cell_line.create_version()
        v3 = self.cell_line.create_version()
        
        # Check version numbers increment correctly
        self.assertEqual(v1.version_number, 1)
        self.assertEqual(v2.version_number, 2)
        self.assertEqual(v3.version_number, 3)
    
    def test_retention_policy(self):
        """Test last 10 versions retention policy"""
        # Create 15 versions
        for i in range(15):
            self.cell_line.create_version(user_identifier=f'user_{i}')
        
        # Check only 10 active versions remain
        active_versions = self.cell_line.versions.filter(is_archived=False).count()
        archived_versions = self.cell_line.versions.filter(is_archived=True).count()
        
        self.assertEqual(active_versions, 10)
        self.assertEqual(archived_versions, 5)
        self.assertEqual(self.cell_line.versions.count(), 15)
    
    def test_metadata_preservation(self):
        """Test complete metadata preservation in versions"""
        # Modify the cell line
        self.cell_line.CellLine_donor_age = '25'
        self.cell_line.CellLine_contact_name = 'Test Contact'
        self.cell_line.save()
        
        # Create version
        version = self.cell_line.create_version()
        
        # Check metadata contains expected fields
        metadata = version.metadata
        self.assertIn('CellLine_hpscreg_id', metadata)
        self.assertIn('CellLine_donor_age', metadata)
        self.assertIn('CellLine_contact_name', metadata)
        self.assertEqual(metadata['CellLine_hpscreg_id'], 'TEST001-A')


class CellLineVersionAPITests(APITestCase):
    """Test the version API endpoints"""
    
    def setUp(self):
        self.cell_line = CellLineTemplate.objects.create(
            CellLine_hpscreg_id='API001-A',
            CellLine_cell_line_type='hESC',
            CellLine_source_cell_type='embryo',
            CellLine_source_tissue='blastocyst',
            CellLine_source='IVF'
        )
        
        # Create some test versions
        for i in range(3):
            self.cell_line.create_version(
                user_identifier='test_api',
                change_summary=f'Test change {i+1}'
            )
    
    def test_version_history_endpoint(self):
        """Test GET /celllines/{id}/versions/"""
        url = f'/api/editor/celllines/{self.cell_line.CellLine_hpscreg_id}/versions/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        # Check response structure
        self.assertTrue(data['success'])
        self.assertIn('versions', data)
        self.assertIn('total_versions', data)
        self.assertIn('archived_count', data)
        self.assertIn('performance', data)
        
        # Check version data
        self.assertEqual(len(data['versions']), 3)
        self.assertEqual(data['total_versions'], 3)
        self.assertEqual(data['archived_count'], 0)
        
        # Check version structure
        version = data['versions'][0]
        self.assertIn('version_number', version)
        self.assertIn('created_by', version)
        self.assertIn('created_on', version)
        self.assertIn('change_summary', version)
    
    def test_version_detail_endpoint(self):
        """Test GET /celllines/{id}/versions/{number}/"""
        url = f'/api/editor/celllines/{self.cell_line.CellLine_hpscreg_id}/versions/1/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        
        # Check response structure
        self.assertTrue(data['success'])
        self.assertIn('version_number', data)
        self.assertIn('metadata', data)
        self.assertIn('hpscreg_id', data)
        self.assertIn('performance', data)
        
        # Check version details
        self.assertEqual(data['version_number'], 1)
        self.assertEqual(data['hpscreg_id'], 'API001-A')
        self.assertIsInstance(data['metadata'], dict)
    
    def test_version_detail_not_found(self):
        """Test 404 for non-existent version"""
        url = f'/api/editor/celllines/{self.cell_line.CellLine_hpscreg_id}/versions/999/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertIn('error', data)
    
    def test_enhanced_save_creates_version(self):
        """Test that PUT operations create versions automatically"""
        initial_count = self.cell_line.versions.count()
        
        url = f'/api/editor/celllines/{self.cell_line.CellLine_hpscreg_id}/'
        data = {
            'CellLine_hpscreg_id': 'API001-A',
            'CellLine_cell_line_type': 'hESC',
            'CellLine_source_cell_type': 'embryo_updated',
            'CellLine_source_tissue': 'blastocyst',
            'CellLine_source': 'IVF'
        }
        
        response = self.client.put(
            url, 
            data=json.dumps(data),
            content_type='application/json',
            HTTP_X_USER_ID='api_test_user'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        
        # Check version was created
        self.assertTrue(response_data['success'])
        self.assertIn('version_info', response_data)
        self.assertIn('performance', response_data)
        
        # Check version count increased
        new_count = self.cell_line.versions.count()
        self.assertEqual(new_count, initial_count + 1)
        
        # Check performance metrics
        self.assertIn('update_time_ms', response_data['performance'])
        self.assertIsInstance(response_data['performance']['update_time_ms'], (int, float))


class CellLineVersionPerformanceTests(TestCase):
    """Test performance requirements"""
    
    def setUp(self):
        self.cell_line = CellLineTemplate.objects.create(
            CellLine_hpscreg_id='PERF001-A',
            CellLine_cell_line_type='hiPSC',
            CellLine_source_cell_type='fibroblast',
            CellLine_source_tissue='skin',
            CellLine_source='donor'
        )
    
    def test_version_creation_performance(self):
        """Test version creation completes within 200ms"""
        start_time = time.time()
        self.cell_line.create_version()
        duration = (time.time() - start_time) * 1000
        
        # Should complete in under 200ms for typical cell line
        self.assertLess(duration, 200, f"Version creation took {duration:.2f}ms, expected <200ms")
    
    def test_version_retrieval_performance(self):
        """Test version history retrieval performance"""
        # Create some versions
        for i in range(5):
            self.cell_line.create_version()
        
        start_time = time.time()
        versions = self.cell_line.get_version_history()
        duration = (time.time() - start_time) * 1000
        
        # Should complete in under 100ms
        self.assertLess(duration, 100, f"Version retrieval took {duration:.2f}ms, expected <100ms")
        self.assertEqual(versions.count(), 5) 