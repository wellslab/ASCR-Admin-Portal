import os
import json
from pathlib import Path
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger(__name__)

# Single source of truth for all user-configurable settings.
# Adding an entry here makes it appear in the Settings page automatically.
SETTINGS_SCHEMA = [
    {
        "key": "OPENAI_API_KEY",
        "label": "OpenAI API Key",
        "description": "Required to run AI curation. Stored only in config.json on this server.",
        "type": "secret",
        "default": None,
    },
    {
        "key": "SELECTED_MODEL",
        "label": "Curation Model",
        "description": "The OpenAI model used for all curation agents.",
        "type": "select",
        "default": "gpt-4.1-mini",
    },
    {
        "key": "DATA_DICT_PATH",
        "label": "Data Dictionary File",
        "description": "Path to the data dictionary Excel file, relative to the backend root (/app). Update this if the file is renamed.",
        "type": "string",
        "default": "data_dictionaries/2026_02_ascr_data_dictionary_v1.1 (1).xlsx",
    },
]


class ConfigManager:
    """
    Manages application configuration with runtime updates.

    Config is persisted to a JSON file. Location is controlled by the CONFIG_PATH
    environment variable, defaulting to config.json beside this module.
    """

    def __init__(self, config_file: str = None):
        if config_file is None:
            config_file = os.getenv("CONFIG_PATH", str(Path(__file__).parent / "config.json"))
        self.config_file = Path(config_file)

    def _load(self) -> Dict[str, Any]:
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                logger.error(f"Error loading config file: {e}")
        return {}

    def _save(self, config: Dict[str, Any]) -> None:
        try:
            self.config_file.parent.mkdir(parents=True, exist_ok=True)
            with open(self.config_file, 'w') as f:
                json.dump(config, f, indent=2)
        except IOError as e:
            logger.error(f"Error saving config file: {e}")
            raise

    def get(self, key: str, default: Any = None) -> Any:
        """Get a config value, falling back to the schema default then the provided default."""
        config = self._load()
        if key in config:
            return config[key]
        for setting in SETTINGS_SCHEMA:
            if setting["key"] == key and setting.get("default") is not None:
                return setting["default"]
        return default

    def set(self, key: str, value: Any) -> None:
        config = self._load()
        config[key] = value
        self._save(config)

    def update_settings(self, settings: Dict[str, Any]) -> None:
        """Update multiple settings at once. Only writes non-empty values."""
        config = self._load()
        for key, value in settings.items():
            if value is not None and value != "":
                config[key] = value
        self._save(config)

    def get_all_settings(self) -> List[Dict[str, Any]]:
        """
        Return all configurable settings from the schema with their current values.
        Settings not yet written to config.json show their schema default.
        """
        config = self._load()
        result = []
        for schema_item in SETTINGS_SCHEMA:
            key = schema_item["key"]
            item = {
                "key": key,
                "label": schema_item["label"],
                "description": schema_item["description"],
                "type": schema_item["type"],
                "value": config.get(key, schema_item.get("default")),
            }
            if schema_item["type"] == "select":
                item["options"] = config.get("AVAILABLE_MODELS", ["gpt-4.1", "gpt-4.1-mini"])
            result.append(item)
        return result


# Global instance
config_manager = ConfigManager()
