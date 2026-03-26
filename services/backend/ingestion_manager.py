import json
import logging
import re
from pathlib import Path
from typing import Optional
from storage import StorageInterface
from file_manager import FileManager

logger = logging.getLogger(__name__)


class IngestionManager:
    """Reads run_log.json and resolves the ingestion outcome for cell lines in the ready directory.

    For each file in ready/:
    - PROD-PASS (latest run) → move to registered
    - ERROR (latest run)     → move back to working for curator review
    - Anything else          → leave in ready (not yet ingested at production level)
    """

    def __init__(self, run_log_path: str, storage: StorageInterface, file_manager: FileManager):
        self.run_log_path = Path(run_log_path)
        self.storage = storage
        self.file_manager = file_manager

    def _load_run_log(self) -> dict:
        if not self.run_log_path.exists():
            logger.debug(f"Run log not found at {self.run_log_path}")
            return {}
        try:
            return json.loads(self.run_log_path.read_text(encoding="utf-8"))
        except Exception as e:
            logger.error(f"Failed to read run log: {e}")
            return {}

    def _parse_filename(self, filename: str) -> Optional[tuple[str, str]]:
        """Split 'AIBNi001-A_v0' into ('AIBNi001-A', 'v0'). Returns None if no version suffix."""
        match = re.match(r"^(.+)_(v\d+)$", filename)
        if not match:
            return None
        return match.group(1), match.group(2)

    def _latest_status(self, run_log: dict, base_name: str, version_key: str) -> Optional[str]:
        """Return the status of the most recent ingest_run, or None if not present."""
        entry = run_log.get(base_name, {}).get(version_key, {})
        runs = entry.get("ingest_runs", [])
        if not runs:
            return None
        return runs[-1].get("status")

    def _latest_run_date(self, run_log: dict, base_name: str, version_key: str) -> Optional[str]:
        entry = run_log.get(base_name, {}).get(version_key, {})
        runs = entry.get("ingest_runs", [])
        if not runs:
            return None
        return runs[-1].get("date")

    def process_ready_files(self) -> dict:
        """Check all ready files against the run log and move them to the appropriate state.

        Returns a summary dict with counts: processed, moved_to_registered, moved_to_working, skipped.
        """
        run_log = self._load_run_log()
        ready_files = self.storage.list_files("ready")

        moved_to_registered = 0
        moved_to_working = 0
        skipped = 0

        for filename in ready_files:
            parsed = self._parse_filename(filename)
            if not parsed:
                logger.warning(f"Could not parse version from filename '{filename}', skipping")
                skipped += 1
                continue

            base_name, version_key = parsed
            status = self._latest_status(run_log, base_name, version_key)

            if status == "PROD-PASS":
                try:
                    self.file_manager.move_to_registered(filename)
                    moved_to_registered += 1
                    logger.info(f"Moved {filename} to registered (PROD-PASS)")
                except Exception as e:
                    logger.error(f"Failed to move {filename} to registered: {e}")
                    skipped += 1

            elif status == "ERROR":
                try:
                    self.file_manager.move_to_working(filename)
                    moved_to_working += 1
                    logger.info(f"Moved {filename} back to working (ERROR)")
                except Exception as e:
                    logger.error(f"Failed to move {filename} to working: {e}")
                    skipped += 1

            else:
                # No entry, empty runs, DEV-PASS, or unknown status — leave in ready
                skipped += 1

        total = len(ready_files)
        logger.info(
            f"Ingestion check complete: {total} ready files, "
            f"{moved_to_registered} registered, {moved_to_working} returned to working, {skipped} skipped"
        )

        return {
            "processed": total,
            "moved_to_registered": moved_to_registered,
            "moved_to_working": moved_to_working,
            "skipped": skipped,
        }

    def get_errors(self) -> list:
        """Return working files whose most recent run log entry has status ERROR.

        Used by the Ingestion Monitor frontend page to list cell lines needing curator attention.
        Each entry includes filename, base_name, version_key, and last_run_date.
        """
        run_log = self._load_run_log()
        working_files = self.storage.list_files("working")
        errors = []

        for filename in working_files:
            parsed = self._parse_filename(filename)
            if not parsed:
                continue
            base_name, version_key = parsed
            status = self._latest_status(run_log, base_name, version_key)
            if status == "ERROR":
                errors.append({
                    "filename": filename,
                    "base_name": base_name,
                    "version": version_key,
                    "last_run_date": self._latest_run_date(run_log, base_name, version_key),
                })

        return errors
