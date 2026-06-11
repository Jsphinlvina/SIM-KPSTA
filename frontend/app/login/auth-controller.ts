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
  ): Promise<{ success: boolean; role?: UserSession["role"]; mustChangePassword?: boolean; error?: string }> {
    try {
      const response = await api.post("/auth/login/", {
        nim_nip: nimNip,
        password: password,
      });

      if (response.data.success) {
        const { access_token, user } = response.data.data;
        const role = user.role as UserSession["role"];

        this.sessionManager.setSession(nimNip, access_token, role);

        return { success: true, role, mustChangePassword: user.must_change_password ?? false };
      }

      return { success: false, error: "Login gagal" };
    } catch (err: any) {
      const code: string = err.response?.data?.message ?? "";
      const ERROR_MESSAGES: Record<string, string> = {
        USER_NOT_FOUND: "Akun Anda belum terdaftar.",
        WRONG_PASSWORD: "Password Anda salah.",
        PENDING_APPROVAL: "Akun Anda belum disetujui, mohon dapat hubungi Admin.",
      };
      const errorMsg = ERROR_MESSAGES[code] ?? "Terjadi kesalahan koneksi server.";
      return { success: false, error: errorMsg };
    }
  }

  public logout(): void {
    this.sessionManager.clearSession();
  }
}
