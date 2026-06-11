# Plan Pengerjaan Backend Dev B – SIM-KP

## 🎯 Konteks Proyek

**Nama Aplikasi:** SIM-KP (Sistem Pengajuan Topik Kerja Praktik)

**Tujuan:** Sistem terintegrasi untuk pengajuan topik KP, penugasan dosen pembimbing, manajemen jadwal bimbingan, dan administrasi sidang di S1 Teknik Informatika Universitas Kristen Maranatha.

**Mata Kuliah:** Pola Desain Perangkat Lunak (PDPL)

**Anggota Tim:** 4 orang (2 frontend, 2 backend). Saya pegang **Backend Dev B**.

## 🛠️ Teknologi yang Digunakan

- **Backend:** Python + Django + Django REST Framework
- **Database:** PostgreSQL (via Django ORM)
- **Frontend (dikerjakan tim lain):** React + Next.js
- **Komunikasi:** REST API (Django REST → Next.js)

## 👥 Pembagian Tim Backend

**Dev A (partner saya) mengerjakan:**
- Fitur 1: Autentikasi & Hak Akses
- Fitur 2: Penawaran Topik Dosen
- Fitur 3: Pengajuan Topik Mahasiswa
- Fitur 4: Penentuan Dosen Pembimbing
- Fitur 5: Dashboard Distribusi Pembimbing
- Fitur 12: Laporan & Statistik

**Dev B (saya) mengerjakan:**
- Fitur 6: Manajemen Jadwal Bimbingan
- Fitur 7: Deteksi Ketersediaan Jadwal
- Fitur 8: Upload Dokumen KP
- Fitur 9: Manajemen Sidang
- Fitur 10: Notifikasi Otomatis
- Fitur 11: Riwayat & Arsip Digital

---

## 📁 Struktur Folder Project Lengkap

```
sim-kp-backend/
├── manage.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
│
├── config/                          # Settings utama Django
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py                      # Root URL config (include semua app urls)
│   ├── wsgi.py
│   └── asgi.py
│
├── core/                            # Shared utilities (dipakai semua app)
│   ├── __init__.py
│   ├── permissions.py               # Permission classes (dari Dev A)
│   ├── responses.py                 # Standard response format helper
│   ├── exceptions.py                # Custom exceptions
│   └── pagination.py                # Custom pagination
│
└── apps/                            # Semua Django apps
    │
    ├── schedule/                    # 🔵 FITUR 6, 7, 9 (Dev B) — gabung karena share ScheduleEvent
    │   ├── __init__.py
    │   ├── apps.py
    │   ├── admin.py
    │   ├── models.py                # ScheduleEvent
    │   ├── serializers.py
    │   ├── urls.py                  # guidance/*, availability/*, defense/*
    │   ├── views.py                 # GuidanceViews, AvailabilityViews, DefenseViews
    │   ├── services/
    │   │   ├── __init__.py
    │   │   ├── guidance_service.py          # Logika jadwal bimbingan (Fitur 6)
    │   │   ├── availability_service.py      # Logika deteksi ketersediaan (Fitur 7)
    │   │   └── defense_service.py           # Logika sidang (Fitur 9)
    │   ├── patterns/
    │   │   ├── __init__.py
    │   │   ├── guidance_schedule_manager.py    # Singleton (Fitur 6)
    │   │   ├── availability_detector.py        # Singleton (Fitur 7)
    │   │   ├── defense_schedule_manager.py     # Subject Observer (Fitur 9)
    │   │   ├── state/                          # State Pattern untuk Fitur 6
    │   │   │   ├── __init__.py
    │   │   │   ├── schedule_state.py           # Interface
    │   │   │   ├── scheduled_state.py
    │   │   │   ├── ongoing_state.py
    │   │   │   ├── completed_state.py
    │   │   │   └── cancelled_state.py
    │   │   └── observers/                      # Observer Pattern untuk Fitur 9
    │   │       ├── __init__.py
    │   │       ├── defense_subject.py          # Interface
    │   │       ├── defense_observer.py         # Interface
    │   │       ├── student_defense_observer.py
    │   │       ├── coordinator_defense_observer.py
    │   │       └── lecturer_defense_observer.py
    │   ├── migrations/
    │   └── tests/
    │       ├── __init__.py
    │       ├── test_models.py
    │       ├── test_views.py
    │       ├── test_singleton.py
    │       ├── test_state.py
    │       └── test_observer.py
    │
    ├── document/                    # 🔵 FITUR 8 (Dev B)
    │   ├── __init__.py
    │   ├── apps.py
    │   ├── admin.py
    │   ├── models.py                # Document
    │   ├── serializers.py
    │   ├── urls.py                  # document/*
    │   ├── views.py                 # DocumentViewSet
    │   ├── services/
    │   │   ├── __init__.py
    │   │   ├── document_service.py
    │   │   └── file_storage_service.py     # Helper upload file ke storage
    │   ├── patterns/
    │   │   ├── __init__.py
    │   │   ├── template_method/
    │   │   │   ├── __init__.py
    │   │   │   ├── abstract_document_uploader.py
    │   │   │   ├── proposal_uploader.py
    │   │   │   └── final_report_uploader.py
    │   │   └── state/
    │   │       ├── __init__.py
    │   │       ├── document_state.py            # Interface
    │   │       ├── draft_state.py
    │   │       ├── uploaded_state.py
    │   │       ├── verified_state.py
    │   │       └── rejected_state.py
    │   ├── migrations/
    │   └── tests/
    │       ├── __init__.py
    │       ├── test_models.py
    │       ├── test_views.py
    │       ├── test_template_method.py
    │       └── test_state.py
    │
    ├── notification/                # 🔵 FITUR 10 (Dev B) — DIPAKAI BANYAK FITUR LAIN
    │   ├── __init__.py
    │   ├── apps.py
    │   ├── admin.py
    │   ├── models.py                # Notification
    │   ├── serializers.py
    │   ├── urls.py                  # notification/*
    │   ├── views.py                 # NotificationViewSet
    │   ├── events.py                # Event constants
    │   ├── services/
    │   │   ├── __init__.py
    │   │   ├── notification_service.py      # Wrapper untuk dipanggil dari fitur lain
    │   │   ├── email_service.py             # Helper kirim email
    │   │   └── push_service.py              # Helper push notification
    │   ├── patterns/
    │   │   ├── __init__.py
    │   │   ├── notification_manager.py      # Singleton + Subject (Observer)
    │   │   ├── notification_subject.py      # Interface
    │   │   └── observers/
    │   │       ├── __init__.py
    │   │       ├── notification_observer.py # Interface
    │   │       ├── email_notif_observer.py
    │   │       ├── push_notif_observer.py
    │   │       └── in_app_notif_observer.py
    │   ├── migrations/
    │   └── tests/
    │       ├── __init__.py
    │       ├── test_models.py
    │       ├── test_views.py
    │       ├── test_observer.py
    │       └── test_notification_manager.py
    │
    └── archive/                     # 🗂️ FITUR 11 (Dev B)
        ├── __init__.py
        ├── apps.py
        ├── admin.py
        ├── models.py                # ArchiveRecord
        ├── serializers.py
        ├── urls.py                  # archive/*
        ├── views.py                 # ArchiveViewSet
        ├── services/
        │   ├── __init__.py
        │   ├── archive_service.py
        │   └── search_service.py            # Helper pencarian arsip
        ├── patterns/
        │   ├── __init__.py
        │   └── state/
        │       ├── __init__.py
        │       ├── archive_state.py         # Interface
        │       ├── active_state.py
        │       ├── archived_state.py
        │       └── deleted_state.py
        ├── migrations/
        └── tests/
            ├── __init__.py
            ├── test_models.py
            ├── test_views.py
            └── test_state.py
```

### Penjelasan Setiap Folder

| Folder/File | Fungsi |
|-------------|--------|
| `config/` | Setting Django utama, root URL config |
| `core/` | Utilitas yang dipakai semua app (permission, response format, dll) |
| `apps/<nama>/models.py` | Definisi model database (Django ORM) |
| `apps/<nama>/serializers.py` | DRF serializer (convert model → JSON) |
| `apps/<nama>/views.py` | Controller layer (ViewSet/APIView) |
| `apps/<nama>/urls.py` | Routing per app, include ke `config/urls.py` |
| `apps/<nama>/services/` | Business logic terpisah dari views (SRP) |
| `apps/<nama>/patterns/` | Implementasi design pattern per fitur |
| `apps/<nama>/tests/` | Unit test |
| `apps/<nama>/migrations/` | Database migrations |

### ✅ Kenapa Fitur 6, 7, 9 Digabung di App `schedule`?

Ketiganya share model `ScheduleEvent`:
- **Fitur 6 (Jadwal Bimbingan)** → record dengan `event_type = 'guidance'`
- **Fitur 7 (Deteksi Ketersediaan)** → baca dari `ScheduleEvent` untuk cek konflik
- **Fitur 9 (Sidang)** → record dengan `event_type = 'defense'`

Kalau dipisah jadi 3 app, akan terjadi konflik di model + circular import. Jadi digabung dalam 1 app `schedule` dengan 3 service terpisah dan 3 endpoint group terpisah.

---

## 🗄️ Tabel Database yang Saya Pegang

Berdasarkan ERD:

### 1. SCHEDULE_EVENT (di `apps/schedule/models.py`)
```
- id (PK)
- bimbingan_aktif_id (FK ke BimbinganAktif, dibuat Dev A)
- lecturer_id (FK ke Users)
- student_id (FK ke Users, nullable)
- coordinator_id (FK ke Users, nullable)
- event_type (String) — 'guidance' atau 'defense'
- date (Date)
- time (Time)
- location (String)
- meeting_link (String)
- notes (Text)
- status (String) — 'scheduled', 'ongoing', 'completed', 'cancelled'
- created_at / updated_at (DateTime)
```

### 2. DOCUMENT (di `apps/document/models.py`)
```
- id (PK)
- bimbingan_aktif_id (FK ke BimbinganAktif, dibuat Dev A)
- uploaded_by (FK ke Users)
- document_type (String) — 'proposal', 'final_report'
- file_name (String)
- file_url (String)
- status (String) — 'draft', 'uploaded', 'verified', 'rejected'
- rejection_reason (Text)
- created_at / updated_at (DateTime)
```

### 3. NOTIFICATION (di `apps/notification/models.py`)
```
- id (PK)
- user_id (FK ke Users, dibuat Dev A)
- notification_type (String)
- message (Text)
- is_read (Boolean)
- created_at (DateTime)
```

### 4. ARCHIVE_RECORD (di `apps/archive/models.py`)
```
- id (PK)
- source_type (String) — 'document' atau 'schedule'
- source_id (Integer)
- title (String)
- student_id (FK ke Users, nullable)
- lecturer_id (FK ke Users, nullable)
- state (String) — 'active', 'archived', 'deleted'
- created_at / updated_at (DateTime)
```

**Tabel yang dipakai sebagai FK dari Dev A:**
- `Users` → untuk relasi notifikasi ke user
- `BimbinganAktif` → sebagai induk dari jadwal & dokumen

---

## 📦 FITUR 6: MANAJEMEN JADWAL BIMBINGAN

### Lokasi: `apps/schedule/`

### Deskripsi
Mahasiswa mengajukan jadwal bimbingan, lalu dosen menyetujui atau menolak.

### Design Pattern
1. **Singleton Pattern** → `GuidanceScheduleManager` hanya 1 instance
2. **State Pattern** → Status jadwal mengikuti siklus hidup yang berubah-ubah

### Mapping Class ke File

| Class | File Path |
|-------|-----------|
| `ScheduleEvent` (Model) | `apps/schedule/models.py` |
| `GuidanceScheduleManager` (Singleton) | `apps/schedule/patterns/guidance_schedule_manager.py` |
| `ScheduleState` (Interface) | `apps/schedule/patterns/state/schedule_state.py` |
| `ScheduledState` | `apps/schedule/patterns/state/scheduled_state.py` |
| `OngoingState` | `apps/schedule/patterns/state/ongoing_state.py` |
| `CompletedState` | `apps/schedule/patterns/state/completed_state.py` |
| `CancelledState` | `apps/schedule/patterns/state/cancelled_state.py` |
| Jadwal logic | `apps/schedule/services/guidance_service.py` |
| Serializers | `apps/schedule/serializers.py` |
| Views | `apps/schedule/views.py` |
| Routes | `apps/schedule/urls.py` |

### REST API Endpoints
```
POST   /api/guidance/                          → buat jadwal baru
GET    /api/guidance/                          → list semua jadwal
GET    /api/guidance/<id>/                     → detail jadwal
PUT    /api/guidance/<id>/                     → update jadwal
DELETE /api/guidance/<id>/                     → hapus jadwal
POST   /api/guidance/<id>/start/               → trigger start (Dijadwalkan → Berlangsung)
POST   /api/guidance/<id>/cancel/              → trigger cancel
POST   /api/guidance/<id>/complete/            → trigger complete
POST   /api/guidance/<id>/reschedule/          → trigger reschedule
GET    /api/guidance/by-bimbingan/<id>/        → jadwal per bimbingan aktif
```

---

## 📦 FITUR 7: DETEKSI KETERSEDIAAN JADWAL

### Lokasi: `apps/schedule/` (gabung dengan Fitur 6)

### Design Pattern
1. **Singleton Pattern** → `ScheduleAvailabilityDetector` 1 instance dengan cache

### Mapping Class ke File

| Class | File Path |
|-------|-----------|
| `ScheduleAvailabilityDetector` (Singleton) | `apps/schedule/patterns/availability_detector.py` |
| Ketersediaan logic | `apps/schedule/services/availability_service.py` |
| Views | `apps/schedule/views.py` |
| Routes | `apps/schedule/urls.py` |

### REST API Endpoints
```
GET /api/availability/check/?lecturer_id=X&date=Y&time=Z   → cek availability
GET /api/availability/slots/?lecturer_id=X&date=Y           → list slot kosong
GET /api/availability/conflicts/?lecturer_id=X&date=Y       → list konflik
```

---

## 📦 FITUR 8: UPLOAD DOKUMEN KP

### Lokasi: `apps/document/`

### Design Pattern
1. **Template Method Pattern** → alur upload standar dengan langkah yang dapat di-override
2. **State Pattern** → siklus hidup dokumen

### Mapping Class ke File

| Class | File Path |
|-------|-----------|
| `Document` (Model) | `apps/document/models.py` |
| `AbstractDocumentUploader` | `apps/document/patterns/template_method/abstract_document_uploader.py` |
| `ProposalUploader` | `apps/document/patterns/template_method/proposal_uploader.py` |
| `FinalReportUploader` | `apps/document/patterns/template_method/final_report_uploader.py` |
| `DocumentState` (Interface) | `apps/document/patterns/state/document_state.py` |
| `DraftState` | `apps/document/patterns/state/draft_state.py` |
| `UploadedState` | `apps/document/patterns/state/uploaded_state.py` |
| `VerifiedState` | `apps/document/patterns/state/verified_state.py` |
| `RejectedState` | `apps/document/patterns/state/rejected_state.py` |
| Dokumen logic | `apps/document/services/document_service.py` |
| File storage helper | `apps/document/services/file_storage_service.py` |
| Serializers | `apps/document/serializers.py` |
| Views | `apps/document/views.py` |
| Routes | `apps/document/urls.py` |

### REST API Endpoints
```
POST   /api/document/upload/proposal/         → upload proposal
POST   /api/document/upload/laporan-akhir/    → upload laporan akhir
GET    /api/document/                         → list dokumen
GET    /api/document/<id>/                    → detail dokumen
POST   /api/document/<id>/verify/             → verifikasi (untuk dosen)
POST   /api/document/<id>/reject/             → tolak dokumen
POST   /api/document/<id>/revise/             → submit revisi
GET    /api/document/by-bimbingan/<id>/       → dokumen per bimbingan
```

---

## 📦 FITUR 9: MANAJEMEN SIDANG

### Lokasi: `apps/schedule/` (gabung dengan Fitur 6 & 7)

### Design Pattern
1. **Observer Pattern** → Notifikasi otomatis ke pihak terkait saat jadwal sidang berubah

### Mapping Class ke File

| Class | File Path |
|-------|-----------|
| `DefenseScheduleManager` (Subject) | `apps/schedule/patterns/defense_schedule_manager.py` |
| `DefenseSubject` (Interface) | `apps/schedule/patterns/observers/defense_subject.py` |
| `DefenseObserver` (Interface) | `apps/schedule/patterns/observers/defense_observer.py` |
| `StudentDefenseObserver` | `apps/schedule/patterns/observers/student_defense_observer.py` |
| `CoordinatorDefenseObserver` | `apps/schedule/patterns/observers/coordinator_defense_observer.py` |
| `LecturerDefenseObserver` | `apps/schedule/patterns/observers/lecturer_defense_observer.py` |
| Sidang logic | `apps/schedule/services/defense_service.py` |
| Views | `apps/schedule/views.py` |
| Routes | `apps/schedule/urls.py` |

### REST API Endpoints
```
POST   /api/defense/                       → buat jadwal sidang
GET    /api/defense/                       → list semua sidang
GET    /api/defense/<id>/                  → detail sidang
PUT    /api/defense/<id>/                  → update jadwal/link sidang
DELETE /api/defense/<id>/                  → batal sidang
GET    /api/defense/by-mahasiswa/<id>/     → sidang per mahasiswa
```

---

## 📦 FITUR 10: NOTIFIKASI OTOMATIS

### Lokasi: `apps/notification/`

### Design Pattern
1. **Observer Pattern** → pengguna menerima notifikasi otomatis saat status berubah

### Mapping Class ke File

| Class | File Path |
|-------|-----------|
| `Notification` (Model) | `apps/notification/models.py` |
| `NotificationSubject` (Interface) | `apps/notification/patterns/notification_subject.py` |
| `NotificationManager` (Singleton + Subject) | `apps/notification/patterns/notification_manager.py` |
| `NotificationObserver` (Interface) | `apps/notification/patterns/observers/notification_observer.py` |
| `EmailNotificationObserver` | `apps/notification/patterns/observers/email_notif_observer.py` |
| `PushNotificationObserver` | `apps/notification/patterns/observers/push_notif_observer.py` |
| `InAppNotificationObserver` | `apps/notification/patterns/observers/in_app_notif_observer.py` |
| Notifikasi logic | `apps/notification/services/notification_service.py` |
| Email helper | `apps/notification/services/email_service.py` |
| Push helper | `apps/notification/services/push_service.py` |
| Serializers | `apps/notification/serializers.py` |
| Views | `apps/notification/views.py` |
| Routes | `apps/notification/urls.py` |

### Cara Fitur Lain Pakai NotificationManager:
```python
from apps.notification.services import notification_service

notification_service.notify('STATUS_PENGAJUAN_BERUBAH', {
    'user_id': mahasiswa.id,
    'message': 'Pengajuan Anda telah disetujui',
    'type': 'pengajuan'
})
```

### REST API Endpoints
```
GET    /api/notification/                      → list notifikasi user yang login
GET    /api/notification/unread/               → notif yang belum dibaca
POST   /api/notification/<id>/mark-as-read/    → tandai sudah dibaca
POST   /api/notification/mark-all-as-read/     → tandai semua sudah dibaca
DELETE /api/notification/<id>/                 → hapus notifikasi
```

---

## 📦 FITUR 11: RIWAYAT DAN ARSIP DIGITAL

### Lokasi: `apps/archive/`

### Design Pattern
1. **State Pattern** → status arsip berubah-ubah (active, archived, deleted)

### Mapping Class ke File

| Class | File Path |
|-------|-----------|
| `ArchiveRecord` (Model) | `apps/archive/models.py` |
| `ArchiveState` (Interface) | `apps/archive/patterns/state/archive_state.py` |
| `ActiveState` | `apps/archive/patterns/state/active_state.py` |
| `ArchivedState` | `apps/archive/patterns/state/archived_state.py` |
| `DeletedState` | `apps/archive/patterns/state/deleted_state.py` |
| Arsip logic | `apps/archive/services/archive_service.py` |
| Search helper | `apps/archive/services/search_service.py` |
| Serializers | `apps/archive/serializers.py` |
| Views | `apps/archive/views.py` |
| Routes | `apps/archive/urls.py` |

### REST API Endpoints
```
GET    /api/archive/                          → list semua arsip
GET    /api/archive/by-mahasiswa/<id>/        → arsip per mahasiswa
GET    /api/archive/by-dosen/<id>/            → arsip per dosen
GET    /api/archive/search/?keyword=X         → cari arsip
POST   /api/archive/<id>/archive/             → archive
POST   /api/archive/<id>/restore/             → restore dari arsip
DELETE /api/archive/<id>/                     → soft delete
```

---

## 🔄 Konvensi Layered Architecture

```
Request masuk → urls.py (routing)
             ↓
          views.py (controller, validasi request)
             ↓
          services/*.py (business logic)
             ↓
          patterns/*.py (design pattern implementation)
             ↓
          models.py (database access)
             ↓
          serializers.py (format response)
             ↓
Response keluar
```

**Aturan ketat:**
- `views.py` **tidak boleh** akses `models.py` langsung → harus lewat `services/`
- `services/` **tidak boleh** return Response object → kembalikan data Python biasa
- `patterns/` **tidak boleh** akses Django request/response → pure logic
- `core/` boleh dipakai semua, tapi `core/` tidak boleh import dari `apps/`

---

## 🗓️ Urutan Pengerjaan (Roadmap)

### Minggu 1 – Setup & Skeleton Notifikasi
1. Setup project Django + DRF + PostgreSQL bersama Dev A
2. Buat folder app: `schedule`, `document`, `notification`, `archive`
3. **Skeleton `NotificationManager`** → minimal punya method `get_instance()` dan `notify_all()`
4. Mulai **Fitur 7 (Deteksi Ketersediaan)**

### Minggu 2 – Notifikasi Penuh
1. **Fitur 10 (Notifikasi Otomatis) LENGKAP** di `apps/notification/`
2. Test integrasi `NotificationManager` dengan event dummy

### Minggu 3 – Jadwal & Dokumen (CRITICAL)
1. **Tunggu Dev A push migration `BimbinganAktif`**
2. **Fitur 6 (Jadwal Bimbingan)** di `apps/schedule/`
3. **Fitur 8 (Upload Dokumen KP)** di `apps/document/`

### Minggu 4 – Sidang & Arsip
1. **Fitur 9 (Manajemen Sidang)** di `apps/schedule/`
2. **Fitur 11 (Riwayat & Arsip Digital)** di `apps/archive/`
3. Final testing & dokumentasi API

---

## 🤝 Koordinasi dengan Dev A

### Yang Harus Saya Tunggu dari Dev A:
1. **Migration `Users`** → dibutuhkan hari 1 untuk model `Notification`
2. **Migration `BimbinganAktif`** → dibutuhkan minggu 3 untuk model `ScheduleEvent` dan `Document`
3. **Permission classes** dari `core/permissions.py`

### Yang Saya Sediakan untuk Dev A:
1. **`NotificationManager`** → skeleton di minggu 1, lengkap di minggu 2

---

## ✅ Checklist Selesai per Fitur

Setiap fitur dianggap selesai jika:
- [ ] Model Django dibuat di `apps/<nama>/models.py` dan ter-migrate ke PostgreSQL
- [ ] Class-class sesuai class diagram diimplementasi di folder `patterns/`
- [ ] Business logic ada di `services/`, bukan di views
- [ ] Design pattern benar-benar diterapkan (bukan komentar doang)
- [ ] REST API endpoint berfungsi dan bisa dites via Postman/Thunder Client
- [ ] Serializer DRF dibuat di `apps/<nama>/serializers.py`
- [ ] Routes terdaftar di `apps/<nama>/urls.py` dan ter-include di `config/urls.py`
- [ ] Permission/role check sesuai spec (mahasiswa, dosen, koordinator, kaprodi)
- [ ] Notifikasi terpicu ke fitur 10 saat ada perubahan status (jika applicable)
- [ ] Unit test minimal di `apps/<nama>/tests/` untuk happy path
