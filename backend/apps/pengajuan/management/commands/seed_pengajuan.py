from django.core.management.base import BaseCommand
from django.db import transaction
from apps.authentication.models import Users
from apps.topik.models import Topik
from apps.pengajuan.models import PengajuanKP
from apps.pengajuan.services.pengajuan_service import PengajuanService


class Command(BaseCommand):
    help = "Menyuntikkan data dummy pengajuan KP (Jalur Topik Dosen & Mandiri) via Factory Pattern"

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING("=== Memulai Seeding Data Pengajuan KP ===")
        )

        # 1. Ambil data user mahasiswa dari hasil seed_users sebelumnya
        mahasiswa_1 = Users.objects.filter(nim_nip="2272001", role="mahasiswa").first()
        mahasiswa_2 = Users.objects.filter(nim_nip="220011", role="mahasiswa").first()

        if not mahasiswa_1:
            self.stdout.write(
                self.style.ERROR(
                    "Gagal: Mahasiswa dengan NIM 2272001 tidak ditemukan.\n"
                    'Silakan jalankan "python manage.py seed_users" terlebih dahulu!'
                )
            )
            return

        topik_dosen = Topik.objects.first()
        if not topik_dosen:
            self.stdout.write(
                self.style.ERROR(
                    "Gagal: Belum ada data Topik Dosen di database.\n"
                    "Pastikan fitur/seeder topik dosen sudah dimasukkan terlebih dahulu!"
                )
            )
            return

        try:
            with transaction.atomic():
                count = 0

                payload_topik = {
                    "topik": topik_dosen.topik_id,
                    "deskripsi_sistem": "Saya tertarik mengembangkan kelanjutan dari riset deteksi AI ini untuk platform web.",
                }

                if not PengajuanKP.objects.filter(
                    mahasiswa=mahasiswa_1, topik=topik_dosen
                ).exists():
                    pengajuan_topik = PengajuanService.create_via_factory(
                        tipe="topik-dosen", data=payload_topik, user=mahasiswa_1
                    )

                    service_state = PengajuanService(pengajuan_topik)
                    service_state.trigger_submit()

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"-> Berhasil seed JALUR TOPIK DOSEN untuk {mahasiswa_1.nama_lengkap} (Status: SUBMITTED)"
                        )
                    )
                    count += 1

                if mahasiswa_2:
                    payload_mandiri = {
                        "judul_diajukan": "Rancang Bangun Aplikasi Penjualan Suku Cadang Motor Berbasis Cloud",
                        "deskripsi_sistem": "Sistem ERP mini untuk toko suku cadang dengan modul prediksi stok barang automatik.",
                    }

                    if not PengajuanKP.objects.filter(
                        mahasiswa=mahasiswa_2,
                        judul_diajukan=payload_mandiri["judul_diajukan"],
                    ).exists():
                        PengajuanService.create_via_factory(
                            tipe="mandiri", data=payload_mandiri, user=mahasiswa_2
                        )
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"-> Berhasil seed JALUR MANDIRI untuk {mahasiswa_2.nama_lengkap} (Status: DRAFT)"
                            )
                        )
                        count += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"=== Seeding Selesai! Berhasil menambahkan {count} data pengajuan baru ==="
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Terjadi kesalahan saat seeding: {str(e)}")
            )
