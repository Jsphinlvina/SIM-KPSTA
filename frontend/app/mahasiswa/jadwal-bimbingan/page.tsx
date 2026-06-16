"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
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

interface Slot {
  start: string;
  end: string;
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

  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [checkingTime, setCheckingTime] = useState(false);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const getSelectedDate = (): string | null => {
    if (date instanceof Date) return date.toISOString().split("T")[0];
    if (Array.isArray(date) && date[0]) return (date[0] as Date).toISOString().split("T")[0];
    return null;
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
        setBimbinganId(bim.bimbingan_id);
        setLecturerId(bim.dosen);
        setDosenNama(bim.dosen_detail?.nama_lengkap ?? "—");

        const guidRes = await api.get(`/guidance/by-bimbingan/${bim.bimbingan_id}/`);
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

  // Fetch open slots when modal opens for a given date
  useEffect(() => {
    if (!openModal || !lecturerId) return;
    const selectedDate = getSelectedDate();
    if (!selectedDate) return;

    setSlotsLoading(true);
    setSlots([]);
    setAvailability(null);
    api
      .get(`/availability/slots/?lecturer_id=${lecturerId}&date=${selectedDate}`)
      .then((res) => setSlots(res.data.data?.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [openModal, lecturerId, date]);

  // Debounced availability check for the chosen time
  useEffect(() => {
    if (!openModal || !lecturerId || !time) return;
    const selectedDate = getSelectedDate();
    if (!selectedDate) return;

    setAvailability(null);
    setCheckingTime(true);
    const timer = setTimeout(() => {
      api
        .get(`/availability/check/?lecturer_id=${lecturerId}&date=${selectedDate}&time=${time}`)
        .then((res) => setAvailability(res.data.data?.available ?? null))
        .catch(() => setAvailability(null))
        .finally(() => setCheckingTime(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [time, openModal, lecturerId, date]);

  const handleDateClick = (value: Value) => {
    setDate(value);
    setTime("09:00");
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!bimbinganId || !lecturerId) return;
    if (availability === false) {
      showToast("Dosen tidak tersedia pada waktu ini. Pilih slot yang tersedia.", false);
      return;
    }

    const selectedDate = getSelectedDate();
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
            <div className="col-span-2">
              <Calendar
                onChange={handleDateClick}
                value={date}
                className="w-full border-none rounded-2xl"
              />
            </div>

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

      {/* Booking Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-[#355872] mb-4">Pengajuan Bimbingan</h2>

            <div className="bg-[#EAF4FB] text-[#355872] rounded-2xl px-5 py-4 font-semibold mb-5">
              {date instanceof Date
                ? date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </div>

            {/* Available slots */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-[#355872] mb-2 flex items-center gap-1.5">
                <Clock size={13} />
                Slot Tersedia (09:00 – 15:00)
              </p>
              {slotsLoading ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-20 rounded-lg bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">
                  Tidak ada slot tersedia pada hari ini.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.start}
                      onClick={() => setTime(s.start)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        time === s.start
                          ? "bg-[#355872] text-white border-[#355872]"
                          : "bg-white text-[#355872] border-[#9CD5FF] hover:bg-[#EAF4FB]"
                      }`}
                    >
                      {s.start}–{s.end}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time input with availability badge */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#355872] mb-1">Jam</label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1 h-11 rounded-xl border border-[#9CD5FF] px-4 outline-none focus:ring-2 focus:ring-[#7AAACE]"
                />
                {checkingTime ? (
                  <Loader2 size={16} className="animate-spin text-gray-400 shrink-0" />
                ) : availability === true ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600 shrink-0">
                    <CheckCircle2 size={15} /> Tersedia
                  </span>
                ) : availability === false ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-red-500 shrink-0">
                    <AlertCircle size={15} /> Bentrok
                  </span>
                ) : null}
              </div>
              {availability === false && (
                <p className="text-xs text-red-500 mt-1.5">
                  Dosen sudah ada jadwal lain. Pilih slot di atas atau ganti waktu.
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-[#355872] mb-1">
                Catatan (opsional)
              </label>
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
                onClick={() => {
                  setOpenModal(false);
                  setNotes("");
                  setTime("09:00");
                }}
                className="px-5 py-2 rounded-xl border border-[#dbe9f4] text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || availability === false || checkingTime}
                className="px-5 py-2 rounded-xl bg-[#355872] hover:bg-[#7AAACE] text-white transition disabled:opacity-60 flex items-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Ajukan
              </button>
            </div>
          </div>
        </div>
      )}

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
