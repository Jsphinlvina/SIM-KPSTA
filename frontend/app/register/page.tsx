"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Hash } from "lucide-react";
import api from "../api";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [nimNip, setNimNip] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register/", {
        nim_nip: nimNip,
        nama_lengkap: nama,
        password,
      });

      if (response.data.success) {
        setSuccessMsg("Pendaftaran berhasil! Akun Anda menunggu persetujuan admin sebelum bisa login.");
        setNimNip("");
        setNama("");
        setPassword("");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Terjadi kesalahan koneksi server.";
      setErrorMsg(typeof message === "object" ? JSON.stringify(message) : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center -translate-y-6">
        <div>
          <Image
            src="/logo-sim-kp.png"
            alt="SIM-KP Logo"
            width={480}
            height={180}
            priority
            className="object-contain"
          />
        </div>

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          {/* NIM/NIP */}
          <div className="relative">
            <Hash size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]" />
            <input
              type="text"
              placeholder="NIM / NIP"
              value={nimNip}
              onChange={(e) => setNimNip(e.target.value)}
              required
              className="w-full h-12 rounded-full border border-[#355872] bg-white pl-12 pr-4 outline-none text-[#355872] placeholder:text-gray-500 focus:border-[#7AAACE] focus:ring-2 focus:ring-[#355872] transition"
            />
          </div>

          {/* Nama */}
          <div className="relative">
            <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]" />
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full h-12 rounded-full border border-[#355872] bg-white pl-12 pr-4 outline-none text-[#355872] placeholder:text-gray-500 focus:border-[#7AAACE] focus:ring-2 focus:ring-[#355872] transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 rounded-full border border-[#355872] bg-white pl-12 pr-12 outline-none text-[#355872] placeholder:text-gray-500 focus:border-[#7AAACE] focus:ring-2 focus:ring-[#355872] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#355872]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center font-medium">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-green-600 text-sm text-center font-medium">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 rounded-full bg-[#355872] hover:bg-[#7AAACE] disabled:opacity-60 text-white font-semibold transition shadow-md"
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>

          <div className="text-center">
            <span className="text-gray-600">Kembali ke</span>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="ml-1 text-[#355872] font-semibold hover:text-[#7AAACE] transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
