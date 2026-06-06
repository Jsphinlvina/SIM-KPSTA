/**
 * Design Patterns (FE):
 * 
 * 1. State Pattern:
 *    - IMahasiswaState: interface untuk mewakili status penentuan pembimbing.
 *    - MenungguPembimbingState: keadaan awal sebelum dosen pembimbing ditentukan.
 *    - PembimbingDitetapkanState: keadaan akhir setelah dosen pembimbing ditentukan.
 *    - MahasiswaRowContext: class context yang menyimpan reference ke state saat ini.
 * 
 * 2. Chain of Responsibility Pattern:
 *    - Mahasiswa -> Koordinator -> Dosen -> Kaprodi.
 *    - Memproses verifikasi kelayakan akademik dan kesiapan dosen pembimbing secara bertahap.
 */

// --- STATE PATTERN ---

export interface IMahasiswaState {
  getStatusName(): "menunggu pembimbing" | "pembimbing ditetapkan";
  assignPembimbing(row: MahasiswaRowContext, pembimbingId: number): void;
}

export class MenungguPembimbingState implements IMahasiswaState {
  getStatusName() {
    return "menunggu pembimbing" as const;
  }

  assignPembimbing(row: MahasiswaRowContext, pembimbingId: number): void {
    row.pembimbingId = pembimbingId;
    row.transitionTo(new PembimbingDitetapkanState());
  }
}

export class PembimbingDitetapkanState implements IMahasiswaState {
  getStatusName() {
    return "pembimbing ditetapkan" as const;
  }

  assignPembimbing(row: MahasiswaRowContext, pembimbingId: number): void {
    // Sudah ditetapkan, ganti pembimbing jika diijinkan
    row.pembimbingId = pembimbingId;
  }
}

export class MahasiswaRowContext {
  public id: number;
  public nama: string;
  public topik: string;
  public jenisTopik: "dosen" | "mandiri";
  public pembimbingId?: number;
  private state: IMahasiswaState;

  constructor(
    id: number,
    nama: string,
    topik: string,
    jenisTopik: "dosen" | "mandiri",
    pembimbingId?: number
  ) {
    this.id = id;
    this.nama = nama;
    this.topik = topik;
    this.jenisTopik = jenisTopik;
    this.pembimbingId = pembimbingId;

    if (pembimbingId) {
      this.state = new PembimbingDitetapkanState();
    } else {
      this.state = new MenungguPembimbingState();
    }
  }

  public transitionTo(state: IMahasiswaState): void {
    this.state = state;
  }

  public getStatus(): "menunggu pembimbing" | "pembimbing ditetapkan" {
    return this.state.getStatusName();
  }

  public assign(pembimbingId: number): void {
    this.state.assignPembimbing(this, pembimbingId);
  }

  public toJSON() {
    return {
      id: this.id,
      nama: this.nama,
      topik: this.topik,
      jenisTopik: this.jenisTopik,
      pembimbingId: this.pembimbingId,
      status: this.getStatus(),
    };
  }
}

// --- CHAIN OF RESPONSIBILITY PATTERN ---

export interface ApprovalChainContext {
  mahasiswaId: number;
  namaMahasiswa: string;
  topik: string;
  pembimbingId?: number;
  approvedByMahasiswa: boolean;
  assignedByKoordinator: boolean;
  acceptedByDosen: boolean;
  confirmedByKaprodi: boolean;
  logs: string[];
}

export abstract class ApprovalHandler {
  private nextHandler: ApprovalHandler | null = null;

  public setNext(handler: ApprovalHandler): ApprovalHandler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(context: ApprovalChainContext): ApprovalChainContext {
    this.process(context);
    if (this.nextHandler) {
      return this.nextHandler.handle(context);
    }
    return context;
  }

  protected abstract process(context: ApprovalChainContext): void;
}

// 1. MahasiswaSubmitter
export class MahasiswaRequestSubmitter extends ApprovalHandler {
  protected process(context: ApprovalChainContext): void {
    context.approvedByMahasiswa = true;
    context.logs.push("[Mahasiswa] Mengajukan topik bimbingan: " + context.topik);
  }
}

// 2. KoordinatorAssigner
export class KoordinatorAssigner extends ApprovalHandler {
  protected process(context: ApprovalChainContext): void {
    if (context.pembimbingId) {
      context.assignedByKoordinator = true;
      context.logs.push("[Koordinator] Memverifikasi pengajuan & menetapkan Dosen Pembimbing ID: " + context.pembimbingId);
    } else {
      context.logs.push("[Koordinator] Tertunda: Dosen Pembimbing belum dipilih.");
    }
  }
}

// 3. DosenAccepter
export class DosenAccepter extends ApprovalHandler {
  protected process(context: ApprovalChainContext): void {
    if (context.assignedByKoordinator) {
      context.acceptedByDosen = true; // Auto-accept / simulasi persetujuan dosen
      context.logs.push("[Dosen] Menerima mahasiswa bimbingan.");
    }
  }
}

// 4. KaprodiApprover (Optional, final)
export class KaprodiApprover extends ApprovalHandler {
  protected process(context: ApprovalChainContext): void {
    if (context.acceptedByDosen) {
      context.confirmedByKaprodi = true;
      context.logs.push("[Kaprodi] Mengesahkan penugasan dosen pembimbing. Alur Selesai.");
    }
  }
}

// helper untuk menjalankan chain
export function runApprovalChain(
  mahasiswaId: number,
  namaMahasiswa: string,
  topik: string,
  pembimbingId?: number
): ApprovalChainContext {
  const context: ApprovalChainContext = {
    mahasiswaId,
    namaMahasiswa,
    topik,
    pembimbingId,
    approvedByMahasiswa: false,
    assignedByKoordinator: false,
    acceptedByDosen: false,
    confirmedByKaprodi: false,
    logs: [],
  };

  const submitter = new MahasiswaRequestSubmitter();
  const coordinator = new KoordinatorAssigner();
  const dosen = new DosenAccepter();
  const kaprodi = new KaprodiApprover();

  // Membentuk Chain
  submitter.setNext(coordinator).setNext(dosen).setNext(kaprodi);

  // Jalankan request melalui Chain
  return submitter.handle(context);
}
