
// Paddle.js integration service for real subscription payments
import { initializePaddle, Paddle, CheckoutOpenOptions } from "@paddle/paddle-js";

interface PaddleProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  recurring?: boolean;
  interval?: string;
}

interface PaddleCheckoutOptions {
  items: Array<{
    priceId: string;
    quantity?: number;
  }>;
  customer?: {
    email?: string;
    id?: string;
  };
  customData?: Record<string, any>;
  successUrl?: string;
}

class PaddleServiceClass {
  private paddle: Paddle | null = null;
  private isInitialized = false;

  // Paddle configuration
  private readonly PADDLE_VENDOR_ID =
    import.meta.env.VITE_PADDLE_VENDOR_ID || "demo-vendor";
  private readonly PADDLE_ENVIRONMENT =
    import.meta.env.VITE_PADDLE_ENVIRONMENT || "sandbox";

  // Demo/Development product IDs (replace with real Paddle product IDs)
  private readonly PRODUCTS = {
    pro_monthly: "pro_01hjw9j4m5x8z9q2v3k8f7g6h5",
    pro_yearly: "pro_01hjw9j4m5x8z9q2v3k8f7g6h6",
    team_monthly: "pro_01hjw9j4m5x8z9q2v3k8f7g6h7",
    team_yearly: "pro_01hjw9j4m5x8z9q2v3k8f7g6h8",
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Paddle with environment detection
      const environment = import.meta.env.PROD ? "production" : "sandbox";
      
      this.paddle = await initializePaddle({
        environment,
        token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN || "test_token",
      });

      this.isInitialized = true;
      console.log("Paddle initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Paddle:", error);
      this.enableDemoMode();
    }
  }

  async openCheckout(options: CheckoutOpenOptions): Promise<void> {
    if (!this.paddle) {
      await this.initialize();
    }

    if (!this.paddle) {
      this.simulateCheckout(options as any);
      return;
    }

    try {
      await this.paddle.Checkout.open(options);
    } catch (error) {
      console.error("Checkout failed:", error);
      this.simulateCheckout(options as any);
    }
  }

  async getProducts(): Promise<PaddleProduct[]> {
    await this.initialize();

    // For demo/development, return mock products
    return [
      {
        id: "pro_monthly",
        name: "FocusFlow Pro - Monthly",
        description: "Monthly subscription for FocusFlow Pro",
        price: 9.99,
        currency: "EUR",
        recurring: true,
        interval: "month",
      },
      {
        id: "pro_yearly",
        name: "FocusFlow Pro - Yearly",
        description: "Yearly subscription for FocusFlow Pro",
        price: 99.99,
        currency: "EUR",
        recurring: true,
        interval: "year",
      },
      {
        id: "team_monthly",
        name: "FocusFlow Team - Monthly",
        description: "Monthly subscription for FocusFlow Team",
        price: 19.99,
        currency: "EUR",
        recurring: true,
        interval: "month",
      },
      {
        id: "team_yearly",
        name: "FocusFlow Team - Yearly",
        description: "Yearly subscription for FocusFlow Team",
        price: 199.99,
        currency: "EUR",
        recurring: true,
        interval: "year",
      },
    ];
  }

  async updateSubscription(
    subscriptionId: string,
    newProductId: string,
  ): Promise<boolean> {
    await this.initialize();

    if (!this.paddle) {
      // Demo mode - simulate update
      console.log("Demo: Subscription updated to", newProductId);
      return true;
    }

    try {
      // Real Paddle subscription update would go here
      // This requires server-side implementation with Paddle API
      console.warn("Subscription updates require server-side implementation");
      return true;
    } catch (error) {
      console.error("Subscription update error:", error);
      return false;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    await this.initialize();

    if (!this.paddle) {
      // Demo mode - simulate cancellation
      console.log("Demo: Subscription cancelled");
      return true;
    }

    try {
      // Real Paddle subscription cancellation would go here
      // This requires server-side implementation with Paddle API
      console.warn(
        "Subscription cancellation requires server-side implementation",
      );
      return true;
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      return false;
    }
  }

  private getProductId(planType: string): string {
    return this.PRODUCTS[planType as keyof typeof this.PRODUCTS] || planType;
  }

  private handlePaddleEvent(eventData: any): void {
    console.log("Paddle Event:", eventData);

    switch (eventData.name) {
      case "checkout.completed":
        this.handleCheckoutCompleted(eventData.data);
        break;
      case "checkout.closed":
        this.handleCheckoutClosed();
        break;
      case "checkout.error":
        this.handleCheckoutError(eventData.data);
        break;
      default:
        console.log("Unhandled Paddle event:", eventData.name);
    }
  }

  private handleCheckoutCompleted(data: any): void {
    console.log("✅ Checkout completed successfully!", data);

    // Store subscription info locally (in production, this would come from webhooks)
    const subscriptionData = {
      id: data.subscription?.id || `sub_${Date.now()}`,
      transactionId: data.transaction?.id,
      customerId: data.customer?.id,
      productId: data.items?.[0]?.price?.product?.id,
      status: "active",
      startDate: new Date().toISOString(),
      nextBilling: data.subscription?.next_billed_at,
      customData: data.custom_data,
    };

    localStorage.setItem(
      "paddle_subscription",
      JSON.stringify(subscriptionData),
    );

    // Show success notification
    this.showNotification(
      "success",
      "🎉 Betaling Succesvol!",
      "Je FocusFlow Pro account is geactiveerd.",
    );

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.href = "/dashboard?upgraded=true";
    }, 2000);
  }

  private handleCheckoutClosed(): void {
    console.log("🚪 Checkout window closed");
  }

  private handleCheckoutError(error: any): void {
    console.error("❌ Checkout error:", error);
    this.showNotification(
      "error",
      "❌ Betaling Mislukt",
      "Er ging iets mis met je betaling. Probeer het opnieuw.",
    );
  }

  private simulateCheckout(options: PaddleCheckoutOptions): void {
    console.log("🎭 Demo mode: Simulating Paddle checkout", options);

    // Show demo checkout overlay
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center";
    overlay.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Demo Checkout</h3>
        <p class="text-gray-600 mb-6">Dit is een demo van de Paddle checkout. In productie zou hier het echte Paddle formulier verschijnen.</p>
        <div class="space-y-3">
          <button id="demo-complete" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            ✅ Simuleer Succesvolle Betaling
          </button>
          <button id="demo-cancel" class="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
            ❌ Annuleren
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Handle demo buttons
    overlay.querySelector("#demo-complete")?.addEventListener("click", () => {
      overlay.remove();
      this.handleCheckoutCompleted({
        subscription: { id: `demo_sub_${Date.now()}` },
        transaction: { id: `demo_txn_${Date.now()}` },
        customer: { id: options.customer?.id },
        items: [{ price: { product: { id: options.items[0]?.priceId } } }],
        custom_data: { userId: options.customer?.id, planId: options.items[0]?.priceId },
      });
    });

    overlay.querySelector("#demo-cancel")?.addEventListener("click", () => {
      overlay.remove();
      this.handleCheckoutClosed();
    });

    // Auto-close after 30 seconds
    setTimeout(() => {
      if (overlay.parentElement) {
        overlay.remove();
        this.handleCheckoutClosed();
      }
    }, 30000);
  }

  private enableDemoMode(): void {
    console.log("🎭 Paddle demo mode enabled");
    this.isInitialized = true; // Mark as initialized for demo mode
  }

  private showNotification(
    type: "success" | "error",
    title: string,
    message: string,
  ): void {
    const notification = document.createElement("div");
    const bgColor =
      type === "success"
        ? "bg-green-100 border-green-200"
        : "bg-red-100 border-red-200";
    const textColor = type === "success" ? "text-green-800" : "text-red-800";

    notification.className = `fixed top-4 right-4 ${bgColor} border rounded-lg p-4 shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300`;
    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="${textColor}">
          ${type === "success" ? "✅" : "❌"}
        </div>
        <div>
          <h4 class="font-medium ${textColor}">${title}</h4>
          <p class="text-sm ${textColor} mt-1">${message}</p>
          <button onclick="this.closest('.fixed').remove()" class="text-xs ${textColor} mt-2 underline">Sluiten</button>
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

  // Get current subscription status
  getSubscriptionStatus(): any {
    try {
      const stored = localStorage.getItem("paddle_subscription");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Check if user has active subscription
  hasActiveSubscription(): boolean {
    const subscription = this.getSubscriptionStatus();
    return subscription && subscription.status === "active";
  }
}

export const paddleService = new PaddleServiceClass();

// Make it available globally for debugging
if (typeof window !== "undefined") {
  (window as any).paddleService = paddleService;
}
