import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import TokenBlacklist

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user():
    user = User.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='SecurePass123!'
    )
    return user


@pytest.fixture
def test_user_tokens(test_user):
    refresh = RefreshToken.for_user(test_user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


@pytest.mark.django_db
class TestUserRegistration:
    def test_register_with_valid_data_returns_201(self, api_client):
        """Test successful registration with valid data"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = api_client.post('/api/users/register/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['username'] == 'newuser'
        assert response.data['email'] == 'newuser@example.com'
        assert User.objects.filter(username='newuser').exists()

    def test_register_user_persisted_in_database(self, api_client):
        """Test that registered user is actually saved to database"""
        data = {
            'username': 'dbuser',
            'email': 'dbuser@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        api_client.post('/api/users/register/', data)
        user = User.objects.get(username='dbuser')
        assert user.email == 'dbuser@example.com'
        assert user.check_password('SecurePass123!')

    def test_register_with_password_mismatch_returns_400(self, api_client):
        """Test registration fails when passwords don't match"""
        data = {
            'username': 'mismatchuser',
            'email': 'mismatch@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'DifferentPass456!',
        }
        response = api_client.post('/api/users/register/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password_confirm' in response.data

    def test_register_with_duplicate_username_returns_400(self, api_client, test_user):
        """Test registration fails with duplicate username"""
        data = {
            'username': 'testuser',
            'email': 'different@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = api_client.post('/api/users/register/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'username' in response.data

    def test_register_with_duplicate_email_returns_400(self, api_client, test_user):
        """Test registration fails with duplicate email"""
        data = {
            'username': 'newuser',
            'email': 'testuser@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = api_client.post('/api/users/register/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_register_without_username_returns_400(self, api_client):
        """Test registration fails when username is missing"""
        data = {
            'email': 'nouser@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = api_client.post('/api/users/register/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'username' in response.data

    def test_register_without_email_returns_400(self, api_client):
        """Test registration fails when email is missing"""
        data = {
            'username': 'noemail',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = api_client.post('/api/users/register/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_register_with_short_password_returns_400(self, api_client):
        """Test registration fails when password is too short"""
        data = {
            'username': 'shortpass',
            'email': 'short@example.com',
            'password': 'Short1!',
            'password_confirm': 'Short1!',
        }
        response = api_client.post('/api/users/register/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_returns_200_without_password(self, api_client):
        """Test that response doesn't expose password field"""
        data = {
            'username': 'secureuser',
            'email': 'secure@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = api_client.post('/api/users/register/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'password' not in response.data
        assert 'password_confirm' not in response.data


@pytest.mark.django_db
class TestUserLogin:
    def test_login_with_valid_credentials_returns_tokens(self, api_client, test_user):
        """Test successful login returns access and refresh tokens"""
        data = {
            'username': 'testuser',
            'password': 'SecurePass123!',
        }
        response = api_client.post('/api/token/', data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_login_returns_access_token_is_valid(self, api_client, test_user):
        """Test that returned access token is valid and can be decoded"""
        data = {
            'username': 'testuser',
            'password': 'SecurePass123!',
        }
        response = api_client.post('/api/token/', data)
        access_token = response.data['access']
        assert access_token is not None
        assert len(access_token) > 0

    def test_login_returns_refresh_token_is_valid(self, api_client, test_user):
        """Test that returned refresh token is valid"""
        data = {
            'username': 'testuser',
            'password': 'SecurePass123!',
        }
        response = api_client.post('/api/token/', data)
        refresh_token = response.data['refresh']
        assert refresh_token is not None
        assert len(refresh_token) > 0

    def test_login_with_invalid_password_returns_401(self, api_client, test_user):
        """Test login fails with incorrect password"""
        data = {
            'username': 'testuser',
            'password': 'WrongPassword123!',
        }
        response = api_client.post('/api/token/', data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_with_nonexistent_user_returns_401(self, api_client):
        """Test login fails with nonexistent username"""
        data = {
            'username': 'nonexistent',
            'password': 'SomePassword123!',
        }
        response = api_client.post('/api/token/', data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_without_username_returns_400(self, api_client):
        """Test login fails when username is missing"""
        data = {
            'password': 'SomePassword123!',
        }
        response = api_client.post('/api/token/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_without_password_returns_400(self, api_client):
        """Test login fails when password is missing"""
        data = {
            'username': 'someuser',
        }
        response = api_client.post('/api/token/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestTokenRefresh:
    def test_refresh_token_returns_new_access_token(self, api_client, test_user_tokens):
        """Test that refresh token produces a new access token"""
        data = {
            'refresh': test_user_tokens['refresh'],
        }
        response = api_client.post('/api/token/refresh/', data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert response.data['access'] is not None

    def test_refresh_with_invalid_token_returns_401(self, api_client):
        """Test refresh fails with invalid token"""
        data = {
            'refresh': 'invalid.token.here',
        }
        response = api_client.post('/api/token/refresh/', data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_without_token_returns_400(self, api_client):
        """Test refresh fails when token is missing"""
        data = {}
        response = api_client.post('/api/token/refresh/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_new_access_token_can_authenticate_request(self, api_client, test_user_tokens):
        """Test that new access token from refresh can authenticate requests"""
        refresh_data = {
            'refresh': test_user_tokens['refresh'],
        }
        refresh_response = api_client.post('/api/token/refresh/', refresh_data)
        new_access_token = refresh_response.data['access']
        
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access_token}')
        response = api_client.get('/api/users/me/')
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestAuthenticatedEndpoints:
    def test_get_me_without_authentication_returns_401(self, api_client):
        """Test /me endpoint requires authentication"""
        response = api_client.get('/api/users/me/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_me_with_valid_token_returns_user_data(self, api_client, test_user, test_user_tokens):
        """Test /me endpoint returns current user data with valid token"""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {test_user_tokens["access"]}')
        response = api_client.get('/api/users/me/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == test_user.id
        assert response.data['username'] == 'testuser'
        assert response.data['email'] == 'testuser@example.com'

    def test_get_me_with_invalid_token_returns_401(self, api_client):
        """Test /me endpoint rejects invalid token"""
        api_client.credentials(HTTP_AUTHORIZATION='Bearer invalid.token.here')
        response = api_client.get('/api/users/me/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_me_returns_correct_user_data_format(self, api_client, test_user, test_user_tokens):
        """Test /me endpoint returns expected fields"""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {test_user_tokens["access"]}')
        response = api_client.get('/api/users/me/')
        expected_fields = ['id', 'username', 'email', 'first_name', 'last_name']
        for field in expected_fields:
            assert field in response.data


@pytest.mark.django_db
class TestLogout:
    def test_logout_without_authentication_returns_401(self, api_client):
        """Test logout endpoint requires authentication"""
        data = {'refresh_token': 'some_token'}
        response = api_client.post('/api/users/logout/', data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout_with_valid_refresh_token_returns_200(self, api_client, test_user_tokens):
        """Test successful logout adds token to blacklist"""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {test_user_tokens["access"]}')
        data = {'refresh_token': test_user_tokens['refresh']}
        response = api_client.post('/api/users/logout/', data)
        assert response.status_code == status.HTTP_200_OK
        assert 'detail' in response.data

    def test_logout_without_refresh_token_returns_400(self, api_client, test_user_tokens):
        """Test logout fails when refresh token is missing"""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {test_user_tokens["access"]}')
        data = {}
        response = api_client.post('/api/users/logout/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_logout_adds_token_to_blacklist(self, api_client, test_user_tokens):
        """Test that logout actually blacklists the token"""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {test_user_tokens["access"]}')
        data = {'refresh_token': test_user_tokens['refresh']}
        initial_count = TokenBlacklist.objects.count()
        api_client.post('/api/users/logout/', data)
        assert TokenBlacklist.objects.count() == initial_count + 1

    def test_logout_with_invalid_refresh_token_returns_400(self, api_client, test_user_tokens):
        """Test logout fails with invalid refresh token"""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {test_user_tokens["access"]}')
        data = {'refresh_token': 'invalid.token.here'}
        response = api_client.post('/api/users/logout/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestAuthenticationFlow:
    def test_complete_auth_flow(self, api_client):
        """Test complete authentication flow: register -> login -> access protected endpoint -> logout"""
        # Step 1: Register
        register_data = {
            'username': 'flowuser',
            'email': 'flow@example.com',
            'password': 'FlowPass123!',
            'password_confirm': 'FlowPass123!',
        }
        register_response = api_client.post('/api/users/register/', register_data)
        assert register_response.status_code == status.HTTP_201_CREATED

        # Step 2: Login
        login_data = {
            'username': 'flowuser',
            'password': 'FlowPass123!',
        }
        login_response = api_client.post('/api/token/', login_data)
        assert login_response.status_code == status.HTTP_200_OK
        access_token = login_response.data['access']
        refresh_token = login_response.data['refresh']

        # Step 3: Access protected endpoint
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        me_response = api_client.get('/api/users/me/')
        assert me_response.status_code == status.HTTP_200_OK
        assert me_response.data['username'] == 'flowuser'

        # Step 4: Logout
        logout_data = {'refresh_token': refresh_token}
        logout_response = api_client.post('/api/users/logout/', logout_data)
        assert logout_response.status_code == status.HTTP_200_OK

    def test_cannot_login_after_logout(self, api_client, test_user):
        """Test that user can log in again after logout"""
        # Login
        login_data = {
            'username': 'testuser',
            'password': 'SecurePass123!',
        }
        login_response = api_client.post('/api/token/', login_data)
        refresh_token = login_response.data['refresh']
        access_token = login_response.data['access']

        # Logout
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_data = {'refresh_token': refresh_token}
        api_client.post('/api/users/logout/', logout_data)

        # Try to login again
        api_client.credentials()
        login_response_2 = api_client.post('/api/token/', login_data)
        assert login_response_2.status_code == status.HTTP_200_OK
        assert 'access' in login_response_2.data
        assert 'refresh' in login_response_2.data
