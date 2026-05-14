# Notification (Fitur 10)

Notifikasi otomatis berbasis Observer pattern. Fitur lain memicu notifikasi lewat satu titik masuk.

## Cara memicu notifikasi dari fitur lain

```python
from apps.notification.services import notification_service
from apps.notification import events

notification_service.notify(events.SUBMISSION_STATUS_CHANGED, {
    'user_id': mahasiswa_id,
    'message': 'Pengajuan topik Anda telah disetujui',
    'type': 'pengajuan',
})
```

Isi `data` dict:

| key | wajib | keterangan |
|-----|-------|------------|
| `user_id` | ya | id user penerima (IntegerField, belum FK ke USERS) |
| `message` | ya | isi pesan untuk user |
| `type` | tidak | kategori notifikasi; kalau kosong dipakai nama event |

Saat `notify()` dipanggil, 3 observer jalan: simpan ke DB (in-app), kirim email, kirim push. Email & push masih log-only untuk MVP.

## Event yang tersedia

Daftar lengkap di `apps/notification/events.py`. Pakai konstanta, jangan hardcode string event.

## Endpoint

| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/v1/notification/?user_id=` | list notifikasi user |
| GET | `/api/v1/notification/unread/?user_id=` | notifikasi belum dibaca |
| POST | `/api/v1/notification/<id>/mark-as-read/?user_id=` | tandai sudah dibaca |
| POST | `/api/v1/notification/mark-all-as-read/?user_id=` | tandai semua sudah dibaca |
| DELETE | `/api/v1/notification/<id>/?user_id=` | hapus notifikasi |

Parameter `user_id` lewat query param selama auth belum ada; begitu auth aktif, endpoint otomatis pakai user yang login.
