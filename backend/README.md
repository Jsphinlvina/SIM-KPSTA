# Progress Report - SIM-KPSTA Backend

## Minggu 2: Fitur 1 (Autentikasi & Hak Akses) 

### 1. Database & Migrasi (PostgreSQL)
* **Status:** Berhasil terhubung via `.env` dan sinkronisasi skema bersih.
* **Hasil:** Model kustom `Users` berhasil di-migrate ke database fisik PostgreSQL tanpa conflict history.

### 2. Implementasi Komponen (Layered Architecture)
* **Model (`apps/authentication/models.py`):** Mengimplementasikan kustom `Users` model dengan atribut `user_id`, `nim_nip`, `nama_lengkap`, `email`, dan `role` (mahasiswa, dosen, koordinator, kaprodi, admin).
* **Pattern (`apps/authentication/patterns/auth_session.py`):** Menggunakan **Singleton Pattern** untuk manajemen konsistensi state sesi pengguna.
* **Permissions (`core/permissions.py`):** Mengimplementasikan *Role-Based Access Control* (RBAC) via `IsMahasiswa`, `IsDosen`, `IsKoordinator`, `IsKaprodi`, dan `IsAdmin`.
* **Service (`apps/authentication/services/auth_service.py`):** Logika bisnis autentikasi murni (enkripsi sandi & integrasi *Simple JWT*).
* **Serializer (`apps/authentication/serializers.py`):** Validasi format data input kredensial masuk (`nim_nip` & `password`).
* **Views/Controller (`apps/authentication/views.py`):** Endpoint kontroler (`login`, `logout`, `me`) terintegrasi dengan utilitas standard response proyek (`ok` & `fail`).

### 3. Konfigurasi Sistem (`config/settings.py` & `urls.py`)
* Mengonfigurasi `AUTH_USER_MODEL = 'authentication.Users'`.
* Menambahkan custom payload `USER_ID_FIELD: 'user_id'` pada arsitektur paket `SIMPLE_JWT` agar selaras dengan primary key model kustom.
* Mendaftarkan routing API global pada endpoint `/api/v1/auth/`.

### 4. Hasil Pengujian (Django Shell)
* Simulasi pembuatan user dan pemanggilan `AuthService.authenticate_user` berjalan sukses dengan output data pengguna serta *access_token* & *refresh_token* JWT yang valid.