---
name: django-models-orm
description: Create efficient Django models and ORM queries with relationships, querysets, and optimization
license: MIT
---

# Django Models & ORM

## When to Use This Skill

- Defining database models with proper fields
- Creating relationships between models (ForeignKey, ManyToMany)
- Querying data efficiently with QuerySets
- Adding database indexes and constraints
- Optimizing query performance

---

## Core Patterns Overview

**Model Definition**: Create Django models that represent database tables. Use appropriate field types with validators. Add Meta options for ordering, indexes, and constraints. Use `on_delete` carefully (CASCADE vs PROTECT). Always define `related_name` for reverse relationships. Include string methods for readable representations.

**Relationships**: Use ForeignKey for one-to-many relationships (articles have authors). Use OneToOneField for one-to-one relationships (users have profiles). Use ManyToManyField for many-to-many relationships (students take courses). Always specify `on_delete` behavior.

**QuerySet Patterns**: Use `filter()` for AND logic and multiple conditions. Use `Q` objects for OR logic and complex queries. Use exclude for NOT logic. Combine querysets with `|` (OR) and `&` (AND) operators. Use `get()` for single objects, `all()` for all, `first()` for first item.

**Query Optimization**: Use `select_related()` for ForeignKey (reduces queries). Use `prefetch_related()` for reverse relationships. Use `only()` to select specific fields. Use `values()` for dictionary results. Avoid N+1 query problems by fetching related objects in one query.

**Common Lookups**: Use `__gte`, `__gt`, `__lte`, `__lt` for comparisons. Use `__in` to check if value is in list. Use `__isnull` for NULL checks. Use `__contains` and `__icontains` for substring matching. Use `__year`, `__month`, `__day` for date parts.

**Model Methods**: Use `__str__()` for string representation. Use `@property` for computed fields (not in database). Use class methods for common queries. Use regular methods for actions on instances.

**Database Constraints**: Use models.UniqueConstraint for unique combinations. Use models.CheckConstraint for value validation. Use indexes for frequently queried fields. Specify on_delete behavior to maintain referential integrity.

---

## Key Rules

- Use ForeignKey for one-to-many relationships
- Use on_delete=CASCADE for dependent data, PROTECT to prevent deletion
- Add database indexes for frequently queried fields
- Add constraints for data integrity
- Always define related_name for reverse relationships
- Use select_related() for ForeignKey (query optimization)
- Use prefetch_related() for reverse relationships
- Use validators for field-level validation
- Add decimal places for money fields (DecimalField)
- Use choices for enum-like fields
- Include helpful docstrings
- Create migrations after model changes

---

## Core Patterns

### 1. Model Definition

**File**: `api/transactions/models.py`

```python
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        ordering = ['name']
        # Add index for frequently queried field
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='transactions')
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    transaction_type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPES,
        default='expense'
    )
    description = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transactions'
        ordering = ['-date', '-created_at']
        # Index for common queries
        indexes = [
            models.Index(fields=['user', '-date']),
            models.Index(fields=['category']),
        ]
        # Prevent duplicate transactions
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'category', 'date', 'amount'],
                name='unique_daily_transaction'
            ),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.amount} ({self.date})"

    @property
    def is_income(self):
        return self.transaction_type == 'income'
```

**Key Rules**:
- Use `ForeignKey` for one-to-many relationships
- Use `on_delete=CASCADE` for dependent data
- Use `on_delete=PROTECT` to prevent deletion of referenced data
- Add database `indexes` for frequently queried fields
- Add `constraints` for data integrity
- Use `related_name` for reverse relationships

---

### 2. Relationships

```python
class Budget(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='budget')
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2)
    categories = models.ManyToManyField(Category, related_name='budgets')

    # Access related transactions via related_name
    # budget.transactions.all()
    # user.transactions.all()
    # category.budgets.all()
```

**Relationship Types**:
- `ForeignKey`: One-to-Many (Product → Category)
- `OneToOneField`: One-to-One (User → Profile)
- `ManyToManyField`: Many-to-Many (Students → Courses)

---

### 3. QuerySet Patterns

```python
from django.db.models import Q, Sum, Count, F, Case, When, Value
from django.db.models.functions import TruncMonth

# Basic queries
Transaction.objects.all()  # All transactions
Transaction.objects.filter(user=user)  # Filter by field
Transaction.objects.get(id=1)  # Single object
Transaction.objects.first()  # First object

# Filtering
Transaction.objects.filter(user=user, date__gte='2024-01-01')  # AND logic
Transaction.objects.filter(Q(user=user) | Q(user__is_staff=True))  # OR logic
Transaction.objects.exclude(transaction_type='income')  # NOT logic

# Lookups
Transaction.objects.filter(amount__gte=100)  # >= 100
Transaction.objects.filter(amount__lt=50)  # < 50
Transaction.objects.filter(date__month=1)  # Month = January
Transaction.objects.filter(description__icontains='food')  # Case-insensitive contains
Transaction.objects.filter(date__year=2024)  # Year = 2024

# Relationships
Transaction.objects.filter(category__name='Food')  # Related field
Transaction.objects.filter(user__is_staff=True)  # Nested relationship

# Aggregation
Transaction.objects.aggregate(
    total=Sum('amount'),
    count=Count('id'),
    avg=Avg('amount')
)

# Group by month
transactions_by_month = Transaction.objects.annotate(
    month=TruncMonth('date')
).values('month').annotate(
    total=Sum('amount')
).order_by('month')

# Conditional aggregation
summary = Transaction.objects.aggregate(
    income=Sum(
        'amount',
        filter=Q(transaction_type='income')
    ),
    expenses=Sum(
        'amount',
        filter=Q(transaction_type='expense')
    )
)
```

**Common Lookups**:
- `field__exact` = exact match
- `field__iexact` = case-insensitive
- `field__contains` = substring
- `field__gt`, `__gte`, `__lt`, `__lte` = comparisons
- `field__in` = in list
- `field__isnull` = NULL check

---

### 4. Query Optimization

```python
# ❌ BAD: N+1 query problem (1 query for users + 1 query per user for transactions)
users = User.objects.all()
for user in users:
    print(user.transactions.all())  # New query each iteration

# ✅ GOOD: Use select_related for ForeignKey
transactions = Transaction.objects.select_related('user', 'category')
# Now all related objects are fetched in one query

# ✅ GOOD: Use prefetch_related for reverse relationships
users = User.objects.prefetch_related('transactions')
for user in users:
    print(user.transactions.all())  # No new query

# ✅ GOOD: Use only() to select specific fields
transactions = Transaction.objects.only('id', 'amount', 'date')

# ✅ GOOD: Use values() for dictionary results
summary = Transaction.objects.values('category').annotate(total=Sum('amount'))
# Returns: [{'category': 1, 'total': 500}, ...]
```

**Key Rules**:
- Use `select_related()` for ForeignKey and OneToOne
- Use `prefetch_related()` for reverse ForeignKey and ManyToMany
- Use `only()` to reduce fields loaded
- Use `values()` for dictionary results
- Use `count()` instead of `len(queryset)`

---

### 5. Model Methods & Properties

```python
class Transaction(models.Model):
    # ... fields ...

    def __str__(self):
        """String representation"""
        return f"{self.description} - ${self.amount}"

    @property
    def is_recent(self):
        """Computed property (NOT in database)"""
        from datetime import timedelta
        return self.date > timezone.now().date() - timedelta(days=7)

    def get_status_display(self):
        """Custom display method"""
        if self.is_income:
            return 'Income'
        return 'Expense'

    def mark_as_reviewed(self):
        """Custom action method"""
        self.reviewed = True
        self.reviewed_at = timezone.now()
        self.save()

    @classmethod
    def get_monthly_summary(cls, user, year, month):
        """Class method for common queries"""
        return cls.objects.filter(
            user=user,
            date__year=year,
            date__month=month
        ).aggregate(
            income=Sum('amount', filter=Q(transaction_type='income')),
            expenses=Sum('amount', filter=Q(transaction_type='expense'))
        )

    class Meta:
        db_table = 'transactions'
        ordering = ['-date']
```

---

### 6. Database Constraints

```python
class Transaction(models.Model):
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]  # App-level validation
    )

    class Meta:
        db_table = 'transactions'
        # Database-level constraints
        constraints = [
            # Unique constraint
            models.UniqueConstraint(
                fields=['user', 'category', 'date'],
                name='unique_daily_category_per_user'
            ),
            # Check constraint
            models.CheckConstraint(
                check=models.Q(amount__gt=0),
                name='positive_amount'
            ),
        ]
        # Indexes for performance
        indexes = [
            models.Index(fields=['user', '-date']),
            models.Index(
                fields=['user', 'category'],
                name='user_category_idx'
            ),
        ]
```

---

## Quality Checklist

- [ ] **Models defined**: All entities mapped to models
- [ ] **Fields correct**: Proper field types and validators
- [ ] **Relationships**: ForeignKey, ManyToMany configured
- [ ] **Indexes added**: For frequently queried fields
- [ ] **Constraints added**: Unique, check constraints
- [ ] **on_delete**: Specified for all relationships
- [ ] **related_name**: Defined for reverse relationships
- [ ] **Queryset optimized**: select_related/prefetch_related used

---

## Common Patterns

### Simple ForeignKey
```python
class Article(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
```

### ManyToMany
```python
class Student(models.Model):
    courses = models.ManyToManyField(Course)
```

### Filter by Date Range
```python
from datetime import date, timedelta
start = date(2024, 1, 1)
end = date(2024, 12, 31)
Transaction.objects.filter(date__gte=start, date__lte=end)
```

### Monthly Summary
```python
from django.db.models import Sum
from django.db.models.functions import TruncMonth

summary = Transaction.objects.annotate(
    month=TruncMonth('date')
).values('month').annotate(
    total=Sum('amount')
)
```

---

## Anti-Patterns

❌ **Don't**: Use string references for ForeignKey  
✅ **Do**: Import and use the model class

❌ **Don't**: Forget to add indexes for filtered fields  
✅ **Do**: Add indexes for query performance

❌ **Don't**: N+1 query problem (loop with related queries)  
✅ **Do**: Use select_related() / prefetch_related()

❌ **Don't**: Use len(queryset) to count  
✅ **Do**: Use queryset.count()

❌ **Don't**: Skip related_name definitions  
✅ **Do**: Always define related_name for clarity

---

## Quality Checklist

- [ ] **Models defined**: All entities mapped to models
- [ ] **Fields correct**: Proper field types and validators
- [ ] **Relationships**: ForeignKey, ManyToMany configured
- [ ] **Indexes added**: For frequently queried fields
- [ ] **Constraints added**: Unique, check constraints
- [ ] **on_delete**: Specified for all relationships
- [ ] **related_name**: Defined for reverse relationships
- [ ] **Queryset optimized**: select_related/prefetch_related used

---

## Common Lookup Operators

- `field__exact` - Exact match (default)
- `field__iexact` - Case-insensitive exact match
- `field__contains` - Substring match (case-sensitive)
- `field__icontains` - Substring match (case-insensitive)
- `field__gt` - Greater than
- `field__gte` - Greater than or equal
- `field__lt` - Less than
- `field__lte` - Less than or equal
- `field__in` - Value in list
- `field__isnull` - IS NULL check
- `field__year` - Extract year from date
- `field__month` - Extract month from date
- `field__day` - Extract day from date
- `field__week_day` - Extract day of week

---

## Commands

```bash
# Create migration for new model
python manage.py makemigrations

# Apply migration
python manage.py migrate

# Run Django shell to test queries
python manage.py shell

# Check model validation
python manage.py check

# Show SQL for query
print(Transaction.objects.filter(user=user).query)
```

---

## References

- **Existing Models**: `users/models.py`, `health_check/models.py`
- **Model Fields**: https://docs.djangoproject.com/en/4.2/ref/models/fields/
- **QuerySet API**: https://docs.djangoproject.com/en/4.2/ref/models/querysets/
- **Database Access**: https://docs.djangoproject.com/en/4.2/topics/db/

---

# CODE EXAMPLES

## 1. Model Definition

**File**: `api/transactions/models.py`

```python
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        ordering = ['name']
        # Add index for frequently queried field
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='transactions')
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    transaction_type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPES,
        default='expense'
    )
    description = models.TextField(blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transactions'
        ordering = ['-date', '-created_at']
        # Index for common queries
        indexes = [
            models.Index(fields=['user', '-date']),
            models.Index(fields=['category']),
        ]
        # Prevent duplicate transactions
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'category', 'date', 'amount'],
                name='unique_daily_transaction'
            ),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.amount} ({self.date})"

    @property
    def is_income(self):
        return self.transaction_type == 'income'
```

## 2. Relationships

```python
class Budget(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='budget')
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2)
    categories = models.ManyToManyField(Category, related_name='budgets')

    # Access related transactions via related_name
    # budget.transactions.all()
    # user.transactions.all()
    # category.budgets.all()
```

## 3. QuerySet Patterns

```python
from django.db.models import Q, Sum, Count, F, Case, When, Value
from django.db.models.functions import TruncMonth

# Basic queries
Transaction.objects.all()  # All transactions
Transaction.objects.filter(user=user)  # Filter by field
Transaction.objects.get(id=1)  # Single object
Transaction.objects.first()  # First object

# Filtering
Transaction.objects.filter(user=user, date__gte='2024-01-01')  # AND logic
Transaction.objects.filter(Q(user=user) | Q(user__is_staff=True))  # OR logic
Transaction.objects.exclude(transaction_type='income')  # NOT logic

# Lookups
Transaction.objects.filter(amount__gte=100)  # >= 100
Transaction.objects.filter(amount__lt=50)  # < 50
Transaction.objects.filter(date__month=1)  # Month = January
Transaction.objects.filter(description__icontains='food')  # Case-insensitive contains
Transaction.objects.filter(date__year=2024)  # Year = 2024

# Relationships
Transaction.objects.filter(category__name='Food')  # Related field
Transaction.objects.filter(user__is_staff=True)  # Nested relationship

# Aggregation
Transaction.objects.aggregate(
    total=Sum('amount'),
    count=Count('id'),
    avg=Avg('amount')
)

# Group by month
transactions_by_month = Transaction.objects.annotate(
    month=TruncMonth('date')
).values('month').annotate(
    total=Sum('amount')
).order_by('month')

# Conditional aggregation
summary = Transaction.objects.aggregate(
    income=Sum(
        'amount',
        filter=Q(transaction_type='income')
    ),
    expenses=Sum(
        'amount',
        filter=Q(transaction_type='expense')
    )
)
```

## 4. Query Optimization - Good Examples

```python
# ✅ GOOD: Use select_related for ForeignKey
transactions = Transaction.objects.select_related('user', 'category')
# Now all related objects are fetched in one query

# ✅ GOOD: Use prefetch_related for reverse relationships
users = User.objects.prefetch_related('transactions')
for user in users:
    print(user.transactions.all())  # No new query

# ✅ GOOD: Use only() to select specific fields
transactions = Transaction.objects.only('id', 'amount', 'date')

# ✅ GOOD: Use values() for dictionary results
summary = Transaction.objects.values('category').annotate(total=Sum('amount'))
# Returns: [{'category': 1, 'total': 500}, ...]
```

## 5. Query Optimization - Bad Examples (to avoid)

```python
# ❌ BAD: N+1 query problem (1 query for users + 1 query per user for transactions)
users = User.objects.all()
for user in users:
    print(user.transactions.all())  # New query each iteration
```

## 6. Model Methods & Properties

```python
class Transaction(models.Model):
    # ... fields ...

    def __str__(self):
        """String representation"""
        return f"{self.description} - ${self.amount}"

    @property
    def is_recent(self):
        """Computed property (NOT in database)"""
        from datetime import timedelta
        return self.date > timezone.now().date() - timedelta(days=7)

    def get_status_display(self):
        """Custom display method"""
        if self.is_income:
            return 'Income'
        return 'Expense'

    def mark_as_reviewed(self):
        """Custom action method"""
        self.reviewed = True
        self.reviewed_at = timezone.now()
        self.save()

    @classmethod
    def get_monthly_summary(cls, user, year, month):
        """Class method for common queries"""
        return cls.objects.filter(
            user=user,
            date__year=year,
            date__month=month
        ).aggregate(
            income=Sum('amount', filter=Q(transaction_type='income')),
            expenses=Sum('amount', filter=Q(transaction_type='expense'))
        )

    class Meta:
        db_table = 'transactions'
        ordering = ['-date']
```

## 7. Database Constraints

```python
class Transaction(models.Model):
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]  # App-level validation
    )

    class Meta:
        db_table = 'transactions'
        # Database-level constraints
        constraints = [
            # Unique constraint
            models.UniqueConstraint(
                fields=['user', 'category', 'date'],
                name='unique_daily_category_per_user'
            ),
            # Check constraint
            models.CheckConstraint(
                check=models.Q(amount__gt=0),
                name='positive_amount'
            ),
        ]
        # Indexes for performance
        indexes = [
            models.Index(fields=['user', '-date']),
            models.Index(
                fields=['user', 'category'],
                name='user_category_idx'
            ),
        ]
```

## 8. Common Query Patterns

### Simple ForeignKey
```python
class Article(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
```

### ManyToMany
```python
class Student(models.Model):
    courses = models.ManyToManyField(Course)
```

### Filter by Date Range
```python
from datetime import date, timedelta
start = date(2024, 1, 1)
end = date(2024, 12, 31)
Transaction.objects.filter(date__gte=start, date__lte=end)
```

### Monthly Summary
```python
from django.db.models import Sum
from django.db.models.functions import TruncMonth

summary = Transaction.objects.annotate(
    month=TruncMonth('date')
).values('month').annotate(
    total=Sum('amount')
)
```
