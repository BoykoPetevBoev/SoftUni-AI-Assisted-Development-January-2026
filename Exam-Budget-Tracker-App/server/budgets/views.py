from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Budget
from .serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only authenticated user's budgets"""
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Auto-set user to authenticated user"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure user cannot change budget ownership"""
        serializer.save(user=self.request.user)
