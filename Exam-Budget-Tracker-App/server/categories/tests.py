import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from budgets.models import Budget
from transactions.models import Transaction
from .models import Category

User = get_user_model()


@pytest.fixture
def api_client():
    """Provide unauthenticated API client"""
    return APIClient()


@pytest.fixture
def test_user():
    """Create first test user"""
    return User.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='SecurePass123!'
    )


@pytest.fixture
def test_user_2():
    """Create second test user for isolation testing"""
    return User.objects.create_user(
        username='testuser2',
        email='testuser2@example.com',
        password='SecurePass123!'
    )


@pytest.fixture
def authenticated_client(test_user):
    """Provide authenticated API client for test_user"""
    client = APIClient()
    refresh = RefreshToken.for_user(test_user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client


@pytest.fixture
def authenticated_client_2(test_user_2):
    """Provide authenticated API client for test_user_2"""
    client = APIClient()
    refresh = RefreshToken.for_user(test_user_2)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client


@pytest.fixture
def valid_category_data():
    """Provide valid category data for creation tests"""
    return {
        'name': 'Groceries'
    }


@pytest.fixture
def category_for_user1(test_user):
    """Create a category owned by test_user"""
    return Category.objects.create(user=test_user, name='Utilities')


@pytest.fixture
def category_for_user2(test_user_2):
    """Create a category owned by test_user_2"""
    return Category.objects.create(user=test_user_2, name='Travel')


@pytest.fixture
def budget_for_user1(test_user):
    """Create a budget owned by test_user"""
    return Budget.objects.create(
        user=test_user,
        title='Existing Budget',
        description='Already created budget',
        date='2026-01-01',
        initial_amount='1000.00'
    )


# ==================== AUTHENTICATION TESTS ====================

@pytest.mark.django_db
class TestCategoryAuthentication:
    """Test authentication requirements for Category API"""

    def test_list_categories_requires_authentication(self, api_client):
        response = api_client.get('/api/categories/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_category_requires_authentication(self, api_client, valid_category_data):
        response = api_client.post('/api/categories/', valid_category_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_retrieve_category_requires_authentication(self, api_client, category_for_user1):
        response = api_client.get(f'/api/categories/{category_for_user1.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_category_requires_authentication(self, api_client, category_for_user1):
        response = api_client.patch(
            f'/api/categories/{category_for_user1.id}/',
            {'name': 'Updated'}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_category_requires_authentication(self, api_client, category_for_user1):
        response = api_client.delete(f'/api/categories/{category_for_user1.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ==================== CREATE TESTS ====================

@pytest.mark.django_db
class TestCategoryCreation:
    """Test creating categories"""

    def test_create_category_with_valid_data_returns_201(
        self, authenticated_client, valid_category_data, test_user
    ):
        response = authenticated_client.post('/api/categories/', valid_category_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'Groceries'
        assert response.data['user'] == test_user.id
        assert Category.objects.filter(user=test_user, name='Groceries').exists()

    def test_create_category_auto_sets_timestamps(self, authenticated_client, valid_category_data):
        response = authenticated_client.post('/api/categories/', valid_category_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert 'created_at' in response.data
        assert 'updated_at' in response.data

    def test_create_duplicate_category_case_insensitive_returns_400(
        self, authenticated_client, test_user
    ):
        Category.objects.create(user=test_user, name='Food')
        response = authenticated_client.post('/api/categories/', {'name': ' food '})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data

    def test_create_duplicate_category_for_other_user_allowed(
        self, authenticated_client, test_user_2
    ):
        Category.objects.create(user=test_user_2, name='Transport')
        response = authenticated_client.post('/api/categories/', {'name': 'Transport'})

        assert response.status_code == status.HTTP_201_CREATED


# ==================== VALIDATION TESTS ====================

@pytest.mark.django_db
class TestCategoryValidation:
    """Test input validation for categories"""

    def test_create_category_missing_name_returns_400(self, authenticated_client):
        response = authenticated_client.post('/api/categories/', {})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data

    def test_create_category_blank_name_returns_400(self, authenticated_client):
        response = authenticated_client.post('/api/categories/', {'name': '   '})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data

    def test_create_category_name_too_long_returns_400(self, authenticated_client):
        response = authenticated_client.post('/api/categories/', {'name': 'A' * 101})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data


# ==================== READ TESTS ====================

@pytest.mark.django_db
class TestCategoryRetrieval:
    """Test retrieving categories"""

    def test_list_categories_returns_user_categories(
        self, authenticated_client, category_for_user1, category_for_user2
    ):
        response = authenticated_client.get('/api/categories/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['id'] == category_for_user1.id

    def test_retrieve_own_category_returns_200(self, authenticated_client, category_for_user1):
        response = authenticated_client.get(f'/api/categories/{category_for_user1.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == category_for_user1.id

    def test_retrieve_other_user_category_returns_404(
        self, authenticated_client_2, category_for_user1
    ):
        response = authenticated_client_2.get(f'/api/categories/{category_for_user1.id}/')

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_list_empty_categories(self, authenticated_client):
        response = authenticated_client.get('/api/categories/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 0
        assert response.data['results'] == []


# ==================== UPDATE TESTS ====================

@pytest.mark.django_db
class TestCategoryUpdate:
    """Test updating categories"""

    def test_update_category_returns_200(self, authenticated_client, category_for_user1):
        response = authenticated_client.patch(
            f'/api/categories/{category_for_user1.id}/',
            {'name': 'Updated'}
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Updated'

    def test_update_category_to_duplicate_returns_400(
        self, authenticated_client, test_user
    ):
        Category.objects.create(user=test_user, name='Health')
        category = Category.objects.create(user=test_user, name='Fitness')

        response = authenticated_client.patch(
            f'/api/categories/{category.id}/',
            {'name': ' health '}
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data

    def test_update_other_user_category_returns_404(
        self, authenticated_client_2, category_for_user1
    ):
        response = authenticated_client_2.patch(
            f'/api/categories/{category_for_user1.id}/',
            {'name': 'Updated'}
        )

        assert response.status_code == status.HTTP_404_NOT_FOUND


# ==================== DELETE TESTS ====================

@pytest.mark.django_db
class TestCategoryDeletion:
    """Test deleting categories"""

    def test_delete_category_returns_204(self, authenticated_client, category_for_user1):
        response = authenticated_client.delete(f'/api/categories/{category_for_user1.id}/')

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Category.objects.filter(id=category_for_user1.id).exists()

    def test_delete_category_sets_transaction_category_to_null(
        self, authenticated_client, category_for_user1, budget_for_user1
    ):
        transaction = Transaction.objects.create(
            budget=budget_for_user1,
            amount='50.00',
            category=category_for_user1,
            date='2026-02-01'
        )

        response = authenticated_client.delete(f'/api/categories/{category_for_user1.id}/')

        assert response.status_code == status.HTTP_204_NO_CONTENT
        transaction.refresh_from_db()
        assert transaction.category is None
