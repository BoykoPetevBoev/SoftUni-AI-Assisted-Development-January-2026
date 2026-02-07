from django.db import models


class HealthCheck(models.Model):
    status = models.CharField(max_length=50, default='ok')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.status

    class Meta:
        db_table = 'health_check'
