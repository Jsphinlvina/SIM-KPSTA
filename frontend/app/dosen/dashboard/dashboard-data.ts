/**
 * Singleton Pattern (FE):
 * DashboardDataManager adalah satu-satunya instance yang mengelola
 * data distribusi mahasiswa bimbingan dosen.
 *
 * Keuntungan Singleton di sini:
 * - Data konsisten di seluruh komponen tanpa re-fetch
 * - Satu sumber kebenaran (single source of truth) untuk distribusi bimbingan
 * - Perubahan data (approve/reject) langsung tersinkron di semua consumer
 */

export type Student = {
  id: number;
  name: string;
  nim: string;
  topic: string;
  status: "Aktif" | "Pending" | "Selesai";
  progress: number;
};

export class DashboardDataManager {
  private static instance: DashboardDataManager;

  // Data internal — hanya bisa diubah lewat method
  private students: Student[] = [
    {
      id: 1,
      name: "Andi Saputra",
      nim: "2272001",
      topic: "Sistem Informasi Kerja Praktik Sekolah Tinggi",
      status: "Aktif",
      progress: 75,
    },
    {
      id: 2,
      name: "Budi Hartono",
      nim: "2272002",
      topic: "Penerapan AI untuk Kurikulum Edukasi Interaktif",
      status: "Pending",
      progress: 10,
    },
    {
      id: 3,
      name: "Citra Lestari",
      nim: "2272003",
      topic: "Website Real-time Monitoring IoT Laboratorium Mandiri",
      status: "Aktif",
      progress: 40,
    },
  ];

  // Singleton: konstruktor private — tidak bisa di-new dari luar
  private constructor() {}

  // Singleton: satu-satunya akses ke instance
  static getInstance(): DashboardDataManager {
    if (!DashboardDataManager.instance) {
      DashboardDataManager.instance = new DashboardDataManager();
    }
    return DashboardDataManager.instance;
  }

  // ─── Read Methods ───────────────────────────────────────────────────────────
  getStudents(): Student[] {
    return [...this.students];
  }

  getActiveCount(): number {
    return this.students.filter((s) => s.status === "Aktif").length;
  }

  getPendingCount(): number {
    return this.students.filter((s) => s.status === "Pending").length;
  }

  getTotalCount(): number {
    return this.students.length;
  }

  // ─── Write Methods ──────────────────────────────────────────────────────────
  updateProgress(id: number, progress: number): void {
    this.students = this.students.map((s) =>
      s.id === id ? { ...s, progress } : s
    );
  }

  updateStatus(id: number, status: Student["status"]): void {
    this.students = this.students.map((s) =>
      s.id === id ? { ...s, status } : s
    );
  }
}
