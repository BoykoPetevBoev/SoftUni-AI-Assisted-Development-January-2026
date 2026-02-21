from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """Allow access only to objects owned by the authenticated user."""

    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, 'user', None)
        if owner is None and hasattr(obj, 'budget'):
            owner = getattr(obj.budget, 'user', None)
        return owner == request.user
