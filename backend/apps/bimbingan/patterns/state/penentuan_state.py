from abc import ABC, abstractmethod

class PenentuanState(ABC):
    @abstractmethod
    def handle_approve(self, context):
        pass

    @abstractmethod
    def handle_reject(self, context, catatan):
        pass