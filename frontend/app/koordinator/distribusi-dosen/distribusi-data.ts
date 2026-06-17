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

export interface MahasiswaBimbingan {
  nama: string;
  nim: string;
  topik: string;
}

export interface DosenDistribusi {
  id: number;
  nama: string;
  jumlahMahasiswa: number;
  mahasiswaList: MahasiswaBimbingan[];
}

export class DistribusiDataManager {
  private static instance: DistribusiDataManager | null = null;
  private observers: IDistribusiObserver[] = [];
  private data: DosenDistribusi[] = [];

  private constructor() {}

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

  // --- DATA ACCESSORS ---

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
        mahasiswaList: (info.mahasiswa as any[]).map((m) => ({
          nama: m.nama,
          nim: m.nim,
          topik: m.topik,
        })),
      }));
      this.notifyObservers();
    }
  }

  public addMahasiswaToDosen(dosenNama: string, mahasiswaNama: string): void {
    const target = this.data.find(
      (d) =>
        d.nama.toLowerCase().includes(dosenNama.toLowerCase()) ||
        dosenNama.toLowerCase().includes(d.nama.toLowerCase())
    );

    if (target) {
      const alreadyExists = target.mahasiswaList.some((m) => m.nama === mahasiswaNama);
      if (!alreadyExists) {
        target.mahasiswaList.push({ nama: mahasiswaNama, nim: "", topik: "" });
        target.jumlahMahasiswa = target.mahasiswaList.length;
        this.notifyObservers();
      }
    }
  }
}
