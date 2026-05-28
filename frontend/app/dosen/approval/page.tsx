"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import api from "@/app/api";

type Request = {
  id: number;
  student: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  topic_title: string;
};

export default function ApprovalPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // KUNCI 1: Jinakkan Hydration Mismatch

  // Pastikan komponen sudah terpasang sepenuhnya di browser sebelum render Sidebar
  useEffect(() => {
    setIsMounted(true);
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/schedule/requests/");
      if (res.data && res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.warn("API /schedule/requests/ belum siap di backend. Menggunakan fallback data kosong.");
      setRequests([]); // KUNCI 2: Amankan agar data tidak crash 404
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await api.post(`/schedule/requests/${id}/approve/`);
      if (res.data.success) {
        alert("Bimbingan mahasiswa berhasil disetujui!");
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
      }
    } catch (err) {
      alert("Fungsi approve belum siap di backend, mengubah state lokal saja.");
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    }
  };

  const handleReject = async (id: number) => {
    const alasan = prompt("Masukkan alasan penolakan:");
    if (alasan === null) return;
    try {
      const res = await api.post(`/schedule/requests/${id}/reject/`, { alasan });
      if (res.data.success) {
        alert("Bimbingan ditolak.");
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
      }
    } catch (err) {
      alert("Fungsi reject belum siap di backend, mengubah state lokal saja.");
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    }
  };

  // Jika belum mounted, tampilkan loading tipis agar HTML Server & Client sinkron
  if (!isMounted) {
    return <div className="min-h-screen bg-[#F7F8F0] p-10 text-center">Loading interface...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#355872]">Approval Bimbingan</h1>
          <p className="text-gray-500 mt-2">Persetujuan draf judul dan penentuan jadwal KP/STA dari mahasiswa.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] p-8">
          <h2 className="text-xl font-bold text-[#355872] mb-6">Daftar Pengajuan Masuk</h2>

          {loading && requests.length === 0 ? (
            <p className="text-center text-gray-500 py-4 animate-pulse">Menghubungkan ke PostgreSQL...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Belum ada mahasiswa yang mengajukan bimbingan kepada Anda.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r, i) => (
                <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-[#e6eef5] rounded-2xl px-5 py-4 gap-4">
                  <div className="flex items-start gap-4">
                    <span className="font-semibold text-[#355872] mt-0.5">{i + 1}.</span>
                    <div>
                      <p className="font-semibold text-[#355872] text-lg">{r.student}</p>
                      <p className="text-sm font-medium text-gray-700 italic mt-0.5">"{r.topic_title}"</p>
                      <p className="text-xs text-gray-400 mt-1">Diajukan pada: <span className="font-medium">{r.date}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(r.id)} className="px-4 py-1.5 rounded-xl bg-green-100 text-green-700 font-medium text-sm hover:bg-green-200 transition">Setujui</button>
                        <button onClick={() => handleReject(r.id)} className="px-4 py-1.5 rounded-xl bg-red-100 text-red-700 font-medium text-sm hover:bg-red-200 transition">Tolak</button>
                      </div>
                    ) : (
                      <span className={`px-4 py-1 rounded-full text-xs font-semibold uppercase ${r.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {r.status === "approved" ? "Disetujui" : "Ditolak"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}