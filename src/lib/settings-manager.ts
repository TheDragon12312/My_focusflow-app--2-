export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: "nl" | "en";
  sounds: boolean;
  notifications: boolean;
  emailDigests: boolean;
  compactMode: boolean;
  defaultFocusTime: number;
  defaultBreakTime: number;
  longBreakTime: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  playSounds: boolean;
  soundVolume: number;
  enableAiCoach: boolean;
  aiCoaching: boolean;
  coachPersonality: string;
  insightFrequency: string;
  learningFromPatterns: boolean;
  personalizedTips: boolean;  
  productivityGoals: boolean;
  enableDetection: boolean;
  tabSwitchAlerts: boolean;
  tabSwitchAllowlist: string[];
  urlBlocking: boolean;
  strictMode: boolean;
  customBlockedSites: string[];
  allowList: string[];
  focusReminders: boolean;
  breakReminders: boolean;
  dailyReport: boolean;
  weeklyReport: boolean;
  achievementNotifications: boolean;
  distractionAlerts: boolean;
  accentColor: "blue" | "purple" | "green" | "orange";
  showStatistics: boolean;
  animationsEnabled: boolean;
  focusSettings: {
    defaultDuration: number;
    autoStartBreaks: boolean;
    strictMode: boolean;
  };
  productivity: {
    dailyGoal: number;
    weeklyGoal: number;
    enableAiCoach: boolean;
    autoStartBreaks: boolean;
    autoStartFocus: boolean;
    playSounds: boolean;
    soundVolume: number;
    coachPersonality: string;
    insightFrequency: string;
    learningFromPatterns: boolean;
    personalizedTips: boolean;
    productivityGoals: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReports: boolean;
  };
  distractionBlocking: {
    enableDetection: boolean;
    tabSwitchAlerts: boolean;
    tabSwitchAllowlist: string[];
    urlBlocking: boolean;
    strictMode: boolean;
    customBlockedSites: string[];
    allowList: string[];
  };
  notifications_settings: {
    focusReminders: boolean;
    breakReminders: boolean;
    dailyReport: boolean;
    weeklyReport: boolean;
    achievementNotifications: boolean;
  };
  emailNotifications: {
    emailDigests: boolean;
    dailyReport: boolean;
    weeklyReport: boolean;
    focusReminders: boolean;
    breakReminders: boolean;
    achievementNotifications: boolean;
  };
}

export class SettingsManager {
  private static readonly STORAGE_KEY = "focusflow_settings";

  // Default settings
  private static readonly DEFAULT_SETTINGS: AppSettings = {
    theme: "system",
    language: "nl",
    sounds: true,
    notifications: true,
    emailDigests: true,
    compactMode: false,
    defaultFocusTime: 25,
    defaultBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: true,
    autoStartFocus: false,
    playSounds: true,
    soundVolume: 0.7,
    enableAiCoach: true,
    aiCoaching: true,
    coachPersonality: "encouraging",
    insightFrequency: "daily",
    learningFromPatterns: true,
    personalizedTips: true,
    productivityGoals: true,
    enableDetection: false,
    tabSwitchAlerts: true,
    tabSwitchAllowlist: [],
    urlBlocking: false,
    strictMode: false,
    customBlockedSites: [],
    allowList: [],
    focusReminders: true,
    breakReminders: true,
    dailyReport: true,
    weeklyReport: true,
    achievementNotifications: true,
    distractionAlerts: true,
    accentColor: "blue",
    showStatistics: true,
    animationsEnabled: true,
    focusSettings: {
      defaultDuration: 25,
      autoStartBreaks: true,
      strictMode: false,
    },
    productivity: {
      dailyGoal: 4,
      weeklyGoal: 20,
      enableAiCoach: true,
      autoStartBreaks: true,
      autoStartFocus: false,
      playSounds: true,
      soundVolume: 0.7,
      coachPersonality: "encouraging",
      insightFrequency: "daily",
      learningFromPatterns: true,
      personalizedTips: true,
      productivityGoals: true,
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      crashReports: true,
    },
    distractionBlocking: {
      enableDetection: false,
      tabSwitchAlerts: true,
      tabSwitchAllowlist: [],
      urlBlocking: false,
      strictMode: false,
      customBlockedSites: [],
      allowList: [],
    },
    notifications_settings: {
      focusReminders: true,
      breakReminders: true,
      dailyReport: true,
      weeklyReport: true,
      achievementNotifications: true,
    },
    emailNotifications: {
      emailDigests: true,
      dailyReport: true,
      weeklyReport: true,
      focusReminders: true,
      breakReminders: true,
      achievementNotifications: true,
    },
  };

  // Get all settings
  static getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return { ...this.DEFAULT_SETTINGS, ...parsedSettings };
      }
      return this.DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Failed to load settings:", error);
      return this.DEFAULT_SETTINGS;
    }
  }

  // Save settings
  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));

      // Apply theme immediately
      this.applyTheme(settings.theme);

      // Apply compact mode
      this.applyCompactMode(settings.compactMode);

      console.log("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  // Update specific setting
  static updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ): void {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, [key]: value };
    this.saveSettings(updatedSettings);
  }

  // Apply theme
  private static applyTheme(theme: "light" | "dark" | "system"): void {
    const root = document.documentElement;

    if (theme === "system") {
      // Use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }

  // Apply compact mode
  private static applyCompactMode(compactMode: boolean): void {
    const root = document.documentElement;
    root.classList.toggle("compact", compactMode);

    if (compactMode) {
      root.style.setProperty("--spacing-unit", "0.75rem");
      root.style.setProperty("--padding-base", "0.5rem");
    } else {
      root.style.setProperty("--spacing-unit", "1rem");
      root.style.setProperty("--padding-base", "1rem");
    }
  }

  // Initialize settings on app load
  static initialize(): void {
    const settings = this.getSettings();
    this.applyTheme(settings.theme);
    this.applyCompactMode(settings.compactMode);

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        const currentSettings = this.getSettings();
        if (currentSettings.theme === "system") {
          this.applyTheme("system");
        }
      });
  }

  // Reset to defaults
  static resetToDefaults(): void {
    this.saveSettings(this.DEFAULT_SETTINGS);
  }

  // Export settings
  static exportSettings(): string {
    return JSON.stringify(this.getSettings(), null, 2);
  }

  // Import settings
  static importSettings(settingsJson: string): boolean {
    try {
      const importedSettings = JSON.parse(settingsJson);
      // Validate settings structure
      const validatedSettings = {
        ...this.DEFAULT_SETTINGS,
        ...importedSettings,
      };
      this.saveSettings(validatedSettings);
      return true;
    } catch (error) {
      console.error("Failed to import settings:", error);
      return false;
    }
  }

  // Get specific setting
  static getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    const settings = this.getSettings();
    return settings[key];
  }

  // Get section of settings (alias for getSetting for complex objects)
  static getSection<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.getSetting(key);
  }
}

// Initialize settings when module loads
if (typeof window !== "undefined") {
  SettingsManager.initialize();
}
