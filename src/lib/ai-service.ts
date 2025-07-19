
export interface AIInsight {
  id: string;
  type: "productivity" | "break" | "motivation" | "health" | "schedule" | "warning" | "achievement" | "tip" | "suggestion";
  title: string;
  message: string;
  actionable: boolean;
  action?: string; // Single action text
  actions?: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
  priority: "low" | "medium" | "high";
  timestamp: Date;
  read: boolean;
}

export interface ProductivityAnalysis {
  score: number; // 0-100
  productivity_score: number; // 0-100 (alias for score)
  trend: "improving" | "declining" | "stable";
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  weeklyGoalProgress: number;
  optimalFocusTime: string;
  burnoutRisk: "low" | "medium" | "high";
  focus_quality: "excellent" | "good" | "average" | "poor";
  stress_level: "low" | "medium" | "high";
  energy_level: "low" | "medium" | "high";
}

class AIServiceClass {
  private insights: AIInsight[] = [];
  private readonly STORAGE_KEY = "ai_service_data";

  constructor() {
    this.loadInsights();
  }

  // Load insights from storage
  private loadInsights(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.insights = data.insights || [];
      }
    } catch (error) {
      console.error("Failed to load AI insights:", error);
    }
  }

  // Save insights to storage
  private saveInsights(): void {
    try {
      const data = {
        insights: this.insights,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save AI insights:", error);
    }
  }

  // Generate productivity analysis
  async analyzeProductivity(stats: any): Promise<ProductivityAnalysis> {
    // Mock AI analysis based on user stats
    const focusTime = stats?.focusTime || 0;
    const sessionsCompleted = stats?.sessionsCompleted || 0;
    const distractionsBlocked = stats?.distractionsBlocked || 0;

    // Calculate productivity score
    const baseScore = Math.min(
      100,
      (focusTime / 120) * 40 +
        sessionsCompleted * 15 +
        Math.min(distractionsBlocked * 5, 20),
    );
    const score = Math.round(Math.max(0, baseScore));

    // Determine trend (simplified)
    const trend =
      score > 70 ? "improving" : score < 40 ? "declining" : "stable";

    // Generate strengths and improvements
    const strengths = [];
    const improvements = [];
    const recommendations = [];

    if (sessionsCompleted > 3) {
      strengths.push("Consistent focus session completion");
    } else {
      improvements.push("Complete more focus sessions daily");
      recommendations.push("Aim for at least 4 focus sessions per day");
    }

    if (distractionsBlocked > 5) {
      strengths.push("Good distraction resistance");
    } else {
      improvements.push("Better distraction management");
      recommendations.push("Enable website blocking during focus time");
    }

    if (focusTime > 90) {
      strengths.push("Excellent daily focus time");
    } else {
      improvements.push("Increase daily focus time");
      recommendations.push("Try extending session duration to 30-45 minutes");
    }

    // Calculate burnout risk
    const burnoutRisk =
      focusTime > 300 ? "high" : focusTime > 180 ? "medium" : "low";

    // Determine focus quality
    const focus_quality = score > 80 ? "excellent" : score > 60 ? "good" : score > 40 ? "average" : "poor";
    
    // Determine stress and energy levels
    const stress_level = focusTime > 240 ? "high" : focusTime > 120 ? "medium" : "low";
    const energy_level = sessionsCompleted > 4 ? "high" : sessionsCompleted > 2 ? "medium" : "low";

    return {
      score,
      productivity_score: score,
      trend,
      strengths,
      improvements,
      recommendations,
      weeklyGoalProgress: Math.round(((focusTime * 7) / 600) * 100), // Assuming 600 min weekly goal
      optimalFocusTime: this.calculateOptimalFocusTime(),
      burnoutRisk,
      focus_quality,
      stress_level,
      energy_level,
    };
  }

  // Calculate optimal focus time based on patterns
  private calculateOptimalFocusTime(): string {
    // Mock calculation - in real app would use ML
    const hour = new Date().getHours();

    if (hour >= 9 && hour <= 11) return "9:00 - 11:00 AM";
    if (hour >= 14 && hour <= 16) return "2:00 - 4:00 PM";
    if (hour >= 19 && hour <= 21) return "7:00 - 9:00 PM";

    return "9:00 - 11:00 AM"; // Default recommendation
  }

  // Generate AI insights
  async generateInsights(userStats: any): Promise<AIInsight[]> {
    const newInsights: AIInsight[] = [];

    // Generate motivational insight
    if (userStats?.sessionsCompleted > 0) {
      newInsights.push({
        id: `insight_${Date.now()}_motivation`,
        type: "motivation",
        title: "Great Progress Today!",
        message: `You've completed ${userStats.sessionsCompleted} focus sessions today. Keep up the excellent work!`,
        actionable: true,
        action: "Continue Streak",
        actions: [
          { label: "Continue Streak", action: "start_session", primary: true },
          { label: "View Stats", action: "view_stats" },
        ],
        priority: "medium",
        timestamp: new Date(),
        read: false,
      });
    }

    // Generate break recommendation
    if (userStats?.focusTime > 120) {
      newInsights.push({
        id: `insight_${Date.now()}_break`,
        type: "break",
        title: "Time for a Break",
        message: `You've been focused for ${userStats.focusTime} minutes. Taking a break will help maintain your productivity.`,
        actionable: true,
        action: "Take 5 Min Break",
        actions: [
          { label: "Take 5 Min Break", action: "start_break", primary: true },
          { label: "Continue Working", action: "dismiss" },
        ],
        priority: "high",
        timestamp: new Date(),
        read: false,
      });
    }

    // Generate productivity tip
    if (userStats?.distractionsBlocked < 3) {
      newInsights.push({
        id: `insight_${Date.now()}_productivity`,
        type: "productivity",
        title: "Boost Your Focus",
        message:
          "Enable website blocking to reduce distractions and improve your focus score by up to 25%.",
        actionable: true,
        action: "Enable Blocking",
        actions: [
          {
            label: "Enable Blocking",
            action: "enable_blocking",
            primary: true,
          },
          { label: "Learn More", action: "learn_more" },
        ],
        priority: "medium",
        timestamp: new Date(),
        read: false,
      });
    }

    // Add insights to collection
    this.insights = [...newInsights, ...this.insights].slice(0, 20); // Keep latest 20
    this.saveInsights();

    return newInsights;
  }

  // Get all insights
  getInsights(): AIInsight[] {
    return this.insights;
  }

  // Get unread insights
  getUnreadInsights(): AIInsight[] {
    return this.insights.filter((insight) => !insight.read);
  }

  // Mark insight as read
  markInsightAsRead(insightId: string): void {
    const insight = this.insights.find((i) => i.id === insightId);
    if (insight) {
      insight.read = true;
      this.saveInsights();
    }
  }

  // Clear all insights
  clearInsights(): void {
    this.insights = [];
    this.saveInsights();
  }

  // Get personalized coaching message
  getCoachingMessage(
    context: "start" | "break" | "distraction" | "completion",
  ): string {
    const messages = {
      start: [
        "Ready to dive deep? Let's make this session count! 🎯",
        "Time to enter the flow state. You've got this! 💪",
        "Focus mode activated. Great things happen when you're focused! ✨",
        "Let's turn this session into your most productive one yet! 🚀",
      ],
      break: [
        "Well done! Take a moment to recharge. Your brain deserves it! 🧠",
        "Great session! A short break will help you come back stronger! ☕",
        "Excellent focus! Step away for a few minutes and reset! 🌟",
        "You're on fire! Take a breather and prepare for the next round! 🔥",
      ],
      distraction: [
        "Hey, I noticed you got distracted. That's okay! Let's refocus! 🎯",
        "Distraction happens. Take a deep breath and dive back in! 💨",
        "No worries! Even the best get distracted. Let's get back on track! 🛤️",
        "Quick reset time! You're stronger than any distraction! 💪",
      ],
      completion: [
        "Outstanding work! You've completed another successful session! 🏆",
        "Mission accomplished! Your consistency is paying off! ⭐",
        "Fantastic job! You're building an amazing focus habit! 🎊",
        "Superb! Each session makes you more productive! 🌟",
      ],
    };

    const contextMessages = messages[context];
    return contextMessages[Math.floor(Math.random() * contextMessages.length)];
  }

  // Get task suggestions based on time and context
  getTaskSuggestions(availableTime: number): string[] {
    if (availableTime <= 15) {
      return [
        "Quick email responses",
        "Organize your desktop",
        "Review your todo list",
        "Plan tomorrow's priorities",
        "Clean up browser bookmarks",
      ];
    } else if (availableTime <= 30) {
      return [
        "Write a blog post outline",
        "Code review for a small feature",
        "Research for upcoming project",
        "Update project documentation",
        "Sketch out new ideas",
      ];
    } else {
      return [
        "Deep work on main project",
        "Write comprehensive report",
        "Solve complex programming problem",
        "Create detailed project plan",
        "Conduct thorough research",
      ];
    }
  }
}

export const aiService = new AIServiceClass();
