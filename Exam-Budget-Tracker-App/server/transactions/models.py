from django.db import models
from budgets.models import Budget
from categories.models import Category


class Transaction(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='transactions',
        null=True,
        blank=True,
    )
    description = models.CharField(max_length=255, blank=True, null=True)
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

    def __str__(self):
        return f"{self.budget.title} - {self.amount} ({self.date})"
