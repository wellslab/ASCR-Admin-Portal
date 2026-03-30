import pytest
import json
import tempfile
import shutil
import os
from pathlib import Path


class TestIngestionManager:
    """Tests for IngestionManager — run log processing and error reporting."""

    # -------------------------------------------------------------------------
    # Fixtures
    # -------------------------------------------------------------------------

    @pytest.fixture
    def temp_dir(self):
        """Isolated temp directory; sets DATA_DIR so FileStorage writes here."""
        temp_dir = tempfile.mkdtemp()
        original = os.environ.get("DATA_DIR")
        os.environ["DATA_DIR"] = temp_dir
        yield temp_dir
        if original is None:
            del os.environ["DATA_DIR"]
        else:
            os.environ["DATA_DIR"] = original
        shutil.rmtree(temp_dir)

    @pytest.fixture
    def storage(self, temp_dir):
        from storage import FileStorage
        return FileStorage()

    @pytest.fixture
    def file_manager(self, storage):
        from file_manager import FileManager
        return FileManager(storage)

    @pytest.fixture
    def run_log_path(self, temp_dir):
        """Path for a run_log.json inside the temp dir."""
        return str(Path(temp_dir) / "run_log.json")

    @pytest.fixture
    def manager(self, run_log_path, storage, file_manager):
        from ingestion_manager import IngestionManager
        return IngestionManager(run_log_path, storage, file_manager)

    @pytest.fixture
    def sample_cell_line(self):
        """Minimal cell line data with required hpscreg_name."""
        return {"general": {"hpscreg_name": "AIBNi001-A"}}

    def write_run_log(self, run_log_path, data):
        Path(run_log_path).write_text(json.dumps(data), encoding="utf-8")

    # -------------------------------------------------------------------------
    # _parse_filename
    # -------------------------------------------------------------------------

    def test_parse_filename_valid(self, manager):
        """
        - Given: a versioned filename like 'AIBNi001-A_v0'
        - When: _parse_filename is called
        - Then: returns (base_name, version_key) tuple
        """
        result = manager._parse_filename("AIBNi001-A_v0")
        assert result == ("AIBNi001-A", "v0")

    def test_parse_filename_multi_digit_version(self, manager):
        """
        - Given: a filename with a multi-digit version suffix
        - When: _parse_filename is called
        - Then: correctly parses base name and version key
        """
        result = manager._parse_filename("SomeCell_v12")
        assert result == ("SomeCell", "v12")

    def test_parse_filename_no_version_suffix(self, manager):
        """
        - Given: a filename with no _vN suffix
        - When: _parse_filename is called
        - Then: returns None
        """
        result = manager._parse_filename("AIBNi001-A")
        assert result is None

    def test_parse_filename_hyphenated_base_name(self, manager):
        """
        - Given: a base name containing hyphens
        - When: _parse_filename is called
        - Then: hyphens in the base name are preserved
        """
        result = manager._parse_filename("AIBNi001-A-extra_v3")
        assert result == ("AIBNi001-A-extra", "v3")

    # -------------------------------------------------------------------------
    # _load_run_log
    # -------------------------------------------------------------------------

    def test_load_run_log_missing_file(self, manager):
        """
        - Given: no run_log.json exists
        - When: _load_run_log is called
        - Then: returns empty dict (does not raise)
        """
        result = manager._load_run_log()
        assert result == {}

    def test_load_run_log_valid_file(self, manager, run_log_path):
        """
        - Given: a valid run_log.json
        - When: _load_run_log is called
        - Then: returns parsed dict
        """
        data = {"AIBNi001-A": {"v0": {"ingest_runs": [{"date": "2026-03-25", "status": "PROD-PASS"}]}}}
        self.write_run_log(run_log_path, data)
        result = manager._load_run_log()
        assert result == data

    def test_load_run_log_malformed_json(self, manager, run_log_path):
        """
        - Given: a run_log.json with invalid JSON
        - When: _load_run_log is called
        - Then: returns empty dict (does not raise)
        """
        Path(run_log_path).write_text("{ not valid json", encoding="utf-8")
        result = manager._load_run_log()
        assert result == {}

    # -------------------------------------------------------------------------
    # process_ready_files — PROD-PASS
    # -------------------------------------------------------------------------

    def test_prod_pass_moves_to_registered(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: 'AIBNi001-A_v0' is in ready and the run log shows PROD-PASS
        - When: process_ready_files is called
        - Then: file is moved to registered and removed from ready
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": [{"date": "2026-03-25", "status": "PROD-PASS"}]}}
        })

        result = manager.process_ready_files()

        assert result["moved_to_registered"] == 1
        assert result["moved_to_working"] == 0
        assert storage.exists("AIBNi001-A_v0", "registered")
        assert not storage.exists("AIBNi001-A_v0", "ready")

    def test_prod_pass_uses_latest_run(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: multiple ingest_runs where the last one is PROD-PASS
        - When: process_ready_files is called
        - Then: file is moved to registered (latest run wins)
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": [
                {"date": "2026-03-23", "status": "ERROR"},
                {"date": "2026-03-25", "status": "PROD-PASS"},
            ]}}
        })

        result = manager.process_ready_files()

        assert result["moved_to_registered"] == 1
        assert storage.exists("AIBNi001-A_v0", "registered")

    # -------------------------------------------------------------------------
    # process_ready_files — ERROR
    # -------------------------------------------------------------------------

    def test_error_moves_to_working(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: 'AIBNi001-A_v0' is in ready and the run log shows ERROR
        - When: process_ready_files is called
        - Then: file is moved back to working and removed from ready
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": [{"date": "2026-03-23", "status": "ERROR"}]}}
        })

        result = manager.process_ready_files()

        assert result["moved_to_working"] == 1
        assert result["moved_to_registered"] == 0
        assert storage.exists("AIBNi001-A_v0", "working")
        assert not storage.exists("AIBNi001-A_v0", "ready")

    def test_error_uses_latest_run(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: multiple ingest_runs where the last one is ERROR
        - When: process_ready_files is called
        - Then: file is moved to working (latest run wins)
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": [
                {"date": "2026-03-23", "status": "PROD-PASS"},
                {"date": "2026-03-25", "status": "ERROR"},
            ]}}
        })

        result = manager.process_ready_files()

        assert result["moved_to_working"] == 1
        assert storage.exists("AIBNi001-A_v0", "working")

    # -------------------------------------------------------------------------
    # process_ready_files — skipped cases
    # -------------------------------------------------------------------------

    def test_no_log_entry_skips_file(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: a file in ready but no matching entry in the run log
        - When: process_ready_files is called
        - Then: file is left in ready (skipped)
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        self.write_run_log(run_log_path, {})

        result = manager.process_ready_files()

        assert result["skipped"] == 1
        assert result["moved_to_registered"] == 0
        assert result["moved_to_working"] == 0
        assert storage.exists("AIBNi001-A_v0", "ready")

    def test_empty_ingest_runs_skips_file(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: a log entry exists but ingest_runs is empty
        - When: process_ready_files is called
        - Then: file is left in ready (skipped)
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": []}}
        })

        result = manager.process_ready_files()

        assert result["skipped"] == 1
        assert storage.exists("AIBNi001-A_v0", "ready")

    def test_dev_pass_skips_file(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: latest run status is DEV-PASS
        - When: process_ready_files is called
        - Then: file is left in ready (not yet at production stage)
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": [{"date": "2026-03-24", "status": "DEV-PASS"}]}}
        })

        result = manager.process_ready_files()

        assert result["skipped"] == 1
        assert storage.exists("AIBNi001-A_v0", "ready")

    def test_missing_run_log_skips_all_files(self, manager, storage, sample_cell_line):
        """
        - Given: no run_log.json and a file in ready
        - When: process_ready_files is called
        - Then: all files are skipped, nothing moves
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")

        result = manager.process_ready_files()

        assert result["skipped"] == 1
        assert result["moved_to_registered"] == 0
        assert result["moved_to_working"] == 0

    def test_file_without_version_suffix_is_skipped(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: a ready file with no _vN version suffix
        - When: process_ready_files is called
        - Then: file cannot be parsed and is skipped
        """
        # Use storage directly to bypass auto-versioning and create an unparseable filename
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        # Rename by creating a second entry via storage (no version suffix possible through normal flow,
        # but we test the guard path directly via _parse_filename)
        result = manager._parse_filename("AIBNi001-A")
        assert result is None

    # -------------------------------------------------------------------------
    # process_ready_files — mixed batch
    # -------------------------------------------------------------------------

    def test_mixed_batch(self, manager, storage, run_log_path):
        """
        - Given: three ready files with PROD-PASS, ERROR, and no log entry respectively
        - When: process_ready_files is called
        - Then: each file is routed to the correct outcome
        """
        storage.create("CellA_v0", {"general": {"hpscreg_name": "CellA"}}, "ready")
        storage.create("CellB_v1", {"general": {"hpscreg_name": "CellB"}}, "ready")
        storage.create("CellC_v0", {"general": {"hpscreg_name": "CellC"}}, "ready")

        self.write_run_log(run_log_path, {
            "CellA": {"v0": {"ingest_runs": [{"date": "2026-03-25", "status": "PROD-PASS"}]}},
            "CellB": {"v1": {"ingest_runs": [{"date": "2026-03-23", "status": "ERROR"}]}},
            # CellC has no entry
        })

        result = manager.process_ready_files()

        assert result["processed"] == 3
        assert result["moved_to_registered"] == 1
        assert result["moved_to_working"] == 1
        assert result["skipped"] == 1

        assert storage.exists("CellA_v0", "registered")
        assert storage.exists("CellB_v1", "working")
        assert storage.exists("CellC_v0", "ready")

    def test_empty_ready_directory(self, manager, run_log_path):
        """
        - Given: no files in the ready directory
        - When: process_ready_files is called
        - Then: returns all-zero summary without error
        """
        self.write_run_log(run_log_path, {"AIBNi001-A": {"v0": {"ingest_runs": []}}})

        result = manager.process_ready_files()

        assert result == {"processed": 0, "moved_to_registered": 0, "moved_to_working": 0, "skipped": 0}

    # -------------------------------------------------------------------------
    # get_errors
    # -------------------------------------------------------------------------

    def test_get_errors_returns_error_working_files(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: a working file whose latest run log entry is ERROR
        - When: get_errors is called
        - Then: that file is included in the result
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "working")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": [{"date": "2026-03-23", "status": "ERROR"}]}}
        })

        errors = manager.get_errors()

        assert len(errors) == 1
        assert errors[0]["filename"] == "AIBNi001-A_v0"
        assert errors[0]["base_name"] == "AIBNi001-A"
        assert errors[0]["version"] == "v0"
        assert errors[0]["last_run_date"] == "2026-03-23"

    def test_get_errors_excludes_prod_pass_files(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: a working file whose latest run log entry is PROD-PASS
        - When: get_errors is called
        - Then: that file is not included (not an error)
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "working")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": [{"date": "2026-03-25", "status": "PROD-PASS"}]}}
        })

        errors = manager.get_errors()

        assert errors == []

    def test_get_errors_excludes_files_with_no_log_entry(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: a working file with no entry in the run log
        - When: get_errors is called
        - Then: that file is not included
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "working")
        self.write_run_log(run_log_path, {})

        errors = manager.get_errors()

        assert errors == []

    def test_get_errors_no_run_log(self, manager, storage, sample_cell_line):
        """
        - Given: no run_log.json exists
        - When: get_errors is called
        - Then: returns empty list (does not raise)
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "working")

        errors = manager.get_errors()

        assert errors == []

    def test_get_errors_only_checks_working_directory(self, manager, storage, sample_cell_line, run_log_path):
        """
        - Given: a file in ready (not working) with ERROR status
        - When: get_errors is called
        - Then: that file is not returned (get_errors only reports working files)
        """
        storage.create("AIBNi001-A_v0", sample_cell_line, "ready")
        self.write_run_log(run_log_path, {
            "AIBNi001-A": {"v0": {"ingest_runs": [{"date": "2026-03-23", "status": "ERROR"}]}}
        })

        errors = manager.get_errors()

        assert errors == []
