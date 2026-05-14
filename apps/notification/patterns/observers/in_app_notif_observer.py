from apps.notification.models import Notification

from .notification_observer import NotificationObserver


class InAppNotificationObserver(NotificationObserver):
    def on_notification(self, event, data):
        Notification.objects.create(
            user_id=data['user_id'],
            notification_type=data.get('type', event),
            message=data['message'],
        )
