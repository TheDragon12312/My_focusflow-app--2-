export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  features: string[];
  popular?: boolean;
  description: string;
  paddleProductId?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    period: "month",
    description: "Perfect om te beginnen",
    features: [
      "Tot 5 focus sessies per dag",
      "Basis statistieken",
      "Simpele timer",
      "Email ondersteuning",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    period: "month",
    description: "Voor serieuze professionals",
    popular: true,
    features: [
      "Onbeperkte focus sessies",
      "Geavanceerde analytics",
      "AI productiviteitscoach",
      "Calendar integratie",
      "Email management",
      "Afleidingsdetectie",
      "Priority support",
      "Data export",
    ],
    paddleProductId: "pro_01hjw9j4m5x8z9q2v3k8f7g6h5",
  },
  {
    id: "team",
    name: "Team",
    price: 19.99,
    period: "month",
    description: "Voor teams en organisaties",
    features: [
      "Alles van Pro",
      "Team dashboards",
      "Collaboratie tools",
      "Admin panel",
      "Team analytics",
      "Custom integraties",
      "Dedicated support",
      "SSO (Single Sign-On)",
    ],
    paddleProductId: "team_01hjw9j4m5x8z9q2v3k8f7g6h7",
  },
];

export const YEARLY_DISCOUNT = 0.2; // 20% discount for yearly plans

class PricingService {
  private readonly STORAGE_KEY = "pricing_service_data";

  // Get all available plans
  getPlans(): PricingPlan[] {
    return PRICING_PLANS;
  }

  // Get plan by ID
  getPlan(planId: string): PricingPlan | null {
    return PRICING_PLANS.find((plan) => plan.id === planId) || null;
  }

  // Calculate yearly price with discount
  getYearlyPrice(monthlyPrice: number): number {
    return Math.round(monthlyPrice * 12 * (1 - YEARLY_DISCOUNT) * 100) / 100;
  }

  // Get price display string
  getPriceDisplay(plan: PricingPlan, yearly: boolean = false): string {
    if (plan.price === 0) return "Gratis";

    const price = yearly ? this.getYearlyPrice(plan.price) : plan.price;
    const period = yearly ? "jaar" : "maand";

    return `€${price}/${period}`;
  }

  // Calculate savings for yearly plan
  getYearlySavings(monthlyPrice: number): number {
    const yearlyTotal = monthlyPrice * 12;
    const discountedYearly = this.getYearlyPrice(monthlyPrice);
    return Math.round((yearlyTotal - discountedYearly) * 100) / 100;
  }

  // Create checkout session (integrates with Paddle)
  async createCheckoutSession(params: {
    planId: string;
    yearly?: boolean;
    userId?: string;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<{ url: string; sessionId: string }> {
    try {
      const plan = this.getPlan(params.planId);
      if (!plan) {
        throw new Error("Plan not found");
      }

      // Generate session ID for tracking
      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store checkout session info
      const checkoutData = {
        sessionId,
        planId: params.planId,
        yearly: params.yearly || false,
        userId: params.userId,
        price: params.yearly ? this.getYearlyPrice(plan.price) : plan.price,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        `checkout_${sessionId}`,
        JSON.stringify(checkoutData),
      );

      // In a real implementation, this would create a Paddle checkout session
      // For now, return mock checkout URL
      const baseUrl = window.location.origin;
      const checkoutUrl = `${baseUrl}/checkout?session_id=${sessionId}`;

      return {
        url: checkoutUrl,
        sessionId,
      };
    } catch (error) {
      console.error("Create checkout session error:", error);
      throw error;
    }
  }

  // Get checkout session info
  getCheckoutSession(sessionId: string): any {
    try {
      const stored = localStorage.getItem(`checkout_${sessionId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Complete checkout (mock implementation)
  async completeCheckout(sessionId: string): Promise<boolean> {
    try {
      const session = this.getCheckoutSession(sessionId);
      if (!session) return false;

      // In a real implementation, this would verify payment with Paddle
      // For now, we'll simulate successful payment

      // Store subscription info
      const subscription = {
        id: `sub_${Date.now()}`,
        userId: session.userId,
        planId: session.planId,
        status: "active",
        yearly: session.yearly,
        price: session.price,
        startDate: new Date().toISOString(),
        endDate: new Date(
          Date.now() + (session.yearly ? 365 : 30) * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };

      localStorage.setItem(
        `subscription_${subscription.userId}`,
        JSON.stringify(subscription),
      );

      // Clean up checkout session
      localStorage.removeItem(`checkout_${sessionId}`);

      return true;
    } catch (error) {
      console.error("Complete checkout error:", error);
      return false;
    }
  }

  // Get user subscription
  getUserSubscription(userId: string): any {
    try {
      const stored = localStorage.getItem(`subscription_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Check if user has active subscription
  hasActiveSubscription(userId: string): boolean {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) return false;

    const endDate = new Date(subscription.endDate);
    return subscription.status === "active" && endDate > new Date();
  }

  // Get user's current plan
  getUserPlan(userId: string): PricingPlan | null {
    const subscription = this.getUserSubscription(userId);
    if (!subscription || !this.hasActiveSubscription(userId)) {
      return this.getPlan("free");
    }

    return this.getPlan(subscription.planId);
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = this.getUserSubscription(userId);
      if (!subscription) return false;

      // In a real implementation, this would cancel via Paddle
      subscription.status = "cancelled";
      subscription.cancelledAt = new Date().toISOString();

      localStorage.setItem(
        `subscription_${userId}`,
        JSON.stringify(subscription),
      );

      return true;
    } catch (error) {
      console.error("Cancel subscription error:", error);
      return false;
    }
  }

  // Update subscription
  async updateSubscription(
    userId: string,
    newPlanId: string,
    yearly?: boolean,
  ): Promise<boolean> {
    try {
      const newPlan = this.getPlan(newPlanId);
      if (!newPlan) return false;

      const subscription = this.getUserSubscription(userId);
      if (!subscription) return false;

      // In a real implementation, this would update via Paddle
      subscription.planId = newPlanId;
      subscription.yearly = yearly || false;
      subscription.price = yearly
        ? this.getYearlyPrice(newPlan.price)
        : newPlan.price;
      subscription.updatedAt = new Date().toISOString();

      localStorage.setItem(
        `subscription_${userId}`,
        JSON.stringify(subscription),
      );

      return true;
    } catch (error) {
      console.error("Update subscription error:", error);
      return false;
    }
  }

  // Get subscription features
  getSubscriptionFeatures(userId: string): string[] {
    const plan = this.getUserPlan(userId);
    return plan ? plan.features : [];
  }

  // Check if user has feature
  hasFeature(userId: string, feature: string): boolean {
    const features = this.getSubscriptionFeatures(userId);
    return features.some((f) =>
      f.toLowerCase().includes(feature.toLowerCase()),
    );
  }

  // Get price comparison data
  getPriceComparison(): Array<{
    planId: string;
    monthly: number;
    yearly: number;
    savings: number;
    savingsPercentage: number;
  }> {
    return PRICING_PLANS.filter((plan) => plan.price > 0).map((plan) => {
      const monthly = plan.price;
      const yearly = this.getYearlyPrice(monthly);
      const savings = this.getYearlySavings(monthly);
      const savingsPercentage = Math.round((savings / (monthly * 12)) * 100);

      return {
        planId: plan.id,
        monthly,
        yearly,
        savings,
        savingsPercentage,
      };
    });
  }

  // Get most popular plan
  getMostPopularPlan(): PricingPlan | null {
    return PRICING_PLANS.find((plan) => plan.popular) || null;
  }

  // Get plan recommendations based on user activity
  getRecommendedPlan(userStats?: {
    dailyFocusTime: number;
    sessionsPerWeek: number;
    hasTeam: boolean;
  }): PricingPlan {
    if (!userStats) {
      return this.getPlan("pro")!;
    }

    // Recommend team plan for users with team features
    if (userStats.hasTeam) {
      return this.getPlan("team")!;
    }

    // Recommend pro for power users
    if (userStats.dailyFocusTime > 120 || userStats.sessionsPerWeek > 15) {
      return this.getPlan("pro")!;
    }

    // Default to free for light users
    return this.getPlan("free")!;
  }
}

export const pricingService = new PricingService();
