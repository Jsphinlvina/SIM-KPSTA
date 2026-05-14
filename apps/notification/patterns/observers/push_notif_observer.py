from apps.notification.services import push_service

from .notification_observer import NotificationObserver


class PushNotificationObserver(NotificationObserver):
    def on_notification(self, event, data):
        push_service.send(data['user_id'], data['message'], event)
