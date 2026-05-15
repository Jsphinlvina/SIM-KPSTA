from abc import ABC, abstractmethod


class NotificationSubject(ABC):
    @abstractmethod
    def attach(self, observer):
        ...

    @abstractmethod
    def detach(self, observer):
        ...

    @abstractmethod
    def notify_all(self, event, data):
        ...
