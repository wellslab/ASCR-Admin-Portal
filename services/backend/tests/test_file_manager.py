import pytest
import tempfile
import shutil
import os


@pytest.fixture
def temp_storage(monkeypatch):
    """FileStorage instance isolated to a temporary directory."""
    temp_dir = tempfile.mkdtemp()
    monkeypatch.setenv("DATA_DIR", temp_dir)

    from storage import FileStorage
    yield FileStorage()

    shutil.rmtree(temp_dir)


@pytest.fixture
def file_manager(temp_storage):
    from file_manager import FileManager
    return FileManager(temp_storage)


@pytest.fixture
def sample_data():
    return {
        "general": {"hpscreg_name": "TestCell001"},
        "content": "test content"
    }


# ---------------------------------------------------------------------------
# Versioning utilities
# ---------------------------------------------------------------------------

class TestVersioningUtilities:

    def test_parse_version_valid(self, file_manager):
        """
        - Given: a versioned filename 'TestCell001_v5'
        - When: parse_version_from_filename is called
        - Then: returns 5
        """
        assert file_manager.parse_version_from_filename("TestCell001_v5") == 5

    def test_parse_version_zero(self, file_manager):
        """
        - Given: a versioned filename with version 0
        - When: parse_version_from_filename is called
        - Then: returns 0
        """
        assert file_manager.parse_version_from_filename("TestCell001_v0") == 0

    def test_parse_version_no_suffix(self, file_manager):
        """
        - Given: a filename with no version suffix
        - When: parse_version_from_filename is called
        - Then: returns None
        """
        assert file_manager.parse_version_from_filename("TestCell001") is None

    def test_parse_version_invalid_suffix(self, file_manager):
        """
        - Given: a filename with a non-numeric suffix
        - When: parse_version_from_filename is called
        - Then: returns None
        """
        assert file_manager.parse_version_from_filename("TestCell001_vinvalid") is None

    def test_create_versioned_filename(self, file_manager):
        """
        - Given: base name and version number
        - When: create_versioned_filename is called
        - Then: returns correctly formatted filename
        """
        assert file_manager.create_versioned_filename("TestCell001", 3) == "TestCell001_v3"

    def test_create_versioned_filename_zero(self, file_manager):
        """
        - Given: version number 0
        - When: create_versioned_filename is called
        - Then: returns '{name}_v0'
        """
        assert file_manager.create_versioned_filename("TestCell001", 0) == "TestCell001_v0"

    def test_extract_base_name_versioned(self, file_manager):
        """
        - Given: a versioned filename
        - When: extract_base_name is called
        - Then: returns the name without the version suffix
        """
        assert file_manager.extract_base_name("TestCell001_v5") == "TestCell001"

    def test_extract_base_name_plain(self, file_manager):
        """
        - Given: a plain filename with no suffix
        - When: extract_base_name is called
        - Then: returns the filename unchanged
        """
        assert file_manager.extract_base_name("TestCell001") == "TestCell001"

    def test_get_next_version_empty(self, file_manager):
        """
        - Given: no existing files
        - When: get_next_version is called
        - Then: returns 0
        """
        assert file_manager.get_next_version("TestCell001", []) == 0

    def test_get_next_version_increments(self, file_manager):
        """
        - Given: existing files at v0, v1, v2
        - When: get_next_version is called
        - Then: returns 3
        """
        assert file_manager.get_next_version("TestCell001", ["TestCell001_v0", "TestCell001_v1", "TestCell001_v2"]) == 3

    def test_get_next_version_handles_gaps(self, file_manager):
        """
        - Given: existing files with version gaps (v0, v5)
        - When: get_next_version is called
        - Then: returns max + 1
        """
        assert file_manager.get_next_version("TestCell001", ["TestCell001_v0", "TestCell001_v5"]) == 6

    def test_get_next_version_ignores_invalid(self, file_manager):
        """
        - Given: a mix of valid and invalid version filenames
        - When: get_next_version is called
        - Then: invalid filenames are ignored
        """
        assert file_manager.get_next_version("TestCell001", ["TestCell001_v0", "TestCell001_invalid"]) == 1

    def test_get_latest_version_finds_highest(self, file_manager):
        """
        - Given: list of versioned filenames
        - When: get_latest_version is called
        - Then: returns the filename with the highest version
        """
        files = ["TestCell001_v0", "TestCell001_v5", "TestCell001_v2"]
        assert file_manager.get_latest_version(files) == "TestCell001_v5"

    def test_get_latest_version_empty(self, file_manager):
        """
        - Given: empty file list
        - When: get_latest_version is called
        - Then: returns None
        """
        assert file_manager.get_latest_version([]) is None

    def test_get_latest_version_no_valid(self, file_manager):
        """
        - Given: files with no parseable versions
        - When: get_latest_version is called
        - Then: returns None
        """
        assert file_manager.get_latest_version(["TestCell001_bad", "TestCell001_invalid"]) is None


# ---------------------------------------------------------------------------
# Storage-backed version queries
# ---------------------------------------------------------------------------

class TestVersionQueries:

    def test_get_all_versions_from_storage(self, file_manager, temp_storage, sample_data):
        """
        - Given: two files created in ready
        - When: get_all_versions is called for that base name
        - Then: returns both filenames
        """
        temp_storage.create("TestCell001_v0", sample_data, "ready")
        temp_storage.create("TestCell001_v1", sample_data, "ready")

        versions = file_manager.get_all_versions("TestCell001", "ready")
        assert set(versions) == {"TestCell001_v0", "TestCell001_v1"}

    def test_get_all_versions_empty(self, file_manager):
        """
        - Given: no files in storage
        - When: get_all_versions is called
        - Then: returns empty list
        """
        assert file_manager.get_all_versions("NonExistent", "ready") == []

    def test_get_max_version_across_all_directories(self, file_manager, temp_storage, sample_data):
        """
        - Given: files spread across working, ready, and registered
        - When: get_max_version_across_all_directories is called
        - Then: returns the highest version number across all three
        """
        temp_storage.create("TestCell001_v0", sample_data, "working")
        temp_storage.create("TestCell001_v2", sample_data, "ready")
        temp_storage.create("TestCell001_v5", sample_data, "registered")

        assert file_manager.get_max_version_across_all_directories("TestCell001") == 5

    def test_get_max_version_no_files(self, file_manager):
        """
        - Given: no files exist for the base name
        - When: get_max_version_across_all_directories is called
        - Then: returns -1
        """
        assert file_manager.get_max_version_across_all_directories("NonExistent") == -1

    def test_get_next_global_version(self, file_manager, temp_storage, sample_data):
        """
        - Given: highest existing version is 5 across all directories
        - When: get_next_global_version is called
        - Then: returns 6
        """
        temp_storage.create("TestCell001_v5", sample_data, "registered")
        assert file_manager.get_next_global_version("TestCell001") == 6

    def test_get_next_global_version_no_files(self, file_manager):
        """
        - Given: no existing files
        - When: get_next_global_version is called
        - Then: returns 0
        """
        assert file_manager.get_next_global_version("BrandNew") == 0


# ---------------------------------------------------------------------------
# State transitions
# ---------------------------------------------------------------------------

class TestStateTransitions:

    def test_save_with_auto_versioning_new_cell_line(self, file_manager, temp_storage, sample_data):
        """
        - Given: no existing versions of the cell line
        - When: save_with_auto_versioning is called
        - Then: file is created at v0 in working
        """
        result = file_manager.save_with_auto_versioning(sample_data)

        assert result["status"] == "success"
        assert result["version"] == 0
        assert result["filename"] == "TestCell001_v0"
        assert temp_storage.exists("TestCell001_v0", "working")

    def test_save_with_auto_versioning_after_registered(self, file_manager, temp_storage, sample_data):
        """
        - Given: a registered v0 already exists
        - When: save_with_auto_versioning is called
        - Then: new file is created at v1 in working
        """
        temp_storage.create("TestCell001_v0", sample_data, "registered")

        result = file_manager.save_with_auto_versioning(sample_data)

        assert result["version"] == 1
        assert result["filename"] == "TestCell001_v1"
        assert temp_storage.exists("TestCell001_v1", "working")

    def test_save_with_auto_versioning_blocks_on_existing_working(self, file_manager, temp_storage, sample_data):
        """
        - Given: a working copy already exists
        - When: save_with_auto_versioning is called
        - Then: raises ValueError
        """
        temp_storage.create("TestCell001_v0", sample_data, "working")

        with pytest.raises(ValueError, match="working copy"):
            file_manager.save_with_auto_versioning(sample_data)

    def test_save_with_auto_versioning_blocks_on_existing_ready(self, file_manager, temp_storage, sample_data):
        """
        - Given: a ready copy already exists
        - When: save_with_auto_versioning is called
        - Then: raises ValueError
        """
        temp_storage.create("TestCell001_v0", sample_data, "ready")

        with pytest.raises(ValueError, match="ready copy"):
            file_manager.save_with_auto_versioning(sample_data)

    def test_move_to_ready(self, file_manager, temp_storage, sample_data):
        """
        - Given: a file in working
        - When: move_to_ready is called
        - Then: file exists in ready and is removed from working
        """
        temp_storage.create("TestCell001_v0", sample_data, "working")

        result = file_manager.move_to_ready("TestCell001_v0")

        assert result["status"] == "success"
        assert temp_storage.exists("TestCell001_v0", "ready")
        assert not temp_storage.exists("TestCell001_v0", "working")

    def test_move_to_ready_missing_file(self, file_manager):
        """
        - Given: no file in working
        - When: move_to_ready is called
        - Then: raises FileNotFoundError
        """
        with pytest.raises(FileNotFoundError):
            file_manager.move_to_ready("NonExistent_v0")

    def test_move_to_working(self, file_manager, temp_storage, sample_data):
        """
        - Given: a file in ready
        - When: move_to_working is called
        - Then: file exists in working and is removed from ready
        """
        temp_storage.create("TestCell001_v0", sample_data, "ready")

        result = file_manager.move_to_working("TestCell001_v0")

        assert result["status"] == "success"
        assert temp_storage.exists("TestCell001_v0", "working")
        assert not temp_storage.exists("TestCell001_v0", "ready")

    def test_move_to_working_missing_file(self, file_manager):
        """
        - Given: no file in ready
        - When: move_to_working is called
        - Then: raises FileNotFoundError
        """
        with pytest.raises(FileNotFoundError):
            file_manager.move_to_working("NonExistent_v0")

    def test_move_to_working_blocks_if_already_in_working(self, file_manager, temp_storage, sample_data):
        """
        - Given: same file exists in both ready and working
        - When: move_to_working is called
        - Then: raises ValueError
        """
        temp_storage.create("TestCell001_v0", sample_data, "ready")
        temp_storage.create("TestCell001_v0", sample_data, "working")

        with pytest.raises(ValueError):
            file_manager.move_to_working("TestCell001_v0")

    def test_move_to_registered(self, file_manager, temp_storage, sample_data):
        """
        - Given: a file in ready
        - When: move_to_registered is called
        - Then: file exists in registered and is removed from ready
        """
        temp_storage.create("TestCell001_v0", sample_data, "ready")

        result = file_manager.move_to_registered("TestCell001_v0")

        assert result["status"] == "success"
        assert temp_storage.exists("TestCell001_v0", "registered")
        assert not temp_storage.exists("TestCell001_v0", "ready")

    def test_move_to_registered_missing_file(self, file_manager):
        """
        - Given: no file in ready
        - When: move_to_registered is called
        - Then: raises FileNotFoundError
        """
        with pytest.raises(FileNotFoundError):
            file_manager.move_to_registered("NonExistent_v0")

    def test_full_workflow(self, file_manager, temp_storage, sample_data):
        """
        - Given: a new cell line
        - When: the full working -> ready -> registered flow is executed
        - Then: file ends up in registered with correct version
        """
        file_manager.save_with_auto_versioning(sample_data)
        assert temp_storage.exists("TestCell001_v0", "working")

        file_manager.move_to_ready("TestCell001_v0")
        assert temp_storage.exists("TestCell001_v0", "ready")
        assert not temp_storage.exists("TestCell001_v0", "working")

        file_manager.move_to_registered("TestCell001_v0")
        assert temp_storage.exists("TestCell001_v0", "registered")
        assert not temp_storage.exists("TestCell001_v0", "ready")


# ---------------------------------------------------------------------------
# create_new_version_from_registered
# ---------------------------------------------------------------------------

class TestCreateNewVersionFromRegistered:

    def test_creates_next_version_in_working(self, file_manager, temp_storage, sample_data):
        """
        - Given: a registered v0 and no working or ready copies
        - When: create_new_version_from_registered is called
        - Then: a new v1 is created in working
        """
        temp_storage.create("TestCell001_v0", sample_data, "registered")

        result = file_manager.create_new_version_from_registered("TestCell001_v0")

        assert result["status"] == "success"
        assert result["action"] == "created"
        assert temp_storage.exists("TestCell001_v1", "working")

    def test_raises_if_ready_copy_exists(self, file_manager, temp_storage, sample_data):
        """
        - Given: a registered v0 and a ready copy
        - When: create_new_version_from_registered is called
        - Then: raises ReadyVersionConflict
        """
        from file_manager import ReadyVersionConflict
        temp_storage.create("TestCell001_v0", sample_data, "registered")
        temp_storage.create("TestCell001_v0", sample_data, "ready")

        with pytest.raises(ReadyVersionConflict):
            file_manager.create_new_version_from_registered("TestCell001_v0")

    def test_raises_working_conflict_without_overwrite(self, file_manager, temp_storage, sample_data):
        """
        - Given: a registered v0 and an existing working copy
        - When: create_new_version_from_registered is called without overwrite
        - Then: raises WorkingVersionConflict
        """
        from file_manager import WorkingVersionConflict
        temp_storage.create("TestCell001_v0", sample_data, "registered")
        temp_storage.create("TestCell001_v0", sample_data, "working")

        with pytest.raises(WorkingVersionConflict):
            file_manager.create_new_version_from_registered("TestCell001_v0")

    def test_overwrites_working_copy_when_flag_set(self, file_manager, temp_storage, sample_data):
        """
        - Given: a registered v0 and an existing working copy
        - When: create_new_version_from_registered is called with overwrite=True
        - Then: working copy is overwritten with registered data, action is 'overwritten'
        """
        temp_storage.create("TestCell001_v0", sample_data, "registered")
        temp_storage.create("TestCell001_v0", sample_data, "working")

        result = file_manager.create_new_version_from_registered("TestCell001_v0", overwrite=True)

        assert result["action"] == "overwritten"
        assert temp_storage.exists("TestCell001_v0", "working")

    def test_raises_if_registered_file_missing(self, file_manager):
        """
        - Given: no registered file
        - When: create_new_version_from_registered is called
        - Then: raises FileNotFoundError
        """
        with pytest.raises(FileNotFoundError):
            file_manager.create_new_version_from_registered("NonExistent_v0")
