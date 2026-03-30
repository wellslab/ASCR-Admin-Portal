from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)


class WorkingVersionConflict(Exception):
    def __init__(self, existing_filename: str):
        self.existing_filename = existing_filename
        super().__init__(f"Working version '{existing_filename}' already exists")


class ReadyVersionConflict(Exception):
    def __init__(self, existing_filename: str):
        self.existing_filename = existing_filename
        super().__init__(f"Ready version '{existing_filename}' already exists")


class FileManager:
    """Manages cell line file state transitions and versioning.

    Single module responsible for all file management concerns:
    - Moving cell line files between working, ready, and registered states
    - Assigning and parsing version numbers
    - Resolving conflicts when creating new versions

    Depends only on a StorageInterface for raw file operations.
    """

    def __init__(self, storage):
        self.storage = storage

    # ------------------------------------------------------------------
    # State transitions
    # ------------------------------------------------------------------

    def save_with_auto_versioning(self, cell_line_data: Dict[str, Any], curation_method: Optional[str] = None) -> Dict[str, Any]:
        """Create a new working cell line with a version number based on registered history.

        Version number equals the count of previously registered copies of this base name.
        Raises ValueError if a working or ready copy already exists.
        """
        base_name = self._extract_hpscreg_name(cell_line_data)

        working_files = self.storage.get_files_for_base_name(base_name, "working")
        if working_files:
            raise ValueError(
                f"A working copy of '{base_name}' already exists ({working_files[0]}). "
                "Edit the existing copy instead."
            )

        ready_files = self.storage.get_files_for_base_name(base_name, "ready")
        if ready_files:
            raise ValueError(
                f"A ready copy of '{base_name}' exists. "
                "Finalise this cell line before creating a new version."
            )

        registered_files = self.storage.get_files_for_base_name(base_name, "registered")
        next_version = self.get_next_version(base_name, registered_files)
        versioned_filename = self.create_versioned_filename(base_name, next_version)

        try:
            self.storage.create(versioned_filename, cell_line_data, "working", curation_method=curation_method)
            logger.info(f"Created new working cell line {versioned_filename}")
            return {
                "status": "success",
                "filename": versioned_filename,
                "version": next_version,
                "message": f"Cell line saved as version {next_version}"
            }
        except Exception as e:
            logger.error(f"Error saving with auto-versioning: {e}")
            raise

    def move_to_ready(self, filename: str) -> Dict[str, Any]:
        """Move a file from working to ready. Version number is unchanged."""
        if not self.storage.exists(filename, "working"):
            raise FileNotFoundError(f"File '{filename}' not found in working directory")

        try:
            record = self.storage.get(filename, "working")
            if not record:
                raise FileNotFoundError(f"Could not read data from {filename}")

            self.storage.create(filename, record["data"], "ready", curation_method=record.get("curation_method"))
            self.storage.delete(filename, "working")

            logger.info(f"Moved {filename} from working to ready")
            return {"status": "success", "filename": filename, "message": "Cell line moved to ready status"}

        except Exception as e:
            logger.error(f"Error moving {filename} to ready: {e}")
            raise

    def move_to_working(self, ready_filename: str) -> Dict[str, Any]:
        """Move a file from ready back to working."""
        if not self.storage.exists(ready_filename, "ready"):
            raise FileNotFoundError(f"File '{ready_filename}' not found in ready directory")

        if self.storage.exists(ready_filename, "working"):
            raise ValueError(f"File '{ready_filename}' already exists in working directory")

        try:
            record = self.storage.get(ready_filename, "ready")
            if not record:
                raise FileNotFoundError(f"Could not read data from {ready_filename}")

            self.storage.create(ready_filename, record["data"], "working", curation_method=record.get("curation_method"))
            self.storage.delete(ready_filename, "ready")

            logger.info(f"Moved {ready_filename} from ready to working")
            return {
                "status": "success",
                "filename": ready_filename,
                "new_location": "working",
                "message": f"File '{ready_filename}' moved to working directory"
            }

        except Exception as e:
            logger.error(f"Error moving {ready_filename} to working: {e}")
            raise

    def move_to_registered(self, filename: str) -> Dict[str, Any]:
        """Move a file from ready to registered. Called by the ingestion manager on PROD-PASS."""
        if not self.storage.exists(filename, "ready"):
            raise FileNotFoundError(f"File '{filename}' not found in ready directory")

        try:
            record = self.storage.get(filename, "ready")
            if not record:
                raise FileNotFoundError(f"Could not read data from {filename}")

            self.storage.create(filename, record["data"], "registered", curation_method=record.get("curation_method"))
            self.storage.delete(filename, "ready")

            logger.info(f"Moved {filename} from ready to registered")
            return {"status": "success", "filename": filename, "message": "Cell line moved to registered status"}

        except Exception as e:
            logger.error(f"Error moving {filename} to registered: {e}")
            raise

    def create_new_version_from_registered(self, filename: str, overwrite: bool = False) -> Dict[str, Any]:
        """Create a new working version from a registered cell line.

        Copies registered data into a new working file at the next version number.
        If a working copy already exists and overwrite=True, it is overwritten.
        A ready copy always blocks the operation.

        Raises:
            FileNotFoundError: If the file does not exist in registered.
            WorkingVersionConflict: If a working copy exists and overwrite=False.
            ReadyVersionConflict: If a ready copy exists.
        """
        registered_record = self.storage.get(filename, "registered")
        if not registered_record:
            raise FileNotFoundError(f"File '{filename}' not found in registered directory")

        data = registered_record["data"]
        curation_method = registered_record.get("curation_method")
        base_name = self._extract_hpscreg_name(data)

        ready_files = self.storage.get_files_for_base_name(base_name, "ready")
        if ready_files:
            raise ReadyVersionConflict(ready_files[0])

        working_files = self.storage.get_files_for_base_name(base_name, "working")
        if working_files:
            if not overwrite:
                raise WorkingVersionConflict(working_files[0])
            working_filename = working_files[0]
            self.storage.update(working_filename, data, "working", curation_method=curation_method)
            logger.info(f"Overwrote working copy {working_filename} with data from registered {filename}")
            return {
                "status": "success",
                "filename": working_filename,
                "action": "overwritten",
                "message": "Working copy overwritten with registered version data",
            }

        result = self.save_with_auto_versioning(data, curation_method=curation_method)
        result["action"] = "created"
        return result

    # ------------------------------------------------------------------
    # Versioning utilities
    # ------------------------------------------------------------------

    def get_next_version(self, base_name: str, existing_files: List[str]) -> int:
        """Return the next version number given a list of existing filenames.

        Returns 0 if no existing files, otherwise max parsed version + 1.
        """
        if not existing_files:
            return 0

        version_numbers = [
            v for v in (self.parse_version_from_filename(f) for f in existing_files)
            if v is not None
        ]
        return max(version_numbers) + 1 if version_numbers else 0

    def parse_version_from_filename(self, filename: str) -> Optional[int]:
        """Extract the version number from a filename like 'TestCell001_v2'. Returns None if absent."""
        if "_v" not in filename:
            return None
        try:
            return int(filename.split("_v")[-1])
        except (ValueError, IndexError):
            return None

    def create_versioned_filename(self, base_name: str, version: int) -> str:
        """Return '{base_name}_v{version}'."""
        return f"{base_name}_v{version}"

    def extract_base_name(self, filename: str) -> str:
        """Strip the version suffix from a filename, returning the base name."""
        if "_v" in filename:
            return filename.split("_v")[0]
        return filename

    def get_latest_version(self, existing_files: List[str]) -> Optional[str]:
        """Return the filename with the highest version number, or None if the list is empty."""
        if not existing_files:
            return None

        latest_num = -1
        latest_file = None

        for filename in existing_files:
            version = self.parse_version_from_filename(filename)
            if version is not None and version > latest_num:
                latest_num = version
                latest_file = filename

        return latest_file

    def get_all_versions(self, base_name: str, location: str = "ready") -> List[str]:
        """Return all version filenames for a base name in the given location."""
        return self.storage.get_files_for_base_name(base_name, location)

    def get_max_version_across_all_directories(self, base_name: str) -> int:
        """Return the highest version number for a base name across all three directories.

        Returns -1 if no versions exist anywhere.
        """
        version_numbers = []
        for location in ("working", "ready", "registered"):
            for filename in self.storage.get_files_for_base_name(base_name, location):
                v = self.parse_version_from_filename(filename)
                if v is not None:
                    version_numbers.append(v)

        return max(version_numbers) if version_numbers else -1

    def get_next_global_version(self, base_name: str) -> int:
        """Return the next version number using global versioning across all directories."""
        return self.get_max_version_across_all_directories(base_name) + 1

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _extract_hpscreg_name(self, data: Dict[str, Any]) -> str:
        """Extract hpscreg_name from cell line data (reads from general section)."""
        general = data.get("general") or {}
        name = general.get("hpscreg_name") or general.get("aushpscreg_name")
        if not name:
            raise ValueError("Cannot save file without hpscreg_name or aushpscreg_name in general")
        return name
