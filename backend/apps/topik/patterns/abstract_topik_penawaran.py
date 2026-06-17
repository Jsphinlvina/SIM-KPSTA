from abc import ABC, abstractmethod
from rest_framework.exceptions import ValidationError

class AbstractTopikPenawaran(ABC):
    def proses_penawaran(self, data, user):
        self.validate_topik(data)
        self.check_kuota(data.get('kuota'))
        periode = self.assign_periode()
        topik_instance = self.save_topik(data, user, periode)
        self.notify_mahasiswa(topik_instance)
        return topik_instance

    @abstractmethod
    def validate_topik(self, data):
        pass

    def check_kuota(self, kuota):
        if kuota is None or int(kuota) <= 0:
            raise ValidationError({"kuota": "Kuota penawaran topik harus lebih besar dari 0."})

    @abstractmethod
    def assign_periode(self):
        pass

    @abstractmethod
    def save_topik(self, data, user, periode):
        pass

    def notify_mahasiswa(self, topik_instance):
        print(f"[SKELETON NOTIFIKASI] Topik baru '{topik_instance.judul}' berhasil disiarkan ke mahasiswa.")