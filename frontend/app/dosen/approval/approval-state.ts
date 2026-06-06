/**
 * Design Patterns (FE):
 * 1. State Pattern:
 *    - IBimbinganState (Interface State)
 *    - PendingState, ApprovedState, RejectedState (Concrete States)
 *    - BimbinganRequest (Context)
 * 2. Singleton Pattern:
 *    - BimbinganScheduleManager (Singleton Data Manager)
 */

export interface IBimbinganState {
  getStatusName(): "Pending" | "Disetujui" | "Ditolak";
  approve(request: BimbinganRequest): void;
  reject(request: BimbinganRequest): void;
}

export class PendingState implements IBimbinganState {
  getStatusName() {
    return "Pending" as const;
  }

  approve(request: BimbinganRequest): void {
    request.transitionTo(new ApprovedState());
  }

  reject(request: BimbinganRequest): void {
    request.transitionTo(new RejectedState());
  }
}

export class ApprovedState implements IBimbinganState {
  getStatusName() {
    return "Disetujui" as const;
  }

  approve(request: BimbinganRequest): void {
    // No-op or already approved
  }

  reject(request: BimbinganRequest): void {
    // No-op or already approved
  }
}

export class RejectedState implements IBimbinganState {
  getStatusName() {
    return "Ditolak" as const;
  }

  approve(request: BimbinganRequest): void {
    // No-op or already rejected
  }

  reject(request: BimbinganRequest): void {
    // No-op or already rejected
  }
}

export class BimbinganRequest {
  public id: number;
  public student: string;
  public nim: string;
  public date: string;
  public time: string;
  public notes: string;
  private state: IBimbinganState;

  constructor(
    id: number,
    student: string,
    nim: string,
    date: string,
    time: string,
    notes: string,
    status: "Pending" | "Disetujui" | "Ditolak" = "Pending"
  ) {
    this.id = id;
    this.student = student;
    this.nim = nim;
    this.date = date;
    this.time = time;
    this.notes = notes;

    // Initialize state object based on status string
    if (status === "Disetujui") {
      this.state = new ApprovedState();
    } else if (status === "Ditolak") {
      this.state = new RejectedState();
    } else {
      this.state = new PendingState();
    }
  }

  public transitionTo(state: IBimbinganState): void {
    this.state = state;
  }

  public approve(): void {
    this.state.approve(this);
  }

  public reject(): void {
    this.state.reject(this);
  }

  public getStatus(): "Pending" | "Disetujui" | "Ditolak" {
    return this.state.getStatusName();
  }

  // Helper serialization method
  public toJSON() {
    return {
      id: this.id,
      student: this.student,
      nim: this.nim,
      date: this.date,
      time: this.time,
      notes: this.notes,
      status: this.getStatus(),
    };
  }
}

// Singleton Pattern Manager
export class BimbinganScheduleManager {
  private static instance: BimbinganScheduleManager | null = null;
  private requests: BimbinganRequest[] = [];

  private constructor() {
    // Seed initial mock data
    this.requests = [
      new BimbinganRequest(
        1,
        "Andi Saputra",
        "2272001",
        "12 Mei 2026",
        "10:00 - 11:30 WIB",
        "Konsultasi draft laporan KP Bab 3 Metodologi Penelitian.",
        "Pending"
      ),
      new BimbinganRequest(
        2,
        "Budi Hartono",
        "2272002",
        "15 Mei 2026",
        "13:30 - 15:00 WIB",
        "Review revisi kuesioner evaluasi kurikulum akademik.",
        "Pending"
      ),
      new BimbinganRequest(
        3,
        "Citra Lestari",
        "2272003",
        "18 Mei 2026",
        "09:00 - 10:30 WIB",
        "Diskusi hasil rancangan arsitektur IoT dan database server.",
        "Disetujui"
      ),
    ];
  }

  public static getInstance(): BimbinganScheduleManager {
    if (!BimbinganScheduleManager.instance) {
      BimbinganScheduleManager.instance = new BimbinganScheduleManager();
    }
    return BimbinganScheduleManager.instance;
  }

  public getRequests(): BimbinganRequest[] {
    return this.requests;
  }

  public approveRequest(id: number): void {
    const req = this.requests.find((r) => r.id === id);
    if (req) {
      req.approve();
    }
  }

  public rejectRequest(id: number): void {
    const req = this.requests.find((r) => r.id === id);
    if (req) {
      req.reject();
    }
  }
}
