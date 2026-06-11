/**
 * Observer Pattern (FE):
 * - INotificationObserver: interface yang harus diimplementasi tiap subscriber
 * - NotificationSubject: publisher yang menyimpan list observer dan mengirim notifikasi
 *   Sekaligus Singleton agar satu instance dipakai di seluruh aplikasi dosen
 */

import api from "../../api";

export type Notification = {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
};

export interface INotificationObserver {
  onNotificationReceived(notifications: Notification[]): void;
}

export class NotificationSubject {
  private static instance: NotificationSubject;
  private observers: INotificationObserver[] = [];
  private notifications: Notification[] = [];

  private constructor() {}

  static getInstance(): NotificationSubject {
    if (!NotificationSubject.instance) {
      NotificationSubject.instance = new NotificationSubject();
    }
    return NotificationSubject.instance;
  }

  subscribe(observer: INotificationObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  unsubscribe(observer: INotificationObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  private notifyAll(): void {
    const current = this.getAll();
    this.observers.forEach((o) => o.onNotificationReceived(current));
  }

  public async loadFromApi(): Promise<void> {
    try {
      const res = await api.get("/notification/");
      const raw: any[] = res.data.data || [];
      this.notifications = raw.map((n) => ({
        id: n.id,
        message: n.message,
        timestamp: new Date(n.created_at).toLocaleString("id-ID"),
        read: n.is_read,
      }));
      this.notifyAll();
    } catch (_) {}
  }

  push(message: string): void {
    const newNotif: Notification = {
      id: Date.now(),
      message,
      timestamp: "Baru saja",
      read: false,
    };
    this.notifications.unshift(newNotif);
    this.notifyAll();
  }

  markAsRead(id: number): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifyAll();
    api.post(`/notification/${id}/mark-as-read/`).catch(() => {});
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.notifyAll();
    api.post("/notification/mark-all-as-read/").catch(() => {});
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notifyAll();
    api.delete(`/notification/${id}/`).catch(() => {});
  }

  getAll(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }
}
