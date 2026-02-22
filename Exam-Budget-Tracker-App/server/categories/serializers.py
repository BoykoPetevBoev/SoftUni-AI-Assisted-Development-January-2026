from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'user', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
        extra_kwargs = {
            'name': {
                'error_messages': {
                    'required': 'Name is required.',
                    'blank': 'Name cannot be blank.',
                    'max_length': 'Name must be at most 100 characters.',
                }
            }
        }

    def validate_name(self, value):
        name = value.strip() if value else ''
        if not name:
            raise serializers.ValidationError('Name cannot be empty.')
        if len(name) > 100:
            raise serializers.ValidationError('Name must be at most 100 characters.')

        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            raise serializers.ValidationError('Authenticated user is required.')

        queryset = Category.objects.filter(user=user, name__iexact=name)
        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)
        if queryset.exists():
            raise serializers.ValidationError('Category already exists.')

        return name
