"use client";

import { AlertCircle, X } from "lucide-react";

type Dosen = {
  id: number;
  nama: string;
};

type MahasiswaRow = {
  id: number;
  nama: string;
  topik: string;
  pembimbingId?: number;
};

interface DetailDosenProps {
  activeMahasiswa: MahasiswaRow | null;
  tempDosenId: number | null;
  showConfirm: boolean;
  dosenList: Dosen[];

  onClose: () => void;
  onSelectDosen: (id: number) => void;
  onShowConfirm: (show: boolean) => void;
  onAssign: () => void;
}

export default function DetailDosen({
  activeMahasiswa,
  tempDosenId,
  showConfirm,
  dosenList,
  onClose,
  onSelectDosen,
  onShowConfirm,
  onAssign,
}: DetailDosenProps) {
  if (!activeMahasiswa) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative border border-[#e6eef5]">

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer"
        >
          <X size={20} />
        </button>

        {!showConfirm ? (
          <>
            <h2 className="text-2xl font-bold text-[#355872] mb-2">
              Pilih Dosen Pembimbing
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Tentukan dosen pembimbing yang paling sesuai untuk usulan topik mahasiswa ini.
            </p>

            <div className="bg-[#EAF4FB] rounded-2xl p-5 border border-[#9CD5FF]/20 mb-6">
              <p className="text-xs font-bold text-[#355872]/70 uppercase tracking-wider mb-2">
                Mahasiswa & Topik
              </p>

              <h3 className="font-bold text-lg text-[#355872]">
                {activeMahasiswa.nama}
              </h3>

              <p className="text-sm text-gray-500 font-medium mt-0.5">
                NIM: 22720{activeMahasiswa.id}0{activeMahasiswa.id}
              </p>

              <div className="mt-3 pt-3 border-t border-[#9CD5FF]/20">
                <p className="text-sm text-[#355872] font-semibold">
                  Topik: {activeMahasiswa.topik}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-8 max-h-60 overflow-y-auto pr-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Daftar Dosen Tersedia
              </p>

              {dosenList.map((dosen) => {
                const isSelected = tempDosenId === dosen.id;

                return (
                  <div
                    key={dosen.id}
                    onClick={() => onSelectDosen(dosen.id)}
                    className={`
                      flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                      ${
                        isSelected
                          ? "border-[#355872] bg-[#355872]/5 shadow-sm"
                          : "border-[#e6eef5] hover:border-[#9CD5FF] hover:bg-[#F7F8F0]/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#355872] bg-[#355872]"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        )}
                      </div>

                      <span className="font-bold text-[#355872] text-sm">
                        {dosen.nama}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#f0f5fa] pt-5">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 font-semibold text-sm transition cursor-pointer"
              >
                Batal
              </button>

              <button
                disabled={tempDosenId === null}
                onClick={() => onShowConfirm(true)}
                className="px-5 py-2.5 rounded-xl bg-[#355872] text-white hover:bg-[#2c475d] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition shadow-md cursor-pointer"
              >
                Lanjutkan
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#355872] mb-6">
              Konfirmasi Penetapan
            </h2>

            <div className="space-y-5 mb-8">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3 text-amber-800">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />

                <p className="text-sm font-semibold">
                  Apakah Anda yakin ingin menetapkan dosen pembimbing berikut untuk mahasiswa ini?
                </p>
              </div>

              <div className="border border-[#e6eef5] rounded-2xl p-5 space-y-3 bg-[#F7F8F0]/50">
                <div>
                  <span className="text-xs text-gray-500 block font-semibold">
                    Mahasiswa
                  </span>

                  <span className="font-bold text-[#355872]">
                    {activeMahasiswa.nama}
                  </span>
                </div>

                <div className="border-t border-[#e6eef5] pt-2">
                  <span className="text-xs text-gray-500 block font-semibold">
                    Topik Usulan
                  </span>

                  <span className="font-semibold text-sm text-[#355872]">
                    {activeMahasiswa.topik}
                  </span>
                </div>

                <div className="border-t border-[#e6eef5] pt-2">
                  <span className="text-xs text-gray-500 block font-semibold">
                    Dosen Pembimbing Terpilih
                  </span>

                  <span className="font-bold text-[#355872] text-lg block mt-0.5">
                    {dosenList.find((d) => d.id === tempDosenId)?.nama}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#f0f5fa] pt-5">
              <button
                onClick={() => onShowConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-[#dbe9f4] text-gray-600 hover:bg-gray-50 font-semibold text-sm transition cursor-pointer"
              >
                Kembali
              </button>

              <button
                onClick={onAssign}
                className="px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-semibold text-sm transition shadow-md cursor-pointer"
              >
                Ya, Tetapkan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}