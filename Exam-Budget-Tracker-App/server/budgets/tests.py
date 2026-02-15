import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Budget

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
def valid_budget_data():
    """Provide valid budget data for creation tests"""
    return {
        'title': 'Monthly Budget',
        'description': 'My monthly budget for expenses',
        'date': '2026-02-15',
        'initial_amount': '5000.00',
    }


@pytest.fixture
def budget_for_user1(test_user):
    """Create a budget owned by test_user"""
    return Budget.objects.create(
        user=test_user,
        title='Existing Budget',
        description='Already created budget',
        date='2026-01-01',
        initial_amount='3000.00'
    )


@pytest.fixture
def multiple_budgets(test_user):
    """Create multiple budgets for the same user"""
    budgets = [
        Budget.objects.create(
            user=test_user,
            title=f'Budget {i}',
            description=f'Budget {i} description',
            date=f'2026-0{i}-15',
            initial_amount=f'{1000*i}.00'
        )
        for i in range(1, 4)
    ]
    return budgets


# ==================== AUTHENTICATION TESTS ====================

@pytest.mark.django_db
class TestBudgetAuthentication:
    """Test authentication requirements for Budget API"""

    def test_list_budgets_requires_authentication(self, api_client):
        """Test listing budgets without auth returns 401"""
        response = api_client.get('/api/budgets/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_budget_requires_authentication(self, api_client, valid_budget_data):
        """Test creating budget without auth returns 401"""
        response = api_client.post('/api/budgets/', valid_budget_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_retrieve_budget_requires_authentication(self, api_client, budget_for_user1):
        """Test retrieving budget without auth returns 401"""
        response = api_client.get(f'/api/budgets/{budget_for_user1.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_budget_requires_authentication(self, api_client, budget_for_user1):
        """Test updating budget without auth returns 401"""
        response = api_client.patch(f'/api/budgets/{budget_for_user1.id}/', {'title': 'New Title'})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_budget_requires_authentication(self, api_client, budget_for_user1):
        """Test deleting budget without auth returns 401"""
        response = api_client.delete(f'/api/budgets/{budget_for_user1.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ==================== CREATE TESTS ====================

@pytest.mark.django_db
class TestBudgetCreation:
    """Test creating budgets"""

    def test_create_budget_with_valid_data_returns_201(self, authenticated_client, test_user, valid_budget_data):
        """Test successful budget creation"""
        response = authenticated_client.post('/api/budgets/', valid_budget_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Monthly Budget'
        assert response.data['description'] == 'My monthly budget for expenses'
        assert response.data['initial_amount'] == '5000.00'
        assert response.data['user'] == test_user.id
        
        # Verify budget was created in database
        assert Budget.objects.filter(title='Monthly Budget').exists()

    def test_create_budget_auto_sets_user(self, authenticated_client, test_user, valid_budget_data):
        """Test that user is automatically set to authenticated user"""
        response = authenticated_client.post('/api/budgets/', valid_budget_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == test_user.id
        
        budget = Budget.objects.get(title='Monthly Budget')
        assert budget.user == test_user

    def test_create_budget_auto_sets_timestamps(self, authenticated_client, valid_budget_data):
        """Test that created_at and updated_at are auto-set"""
        response = authenticated_client.post('/api/budgets/', valid_budget_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'created_at' in response.data
        assert 'updated_at' in response.data
        assert response.data['created_at'] is not None
        assert response.data['updated_at'] is not None

    def test_create_multiple_budgets_per_user(self, authenticated_client, test_user):
        """Test user can create multiple budgets"""
        data1 = {
            'title': 'Budget 1',
            'description': 'First budget',
            'date': '2026-01-01',
            'initial_amount': '1000.00',
        }
        data2 = {
            'title': 'Budget 2',
            'description': 'Second budget',
            'date': '2026-02-01',
            'initial_amount': '2000.00',
        }
        
        response1 = authenticated_client.post('/api/budgets/', data1)
        response2 = authenticated_client.post('/api/budgets/', data2)
        
        assert response1.status_code == status.HTTP_201_CREATED
        assert response2.status_code == status.HTTP_201_CREATED
        assert Budget.objects.filter(user=test_user).count() == 2


# ==================== VALIDATION TESTS ====================

@pytest.mark.django_db
class TestBudgetValidation:
    """Test input validation for budgets"""

    def test_create_budget_missing_title_returns_400(self, authenticated_client):
        """Test creating budget without title fails"""
        data = {
            'description': 'No title budget',
            'date': '2026-02-15',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'title' in response.data

    def test_create_budget_empty_title_returns_400(self, authenticated_client):
        """Test creating budget with empty title fails"""
        data = {
            'title': '',
            'description': 'Empty title budget',
            'date': '2026-02-15',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'title' in response.data

    def test_create_budget_whitespace_title_returns_400(self, authenticated_client):
        """Test creating budget with whitespace-only title fails"""
        data = {
            'title': '   ',
            'description': 'Whitespace title budget',
            'date': '2026-02-15',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'title' in response.data

    def test_create_budget_title_too_long_returns_400(self, authenticated_client):
        """Test creating budget with title > 255 chars fails"""
        data = {
            'title': 'A' * 256,
            'description': 'Too long title',
            'date': '2026-02-15',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'title' in response.data

    def test_create_budget_negative_amount_returns_400(self, authenticated_client):
        """Test creating budget with negative amount fails"""
        data = {
            'title': 'Negative Budget',
            'description': 'Negative amount',
            'date': '2026-02-15',
            'initial_amount': '-5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'initial_amount' in response.data

    def test_create_budget_zero_amount_returns_400(self, authenticated_client):
        """Test creating budget with zero amount fails"""
        data = {
            'title': 'Zero Budget',
            'description': 'Zero amount',
            'date': '2026-02-15',
            'initial_amount': '0.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'initial_amount' in response.data

    def test_create_budget_missing_amount_returns_400(self, authenticated_client):
        """Test creating budget without amount fails"""
        data = {
            'title': 'Missing Amount',
            'description': 'No amount',
            'date': '2026-02-15',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'initial_amount' in response.data

    def test_create_budget_invalid_amount_format_returns_400(self, authenticated_client):
        """Test creating budget with invalid amount format fails"""
        data = {
            'title': 'Invalid Amount',
            'description': 'Invalid format',
            'date': '2026-02-15',
            'initial_amount': 'not_a_number',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'initial_amount' in response.data

    def test_create_budget_missing_date_returns_400(self, authenticated_client):
        """Test creating budget without date fails"""
        data = {
            'title': 'Missing Date',
            'description': 'No date',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'date' in response.data

    def test_create_budget_invalid_date_format_returns_400(self, authenticated_client):
        """Test creating budget with invalid date format fails"""
        data = {
            'title': 'Invalid Date',
            'description': 'Bad date',
            'date': '15-02-2026',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'date' in response.data

    def test_create_budget_optional_description(self, authenticated_client):
        """Test description is optional"""
        data = {
            'title': 'No Description',
            'date': '2026-02-15',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['description'] == ''

    def test_create_budget_past_date_allowed(self, authenticated_client):
        """Test budget can be created with past date"""
        data = {
            'title': 'Past Budget',
            'description': 'Past date budget',
            'date': '2020-01-01',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['date'] == '2020-01-01'

    def test_create_budget_future_date_allowed(self, authenticated_client):
        """Test budget can be created with future date"""
        data = {
            'title': 'Future Budget',
            'description': 'Future date budget',
            'date': '2030-12-31',
            'initial_amount': '5000.00',
        }
        response = authenticated_client.post('/api/budgets/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['date'] == '2030-12-31'


# ==================== READ TESTS ====================

@pytest.mark.django_db
class TestBudgetRetrieval:
    """Test retrieving budgets"""

    def test_list_budgets_returns_user_budgets(self, authenticated_client, test_user, multiple_budgets):
        """Test list endpoint returns only authenticated user's budgets"""
        response = authenticated_client.get('/api/budgets/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 3
        assert len(response.data['results']) == 3

    def test_list_budgets_pagination(self, authenticated_client, test_user, multiple_budgets):
        """Test pagination works for budget list"""
        response = authenticated_client.get('/api/budgets/?page=1')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'count' in response.data
        assert 'next' in response.data
        assert 'previous' in response.data
        assert 'results' in response.data

    def test_retrieve_own_budget_returns_200(self, authenticated_client, budget_for_user1):
        """Test user can retrieve their own budget"""
        response = authenticated_client.get(f'/api/budgets/{budget_for_user1.id}/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == budget_for_user1.id
        assert response.data['title'] == 'Existing Budget'

    def test_retrieve_nonexistent_budget_returns_404(self, authenticated_client):
        """Test retrieving nonexistent budget returns 404"""
        response = authenticated_client.get('/api/budgets/99999/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_list_empty_budgets(self, authenticated_client):
        """Test list returns empty results when user has no budgets"""
        response = authenticated_client.get('/api/budgets/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 0
        assert len(response.data['results']) == 0


# ==================== USER ISOLATION TESTS ====================

@pytest.mark.django_db
class TestBudgetUserIsolation:
    """Test that users can only access their own budgets"""

    def test_user_cannot_retrieve_other_user_budget(self, authenticated_client, authenticated_client_2, budget_for_user1):
        """Test user cannot retrieve another user's budget"""
        response = authenticated_client_2.get(f'/api/budgets/{budget_for_user1.id}/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_cannot_update_other_user_budget(self, authenticated_client, authenticated_client_2, budget_for_user1):
        """Test user cannot update another user's budget"""
        data = {'title': 'Hacked Title'}
        response = authenticated_client_2.patch(f'/api/budgets/{budget_for_user1.id}/', data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        # Verify budget was not modified
        budget_for_user1.refresh_from_db()
        assert budget_for_user1.title == 'Existing Budget'

    def test_user_cannot_delete_other_user_budget(self, authenticated_client, authenticated_client_2, budget_for_user1):
        """Test user cannot delete another user's budget"""
        response = authenticated_client_2.delete(f'/api/budgets/{budget_for_user1.id}/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        # Verify budget still exists
        assert Budget.objects.filter(id=budget_for_user1.id).exists()

    def test_list_shows_only_user_budgets(self, authenticated_client, authenticated_client_2, test_user, test_user_2):
        """Test list shows only authenticated user's budgets, not others'"""
        # Create budgets for both users
        Budget.objects.create(
            user=test_user,
            title='User 1 Budget',
            date='2026-01-01',
            initial_amount='1000.00'
        )
        Budget.objects.create(
            user=test_user_2,
            title='User 2 Budget',
            date='2026-02-01',
            initial_amount='2000.00'
        )
        
        # Authenticated user 1 lists budgets
        response = authenticated_client.get('/api/budgets/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert response.data['results'][0]['title'] == 'User 1 Budget'
        
        # Verify user 2's budget is not in response
        titles = [b['title'] for b in response.data['results']]
        assert 'User 2 Budget' not in titles


# ==================== UPDATE TESTS ====================

@pytest.mark.django_db
class TestBudgetUpdate:
    """Test updating budgets"""

    def test_update_budget_with_valid_data_returns_200(self, authenticated_client, budget_for_user1):
        """Test successful budget update"""
        data = {
            'title': 'Updated Title',
            'description': 'Updated description',
            'date': '2026-03-15',
            'initial_amount': '6000.00',
        }
        response = authenticated_client.put(f'/api/budgets/{budget_for_user1.id}/', data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Title'
        assert response.data['description'] == 'Updated description'
        assert response.data['initial_amount'] == '6000.00'

    def test_partial_update_budget_returns_200(self, authenticated_client, budget_for_user1):
        """Test partial budget update (PATCH)"""
        data = {'title': 'Patched Title'}
        response = authenticated_client.patch(f'/api/budgets/{budget_for_user1.id}/', data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Patched Title'
        assert response.data['description'] == 'Already created budget'  # Unchanged

    def test_update_budget_user_cannot_change_ownership(self, authenticated_client, test_user_2, budget_for_user1):
        """Test that user field is always preserved (cannot change ownership)"""
        # Try to change user to another user
        data = {
            'title': 'Hacked Budget',
            'user': test_user_2.id,
        }
        response = authenticated_client.patch(f'/api/budgets/{budget_for_user1.id}/', data)
        
        # Should succeed but ignore user change
        assert response.status_code == status.HTTP_200_OK
        
        # Verify user was not changed
        budget_for_user1.refresh_from_db()
        assert budget_for_user1.user.id != test_user_2.id

    def test_update_budget_validates_title(self, authenticated_client, budget_for_user1):
        """Test title validation on update"""
        data = {'title': ''}
        response = authenticated_client.patch(f'/api/budgets/{budget_for_user1.id}/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'title' in response.data

    def test_update_budget_validates_amount(self, authenticated_client, budget_for_user1):
        """Test amount validation on update"""
        data = {'initial_amount': '-1000.00'}
        response = authenticated_client.patch(f'/api/budgets/{budget_for_user1.id}/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'initial_amount' in response.data


# ==================== DELETE TESTS ====================

@pytest.mark.django_db
class TestBudgetDeletion:
    """Test deleting budgets"""

    def test_delete_own_budget_returns_204(self, authenticated_client, budget_for_user1):
        """Test successful budget deletion"""
        budget_id = budget_for_user1.id
        response = authenticated_client.delete(f'/api/budgets/{budget_id}/')
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Budget.objects.filter(id=budget_id).exists()

    def test_delete_nonexistent_budget_returns_404(self, authenticated_client):
        """Test deleting nonexistent budget returns 404"""
        response = authenticated_client.delete('/api/budgets/99999/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
