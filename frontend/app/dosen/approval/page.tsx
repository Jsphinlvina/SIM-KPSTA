"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { BimbinganRequest, PendingState } from "./approval-state";
import api from "../../api";

/**
 * Connects to backend:
 * - GET /api/auth/me/ → get current dosen's user_id
 * - GET /api/bimbingan/by-dosen/<id>/ → bimbingan with mahasiswa info
 * - GET /api/guidance/by-bimbingan/<id>/ → scheduled guidance events
 * - POST /api/guidance/<id>/start/ → approve
 * - POST /api/guidance/<id>/cancel/ → reject
 *
 * State Pattern (BimbinganRequest) is preserved for local visual state.
 */

export default function ApprovalPage() {
  const [requests, setRequests] = useState<BimbinganRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get current dosen's ID
        const meRes = await api.get("/auth/me/");
        const currentUser = meRes.data.data;

        // 2. Get all bimbingan for this dosen (includes mahasiswa details)
        const bimbinganRes = await api.get(
          `/bimbingan/by-dosen/${currentUser.user_id}/`
        );
        const bimbinganList: any[] = bimbinganRes.data.data || [];

        // 3. Fetch scheduled guidance events for each bimbingan in parallel
        const scheduleFetches = bimbinganList.map((b: any) =>
          api
            .get(`/guidance/by-bimbingan/${b.id}/`)
            .then((r) =>
              (r.data.data || [])
                .filter((s: any) => s.status === "scheduled")
                .map((s: any) => ({
                  id: s.id,
                  student: b.mahasiswa_detail?.nama_lengkap ?? "Mahasiswa",
                  nim: b.mahasiswa_detail?.nim_nip ?? "-",
                  date: s.date,
                  time: s.time,
                  notes: s.notes || "",
                }))
            )
            .catch(() => [])
        );

        const nestedResults = await Promise.all(scheduleFetches);
        const flatResults = nestedResults.flat();

        // 4. Map to BimbinganRequest (State Pattern)
        const mapped = flatResults.map(
          (item: any) =>
            new BimbinganRequest(
              item.id,
              item.student,
              item.nim,
              item.date,
              item.time,
              item.notes,
              "Pending"
            )
        );

        setRequests(mapped);
      } catch (err) {
        console.error("Gagal memuat data approval bimbingan:", err);
        setErrorMsg("Gagal memuat data. Pastikan Anda sudah login sebagai dosen.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/guidance/${id}/start/`);
      setRequests((prev) => {
        const updated = [...prev];
        const req = updated.find((r) => r.id === id);
        if (req) req.approve();
        return updated;
      });
    } catch (err) {
      console.error("Gagal menyetujui jadwal:", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.post(`/guidance/${id}/cancel/`);
      setRequests((prev) => {
        const updated = [...prev];
        const req = updated.find((r) => r.id === id);
        if (req) req.reject();
        return updated;
      });
    } catch (err) {
      console.error("Gagal menolak jadwal:", err);
    }
  };

  return (
    <div className="p-10 flex flex-col w-full">
      <div className="flex items-start gap-4 mb-10">
        <Link
          href="/dosen"
          className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]"
        >
          <ArrowLeft size={32} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-[#355872]">Approval Bimbingan</h1>
          <p className="text-gray-500 mt-2 font-medium">
            Persetujuan pengajuan jadwal bimbingan mahasiswa kerja praktik
          </p>
        </div>
      </div>

      {/* Card Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] overflow-hidden flex-1">
        <div className="px-8 py-6 border-b border-[#f0f5fa]">
          <h2 className="text-xl font-bold text-[#355872]">Daftar Pengajuan Jadwal</h2>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-4 bg-[#EAF4FB] px-8 py-4 font-semibold text-[#355872] text-sm border-b border-[#e6eef5]">
          <div className="col-span-1">No</div>
          <div className="col-span-3">Mahasiswa</div>
          <div className="col-span-3">Waktu Pertemuan</div>
          <div className="col-span-3">Perihal / Catatan</div>
          <div className="col-span-2 text-right pr-4">Keputusan</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#eef4f8]">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-400 font-medium">
              Memuat data...
            </div>
          ) : errorMsg ? (
            <div className="px-6 py-12 text-center text-red-500 font-medium">
              {errorMsg}
            </div>
          ) : (
            requests.map((r, i) => (
              <div
                key={r.id}
                className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[#F7F8F0]/30 transition"
              >
                <div className="col-span-1 text-[#355872] font-semibold text-lg">{i + 1}</div>

                <div className="col-span-3">
                  <p className="font-bold text-[#355872] text-lg">{r.student}</p>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">NIM: {r.nim}</p>
                </div>

                <div className="col-span-3">
                  <div className="flex items-center gap-2 text-[#355872] font-bold text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{r.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1 pl-5">{r.time}</p>
                </div>

                <div className="col-span-3 flex items-start gap-2 pr-4">
                  <MessageSquare size={14} className="text-gray-400 mt-1 shrink-0" />
                  <p className="text-sm text-[#355872] font-medium leading-relaxed">{r.notes}</p>
                </div>

                <div className="col-span-2 flex items-center justify-end pr-2 gap-2">
                  {r.getStatus() === "Pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-50 hover:bg-green-600 text-green-700 hover:text-white border border-green-100 text-xs font-bold transition-all duration-200 cursor-pointer"
                      >
                        <Check size={14} />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(r.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-100 text-xs font-bold transition-all duration-200 cursor-pointer"
                      >
                        <X size={14} />
                        Tolak
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        r.getStatus() === "Disetujui"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          r.getStatus() === "Disetujui" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {r.getStatus()}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}

          {!loading && !errorMsg && requests.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500 font-medium">
              Tidak ada pengajuan jadwal bimbingan yang masuk.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
