"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Bell,
  LogOut,
} from "lucide-react";
import api from "../api";

export default function DashboardDosenLading() {
  const [nama, setNama] = useState("Dosen");
  const router = useRouter();

  useEffect(() => {
    api.get("/auth/me/")
      .then((res) => {
        if (res.data.success) {
          setNama(res.data.data.nama_lengkap);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat profil dosen:", err);
        const storedNip = localStorage.getItem("nim_nip");
        if (storedNip) {
          setNama(storedNip);
        }
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nim_nip");
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F7F8F0]">
      {/* Top Actions */}
      <div className="absolute top-10 right-10 flex gap-4">
        {/* Notification */}
        <button
          className="
            w-14
            h-14
            rounded-2xl
            bg-white
            border
            border-[#dbe9f4]
            shadow-sm
            flex
            items-center
            justify-center
            text-[#355872]
            hover:bg-[#EAF4FB]
            transition
            cursor-pointer
          "
        >
          <Bell size={24} />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            px-5
            h-14
            rounded-2xl
            bg-white
            border
            border-red-100
            shadow-sm
            flex
            items-center
            justify-center
            gap-2
            text-red-500
            hover:bg-red-50
            transition
            cursor-pointer
            font-semibold
          "
        >
          <LogOut size={20} />
        </button>
      </div>

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
          Welcome, {nama}
        </h1>

        {/* Cards */}
        <div className="flex items-center justify-center gap-10">
          {/* DASHBOARD */}
          <Link href="/dosen/dashboard">
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
                <LayoutDashboard size={48} />
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#355872]">
                  Dashboard
                </h2>

                <p className="text-gray-500 mt-3 text-lg">
                  Monitoring bimbingan
                </p>
              </div>
            </div>
          </Link>

          {/* APPROVAL */}
          <Link href="/dosen/approval">
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
                <CheckSquare size={48} />
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#355872]">
                  Approval
                </h2>

                <p className="text-gray-500 mt-3 text-lg">
                  Persetujuan bimbingan
                </p>
              </div>
            </div>
          </Link>

          {/* PENAWARAN TOPIK */}
          <Link href="/dosen/penawaran-topik">
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
                <BookOpen size={48} />
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#355872]">
                  Topik
                </h2>

                <p className="text-gray-500 mt-3 text-lg">
                  Tawarkan topik baru
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
