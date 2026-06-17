from abc import ABC, abstractmethod

class PengajuanFactory(ABC):
    @abstractmethod
    def create_pengajuan(self, data, mahasiswa_user):
        pass