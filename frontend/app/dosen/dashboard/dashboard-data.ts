/**
 * Singleton Pattern (FE):
 * DashboardDataManager is the single instance managing
 * the dosen's bimbingan data. Populated once from the API
 * and reused across the session without re-fetching.
 */

export type BimbinganEntry = {
  id: number;
  bimbinganId: number;
  name: string;
  nim: string;
  topic: string;
};

export class DashboardDataManager {
  private static instance: DashboardDataManager;
  private entries: BimbinganEntry[] = [];
  private pendingCount: number = 0;

  private constructor() {}

  static getInstance(): DashboardDataManager {
    if (!DashboardDataManager.instance) {
      DashboardDataManager.instance = new DashboardDataManager();
    }
    return DashboardDataManager.instance;
  }

  loadFromAPI(bimbinganList: any[], pendingCount: number): void {
    this.entries = bimbinganList.map((b: any, i: number) => ({
      id: i + 1,
      bimbinganId: b.bimbingan_id,
      name: b.mahasiswa_detail?.nama_lengkap ?? "Mahasiswa",
      nim: b.mahasiswa_detail?.nim_nip ?? "-",
      topic:
        b.pengajuan_detail?.judul_diajukan ??
        b.pengajuan_detail?.topik_detail?.judul ??
        "-",
    }));
    this.pendingCount = pendingCount;
  }

  getEntries(): BimbinganEntry[] {
    return [...this.entries];
  }

  getActiveCount(): number {
    return this.entries.length;
  }

  getPendingCount(): number {
    return this.pendingCount;
  }
}
