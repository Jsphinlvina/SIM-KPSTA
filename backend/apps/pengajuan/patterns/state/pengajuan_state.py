from abc import ABC, abstractmethod

class PengajuanState(ABC):
    @abstractmethod
    def submit(self, context): pass
    @abstractmethod
    def approve(self, context): pass
    @abstractmethod
    def reject(self, context): pass
    @abstractmethod
    def revise(self, context): pass