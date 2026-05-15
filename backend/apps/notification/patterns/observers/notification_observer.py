from abc import ABC, abstractmethod


class NotificationObserver(ABC):
    @abstractmethod
    def on_notification(self, event, data):
        ...
