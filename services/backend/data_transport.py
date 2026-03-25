from typing import Dict, Any, Optional
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


class DataTransport:
    """Orchestrates changing the state of cell line records between working, queued and registered states.

    """

    def __init__(self, storage, version_control):
        """Initialize DataTransport with storage and version control dependencies.

        Sets up the orchestration layer by injecting the required storage and version control
        dependencies. This follows the Dependency Injection pattern for loose coupling.

        Args:
            storage: StorageInterface implementation for file operations. Must implement
                all required CRUD operations and file management methods.
            version_control: VersionControl instance for versioning logic. Must be
                initialized with the same storage instance for consistency.
        """
        self.storage = storage
        self.version_control = version_control

    def _extract_hpscreg_name(self, data: Dict[str, Any]) -> str:
        """Extract hpscreg_name from cell line data (reads from general section)"""
        general = data.get("general") or {}
        name = general.get("hpscreg_name") or general.get("aushpscreg_name")
        if not name:
            raise ValueError("Cannot save file without hpscreg_name or aushpscreg_name in general")
        return name

    def save_with_auto_versioning(self, cell_line_data: Dict[str, Any], curation_method: Optional[str] = None) -> Dict[str, Any]:
        """Create a new working cell line with version number based on registered history.

        Version number = number of previously registered copies of this hpscreg_name.
        Raises ValueError if a working or ready copy already exists (conflict).
        """
        base_name = self._extract_hpscreg_name(cell_line_data)

        # Conflict: working copy already exists
        working_files = self.storage.get_files_for_base_name(base_name, "working")
        if working_files:
            raise ValueError(
                f"A working copy of '{base_name}' already exists ({working_files[0]}). "
                "Edit the existing copy instead."
            )

        # Conflict: ready copy already exists
        ready_files = self.storage.get_files_for_base_name(base_name, "ready")
        if ready_files:
            raise ValueError(
                f"A ready copy of '{base_name}' exists. "
                "Finalise this cell line before creating a new version."
            )

        # Version number = next after highest registered version
        registered_files = self.storage.get_files_for_base_name(base_name, "registered")
        next_version = self.version_control.get_next_version(base_name, registered_files)

        versioned_filename = self.version_control.create_versioned_filename(base_name, next_version)

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
        """Move file from working to ready directory without creating new version.

        The file already has a version number assigned, so this is a simple move operation
        from working to ready status. The version number remains unchanged.

        Args:
            filename (str): Name of the file in working directory to move.

        Returns:
            Dict[str, Any]: Operation result containing:
                - status (str): "success" if operation completed
                - filename (str): Filename (unchanged)
                - message (str): Human-readable success message

        Raises:
            FileNotFoundError: If file doesn't exist in working directory
            Exception: For any storage operation failures
        """
        if not self.storage.exists(filename, "working"):
            raise FileNotFoundError(f"File '{filename}' not found in working directory")

        try:
            # Get data from working
            cell_line_data = self.storage.get(filename, "working")
            if not cell_line_data:
                raise FileNotFoundError(f"Could not read data from {filename}")

            # Create in ready
            self.storage.create(filename, cell_line_data["data"], "ready", curation_method=cell_line_data.get("curation_method"))

            # Delete from working
            self.storage.delete(filename, "working")

            logger.info(f"Moved {filename} from working to ready")

            return {
                "status": "success",
                "filename": filename,
                "message": f"Cell line moved to ready status"
            }

        except Exception as e:
            logger.error(f"Error moving {filename} to ready: {e}")
            raise

    def move_to_registered(self, filename: str) -> Dict[str, Any]:
        """Move file from ready to registered directory.

        This is typically called automatically by the ingestion monitor when a file
        has been successfully ingested into the external database.

        Args:
            filename (str): Name of the file in ready directory to move.

        Returns:
            Dict[str, Any]: Operation result containing:
                - status (str): "success" if operation completed
                - filename (str): Filename (unchanged)
                - message (str): Human-readable success message

        Raises:
            FileNotFoundError: If file doesn't exist in ready directory
            Exception: For any storage operation failures
        """
        if not self.storage.exists(filename, "ready"):
            raise FileNotFoundError(f"File '{filename}' not found in ready directory")

        try:
            # Get data from ready
            cell_line_data = self.storage.get(filename, "ready")
            if not cell_line_data:
                raise FileNotFoundError(f"Could not read data from {filename}")

            # Create in registered
            self.storage.create(filename, cell_line_data["data"], "registered", curation_method=cell_line_data.get("curation_method"))

            # Delete from ready
            self.storage.delete(filename, "ready")

            logger.info(f"Moved {filename} from ready to registered")

            return {
                "status": "success",
                "filename": filename,
                "message": f"Cell line moved to registered status"
            }

        except Exception as e:
            logger.error(f"Error moving {filename} to registered: {e}")
            raise

    def move_to_working(self, ready_filename: str) -> Dict[str, Any]:
        """Move file from ready back to working directory.
        
        This method handles the reverse operation of moving files from ready status back
        to working directory for further editing. This is typically used when users want
        to modify a published cell line record.
        
        The file retains its current name and version information.
        
        Args:
            ready_filename (str): Name of the file in ready directory to move.
                Should include version suffix if applicable (e.g., 'TestCell001_v1').
                
        Returns:
            Dict[str, Any]: Operation result dictionary containing:
                - status (str): "success" if operation completed successfully
                - filename (str): Name of the file (unchanged from input)
                - new_location (str): "working" to indicate destination
                - message (str): Human-readable success message
                
        Raises:
            FileNotFoundError: If the specified file doesn't exist in ready directory,
                or if file data cannot be read from storage.
            ValueError: If a file with the same name already exists in working directory.
                This prevents accidental overwrites of working files.
            Exception: For any storage operation failures during the move process.
                The original exception is re-raised to preserve error details.
                
        Example:
            >>> dt = DataTransport(storage, version_control)
            >>> result = dt.move_to_working("TestCell001_v1")
            >>> print(f"Moved to {result['new_location']}: {result['filename']}")
            'Moved to working: TestCell001_v1'
        """
        # Check if file exists in ready directory
        if not self.storage.exists(ready_filename, "ready"):
            raise FileNotFoundError(f"File '{ready_filename}' not found in ready directory")
        
        # Check if file already exists in working directory
        if self.storage.exists(ready_filename, "working"):
            raise ValueError(f"File '{ready_filename}' already exists in working directory")
        
        try:
            # Get data from ready
            cell_line_data = self.storage.get(ready_filename, "ready")
            if not cell_line_data:
                raise FileNotFoundError(f"Could not read data from {ready_filename}")
            
            # Create in working
            self.storage.create(ready_filename, cell_line_data["data"], "working", curation_method=cell_line_data.get("curation_method"))

            # Delete from ready
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
            # Re-raise to let caller handle appropriately
            raise

    def create_new_version_from_registered(self, filename: str, overwrite: bool = False) -> Dict[str, Any]:
        """Create a new working version from a registered cell line.

        Copies the registered cell line's data into a new working file with the next version number.
        If a working copy already exists and overwrite=True, that copy is overwritten with the
        registered data instead. A ready copy always blocks the operation (cannot overwrite).

        Raises:
            FileNotFoundError: If the file does not exist in registered.
            WorkingVersionConflict: If a working copy exists and overwrite=False.
            ReadyVersionConflict: If a ready copy exists (overwrite not offered).
        """
        registered_record = self.storage.get(filename, "registered")
        if not registered_record:
            raise FileNotFoundError(f"File '{filename}' not found in registered directory")

        data = registered_record["data"]
        curation_method = registered_record.get("curation_method")
        base_name = self._extract_hpscreg_name(data)

        # Ready copy blocks unconditionally
        ready_files = self.storage.get_files_for_base_name(base_name, "ready")
        if ready_files:
            raise ReadyVersionConflict(ready_files[0])

        # Working copy conflict — offer overwrite
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
                "message": f"Working copy overwritten with registered version data",
            }

        # No conflicts — create next version
        result = self.save_with_auto_versioning(data, curation_method=curation_method)
        result["action"] = "created"
        return result