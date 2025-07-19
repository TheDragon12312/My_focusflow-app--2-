import { supabase } from "@/integrations/supabase/client";
import { googleOAuth } from "./google-oauth";

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  status?: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  duplicates: number;
  total_events: number;
}

export class GoogleCalendarImportService {
  async importCalendarEvents(): Promise<ImportResult> {
    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get valid access token
      const accessToken = await googleOAuth.getValidAccessToken();
      if (!accessToken) {
        throw new Error(
          "No Google Calendar connection found. Please go to the Calendar page (/calendar) and connect your Google Calendar first.",
        );
      }

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

      const googleResponse = await fetch(googleCalendarUrl.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!googleResponse.ok) {
        const errorText = await googleResponse.text();
        console.error(
          "Google Calendar API error:",
          googleResponse.status,
          errorText,
        );

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

        throw new Error(errorMessage);
      }

      const calendarData = await googleResponse.json();
      const events: GoogleCalendarEvent[] = calendarData.items || [];

      console.log(`Fetched ${events.length} events from Google Calendar`);

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
      const planningItems = [];
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

        const planningItem = {
          user_id: user.id,
          title: event.summary || "Untitled Event",
          description: event.description || null,
          start_time: event.start.dateTime,
          end_time: event.end.dateTime,
          event_type: "calendar_import",
          google_event_id: event.id,
          location: event.location || null,
          status: "planned",
        };

        planningItems.push(planningItem);
      }

      console.log(
        `Transformed ${planningItems.length} events, skipped ${duplicateCount} duplicates`,
      );

      // Insert planning items into database
      let insertedCount = 0;
      if (planningItems.length > 0) {
        const { data: insertedItems, error: insertError } = await supabase
          .from("planning")
          .insert(planningItems)
          .select();

        if (insertError) {
          console.error("Database insert error:", insertError);
          throw new Error(
            "Failed to save events to database: " + insertError.message,
          );
        }

        insertedCount = insertedItems?.length || 0;
      }

      console.log(`Successfully imported ${insertedCount} events`);

      return {
        success: true,
        message: `Successfully imported ${insertedCount} calendar events`,
        imported: insertedCount,
        duplicates: duplicateCount,
        total_events: events.length,
      };
    } catch (error) {
      console.error("Google Calendar import error:", error);
      throw error;
    }
  }
}

export const googleCalendarImport = new GoogleCalendarImportService();
