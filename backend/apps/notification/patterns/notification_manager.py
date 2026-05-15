import logging

from .notification_subject import NotificationSubject

logger = logging.getLogger(__name__)


class NotificationManager(NotificationSubject):
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._observers = []
        return cls._instance

    @classmethod
    def get_instance(cls):
        return cls()

    def attach(self, observer):
        if observer not in self._observers:
            self._observers.append(observer)

    def detach(self, observer):
        if observer in self._observers:
            self._observers.remove(observer)

    def notify_all(self, event, data):
        logger.info('notification event=%s data=%s observers=%d', event, data, len(self._observers))
        for observer in list(self._observers):
            observer.on_notification(event, data)
