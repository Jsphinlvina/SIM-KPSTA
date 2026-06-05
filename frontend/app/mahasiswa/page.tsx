"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationPopup from "./notifikasi/page";

import {
  BookOpen,
  CalendarDays,
  FileText,
  Bell,
  LogOut,
} from "lucide-react";

export default function DashboardMahasiswa() {
  const [nim, setNim] = useState("");
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const storedNim = localStorage.getItem("nim_nip");

    if (storedNim) {
      setNim(storedNim);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nim_nip");
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F7F8F0]">
      {/* Top Actions */}
      <div className="absolute top-10 right-10 flex gap-4 z-50">
        {/* Notification */}
        <button
          onClick={() =>
            setShowNotification(!showNotification)
          }
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

      {showNotification && (
        <NotificationPopup
          onClose={() =>
            setShowNotification(false)
          }
        />
      )}

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
          Welcome, {nim}
        </h1>

        {/* Cards */}
        <div className="flex items-center justify-center gap-10">
          {/* TOPIK */}
          <Link href="/mahasiswa/list-topik">
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
                  Daftar topik KP
                </p>
              </div>
            </div>
          </Link>

          {/* JADWAL */}
          <Link href="/mahasiswa/jadwal-bimbingan">
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
                <CalendarDays size={48} />
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#355872]">
                  Jadwal
                </h2>

                <p className="text-gray-500 mt-3 text-lg">
                  Jadwal bimbingan
                </p>
              </div>
            </div>
          </Link>

          {/* LAPORAN */}
          <Link href="/mahasiswa/upload-laporan">
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
                <FileText size={48} />
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#355872]">
                  Laporan
                </h2>

                <p className="text-gray-500 mt-3 text-lg">
                  Kirim laporan KP
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}