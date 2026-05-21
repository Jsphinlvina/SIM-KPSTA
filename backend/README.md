# Progress Report - SIM-KPSTA Fullstack Development

## 📚 Minggu 3: Fitur 2 (Penawaran Topik oleh Dosen)

Kami telah berhasil mengimplementasikan sistem penawaran topik proyek KP/STA oleh dosen dengan mengadopsi arsitektur berlapis murni yang dipadukan dengan desain pola perilaku (*Behavioral Design Pattern*).

### 1. Sinkronisasi Skema Database Baru (PostgreSQL)
Aplikasi baru bernama `topik` telah didaftarkan pada sistem dengan dua struktur tabel utama:
* **`PeriodeSemester` (`periode_semester`)**: Mengelola data periode akademik. Aturan bisnis mengunci agar hanya boleh ada **satu** periode yang berstatus `'aktif'` dalam satu waktu.
* **`Topik` (`topik`)**: Menyimpan data penawaran topik yang dibuat oleh user ber-role `dosen`, berelasi ke tabel `Users` dan `PeriodeSemester`.

### 2. Implementasi Desain Pola: Template Method Pattern
Untuk menstandardisasi alur bisnis pembuatan topik agar seragam, aman, dan mematuhi prinsip *Open/Closed Principle*, alur kerja diisolasi ke dalam folder `apps/topik/patterns/`:
* **`AbstractTopikPenawaran`**: Kelas abstrak yang mengunci *skeleton* (kerangka) algoritma utama melalui metode `proses_penawaran()`.
* **`TopikPenawaranDosen`**: Implementasi konkrit yang mendefinisikan langkah validasi keunikan judul (`validate_topik`), penguncian otomatis ke periode akademik yang aktif (`assign_periode`), dan penyimpanan ke database via ORM.
* **Hook Method (`notify_mahasiswa`)**: Menyediakan gerbang (*skeleton gateway*) untuk diintegrasikan dengan `NotifikasiService` di masa mendatang.

### 3. Pemisahan Layer Bisnis & Controller API
* **`TopikService` & `PeriodeService`**: Bertindak sebagai *Service Layer* yang memisahkan logika bisnis internal dari fungsionalitas HTTP request/response (SRP).
* **`TopikViewSet` & `PeriodeSemesterViewSet`**: Controller API yang mengembalikan format respons terstandardisasi (`ok` dan `fail`) serta menerapkan proteksi RBAC (Hanya `dosen` yang bisa *create* topik, hanya `admin` yang bisa *create* periode).

### 4. Gerbang REST API Endpoints yang Terbentuk
* `POST /api/v1/topik/` $\rightarrow$ Membuat penawaran topik baru (Khusus Dosen).
* `GET /api/v1/topik/` $\rightarrow$ Menampilkan seluruh daftar topik.
* `GET /api/v1/topik/available/` $\rightarrow$ Menampilkan rincian topik yang kuotanya masih tersedia.
* `GET /api/v1/periode-semester/active/` $\rightarrow$ Mengambil data periode akademik yang sedang berjalan.

### 5. Hasil Pengujian Otomatis (Automated Unit Testing)
* **Status:** **PASSED (OK)**
* **Command:** `python manage.py test apps.topik.tests -t .`
* **Skenario Tes yang Berhasil Dilalui (3/3 Skenario):**
    1.  `test_proses_penawaran_sukses`: Membuktikan skrip sanggup menyimpan data dengan benar dan otomatis mengikat ke rute periode aktif.
    2.  `test_proses_penawaran_gagal_kuota_negatif`: Memastikan sistem mendeteksi dan menolak input kuota berangka minus atau `0`.
    3.  `test_proses_penawaran_gagal_judul_duplikat`: Membuktikan keandalan sistem dalam memblokir dosen yang mencoba mendaftarkan judul topik yang sama agar tidak terjadi redundansi data.