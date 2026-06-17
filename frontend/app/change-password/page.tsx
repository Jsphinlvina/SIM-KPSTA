"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import api from "../api";
import { AuthSessionManager } from "../login/auth-session";

const ROLE_REDIRECT: Record<string, string> = {
  mahasiswa: "/mahasiswa",
  dosen: "/dosen",
  koordinator: "/koordinator",
  kaprodi: "/koordinator",
  admin: "/admin",
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = AuthSessionManager.getInstance().getSession();
    if (!session.nim_nip) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (newPassword === "password123") {
      setError("Password baru tidak boleh sama dengan password default.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/change-password/", { new_password: newPassword });
      const role = AuthSessionManager.getInstance().getSession().role;
      router.replace(ROLE_REDIRECT[role] ?? "/");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Gagal mengganti password, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center -translate-y-10">
        <Image
          src="/logo-sim-kp.png"
          alt="SIM-KP Logo"
          width={480}
          height={180}
          priority
          className="object-contain mb-2"
        />

        <div className="w-full bg-white rounded-2xl border border-[#e6eef5] shadow-sm p-8 flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-[#355872]">Ganti Password</h1>
            <p className="text-sm text-gray-500 mt-1">
              Password Anda masih default. Buat password baru sebelum melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full h-12 rounded-full border border-[#355872] bg-white pl-11 pr-12 outline-none text-[#355872] placeholder:text-gray-400 focus:border-[#7AAACE] focus:ring-2 focus:ring-[#355872] transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#355872]"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Konfirmasi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-12 rounded-full border border-[#355872] bg-white pl-11 pr-12 outline-none text-[#355872] placeholder:text-gray-400 focus:border-[#7AAACE] focus:ring-2 focus:ring-[#355872] transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#355872]"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 rounded-full bg-[#355872] hover:bg-[#7AAACE] disabled:opacity-60 text-white font-semibold transition shadow-md flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
