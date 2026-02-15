---
name: pytest-backend-testing
description: Write backend tests for Django REST APIs using Pytest and fixtures
license: MIT
---

# Pytest Backend Testing

## When to Use This Skill

- Testing Django REST API endpoints
- Testing permissions and authentication
- Testing model methods and business logic
- Mocking external services and dependencies
- Setting up test fixtures and data

---

## Core Patterns Overview

**Basic API Test Structure**: Use APIClient to test endpoints. Create fixtures for common test data (api_client, test_user). Use @pytest.mark.django_db to enable database access. Test one thing per test method with descriptive names. This pattern provides clean isolation and readability.

**Authentication & Permissions**: Create authenticated_client fixture by generating JWT tokens. Test both authenticated and unauthenticated cases. Test 401 responses for missing auth and 403 responses for missing permissions. Verify data isolation so users can't access others' data.

**Serializer Testing**: Create fixtures for test data (valid_registration_data). Test validation logic by checking is_valid(). Test create() and update() methods. Verify error messages are present. Test special cases like password hashing.

**Mocking External Services**: Use @patch() decorator to mock external dependencies. Mock at the point of use, not at import. Verify mocks were called with correct arguments using assert_called_once(). Use return_value to set mock return data.

**Pagination Testing**: Verify paginated responses have count, results, next, previous. Test page boundaries. Test edge cases like last page with fewer items. Verify next/previous URLs are correct.

**Error Handling Testing**: Test all HTTP error codes (400, 403, 404, 500). Test invalid input validation. Test resource not found scenarios. Test permission denied scenarios. Verify error messages in response.

---

## Key Rules

- Use @pytest.mark.django_db for database access
- Use fixtures for common test data
- Test one thing per test method
- Use descriptive test names starting with test_
- Test both happy path and error cases
- Use APIClient from rest_framework.test
- Create authenticated clients with JWT tokens
- Mock external services with @patch()
- Verify mock calls with assert_called_once()
- Test 401, 403, 404 error codes

---

## Anti-Patterns

❌ **Don't**: Hardcode test data in test methods  
✅ **Do**: Use fixtures with parametrization

❌ **Don't**: Test implementation details  
✅ **Do**: Test API behavior and responses

❌ **Don't**: Test external APIs directly  
✅ **Do**: Mock external services

❌ **Don't**: Forget to test error cases  
✅ **Do**: Test 400, 403, 404 responses

❌ **Don't**: Share database state between tests  
✅ **Do**: Use @pytest.mark.django_db and fixtures

---

## Quality Checklist

- [ ] **Tests use fixtures**: Not hardcoded data
- [ ] **Database isolation**: @pytest.mark.django_db used
- [ ] **Auth tested**: Both authenticated and unauthenticated cases
- [ ] **Permissions tested**: Access control verified
- [ ] **Edge cases covered**: Empty results, boundaries
- [ ] **Error cases tested**: 400, 403, 404 responses
- [ ] **Mocks used**: External services mocked
- [ ] **Descriptive names**: Clear what each test does

---

## Commands

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=api

# Run specific test file
pytest api/users/tests.py

# Run specific test class
pytest api/users/tests.py::TestUserRegistration

# Run with verbose output
pytest -v

# Run and show print statements
pytest -s
```

---

## References

- **Existing Tests**: `users/tests.py`
- **Pytest Django**: https://pytest-django.readthedocs.io/
- **Pytest Fixtures**: https://docs.pytest.org/en/stable/fixture.html
- **DRF Testing**: https://www.django-rest-framework.org/api-guide/testing/

---

# CODE EXAMPLES

## 1. Basic API Test Structure

**File**: `api/users/test_views.py`

```python
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

@pytest.fixture
def api_client():
    """Provide API client for testing"""
    return APIClient()

@pytest.fixture
def test_user():
    """Create a test user"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='SecurePass123!'
    )

@pytest.mark.django_db
class TestUserRegistration:
    def test_register_with_valid_data_returns_201(self, api_client):
        """Test successful user registration"""
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = api_client.post('/api/users/register/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['username'] == 'newuser'
        assert User.objects.filter(username='newuser').exists()

    def test_register_with_invalid_email_returns_400(self, api_client):
        """Test registration fails with invalid email"""
        data = {
            'username': 'newuser',
            'email': 'invalid-email',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
        }
        response = api_client.post('/api/users/register/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
```

## 2. Authentication & Permissions

```python
from rest_framework_simplejwt.tokens import RefreshToken

@pytest.fixture
def authenticated_client(test_user):
    """Provide authenticated API client"""
    client = APIClient()
    refresh = RefreshToken.for_user(test_user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client

@pytest.mark.django_db
class TestUserEndpoints:
    def test_get_me_requires_authentication(self, api_client):
        """Test endpoint requires authentication"""
        response = api_client.get('/api/users/me/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_me_returns_authenticated_user(self, authenticated_client, test_user):
        """Test authenticated user can get their profile"""
        response = authenticated_client.get('/api/users/me/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == test_user.username
        assert response.data['email'] == test_user.email

    def test_user_cannot_access_other_user_data(self, api_client):
        """Test user can only access their own data"""
        user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='pass123'
        )
        user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='pass123'
        )
        
        client = APIClient()
        refresh = RefreshToken.for_user(user1)
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = client.get(f'/api/users/{user2.id}/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
```

## 3. Serializer Testing

```python
import pytest
from .serializers import UserRegistrationSerializer

@pytest.fixture
def valid_registration_data():
    return {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'SecurePass123!',
        'password_confirm': 'SecurePass123!',
    }

@pytest.mark.django_db
class TestUserRegistrationSerializer:
    def test_valid_data_is_valid(self, valid_registration_data):
        """Test serializer accepts valid data"""
        serializer = UserRegistrationSerializer(data=valid_registration_data)
        
        assert serializer.is_valid()
        assert serializer.validated_data['username'] == 'testuser'

    def test_passwords_must_match(self, valid_registration_data):
        """Test password confirmation validation"""
        valid_registration_data['password_confirm'] = 'DifferentPass123!'
        serializer = UserRegistrationSerializer(data=valid_registration_data)
        
        assert not serializer.is_valid()
        assert 'password_confirm' in serializer.errors

    def test_create_hashes_password(self, valid_registration_data):
        """Test password is hashed on create"""
        serializer = UserRegistrationSerializer(data=valid_registration_data)
        
        assert serializer.is_valid()
        user = serializer.save()
        user_from_db = User.objects.get(username='testuser')
        
        # Password is hashed
        assert user_from_db.password != 'SecurePass123!'
        assert user_from_db.check_password('SecurePass123!')
```

## 4. Mocking External Services

```python
from unittest.mock import patch, MagicMock

@pytest.mark.django_db
class TestTransactionCreation:
    @patch('api.transactions.services.send_notification_email')
    def test_create_transaction_sends_email(self, mock_email, authenticated_client):
        """Test that transaction creation triggers email"""
        data = {
            'amount': 100.00,
            'category': 'food',
            'description': 'Lunch'
        }
        
        response = authenticated_client.post('/api/transactions/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        # Verify email was sent
        mock_email.assert_called_once()
        call_args = mock_email.call_args
        assert 'test@example.com' in call_args[0]

    @patch('external_api.fetch_exchange_rate')
    def test_currency_conversion(self, mock_exchange_rate, authenticated_client):
        """Test currency conversion uses external API"""
        mock_exchange_rate.return_value = 0.85  # EUR to USD
        
        data = {
            'amount': 100.00,
            'currency': 'EUR'
        }
        
        response = authenticated_client.post('/api/transactions/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        mock_exchange_rate.assert_called_once_with('EUR', 'USD')
```

## 5. Pagination Testing

```python
@pytest.mark.django_db
class TestTransactionPagination:
    def test_list_transactions_paginated(self, authenticated_client, test_user):
        """Test transaction list is paginated"""
        # Create 25 transactions
        for i in range(25):
            Transaction.objects.create(
                user=test_user,
                amount=10.00 + i,
                category='food'
            )
        
        response = authenticated_client.get('/api/transactions/?page=1&page_size=10')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 25
        assert len(response.data['results']) == 10
        assert response.data['next'] is not None

    def test_last_page_has_remaining_items(self, authenticated_client, test_user):
        """Test last page shows remaining items"""
        for i in range(25):
            Transaction.objects.create(
                user=test_user,
                amount=10.00 + i,
                category='food'
            )
        
        response = authenticated_client.get('/api/transactions/?page=3&page_size=10')
        
        assert len(response.data['results']) == 5  # 25 - 20 = 5
        assert response.data['next'] is None  # No next page
```

## 6. Error Handling Testing

```python
@pytest.mark.django_db
class TestErrorHandling:
    def test_create_with_invalid_amount_returns_400(self, authenticated_client):
        """Test invalid amount is rejected"""
        data = {
            'amount': -10.00,  # Negative amount invalid
            'category': 'food'
        }
        
        response = authenticated_client.post('/api/transactions/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'amount' in response.data

    def test_retrieve_nonexistent_returns_404(self, authenticated_client):
        """Test retrieving non-existent object returns 404"""
        response = authenticated_client.get('/api/transactions/999/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_without_permission_returns_403(self, api_client, test_user):
        """Test forbidden access returns 403"""
        transaction = Transaction.objects.create(
            user=test_user,
            amount=50.00,
            category='food'
        )
        
        # Create different user
        other_user = User.objects.create_user(
            username='other',
            email='other@example.com',
            password='pass123'
        )
        
        client = APIClient()
        refresh = RefreshToken.for_user(other_user)
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = client.put(f'/api/transactions/{transaction.id}/', {'amount': 100})
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
```

## 7. Test Successful Request

```python
def test_create_returns_201(self, authenticated_client):
    response = authenticated_client.post('/api/items/', {'name': 'test'})
    assert response.status_code == status.HTTP_201_CREATED
```

## 8. Test Required Field

```python
def test_missing_field_returns_400(self, authenticated_client):
    response = authenticated_client.post('/api/items/', {})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
```

## 9. Test Forbidden Access

```python
def test_no_auth_returns_401(self, api_client):
    response = api_client.get('/api/protected/')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
```
