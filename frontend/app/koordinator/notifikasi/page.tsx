"use client";

import { useEffect, useState } from "react";
import { X, Bell, CheckCheck } from "lucide-react";
import {
  KoordinatorNotificationSubject,
  KoordinatorNotification,
  IKoordinatorNotificationObserver,
} from "./notification-subject";

interface NotificationPopupProps {
  onClose: () => void;
}

export default function NotificationPopup({
  onClose,
}: NotificationPopupProps) {
  const [notifications, setNotifications] = useState<KoordinatorNotification[]>([]);

  useEffect(() => {
    const subject = KoordinatorNotificationSubject.getInstance();
    setNotifications([...subject.getNotifications()]);

    const observer: IKoordinatorNotificationObserver = {
      onNotificationReceived(notifs) {
        setNotifications([...notifs]);
      },
    };

    subject.registerObserver(observer);
    subject.loadFromApi();

    return () => {
      subject.removeObserver(observer);
    };
  }, []);

  const handleMarkAllRead = () => {
    KoordinatorNotificationSubject.getInstance().markAllAsRead();
  };

  const handleMarkRead = (id: number) => {
    KoordinatorNotificationSubject.getInstance().markAsRead(id);
  };

  const handleClearAll = () => {
    KoordinatorNotificationSubject.getInstance().clearAll();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className="
        absolute
        top-28
        right-28
        w-[380px]
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
          px-6
          py-4
          border-b
          border-[#eef4f8]
        "
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[#355872]">
            Notifikasi
          </h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {unreadCount} baru
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="
                p-1.5
                rounded-lg
                text-gray-400
                hover:text-[#355872]
                hover:bg-gray-100
                transition
                cursor-pointer
              "
              title="Tandai semua dibaca"
            >
              <CheckCheck size={16} />
            </button>
          )}

          <button
            onClick={onClose}
            className="
              p-1.5
              rounded-lg
              text-gray-500
              hover:bg-gray-100
              transition
              cursor-pointer
            "
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* List Notification */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-[#f3f6f9]">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => handleMarkRead(item.id)}
            className={`
              flex
              items-start
              gap-3
              px-6
              py-4
              transition
              cursor-pointer
              ${item.isRead ? "bg-white hover:bg-[#F8FBFD]" : "bg-[#EAF4FB]/30 hover:bg-[#EAF4FB]/50"}
            `}
          >
            <div
              className={`
                w-9
                h-9
                rounded-full
                flex
                items-center
                justify-center
                shrink-0
                ${item.isRead ? "bg-gray-100 text-gray-400" : "bg-[#EAF4FB] text-[#355872]"}
              `}
            >
              <Bell size={16} />
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-relaxed ${item.isRead ? "text-gray-500" : "text-[#355872] font-semibold"}`}>
                {item.message}
              </p>

              <span className="text-xs text-gray-400 font-medium mt-1 inline-block">
                {item.time}
              </span>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400 font-medium">
            Tidak ada notifikasi baru.
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 text-center border-t border-[#eef4f8]">
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition cursor-pointer"
          >
            Bersihkan semua
          </button>
        </div>
      )}
    </div>
  );
}