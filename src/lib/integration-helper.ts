import { supabase } from "@/integrations/supabase/client";

export class IntegrationHelper {
  async storeTestGoogleIntegration() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user");
      }

      // Try to get current session to see if we have provider tokens
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Current session:", session);

      let accessToken = "test_token_" + Date.now();
      let refreshToken = "test_refresh_" + Date.now();

      // If we have real tokens from session, use those
      if (session?.provider_token) {
        accessToken = session.provider_token;
        refreshToken = session.provider_refresh_token || refreshToken;
      }

      // Store integration
      const { data, error } = await supabase
        .from("integrations")
        .upsert({
          user_id: user.id,
          integration_type: "google_calendar",
          access_token: accessToken,
          refresh_token: refreshToken,
          is_active: true,
          connected_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Failed to store integration:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          status: error.status,
          fullError: error,
        });
        throw error;
      }

      console.log("Integration stored successfully:", data);
      return data;
    } catch (error) {
      console.error("Error storing test integration:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      throw error;
    }
  }

  async checkGoogleConnection() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { connected: false, reason: "No authenticated user" };
      }

      const { data: integrations, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("integration_type", "google_calendar")
        .eq("is_active", true);

      if (error) {
        console.error("Database error in checkGoogleConnection:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          status: error.status,
          fullError: error,
        });
        return { connected: false, reason: `Database error: ${error.message}` };
      }

      if (!integrations || integrations.length === 0) {
        return {
          connected: false,
          reason: "No Google Calendar integration found",
        };
      }

      const integration = integrations[0];
      return {
        connected: true,
        integration,
        hasValidToken: !!integration.access_token,
      };
    } catch (error) {
      console.error("Exception in checkGoogleConnection:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      return {
        connected: false,
        reason: `Exception: ${error instanceof Error ? error.message : error}`,
      };
    }
  }
}

export const integrationHelper = new IntegrationHelper();

// Make it available globally for debugging
(window as any).integrationHelper = integrationHelper;
