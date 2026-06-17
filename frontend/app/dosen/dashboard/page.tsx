"use client";

import { useEffect, useState } from "react";
import { Users, Clock, CheckCircle2, FileText } from "lucide-react";
import api from "@/app/api";
import Link from "next/link";
import { DashboardDataManager, BimbinganEntry } from "./dashboard-data";

/**
 * Singleton Pattern (FE):
 * Data bimbingan diambil dari DashboardDataManager.getInstance()
 * bukan di-hardcode ulang tiap render, sehingga satu sumber data
 * konsisten di seluruh sesi tanpa re-fetch berulang.
 */

export default function DashboardDosenPage() {
  const [entries, setEntries] = useState<BimbinganEntry[]>([]);
  const [dosenProfile, setDosenProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const manager = DashboardDataManager.getInstance();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const meRes = await api.get("/auth/me/");
        const profile = meRes.data.data;
        setDosenProfile(profile);

        const [bimbinganRes, pendingRes] = await Promise.all([
          api.get(`/bimbingan/by-dosen/${profile.user_id}/`),
          api.get("/bimbingan/pending-approval/"),
        ]);

        const bimbinganList = bimbinganRes.data.data || [];
        const pendingList = pendingRes.data.data || [];

        manager.loadFromAPI(bimbinganList, pendingList.length);
        setEntries(manager.getEntries());
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="p-10 flex flex-col w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#355872]">Dashboard Dosen</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Pemantauan beban dan status bimbingan mahasiswa Kerja Praktik
          </p>
        </div>

        <div className="text-[#355872] font-bold bg-[#EAF4FB] px-5 py-3 rounded-2xl border border-[#9CD5FF]/20 shadow-sm text-sm">
          Dosen Pembimbing:{" "}
          <span className="text-gray-600 ml-1 font-semibold">
            {dosenProfile ? dosenProfile.nama_lengkap : "Memuat..."}
          </span>
        </div>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 border border-[#e6eef5] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-[#EAF4FB] text-[#355872] rounded-2xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Bimbingan</p>
            <h3 className="text-3xl font-bold text-[#355872] mt-1">{entries.length}</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Mahasiswa di bawah asuhan</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#e6eef5] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Bimbingan Aktif</p>
            <h3 className="text-3xl font-bold text-green-700 mt-1">{manager.getActiveCount()}</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Mahasiswa status aktif</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#e6eef5] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Persetujuan Pending</p>
            <h3 className="text-3xl font-bold text-amber-700 mt-1">{manager.getPendingCount()}</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Butuh respon persetujuan</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden flex-1">
        <div className="px-8 py-6 border-b border-[#f0f5fa]">
          <h2 className="text-xl font-bold text-[#355872]">Daftar Mahasiswa Bimbingan</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Gunakan daftar di bawah untuk memantau progres tugas serta kelengkapan administratif.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-4 font-semibold text-[#355872] border-b border-[#e6eef5] text-sm">
          <div className="col-span-1">No</div>
          <div className="col-span-3">Mahasiswa</div>
          <div className="col-span-5">Topik Kerja Praktik</div>
          <div className="col-span-3 text-right pr-2">Dokumen</div>
        </div>

        <div className="divide-y divide-[#eef4f8]">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400 font-medium">Memuat data...</div>
          ) : entries.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 font-medium">
              Belum ada mahasiswa bimbingan.
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.bimbinganId}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                <div className="col-span-1 text-[#355872] font-semibold text-lg">{entry.id}</div>

                <div className="col-span-3">
                  <p className="font-bold text-[#355872] text-lg">{entry.name}</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">NIM: {entry.nim}</p>
                </div>

                <div className="col-span-5 text-sm text-[#355872] font-medium pr-6 leading-relaxed">
                  {entry.topic}
                </div>

                <div className="col-span-3 flex items-center justify-end pr-2">
                  <Link
                    href={`/dosen/document-review/${entry.bimbinganId}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF4FB] hover:bg-[#355872] text-[#355872] hover:text-white border border-[#9CD5FF]/30 text-xs font-bold transition-all duration-200"
                  >
                    <FileText size={14} />
                    Lihat Dokumen
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
