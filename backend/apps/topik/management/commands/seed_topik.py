from django.core.management.base import BaseCommand
from apps.authentication.models import Users
from apps.topik.models import Topik, PeriodeSemester

class Command(BaseCommand):
    help = 'Menembak data dummy penawaran topik untuk dosen ke database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Memulai proses seeding data topik penawaran...'))

        # 1. Ambil dosen
        dosen = Users.objects.filter(nim_nip='72001', role='dosen').first()
        if not dosen:
            self.stdout.write(self.style.ERROR('Gagal: Dosen dengan NIP 72001 tidak ditemukan. Silakan jalankan seed_users terlebih dahulu.'))
            return

        # 2. Ambil periode aktif
        periode_aktif = PeriodeSemester.objects.filter(status_periode='aktif').first()
        if not periode_aktif:
            # Create active period if missing
            periode_aktif = PeriodeSemester.objects.create(
                nama_periode='2025/2026 Ganjil',
                status_periode='aktif'
            )
            self.stdout.write(self.style.SUCCESS(f'Berhasil membuat periode semester aktif default: {periode_aktif}'))

        topik_data = [
            {
                "judul": "Implementasi Algoritma CNN Berbasis MobileNetV2 untuk Deteksi Hama Padi",
                "deskripsi": "Penelitian ini mengembangkan model deep learning Convolutional Neural Network (CNN) dengan arsitektur MobileNetV2 yang ringan untuk diimplementasikan pada perangkat mobile guna mendeteksi penyakit dan hama daun padi secara real-time.",
                "prasyarat": "Tugas Akhir",
                "kuota": 3
            },
            {
                "judul": "Rancang Bangun Sistem Smart Grid Monitoring Berbasis Internet of Things (IoT)",
                "deskripsi": "Proyek ini mencakup rancang bangun perangkat keras sensorik daya listrik pada microgrid berbasis mikrokontroler ESP32, dengan visualisasi metrik daya secara real-time pada dasbor monitoring web responsif.",
                "prasyarat": "Kerja Praktik",
                "kuota": 2
            },
            {
                "judul": "Analisis Performa Model Named Entity Recognition (NER) pada Dokumen Hukum Indonesia",
                "deskripsi": "Studi komparatif dan eksperimen fine-tuning model IndoBERT untuk mengekstraksi entitas penting seperti nama pasal, tanggal putusan, nama terdakwa, dan jenis pelanggaran hukum dalam bahasa Indonesia.",
                "prasyarat": "Tugas Akhir",
                "kuota": 3
            },
            {
                "judul": "Pengembangan Sistem Penjadwalan Kuliah Otomatis Menggunakan Algoritma Genetika",
                "deskripsi": "Aplikasi berbasis web untuk otomatisasi penjadwalan mata kuliah, dosen, dan ruang kelas dengan batasan-batasan kompleks (hard and soft constraints) guna meminimalkan jadwal bentrok.",
                "prasyarat": "Tugas Akhir",
                "kuota": 4
            }
        ]

        count = 0
        for data in topik_data:
            if not Topik.objects.filter(judul__iexact=data["judul"]).exists():
                Topik.objects.create(
                    user=dosen,
                    periode=periode_aktif,
                    judul=data["judul"],
                    deskripsi=data["deskripsi"],
                    prasyarat=data["prasyarat"],
                    kuota=data["kuota"]
                )
                self.stdout.write(self.style.SUCCESS(f'Berhasil menambahkan topik: {data["judul"]}'))
                count += 1
            else:
                self.stdout.write(self.style.NOTICE(f'Topik "{data["judul"]}" sudah terdaftar, skipping.'))

        self.stdout.write(self.style.SUCCESS(f'Selesai! Berhasil menambahkan {count} topik dummy baru ke database.'))
