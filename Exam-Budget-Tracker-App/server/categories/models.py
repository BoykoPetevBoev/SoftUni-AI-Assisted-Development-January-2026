from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.functions import Lower

User = get_user_model()


class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'categories'
        ordering = ['name']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['user', 'name']),
        ]
        constraints = [
            models.UniqueConstraint(
                Lower('name'), 'user', name='unique_category_name_per_user'
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.user.username})"
