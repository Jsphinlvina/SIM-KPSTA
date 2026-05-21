"use client";

import { useState } from "react";
import Sidebar from "@/app/components/sidebar";

type Request = {
  id: number;
  student: string;
  date: string;
  status: "Pending" | "Disetujui" | "Ditolak";
};

export default function ApprovalPage() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      student: "Andi Saputra",
      date: "2 Mei 2026",
      status: "Pending",
    },
    {
      id: 2,
      student: "Budi Hartono",
      date: "5 Mei 2026",
      status: "Pending",
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

      <div className="flex-1 p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#355872]">
            Approval Bimbingan
          </h1>
          <p className="text-gray-500 mt-2">
            Persetujuan jadwal dari mahasiswa
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] p-8">
          <h2 className="text-xl font-bold text-[#355872] mb-6">
            Daftar Pengajuan
          </h2>

          <div className="space-y-4">
            {requests.map((r, i) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-white border border-[#e6eef5] rounded-2xl px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-[#355872]">
                    {i + 1}.
                  </span>

                  <div>
                    <p className="font-medium text-[#355872]">
                      {r.student}
                    </p>
                    <p className="text-sm text-gray-500">
                      {r.date}
                    </p>
                  </div>
                </div>

                {/* Action / Status */}
                {r.status === "Pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="px-4 py-1 rounded-xl bg-green-100 text-green-700 text-sm"
                    >
                      Setujui
                    </button>

                    <button
                      onClick={() => handleReject(r.id)}
                      className="px-4 py-1 rounded-xl bg-red-100 text-red-700 text-sm"
                    >
                      Tolak
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      r.status === "Disetujui"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}