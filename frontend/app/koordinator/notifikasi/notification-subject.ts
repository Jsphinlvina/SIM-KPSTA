/**
 * Design Patterns (FE):
 * 
 * 1. Observer Pattern:
 *    - IKoordinatorNotificationObserver: interface untuk subscriber notifikasi.
 *    - KoordinatorNotificationSubject (Subject): publisher yang memberitahu observer ketika ada notifikasi baru.
 * 
 * 2. Singleton Pattern:
 *    - KoordinatorNotificationSubject: satu instance penyimpan notifikasi koordinator.
 */

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

  private constructor() {
    // Mock initial notifications
    this.notifications = [
      {
        id: 1,
        message: "Mahasiswa Andi Saputra mengajukan topik mandiri baru.",
        isRead: false,
        time: "Baru saja",
      },
      {
        id: 2,
        message: "Dosen Budi Santoso menyetujui jadwal bimbingan Budi Hartono.",
        isRead: false,
        time: "10 menit lalu",
      },
      {
        id: 3,
        message: "Mahasiswa Citra Lestari mengunggah laporan revisi KP.",
        isRead: true,
        time: "1 jam lalu",
      },
    ];
  }

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

  public markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notifyAll();
  }

  public clearAll(): void {
    this.notifications = [];
    this.notifyAll();
  }
}
