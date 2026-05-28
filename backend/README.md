# Progress Report - SIM-KPSTA Backend Development

## 🗓️ Minggu 4: Backend Dev B (Fitur 6, 7, 8, 9, 10, 11)

Mengimplementasikan manajemen jadwal bimbingan, deteksi ketersediaan jadwal, upload dokumen KP, manajemen sidang, notifikasi otomatis, dan riwayat & arsip digital. Seluruh fitur mengikuti arsitektur berlapis murni (`urls → views → services → patterns → models`) dan menerapkan *Design Pattern* sesuai class diagram.

### 1. Skema Database (PostgreSQL)
* **`ScheduleEvent` (`schedule_scheduleevent`)**: Tabel jadwal bersama yang dipakai **Fitur 6** (`event_type='guidance'`) dan **Fitur 9** (`event_type='defense'`). Referensi user (`bimbingan_aktif_id`, `lecturer_id`, `student_id`, `coordinator_id`) disimpan sebagai `IntegerField` *decoupled* — bukan ForeignKey — agar Dev A cukup mengirim PK integer.
* **`Document` (`document_document`)**: Metadata dokumen KP (proposal / laporan akhir), URL file, dan status verifikasi.
* **`Notification` (`notification_notification`)**: Notifikasi in-app per user.
* **`ArchiveRecord` (`archive_archiverecord`)**: Arsip digital yang mereferensikan dokumen/jadwal lewat `source_type` + `source_id`.

### 2. Implementasi Desain Pola per Fitur
* **Fitur 6 — Jadwal Bimbingan**: *Singleton* (`GuidanceScheduleManager`) + *State Pattern* 4 status (`Scheduled → Ongoing → Completed`, atau `Cancelled`). Transisi tidak valid melempar `InvalidStateTransitionError`.
* **Fitur 7 — Deteksi Ketersediaan**: *Singleton* (`ScheduleAvailabilityDetector`) dengan cache per `(dosen, tanggal)`, membaca `ScheduleEvent` nyata untuk mendeteksi bentrok jam kerja.
* **Fitur 8 — Upload Dokumen**: *Template Method* (`AbstractDocumentUploader` → `ProposalUploader` / `FinalReportUploader`) untuk alur validasi-simpan-notifikasi yang seragam, dipadu *State Pattern* 4 status (`Draft / Uploaded / Verified / Rejected`).
* **Fitur 9 — Manajemen Sidang**: *Observer Pattern* — `DefenseScheduleManager` (Subject) memberi tahu `StudentDefenseObserver`, `CoordinatorDefenseObserver`, dan `LecturerDefenseObserver` setiap sidang dibuat/diubah/dibatalkan; tiap observer mengirim notifikasi via Fitur 10.
* **Fitur 10 — Notifikasi Otomatis**: *Singleton* + *Observer* — `NotificationManager` menyiarkan event ke `EmailNotificationObserver`, `PushNotificationObserver`, dan `InAppNotificationObserver`.
* **Fitur 11 — Riwayat & Arsip**: *State Pattern* 3 status (`Active / Archived / Deleted`) dengan pencarian via Django `Q` objects.

### 3. Pemisahan Layer Bisnis & Proteksi RBAC
* **Service Layer** (`*_service.py`): seluruh logika bisnis dipisah dari controller; `patterns/` murni tanpa akses request/response; `views.py` hanya memformat respons standar (`ok` / `fail` / `created`).
* **RBAC**: setiap endpoint Dev B memakai `JWTAuthentication` (per-view) + *permission class* berbasis role sesuai spesifikasi tiap fitur. Contoh: hanya **mahasiswa** yang dapat mengajukan bimbingan & mengunggah dokumen; hanya **dosen** yang dapat memverifikasi/menolak dokumen serta memulai/menyelesaikan bimbingan; hanya **koordinator** yang dapat mengatur jadwal sidang.

### 4. Gerbang REST API Endpoints yang Terbentuk
**Fitur 6 — Jadwal Bimbingan (`/api/guidance/`)**
* `POST /api/guidance/` $\rightarrow$ Ajukan jadwal bimbingan (Mahasiswa).
* `GET /api/guidance/`, `GET /api/guidance/<id>/`, `GET /api/guidance/by-bimbingan/<id>/` $\rightarrow$ Lihat jadwal (login).
* `PUT|DELETE /api/guidance/<id>/` $\rightarrow$ Ubah/hapus jadwal (Mahasiswa/Dosen).
* `POST /api/guidance/<id>/start/` & `/complete/` (Dosen); `/cancel/` & `/reschedule/` (Mahasiswa/Dosen).

**Fitur 7 — Deteksi Ketersediaan (`/api/availability/`)**
* `GET /api/availability/check/`, `/slots/`, `/conflicts/` $\rightarrow$ Cek ketersediaan dosen (login).

**Fitur 8 — Upload Dokumen (`/api/document/`)**
* `POST /api/document/upload/proposal/` & `/upload/laporan-akhir/` $\rightarrow$ Unggah dokumen (Mahasiswa).
* `POST /api/document/<id>/verify/` & `/reject/` (Dosen); `/revise/` (Mahasiswa).
* `GET /api/document/`, `/<id>/`, `/by-bimbingan/<id>/` $\rightarrow$ Lihat dokumen (login).

**Fitur 9 — Manajemen Sidang (`/api/defense/`)**
* `POST /api/defense/`, `PUT|DELETE /api/defense/<id>/` $\rightarrow$ Kelola sidang & link meeting (Koordinator).
* `GET /api/defense/`, `/<id>/`, `/by-mahasiswa/<id>/` $\rightarrow$ Lihat sidang (login).

**Fitur 10 — Notifikasi (`/api/notification/`)**
* `GET /api/notification/` & `/unread/`; `POST /api/notification/<id>/mark-as-read/` & `/mark-all-as-read/`; `DELETE /api/notification/<id>/` (login, hanya notifikasi milik user).

**Fitur 11 — Riwayat & Arsip (`/api/archive/`)**
* `GET /api/archive/`, `/<id>/`, `/search/?keyword=`, `/by-mahasiswa/<id>/`, `/by-dosen/<id>/`.
* `POST /api/archive/`, `/<id>/archive/`, `/<id>/restore/`, `DELETE /api/archive/<id>/` (login).

### 5. Hasil Verifikasi
* **`python manage.py check`**: bersih (0 issue).
* **`python manage.py makemigrations --check`**: *No changes detected* untuk `schedule`, `document`, `archive` — model konsisten dengan migration; `migrate` sukses (SQLite + skema PostgreSQL `sim_kp` dikonfirmasi via `inspectdb`).
* **Smoke test pattern & service**: transisi State (termasuk penolakan transisi tidak valid), deteksi bentrok jadwal, validasi ekstensi file, dan pemicuan Observer (3 notifikasi per event sidang) — seluruhnya lulus.
* **Uji endpoint via `runserver` + curl**: seluruh endpoint keenam fitur berfungsi, termasuk `409` (bentrok jadwal), `400` (transisi/validasi tidak valid), serta proteksi RBAC `401` (tanpa token) dan `403` (role tidak sesuai).
