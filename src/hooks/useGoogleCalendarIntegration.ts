import { useState, useEffect, useCallback } from "react";
import {
  enhancedGoogleIntegration,
  type ConnectionStatus,
  type GoogleCalendarEvent,
} from "@/lib/enhanced-google-integration";
import { toast } from "sonner";

interface UseGoogleCalendarIntegrationReturn {
  // Status
  isConnected: boolean;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  error: string | null;

  // Acties
  initialize: () => Promise<boolean>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  retryConnection: () => Promise<boolean>;

  // Data
  getEvents: (
    calendarId: string,
    startDate: Date,
    endDate: Date,
  ) => Promise<GoogleCalendarEvent[]>;

  // Utility
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useGoogleCalendarIntegration =
  (): UseGoogleCalendarIntegrationReturn => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
      isConnected: false,
      retryCount: 0,
    });
    const [error, setError] = useState<string | null>(null);

    // Check initiële connectie status
    useEffect(() => {
      checkInitialConnection();
    }, []);

    const checkInitialConnection = async () => {
      try {
        setIsLoading(true);
        const connected = await enhancedGoogleIntegration.isConnectedSafely();
        setIsConnected(connected);
        setConnectionStatus(enhancedGoogleIntegration.getConnectionStatus());

        if (!connected) {
          console.log("Google Calendar niet verbonden bij initiële check");
        }
      } catch (err) {
        console.error("Fout bij initiële connectie check:", err);
        setError(err instanceof Error ? err.message : "Onbekende fout");
      } finally {
        setIsLoading(false);
      }
    };

    const initialize = useCallback(async (): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        const success = await enhancedGoogleIntegration.initialize();

        setIsConnected(success);
        setConnectionStatus(enhancedGoogleIntegration.getConnectionStatus());

        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Initialisatie gefaald";
        setError(errorMessage);
        console.error("Initialisatie fout:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    }, []);

    const connect = useCallback(async (): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        const success = await enhancedGoogleIntegration.connect();

        if (success) {
          // Na succesvolle connectie, initialiseer opnieuw
          await initialize();
        }

        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Verbinding gefaald";
        setError(errorMessage);
        toast.error(`Verbinding gefaald: ${errorMessage}`);
        return false;
      } finally {
        setIsLoading(false);
      }
    }, [initialize]);

    const disconnect = useCallback(async (): Promise<void> => {
      try {
        setIsLoading(true);
        await enhancedGoogleIntegration.disconnect();

        setIsConnected(false);
        setConnectionStatus(enhancedGoogleIntegration.getConnectionStatus());
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Verbreken verbinding gefaald";
        setError(errorMessage);
        toast.error(`Verbreken gefaald: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const retryConnection = useCallback(async (): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        const success = await enhancedGoogleIntegration.retryConnection();

        setIsConnected(success);
        setConnectionStatus(enhancedGoogleIntegration.getConnectionStatus());

        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Retry gefaald";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    }, []);

    const getEvents = useCallback(
      async (
        calendarId: string,
        startDate: Date,
        endDate: Date,
      ): Promise<GoogleCalendarEvent[]> => {
        try {
          setError(null);

          if (!isConnected) {
            throw new Error("Niet verbonden met Google Calendar");
          }

          return await enhancedGoogleIntegration.getEventsSafely(
            calendarId,
            startDate,
            endDate,
          );
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Ophalen events gefaald";
          setError(errorMessage);
          console.error("Fout bij ophalen events:", err);
          return [];
        }
      },
      [isConnected],
    );

    const clearError = useCallback(() => {
      setError(null);
    }, []);

    const refresh = useCallback(async (): Promise<void> => {
      await checkInitialConnection();
    }, []);

    return {
      // Status
      isConnected,
      isLoading,
      connectionStatus,
      error,

      // Acties
      initialize,
      connect,
      disconnect,
      retryConnection,

      // Data
      getEvents,

      // Utility
      clearError,
      refresh,
    };
  };

// Hook voor automatische initialisatie
export const useAutoGoogleCalendarInit = () => {
  const integration = useGoogleCalendarIntegration();

  useEffect(() => {
    // Automatisch initialiseren bij eerste load
    integration.initialize();
  }, []);

  return integration;
};
