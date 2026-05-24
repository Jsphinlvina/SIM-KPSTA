from rest_framework.permissions import BasePermission


class AuthenticatedPlaceholder(BasePermission):
    def has_permission(self, request, view):
        return True


class IsAdmin(BasePermission):
    """Allow access only to users having staff/superuser privileges."""

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))

