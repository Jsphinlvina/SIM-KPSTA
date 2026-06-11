"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../api";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface GuidanceEvent {
  id: number;
  date: string;
  time: string;
  status: string;
  notes: string;
}

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Terjadwal",
  ongoing: "Berlangsung",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_CLASS: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-700",
  ongoing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function JadwalBimbinganPage() {
  const [date, setDate] = useState<Value>(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [bimbinganId, setBimbinganId] = useState<number | null>(null);
  const [lecturerId, setLecturerId] = useState<number | null>(null);
  const [dosenNama, setDosenNama] = useState("—");
  const [history, setHistory] = useState<GuidanceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await api.get("/auth/me/");
        const uid: number = meRes.data.data?.user_id;

        const bimRes = await api.get(`/bimbingan/by-mahasiswa/${uid}/`);
        const bimList: any[] = bimRes.data.data || [];
        if (bimList.length === 0) { setLoading(false); return; }

        const bim = bimList[0];
        setBimbinganId(bim.id);
        setLecturerId(bim.dosen);
        setDosenNama(bim.dosen_detail?.nama_lengkap ?? "—");

        const guidRes = await api.get(`/guidance/by-bimbingan/${bim.id}/`);
        const events: any[] = guidRes.data.data || [];
        setHistory(
          events
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((e) => ({
              id: e.id,
              date: e.date,
              time: e.time,
              status: e.status,
              notes: e.notes || "",
            }))
        );
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleDateClick = (value: Value) => {
    setDate(value);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!bimbinganId || !lecturerId) return;
    const selectedDate =
      date instanceof Date
        ? date.toISOString().split("T")[0]
        : Array.isArray(date) && date[0]
        ? (date[0] as Date).toISOString().split("T")[0]
        : null;
    if (!selectedDate) return;

    setSubmitting(true);
    try {
      const res = await api.post("/guidance/", {
        bimbingan_aktif_id: bimbinganId,
        lecturer_id: lecturerId,
        date: selectedDate,
        time,
        notes,
      });
      const newEvent: GuidanceEvent = {
        id: res.data.data.id,
        date: res.data.data.date,
        time: res.data.data.time,
        status: res.data.data.status,
        notes: res.data.data.notes || "",
      };
      setHistory((prev) => [newEvent, ...prev]);
      setOpenModal(false);
      setNotes("");
      setTime("09:00");
      showToast("Jadwal bimbingan berhasil diajukan.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Gagal mengajukan jadwal.", false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-10 flex flex-col w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-start gap-4">
          <Link
            href="/mahasiswa"
            className="mt-1 p-2 rounded-full hover:bg-[#EAF4FB] transition text-[#355872]"
          >
            <ArrowLeft size={32} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#355872]">Jadwal Bimbingan</h1>
            <p className="text-gray-500 mt-2">Pilih jadwal bimbingan yang tersedia</p>
          </div>
        </div>
        <div className="text-[#355872] font-medium mt-2">
          Dosen Pembimbing:
          <span className="ml-2 text-gray-600">{dosenNama}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-400">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : !bimbinganId ? (
        <div className="bg-white rounded-3xl border border-[#e6eef5] shadow-sm p-12 text-center text-gray-500">
          Belum ada bimbingan aktif. Jadwal tersedia setelah dosen pembimbing ditetapkan.
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-[#e6eef5] p-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="col-span-2">
              <Calendar
                onChange={handleDateClick}
                value={date}
                className="w-full border-none rounded-2xl"
              />
            </div>

            {/* Riwayat */}
            <div className="bg-[#EAF4FB] rounded-2xl border border-[#e6eef5] p-6 h-fit">
              <h2 className="text-xl font-bold text-[#355872] mb-6">Riwayat Bimbingan</h2>
              {history.length === 0 ? (
                <p className="text-gray-400 text-sm text-center">Belum ada riwayat.</p>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto">
                  {history.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-[#e6eef5]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#355872]">{idx + 1}.</span>
                        <div>
                          <span className="text-gray-700 text-sm">
                            {new Date(item.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <p className="text-xs text-gray-400">{item.time?.slice(0, 5)}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_CLASS[item.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_LABEL[item.status] ?? item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-[#355872] mb-4">Pengajuan Bimbingan</h2>

            <div className="bg-[#EAF4FB] text-[#355872] rounded-2xl px-5 py-4 font-semibold mb-6">
              {date instanceof Date
                ? date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#355872] mb-1">Jam</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#355872] mb-1">Catatan (opsional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Topik yang akan dibahas..."
                className="w-full rounded-xl border border-[#9CD5FF] px-4 py-3 outline-none focus:ring-2 focus:ring-[#7AAACE] resize-none text-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setOpenModal(false); setNotes(""); setTime("09:00"); }}
                className="px-5 py-2 rounded-xl border border-[#dbe9f4] text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#355872] hover:bg-[#7AAACE] text-white transition disabled:opacity-60 flex items-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Ajukan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-10 z-50">
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg text-white text-sm font-medium ${
              toast.ok ? "bg-[#355872]" : "bg-red-500"
            }`}
          >
            {toast.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
