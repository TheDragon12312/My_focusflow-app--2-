export interface DistractionEvent {
  id: string;
  timestamp: Date;
  type: "website" | "application" | "notification";
  source: string;
  description: string;
  blocked: boolean;
  duration?: number; // in seconds
}

export interface DistractionSettings {
  enabled: boolean;
  blockedWebsites: string[];
  allowedWebsites: string[];
  blockSocialMedia: boolean;
  blockNews: boolean;
  blockVideo: boolean;
  blockGaming: boolean;
  workingHours: {
    start: string;
    end: string;
    enabledDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  };
  breakTimeAllowance: number; // minutes per hour
}

class DistractionDetectorService {
  private isActive: boolean = false;
  private blockedSites: Set<string> = new Set();
  private distractionLog: DistractionEvent[] = [];
  private readonly STORAGE_KEY = "distraction_detector_data";
  private distractionCallback: ((event: any) => void) | null = null;

  // Common distracting websites
  private readonly DEFAULT_BLOCKED_SITES = [
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "youtube.com",
    "tiktok.com",
    "reddit.com",
    "linkedin.com",
    "snapchat.com",
    "netflix.com",
    "twitch.tv",
    "discord.com",
    "slack.com",
    "whatsapp.com",
    "telegram.org",
  ];

  constructor() {
    this.loadSettingsFromStorage();
    this.setupEventListeners();
  }

  // Load settings from storage
  private loadSettingsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        this.blockedSites = new Set(
          settings.blockedSites || this.DEFAULT_BLOCKED_SITES,
        );
        this.isActive = settings.isActive || false;
      } else {
        this.blockedSites = new Set(this.DEFAULT_BLOCKED_SITES);
      }
    } catch (error) {
      console.error("Failed to load distraction detector settings:", error);
      this.blockedSites = new Set(this.DEFAULT_BLOCKED_SITES);
    }
  }

  // Save settings to storage
  private saveSettings(): void {
    try {
      const settings = {
        blockedSites: Array.from(this.blockedSites),
        isActive: this.isActive,
        distractionLog: this.distractionLog,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save distraction detector settings:", error);
    }
  }

  // Setup event listeners for detection
  private setupEventListeners(): void {
    if (typeof window === "undefined") return;

    // Listen for focus/blur events to detect tab switching
    window.addEventListener("blur", () => {
      if (this.isActive) {
        this.logDistraction(
          "application",
          "window",
          "User switched away from application",
        );
      }
    });

    window.addEventListener("focus", () => {
      if (this.isActive) {
        console.log("User returned to FocusFlow application");
      }
    });

    // Listen for page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (this.isActive && document.hidden) {
        this.logDistraction(
          "application",
          "tab",
          "User switched to another tab",
        );
      }
    });
  }

  // Start distraction detection
  start(): void {
    this.isActive = true;
    this.saveSettings();
    console.log("���️ Distraction detection started");

    // Show notification
    this.showNotification(
      "Distraction Detection Enabled",
      "FocusFlow is now monitoring for distractions",
    );
  }

  // Stop distraction detection
  stop(): void {
    this.isActive = false;
    this.saveSettings();
    console.log("🛡️ Distraction detection stopped");
  }

  // Check if currently active
  isEnabled(): boolean {
    return this.isActive;
  }

  // Stop monitoring (alias for stop)
  stopMonitoring(): void {
    this.stop();
  }

  // Start monitoring with user ID
  startMonitoring(userId: string): void {
    console.log(`Starting distraction monitoring for user: ${userId}`);
    this.start();
  }

  // Load settings for user (overloaded method)
  loadSettings(userId?: string): void {
    if (userId) {
      console.log(`Loading distraction settings for user: ${userId}`);
    }
    this.loadSettingsFromStorage();
  }

  // Set callback for distraction events
  onDistraction(callback: (event: any) => void): void {
    this.distractionCallback = callback;
  }

  // Add website to blocked list
  blockWebsite(url: string): void {
    this.blockedSites.add(url.toLowerCase());
    this.saveSettings();
  }

  // Remove website from blocked list
  unblockWebsite(url: string): void {
    this.blockedSites.delete(url.toLowerCase());
    this.saveSettings();
  }

  // Get blocked websites
  getBlockedWebsites(): string[] {
    return Array.from(this.blockedSites);
  }

  // Check if website is blocked
  isWebsiteBlocked(url: string): boolean {
    const domain = this.extractDomain(url);
    return this.blockedSites.has(domain.toLowerCase());
  }

  // Extract domain from URL
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url.replace("www.", "");
    }
  }

  // Log a distraction event
  private logDistraction(
    type: DistractionEvent["type"],
    source: string,
    description: string,
  ): void {
    const event: DistractionEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      source,
      description,
      blocked: true,
    };

    this.distractionLog.push(event);
    this.saveSettings();

    // Show blocking notification
    this.showBlockingNotification(source, description);

    // Trigger callback if set
    if (this.distractionCallback) {
      // Convert to format expected by DistractionMonitor
      const alertEvent = {
        id: event.id,
        type: type === "website" ? "suspicious_url" : ("tab_switch" as const),
        details: description,
        severity: "medium" as const,
        timestamp: event.timestamp.toISOString(),
      };
      this.distractionCallback(alertEvent);
    }
  }

  // Get distraction log
  getDistractionLog(): DistractionEvent[] {
    return [...this.distractionLog];
  }

  // Get today's distractions
  getTodaysDistractions(): DistractionEvent[] {
    const today = new Date().toDateString();
    return this.distractionLog.filter(
      (event) => event.timestamp.toDateString() === today,
    );
  }

  // Clear distraction log
  clearLog(): void {
    this.distractionLog = [];
    this.saveSettings();
  }

  // Get distraction statistics
  getStats(): {
    totalBlocked: number;
    todayBlocked: number;
    mostBlockedSite: string;
    averagePerDay: number;
  } {
    const totalBlocked = this.distractionLog.length;
    const todayBlocked = this.getTodaysDistractions().length;

    // Count by source
    const sourceCounts: { [key: string]: number } = {};
    this.distractionLog.forEach((event) => {
      sourceCounts[event.source] = (sourceCounts[event.source] || 0) + 1;
    });

    const mostBlockedSite = Object.keys(sourceCounts).reduce(
      (a, b) => (sourceCounts[a] > sourceCounts[b] ? a : b),
      "",
    );

    // Calculate average per day
    const firstEvent = this.distractionLog[0];
    const daysSinceFirst = firstEvent
      ? Math.max(
          1,
          Math.ceil(
            (Date.now() - firstEvent.timestamp.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;
    const averagePerDay = Math.round(totalBlocked / daysSinceFirst);

    return {
      totalBlocked,
      todayBlocked,
      mostBlockedSite,
      averagePerDay,
    };
  }

  // Show notification - disabled for distractions to avoid duplicate notifications
  private showNotification(title: string, message: string): void {
    // Browser notifications disabled for distractions to prevent duplicate notifications
    // We only use the blocking notification (yellow box) for distractions
  }

  // Show blocking notification
  private showBlockingNotification(source: string, description: string): void {
    // Remove any existing blocking notification
    const existing = document.querySelector('.focusflow-blocking-notification');
    if (existing) existing.remove();
    // Create visual blocking notification
    const notification = document.createElement("div");
    notification.className =
      "focusflow-blocking-notification fixed top-4 right-4 bg-red-100 border border-red-300 rounded-lg p-4 shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300";
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="text-red-600">🚫</div>
        <div>
          <h4 class="font-medium text-red-900">Distraction Blocked!</h4>
          <p class="text-sm text-red-700 mt-1">${description}</p>
          <p class="text-xs text-red-600 mt-1">Source: ${source}</p>
          <button onclick="this.closest('.focusflow-blocking-notification').remove()" class="text-xs text-red-600 mt-2 underline">Dismiss</button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  // Simulate website visit (for demo purposes)
  simulateWebsiteVisit(url: string): boolean {
    if (this.isActive && this.isWebsiteBlocked(url)) {
      this.logDistraction(
        "website",
        url,
        `Attempted to visit blocked website: ${url}`,
      );
      return true; // blocked
    }
    return false; // allowed
  }
}

export const distractionDetector = new DistractionDetectorService();

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).distractionDetector = distractionDetector;
}
