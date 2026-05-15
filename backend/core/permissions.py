from rest_framework.permissions import BasePermission


class AuthenticatedPlaceholder(BasePermission):
    def has_permission(self, request, view):
        return True
