from django.db.models import DecimalField, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from api.permissions import IsOwner
from .models import Budget
from .serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        """Return only authenticated user's budgets"""
        return Budget.objects.filter(user=self.request.user).annotate(
            transactions_total=Coalesce(
                Sum('transactions__amount'),
                Value(0),
                output_field=DecimalField(max_digits=12, decimal_places=2),
            )
        )

    def perform_create(self, serializer):
        """Auto-set user to authenticated user"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure user cannot change budget ownership"""
        serializer.save(user=self.request.user)
