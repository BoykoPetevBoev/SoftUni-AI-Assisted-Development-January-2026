from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            'id',
            'user',
            'title',
            'description',
            'date',
            'initial_amount',
            'balance',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'balance', 'created_at', 'updated_at']
        extra_kwargs = {
            'title': {
                'error_messages': {
                    'required': 'Title is required.',
                    'blank': 'Title cannot be blank.',
                    'max_length': 'Title must be at most 255 characters.',
                }
            },
            'initial_amount': {
                'error_messages': {
                    'required': 'Initial amount is required.',
                    'invalid': 'Enter a valid decimal number.',
                }
            },
            'date': {
                'error_messages': {
                    'required': 'Date is required.',
                    'invalid': 'Enter a valid date (YYYY-MM-DD).',
                }
            },
        }

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Title cannot be empty.')
        if len(value) > 255:
            raise serializers.ValidationError('Title must be at most 255 characters.')
        return value.strip()

    def validate_initial_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Initial amount must be greater than 0.')
        if value > 999999999.99:
            raise serializers.ValidationError('Initial amount is too large.')
        return value

    def validate_date(self, value):
        if not value:
            raise serializers.ValidationError('Date is required.')
        return value

    def get_balance(self, obj):
        total = getattr(obj, 'transactions_total', None)
        if total is None:
            total = obj.transactions.aggregate(total=Sum('amount')).get('total')
        if total is None:
            total = Decimal('0.00')
        balance = obj.initial_amount + total
        return str(balance.quantize(Decimal('0.01')))
