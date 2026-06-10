from abc import ABC, abstractmethod
from apps.laporan.models.report import Report


class AbstractLaporanGenerator(ABC):
    """Template Method: defines the skeleton of report generation."""

    def generate_laporan(self, periode_id=None) -> Report:
        raw = self.collect_data(periode_id)
        processed = self.process_data(raw)
        return self.format_report(processed, periode_id)

    @abstractmethod
    def collect_data(self, periode_id) -> dict:
        pass

    @abstractmethod
    def process_data(self, raw_data: dict) -> dict:
        pass

    @abstractmethod
    def format_report(self, processed_data: dict, periode_id) -> Report:
        pass
