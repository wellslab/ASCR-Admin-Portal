"""
API and usage tracking models for the curation service.

Cell line data models are auto-generated in data_dictionaries/curation_models.py
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Any, Dict


# Usage metadata models
class UsageData(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    curation_time_seconds: float
    raw_response: Optional[Dict[str, Any]] = None
    error_response: Optional[Dict[str, Any]] = None


class IdentificationUsage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    identification_time_seconds: float
    raw_response: Optional[Dict[str, Any]] = None
    error_response: Optional[Dict[str, Any]] = None


class UsageMetadata(BaseModel):
    identification_usage: Optional[IdentificationUsage] = None
    curation_usage: Optional[List[UsageData]] = None
    error_response: Optional[Dict[str, Any]] = None


# Complete curation response
class CurationResponse(BaseModel):
    status: Literal["success", "error"]
    message: str
    filename: str
    file_size_kb: float
    cell_lines_found: Optional[int] = None
    successful_curations: Optional[int] = None
    failed_cell_lines: Optional[List[str]] = None
    curated_data: Optional[Dict[str, Any]] = None  # CellLineCurationForm data
    usage_metadata: Optional[UsageMetadata] = None
    error: Optional[str] = None


# API Request/Response models
class FileRequest(BaseModel):
    filename: str
    file_data: str  # PDF file as Base64 string


class StartAICurationRequest(BaseModel):
    files: List[FileRequest]


class TaskCompletionNotification(BaseModel):
    type: str
    task_id: str
    filename: str
    result: Dict[str, Any]
    timestamp: str


class StandardRecord(BaseModel):
    """Canonical on-disk and API format for a cell line record.

    Wraps JSONOutputSchema data with provenance fields. All cell line JSON files
    stored in the archive use this structure.

    To add a new provenance field: add it here as Optional with a default, then
    run /admin/migrate-schema. Existing records will receive the default value.
    Fields that require a real derived value (not null) need explicit population
    logic added to the migrate_all() function in schema_migration.py.
    """
    filename: str
    location: Literal["working", "ready", "registered"]
    version: Optional[int] = None
    curation_method: Optional[str] = None
    last_modified: Optional[str] = None  # ISO 8601 datetime
    data: Dict[str, Any] = Field(default_factory=dict)
