export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actions?: Array<{
    label: string;
    action: string;
    style: "primary" | "secondary";
  }>;
  psychology?: string;
  persistent?: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  browserNotifications: boolean;
  soundEnabled: boolean;
  focusReminders: boolean;
  breakReminders: boolean;
  achievementNotifications: boolean;
}

interface NotificationOptions {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  actionable?: boolean;
  actions?: Array<{
    label: string;
    action: string;
    style: "primary" | "secondary";
  }>;
  psychology?: string;
  persistent?: boolean;
}

class NotificationService {
  private notifications: AppNotification[] = [];
  private settings: NotificationSettings = {
    enabled: true,
    browserNotifications: true,
    soundEnabled: true,
    focusReminders: true,
    breakReminders: true,
    achievementNotifications: true,
  };
  private idCounter = 0;

  private generateUniqueId(): string {
    // Combine timestamp with counter and random number for uniqueness
    this.idCounter += 1;
    return `${Date.now()}-${this.idCounter}-${Math.random().toString(36).substr(2, 9)}`;
  }

  showNotification(options: NotificationOptions) {
    if (!this.settings.enabled) return;

    const notification: AppNotification = {
      id: this.generateUniqueId(),
      title: options.title,
      message: options.message,
      type: options.type,
      timestamp: new Date(),
      read: false,
      actionable: options.actionable,
      actions: options.actions,
      psychology: options.psychology,
      persistent: options.persistent,
    };

    this.notifications.unshift(notification);

    // Console log for development
    console.log(
      `[${options.type.toUpperCase()}] ${options.title}: ${options.message}`,
    );

    // Browser notification if enabled and permission granted
    if (
      this.settings.browserNotifications &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(options.title, {
        body: options.message,
        icon: "/favicon.ico",
      });
    }
  }

  showAchievement(title: string, message: string) {
    this.showNotification({
      title,
      message,
      type: "success",
      psychology: "achievement",
    });
  }

  getNotifications(): AppNotification[] {
    return this.notifications;
  }

  getSettings(): NotificationSettings {
    return this.settings;
  }

  updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
  }

  clearAllNotifications() {
    this.notifications = [];
  }

  requestPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
}

export const notificationService = new NotificationService();

// Make it available globally for backward compatibility
declare global {
  interface Window {
    notificationService: NotificationService;
  }
}

if (typeof window !== "undefined") {
  window.notificationService = notificationService;
}
