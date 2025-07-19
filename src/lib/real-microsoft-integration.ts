export interface MicrosoftCalendarEvent {
  id: string;
  subject: string;
  body?: {
    content: string;
    contentType: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name?: string;
    };
    status: {
      response:
        | "none"
        | "organizer"
        | "tentativelyAccepted"
        | "accepted"
        | "declined";
      time: string;
    };
  }>;
}

export interface MicrosoftCalendar {
  id: string;
  name: string;
  color: string;
  isDefaultCalendar?: boolean;
  canEdit: boolean;
}

export class RealMicrosoftIntegration {
  private _isConnected: boolean = false;
  private readonly STORAGE_KEY = "microsoft_integration_data";

  constructor() {
    this.loadConnectionStatus();
  }

  // Load connection status from storage
  private loadConnectionStatus(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this._isConnected = data.isConnected || false;
      }
    } catch (error) {
      console.error("Failed to load Microsoft integration status:", error);
    }
  }

  // Save connection status
  private saveConnectionStatus(): void {
    try {
      const data = {
        isConnected: this._isConnected,
        lastConnected: new Date().toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save Microsoft integration status:", error);
    }
  }

  // Check if connected to Microsoft services
  isConnected(): boolean {
    return this._isConnected;
  }

  // Connect to Microsoft services
  async connect(): Promise<boolean> {
    try {
      console.log("Connecting to Microsoft services...");

      // In a real implementation, this would:
      // 1. Initialize Microsoft OAuth
      // 2. Request necessary permissions (Calendar, Mail)
      // 3. Store access tokens

      // For demo purposes, simulate successful connection
      this._isConnected = true;
      this.saveConnectionStatus();

      console.log("✅ Successfully connected to Microsoft services");
      return true;
    } catch (error) {
      console.error("Failed to connect to Microsoft services:", error);
      return false;
    }
  }

  // Disconnect from Microsoft services
  async disconnect(): Promise<void> {
    try {
      this._isConnected = false;
      this.saveConnectionStatus();
      console.log("🔌 Disconnected from Microsoft services");
    } catch (error) {
      console.error("Failed to disconnect from Microsoft services:", error);
    }
  }

  // Get user's calendars
  async getCalendars(): Promise<MicrosoftCalendar[]> {
    if (!this._isConnected) {
      throw new Error("Not connected to Microsoft services");
    }

    // Mock calendars for demo
    return [
      {
        id: "primary",
        name: "Calendar",
        color: "#0078d4",
        isDefaultCalendar: true,
        canEdit: true,
      },
      {
        id: "work_calendar",
        name: "Work Calendar",
        color: "#107c10",
        isDefaultCalendar: false,
        canEdit: true,
      },
    ];
  }

  // Get events from calendar
  async getEvents(
    calendarId: string = "primary",
    timeMin?: Date,
    timeMax?: Date,
  ): Promise<MicrosoftCalendarEvent[]> {
    if (!this._isConnected) {
      throw new Error("Not connected to Microsoft services");
    }

    // Mock events for demo
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    return [
      {
        id: "event1",
        subject: "Team Standup",
        body: {
          content: "Daily team standup meeting",
          contentType: "text",
        },
        start: {
          dateTime: tomorrow.toISOString(),
          timeZone: "Europe/Amsterdam",
        },
        end: {
          dateTime: new Date(tomorrow.getTime() + 30 * 60 * 1000).toISOString(),
          timeZone: "Europe/Amsterdam",
        },
        attendees: [
          {
            emailAddress: {
              address: "colleague@company.com",
              name: "Colleague Name",
            },
            status: {
              response: "accepted",
              time: new Date().toISOString(),
            },
          },
        ],
      },
      {
        id: "event2",
        subject: "Focus Block",
        body: {
          content: "Deep work session created by FocusFlow",
          contentType: "text",
        },
        start: {
          dateTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
          timeZone: "Europe/Amsterdam",
        },
        end: {
          dateTime: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
          timeZone: "Europe/Amsterdam",
        },
      },
    ];
  }

  // Create a new event
  async createEvent(
    calendarId: string,
    event: Partial<MicrosoftCalendarEvent>,
  ): Promise<MicrosoftCalendarEvent> {
    if (!this._isConnected) {
      throw new Error("Not connected to Microsoft services");
    }

    console.log(`Creating event in calendar ${calendarId}:`, event);

    // Mock created event
    const createdEvent: MicrosoftCalendarEvent = {
      id: `event_${Date.now()}`,
      subject: event.subject || "New Event",
      body: event.body || {
        content: "Event created by FocusFlow",
        contentType: "text",
      },
      start: event.start || {
        dateTime: new Date().toISOString(),
        timeZone: "Europe/Amsterdam",
      },
      end: event.end || {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        timeZone: "Europe/Amsterdam",
      },
      attendees: event.attendees || [],
    };

    return createdEvent;
  }

  // Update an existing event
  async updateEvent(
    calendarId: string,
    eventId: string,
    event: Partial<MicrosoftCalendarEvent>,
  ): Promise<MicrosoftCalendarEvent> {
    if (!this._isConnected) {
      throw new Error("Not connected to Microsoft services");
    }

    console.log(`Updating event ${eventId} in calendar ${calendarId}:`, event);

    // Mock updated event
    const updatedEvent: MicrosoftCalendarEvent = {
      id: eventId,
      subject: event.subject || "Updated Event",
      body: event.body || {
        content: "Updated by FocusFlow",
        contentType: "text",
      },
      start: event.start || {
        dateTime: new Date().toISOString(),
        timeZone: "Europe/Amsterdam",
      },
      end: event.end || {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        timeZone: "Europe/Amsterdam",
      },
      attendees: event.attendees || [],
    };

    return updatedEvent;
  }

  // Delete an event
  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    if (!this._isConnected) {
      throw new Error("Not connected to Microsoft services");
    }

    console.log(`Deleting event ${eventId} from calendar ${calendarId}`);
  }

  // Create focus session event
  async createFocusSession(
    title: string,
    duration: number,
  ): Promise<MicrosoftCalendarEvent> {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    return this.createEvent("primary", {
      subject: `🎯 Focus Session: ${title}`,
      body: {
        content: `Deep work session created by FocusFlow\nDuration: ${duration} minutes`,
        contentType: "text",
      },
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Europe/Amsterdam",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Europe/Amsterdam",
      },
    });
  }

  // Get upcoming events for focus planning
  async getUpcomingEvents(
    hours: number = 24,
  ): Promise<MicrosoftCalendarEvent[]> {
    const now = new Date();
    const timeMax = new Date(now.getTime() + hours * 60 * 60 * 1000);

    return this.getEvents("primary", now, timeMax);
  }

  // Find free time slots
  async findFreeTimeSlots(
    duration: number,
    withinHours: number = 8,
  ): Promise<Array<{ start: Date; end: Date }>> {
    const events = await this.getUpcomingEvents(withinHours);
    const slots: Array<{ start: Date; end: Date }> = [];

    // Simple algorithm to find free slots
    const now = new Date();
    const endTime = new Date(now.getTime() + withinHours * 60 * 60 * 1000);

    let currentTime = new Date(now);

    // Round to next 15-minute mark
    const minutes = currentTime.getMinutes();
    currentTime.setMinutes(Math.ceil(minutes / 15) * 15, 0, 0);

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000);

      // Check if this slot conflicts with any events
      const hasConflict = events.some((event) => {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);

        return currentTime < eventEnd && slotEnd > eventStart;
      });

      if (!hasConflict) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd),
        });
      }

      // Move to next 15-minute slot
      currentTime.setTime(currentTime.getTime() + 15 * 60 * 1000);
    }

    return slots.slice(0, 5); // Return first 5 available slots
  }

  // Get email messages (Outlook)
  async getMessages(top: number = 10): Promise<any[]> {
    if (!this._isConnected) {
      throw new Error("Not connected to Microsoft services");
    }

    // Mock email messages
    return [
      {
        id: "msg1",
        subject: "Project Update Required",
        from: {
          emailAddress: {
            address: "manager@company.com",
            name: "Manager Name",
          },
        },
        receivedDateTime: new Date().toISOString(),
        isRead: false,
        bodyPreview:
          "Please provide an update on the current project status...",
      },
      {
        id: "msg2",
        subject: "Weekly Team Meeting",
        from: {
          emailAddress: {
            address: "team@company.com",
            name: "Team Calendar",
          },
        },
        receivedDateTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        isRead: true,
        bodyPreview: "Don't forget about our weekly team meeting tomorrow...",
      },
    ];
  }
}

// Export instance instead of class
export const realMicrosoftIntegration = new RealMicrosoftIntegration();

// Also export as default for backward compatibility
export default realMicrosoftIntegration;
