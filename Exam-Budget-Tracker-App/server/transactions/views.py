from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from api.permissions import IsOwner
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        """Return only authenticated user's transactions"""
        queryset = Transaction.objects.filter(budget__user=self.request.user).select_related('budget', 'category')
        budget_id = self.request.query_params.get('budget')
        if budget_id:
            queryset = queryset.filter(budget_id=budget_id)
        return queryset
