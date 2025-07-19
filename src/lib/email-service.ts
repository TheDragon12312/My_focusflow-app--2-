export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  labels: string[];
}

export interface EmailSettings {
  autoReply: boolean;
  autoReplyMessage: string;
  notifications: boolean;
  dailyReport: boolean;
  weeklyReport: boolean;
}

export class EmailService {
  private static readonly STORAGE_KEY = "email_service_data";

  // Get email settings
  static getSettings(): EmailSettings {
    try {
      const stored = localStorage.getItem(EmailService.STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};
      return {
        autoReply: data.autoReply || false,
        autoReplyMessage:
          data.autoReplyMessage ||
          "I'm currently in a focus session and will respond later.",
        notifications: data.notifications || true,
        dailyReport: data.dailyReport || false,
        weeklyReport: data.weeklyReport || false,
      };
    } catch {
      return {
        autoReply: false,
        autoReplyMessage:
          "I'm currently in a focus session and will respond later.",
        notifications: true,
        dailyReport: false,
        weeklyReport: false,
      };
    }
  }

  // Save email settings
  static saveSettings(settings: EmailSettings): void {
    try {
      localStorage.setItem(EmailService.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save email settings:", error);
    }
  }

  // Get mock emails
  static getEmails(): EmailMessage[] {
    return [
      {
        id: "1",
        from: "colleague@company.com",
        to: "you@company.com",
        subject: "Project Update",
        body: "Hey, can you review the latest project updates?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        labels: ["work", "urgent"],
      },
      {
        id: "2",
        from: "manager@company.com",
        to: "you@company.com",
        subject: "Meeting Tomorrow",
        body: "Don't forget about our meeting tomorrow at 2 PM.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: true,
        labels: ["work", "meeting"],
      },
    ];
  }

  // Get email history for specific user
  static getEmailHistory(userId: string): EmailMessage[] {
    console.log(`Getting email history for user: ${userId}`);
    return EmailService.getEmails();
  }

  // Send daily report for specific user
  static async sendDailyReport(
    userId: string,
    email: string,
  ): Promise<boolean> {
    try {
      console.log(
        `Sending daily productivity report to ${email} for user ${userId}`,
      );
      // In a real app, this would send an email via API
      return true;
    } catch (error) {
      console.error("Failed to send daily report:", error);
      return false;
    }
  }

  // Send weekly report for specific user
  static async sendWeeklyReport(
    userId: string,
    email: string,
  ): Promise<boolean> {
    try {
      console.log(
        `Sending weekly productivity report to ${email} for user ${userId}`,
      );
      // In a real app, this would send an email via API
      return true;
    } catch (error) {
      console.error("Failed to send weekly report:", error);
      return false;
    }
  }

  // Send focus reminder
  static async sendFocusReminder(
    userId: string,
    email: string,
    message: string,
  ): Promise<boolean> {
    try {
      console.log(`Sending focus reminder to ${email}: ${message}`);
      // In a real app, this would send an email via API
      return true;
    } catch (error) {
      console.error("Failed to send focus reminder:", error);
      return false;
    }
  }

  // Send achievement notification
  static async sendAchievementNotification(
    userId: string,
    email: string,
    achievement: string,
  ): Promise<boolean> {
    try {
      console.log(
        `Sending achievement notification to ${email}: ${achievement}`,
      );
      // In a real app, this would send an email via API
      return true;
    } catch (error) {
      console.error("Failed to send achievement notification:", error);
      return false;
    }
  }

  // Mark email as read
  static markAsRead(emailId: string): void {
    console.log(`Marking email ${emailId} as read`);
    // In a real app, this would update the email status
  }

  // Archive email
  static archiveEmail(emailId: string): void {
    console.log(`Archiving email ${emailId}`);
    // In a real app, this would archive the email
  }

  // Delete email
  static deleteEmail(emailId: string): void {
    console.log(`Deleting email ${emailId}`);
    // In a real app, this would delete the email
  }

  // Send email
  static async sendEmail(
    to: string,
    subject: string,
    body: string,
  ): Promise<boolean> {
    try {
      console.log(`Sending email to ${to}: ${subject}`);
      // In a real app, this would send the email via API
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }

  // Get unread count
  static getUnreadCount(): number {
    return EmailService.getEmails().filter((email) => !email.isRead).length;
  }
}
