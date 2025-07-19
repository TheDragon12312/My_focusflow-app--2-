import { googleOAuth } from "./google-oauth";

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

class RealGoogleIntegration {
  isConnected(): boolean {
    return googleOAuth.isConnected();
  }

  async isConnectedAsync(): Promise<boolean> {
    return await googleOAuth.isSignedIn();
  }

  async connect(): Promise<boolean> {
    try {
      await googleOAuth.signIn();
      // The actual success will be determined when the OAuth callback completes
      return true;
    } catch (error) {
      console.error("Failed to connect to Google:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      return false;
    }
  }

  async disconnect(): Promise<void> {
    await googleOAuth.signOut();
  }

  async getEvents(
    calendarId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GoogleCalendarEvent[]> {
    const accessToken = await googleOAuth.getValidAccessToken();
    if (!accessToken) {
      throw new Error("Not connected to Google Calendar");
    }

    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: "true",
      orderBy: "startTime",
    });

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch calendar events");
    }

    const data = await response.json();
    return data.items.map((event: any) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      attendees: event.attendees?.map((attendee: any) => ({
        email: attendee.email,
        displayName: attendee.displayName,
        responseStatus: attendee.responseStatus,
      })),
    }));
  }

  async createFocusSession(title: string, duration: number): Promise<void> {
    const accessToken = await googleOAuth.getValidAccessToken();
    if (!accessToken) {
      throw new Error("Not connected to Google Calendar");
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const event = {
      summary: title,
      description: "Focus session created by FocusFlow",
      start: {
        dateTime: startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      colorId: "9", // Purple for focus sessions
      transparency: "opaque",
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 5 }],
      },
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create focus session");
    }
  }
}

export const realGoogleIntegration = new RealGoogleIntegration();

// Export instance for global access if needed
(window as any).realGoogleIntegration = realGoogleIntegration;
