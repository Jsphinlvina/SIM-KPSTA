/**
 * Design Patterns (FE):
 * 1. Observer Pattern — IKoordinatorNotificationObserver / KoordinatorNotificationSubject
 * 2. Singleton Pattern — KoordinatorNotificationSubject
 */

import api from "../../api";

export interface KoordinatorNotification {
  id: number;
  message: string;
  isRead: boolean;
  time: string;
}

export interface IKoordinatorNotificationObserver {
  onNotificationReceived(notifs: KoordinatorNotification[]): void;
}

export class KoordinatorNotificationSubject {
  private static instance: KoordinatorNotificationSubject | null = null;
  private observers: IKoordinatorNotificationObserver[] = [];
  private notifications: KoordinatorNotification[] = [];

  private constructor() {}

  public static getInstance(): KoordinatorNotificationSubject {
    if (!KoordinatorNotificationSubject.instance) {
      KoordinatorNotificationSubject.instance = new KoordinatorNotificationSubject();
    }
    return KoordinatorNotificationSubject.instance;
  }

  public registerObserver(observer: IKoordinatorNotificationObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public removeObserver(observer: IKoordinatorNotificationObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notifyAll(): void {
    for (const observer of this.observers) {
      observer.onNotificationReceived([...this.notifications]);
    }
  }

  public getNotifications(): KoordinatorNotification[] {
    return this.notifications;
  }

  public async loadFromApi(): Promise<void> {
    try {
      const res = await api.get("/notification/");
      const raw: any[] = res.data.data || [];
      this.notifications = raw.map((n) => ({
        id: n.id,
        message: n.message,
        isRead: n.is_read,
        time: new Date(n.created_at).toLocaleString("id-ID"),
      }));
      this.notifyAll();
    } catch (_) {}
  }

  public addNotification(message: string): void {
    const newNotif: KoordinatorNotification = {
      id: Date.now(),
      message,
      isRead: false,
      time: "Baru saja",
    };
    this.notifications.unshift(newNotif);
    this.notifyAll();
  }

  public markAsRead(id: number): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notifyAll();
    api.post(`/notification/${id}/mark-as-read/`).catch(() => {});
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notifyAll();
    api.post("/notification/mark-all-as-read/").catch(() => {});
  }

  public deleteNotification(id: number): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notifyAll();
    api.delete(`/notification/${id}/`).catch(() => {});
  }

  public clearAll(): void {
    this.notifications = [];
    this.notifyAll();
  }
}
