from rest_framework.permissions import BasePermission

class AuthenticatedPlaceholder(BasePermission):
    def has_permission(self, request, view):
        return True

class IsMahasiswa(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'mahasiswa'

class IsDosen(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'dosen'

class IsKoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'koordinator'

class IsKaprodi(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'kaprodi'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsDosenOrKoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ('dosen', 'koordinator')

class IsKoordinatorOrKaprodi(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ('koordinator', 'kaprodi')

class IsDosenOrKoordinatorOrKaprodi(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ('dosen', 'koordinator', 'kaprodi')