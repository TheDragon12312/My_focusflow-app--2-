import { googleOAuth } from "./google-oauth";
import { logError, logSupabaseError } from "./error-logger";
import { toast } from "sonner";

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: string;
  }>;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastError?: string;
  retryCount: number;
  lastAttempt?: Date;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // in milliseconds
  maxDelay: number;
  backoffMultiplier: number;
}

class EnhancedGoogleIntegration {
  private connectionStatus: ConnectionStatus = {
    isConnected: false,
    retryCount: 0,
  };

  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };

  private isRetrying = false;

  /**
   * Initialiseer Google Calendar connectie met uitgebreide foutafhandeling
   */
  async initialize(): Promise<boolean> {
    console.log("🔄 Initialiseren Google Calendar integratie...");

    try {
      // Reset retry count bij nieuwe initialisatie
      this.connectionStatus.retryCount = 0;

      const connected = await this.checkConnectionWithRetry();

      if (connected) {
        console.log("✅ Google Calendar integratie succesvol geïnitialiseerd");
        this.connectionStatus.isConnected = true;
        this.connectionStatus.lastError = undefined;
        toast.success("Google Calendar succesvol verbonden");
        return true;
      } else {
        console.warn("⚠️ Google Calendar integratie niet beschikbaar");
        this.showConnectionHelp();
        return false;
      }
    } catch (error) {
      logError("Fout bij initialiseren Google Calendar integratie", error);
      this.handleInitializationError(error);
      return false;
    }
  }

  /**
   * Controleer connectie met retry mechanisme
   */
  private async checkConnectionWithRetry(): Promise<boolean> {
    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        console.log(
          `🔍 Connectie poging ${attempt}/${this.retryConfig.maxRetries}`,
        );

        const connected = await googleOAuth.isSignedIn();

        if (connected) {
          // Test ook of we daadwerkelijk data kunnen ophalen
          await this.testConnection();
          return true;
        }

        if (attempt < this.retryConfig.maxRetries) {
          const delay = this.calculateRetryDelay(attempt);
          console.log(`⏳ Wacht ${delay}ms voor volgende poging...`);
          await this.sleep(delay);
        }
      } catch (error) {
        logError(`Connectie poging ${attempt} gefaald`, error);

        if (attempt === this.retryConfig.maxRetries) {
          throw error;
        }

        const delay = this.calculateRetryDelay(attempt);
        console.log(`⏳ Wacht ${delay}ms voor volgende poging...`);
        await this.sleep(delay);
      }
    }

    return false;
  }

  /**
   * Test de connectie door een eenvoudige API call te maken
   */
  private async testConnection(): Promise<void> {
    try {
      const accessToken = await googleOAuth.getValidAccessToken();
      if (!accessToken) {
        throw new Error("Geen geldig access token");
      }

      // Test met een eenvoudige API call
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `API test gefaald: ${response.status} ${response.statusText}`,
        );
      }

      console.log("✅ Google Calendar API connectie test geslaagd");
    } catch (error) {
      logError("Google Calendar API connectie test gefaald", error);
      throw error;
    }
  }

  /**
   * Bereken retry delay met exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.baseDelay *
        Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
      this.retryConfig.maxDelay,
    );
    return delay + Math.random() * 1000; // Voeg jitter toe
  }

  /**
   * Sleep functie voor delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Behandel initialisatie fouten
   */
  private handleInitializationError(error: any): void {
    this.connectionStatus.isConnected = false;
    this.connectionStatus.lastError = error.message || "Onbekende fout";
    this.connectionStatus.lastAttempt = new Date();

    // Bepaal het type fout en toon gepaste melding
    if (
      error.message?.includes("toegang geweigerd") ||
      error.message?.includes("unauthorized")
    ) {
      toast.error(
        "Toegang tot Google Calendar geweigerd. Controleer je machtigingen.",
      );
      this.showAuthorizationHelp();
    } else if (
      error.message?.includes("netwerk") ||
      error.message?.includes("network")
    ) {
      toast.error(
        "Netwerkfout bij verbinden met Google Calendar. Controleer je internetverbinding.",
      );
      this.showNetworkHelp();
    } else if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      toast.error(
        "Te veel verzoeken naar Google Calendar. Probeer het later opnieuw.",
      );
      this.showQuotaHelp();
    } else {
      toast.error(
        "Fout bij verbinden met Google Calendar. Probeer het opnieuw.",
      );
      this.showGeneralHelp();
    }
  }

  /**
   * Toon hulp voor autorisatie problemen
   */
  private showAuthorizationHelp(): void {
    console.group("🔐 Google Calendar Autorisatie Hulp");
    console.log("1. Ga naar je Google Account instellingen");
    console.log("2. Controleer de app machtigingen");
    console.log("3. Zorg dat FocusFlow toegang heeft tot je agenda");
    console.log("4. Probeer opnieuw in te loggen");
    console.groupEnd();
  }

  /**
   * Toon hulp voor netwerk problemen
   */
  private showNetworkHelp(): void {
    console.group("🌐 Google Calendar Netwerk Hulp");
    console.log("1. Controleer je internetverbinding");
    console.log("2. Controleer of Google Calendar toegankelijk is");
    console.log("3. Probeer een andere browser");
    console.log("4. Schakel VPN uit als je er een gebruikt");
    console.groupEnd();
  }

  /**
   * Toon hulp voor quota problemen
   */
  private showQuotaHelp(): void {
    console.group("📊 Google Calendar Quota Hulp");
    console.log("1. Wacht een paar minuten voor je het opnieuw probeert");
    console.log("2. Verminder het aantal verzoeken");
    console.log("3. Probeer het later opnieuw");
    console.groupEnd();
  }

  /**
   * Toon algemene hulp
   */
  private showGeneralHelp(): void {
    console.group("❓ Google Calendar Algemene Hulp");
    console.log("1. Controleer of Google Calendar beschikbaar is");
    console.log("2. Probeer de pagina te vernieuwen");
    console.log("3. Log opnieuw in bij Google");
    console.log("4. Contacteer ondersteuning als het probleem aanhoudt");
    console.groupEnd();
  }

  /**
   * Toon connectie hulp
   */
  private showConnectionHelp(): void {
    toast.info(
      "Google Calendar niet verbonden. Klik op 'Verbind met Google' om te beginnen.",
    );
  }

  /**
   * Handmatig opnieuw proberen verbinden
   */
  async retryConnection(): Promise<boolean> {
    if (this.isRetrying) {
      console.log("⏳ Retry al bezig, wacht even...");
      return false;
    }

    this.isRetrying = true;
    toast.loading("Probeer opnieuw te verbinden met Google Calendar...");

    try {
      const success = await this.initialize();
      toast.dismiss();

      if (success) {
        toast.success("Verbinding hersteld!");
      } else {
        toast.error("Verbinding nog steeds niet mogelijk");
      }

      return success;
    } finally {
      this.isRetrying = false;
    }
  }

  /**
   * Veilige connectie check
   */
  async isConnectedSafely(): Promise<boolean> {
    try {
      return await googleOAuth.isSignedIn();
    } catch (error) {
      logError("Fout bij controleren connectie status", error);
      return false;
    }
  }

  /**
   * Veilige events ophalen met foutafhandeling
   */
  async getEventsSafely(
    calendarId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GoogleCalendarEvent[]> {
    try {
      const connected = await this.isConnectedSafely();
      if (!connected) {
        throw new Error("Niet verbonden met Google Calendar");
      }

      const accessToken = await googleOAuth.getValidAccessToken();
      if (!accessToken) {
        throw new Error("Geen geldig access token beschikbaar");
      }

      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();
      const params = new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: "true",
        orderBy: "startTime",
        maxResults: "250", // Beperk resultaten
      });

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(10000), // 10 seconden timeout
        },
      );

      if (!response.ok) {
        throw new Error(`API fout: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return (
        data.items?.map((event: any) => ({
          id: event.id,
          summary: event.summary || "Geen titel",
          description: event.description,
          start: event.start,
          end: event.end,
          attendees: event.attendees?.map((attendee: any) => ({
            email: attendee.email,
            displayName: attendee.displayName,
            responseStatus: attendee.responseStatus,
          })),
        })) || []
      );
    } catch (error) {
      logError("Fout bij ophalen Google Calendar events", error);

      if (error.name === "AbortError") {
        toast.error(
          "Verzoek naar Google Calendar time-out. Probeer het opnieuw.",
        );
      } else if (error.message?.includes("401")) {
        toast.error("Autorisatie verlopen. Probeer opnieuw in te loggen.");
      } else {
        toast.error("Kon agenda items niet ophalen van Google Calendar");
      }

      return [];
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * Reset connection status
   */
  resetConnectionStatus(): void {
    this.connectionStatus = {
      isConnected: false,
      retryCount: 0,
    };
  }

  // Delegate andere methoden naar de originele implementatie met foutafhandeling
  isConnected(): boolean {
    try {
      return googleOAuth.isConnected();
    } catch (error) {
      logError("Fout bij synchrone connectie check", error);
      return false;
    }
  }

  async connect(): Promise<boolean> {
    try {
      await googleOAuth.signIn();
      return true;
    } catch (error) {
      logError("Fout bij verbinden met Google", error);
      toast.error("Kon niet verbinden met Google Calendar");
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await googleOAuth.signOut();
      this.resetConnectionStatus();
      toast.success("Verbinding met Google Calendar verbroken");
    } catch (error) {
      logError("Fout bij verbreken verbinding", error);
      toast.error("Kon verbinding niet verbreken");
    }
  }
}

export const enhancedGoogleIntegration = new EnhancedGoogleIntegration();

// Export voor global access
if (typeof window !== "undefined") {
  (window as any).enhancedGoogleIntegration = enhancedGoogleIntegration;
}
