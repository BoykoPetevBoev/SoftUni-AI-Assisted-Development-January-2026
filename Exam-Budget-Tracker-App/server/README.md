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
