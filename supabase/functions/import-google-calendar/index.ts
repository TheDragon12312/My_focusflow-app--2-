import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  status?: string;
}

interface PlanningItem {
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: string;
  google_event_id?: string;
  location?: string;
}

serve(async (req: Request) => {
  const requestId = Math.random().toString(36).substring(2, 8);
  console.log(`[${requestId}] ${req.method} ${req.url}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Verify user with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      console.error(`[${requestId}] Auth error:`, authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[${requestId}] User authenticated:`, user.id);

    // Check if user has Google Calendar integration
    const { data: integration, error: integrationError } = await supabase
      .from("integrations")
      .select("access_token, refresh_token")
      .eq("user_id", user.id)
      .eq("integration_type", "google_calendar")
      .eq("is_active", true)
      .single();

    if (integrationError || !integration) {
      console.error(
        `[${requestId}] No Google Calendar integration found:`,
        integrationError,
      );
      return new Response(
        JSON.stringify({
          error:
            "No Google Calendar integration found. Please connect your Google Calendar first.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { access_token, refresh_token } = integration;

    if (!access_token) {
      return new Response(JSON.stringify({ error: "No access token found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[${requestId}] Found Google Calendar integration`);

    // Calculate date range (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    const timeMin = now.toISOString();
    const timeMax = thirtyDaysFromNow.toISOString();

    // Fetch events from Google Calendar API
    const googleCalendarUrl = new URL(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    );
    googleCalendarUrl.searchParams.set("timeMin", timeMin);
    googleCalendarUrl.searchParams.set("timeMax", timeMax);
    googleCalendarUrl.searchParams.set("singleEvents", "true");
    googleCalendarUrl.searchParams.set("orderBy", "startTime");
    googleCalendarUrl.searchParams.set("maxResults", "100");

    let googleResponse = await fetch(googleCalendarUrl.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
    });

    // If access token is expired, try to refresh it
    if (googleResponse.status === 401 && refresh_token) {
      console.log(
        `[${requestId}] Access token expired, attempting to refresh...`,
      );

      try {
        const refreshResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id:
                Deno.env.get("GOOGLE_CLIENT_ID") ||
                Deno.env.get("VITE_GOOGLE_CLIENT_ID") ||
                "180012573174-pdiqpmgqssmmcg05es1ud8jaq2dl6enk.apps.googleusercontent.com",
              client_secret:
                Deno.env.get("GOOGLE_CLIENT_SECRET") ||
                Deno.env.get("VITE_GOOGLE_CLIENT_SECRET") ||
                "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",
              refresh_token: refresh_token,
              grant_type: "refresh_token",
            }),
          },
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.access_token;

          // Update the access token in database
          await supabase
            .from("integrations")
            .update({ access_token: newAccessToken })
            .eq("user_id", user.id)
            .eq("integration_type", "google_calendar");

          // Retry the Google Calendar API call with new token
          googleResponse = await fetch(googleCalendarUrl.toString(), {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              Accept: "application/json",
            },
          });

          console.log(`[${requestId}] Token refreshed successfully`);
        }
      } catch (refreshError) {
        console.error(`[${requestId}] Token refresh failed:`, refreshError);
      }
    }

    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      console.error(
        `[${requestId}] Google Calendar API error:`,
        googleResponse.status,
        errorText,
      );

      // More specific error messages
      let errorMessage = `Google Calendar API error: ${googleResponse.status}`;
      if (googleResponse.status === 401) {
        errorMessage =
          "Google Calendar authentication expired. Please reconnect your Google Calendar.";
      } else if (googleResponse.status === 403) {
        errorMessage =
          "Google Calendar access denied. Please check your permissions.";
      } else if (googleResponse.status === 404) {
        errorMessage =
          "Google Calendar not found. Please verify your calendar access.";
      }

      return new Response(
        JSON.stringify({
          error: errorMessage,
          details: errorText,
          status: googleResponse.status,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const calendarData = await googleResponse.json();
    const events: GoogleCalendarEvent[] = calendarData.items || [];

    console.log(
      `[${requestId}] Fetched ${events.length} events from Google Calendar`,
    );

    // Get existing planning items to avoid duplicates
    const { data: existingItems } = await supabase
      .from("planning")
      .select("google_event_id")
      .eq("user_id", user.id)
      .not("google_event_id", "is", null);

    const existingEventIds = new Set(
      existingItems?.map((item) => item.google_event_id) || [],
    );

    // Transform Google Calendar events to planning items
    const planningItems: PlanningItem[] = [];
    let duplicateCount = 0;

    for (const event of events) {
      // Skip if already imported
      if (existingEventIds.has(event.id)) {
        duplicateCount++;
        continue;
      }

      // Skip all-day events or events without proper time
      if (!event.start?.dateTime || !event.end?.dateTime) {
        continue;
      }

      // Skip cancelled events
      if (event.status === "cancelled") {
        continue;
      }

      const planningItem: PlanningItem = {
        user_id: user.id,
        title: event.summary || "Untitled Event",
        description: event.description || null,
        start_time: event.start.dateTime,
        end_time: event.end.dateTime,
        event_type: "calendar_import",
        google_event_id: event.id,
        location: event.location || null,
      };

      planningItems.push(planningItem);
    }

    console.log(
      `[${requestId}] Transformed ${planningItems.length} events, skipped ${duplicateCount} duplicates`,
    );

    // Insert planning items into database
    let insertedCount = 0;
    if (planningItems.length > 0) {
      const { data: insertedItems, error: insertError } = await supabase
        .from("planning")
        .insert(planningItems)
        .select();

      if (insertError) {
        console.error(`[${requestId}] Database insert error:`, insertError);
        return new Response(
          JSON.stringify({ error: "Failed to save events to database" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      insertedCount = insertedItems?.length || 0;
    }

    console.log(`[${requestId}] Successfully imported ${insertedCount} events`);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully imported ${insertedCount} calendar events`,
        imported: insertedCount,
        duplicates: duplicateCount,
        total_events: events.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
