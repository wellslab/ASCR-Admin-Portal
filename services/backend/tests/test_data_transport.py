import pytest
import tempfile
import shutil
from pathlib import Path
import os


class TestDataTransport:
    """TDD tests for DataTransport - orchestrates storage + version control"""
    
    @pytest.fixture
    def temp_dir(self):
        """Create temporary directory for isolated tests"""
        temp_dir = tempfile.mkdtemp()
        original_cwd = os.getcwd()
        os.chdir(temp_dir)
        
        yield temp_dir
        
        # Cleanup
        os.chdir(original_cwd)
        shutil.rmtree(temp_dir)
    
    @pytest.fixture
    def storage(self, temp_dir):
        """Create storage instance"""
        from storage import FileStorage
        return FileStorage()
    
    @pytest.fixture
    def version_control(self, storage):
        """Create version control instance"""
        from version_control import VersionControl
        return VersionControl(storage)
    
    @pytest.fixture
    def data_transport(self, storage, version_control):
        """This test will fail until we create DataTransport class"""
        from data_transport import DataTransport
        return DataTransport(storage, version_control)

    @pytest.fixture
    def sample_data(self):
        """Sample cell line data"""
        return {
            "cell_line": [{"hpscreg_name": "TestCell001"}],
            "content": "test content"
        }

    # Test DataTransport class exists and has proper initialization
    def test_data_transport_class_exists(self, storage, version_control):
        """Test that DataTransport class exists and can be initialized"""
        from data_transport import DataTransport
        
        dt = DataTransport(storage, version_control)
        assert dt.storage is not None
        assert dt.version_control is not None
        assert hasattr(dt, 'storage')
        assert hasattr(dt, 'version_control')

    # Test move_to_working (simple delegation)
    def test_move_to_working_delegates_to_storage(self, data_transport, storage, sample_data):
        """Test move_to_working simply delegates to storage move operation"""
        # Setup: create file in ready
        storage.create("TestCell001_v0", sample_data, "ready")
        
        # Test: move to working
        result = data_transport.move_to_working("TestCell001_v0")
        
        assert result["status"] == "success"
        
        # Verify: file moved from ready to working
        assert storage.exists("TestCell001_v0", "working")
        assert not storage.exists("TestCell001_v0", "ready")

    def test_move_to_working_fails_for_missing_file(self, data_transport):
        """Test move_to_working fails for non-existent file"""
        with pytest.raises(FileNotFoundError):
            data_transport.move_to_working("NonExistent")

    # Test that DataTransport orchestrates but doesn't duplicate logic
    def test_data_transport_orchestrates_without_duplicating_logic(self, data_transport):
        """Test that DataTransport composes other classes without duplicating their logic"""
        # Should not have version calculation logic (that's in VersionControl)
        assert not hasattr(data_transport, 'parse_version_from_filename')
        assert not hasattr(data_transport, 'get_next_version')
        
        # Should not have file operation logic (that's in storage)
        assert not hasattr(data_transport, 'create')
        assert not hasattr(data_transport, '_save_json_file')
        
        # Should compose other services
        assert hasattr(data_transport, 'storage')
        assert hasattr(data_transport, 'version_control')

