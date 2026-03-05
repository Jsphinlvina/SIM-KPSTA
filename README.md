# SIM-KPSTA  
## Sistem Pengajuan Topik Kerja Praktik dan Tugas Akhir

SIM-KPSTA adalah sistem informasi terintegrasi yang dirancang untuk mengelola proses pengajuan topik Kerja Praktik (KP) dan Skripsi/Tugas Akhir (STA/TA) secara digital, terstruktur, dan transparan di lingkungan program studi.

Sistem ini dikembangkan untuk menggantikan proses manual berbasis Excel dan pengelolaan dokumen terpisah, sehingga administrasi akademik menjadi lebih efisien dan terdokumentasi dengan baik.

---

## 📌 Latar Belakang

Proses pengajuan topik KP/TA dan distribusi dosen pembimbing pada banyak program studi masih dilakukan secara manual, seperti:

- Pengelolaan topik dan kuota dosen menggunakan Excel  
- Distribusi pembimbing tidak terdokumentasi secara terpusat  
- Jadwal bimbingan dan sidang dicatat secara manual  
- Dokumen KP/TA dikelola melalui platform terpisah  

SIM-KPSTA hadir sebagai solusi terintegrasi untuk mengatasi permasalahan tersebut.

---

## 🎯 Tujuan Sistem

- Menyediakan platform digital untuk pengajuan dan penawaran topik KP/TA  
- Mendukung proses penentuan dosen pembimbing secara terstruktur  
- Mengelola jadwal bimbingan dan sidang secara sistematis  
- Menyimpan dokumen akademik secara terpusat  
- Menyediakan dashboard monitoring distribusi pembimbing  
- Menghasilkan laporan dan statistik akademik  

---

## 👥 Target Pengguna

- Mahasiswa  
- Dosen  
- Koordinator KP/TA  
- Ketua Program Studi  
- Administrator Akademik  

---

## 🚀 Fitur Utama

### 1. Autentikasi dan Hak Akses
Login berbasis peran (*role-based access control*) untuk menjaga keamanan dan integritas data akademik.

### 2. Penawaran Topik oleh Dosen
Dosen dapat menambahkan topik KP/TA beserta kuota mahasiswa secara langsung melalui sistem.

### 3. Pengajuan Topik oleh Mahasiswa
Mahasiswa dapat:
- Memilih topik yang ditawarkan dosen  
- Mengajukan topik mandiri  

### 4. Penentuan Dosen Pembimbing (Manual Terintegrasi)
Proses diskusi dan pencatatan keputusan penetapan pembimbing terdokumentasi dalam sistem.

### 5. Dashboard Distribusi Pembimbing
Monitoring internal beban dosen dan distribusi mahasiswa bimbingan.

### 6. Manajemen Jadwal Bimbingan
Pengajuan dan persetujuan jadwal bimbingan secara digital.

### 7. Deteksi Konflik Jadwal
Sistem mendeteksi benturan jadwal bimbingan atau sidang secara otomatis.

### 8. Upload Dokumen KP/TA
Pengelolaan proposal, laporan, dan revisi dalam satu platform terpusat.

### 9. Manajemen Sidang
Pengaturan jadwal sidang dan informasi pelaksanaan secara terintegrasi.

### 10. Notifikasi Otomatis
Pemberitahuan perubahan status pengajuan, dokumen, dan sidang.

### 11. Riwayat dan Arsip Digital
Seluruh proses tersimpan sebagai arsip akademik yang terdokumentasi.

### 12. Laporan dan Statistik KP/TA
Penyajian data statistik untuk monitoring dan pengambilan keputusan akademik.

---

## 🏗 Arsitektur Sistem

Sistem dikembangkan menggunakan arsitektur berbasis REST API:

- **Front-end**: React.js  
- **Back-end**: Django + Django REST Framework  
- **Database**: PostgreSQL  


---

## 🧩 Design Patterns yang Digunakan

Sistem ini menerapkan beberapa design pattern untuk memastikan skalabilitas dan keteraturan struktur kode:

- Singleton Pattern  
- Factory Pattern  
- State Pattern  
- Observer Pattern  
- Template Method Pattern  
- Chain of Responsibility Pattern  
- Model-View-Controller (MVC)  

Pemilihan pattern disesuaikan dengan kebutuhan sistem akademik yang memiliki alur persetujuan berjenjang, pengelolaan status dinamis, dan kebutuhan notifikasi otomatis.

---

## 🛠 Teknologi yang Digunakan

### Back-end
- Python  
- Django  
- Django REST Framework  

### Front-end
- React.js  

### Database
- PostgreSQL  

---

## 📊 Manfaat Implementasi

- Mengurangi proses administrasi manual  
- Meningkatkan transparansi distribusi pembimbing  
- Mempermudah monitoring akademik  
- Mendukung audit dan arsip digital  
- Meningkatkan efisiensi koordinasi antar pihak  

---

## 👨‍💻 Tim Pengembang

- Joshua Subianto  
- Josephine Alvina Luwia  
- Jayden Marvel Ethanael  

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan akademik dan pengembangan sistem informasi internal program studi.
