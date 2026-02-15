from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

User = get_user_model()


class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    initial_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'budgets'
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"{self.title} ({self.user.username})"
