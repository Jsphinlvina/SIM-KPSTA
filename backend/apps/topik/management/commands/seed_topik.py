from django.core.management.base import BaseCommand
from django.db import transaction
from apps.authentication.models import Users
from apps.topik.models import PeriodeSemester, Topik


class Command(BaseCommand):
    help = "Menyuntikkan data dummy Periode Semester dan Topik Penawaran Dosen"

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING("=== Memulai Seeding Data Periode & Topik ===")
        )

        # 1. Ambil data user ber-role dosen hasil dari seed_users kemarin
        dosen_1 = Users.objects.filter(role="dosen").first()

        if not dosen_1:
            self.stdout.write(
                self.style.ERROR(
                    'Gagal: Tidak ada user dengan role "dosen" di database.\n'
                    'Silakan jalankan "python manage.py seed_users" terlebih dahulu!'
                )
            )
            return

        try:
            with transaction.atomic():
                # 2. Pembuatan Periode Semester Aktif
                periode, created = PeriodeSemester.objects.get_or_create(
                    nama_periode="2025/2026 Ganjil",
                    defaults={"status_periode": "aktif"},
                )
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(
                            "-> Berhasil membuat Periode Semester Aktif."
                        )
                    )

                # 3. Pembuatan Daftar Topik Penawaran Dosen
                topik_data = [
                    {
                        "user": dosen_1,
                        "periode": periode,
                        "judul": "Sistem Deteksi ASD Menggunakan Deep Learning",
                        "deskripsi": "Penelitian deteksi Autism Spectrum Disorder berbasis AI menggunakan Convolutional Neural Networks.",
                        "prasyarat": "Lulus matakuliah Kecerdasan Buatan (Minimal nilai B), menguasai Python dasar.",
                        "kuota": 5,
                    },
                    {
                        "user": dosen_1,
                        "periode": periode,
                        "judul": "Website Monitoring IoT",
                        "deskripsi": "Monitoring sensor IoT industri menggunakan dashboard web real-time terintegrasi WebSocket.",
                        "prasyarat": "Menguasai JavaScript / Node.js dasar dan mengerti konsep dasar REST API.",
                        "kuota": 3,
                    },
                ]

                count = 0
                for data in topik_data:
                    if not Topik.objects.filter(judul=data["judul"]).exists():
                        Topik.objects.create(**data)
                        count += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"=== Seeding Selesai! Berhasil menambahkan {count} Topik Dosen baru ==="
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Terjadi kesalahan saat seeding topik: {str(e)}")
            )
