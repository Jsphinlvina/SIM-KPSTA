from rest_framework import status as http_status
from rest_framework.views import APIView

from core.responses import fail, ok

from .serializers import NotificationSerializer
from .services import notification_service


def _get_user_id(request):
    user = getattr(request, 'user', None)
    if user is not None and user.is_authenticated:
        return user.id
    raw = request.query_params.get('user_id')
    try:
        return int(raw)
    except (TypeError, ValueError):
        return None


class NotificationListView(APIView):
    def get(self, request):
        user_id = _get_user_id(request)
        if user_id is None:
            return fail('Parameter user_id wajib diisi')
        notifications = notification_service.list_for_user(user_id)
        return ok(NotificationSerializer(notifications, many=True).data)


class UnreadNotificationListView(APIView):
    def get(self, request):
        user_id = _get_user_id(request)
        if user_id is None:
            return fail('Parameter user_id wajib diisi')
        notifications = notification_service.list_unread(user_id)
        return ok(NotificationSerializer(notifications, many=True).data)


class MarkAsReadView(APIView):
    def post(self, request, notification_id):
        user_id = _get_user_id(request)
        if user_id is None:
            return fail('Parameter user_id wajib diisi')
        notification = notification_service.mark_as_read(notification_id, user_id)
        if notification is None:
            return fail('Notifikasi tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        return ok(NotificationSerializer(notification).data, message='Notifikasi ditandai sudah dibaca')


class MarkAllAsReadView(APIView):
    def post(self, request):
        user_id = _get_user_id(request)
        if user_id is None:
            return fail('Parameter user_id wajib diisi')
        updated = notification_service.mark_all_as_read(user_id)
        return ok({'updated': updated}, message='Semua notifikasi ditandai sudah dibaca')


class DeleteNotificationView(APIView):
    def delete(self, request, notification_id):
        user_id = _get_user_id(request)
        if user_id is None:
            return fail('Parameter user_id wajib diisi')
        removed = notification_service.delete(notification_id, user_id)
        if not removed:
            return fail('Notifikasi tidak ditemukan', status=http_status.HTTP_404_NOT_FOUND)
        return ok(message='Notifikasi dihapus')
