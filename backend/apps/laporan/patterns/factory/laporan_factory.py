from abc import ABC, abstractmethod
from apps.laporan.patterns.template_method.abstract_laporan_generator import AbstractLaporanGenerator


class LaporanFactory(ABC):
    @abstractmethod
    def create_laporan(self, report_type: str) -> AbstractLaporanGenerator:
        pass
