"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8F0] flex items-start justify-center px-4 pt-40">
      <div className="w-full max-w-sm flex flex-col items-center">
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
        <form className="w-full flex flex-col gap-6 -mt-10">
          {/* Username */}
          <div className="relative">
            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#355872]"
            />

            <input
              type="text"
              placeholder="NRP / NIM"
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
        </form>
      </div>
    </div>
  );
}