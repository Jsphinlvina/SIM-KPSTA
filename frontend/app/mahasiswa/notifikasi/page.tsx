"use client";

import { X, Bell } from "lucide-react";

interface NotificationPopupProps {
  onClose: () => void;
}

export default function NotificationPopup({
  onClose,
}: NotificationPopupProps) {
  const notifications = [
    "Pengajuan topik telah disetujui",
    "Pengajuan jadwal bimbingan telah disetujui",
    "Dosen pembimbing telah ditentukan",
  ];

  return (
    <div
      className="
        absolute
        top-28
        right-28
        w-[360px]
        bg-white
        rounded-3xl
        border
        border-[#dbe9f4]
        shadow-xl
        overflow-hidden
        z-50
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          py-4
          border-b
          border-[#eef4f8]
        "
      >
        <h3 className="font-semibold text-[#355872]">
          Notifikasi
        </h3>

        <button
          onClick={onClose}
          className="
            p-1
            rounded-lg
            text-gray-500
            hover:bg-gray-100
            transition
          "
        >
          <X size={18} />
        </button>
      </div>

      {/* List Notification */}
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="
              flex
              items-start
              gap-3
              px-5
              py-4
              border-b
              border-[#f3f6f9]
              hover:bg-[#F8FBFD]
              transition
              cursor-pointer
            "
          >
            <div
              className="
                w-9
                h-9
                rounded-full
                bg-[#EAF4FB]
                flex
                items-center
                justify-center
                text-[#355872]
                shrink-0
              "
            >
              <Bell size={16} />
            </div>

            <div>
              <p className="text-[#355872] text-sm leading-relaxed">
                {item}
              </p>

              <span className="text-xs text-gray-400">
                Baru saja
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}