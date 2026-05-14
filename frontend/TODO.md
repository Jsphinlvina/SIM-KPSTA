# TODO - Sidebar per Role (Mahasiswa & Dosen)

- [ ] Buat `frontend/app/mahasiswa/layout.tsx` yang membungkus `children` dengan Sidebar untuk role mahasiswa
- [x] Buat `frontend/app/dosen/layout.tsx` yang membungkus `children` dengan Sidebar untuk role dosen
- [x] Buat `frontend/app/mahasiswa/layout.tsx` yang membungkus `children` dengan Sidebar untuk role mahasiswa

- [ ] Update `frontend/app/mahasiswa/jadwal-bimbingan/page.tsx` untuk menghapus wrapper & import Sidebar (tinggal konten saja)



- [ ] Update `frontend/app/mahasiswa/list-topik/page.tsx` untuk menghapus wrapper & import Sidebar
- [x] Update `frontend/app/dosen/dashboard/page.tsx` untuk menghapus wrapper & import Sidebar

- [ ] Update `frontend/app/dosen/approval/page.tsx` untuk menghapus wrapper & import Sidebar
- [ ] Update `frontend/app/dosen/penawaran-topik/page.tsx` agar tidak membuat wrapper sidebar ganda
- [ ] Update `frontend/app/dosen/penawaran-topik/offer-template.tsx` agar tidak menerima `sidebar` sebagai parameter, karena layout dosen sudah menanganinya
- [ ] Jalankan build/lint untuk memastikan tidak ada error TypeScript/ESLint

