/**
 * Model (MVC) & Singleton Pattern:
 * AuthSessionManager menyimpan state login pengguna secara terpusat (single-source of truth)
 * dan menjamin hanya ada satu instance sesi aktif di aplikasi client-side.
 */

export interface UserSession {
  nim_nip: string;
  role: "mahasiswa" | "dosen" | "koordinator" | "admin" | "";
}

export class AuthSessionManager {
  private static instance: AuthSessionManager | null = null;
  private currentSession: UserSession = { nim_nip: "", role: "" };

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AuthSessionManager {
    if (!AuthSessionManager.instance) {
      AuthSessionManager.instance = new AuthSessionManager();
    }
    return AuthSessionManager.instance;
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const nim_nip = localStorage.getItem("nim_nip") || "";
      let role: UserSession["role"] = "";

      // Logika tebak role sederhana berdasarkan NIM/NIP atau dari local state
      if (token) {
        if (nim_nip.startsWith("227") || nim_nip.startsWith("247")) {
          role = "mahasiswa";
        } else if (nim_nip === "admin") {
          role = "admin";
        } else if (nim_nip === "72000" || nim_nip === "koordinator") {
          role = "koordinator";
        } else {
          role = "dosen";
        }
      }

      this.currentSession = { nim_nip, role };
    }
  }

  public setSession(nim_nip: string, token: string, role: UserSession["role"]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("nim_nip", nim_nip);
    }
    this.currentSession = { nim_nip, role };
  }

  public clearSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("nim_nip");
    }
    this.currentSession = { nim_nip: "", role: "" };
  }

  public getSession(): UserSession {
    return this.currentSession;
  }

  public isAuthenticated(): boolean {
    return this.currentSession.nim_nip !== "" && this.currentSession.role !== "";
  }
}
