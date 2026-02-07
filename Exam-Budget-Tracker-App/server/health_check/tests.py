import pytest
from django.test import Client
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestHealthCheck:
    def test_health_check_endpoint_returns_ok_status(self, api_client):
        """Test that GET /up returns status 200 with ok response"""
        response = api_client.get('/up')
        assert response.status_code == 200
        assert response.data == {'status': 'ok'}

    def test_health_check_endpoint_no_authentication_required(self, api_client):
        """Test that /up endpoint doesn't require authentication"""
        response = api_client.get('/up')
        assert response.status_code == 200

    def test_health_check_endpoint_response_format(self, api_client):
        """Test that /up returns correct response format"""
        response = api_client.get('/up')
        assert 'status' in response.data
        assert isinstance(response.data['status'], str)
