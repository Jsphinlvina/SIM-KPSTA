"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F7F8F0] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/">
            <ArrowLeft />
          </Link>

          <h1 className="text-2xl font-bold text-[#355872]">
            Lupa Password
          </h1>
        </div>

        <p className="text-gray-500 mb-6">
          Masukkan email yang terdaftar untuk menerima link reset password.
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl p-3 mb-4"
        />

        <button
          className="
            w-full
            bg-[#355872]
            text-white
            py-3
            rounded-xl
          "
        >
          Kirim Link Reset
        </button>
      </div>
    </div>
  );
}