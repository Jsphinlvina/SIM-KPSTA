"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import { Check, X, Calendar, MessageSquare, AlertCircle } from "lucide-react";

type Request = {
  id: number;
  student: string;
  nim: string;
  date: string;
  time: string;
  notes: string;
  status: "Pending" | "Disetujui" | "Ditolak";
};

export default function ApprovalPage() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      student: "Andi Saputra",
      nim: "2272001",
      date: "12 Mei 2026",
      time: "10:00 - 11:30 WIB",
      notes: "Konsultasi draft laporan KP Bab 3 Metodologi Penelitian.",
      status: "Pending",
    },
    {
      id: 2,
      student: "Budi Hartono",
      nim: "2272002",
      date: "15 Mei 2026",
      time: "13:30 - 15:00 WIB",
      notes: "Review revisi kuesioner evaluasi kurikulum akademik.",
      status: "Pending",
    },
    {
      id: 3,
      student: "Citra Lestari",
      nim: "2272003",
      date: "18 Mei 2026",
      time: "09:00 - 10:30 WIB",
      notes: "Diskusi hasil rancangan arsitektur IoT dan database server.",
      status: "Disetujui",
    },
  ]);

  const handleApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Disetujui" } : r
      )
    );
  };

  const handleReject = (id: number) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Ditolak" } : r
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      <Sidebar />

      <div className="flex-1 p-10 flex flex-col">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#355872]">
            Approval Bimbingan
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Evaluasi dan persetujuan pengajuan jadwal bimbingan tatap muka mahasiswa Kerja Praktik
          </p>
        </div>

        {/* Card Table Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden flex-1">
          <div className="px-8 py-6 border-b border-[#f0f5fa]">
            <h2 className="text-xl font-bold text-[#355872]">
              Daftar Pengajuan Jadwal
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Silakan evaluasi dan tentukan keputusan persetujuan untuk pengajuan di bawah ini.
            </p>
          </div>

          {/* Table Headers */}
          <div
            className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-4 font-semibold text-[#355872] text-sm border-b border-[#e6eef5]"
          >
            <div className="col-span-1">No</div>
            <div className="col-span-3">Mahasiswa</div>
            <div className="col-span-3">Waktu Pertemuan</div>
            <div className="col-span-3">Perihal / Catatan</div>
            <div className="col-span-2 text-right pr-4">Keputusan</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#eef4f8]">
            {requests.map((r, i) => (
              <div
                key={r.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                {/* 1. Index */}
                <div className="col-span-1 text-[#355872] font-semibold text-lg">
                  {i + 1}
                </div>

                {/* 2. Student Profile */}
                <div className="col-span-3">
                  <p className="font-bold text-[#355872] text-lg">{r.student}</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">NIM: {r.nim}</p>
                </div>

                {/* 3. Date & Time */}
                <div className="col-span-3">
                  <div className="flex items-center gap-2 text-[#355872] font-bold text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{r.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1 pl-5.5">{r.time}</p>
                </div>

                {/* 4. Notes */}
                <div className="col-span-3 flex items-start gap-2 pr-4">
                  <MessageSquare size={14} className="text-gray-400 mt-1 shrink-0" />
                  <p className="text-sm text-[#355872] font-medium leading-relaxed">
                    {r.notes}
                  </p>
                </div>

                {/* 5. Action / Status Badge */}
                <div className="col-span-2 flex items-center justify-end pr-2 gap-2">
                  {r.status === "Pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="
                          flex
                          items-center
                          gap-1
                          px-3
                          py-2
                          rounded-xl
                          bg-green-50
                          hover:bg-green-600
                          text-green-700
                          hover:text-white
                          border
                          border-green-100
                          text-xs
                          font-bold
                          transition-all
                          duration-200
                          cursor-pointer
                        "
                      >
                        <Check size={14} />
                        Setujui
                      </button>

                      <button
                        onClick={() => handleReject(r.id)}
                        className="
                          flex
                          items-center
                          gap-1
                          px-3
                          py-2
                          rounded-xl
                          bg-red-50
                          hover:bg-red-600
                          text-red-700
                          hover:text-white
                          border
                          border-red-100
                          text-xs
                          font-bold
                          transition-all
                          duration-200
                          cursor-pointer
                        "
                      >
                        <X size={14} />
                        Tolak
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                        ${
                          r.status === "Disetujui"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                        }
                      `}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        r.status === "Disetujui" ? "bg-green-500" : "bg-red-500"
                      }`}></span>
                      {r.status}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500 font-medium">
                Tidak ada pengajuan jadwal bimbingan yang masuk.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}