# Budget Tracker API

Django REST Framework API for the Budget Tracker application. Provides authentication, user management, and transaction/budget tracking endpoints.

## Base URL

```
http://localhost:8000/api
```

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### How JWT Works

1. **Register** or **Login** to obtain tokens
2. Include the access token in the `Authorization` header of subsequent requests
3. Use the format: `Authorization: Bearer <access_token>`
4. Access tokens expire after 1 hour; use the refresh token to obtain a new one

### Example Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### 1. User Registration

Register a new user account.

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/users/register/` |
| **Auth Required** | No |
| **Status Code** | `201 Created` |

#### Request Body

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!"
}
```

#### Response (201 Created)

```json
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

#### Error Responses

**400 Bad Request** - Validation failed

```json
{
  "username": ["This username is already taken."],
  "email": ["This email is already registered."],
  "password": ["Passwords do not match."],
  "password_confirm": ["Password must be at least 8 characters long."]
}
```

---

### 2. User Login (Obtain Tokens)

Authenticate with username and password to receive JWT tokens.

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/token/` |
| **Auth Required** | No |
| **Status Code** | `200 OK` |

#### Request Body

```json
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

#### Response (200 OK)

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJhY2Nlc3MiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXAiOiJyZWZyZXNoIiwgImFsZyI6IkhTMjU2In0..."
}
```

#### Error Responses

**401 Unauthorized** - Invalid credentials

```json
{
  "detail": "No active account found with the given credentials"
}
```

**400 Bad Request** - Missing fields

```json
{
  "username": ["This field is required."],
  "password": ["This field is required."]
}
```

---

### 3. Refresh Access Token

Get a new access token using the refresh token.

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/token/refresh/` |
| **Auth Required** | No |
| **Status Code** | `200 OK` |

#### Request Body

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**401 Unauthorized** - Invalid or expired refresh token

```json
{
  "detail": "Token is invalid or expired"
}
```

**400 Bad Request** - Missing token

```json
{
  "refresh": ["This field is required."]
}
```

---

### 4. Get Current User Profile

Retrieve the authenticated user's profile information.

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/users/me/` |
| **Auth Required** | Yes |
| **Status Code** | `200 OK` |

#### Request Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

None

#### Response (200 OK)

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Error Responses

**401 Unauthorized** - Missing or invalid token

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 5. User Logout

Logout by blacklisting the refresh token.

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/users/logout/` |
| **Auth Required** | Yes |
| **Status Code** | `200 OK` |

#### Request Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)

```json
{
  "detail": "Successfully logged out."
}
```

#### Error Responses

**401 Unauthorized** - Missing authentication

```json
{
  "detail": "Authentication credentials were not provided."
}
```

**400 Bad Request** - Missing or invalid refresh token

```json
{
  "detail": "Refresh token is required."
}
```

```json
{
  "detail": "Invalid token: Token is invalid or expired"
}
```

---

## Budget Management

### 6. List User's Budgets

Retrieve all budgets owned by the authenticated user with pagination.

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/budgets/` |
| **Auth Required** | Yes |
| **Status Code** | `200 OK` |
| **Note** | Returns only budgets owned by the authenticated user |

#### Request Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |

#### Response (200 OK)

```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": 1,
      "title": "Monthly Budget",
      "description": "My monthly budget for expenses",
      "date": "2026-02-15",
      "initial_amount": "5000.00",
      "created_at": "2026-02-15T20:32:00Z",
      "updated_at": "2026-02-15T20:32:00Z"
    },
    {
      "id": 2,
      "user": 1,
      "title": "Quarterly Budget",
      "description": "Q1 budget planning",
      "date": "2026-01-01",
      "initial_amount": "15000.00",
      "created_at": "2026-02-10T15:20:00Z",
      "updated_at": "2026-02-10T15:20:00Z"
    }
  ]
}
```

#### Error Responses

**401 Unauthorized** - Missing or invalid token

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 7. Create Budget

Create a new budget for the authenticated user. User is automatically set to the authenticated user.

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/budgets/` |
| **Auth Required** | Yes |
| **Status Code** | `201 Created` |
| **Note** | User field is auto-set; cannot be changed |

#### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "title": "Monthly Budget",
  "description": "My monthly budget for expenses",
  "date": "2026-02-15",
  "initial_amount": "5000.00"
}
```

#### Response (201 Created)

```json
{
  "id": 1,
  "user": 1,
  "title": "Monthly Budget",
  "description": "My monthly budget for expenses",
  "date": "2026-02-15",
  "initial_amount": "5000.00",
  "created_at": "2026-02-15T20:32:00Z",
  "updated_at": "2026-02-15T20:32:00Z"
}
```

#### Error Responses

**400 Bad Request** - Validation failed

```json
{
  "title": ["Title is required."],
  "initial_amount": ["Initial amount must be greater than 0."]
}
```

**401 Unauthorized** - Missing or invalid token

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 8. Retrieve Budget

Retrieve a single budget by ID. User can only access their own budgets.

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/budgets/{id}/` |
| **Auth Required** | Yes |
| **Status Code** | `200 OK` |
| **Note** | Returns 404 if budget doesn't exist or belongs to another user |

#### Request Headers

```
Authorization: Bearer <access_token>
```

#### Response (200 OK)

```json
{
  "id": 1,
  "user": 1,
  "title": "Monthly Budget",
  "description": "My monthly budget for expenses",
  "date": "2026-02-15",
  "initial_amount": "5000.00",
  "created_at": "2026-02-15T20:32:00Z",
  "updated_at": "2026-02-15T20:32:00Z"
}
```

#### Error Responses

**404 Not Found** - Budget not found or belongs to another user

```json
{
  "detail": "Not found."
}
```

**401 Unauthorized** - Missing or invalid token

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 9. Update Budget (Full)

Update all fields of a budget. User cannot change budget ownership.

| Property | Value |
|----------|-------|
| **Method** | `PUT` |
| **URL** | `/budgets/{id}/` |
| **Auth Required** | Yes |
| **Status Code** | `200 OK` |
| **Note** | User field is preserved; cannot be changed |

#### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "title": "Updated Monthly Budget",
  "description": "Updated description",
  "date": "2026-03-15",
  "initial_amount": "6000.00"
}
```

#### Response (200 OK)

```json
{
  "id": 1,
  "user": 1,
  "title": "Updated Monthly Budget",
  "description": "Updated description",
  "date": "2026-03-15",
  "initial_amount": "6000.00",
  "created_at": "2026-02-15T20:32:00Z",
  "updated_at": "2026-02-15T21:45:00Z"
}
```

#### Error Responses

**400 Bad Request** - Validation failed

```json
{
  "title": ["Title must be at most 255 characters."]
}
```

**404 Not Found** - Budget not found or belongs to another user

```json
{
  "detail": "Not found."
}
```

**401 Unauthorized** - Missing or invalid token

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 10. Update Budget (Partial)

Update specific fields of a budget. User cannot change budget ownership.

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `/budgets/{id}/` |
| **Auth Required** | Yes |
| **Status Code** | `200 OK` |
| **Note** | Only include fields you want to update |

#### Request Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "title": "New Budget Title"
}
```

#### Response (200 OK)

```json
{
  "id": 1,
  "user": 1,
  "title": "New Budget Title",
  "description": "My monthly budget for expenses",
  "date": "2026-02-15",
  "initial_amount": "5000.00",
  "created_at": "2026-02-15T20:32:00Z",
  "updated_at": "2026-02-15T21:50:00Z"
}
```

#### Error Responses

**400 Bad Request** - Validation failed

```json
{
  "initial_amount": ["Initial amount must be greater than 0."]
}
```

**404 Not Found** - Budget not found or belongs to another user

```json
{
  "detail": "Not found."
}
```

**401 Unauthorized** - Missing or invalid token

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 11. Delete Budget

Delete a budget owned by the authenticated user.

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `/budgets/{id}/` |
| **Auth Required** | Yes |
| **Status Code** | `204 No Content` |
| **Note** | Returns 404 if budget doesn't exist or belongs to another user |

#### Request Headers

```
Authorization: Bearer <access_token>
```

#### Response (204 No Content)

No response body.

#### Error Responses

**404 Not Found** - Budget not found or belongs to another user

```json
{
  "detail": "Not found."
}
```

**401 Unauthorized** - Missing or invalid token

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Authentication Flow

### 1. Register New User

```
POST /api/users/register/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!"
}

Response: 201 Created
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

### 2. Login to Get Tokens

```
POST /api/token/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Use Access Token to Access Protected Endpoints

```
GET /api/users/me/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200 OK
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

### 4. Refresh Access Token When Expired

```
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: 200 OK
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Logout

```
POST /api/users/logout/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: 200 OK
{
  "detail": "Successfully logged out."
}
```

---

## Common HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| `200 OK` | Success | Request succeeded (GET, POST refresh, logout) |
| `201 Created` | Success | Resource created (registration) |
| `400 Bad Request` | Client Error | Invalid data, missing fields, validation failed |
| `401 Unauthorized` | Client Error | Invalid credentials, expired/missing token |
| `404 Not Found` | Client Error | Resource does not exist |
| `500 Server Error` | Server Error | Unexpected server error |

---

## Error Handling

All errors are returned as JSON with descriptive messages. Always check the response status code before processing.

### Error Response Format

```json
{
  "detail": "Error description",
  "field_name": ["Specific error message"]
}
```

### Example: Validation Error

```json
{
  "email": ["Enter a valid email address."],
  "password": ["Password must be at least 8 characters long."]
}
```

---

## Token Expiration & Refresh

- **Access Token Lifetime:** 1 hour (3600 seconds)
- **Refresh Token Lifetime:** 7 days (604800 seconds)

When your access token expires, use the refresh token to get a new access token without requiring the user to log in again.

---

## Request Format

All requests should include:

```
Content-Type: application/json
```

For authenticated endpoints, include:

```
Authorization: Bearer <access_token>
```

---

## Example: Complete User Session (cURL)

### 1. Register
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

### 3. Get Profile
```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer <access_token>"
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "<refresh_token>"
  }'
```

### 5. Logout
```bash
curl -X POST http://localhost:8000/api/users/logout/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "<refresh_token>"
  }'
```

---

## Example: Complete Budget Operations (cURL)

### 1. Create a Budget

```bash
curl -X POST http://localhost:8000/api/budgets/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly Budget",
    "description": "My monthly budget for expenses",
    "date": "2026-02-15",
    "initial_amount": "5000.00"
  }'
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": 1,
  "title": "Monthly Budget",
  "description": "My monthly budget for expenses",
  "date": "2026-02-15",
  "initial_amount": "5000.00",
  "created_at": "2026-02-15T20:32:00Z",
  "updated_at": "2026-02-15T20:32:00Z"
}
```

### 2. List All Budgets

```bash
curl -X GET http://localhost:8000/api/budgets/ \
  -H "Authorization: Bearer <access_token>"
```

**Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": 1,
      "title": "Monthly Budget",
      "description": "My monthly budget for expenses",
      "date": "2026-02-15",
      "initial_amount": "5000.00",
      "created_at": "2026-02-15T20:32:00Z",
      "updated_at": "2026-02-15T20:32:00Z"
    }
  ]
}
```

### 3. Retrieve Single Budget

```bash
curl -X GET http://localhost:8000/api/budgets/1/ \
  -H "Authorization: Bearer <access_token>"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "title": "Monthly Budget",
  "description": "My monthly budget for expenses",
  "date": "2026-02-15",
  "initial_amount": "5000.00",
  "created_at": "2026-02-15T20:32:00Z",
  "updated_at": "2026-02-15T20:32:00Z"
}
```

### 4. Update Budget (Full)

```bash
curl -X PUT http://localhost:8000/api/budgets/1/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Monthly Budget",
    "description": "Updated description",
    "date": "2026-03-15",
    "initial_amount": "6000.00"
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "title": "Updated Monthly Budget",
  "description": "Updated description",
  "date": "2026-03-15",
  "initial_amount": "6000.00",
  "created_at": "2026-02-15T20:32:00Z",
  "updated_at": "2026-02-15T21:45:00Z"
}
```

### 5. Update Budget (Partial)

```bash
curl -X PATCH http://localhost:8000/api/budgets/1/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Budget Title"
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "title": "New Budget Title",
  "description": "Updated description",
  "date": "2026-03-15",
  "initial_amount": "6000.00",
  "created_at": "2026-02-15T20:32:00Z",
  "updated_at": "2026-02-15T21:50:00Z"
}
```

### 6. Delete Budget

```bash
curl -X DELETE http://localhost:8000/api/budgets/1/ \
  -H "Authorization: Bearer <access_token>"
```

**Response (204 No Content):**
No response body.

---

## Password Requirements

Passwords must meet these criteria:

- Minimum 8 characters
- Include at least one uppercase letter
- Include at least one lowercase letter
- Include at least one digit
- Include at least one special character
- Not be a common password (e.g., "password123")
- Not be solely numeric
- Not be too similar to username or email

---

## Development & Testing

### Local Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Run Tests

```bash
pytest users/tests.py -v
```

### Using Docker

```bash
docker-compose up
```

---

## Support & Questions

For issues or questions about the API:
1. Check this README for endpoint documentation
2. Review example requests and responses
3. Check HTTP status codes and error messages
4. Verify your authorization headers are correct

---
