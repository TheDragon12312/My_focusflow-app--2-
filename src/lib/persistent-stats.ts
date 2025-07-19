export interface DailyStats {
  date: string;
  sessionsCompleted: number;
  focusTime: number;
  totalFocusTime: number;
  productivity: number;
  distractions: number;
  distractionsBlocked: number;
  longestSession: number;
  averageSessionLength: number;
  breaks: number;
  goals: {
    daily: number;
    weekly: number;
  };
}

class PersistentStatsClass {
  private localStorageKeyPrefix = "focus_stats_daily";

  public startFocusSession(userId: string) {
    const todayStats = this.getTodaysStats();
    const updatedStats = {
      ...todayStats,
      sessionsCompleted: todayStats.sessionsCompleted + 1,
    };

    this.storeStats(userId, updatedStats);
  }

  public completeFocusSession(userId: string) {
    const todayStats = this.getTodaysStats();
    const updatedStats = {
      ...todayStats,
      sessionsCompleted: todayStats.sessionsCompleted + 1,
    };

    this.storeStats(userId, updatedStats);
  }

  public getTodaysStats(): DailyStats {
    const userId = this.getUserId();
    if (!userId) {
      console.warn("User ID not found, returning empty stats.");
      return PersistentStatsClass.createEmptyStats();
    }

    const dateKey = new Date().toISOString().split("T")[0];
    const storedStats = localStorage.getItem(
      `${this.localStorageKeyPrefix}_${userId}_${dateKey}`,
    );

    if (storedStats) {
      return JSON.parse(storedStats);
    } else {
      return PersistentStatsClass.createEmptyStats();
    }
  }

  public getAllStats(): DailyStats[] {
    const userId = this.getUserId();
    if (!userId) {
      console.warn("User ID not found, returning empty stats array.");
      return [];
    }

    const stats: DailyStats[] = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(`${this.localStorageKeyPrefix}_${userId}_`)) {
        try {
          const storedStats = localStorage.getItem(key);
          if (storedStats) {
            stats.push(JSON.parse(storedStats));
          }
        } catch (error) {
          console.error(`Error parsing stats for key ${key}:`, error);
        }
      }
    });

    return stats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public updateTodaysStats(updates: Partial<DailyStats>): void {
    const userId = this.getUserId();
    if (!userId) {
      console.warn("User ID not found, cannot update stats.");
      return;
    }

    const todayStats = this.getTodaysStats();
    const updatedStats = {
      ...todayStats,
      ...updates,
    };

    this.storeStats(userId, updatedStats);
  }

  private getUserId(): string | null {
    // Implement your own logic to retrieve the user ID
    // This is just a placeholder, replace with your actual implementation
    return "user123";
  }

  private storeStats(userId: string, stats: DailyStats) {
    const dateKey = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      `${this.localStorageKeyPrefix}_${userId}_${dateKey}`,
      JSON.stringify(stats),
    );
  }

  private static createEmptyStats(): DailyStats {
    return {
      date: new Date().toISOString().split("T")[0],
      sessionsCompleted: 0,
      focusTime: 0,
      totalFocusTime: 0,
      productivity: 0,
      distractions: 0,
      distractionsBlocked: 0,
      longestSession: 0,
      averageSessionLength: 0,
      breaks: 0,
      goals: {
        daily: 4,
        weekly: 20,
      },
    };
  }
}

export const PersistentStats = new PersistentStatsClass();
