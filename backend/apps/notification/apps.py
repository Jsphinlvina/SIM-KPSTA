from django.apps import AppConfig


class NotificationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.notification'
    label = 'notification'

    def ready(self):
        from apps.notification.patterns.notification_manager import NotificationManager
        from apps.notification.patterns.observers.email_notif_observer import EmailNotificationObserver
        from apps.notification.patterns.observers.in_app_notif_observer import InAppNotificationObserver
        from apps.notification.patterns.observers.push_notif_observer import PushNotificationObserver

        manager = NotificationManager.get_instance()
        manager.attach(InAppNotificationObserver())
        manager.attach(EmailNotificationObserver())
        manager.attach(PushNotificationObserver())
