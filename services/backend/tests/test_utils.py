import pytest
from validation import get_frontend_schema


class TestSchemaGeneration:
    """Tests for schema generation utilities in validation.py."""

    def test_get_frontend_schema(self):
        """Test that get_frontend_schema returns a valid schema for JSONOutputSchema."""
        from data_dictionaries.models import JSONOutputSchema
        result = get_frontend_schema(JSONOutputSchema)

        assert "sections" in result
        assert result["model_name"] == "JSONOutputSchema"
