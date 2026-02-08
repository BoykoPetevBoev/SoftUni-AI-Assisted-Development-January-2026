---
name: django-rest-api-views
description: Create Django REST Framework views, viewsets, permissions, custom actions, and pagination
license: MIT
---

# Django REST API Views

## When to Use This Skill

- Creating REST API endpoints with ViewSets
- Implementing custom actions beyond CRUD
- Enforcing permissions and authentication
- Adding pagination to list endpoints
- Handling different serializers for different actions

---

## Core Patterns

### 1. Basic ViewSet (CRUD)

**File**: `api/users/views.py`

```python
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only authenticated user's data"""
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
```

**HTTP Methods Provided**:
- GET /users/ (list)
- POST /users/ (create)
- GET /users/{id}/ (retrieve)
- PUT /users/{id}/ (update)
- DELETE /users/{id}/ (destroy)

**Key Rules**:
- Override `get_queryset()` for user scoping
- Use `permission_classes` for access control
- Filter data at queryset level (not in view logic)

---

### 2. Custom Actions

```python
from rest_framework.decorators import action

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get authenticated user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def set_password(self, request, pk=None):
        """Custom action to change password"""
        user = self.get_object()
        serializer = SetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'detail': 'Password updated successfully.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Register new user (no auth required)"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

**Key Rules**:
- Use `@action(detail=False)` for list actions (no object)
- Use `@action(detail=True)` for single object actions
- Override `permission_classes` for public actions
- Return proper HTTP status codes

---

### 3. Permissions & Access Control

```python
from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny

class IsOwnerOrAdmin(BasePermission):
    """Custom permission: only owner or admin can access"""
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_staff:
            return True
        # Owner can access their own data
        return obj.owner == request.user

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        """Filter to user's transactions"""
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically set user to authenticated user"""
        serializer.save(user=self.request.user)
```

**Built-in Permissions**:
- `AllowAny` - No authentication required
- `IsAuthenticated` - Must be logged in
- `IsAdminUser` - Must be staff/superuser

---

### 4. Pagination

```python
from rest_framework.pagination import PageNumberPagination

class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    pagination_class = StandardPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

# Usage: GET /transactions/?page=1&page_size=20
```

**Response Format**:
```json
{
  "count": 100,
  "next": "http://api.example.com/transactions/?page=2",
  "previous": null,
  "results": [...]
}
```

---

### 5. Different Serializers for Different Actions

```python
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        """Use different serializer for different actions"""
        if self.action == 'list':
            return TransactionListSerializer  # Lighter version
        elif self.action == 'retrieve':
            return TransactionDetailSerializer  # Full details
        return TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
```

---

### 6. Filtering, Searching, Ordering

```python
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    # Enable filtering, searching, ordering
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'date']
    search_fields = ['description']
    ordering_fields = ['date', 'amount']
    ordering = ['-date']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

# Usage:
# GET /transactions/?category=food
# GET /transactions/?search=grocery
# GET /transactions/?ordering=-amount
```

---

## Quality Checklist

- [ ] **ViewSet created**: Extends ModelViewSet
- [ ] **Queryset filtered**: User data scoped correctly
- [ ] **Permissions applied**: IsAuthenticated on protected endpoints
- [ ] **Custom actions**: Using @action decorator
- [ ] **Serializer selection**: Different serializers per action if needed
- [ ] **Error handling**: Returns proper HTTP status codes
- [ ] **Pagination**: Applied to list endpoints
- [ ] **Filtering/Search**: Available for list endpoints

---

## Common Patterns

### Simple CRUD ViewSet
```python
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
```

### User-Scoped Data
```python
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
```

### Public + Private Actions
```python
@action(detail=False, methods=['post'], permission_classes=[AllowAny])
def login(self, request):
    # Public endpoint
    pass

@action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
def my_data(self, request):
    # Private endpoint
    pass
```

---

## Anti-Patterns

❌ **Don't**: Return all objects regardless of user  
✅ **Do**: Filter queryset by `request.user`

❌ **Don't**: Use `AllowAny` for protected data  
✅ **Do**: Use `IsAuthenticated` or custom permissions

❌ **Don't**: Forget `perform_create()` to set request.user  
✅ **Do**: Override `perform_create()` to auto-set user

❌ **Don't**: Use string serializer classes  
✅ **Do**: Import and use serializer classes directly

❌ **Don't**: Overload ViewSet with complex logic  
✅ **Do**: Move complexity to serializers/services

---

## Commands

```bash
# Run view tests
pytest api/users/test_views.py

# Run specific test
pytest api/users/test_views.py::TestUserViewSet::test_register
```

---

## References

- **Existing Views**: `users/views.py`
- **Permissions**: https://www.django-rest-framework.org/api-guide/permissions/
- **ViewSets**: https://www.django-rest-framework.org/api-guide/viewsets/
- **Pagination**: https://www.django-rest-framework.org/api-guide/pagination/
