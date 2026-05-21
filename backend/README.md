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

## Minggu 1: Setup Proyek & Skeleton Notifikasi
### 1. Inisialisasi Proyek
* **Status:** Selesai.
* **Hasil:** Setup project Django + Django REST Framework + PostgreSQL bersama Dev A, beserta konfigurasi koneksi via `.env`.

### 2. Struktur App Bagian Dev B
* **App dibuat (`apps/`):** Membuat empat app sesuai pembagian — `schedule`, `document`, `notification`, dan `archive` — masing-masing dengan struktur layered architecture (`services/`, `patterns/`).

### 3. Skeleton Notifikasi (Prioritas Awal)
* **Pattern (`apps/notification/patterns/notification_manager.py`):** Membuat skeleton `NotificationManager` lebih dulu (method `get_instance()` dan `notify_all()`) supaya Dev A bisa langsung meng-import-nya sejak awal tanpa menunggu implementasi penuh.

### 4. Rintisan Fitur Deteksi Ketersediaan
* **Pattern (`apps/schedule/patterns/availability_detector.py`):** Memulai logika deteksi slot kosong dan konflik jadwal menggunakan data dummy, agar logika dapat diuji sebelum model database tersedia.

## Minggu 2: Fitur Notifikasi
### 1. Model & Migrasi
* **Status:** Berhasil di-migrate ke PostgreSQL.
* **Model (`apps/notification/models.py`):** `Notification` dengan field `user_id` (disimpan sebagai `IntegerField`, sengaja belum FK ke `Users` agar tidak terikat perubahan model Dev A), `notification_type`, `message`, `is_read`, dan `created_at`.

### 2. Implementasi Pattern (Observer + Singleton)
* **Subject (`apps/notification/patterns/notification_manager.py`):** `NotificationManager` sebagai **Singleton** sekaligus **Subject** dari Observer Pattern.
* **Observer (`apps/notification/patterns/observers/`):** Tiga observer konkret — `InAppNotificationObserver` (menyimpan ke database), `EmailNotificationObserver`, dan `PushNotificationObserver` (email dan push masih log-only untuk MVP).
* **Registrasi (`apps/notification/apps.py`):** Ketiga observer di-attach otomatis ke manager saat app siap melalui `ready()`.

### 3. Service Layer & Endpoint
* **Service (`apps/notification/services/notification_service.py`):** Menyediakan `notify(event, data)` sebagai satu titik masuk yang dipanggil fitur lain, beserta logika list dan penandaan baca.
* **Events (`apps/notification/events.py`):** Kumpulan konstanta nama event supaya pemanggil tidak hardcode string event.
* **Views/Controller (`apps/notification/views.py`):** Endpoint komplet — list, unread, mark-as-read, mark-all-as-read, dan delete notifikasi.

### 4. Konfigurasi Database
* **Status:** Selesai.
* **Hasil:** Database proyek dipindahkan dari SQLite ke PostgreSQL dan seluruh migrasi berjalan bersih.

## Minggu 3: Fitur Jadwal Bimbingan & Fitur Dokumen
### 1. Model & Migrasi
* **Status:** Berhasil di-migrate ke PostgreSQL.
* **Model (`apps/schedule/models.py`):** `ScheduleEvent` — dipakai bersama untuk jadwal bimbingan dan sidang, dibedakan field `event_type`. Field `bimbingan_aktif_id` dan `lecturer_id` disimpan sebagai `IntegerField` (*decoupled*, kontrak tetap untuk Dev A).
* **Model (`apps/document/models.py`):** `Document` dengan field `bimbingan_aktif_id`, `uploaded_by`, `document_type`, metadata file, dan `status`.

### 2. Fitur Jadwal Bimbingan (Singleton + State)
* **Pattern (`apps/schedule/patterns/guidance_schedule_manager.py`):** `GuidanceScheduleManager` sebagai **Singleton** pengelola siklus hidup jadwal.
* **Pattern (`apps/schedule/patterns/state/`):** **State Pattern** dengan empat state — `ScheduledState`, `OngoingState`, `CompletedState`, dan `CancelledState`.
* **Service (`apps/schedule/services/guidance_service.py`):** Logika bisnis pembuatan jadwal, transisi state, dan pemicuan notifikasi.
* **Views/Controller (`apps/schedule/views.py`):** Endpoint CRUD jadwal beserta aksi transisi `start`, `complete`, `cancel`, dan `reschedule`.

### 3. Fitur Deteksi Ketersediaan (Refactor)
* **Pattern (`apps/schedule/patterns/availability_detector.py`):** `ScheduleAvailabilityDetector` di-refactor dari data dummy menjadi membaca `ScheduleEvent` asli, dengan cache per `(lecturer_id, date)`.

### 4. Fitur Dokumen (Template Method + State)
* **Pattern (`apps/document/patterns/template_method/`):** `AbstractDocumentUploader` sebagai **Template Method** dengan alur upload tetap; dua subclass `ProposalUploader` dan `FinalReportUploader` hanya meng-override aturan validasi file.
* **Pattern (`apps/document/patterns/state/`):** **State Pattern** dengan empat state — `DraftState`, `UploadedState`, `VerifiedState`, dan `RejectedState`.
* **Services Layer (`apps/document/services/`):**
  * `document_service.py` untuk logika bisnis dokumen dan transisi state.
  * `file_storage_service.py` untuk penyimpanan file ke storage (pemisahan tanggung jawab).
* **Views/Controller (`apps/document/views.py`):** Endpoint upload proposal dan laporan akhir, verifikasi, penolakan, serta revisi dokumen.

### 5. Hasil Pengujian
* **Status:** **PASSED (OK)**
* **Command:** `python manage.py check`, `python manage.py migrate`, serta uji endpoint via `runserver` + `curl`.
* **Cakupan Pengujian:**
  * Migrasi kedua app berhasil di-apply di SQLite maupun PostgreSQL.
  * *Singleton*, *State*, dan *Template Method* terverifikasi melalui smoke test pada layer service.
  * Endpoint jadwal bimbingan dan dokumen diuji lewat HTTP: pembuatan, transisi state, deteksi konflik jadwal, upload *multipart*, validasi file, verifikasi/penolakan, dan pemicuan notifikasi lintas-fitur.