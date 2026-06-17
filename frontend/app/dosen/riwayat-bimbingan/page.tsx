"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Calendar, MessageSquare } from "lucide-react";
import api from "../../api";

interface HistoryItem {
  id: number;
  date: string;
  time: string;
  notes: string;
  status: string;
  mahasiswa: string;
  nim: string;
}

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Pengajuan",
  ongoing: "Diterima",
  completed: "Selesai",
  cancelled: "Ditolak",
};

const STATUS_CLASS: Record<string, string> = {
  scheduled: "bg-amber-100 text-amber-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function RiwayatBimbinganDosenPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await api.get("/auth/me/");
        const dosenId: number = meRes.data.data?.user_id;

        const bimRes = await api.get(`/bimbingan/by-dosen/${dosenId}/`);
        const bimList: any[] = bimRes.data.data || [];

        const fetches = bimList.map((b: any) =>
          api
            .get(`/guidance/by-bimbingan/${b.bimbingan_id}/`)
            .then((r) =>
              (r.data.data || []).map((s: any) => ({
                id: s.id,
                date: s.date,
                time: s.time,
                notes: s.notes || "",
                status: s.status,
                mahasiswa: b.mahasiswa_detail?.nama_lengkap ?? "Mahasiswa",
                nim: b.mahasiswa_detail?.nim_nip ?? "-",
              }))
            )
            .catch(() => [])
        );

        const results = await Promise.all(fetches);
        const flat = results
          .flat()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setItems(flat);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <div className="p-10 flex flex-col w-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-10">
        <Link
          href="/dosen"
          className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]"
        >
          <ArrowLeft size={32} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#355872]">Riwayat Bimbingan</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Semua jadwal bimbingan yang pernah diajukan mahasiswa bimbingan Anda
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden flex-1">
        <div className="px-8 py-6 border-b border-[#f0f5fa]">
          <h2 className="text-xl font-bold text-[#355872]">Daftar Riwayat</h2>
        </div>

        <div className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-4 font-semibold text-[#355872] text-sm border-b border-[#e6eef5]">
          <div className="col-span-1">No</div>
          <div className="col-span-3">Mahasiswa</div>
          <div className="col-span-3">Waktu Pertemuan</div>
          <div className="col-span-3">Catatan</div>
          <div className="col-span-2">Status</div>
        </div>

        <div className="divide-y divide-[#eef4f8]">
          {loading ? (
            <div className="px-6 py-16 flex justify-center text-gray-400">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-500 font-medium">
              Belum ada riwayat bimbingan.
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                <div className="col-span-1 text-[#355872] font-semibold text-lg">{idx + 1}</div>

                <div className="col-span-3">
                  <p className="font-bold text-[#355872] text-lg">{item.mahasiswa}</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">NIM: {item.nim}</p>
                </div>

                <div className="col-span-3">
                  <div className="flex items-center gap-2 text-[#355872] font-bold text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span>
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1 pl-5">
                    {item.time?.slice(0, 5)}
                  </p>
                </div>

                <div className="col-span-3 flex items-start gap-2 pr-4">
                  <MessageSquare size={14} className="text-gray-400 mt-1 shrink-0" />
                  <p className="text-sm text-[#355872] font-medium leading-relaxed">
                    {item.notes || "—"}
                  </p>
                </div>

                <div className="col-span-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      STATUS_CLASS[item.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
