import { supabase } from "@/integrations/supabase/client";
import { logSupabaseError, logError } from "@/lib/error-logger";

// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  scope: "https://www.googleapis.com/auth/calendar.readonly",
};

export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
  expires_at?: number;
}

class GoogleOAuthService {
  async signIn(): Promise<{
    profile: GoogleProfile;
    tokens: GoogleTokens;
  } | null> {
    try {
      // Redirect to calendar integration page for proper OAuth flow
      window.location.href = "/calendar";
      return null;
    } catch (error) {
      console.error("Google OAuth error:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      throw new Error("Authentication failed");
    }
  }

  async signOut(): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Remove Google integration from database
      await supabase
        .from("integrations")
        .delete()
        .eq("user_id", user.id)
        .eq("integration_type", "google_calendar");
    } catch (error) {
      console.error("Google sign out error:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
    }
  }

  async getValidAccessToken(): Promise<string | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log("No authenticated user found");
        return null;
      }

      console.log("Getting access token for user:", user.id);

      // First, try to get token from current session (if user just logged in with Google)
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.provider_token && session.provider === "google") {
        console.log("Found Google provider token in session");
        return session.provider_token;
      }

      // Get Google integration from database
      const { data: integrations, error } = await supabase
        .from("integrations")
        .select("access_token, refresh_token, expires_at")
        .eq("user_id", user.id)
        .eq("integration_type", "google_calendar")
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Error fetching integrations:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          status: error.status,
          fullError: error,
        });

        // If no records found (PGRST116), but we have session provider token, that's OK
        if (
          error.code === "PGRST116" &&
          session?.provider_token &&
          session.provider === "google"
        ) {
          console.log(
            "No database record but have session token - using session token",
          );
          return session.provider_token;
        }

        // If the error is about RLS or permissions, try without .single() to debug
        if (
          error.message?.includes("406") ||
          error.message?.includes("Not Acceptable")
        ) {
          console.log("Trying query without .single() to debug...");
          const { data: allIntegrations, error: listError } = await supabase
            .from("integrations")
            .select("access_token, refresh_token, expires_at")
            .eq("user_id", user.id)
            .eq("integration_type", "google_calendar")
            .eq("is_active", true);

          console.log("All integrations query result:", {
            data: allIntegrations,
            error: listError
              ? {
                  message: listError.message,
                  details: listError.details,
                  hint: listError.hint,
                  code: listError.code,
                  status: listError.status,
                }
              : null,
          });
          return null;
        }
        return null;
      }

      if (!integrations?.access_token) {
        console.log("No access token found in integrations");
        // Fallback to session token if available
        if (session?.provider_token && session.provider === "google") {
          console.log("Using session provider token as fallback");
          return session.provider_token;
        }
        return null;
      }

      // Check if token is expired and needs refresh
      if (
        integrations.expires_at &&
        new Date(integrations.expires_at) <= new Date(Date.now() + 60000)
      ) {
        // Token will expire in less than 1 minute, try to refresh
        if (integrations.refresh_token) {
          const refreshedToken = await this.refreshAccessToken(
            integrations.refresh_token,
          );
          if (refreshedToken) {
            // Update the database with new token
            await supabase
              .from("integrations")
              .update({
                access_token: refreshedToken.access_token,
                expires_at: new Date(
                  Date.now() + refreshedToken.expires_in * 1000,
                ).toISOString(),
              })
              .eq("user_id", user.id)
              .eq("integration_type", "google_calendar");

            return refreshedToken.access_token;
          }
        }
        return null;
      }

      return integrations.access_token;
    } catch (error) {
      console.error("Error getting access token:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      return null;
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user for isSignedIn check");
        return false;
      }

      console.log("Checking if user is signed in:", user.id);
      console.log("Querying integrations table for Google Calendar...");

      // First check session for provider token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.provider_token && session.provider === "google") {
        console.log(
          "Found Google provider token in session - user is signed in",
        );
        return true;
      }

      const { data: integrations, error } = await supabase
        .from("integrations")
        .select("id")
        .eq("user_id", user.id)
        .eq("integration_type", "google_calendar")
        .eq("is_active", true)
        .single();

      if (error) {
        // PGRST116 means no rows found - this is expected for users without integrations
        if (error.code === "PGRST116") {
          console.log("No Google Calendar integration found for user");

          // If we have a session token, that means user is signed in via OAuth
          if (session?.provider_token && session.provider === "google") {
            console.log("But found Google session token - user is signed in");
            return true;
          }
          return false;
        }

        // For other errors, log them properly
        console.error(
          "Error checking integrations - Message:",
          error?.message || "No message",
        );
        console.error(
          "Error checking integrations - Code:",
          error?.code || "No code",
        );
        console.error(
          "Error checking integrations - Details:",
          error?.details || "No details",
        );
        return false;
      }

      const isSignedIn = !!integrations;
      console.log("Is signed in:", isSignedIn);
      return isSignedIn;
    } catch (error) {
      console.error("Exception in isSignedIn:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      return false;
    }
  }

  isConnected(): boolean {
    // This is a synchronous check for UI purposes
    // We'll do a simple check but components should use isSignedIn() for accuracy
    try {
      const session = localStorage.getItem(
        "sb-cwgnlsrqnyugloobrsxz-auth-token",
      );
      return !!session;
    } catch {
      return false;
    }
  }

  private async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string; expires_in: number } | null> {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
          client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "",
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      return await response.json();
    } catch (error) {
      console.error("Token refresh error:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      return null;
    }
  }

  async getUserProfile(): Promise<GoogleProfile | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || user.email || "",
        picture: user.user_metadata?.avatar_url,
        given_name: user.user_metadata?.given_name,
        family_name: user.user_metadata?.family_name,
      };
    } catch (error) {
      console.error("Error getting user profile:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      return null;
    }
  }
}

export const googleOAuth = new GoogleOAuthService();

// Make it available globally for debugging
(window as any).googleOAuth = googleOAuth;
