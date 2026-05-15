from apps.notification.services import email_service

from .notification_observer import NotificationObserver


class EmailNotificationObserver(NotificationObserver):
    def on_notification(self, event, data):
        email_service.send(data['user_id'], data['message'], event)
