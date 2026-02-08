from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken


class User(AbstractUser):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_users'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_users'
    )

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username

class TokenBlacklist(models.Model):
    token = models.TextField()
    blacklisted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'token_blacklist'
        indexes = [
            models.Index(fields=['token']),
        ]

    def __str__(self):
        return f"Token blacklisted at {self.blacklisted_at}"