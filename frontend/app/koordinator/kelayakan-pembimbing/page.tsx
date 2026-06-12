"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "../../api";

interface ProsesPenentuan {
  proses_id: number;
  status: string;
  tahap_chain: string;
  pengajuan_detail: {
    judul_diajukan: string;
    mahasiswa_detail: { nama_lengkap: string; nim_nip: string };
    topik_detail?: { judul: string };
  } | null;
  dosen_detail: { nama_lengkap: string; nim_nip: string } | null;
}

export default function KelayakanPembimbingKoordinatorPage() {
  const [list, setList] = useState<ProsesPenentuan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bimbingan/pending-approval/")
      .then((res) => setList(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F8F0]">
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <Link href="/koordinator" className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]">
            <ArrowLeft size={32} />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-[#355872]">Kelayakan Pembimbing</h1>
            <p className="text-gray-500 mt-2">Monitoring permintaan kelayakan yang sedang menunggu respons dosen</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-12 text-center text-gray-500">
            Tidak ada permintaan kelayakan yang sedang menunggu.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_1fr_1fr_160px] bg-[#EAF4FB] px-8 py-5 font-semibold text-[#355872]">
              <div>No</div>
              <div>Mahasiswa</div>
              <div>Topik</div>
              <div>Dosen Diusulkan</div>
              <div>Status</div>
            </div>
            {list.map((item, idx) => (
              <div
                key={item.proses_id}
                className="grid grid-cols-[60px_1fr_1fr_1fr_160px] items-center px-8 py-6 border-t border-[#eef4f8]"
              >
                <div className="text-[#355872] font-medium">{idx + 1}</div>
                <div>
                  <p className="font-semibold text-[#355872]">
                    {item.pengajuan_detail?.mahasiswa_detail?.nama_lengkap ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.pengajuan_detail?.mahasiswa_detail?.nim_nip ?? "—"}
                  </p>
                </div>
                <div className="text-sm text-gray-700 pr-4">
                  {item.pengajuan_detail?.topik_detail?.judul
                    ?? item.pengajuan_detail?.judul_diajukan
                    ?? "—"}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#355872]">
                    {item.dosen_detail?.nama_lengkap ?? "—"}
                  </p>
                  <p className="text-xs text-gray-400">{item.dosen_detail?.nim_nip ?? ""}</p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Menunggu Dosen
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
