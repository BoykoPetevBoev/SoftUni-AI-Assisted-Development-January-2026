from django.db import models
from budgets.models import Budget


class Transaction(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=100)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'transactions'
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['budget']),
            models.Index(fields=['budget', 'date']),
        ]
        constraints = [
            models.CheckConstraint(
                check=~models.Q(category=''),
                name='transaction_category_not_blank',
            ),
        ]

    def __str__(self):
        return f"{self.budget.title} - {self.amount} ({self.date})"
