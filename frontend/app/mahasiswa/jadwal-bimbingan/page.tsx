"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";

import Sidebar from "@/app/components/sidebar";

const Calendar = dynamic(
  () => import("react-calendar"),
  { ssr: false }
);

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function JadwalBimbinganPage() {
  const [date, setDate] = useState<Value>(new Date());
  const [openModal, setOpenModal] = useState(false);

  const handleDateClick = (value: Value) => {
    setDate(value);
    setOpenModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#355872]">
              Jadwal Bimbingan
            </h1>

            <p className="text-gray-500 mt-2">
              Pilih jadwal bimbingan yang tersedia
            </p>
          </div>

          <div className="text-[#355872] font-medium">
            Dosen Pembimbing :
            <span className="ml-2 text-gray-600">
              Budi Santoso, S.Kom, M.T
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-[#e6eef5]
            p-8
          "
        >
          <div className="grid grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="col-span-2">
              <Calendar
                onChange={handleDateClick}
                value={date}
                className="
                  w-full
                  border-none
                  rounded-2xl
                "
              />
            </div>

            {/* Riwayat */}
            <div
              className="
                bg-[#F7F8F0]
                rounded-2xl
                border
                border-[#e6eef5]
                p-6
                h-fit
              "
            >
              <h2 className="text-xl font-bold text-[#355872] mb-6">
                Riwayat Bimbingan
              </h2>

              <div className="space-y-3">
                {/* Item */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    bg-white
                    rounded-2xl
                    px-5
                    py-4
                    border
                    border-[#e6eef5]
                  "
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#355872]">
                      1.
                    </span>

                    <span className="text-gray-700">
                      2 Maret 2026
                    </span>
                  </div>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      bg-green-100
                      text-green-700
                    "
                  >
                    Disetujui
                  </span>
                </div>

                {/* Item */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    bg-white
                    rounded-2xl
                    px-5
                    py-4
                    border
                    border-[#e6eef5]
                  "
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#355872]">
                      2.
                    </span>

                    <span className="text-gray-700">
                      11 April 2026
                    </span>
                  </div>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      bg-yellow-100
                      text-yellow-700
                    "
                  >
                    Pending
                  </span>
                </div>

                {/* Item */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    bg-white
                    rounded-2xl
                    px-5
                    py-4
                    border
                    border-[#e6eef5]
                  "
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#355872]">
                      3.
                    </span>

                    <span className="text-gray-700">
                      18 April 2026
                    </span>
                  </div>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      bg-red-100
                      text-red-700
                    "
                  >
                    Ditolak
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
          "
        >
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-[#355872] mb-4">
              Pengajuan Bimbingan
            </h2>

            <p className="text-gray-600 mb-8">
              Ajukan bimbingan pada tanggal:
            </p>

            <div
              className="
                bg-[#EAF4FB]
                text-[#355872]
                rounded-2xl
                px-5
                py-4
                font-semibold
                mb-8
              "
            >
              {date instanceof Date
                ? date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="
                  px-5
                  py-2
                  rounded-xl
                  border
                  border-[#dbe9f4]
                  text-gray-600
                  hover:bg-gray-100
                  transition
                "
              >
                Tidak
              </button>

              <button
                className="
                  px-5
                  py-2
                  rounded-xl
                  bg-[#355872]
                  hover:bg-[#7AAACE]
                  text-white
                  transition
                "
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}