"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  BookOpen,
  CalendarDays,
  FileText,
  Bell,
} from "lucide-react";

export default function DashboardMahasiswa() {
  const [nim, setNim] = useState("");

  useEffect(() => {
    const storedNim = localStorage.getItem("nim_nip");

    if (storedNim) {
      setNim(storedNim);
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#F7F8F0]">
      {/* Notification */}
      <div className="absolute top-10 right-10">
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