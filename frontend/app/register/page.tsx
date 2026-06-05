"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import api from "../api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [nimNip, setNimNip] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    console.log("Tombol login diklik! Mengirim data:", { nimNip, password });

    try {
      const response = await api.post("/auth/login/", {
        nim_nip: nimNip,
        password: password,
      });

      if (response.data.success) {
        const { access_token, user } = response.data.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("nim_nip", nimNip);

        if (user.role === "mahasiswa") {
          router.push("/mahasiswa");
        } else if (user.role === "dosen") {
          router.push("/dosen");
        } else if (user.role === "koordinator") {
          router.push("/koordinator");
        } else if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Terjadi kesalahan koneksi server.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center -translate-y-14">
        {/* Logo */}
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

        {/* Form */}
        <form className="w-full flex flex-col gap-6">
          
          <div className="relative">
            <input
              type="text"
              placeholder="Isi Email"
              className="
                w-full
                h-12
                rounded-full
                border
                border-[#355872]
                bg-white
                pl-6
                pr-4
                outline-none
                text-[#355872]
                placeholder:text-gray-500
                focus:border-[#7AAACE]
                focus:ring-2
                focus:ring-[#355872]
                transition
              "
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Isi Nama Lengkap"
              className="
                w-full
                h-12
                rounded-full
                border
                border-[#355872]
                bg-white
                pl-6
                pr-4
                outline-none
                text-[#355872]
                placeholder:text-gray-500
                focus:border-[#7AAACE]
                focus:ring-2
                focus:ring-[#355872]
                transition
              "
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="
                w-full
                h-12
                rounded-full
                border
                border-[#355872]
                bg-white
                pl-6
                pr-5
                outline-none
                text-[#355872]
                placeholder:text-gray-500
                focus:border-[#7AAACE]
                focus:ring-2
                focus:ring-[#355872]
                transition
              "
            />
          </div>


          {/* Button */}
          <button
            type="submit"
            className="
              mt-6
              h-12
              rounded-full
              bg-[#355872]
              hover:bg-[#7AAACE]
              text-white
              font-semibold
              transition
              shadow-md
            "
          >
            Daftar
          </button>
        </form>

        
          <div className="text-center mt-5">
            <span className="text-gray-600">
              Kembali ke
            </span>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="
                ml-1
                text-[#355872]
                font-semibold
                hover:text-[#7AAACE]
                transition
              "
            >
              login
            </button>
          </div>
      </div>
    </div>
  );
}