/**
 * Design Patterns (FE):
 *
 * 1. Observer Pattern:
 *    - IDistribusiObserver: interface bagi komponen yang memantau perubahan data.
 *    - DistribusiDataManager (Subject): publisher yang memberitahu observer ketika ada mahasiswa baru yang ditugaskan.
 *
 * 2. Singleton Pattern:
 *    - DistribusiDataManager: satu-satunya instance penyimpan data beban bimbingan dosen di seluruh aplikasi.
 */

import api from "../../api";

export interface IDistribusiObserver {
  onDistribusiChanged(data: DosenDistribusi[]): void;
}

export interface DosenDistribusi {
  id: number;
  nama: string;
  jumlahMahasiswa: number;
  mahasiswaList: string[];
}

export class DistribusiDataManager {
  private static instance: DistribusiDataManager | null = null;
  private observers: IDistribusiObserver[] = [];
  private data: DosenDistribusi[] = [];

  private constructor() {
    // Inisialisasi mock data beban bimbingan dosen
    this.data = [
      {
        id: 1,
        nama: "Budi Santoso, S.Kom, M.T",
        jumlahMahasiswa: 8,
        mahasiswaList: [
          "Andi Saputra",
          "Eka Pratama",
          "Fajar Siddiq",
          "Gita Cahyani",
          "Hendra Kusuma",
          "Indah Lestari",
          "Joko Susilo",
          "Kiki Amalia",
        ],
      },
      {
        id: 2,
        nama: "Siti Aisyah, S.Si, M.Kom",
        jumlahMahasiswa: 6,
        mahasiswaList: [
          "Citra Lestari",
          "Lutfi Hakim",
          "Murni Sari",
          "Nabila Putri",
          "Oki Setiawan",
          "Putri Rahayu",
        ],
      },
      {
        id: 3,
        nama: "Rizky Maulana, M.Sc",
        jumlahMahasiswa: 5,
        mahasiswaList: [
          "Rian Aditama",
          "Santi Widiastuti",
          "Taufik Hidayat",
          "Ulfa Fauziah",
          "Vina Amelia",
        ],
      },
      {
        id: 4,
        nama: "Andi Setiawan, M.T",
        jumlahMahasiswa: 3,
        mahasiswaList: ["Wahyu Hidayat", "Yusuf Subagja", "Zainal Abidin"],
      },
    ];
  }

  public static getInstance(): DistribusiDataManager {
    if (!DistribusiDataManager.instance) {
      DistribusiDataManager.instance = new DistribusiDataManager();
    }
    return DistribusiDataManager.instance;
  }

  // --- OBSERVER REGISTRATION ---

  public registerObserver(observer: IDistribusiObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public removeObserver(observer: IDistribusiObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.onDistribusiChanged([...this.data]);
    }
  }

  // --- DATA MUTATORS ---

  public getDistribusiData(): DosenDistribusi[] {
    return this.data;
  }

  public async loadFromApi(): Promise<void> {
    const res = await api.get("/dashboard/distribusi/");
    if (res.data.success) {
      const distribusiDict: Record<string, any> = res.data.data;
      this.data = Object.entries(distribusiDict).map(([dosen_id, info]) => ({
        id: parseInt(dosen_id),
        nama: info.nama_dosen,
        jumlahMahasiswa: info.jumlah_mahasiswa,
        mahasiswaList: (info.mahasiswa as any[]).map((m) => m.nama),
      }));
      this.notifyObservers();
    }
  }

  public addMahasiswaToDosen(dosenNama: string, mahasiswaNama: string): void {
    const target = this.data.find(
      (d) => d.nama.toLowerCase().includes(dosenNama.toLowerCase()) || 
             dosenNama.toLowerCase().includes(d.nama.toLowerCase())
    );

    if (target) {
      // Pastikan mahasiswa tidak ditambahkan dua kali
      if (!target.mahasiswaList.includes(mahasiswaNama)) {
        target.mahasiswaList.push(mahasiswaNama);
        target.jumlahMahasiswa = target.mahasiswaList.length;
        console.log(`[Singleton] Menambahkan mahasiswa ${mahasiswaNama} ke pembimbing ${dosenNama}.`);
        this.notifyObservers();
      }
    }
  }
}
