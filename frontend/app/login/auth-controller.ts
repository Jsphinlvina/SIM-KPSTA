import api from "../api";
import { AuthSessionManager, UserSession } from "./auth-session";

/**
 * Controller (MVC):
 * AuthController memproses input pengguna dari login View,
 * melakukan request ke backend API, dan memperbarui Model (AuthSessionManager).
 */
export class AuthController {
  private sessionManager: AuthSessionManager;

  constructor() {
    this.sessionManager = AuthSessionManager.getInstance();
  }

  public async login(
    nimNip: string,
    password: string
  ): Promise<{ success: boolean; role?: UserSession["role"]; error?: string }> {
    try {
      console.log("AuthController: Memulai login untuk:", nimNip);
      
      const response = await api.post("/auth/login/", {
        nim_nip: nimNip,
        password: password,
      });

      if (response.data.success) {
        const { access_token, user } = response.data.data;
        const role = user.role as UserSession["role"];

        // Update Model (AuthSessionManager)
        this.sessionManager.setSession(nimNip, access_token, role);

        return { success: true, role };
      }

      return { success: false, error: "Login gagal" };
    } catch (err: any) {
      console.error("AuthController Error:", err);
      const errorMsg =
        err.response?.data?.message || "Terjadi kesalahan koneksi server.";
      return { success: false, error: errorMsg };
    }
  }

  public logout(): void {
    this.sessionManager.clearSession();
  }
}
