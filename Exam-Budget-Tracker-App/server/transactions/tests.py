import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from budgets.models import Budget
from .models import Transaction

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
def budget_for_user1(test_user):
    """Create a budget owned by test_user"""
    return Budget.objects.create(
        user=test_user,
        title='Existing Budget',
        description='Already created budget',
        date='2026-01-01',
        initial_amount='1000.00'
    )


@pytest.fixture
def budget_for_user2(test_user_2):
    """Create a budget owned by test_user_2"""
    return Budget.objects.create(
        user=test_user_2,
        title='Other Budget',
        description='Other user budget',
        date='2026-01-01',
        initial_amount='1500.00'
    )


@pytest.fixture
def valid_transaction_data(budget_for_user1):
    """Provide valid transaction data for creation tests"""
    return {
        'budget': budget_for_user1.id,
        'amount': '250.00',
        'category': 'Salary',
        'date': '2026-02-15',
    }


@pytest.fixture
def transaction_for_user1(budget_for_user1):
    """Create a transaction owned by test_user via budget"""
    return Transaction.objects.create(
        budget=budget_for_user1,
        amount='120.00',
        category='Groceries',
        date='2026-02-10'
    )


# ==================== AUTHENTICATION TESTS ====================

@pytest.mark.django_db
class TestTransactionAuthentication:
    """Test authentication requirements for Transaction API"""

    def test_list_transactions_requires_authentication(self, api_client):
        response = api_client.get('/api/transactions/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_transaction_requires_authentication(self, api_client, valid_transaction_data):
        response = api_client.post('/api/transactions/', valid_transaction_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_retrieve_transaction_requires_authentication(self, api_client, transaction_for_user1):
        response = api_client.get(f'/api/transactions/{transaction_for_user1.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_transaction_requires_authentication(self, api_client, transaction_for_user1):
        response = api_client.patch(
            f'/api/transactions/{transaction_for_user1.id}/',
            {'category': 'Updated'}
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_transaction_requires_authentication(self, api_client, transaction_for_user1):
        response = api_client.delete(f'/api/transactions/{transaction_for_user1.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ==================== CREATE TESTS ====================

@pytest.mark.django_db
class TestTransactionCreation:
    """Test creating transactions"""

    def test_create_transaction_with_valid_data_returns_201(
        self, authenticated_client, valid_transaction_data, test_user
    ):
        response = authenticated_client.post('/api/transactions/', valid_transaction_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['amount'] == '250.00'
        assert response.data['category'] == 'Salary'
        assert response.data['budget'] == valid_transaction_data['budget']
        assert response.data['date'] == '2026-02-15'

        assert Transaction.objects.filter(category='Salary').exists()

    def test_create_transaction_sets_timestamps(self, authenticated_client, valid_transaction_data):
        response = authenticated_client.post('/api/transactions/', valid_transaction_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert 'created_at' in response.data
        assert 'updated_at' in response.data

    def test_create_transaction_with_negative_amount_allowed(
        self, authenticated_client, budget_for_user1
    ):
        data = {
            'budget': budget_for_user1.id,
            'amount': '-50.00',
            'category': 'Lunch',
            'date': '2026-02-12',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['amount'] == '-50.00'

    def test_create_transaction_with_other_user_budget_returns_400(
        self, authenticated_client, budget_for_user2
    ):
        data = {
            'budget': budget_for_user2.id,
            'amount': '100.00',
            'category': 'Invalid',
            'date': '2026-02-15',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'budget' in response.data


# ==================== VALIDATION TESTS ====================

@pytest.mark.django_db
class TestTransactionValidation:
    """Test input validation for transactions"""

    def test_create_transaction_missing_category_returns_400(self, authenticated_client, budget_for_user1):
        data = {
            'budget': budget_for_user1.id,
            'amount': '120.00',
            'date': '2026-02-10',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'category' in response.data

    def test_create_transaction_blank_category_returns_400(self, authenticated_client, budget_for_user1):
        data = {
            'budget': budget_for_user1.id,
            'amount': '120.00',
            'category': '   ',
            'date': '2026-02-10',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'category' in response.data

    def test_create_transaction_missing_amount_returns_400(self, authenticated_client, budget_for_user1):
        data = {
            'budget': budget_for_user1.id,
            'category': 'Food',
            'date': '2026-02-10',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'amount' in response.data

    def test_create_transaction_invalid_amount_returns_400(self, authenticated_client, budget_for_user1):
        data = {
            'budget': budget_for_user1.id,
            'amount': 'invalid',
            'category': 'Food',
            'date': '2026-02-10',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'amount' in response.data

    def test_create_transaction_missing_date_returns_400(self, authenticated_client, budget_for_user1):
        data = {
            'budget': budget_for_user1.id,
            'amount': '120.00',
            'category': 'Food',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'date' in response.data

    def test_create_transaction_invalid_date_returns_400(self, authenticated_client, budget_for_user1):
        data = {
            'budget': budget_for_user1.id,
            'amount': '120.00',
            'category': 'Food',
            'date': '10-02-2026',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'date' in response.data

    def test_create_transaction_missing_budget_returns_400(self, authenticated_client):
        data = {
            'amount': '120.00',
            'category': 'Food',
            'date': '2026-02-10',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'budget' in response.data

    def test_create_transaction_invalid_budget_returns_400(self, authenticated_client):
        data = {
            'budget': 99999,
            'amount': '120.00',
            'category': 'Food',
            'date': '2026-02-10',
        }
        response = authenticated_client.post('/api/transactions/', data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'budget' in response.data


# ==================== READ TESTS ====================

@pytest.mark.django_db
class TestTransactionRetrieval:
    """Test retrieving transactions"""

    def test_list_transactions_returns_user_transactions(
        self, authenticated_client, budget_for_user1, budget_for_user2
    ):
        Transaction.objects.create(
            budget=budget_for_user1,
            amount='50.00',
            category='Food',
            date='2026-02-01'
        )
        Transaction.objects.create(
            budget=budget_for_user2,
            amount='75.00',
            category='Other',
            date='2026-02-01'
        )

        response = authenticated_client.get('/api/transactions/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1
        assert len(response.data['results']) == 1

    def test_list_transactions_pagination(self, authenticated_client, budget_for_user1):
        for index in range(1, 4):
            Transaction.objects.create(
                budget=budget_for_user1,
                amount=f'{index}.00',
                category='Food',
                date=f'2026-02-0{index}'
            )

        response = authenticated_client.get('/api/transactions/?page=1')

        assert response.status_code == status.HTTP_200_OK
        assert 'count' in response.data
        assert 'next' in response.data
        assert 'previous' in response.data
        assert 'results' in response.data

    def test_retrieve_own_transaction_returns_200(self, authenticated_client, transaction_for_user1):
        response = authenticated_client.get(f'/api/transactions/{transaction_for_user1.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == transaction_for_user1.id

    def test_retrieve_other_user_transaction_returns_404(
        self, authenticated_client, authenticated_client_2, budget_for_user1
    ):
        transaction = Transaction.objects.create(
            budget=budget_for_user1,
            amount='50.00',
            category='Food',
            date='2026-02-01'
        )

        response = authenticated_client_2.get(f'/api/transactions/{transaction.id}/')

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_list_empty_transactions(self, authenticated_client):
        response = authenticated_client.get('/api/transactions/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 0
        assert response.data['results'] == []


# ==================== UPDATE TESTS ====================

@pytest.mark.django_db
class TestTransactionUpdate:
    """Test updating transactions"""

    def test_update_transaction_returns_200(self, authenticated_client, transaction_for_user1):
        response = authenticated_client.patch(
            f'/api/transactions/{transaction_for_user1.id}/',
            {'category': 'Updated', 'amount': '200.00'}
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data['category'] == 'Updated'
        assert response.data['amount'] == '200.00'

    def test_update_transaction_budget_to_other_user_returns_400(
        self, authenticated_client, transaction_for_user1, budget_for_user2
    ):
        response = authenticated_client.patch(
            f'/api/transactions/{transaction_for_user1.id}/',
            {'budget': budget_for_user2.id}
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'budget' in response.data


# ==================== DELETE TESTS ====================

@pytest.mark.django_db
class TestTransactionDeletion:
    """Test deleting transactions"""

    def test_delete_transaction_returns_204(self, authenticated_client, transaction_for_user1):
        response = authenticated_client.delete(f'/api/transactions/{transaction_for_user1.id}/')

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Transaction.objects.filter(id=transaction_for_user1.id).exists()


# ==================== BALANCE TESTS ====================

@pytest.mark.django_db
class TestBudgetBalance:
    """Test budget balance calculations"""

    def test_budget_balance_updates_with_transactions(self, authenticated_client, budget_for_user1):
        Transaction.objects.create(
            budget=budget_for_user1,
            amount='200.00',
            category='Income',
            date='2026-02-10'
        )
        Transaction.objects.create(
            budget=budget_for_user1,
            amount='-50.00',
            category='Expense',
            date='2026-02-11'
        )

        response = authenticated_client.get(f'/api/budgets/{budget_for_user1.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['balance'] == '1150.00'

    def test_budget_balance_updates_on_transaction_change(self, authenticated_client, budget_for_user1):
        transaction = Transaction.objects.create(
            budget=budget_for_user1,
            amount='100.00',
            category='Income',
            date='2026-02-10'
        )

        transaction.amount = '300.00'
        transaction.save()

        response = authenticated_client.get(f'/api/budgets/{budget_for_user1.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['balance'] == '1300.00'

    def test_budget_balance_updates_on_transaction_delete(self, authenticated_client, budget_for_user1):
        transaction = Transaction.objects.create(
            budget=budget_for_user1,
            amount='200.00',
            category='Income',
            date='2026-02-10'
        )

        transaction.delete()

        response = authenticated_client.get(f'/api/budgets/{budget_for_user1.id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['balance'] == '1000.00'
