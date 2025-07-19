import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import {
  realGoogleIntegration,
  GoogleCalendarEvent,
} from "@/lib/real-google-integration";
import { enhancedGoogleIntegration } from "@/lib/enhanced-google-integration";
import { useGoogleCalendarIntegration } from "@/hooks/useGoogleCalendarIntegration";
import { googleCalendarImport } from "@/lib/google-calendar-import";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RealTimeGoogleCalendar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    isConnected,
    isLoading,
    connectionStatus,
    error,
    initialize,
    connect,
    disconnect,
    retryConnection,
    getEvents,
    clearError,
  } = useGoogleCalendarIntegration();

  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [importing, setImporting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventsLoading, setEventsLoading] = useState(false);

  // Initialiseer bij eerste load
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isConnected) {
      loadEvents();
    }
  }, [isConnected, selectedDate]);

  const handleConnect = async () => {
    const success = await connect();
    if (!success && error) {
      toast.error(`Verbinding gefaald: ${error}`);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setEvents([]);
  };

  const handleRetry = async () => {
    clearError();
    const success = await retryConnection();
    if (success) {
      loadEvents();
    }
  };

  const loadEvents = async () => {
    if (!isConnected) return;

    setEventsLoading(true);
    try {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const calendarEvents = await getEvents("primary", startOfDay, endOfDay);
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
      // Error wordt al afgehandeld in de hook
    } finally {
      setEventsLoading(false);
    }
  };

  const importToPlanning = async () => {
    if (!user || !isConnected) {
      toast.error("Je moet eerst verbinding maken met Google Calendar");
      return;
    }

    setImporting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Geen geldige sessie gevonden");
        return;
      }

      toast.info("Google Calendar importeren...");

      const response = await supabase.functions.invoke(
        "import-google-calendar",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (response.error) {
        console.error("Import error:", response.error);

        // Check if it's a CORS or function not found error - use client-side fallback
        if (
          response.error.message?.includes("CORS") ||
          response.error.message?.includes("Failed to send a request")
        ) {
          console.log(
            "Edge Function niet beschikbaar, using client-side fallback...",
          );
          toast.info("Gebruik client-side import...");

          try {
            // Use client-side import as fallback
            const result = await googleCalendarImport.importCalendarEvents();

            if (result.success) {
              toast.success(
                `🎉 ${result.imported} calendar evenementen geïmporteerd naar planning! ${result.duplicates > 0 ? `(${result.duplicates} duplicaten overgeslagen)` : ""}`,
              );
            }
          } catch (clientError) {
            console.error("Client-side import error:", clientError);
            const errorMsg =
              clientError instanceof Error
                ? clientError.message
                : "Client-side import mislukt";
            toast.error("Import mislukt: " + errorMsg);
          }
        } else {
          toast.error(
            "Import mislukt: " + (response.error.message || "Onbekende fout"),
          );
        }
        return;
      }

      const result = response.data;

      if (result.success) {
        toast.success(
          `🎉 ${result.imported} evenementen geïmporteerd naar je planning! ${result.duplicates > 0 ? `(${result.duplicates} duplicaten overgeslagen)` : ""}`,
        );
      } else {
        toast.error("Import mislukt");
      }
    } catch (error) {
      console.error("Import Google Calendar error:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      toast.error("Er ging iets mis bij het importeren");
    } finally {
      setImporting(false);
    }
  };

  const createFocusSessionFromEvent = async (event: GoogleCalendarEvent) => {
    try {
      const duration = Math.floor(
        (new Date(event.end.dateTime).getTime() -
          new Date(event.start.dateTime).getTime()) /
          (1000 * 60),
      );

      await realGoogleIntegration.createFocusSession(
        `Voorbereiding: ${event.summary}`,
        Math.min(duration, 120), // Max 2 uur
      );

      toast.success("Focus sessie aangemaakt!");
    } catch (error) {
      console.error("Failed to create focus session:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error,
      });
      toast.error("Kon focus sessie niet aanmaken");
    }
  };

  if (!isConnected) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <CalendarIcon className="h-5 w-5" />
            {t("calendar.integration")}
            {connectionStatus.retryCount > 0 && (
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600"
              >
                Retry {connectionStatus.retryCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-300">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearError}
                    className="ml-2 h-6 px-2 text-xs"
                  >
                    ✕
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Connection Status */}
          {connectionStatus.lastAttempt && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                Laatste poging:{" "}
                {connectionStatus.lastAttempt.toLocaleTimeString()}
                {connectionStatus.retryCount > 0 &&
                  ` (${connectionStatus.retryCount} pogingen)`}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-4">
            <div className="text-gray-600 dark:text-gray-400">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                {error
                  ? "Verbinding met Google Agenda mislukt"
                  : "Nog niet verbonden met Google Agenda"}
              </p>
              <p>
                Verbind je Google Agenda om je afspraken te importeren en
                automatisch focus sessies in te plannen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={handleConnect}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CalendarIcon className="h-4 w-4 mr-2" />
                )}
                {error ? "Opnieuw proberen" : t("calendar.connectGoogle")}
              </Button>

              {error && connectionStatus.retryCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Automatisch opnieuw proberen
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4">
          {/* Error Alert for connected state */}
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 mb-4">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-300">
                <div className="flex items-center justify-between">
                  <span>Fout bij laden agenda: {error}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      className="h-6 px-2 text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearError}
                      className="h-6 px-2 text-xs"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {t("calendar.connected")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Agenda synchronisatie actief
                  {eventsLoading && " - Laden..."}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadEvents}
                disabled={eventsLoading || isLoading}
              >
                {eventsLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={importToPlanning}
                disabled={importing}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {importing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importeren...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Importeer naar Planning
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isLoading}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                Verbreek verbinding
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Agenda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border dark:border-gray-600"
            />
          </CardContent>
        </Card>

        {/* Events */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Afspraken voor {selectedDate.toLocaleDateString("nl-NL")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  Afspraken laden...
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Geen afspraken voor deze dag</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.summary}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(event.start.dateTime).toLocaleTimeString(
                              "nl-NL",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}{" "}
                            -{" "}
                            {new Date(event.end.dateTime).toLocaleTimeString(
                              "nl-NL",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                          {event.attendees && event.attendees.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees.length} deelnemers
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => createFocusSessionFromEvent(event)}
                        >
                          Focus Sessie
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeGoogleCalendar;
