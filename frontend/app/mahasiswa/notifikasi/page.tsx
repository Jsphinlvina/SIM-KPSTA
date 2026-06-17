"use client";

import { useEffect, useState } from "react";
import { X, Bell, CheckCheck } from "lucide-react";
import api from "../../api";

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationPopupProps {
  onClose: () => void;
}

export default function NotificationPopup({ onClose }: NotificationPopupProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    api.get("/notification/")
      .then((res) => setNotifications(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleMarkRead = (id: number) => {
    api.post(`/notification/${id}/mark-as-read/`).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    api.post("/notification/mark-all-as-read/").catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="absolute top-28 right-28 w-[380px] bg-white rounded-3xl border border-[#dbe9f4] shadow-xl overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#eef4f8]">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[#355872]">Notifikasi</h3>
          {unreadCount > 0 && (
            <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unreadCount} baru
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#355872] hover:bg-gray-100 transition cursor-pointer"
              title="Tandai semua dibaca"
            >
              <CheckCheck size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* List Notification */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-[#f3f6f9]">
        {notifications.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 font-medium">
            Tidak ada notifikasi.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkRead(item.id)}
              className={`flex items-start gap-3 px-5 py-4 transition cursor-pointer ${
                item.is_read ? "bg-white hover:bg-[#F8FBFD]" : "bg-[#EAF4FB]/30 hover:bg-[#EAF4FB]/50"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  item.is_read ? "bg-gray-100 text-gray-400" : "bg-[#EAF4FB] text-[#355872]"
                }`}
              >
                <Bell size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${item.is_read ? "text-gray-500" : "text-[#355872] font-semibold"}`}>
                  {item.message}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(item.created_at).toLocaleString("id-ID")}
                </span>
              </div>
              {!item.is_read && (
                <div className="w-2 h-2 rounded-full bg-[#355872] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
