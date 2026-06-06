"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { AuthController } from "./auth-controller";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [nimNip, setNimNip] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Instansiasi Controller (MVC)
  const authController = new AuthController();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const result = await authController.login(nimNip, password);

    if (result.success && result.role) {
      if (result.role === "mahasiswa") {
        router.push("/mahasiswa");
      } else if (result.role === "dosen") {
        router.push("/dosen");
      } else if (result.role === "koordinator") {
        router.push("/koordinator");
      } else if (result.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else if (result.error) {
      setErrorMsg(result.error);
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
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
          {/* Username */}
          <div className="relative">
            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]"
            />

            <input
              type="text"
              placeholder="NRP / NIM"
              value ={nimNip}
              onChange={(e)=>setNimNip(e.target.value)}
              className="
                w-full
                h-12
                rounded-full
                border
                border-[#355872]
                bg-white
                pl-12
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

          {/* Password */}
          <div className="relative">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]"
            />

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
                pl-12
                pr-12
                outline-none
                text-[#355872]
                placeholder:text-gray-500
                focus:border-[#7AAACE]
                focus:ring-2
                focus:ring-[#355872]
                transition
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#355872]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* <div className="flex justify-end -mt-3">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="
                text-sm
                text-[#355872]
                hover:text-[#7AAACE]
                transition
              "
            >
              Lupa Password?
            </button>
          </div> */}

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
            Login
          </button>

          <div className="text-center">
            <span className="text-gray-600">
              Belum punya akun?
            </span>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="
                ml-2
                text-[#355872]
                font-semibold
                hover:text-[#7AAACE]
                transition
              "
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}