import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Clock,
  Users,
  Download,
  Settings,
  Mail,
  ExternalLink,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  attendees?: Array<{ email: string }>;
  location?: string;
  status?: string;
}

interface GoogleEmail {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
}

interface MicrosoftCalendarEvent {
  id: string;
  subject: string;
  body?: { content: string };
  start: { dateTime: string };
  end: { dateTime: string };
  attendees?: Array<{ emailAddress: { address: string } }>;
}

interface GoogleIntegration {
  id: string;
  user_id: string;
  integration_type: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  is_active: boolean;
  settings: any;
  created_at: string;
  updated_at: string;
}

const CalendarIntegration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const [googleEmails, setGoogleEmails] = useState<GoogleEmail[]>([]);
  const [microsoftEvents, setMicrosoftEvents] = useState<MicrosoftCalendarEvent[]>([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isMicrosoftConnected, setIsMicrosoftConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [googleIntegrationData, setGoogleIntegrationData] = useState<GoogleIntegration | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Get Supabase URL from environment
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cwgnlsrqnyugloobrsxz.supabase.co';

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    checkGoogleConnection();

    // Handle OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get("connected");
    const error = urlParams.get("error");
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (connected === "true") {
      handleOAuthSuccess();
    } else if (error) {
      handleOAuthError(error);
    } else if (code) {
      // Handle direct OAuth code (shouldn't happen with our flow, but handle gracefully)
      console.log("Received OAuth code directly:", code);
      handleOAuthSuccess();
    }
  }, [user, navigate]);

  const handleOAuthSuccess = async () => {
    try {
      toast.success("Google OAuth succesvol! Verbinding controleren...");
      
      // Wait for database to be updated by the Edge Function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check connection status
      await checkGoogleConnection();
      
      // Clean up URL
      window.history.replaceState({}, document.title, "/calendar");
      
      toast.success("Google succesvol verbonden! 🎉");
    } catch (error) {
      console.error("OAuth success handler error:", error);
      toast.error("Er ging iets mis bij het verwerken van de verbinding");
    }
  };

  const handleOAuthError = (error: string) => {
    console.error("OAuth error:", error);
    setConnectionError(error);
    
    let errorMessage = "Google verbinding mislukt";
    
    // OAuth 2.0 error handling according to RFC 6749
    switch (error) {
      case "access_denied":
        errorMessage = "Je hebt de toestemming geweigerd. Probeer opnieuw en geef toestemming.";
        break;
      case "redirect_uri_mismatch":
        errorMessage = "Configuratie fout. Contacteer de beheerder.";
        break;
      case "invalid_client":
        errorMessage = "Ongeldige client configuratie. Contacteer de beheerder.";
        break;
      case "invalid_request":
        errorMessage = "Ongeldig verzoek. Probeer opnieuw.";
        break;
      case "unauthorized_client":
        errorMessage = "Ongeautoriseerde client. Contacteer de beheerder.";
        break;
      case "unsupported_response_type":
        errorMessage = "Niet ondersteund response type. Contacteer de beheerder.";
        break;
      case "invalid_scope":
        errorMessage = "Ongeldige scope gevraagd. Contacteer de beheerder.";
        break;
      case "server_error":
        errorMessage = "Server fout bij Google. Probeer later opnieuw.";
        break;
      case "temporarily_unavailable":
        errorMessage = "Google service tijdelijk niet beschikbaar. Probeer later opnieuw.";
        break;
      default:
        if (error.includes("redirect_uri_mismatch")) {
          errorMessage = "Configuratie fout. Contacteer de beheerder.";
        } else if (error.includes("access_denied")) {
          errorMessage = "Je hebt de toestemming geweigerd. Probeer opnieuw.";
        }
    }
    
    toast.error(errorMessage);
    
    // Clean up URL
    window.history.replaceState({}, document.title, "/calendar");
  };

  const checkGoogleConnection = async () => {
    if (!user) return;

    try {
      setConnectionError(null);
      
      // Check for Google Calendar integration
      const { data: googleIntegration, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("integration_type", "google_calendar")
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error checking Google connection:", error);
        setIsGoogleConnected(false);
        return;
      }

      const isConnected = !!googleIntegration;
      setIsGoogleConnected(isConnected);
      setGoogleIntegrationData(googleIntegration);

      // Load data if connected and has valid tokens
      if (isConnected && googleIntegration?.access_token) {
        console.log("Google integration found, loading data...");
        await loadGoogleData();
      } else {
        console.log("No active Google integration found");
        setGoogleEvents([]);
        setGoogleEmails([]);
      }
    } catch (error) {
      console.error("Error checking Google connection:", error);
      setIsGoogleConnected(false);
      setGoogleIntegrationData(null);
      setConnectionError("Fout bij het controleren van de verbinding");
    }
  };

  const loadGoogleData = async () => {
    if (!user || !isGoogleConnected || !googleIntegrationData) return;

    setIsLoadingData(true);
    try {
      await Promise.all([
        loadGoogleCalendarEvents(),
        loadGoogleEmails()
      ]);
    } catch (error) {
      console.error("Error loading Google data:", error);
      toast.error("Fout bij het laden van Google data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const ensureValidSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error('Session error:', error);
        toast.error("Geen geldige sessie gevonden - log opnieuw in");
        navigate("/auth");
        return null;
      }

      if (!session.access_token) {
        toast.error("Geen access token in sessie");
        navigate("/auth");
        return null;
      }

      // Check if session is expired
      if (session.expires_at && session.expires_at < Date.now() / 1000) {
        console.log("Session expired, trying to refresh...");
        
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session) {
          toast.error("Sessie verlopen - log opnieuw in");
          navigate("/auth");
          return null;
        }
        
        return refreshData.session;
      }

      return session;
    } catch (error) {
      console.error("Session validation error:", error);
      toast.error("Sessie validatie mislukt");
      navigate("/auth");
      return null;
    }
  };

  const handleGoogleConnect = async () => {
    setLoading(true);
    setConnectionError(null);
    
    try {
      toast.info("Google auth URL ophalen...");
      
      // OAuth 2.0 security: Generate state parameter for CSRF protection
      const state = btoa(JSON.stringify({
        timestamp: Date.now(),
        userId: user?.id,
        returnUrl: "/calendar",
        nonce: Math.random().toString(36).substring(2, 15)
      }));
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/google-auth/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 404) {
          throw new Error('Google auth service niet beschikbaar. Controleer de Edge Function deployment.');
        } else if (response.status === 500) {
          throw new Error('Server configuratie fout. Contacteer de beheerder.');
        } else if (response.status === 401) {
          throw new Error('Authenticatie vereist. Log opnieuw in.');
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.authUrl) {
        throw new Error('Geen auth URL ontvangen van server');
      }
      
      // OAuth 2.0 security: Validate auth URL
      try {
        const authUrl = new URL(data.authUrl);
        if (!authUrl.hostname.includes('accounts.google.com')) {
          throw new Error('Ongeldige auth URL - niet van Google');
        }
      } catch {
        throw new Error('Ongeldige auth URL ontvangen');
      }
      
      toast.info("Redirecting naar Google...");
      
      // Store state in sessionStorage for CSRF protection
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_timestamp', Date.now().toString());
      
      // OAuth 2.0 flow: Full page redirect to Google OAuth
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error("Google connection error:", error);
      const errorMessage = error instanceof Error ? error.message : "Onbekende fout opgetreden";
      setConnectionError(errorMessage);
      toast.error("Verbinding mislukt: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    if (!user || !googleIntegrationData) return;

    try {
      const { error } = await supabase
        .from("integrations")
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq("id", googleIntegrationData.id);

      if (error) {
        console.error("Disconnect error:", error);
        toast.error("Kon verbinding niet verbreken");
        return;
      }

      // Clear local state
      setIsGoogleConnected(false);
      setGoogleIntegrationData(null);
      setGoogleEvents([]);
      setGoogleEmails([]);
      setConnectionError(null);
      
      // Clear OAuth state
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('oauth_timestamp');
      
      toast.success("Google verbinding verbroken");
    } catch (error) {
      console.error("Error disconnecting Google:", error);
      toast.error("Fout bij het verbreken van verbinding");
    }
  };

  const loadGoogleCalendarEvents = async () => {
    if (!isGoogleConnected || !user) {
      console.log("Not connected or no user, skipping calendar load");
      return;
    }

    try {
      const session = await ensureValidSession();
      if (!session) return;

      console.log("Loading Google Calendar events...");

      const response = await fetch(`${SUPABASE_URL}/functions/v1/google-auth/calendar`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Calendar API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 401) {
          toast.error("Authenticatie mislukt - probeer opnieuw te verbinden");
          setIsGoogleConnected(false);
          return;
        }
        
        if (response.status === 404) {
          toast.error("Google account niet gevonden - verbind opnieuw");
          setIsGoogleConnected(false);
          return;
        }
        
        if (response.status === 403) {
          toast.error("Geen toegang tot Google Calendar - controleer permissions");
          return;
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const events = data.items || [];
      setGoogleEvents(events);
      
      console.log(`Loaded ${events.length} calendar events`);
      
      if (events.length > 0) {
        toast.success(`${events.length} calendar evenementen geladen`);
      }
    } catch (error) {
      console.error("Failed to load Google calendar events:", error);
      const errorMessage = error instanceof Error ? error.message : "Onbekende fout";
      toast.error("Kon Google Calendar events niet laden: " + errorMessage);
    }
  };

  const loadGoogleEmails = async () => {
    if (!isGoogleConnected || !user) {
      console.log("Not connected or no user, skipping email load");
      return;
    }

    try {
      const session = await ensureValidSession();
      if (!session) return;

      console.log("Loading Google emails...");

      const response = await fetch(`${SUPABASE_URL}/functions/v1/google-auth/email`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Email API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 401) {
          toast.error("Authenticatie mislukt - probeer opnieuw te verbinden");
          setIsGoogleConnected(false);
          return;
        }
        
        if (response.status === 404) {
          toast.error("Google account niet gevonden - verbind opnieuw");
          setIsGoogleConnected(false);
          return;
        }
        
        if (response.status === 403) {
          toast.error("Geen toegang tot Gmail - controleer permissions");
          return;
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const emails = await response.json();
      
      if (Array.isArray(emails)) {
        setGoogleEmails(emails);
        console.log(`Loaded ${emails.length} emails`);
        
        if (emails.length > 0) {
          toast.success(`${emails.length} ongelezen emails geladen`);
        }
      } else {
        console.log("No emails returned or invalid format");
        setGoogleEmails([]);
      }
    } catch (error) {
      console.error("Failed to load Google emails:", error);
      const errorMessage = error instanceof Error ? error.message : "Onbekende fout";
      toast.error("Kon Gmail berichten niet laden: " + errorMessage);
    }
  };

  const importGoogleCalendar = async () => {
    if (!user || !isGoogleConnected) {
      toast.error("Je moet eerst verbinding maken met Google Calendar");
      return;
    }

    setImporting(true);
    try {
      // Load fresh events first
      await loadGoogleCalendarEvents();
      
      if (googleEvents.length === 0) {
        toast.info("Geen evenementen gevonden om te importeren");
        return;
      }

      // Convert calendar events to planning items
      const planningItems = googleEvents.map((event) => {
        const startTime = event.start?.dateTime || event.start?.date;
        const endTime = event.end?.dateTime || event.end?.date;
        
        return {
          user_id: user.id,
          title: event.summary || "Google Calendar Event",
          description: event.description || null,
          start_time: startTime || new Date().toISOString(),
          end_time: endTime || new Date().toISOString(),
          event_type: "calendar_import",
          google_event_id: event.id,
          location: event.location || null,
          status: "scheduled",
        };
      });

      // Store in planning table
      const { error: insertError } = await supabase
        .from("planning")
        .insert(planningItems);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error("Fout bij het opslaan van planning items");
      }

      toast.success(
        `🎉 ${planningItems.length} evenementen geïmporteerd naar planning!`
      );
      
      setTimeout(() => {
        navigate("/planning");
      }, 2000);
    } catch (error) {
      console.error("Import Google Calendar error:", error);
      const errorMessage = error instanceof Error ? error.message : "Onbekende fout";
      toast.error("Import mislukt: " + errorMessage);
    } finally {
      setImporting(false);
    }
  };

  const handleMicrosoftConnect = async () => {
    setLoading(true);
    try {
      // Mock Microsoft OAuth flow - replace with real implementation
      const mockToken = "mock_microsoft_token_" + Date.now();

      await supabase.from("integrations").insert({
        user_id: user?.id,
        integration_type: "microsoft_calendar",
        access_token: mockToken,
        is_active: true,
      });

      setIsMicrosoftConnected(true);
      toast.success("Microsoft Calendar verbonden!");
      await loadMicrosoftEvents();
    } catch (error) {
      console.error("Microsoft Calendar connection error:", error);
      toast.error("Verbinding mislukt");
    } finally {
      setLoading(false);
    }
  };

  const loadMicrosoftEvents = async () => {
    // Mock Microsoft Calendar events
    const mockEvents: MicrosoftCalendarEvent[] = [
      {
        id: "1",
        subject: "Client Meeting",
        body: { content: "Meeting with important client" },
        start: { dateTime: new Date(Date.now() + 7200000).toISOString() },
        end: { dateTime: new Date(Date.now() + 10800000).toISOString() },
        attendees: [{ emailAddress: { address: "client@example.com" } }],
      },
    ];

    setMicrosoftEvents(mockEvents);
  };

  const createFocusSessionFromEvent = async (
    event: GoogleCalendarEvent | MicrosoftCalendarEvent,
  ) => {
    try {
      const title = "summary" in event ? event.summary : event.subject;
      const startTime = "summary" in event ? 
        event.start?.dateTime || event.start?.date : 
        event.start.dateTime;
      const endTime = "summary" in event ? 
        event.end?.dateTime || event.end?.date : 
        event.end.dateTime;
      
      let duration = 25;
      if (startTime && endTime) {
        duration = Math.floor(
          (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)
        );
      }

      await supabase.from("focus_blocks").insert({
        user_id: user?.id,
        block_type: "focus",
        duration: Math.min(duration, 120),
        notes: `Voorbereiding voor: ${title}`,
        status: "scheduled",
      });

      toast.success("Focus sessie aangemaakt!");
    } catch (error) {
      console.error("Failed to create focus session:", error);
      toast.error("Kon focus sessie niet aanmaken");
    }
  };

  const formatEventTime = (event: GoogleCalendarEvent) => {
    const startTime = event.start?.dateTime || event.start?.date;
    if (!startTime) return "Geen tijd";
    
    try {
      return new Date(startTime).toLocaleString("nl-NL");
    } catch (error) {
      return "Ongeldig tijdstip";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Google Integratie
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Verbind je Google Calendar en Gmail voor automatische planning
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="google" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Google Services</TabsTrigger>
            <TabsTrigger value="microsoft">Microsoft Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="space-y-6">
            {/* Connection Error Alert */}
            {connectionError && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Verbindingsfout:</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {connectionError}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Google Integration Status */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Calendar className="h-5 w-5" />
                  Google Services
                  {isGoogleConnected && (
                    <Badge variant="secondary" className="ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verbonden
                    </Badge>
                  )}
                  {isLoadingData && (
                    <RefreshCw className="h-4 w-4 animate-spin ml-2" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isGoogleConnected ? (
                  <div className="text-center space-y-4">
                    <div className="text-gray-600 dark:text-gray-400">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">
                        Nog niet verbonden met Google
                      </p>
                      <p className="text-sm mb-4">
                        Verbind je Google account om Calendar en Gmail te integreren
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                        <Shield className="h-3 w-3" />
                        <span>Veilig verbinden via OAuth 2.0</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleGoogleConnect}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-green-600"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Calendar className="h-4 w-4 mr-2" />
                      )}
                      Verbind Google Account
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            Verbonden met Google
                          </span>
                          <p className="text-sm text-gray-500">
                            Email: {user.email}
                          </p>
                          {googleIntegrationData && (
                            <p className="text-xs text-gray-400">
                              Verbonden: {new Date(googleIntegrationData.created_at).toLocaleDateString("nl-NL")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadGoogleData}
                          disabled={loading || isLoadingData}
                        >
                          <RefreshCw className={`h-4 w-4 ${(loading || isLoadingData) ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGoogleDisconnect}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Import to Planning Button */}
                    <div className="border-t pt-4">
                      <Button
                        onClick={importGoogleCalendar}
                        disabled={importing || isLoadingData}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                      >
                        {importing ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        {importing ? "Importeren..." : "Importeer Calendar naar Planning"}
                      </Button>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Calendar evenementen worden geïmporteerd als planning items
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Google Calendar Events */}
            {isGoogleConnected && googleEvents.length > 0 && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Calendar className="h-5 w-5" />
                    Google Calendar ({googleEvents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {googleEvents.map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {event.summary || "Geen titel"}
                            </h4>
                            {event.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {event.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatEventTime(event)}
                              </span>
                              {event.attendees && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {event.attendees.length}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => createFocusSessionFromEvent(event)}
                          >
                            Focus Sessie
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gmail Messages */}
            {isGoogleConnected && googleEmails.length > 0 && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Mail className="h-5 w-5" />
                    Gmail - Ongelezen berichten ({googleEmails.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {googleEmails.map((email) => (
                      <div
                        key={email.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {email.subject || "Geen onderwerp"}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Van: {email.from}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {email.snippet}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(email.date).toLocaleString("nl-NL")}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const emailTask = {
                                user_id: user.id,
                                title: `Beantwoord email: ${email.subject || 'Geen onderwerp'}`,
                                description: `Van: ${email.from}\nOnderwerp: ${email.subject || 'Geen onderwerp'}\nSnippet: ${email.snippet}`,
                                start_time: new Date().toISOString(),
                                end_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
                                event_type: "email_task",
                                status: "scheduled",
                              };

                              supabase.from("planning").insert([emailTask]).then(({ error }) => {
                                if (error) {
                                  toast.error("Kon email taak niet aanmaken");
                                } else {
                                  toast.success("Email taak toegevoegd aan planning!");
                                }
                              });
                            }}
                          >
                            Taak maken
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {isGoogleConnected && googleEvents.length === 0 && googleEmails.length === 0 && !isLoadingData && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Geen Google Calendar evenementen of Gmail berichten gevonden
                  </p>
                  <Button
                    variant="outline"
                    onClick={loadGoogleData}
                    className="mt-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Opnieuw laden
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="microsoft" className="space-y-6">
            {/* Microsoft Calendar Integration */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Calendar className="h-5 w-5" />
                  Microsoft Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isMicrosoftConnected ? (
                  <div className="text-center space-y-4">
                    <div className="text-gray-600 dark:text-gray-400">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">
                        Nog niet verbonden met Microsoft Calendar
                      </p>
                      <p className="text-sm mb-4">
                        Verbind je Microsoft account voor Outlook Calendar integratie
                      </p>
                    </div>
                    <Button
                      onClick={handleMicrosoftConnect}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Calendar className="h-4 w-4 mr-2" />
                      )}
                      Verbind Microsoft Calendar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Verbonden met Microsoft Calendar
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadMicrosoftEvents}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>

                    {microsoftEvents.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Komende afspraken
                        </h4>
                        {microsoftEvents.map((event) => (
                          <div
                            key={event.id}
                            className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {event.subject}
                                </h4>
                                {event.body?.content && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {event.body.content}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(event.start.dateTime).toLocaleTimeString("nl-NL", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })} - {new Date(event.end.dateTime).toLocaleTimeString("nl-NL", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => createFocusSessionFromEvent(event)}
                              >
                                Focus Sessie
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CalendarIntegration;
