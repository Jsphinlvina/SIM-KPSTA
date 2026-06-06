/**
 * Observer Pattern (FE):
 * - INotificationObserver: interface yang harus diimplementasi tiap subscriber
 * - NotificationSubject: publisher yang menyimpan list observer dan mengirim notifikasi
 *   Sekaligus Singleton agar satu instance dipakai di seluruh aplikasi dosen
 */

export type Notification = {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
};

// ─── Observer Interface ────────────────────────────────────────────────────────
export interface INotificationObserver {
  onNotificationReceived(notifications: Notification[]): void;
}

// ─── Subject (Singleton) ───────────────────────────────────────────────────────
export class NotificationSubject {
  private static instance: NotificationSubject;
  private observers: INotificationObserver[] = [];
  private notifications: Notification[] = [
    {
      id: 1,
      message: "Mahasiswa Andi Saputra mengajukan jadwal bimbingan",
      timestamp: "5 menit lalu",
      read: false,
    },
    {
      id: 2,
      message: "Mahasiswa Budi Hartono mengirimkan topik mandiri baru",
      timestamp: "1 jam lalu",
      read: false,
    },
    {
      id: 3,
      message: "Pengajuan topik dari Citra Lestari menunggu persetujuan",
      timestamp: "2 jam lalu",
      read: true,
    },
  ];

  // Singleton: konstruktor private
  private constructor() {}

  // Singleton: satu-satunya cara akses instance
  static getInstance(): NotificationSubject {
    if (!NotificationSubject.instance) {
      NotificationSubject.instance = new NotificationSubject();
    }
    return NotificationSubject.instance;
  }

  // Subscribe observer
  subscribe(observer: INotificationObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  // Unsubscribe observer
  unsubscribe(observer: INotificationObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  // Notify semua observer dengan state terbaru
  private notifyAll(): void {
    const current = this.getAll();
    this.observers.forEach((o) => o.onNotificationReceived(current));
  }

  // Tambah notifikasi baru dan broadcast ke semua observer
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

  // Tandai satu notif sebagai dibaca
  markAsRead(id: number): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifyAll();
  }

  // Tandai semua sebagai dibaca
  markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.notifyAll();
  }

  getAll(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }
}
