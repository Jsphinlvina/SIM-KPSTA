from django.core.management.base import BaseCommand
from apps.authentication.models import Users

class Command(BaseCommand):
    help = 'Menembak data dummy pengguna (Mahasiswa, Dosen, Koordinator) ke database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Memulai proses seeding data users...'))

        users_data = [
            {
                "nim_nip": "2272001",
                "email": "budi.mhs@maranatha.ac.id",
                "nama_lengkap": "Budi Mahasiswa",
                "role": "mahasiswa",
                "password": "password123"
            },
            {
                "nim_nip": "2272002",
                "email": "andi.mhs@maranatha.ac.id",
                "nama_lengkap": "Andi Pratama",
                "role": "mahasiswa",
                "password": "password123"
            },
            {
                "nim_nip": "72001",
                "email": "dr.budi@dosen.ac.id",
                "nama_lengkap": "Dr. Budi Dosen, M.T.",
                "role": "dosen",
                "password": "password123"
            },
            {
                "nim_nip": "72002",
                "email": "iwansuwandi@koordinator.ac.id",
                "nama_lengkap": "Iwan Suwandi, M.Sc. (Koordinator KP/STA)",
                "role": "koordinator",
                "password": "password123"
            },
            {
                "nim_nip": "999999",
                "email": "admin.sim@maranatha.ac.id",
                "nama_lengkap": "Super Admin SIM",
                "role": "admin",
                "password": "password123"
            }
        ]

        count = 0
        for data in users_data:
            if not Users.objects.filter(nim_nip=data["nim_nip"]).exists():
                Users.objects.create_user(
                    nim_nip=data["nim_nip"],
                    email=data["email"],
                    nama_lengkap=data["nama_lengkap"],
                    role=data["role"],
                    password=data["password"]
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully seeded user: {data["nim_nip"]} - {data["nama_lengkap"]}'))
                count += 1
            else:
                self.stdout.write(self.style.NOTICE(f'User {data["nim_nip"]} sudah terdaftar, skipping.'))

        self.stdout.write(self.style.SUCCESS(f'Selesai! Berhasil menambahkan {count} user baru ke database.'))