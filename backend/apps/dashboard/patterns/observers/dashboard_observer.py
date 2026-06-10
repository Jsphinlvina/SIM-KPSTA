from abc import ABC, abstractmethod


class DashboardObserver(ABC):
    @abstractmethod
    def update(self, distribusi_data: dict):
        pass
