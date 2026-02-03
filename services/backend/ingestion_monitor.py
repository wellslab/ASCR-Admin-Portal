import csv
import logging
from pathlib import Path
from typing import Optional
from storage import StorageInterface
from data_transport import DataTransport

logger = logging.getLogger(__name__)


class IngestionMonitor:
    """Monitors ingestion log file and auto-moves successfully ingested files to registered directory.

    Reads a CSV log file written by the external database system and processes successful
    ingestions by moving files from ready/ to registered/ directory.
    """

    def __init__(self, log_path: str, storage: StorageInterface, data_transport: DataTransport):
        """Initialize ingestion monitor.

        Args:
            log_path: Path to the ingestion log CSV file
            storage: Storage interface for file operations
            data_transport: Data transport for moving files between directories
        """
        self.log_path = Path(log_path)
        self.storage = storage
        self.data_transport = data_transport
        self.state_file = Path("data/.ingestion_monitor_state")
        self.last_processed_line = self._load_state()

    def _load_state(self) -> int:
        """Load the last processed line number from state file."""
        if self.state_file.exists():
            try:
                return int(self.state_file.read_text().strip())
            except (ValueError, OSError):
                logger.warning("Could not read state file, starting from beginning")
                return 0
        return 0

    def _save_state(self, line_number: int):
        """Save the last processed line number to state file."""
        try:
            self.state_file.parent.mkdir(parents=True, exist_ok=True)
            self.state_file.write_text(str(line_number))
        except OSError as e:
            logger.error(f"Could not save state: {e}")

    def check_and_process_log(self) -> dict:
        """Read new lines from CSV log and process successful ingestions.

        Returns:
            dict: Processing summary with counts of processed, moved, and failed operations
        """
        if not self.log_path.exists():
            logger.debug(f"Ingestion log not found at {self.log_path}")
            return {"processed": 0, "moved": 0, "failed": 0, "message": "Log file not found"}

        processed_count = 0
        moved_count = 0
        failed_count = 0

        try:
            with open(self.log_path, 'r', newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)

                # Skip to last processed line
                for i in range(self.last_processed_line):
                    try:
                        next(reader)
                    except StopIteration:
                        break

                # Process new lines
                for row in reader:
                    processed_count += 1
                    current_line = self.last_processed_line + processed_count

                    try:
                        filename = row.get('filename', '').strip()
                        status = row.get('status', '').strip().lower()
                        timestamp = row.get('timestamp', '')

                        if not filename:
                            logger.warning(f"Empty filename in log line {current_line}")
                            continue

                        # Remove .json extension if present
                        if filename.endswith('.json'):
                            filename = filename[:-5]

                        # Only process successful ingestions
                        if status == 'success':
                            # Check if file exists in ready directory
                            if self.storage.exists(filename, "ready"):
                                try:
                                    self.data_transport.move_to_registered(filename)
                                    moved_count += 1
                                    logger.info(f"Moved {filename} to registered (ingested at {timestamp})")
                                except Exception as e:
                                    logger.error(f"Failed to move {filename} to registered: {e}")
                                    failed_count += 1
                            else:
                                logger.debug(f"File {filename} not found in ready directory (may have been moved already)")
                        elif status in ('failed', 'partial'):
                            logger.info(f"Ingestion {status} for {filename} at {timestamp}")

                    except Exception as e:
                        logger.error(f"Error processing log line {current_line}: {e}")
                        failed_count += 1

                # Update state
                if processed_count > 0:
                    self.last_processed_line += processed_count
                    self._save_state(self.last_processed_line)

        except Exception as e:
            logger.error(f"Error reading ingestion log: {e}")
            return {
                "processed": processed_count,
                "moved": moved_count,
                "failed": failed_count,
                "error": str(e)
            }

        logger.debug(f"Processed {processed_count} new log entries, moved {moved_count} files")
        return {
            "processed": processed_count,
            "moved": moved_count,
            "failed": failed_count,
            "message": "Success"
        }
