
interface DistractionSettings {
  tabSwitchEnabled: boolean;
  tabSwitchShownToday: boolean;
  lastShownDate: string;
  globallyDisabled: boolean;
}

class DistractionSettingsManager {
  private readonly STORAGE_KEY = "distraction_settings";

  private getDefaultSettings(): DistractionSettings {
    return {
      tabSwitchEnabled: true,
      tabSwitchShownToday: false,
      lastShownDate: "",
      globallyDisabled: false,
    };
  }

  getSettings(): DistractionSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        
        // Reset daily flag if it's a new day
        const today = new Date().toDateString();
        if (settings.lastShownDate !== today) {
          settings.tabSwitchShownToday = false;
          settings.lastShownDate = today;
          this.saveSettings(settings);
        }
        
        return { ...this.getDefaultSettings(), ...settings };
      }
      return this.getDefaultSettings();
    } catch (error) {
      console.error("Failed to load distraction settings:", error);
      return this.getDefaultSettings();
    }
  }

  saveSettings(settings: Partial<DistractionSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error("Failed to save distraction settings:", error);
    }
  }

  shouldShowTabSwitchAlert(): boolean {
    const settings = this.getSettings();
    
    // Don't show if globally disabled
    if (settings.globallyDisabled || !settings.tabSwitchEnabled) {
      return false;
    }

    // Don't show if already shown today
    if (settings.tabSwitchShownToday) {
      return false;
    }

    // Don't show on start page
    if (window.location.pathname === "/" || window.location.pathname === "/auth") {
      return false;
    }

    return true;
  }

  markTabSwitchAlertShown(): void {
    const today = new Date().toDateString();
    this.saveSettings({
      tabSwitchShownToday: true,
      lastShownDate: today,
    });
  }

  disableTabSwitchAlerts(): void {
    this.saveSettings({
      tabSwitchEnabled: false,
    });
  }

  enableTabSwitchAlerts(): void {
    this.saveSettings({
      tabSwitchEnabled: true,
    });
  }

  isTabSwitchEnabled(): boolean {
    return this.getSettings().tabSwitchEnabled && !this.getSettings().globallyDisabled;
  }
}

export const distractionSettings = new DistractionSettingsManager();
