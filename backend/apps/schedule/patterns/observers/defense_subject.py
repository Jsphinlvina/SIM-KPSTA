from abc import ABC, abstractmethod


class DefenseSubject(ABC):
    @abstractmethod
    def attach(self, observer):
        ...

    @abstractmethod
    def detach(self, observer):
        ...

    @abstractmethod
    def notify_observers(self, event, defense):
        ...
