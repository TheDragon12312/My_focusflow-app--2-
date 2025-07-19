// pages/CalendarPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calendar, ExternalLink, RefreshCw, ArrowLeft, Download, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoogleEvent {
  id: string;
  summary: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  description?: string;
  location?: string;
}

const CalendarPage: React.FC = () => {
  const { user, session } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Handle OAuth callback parameters
    const connected = searchParams.get('connected');
    const email = searchParams.get('email');
    const error = searchParams.get('error');
    
    if (connected === 'true') {
      setConnectionStatus({
        type: 'success',
        message: `Google account ${email} connected successfully! You can now import your calendar events.`
      });
      setIsConnected(true);
      toast.success('Google Calendar connected successfully!');
      
      // Clear URL parameters after showing message
      setTimeout(() => {
        setSearchParams({});
      }, 3000);
    } else if (error) {
      setConnectionStatus({
        type: 'error',
        message: `Connection failed: ${decodeURIComponent(error)}`
      });
      toast.error(`Connection failed: ${decodeURIComponent(error)}`);
    } else {
      // Check if already connected
      checkConnection();
    }
  }, [searchParams, user]);

  const checkConnection = async () => {
    if (!user || !session) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-auth/calendar`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setIsConnected(true);
        setConnectionStatus({
          type: 'success',
          message: 'Google Calendar is connected and ready to import.'
        });
      } else if (response.status === 404) {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectGoogle = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-auth/login`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      
      const data = await response.json();
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error('Google connect error:', error);
      toast.error('Failed to connect to Google');
      setLoading(false);
    }
  };

  const importCalendarEvents = async () => {
    if (!user || !session) return;
    
    setImporting(true);
    try {
      // 1. Fetch events from Google Calendar
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-auth/calendar`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      const events: GoogleEvent[] = data.data.items || [];
      
      if (events.length === 0) {
        toast.info('No events found in your Google Calendar');
        return;
      }

      // 2. Import events to planning table
      let successCount = 0;
      const errors: string[] = [];

      for (const event of events) {
        try {
          // Check if event already exists
          const { data: existing } = await supabase
            .from('planning')
            .select('id')
            .eq('user_id', user.id)
            .eq('google_event_id', event.id)
            .single();

          if (existing) {
            continue; // Skip if already imported
          }

          // Insert new planning item
          const { error: insertError } = await supabase
            .from('planning')
            .insert({
              user_id: user.id,
              title: event.summary || 'No Title',
              description: event.description || null,
              start_time: event.start?.dateTime || event.start?.date,
              end_time: event.end?.dateTime || event.end?.date,
              location: event.location || null,
              event_type: 'calendar_import',
              google_event_id: event.id,
              status: 'active',
            });

          if (insertError) {
            console.error('Insert error for event:', event.id, insertError);
            errors.push(`Failed to import: ${event.summary}`);
          } else {
            successCount++;
          }
        } catch (error) {
          console.error('Error processing event:', event.id, error);
          errors.push(`Error processing: ${event.summary}`);
        }
      }

      setImportedCount(successCount);
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} calendar events!`);
        setConnectionStatus({
          type: 'success',
          message: `✅ Imported ${successCount} events to your planning. ${errors.length > 0 ? `${errors.length} events had errors.` : ''}`
        });
      }
      
      if (errors.length > 0) {
        console.error('Import errors:', errors);
        toast.error(`${errors.length} events could not be imported`);
      }

    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import calendar events');
      setConnectionStatus({
        type: 'error',
        message: 'Failed to import calendar events. Please try again.'
      });
    } finally {
      setImporting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Calendar Integration
          </h1>
          <p className="text-gray-600">
            Connect your Google Calendar and import events to your planning overview.
          </p>
        </div>
        
        {connectionStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            connectionStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            connectionStatus.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {connectionStatus.message}
          </div>
        )}
        
        {!isConnected ? (
          <Card className="text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-full w-fit">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Connect Google Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Connect your Google Calendar to import your events into FocusFlow planning. 
                This allows you to manage all your appointments and events in one place.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={connectGoogle} 
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect Google Calendar
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500">
                  We'll redirect you to Google to authorize the connection.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Connected Status */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Google Calendar Connected</h3>
                    <p className="text-green-700 text-sm">Ready to import your calendar events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Import Section */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Import Calendar Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Import your Google Calendar events into your FocusFlow planning. 
                  Events will be added to your planning overview where you can manage them alongside your other activities.
                </p>
                
                {importedCount > 0 && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        Last import: {importedCount} events successfully imported
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={importCalendarEvents}
                    disabled={importing}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    {importing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Importing Events...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Import Calendar Events
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/planning')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Planning Overview
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> Only events from the next 30 days will be imported. 
                    Duplicate events will be automatically skipped.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
