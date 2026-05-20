# Progress Report - SIM-KPSTA Backend

## Minggu 2: Fitur 1 (Autentikasi & Hak Akses)
### 1. Database & Migrasi (PostgreSQL)
* **Status:** Berhasil terhubung via `.env` dan sinkronisasi skema bersih.
* **Hasil:** Model kustom `Users` berhasil di-migrate ke database fisik PostgreSQL tanpa conflict history.

### 2. Implementasi Komponen Komplet (Layered Architecture)
* **Model (`apps/authentication/models.py`):** Mengimplementasikan kustom `Users` model dengan atribut `user_id`, `nim_nip`, `nama_lengkap`, `email`, dan `role` (mahasiswa, dosen, koordinator, kaprodi, admin).
* **Admin Visual (`apps/authentication/admin.py`):** Mendaftarkan `CustomUserAdmin` agar model pengguna dapat dikelola penuh secara visual via Django Admin Panel.
* **Pattern (`apps/authentication/patterns/auth_session.py`):** Menggunakan **Singleton Pattern** untuk manajemen konsistensi state sesi pengguna lokal backend.
* **Permissions (`core/permissions.py`):** Mengimplementasikan *Role-Based Access Control* (RBAC) via `IsMahasiswa`, `IsDosen`, `IsKoordinator`, `IsKaprodi`, dan `IsAdmin`.
* **Services Layer (`apps/authentication/services/`):** * `auth_service.py` untuk logika bisnis autentikasi murni (enkripsi sandi & integrasi *Simple JWT*).
  * `user_service.py` untuk manajemen data pengguna (CRUD oleh Admin).
* **Serializers (`apps/authentication/serializers.py`):** Validasi data input kredensial masuk (`LoginSerializer`) dan penanganan format data profil pengguna (`UserSerializer`).
* **Views/Controller (`apps/authentication/views.py`):** Endpoint kontroler komplit (`login`, `logout`, `me`, `register`, `list-users`, `manage_user`) terintegrasi dengan utilitas standard response proyek (`ok` & `fail`).

### 3. Konfigurasi Sistem (`config/settings.py` & `urls.py`)
* Mengonfigurasi `AUTH_USER_MODEL = 'authentication.Users'`.
* Menambahkan custom payload `USER_ID_FIELD: 'user_id'` pada arsitektur paket `SIMPLE_JWT` agar selaras dengan primary key model kustom.
* Mendaftarkan routing API global pada endpoint `/api/v1/auth/`, `/api/v1/auth/refresh/`, dan `/api/v1/users/`.

### 4. Hasil Pengujian Otomatis (Unit Testing)
* **Status:** **PASSED (OK)**
* **Command:** `python manage.py test apps.authentication`
* **Cakupan Tes (4 Skenario Berhasil):**
  * `test_models.py`: Validasi keberhasilan pembuatan user dan kecocokan enkripsi password hash di level ORM.
  * `test_views.py`: Validasi hit HTTP POST ke endpoint API Login dan memastikan token akses JWT digenerate dengan benar.
  * `test_auth_session.py`: Membuktikan keandalan *Singleton Pattern* (kesamaan identitas objek memori) serta mekanisme set/clear session pengguna.