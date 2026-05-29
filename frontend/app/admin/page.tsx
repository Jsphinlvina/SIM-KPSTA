"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { User } from "lucide-react";

export default function DashboardAdmin() {
  const [admin, setAdmin] = useState("");

  useEffect(() => {
    const storedAdmin = localStorage.getItem("nim_nip");

    if (storedAdmin) {
      setAdmin(storedAdmin);
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#F7F8F0]">
      {/* CENTER CONTENT */}
      <div
        className="
          min-h-screen
          flex
          flex-col
          items-center
          justify-center
          -translate-y-10
        "
      >
        {/* Welcome */}
        <h1 className="text-5xl font-bold text-[#355872] mb-20">
          Welcome, {admin}
        </h1>

        {/* Card User */}
        <div className="flex items-center justify-center">
          <Link href="/admin/user">
            <div
              className="
                w-72
                h-72
                rounded-3xl
                bg-white
                border
                border-[#dbe9f4]
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-2
                transition
                flex
                flex-col
                items-center
                justify-center
                gap-8
                cursor-pointer
              "
            >
              {/* Icon */}
              <div
                className="
                  w-28
                  h-28
                  rounded-3xl
                  bg-[#EAF4FB]
                  flex
                  items-center
                  justify-center
                  text-[#355872]
                "
              >
                <User size={48} />
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#355872]">
                  User
                </h2>

                <p className="text-gray-500 mt-3 text-lg">
                  Kelola data user
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}