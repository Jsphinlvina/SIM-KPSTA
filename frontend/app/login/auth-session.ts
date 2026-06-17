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
      const storedRole = localStorage.getItem("role") as UserSession["role"] | null;
      const role: UserSession["role"] = token && storedRole ? storedRole : "";
      this.currentSession = { nim_nip, role };
    }
  }

  public setSession(nim_nip: string, token: string, role: UserSession["role"]) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("nim_nip", nim_nip);
      localStorage.setItem("role", role);
    }
    this.currentSession = { nim_nip, role };
  }

  public clearSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("nim_nip");
      localStorage.removeItem("role");
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
