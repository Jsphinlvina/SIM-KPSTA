from apps.notification.models import Notification
from apps.notification.patterns.notification_manager import NotificationManager


def notify(event, data):
    NotificationManager.get_instance().notify_all(event, data)


def list_for_user(user_id):
    return Notification.objects.filter(user_id=user_id)


def list_unread(user_id):
    return Notification.objects.filter(user_id=user_id, is_read=False)


def mark_as_read(notification_id, user_id):
    notification = Notification.objects.filter(id=notification_id, user_id=user_id).first()
    if notification is None:
        return None
    if not notification.is_read:
        notification.is_read = True
        notification.save(update_fields=['is_read'])
    return notification


def mark_all_as_read(user_id):
    return Notification.objects.filter(user_id=user_id, is_read=False).update(is_read=True)


def delete(notification_id, user_id):
    deleted, _ = Notification.objects.filter(id=notification_id, user_id=user_id).delete()
    return deleted > 0
