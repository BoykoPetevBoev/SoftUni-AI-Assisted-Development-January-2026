from decimal import Decimal

from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'budget', 'amount', 'category', 'date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'budget': {
                'error_messages': {
                    'required': 'Budget is required.',
                    'does_not_exist': 'Budget does not exist.',
                    'incorrect_type': 'Budget must be a valid ID.',
                }
            },
            'amount': {
                'error_messages': {
                    'required': 'Amount is required.',
                    'invalid': 'Enter a valid decimal number.',
                }
            },
            'category': {
                'error_messages': {
                    'required': 'Category is required.',
                    'blank': 'Category cannot be blank.',
                    'max_length': 'Category must be at most 100 characters.',
                }
            },
            'date': {
                'error_messages': {
                    'required': 'Date is required.',
                    'invalid': 'Enter a valid date (YYYY-MM-DD).',
                }
            },
        }

    def validate_category(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Category cannot be empty.')
        return value.strip()

    def validate_amount(self, value):
        limit = Decimal('9999999999.99')
        if value > limit or value < -limit:
            raise serializers.ValidationError('Amount is too large.')
        return value

    def validate_budget(self, value):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError('Authenticated user is required.')
        if value.user != request.user:
            raise serializers.ValidationError('Budget does not belong to the authenticated user.')
        return value
