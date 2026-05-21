# Document (Fitur 8)

Upload dan verifikasi dokumen KP (proposal dan laporan akhir).

## Model `Document`

| Field | Tipe | Keterangan |
|-------|------|------------|
| `bimbingan_aktif_id` | IntegerField | **Decoupled, belum FK ke `BIMBINGAN_AKTIF`.** Lihat kontrak di bawah. |
| `uploaded_by` | IntegerField | id user (mahasiswa) pengunggah |
| `document_type` | CharField | `proposal` / `final_report` |
| `file_name`, `file_url` | CharField | metadata file hasil simpan ke storage |
| `status` | CharField | nama state: `draft` / `uploaded` / `verified` / `rejected` |
| `rejection_reason` | TextField | alasan saat status `rejected` |

### Kontrak untuk Dev A

`bimbingan_aktif_id` dan `uploaded_by` disimpan sebagai **`IntegerField`**, bukan ForeignKey — sama dengan keputusan di app `schedule` dan `notification`. Kontrak ini **fix**: kirim integer PK saja. Di-tighten jadi FK lewat migration baru saat model Dev A sudah stabil.

## Design pattern

- **Template Method** — `AbstractDocumentUploader` (`patterns/template_method/`). Method `upload()` adalah algoritma tetap: `validate_file()` → `save_file()` → `save_to_db()` → `notify_verifier()`. Hanya `validate_file()` yang di-override subclass: `ProposalUploader` (pdf/doc/docx, maks 5 MB) dan `FinalReportUploader` (pdf, maks 10 MB).
- **State** — 4 state di `patterns/state/`: `DraftState`, `UploadedState`, `VerifiedState`, `RejectedState`.

Transisi state:

```
draft --upload--> uploaded --verify--> verified
                  uploaded --reject--> rejected
rejected --revise--> draft (lalu upload ulang)
```

`verified` bersifat final. Transisi tidak valid melempar `InvalidStateTransitionError`.

## Endpoint

| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/v1/document/` | list semua dokumen |
| POST | `/api/v1/document/upload/proposal/` | upload proposal (multipart) |
| POST | `/api/v1/document/upload/final-report/` | upload laporan akhir (multipart) |
| GET | `/api/v1/document/<id>/` | detail |
| POST | `/api/v1/document/<id>/verify/` | uploaded → verified |
| POST | `/api/v1/document/<id>/reject/` | uploaded → rejected (body: `reason`) |
| POST | `/api/v1/document/<id>/revise/` | rejected → draft |
| GET | `/api/v1/document/by-bimbingan/<id>/` | dokumen per bimbingan aktif |

Body upload (multipart/form-data): `bimbingan_aktif_id`, `uploaded_by`, `file`.

Setiap upload memicu notifikasi `DOCUMENT_UPLOADED`, verifikasi memicu `DOCUMENT_VERIFIED`, penolakan memicu `DOCUMENT_REJECTED` lewat Fitur 10.
