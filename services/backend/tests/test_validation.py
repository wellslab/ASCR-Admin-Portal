import pytest
import requests

BASE_URL = "http://localhost:8001"


class TestCellLineValidation:
    """Test cell line creation and update validation"""

    def test_valid_cell_line_passes_validation(self, valid_cell_line_data):
        """
        Test that valid cell line data passes validation.

        - Given: valid cell line data
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 200 with `status: "success"`, `filename`, and `version`
        """
        response = requests.post(f"{BASE_URL}/working/cell-line", json=valid_cell_line_data)

        assert response.status_code == 200
        result = response.json()
        assert result["status"] == "success"
        assert "filename" in result
        assert "version" in result

    def test_invalid_cell_type_rejected(self, valid_cell_line_data):
        """
        Test that invalid cell_type enum value is rejected.

        - Given: cell line data with `cell_type` set to "invalid_cell_type"
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422 with error detail mentioning "cell_type"
        """
        # Modify valid data to have invalid cell_type
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        invalid_data["cell_line"][0]["cell_type"] = "invalid_cell_type"

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422
        error_detail = response.json()["detail"]
        assert len(error_detail) > 0
        # Check that the error mentions cell_type
        assert any("cell_type" in str(error).lower() for error in error_detail)

    def test_invalid_status_enum_rejected(self, valid_cell_line_data):
        """
        Test that invalid status enum value is rejected.

        - Given: cell line data with `status` set to "InvalidStatus"
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422 with error detail mentioning "status"
        """
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        invalid_data["cell_line"][0]["status"] = "InvalidStatus"

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422
        error_detail = response.json()["detail"]
        assert any("status" in str(error).lower() for error in error_detail)

    def test_invalid_genotype_enum_rejected(self, valid_cell_line_data):
        """
        Test that invalid genotype enum value is rejected.

        - Given: cell line data with `genotype` set to "InvalidGenotype"
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422
        """
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        invalid_data["cell_line"][0]["genotype"] = "InvalidGenotype"

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422

    def test_missing_required_cell_type_rejected(self, valid_cell_line_data):
        """
        Test that missing required field cell_type is rejected.

        - Given: cell line data with `cell_type` field removed
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422 with error detail mentioning "cell_type"
        """
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        del invalid_data["cell_line"][0]["cell_type"]

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422
        error_detail = response.json()["detail"]
        assert any("cell_type" in str(error).lower() for error in error_detail)

    def test_invalid_float_field_rejected(self, valid_cell_line_data):
        """
        Test that non-numeric value for float field is rejected.

        - Given: culture medium data with `co2_concentration` set to "not_a_number"
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422 with error detail mentioning "co2_concentration"
        """
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        invalid_data["culture_medium"] = [{
            "co2_concentration": "not_a_number",  # Should be float
            "o2_concentration": 5.0,
            "passage_method": "Enzymatically",
            "other_passage_method": "...",
            "culture_medium_items": "..."
        }]

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422
        error_detail = response.json()["detail"]
        assert any("co2_concentration" in str(error).lower() for error in error_detail)

    def test_invalid_boolean_field_rejected(self, valid_cell_line_data):
        """
        Test that non-boolean value for boolean field is rejected.

        - Given: cell line data with `frozen` set to "not_a_boolean"
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422
        """
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        invalid_data["cell_line"][0]["frozen"] = "not_a_boolean"  # Should be bool

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422

    def test_max_length_violation_rejected(self, valid_cell_line_data):
        """
        Test that string exceeding max_length is rejected.

        - Given: cell line data with `hpscreg_name` set to 101 characters (exceeds max_length=100)
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422
        """
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        # hpscreg_name has max_length=100
        invalid_data["cell_line"][0]["hpscreg_name"] = "a" * 101

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422

    def test_update_endpoint_validates_data(self, valid_cell_line_data):
        """
        Test that PUT endpoint also validates data.

        - Given: an existing cell line created with valid data
        - When: attempting to update it via PUT with invalid `cell_type`
        - Then: returns HTTP 422
        """
        # First create a valid cell line
        create_response = requests.post(f"{BASE_URL}/working/cell-line", json=valid_cell_line_data)
        assert create_response.status_code == 200
        filename = create_response.json()["filename"]

        # Try to update with invalid data
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        invalid_data["cell_line"][0]["cell_type"] = "invalid_type"

        update_response = requests.put(f"{BASE_URL}/working/cell-line/{filename}", json=invalid_data)

        assert update_response.status_code == 422

    def test_multiple_validation_errors_returned(self, valid_cell_line_data):
        """
        Test that multiple validation errors are returned together.

        - Given: cell line data with three invalid fields: `cell_type`, `status`, and `genotype`
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422 with at least 3 error messages in the detail array
        """
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        invalid_data["cell_line"][0]["cell_type"] = "invalid_type"
        invalid_data["cell_line"][0]["status"] = "invalid_status"
        invalid_data["cell_line"][0]["genotype"] = "invalid_genotype"

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422
        error_detail = response.json()["detail"]
        # Should have at least 3 errors (one for each invalid field)
        assert len(error_detail) >= 3

    def test_optional_fields_can_be_null(self, valid_cell_line_data):
        """
        Test that optional fields can be null or omitted.

        - Given: cell line data with optional field `cell_line_alt_name` set to `null`
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 200 with successful creation
        """
        import copy
        data = copy.deepcopy(valid_cell_line_data)
        # cell_line_alt_name is optional
        data["cell_line"][0]["cell_line_alt_name"] = None

        response = requests.post(f"{BASE_URL}/working/cell-line", json=data)

        assert response.status_code == 200

    def test_date_field_validation(self, valid_cell_line_data):
        """
        Test that invalid date format is rejected.

        - Given: cell line data with `embargo_date` set to "not-a-date"
        - When: submitted to POST `/working/cell-line`
        - Then: returns HTTP 422
        """
        import copy
        invalid_data = copy.deepcopy(valid_cell_line_data)
        invalid_data["cell_line"][0]["embargo_date"] = "not-a-date"

        response = requests.post(f"{BASE_URL}/working/cell-line", json=invalid_data)

        assert response.status_code == 422


@pytest.fixture
def valid_cell_line_data():
    """
    Fixture providing a valid cell line data structure.

    Provides a baseline valid cell line data structure with all required fields
    properly set and empty arrays for optional sections. Tests modify copies of
    this fixture to introduce specific validation failures.
    """
    return {
        "cell_line": [{
            "hpscreg_name": "TEST001",
            "cell_line_alt_name": None,
            "cell_type": "human induced pluripotent stem cell (hiPSC)",
            "status": "Characterised",
            "genotype": "Patient Control",
            "genotype_locus": "...",
            "frozen": False,
            "associated_polymorphism": None,
            "research_use": True,
            "clinical_use": False,
            "commercial_use": False,
            "certificate_of_pluripotency_characterisation": False,
            "publish": True,
            "embargo_date": None,
            "registered_with_hpscreg": "Not Registered",
            "curation_status": "Not yet reviewed by Australian Stem Cell Registry"
        }],
        "external_cell_line_source": [],
        "contact": [],
        "institute": [],
        "group": [],
        "ethics": [],
        "registration_requirements": [],
        "x_ref": [],
        "publication": [],
        "donor_source": [],
        "disease": [],
        "medium_component_items": [],
        "culture_medium": [],
        "microbiology_virology_screening": [],
        "genomic_alteration": [],
        "characterisation_protocol_result": [],
        "undifferentiated_characterisation": [],
        "hpsc_scorecard": [],
        "un_diff_characterisation_expression_marker_method": [],
        "characterisation_method": [],
        "genomic_characterisation": [],
        "additional_genomic_characterisation": [],
        "hla_result": [],
        "str_or_fingerprinting": [],
        "loci": [],
        "vector_free_reprogram": [],
        "integrated_vector": [],
        "non_integrated_vector": [],
        "cell_line_derivation_induced_pluripotent": [],
        "cell_line_derivation_embryonic": [],
        "synonym": [],
        "idp_gene": [],
        "vector_free_reprogramming_genes": [],
        "small_molecule": [],
        "ontology": [],
        "synonyms": []
    }
