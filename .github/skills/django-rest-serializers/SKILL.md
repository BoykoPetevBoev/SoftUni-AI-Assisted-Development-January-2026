---
name: django-rest-serializers
description: Master Django REST Framework serializers for validation, nested data, and custom fields
license: MIT
---

# Django REST Serializers

## When to Use This Skill

- Validating API request data
- Transforming model instances to JSON
- Handling nested relationships
- Creating custom fields and validation logic
- Serializing multiple model types

---

## Core Patterns Overview

**Basic Model Serializer**: Use ModelSerializer as the base for serializing Django models. Define fields explicitly (not `__all__`). Mark read-only fields like `id`. Use extra_kwargs for field options. This pattern saves boilerplate while maintaining clarity.

**Validation Patterns**: Use `validate_<field_name>()` for single field validation (e.g., username uniqueness). Use `validate()` for cross-field validation (e.g., password match). Use `write_only=True` for password fields. Provide clear, user-friendly error messages. Override `create()` for custom creation logic (e.g., hashing passwords).

**Nested Serializers**: Use nested serializers to include related objects. Mark nested relationships as `read_only=True` if not writable. Use `many=True` for reverse relationships (lists). Access authenticated user via `self.context['request'].user`.

**Custom Fields**: Use `SerializerMethodField` for computed/dynamic fields. Use `to_representation()` for output transformation (e.g., formatting, filtering). Use `to_internal_value()` for input transformation. Custom fields are read-only by default.

**List Serializers**: Create custom list serializers for bulk operations (creating multiple objects efficiently). Override the `list_serializer_class` in Meta. Use `bulk_create()` for performance.

---

## Key Rules

- Use ModelSerializer for database models
- Define fields explicitly (no `__all__`)
- Mark read-only fields (id, timestamps)
- Use extra_kwargs for field options
- Use validate_<field_name>() for single field validation
- Use validate() for cross-field validation
- Use write_only=True for password fields
- Provide clear error messages
- Override create()/update() for custom logic
- Use nested serializers for relationships
- Use SerializerMethodField for computed fields
- Access request via self.context['request'].user

---

## Anti-Patterns

❌ **Don't**: Use `fields = '__all__'`  
✅ **Do**: Define fields explicitly

❌ **Don't**: Skip validation on sensitive fields  
✅ **Do**: Add validators and error messages

❌ **Don't**: Expose internal fields in serializer  
✅ **Do**: Mark confidential fields as write_only

❌ **Don't**: Have business logic in serializer.create()  
✅ **Do**: Keep create() simple, add logic to view

❌ **Don't**: Forget to set context['request'].user for nested fields  
✅ **Do**: Always pass request context to serializer

---

## Quality Checklist

- [ ] **Serializer created**: `src/serializers.py`
- [ ] **Fields defined explicitly**: No `__all__`
- [ ] **Validation included**: Field-level and object-level
- [ ] **Custom fields documented**: Clear purpose
- [ ] **Error messages clear**: User-friendly text
- [ ] **Nested serializers**: For relationships
- [ ] **Read-only fields**: Properly marked
- [ ] **create()/update()**: Custom logic when needed

---

## Common Patterns

### Simple Serializer
```
model = Category, fields = ['id', 'name']
```

### Serializer with Validation
```
Use field validators and error messages
```

### Nested with Create
```
Nested serializers with custom create logic
```

---

## Commands

```bash
# Run serializer tests
pytest api/users/test_serializers.py

# Run all tests with coverage
pytest --cov=api
```

---

## References

- **Existing Serializers**: `users/serializers.py`, `health_check/serializers.py`
- **Django REST Docs**: https://www.django-rest-framework.org/api-guide/serializers/
- **Validation Docs**: https://www.django-rest-framework.org/api-guide/serializers/#validation

---

# CODE EXAMPLES

## 1. Basic Model Serializer

**File**: `api/users/serializers.py`

```python
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']
        extra_kwargs = {
            'email': {'required': True},
        }
```

## 2. Validation Patterns - Good Examples

```python
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        validators=[validate_password],
        error_messages={
            'required': 'Password is required.',
            'min_length': 'Password must be at least 8 characters.',
        }
    )
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate_username(self, value):
        """Field-level validation for username"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def validate(self, data):
        """Object-level validation across multiple fields"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return data

    def create(self, validated_data):
        """Custom create logic"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
```

## 3. Nested Serializers

```python
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'comments', 'created_at']
        read_only_fields = ['id', 'author', 'created_at', 'comments']

    def create(self, validated_data):
        """Author is set from request context"""
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
```

## 4. Custom Fields

```python
class TransactionSerializer(serializers.ModelSerializer):
    # Custom field for display
    category_display = serializers.SerializerMethodField()
    
    # Custom computed field
    amount_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'amount_formatted', 'category', 'category_display', 'date']
        read_only_fields = ['id', 'amount_formatted', 'category_display']

    def get_category_display(self, obj):
        """Display human-readable category name"""
        return obj.get_category_display()

    def get_amount_formatted(self, obj):
        """Format amount with currency"""
        return f"${obj.amount:.2f}"

    def to_representation(self, instance):
        """Transform output representation"""
        data = super().to_representation(instance)
        # Hide sensitive fields for non-admin users
        if not self.context['request'].user.is_staff:
            data.pop('internal_id', None)
        return data
```

## 5. List Serializers (Multiple Objects)

```python
class BulkTransactionSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        """Create multiple objects efficiently"""
        return Transaction.objects.bulk_create([
            Transaction(**item) for item in validated_data
        ])

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'category', 'date']
    
    class Meta:
        list_serializer_class = BulkTransactionSerializer

# Usage in view
if isinstance(request.data, list):
    serializer = TransactionSerializer(data=request.data, many=True)
else:
    serializer = TransactionSerializer(data=request.data)
```
