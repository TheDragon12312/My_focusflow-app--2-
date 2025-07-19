import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Settings,
  Eye,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/lib/email-service";
import { SettingsManager } from "@/lib/settings-manager";

const EmailManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [emailSettings, setEmailSettings] = useState(() => {
    return SettingsManager.getSection("emailNotifications");
  });

  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [previewType, setPreviewType] = useState<
    "daily" | "weekly" | "reminder"
  >("daily");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    loadEmailHistory();
  }, [user, navigate]);

  const loadEmailHistory = () => {
    if (user?.id) {
      const history = EmailService.getEmailHistory(user.id);
      setEmailHistory(history);
    }
  };

  const updateEmailSetting = (key: string, value: boolean) => {
    const newSettings = { ...emailSettings, [key]: value };
    setEmailSettings(newSettings);

    // Update the emailNotifications nested object
    const currentEmailSettings =
      SettingsManager.getSection("emailNotifications");
    const updatedEmailSettings = { ...currentEmailSettings, [key]: value };
    SettingsManager.updateSetting("emailNotifications", updatedEmailSettings);

    toast({
      title: "Email Instellingen Opgeslagen",
      description: `${key} ${value ? "ingeschakeld" : "uitgeschakeld"}.`,
    });
  };

  const sendTestEmail = async (
    type: "daily" | "weekly" | "reminder" | "achievement",
  ) => {
    if (!user?.id || !user?.email) return;

    setIsSending(true);

    try {
      let success = false;

      switch (type) {
        case "daily":
          success = await EmailService.sendDailyReport(user.id, user.email);
          break;
        case "weekly":
          success = await EmailService.sendWeeklyReport(user.id, user.email);
          break;
        case "reminder":
          success = await EmailService.sendFocusReminder(
            user.id,
            user.email,
            "focus",
          );
          break;
        case "achievement":
          success = await EmailService.sendAchievementNotification(
            user.id,
            user.email,
            "Eerste Focus Blok Voltooid",
          );
          break;
      }

      if (success) {
        toast({
          title: "Test Email Verstuurd! 📧",
          description: `Je ${type} email is succesvol verstuurd.`,
        });

        loadEmailHistory();
      } else {
        toast({
          title: "Email Niet Verstuurd",
          description: "Email instellingen zijn uitgeschakeld.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout bij Verzenden",
        description: "Er ging iets mis bij het verzenden van de test email.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getEmailTypeIcon = (type: string) => {
    switch (type) {
      case "daily_report":
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case "weekly_report":
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case "focus_reminder":
        return <Target className="h-4 w-4 text-green-600" />;
      case "break_reminder":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "achievement":
        return <CheckCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEmailTypeLabel = (type: string) => {
    switch (type) {
      case "daily_report":
        return "Dagrapport";
      case "weekly_report":
        return "Weekrapport";
      case "focus_reminder":
        return "Focus Herinnering";
      case "break_reminder":
        return "Pauze Herinnering";
      case "achievement":
        return "Prestatie";
      default:
        return "Email";
    }
  };

  const mockEmailPreviews = {
    daily: {
      subject: "🎯 Je Dagelijkse Focus Rapport - 87.5% Focus Score",
      preview:
        "Geweldige dag! Je hebt 6 focusblokken voltooid met een totale werktijd van 4.5 uur. Je productiviteit was 87% - blijf zo doorgaan!",
    },
    weekly: {
      subject: "📊 Je Wekelijkse Focus Overzicht - 84.2% Gemiddelde Score",
      preview:
        "Deze week heb je fantastisch gepresteerd met 28 voltooide focusblokken en 22 uur productieve werktijd. Je beste dag was dinsdag!",
    },
    reminder: {
      subject: "🎯 Tijd om te Focussen - FocusFlow Herinnering",
      preview:
        "Je pauze is voorbij! Tijd om weer vol energie aan de slag te gaan. Start je volgende focus sessie voor maximale productiviteit.",
    },
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Email Management
              </h1>
              <p className="text-gray-600">
                Beheer je email notificaties en rapporten
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-blue-50 border-blue-200 text-blue-700"
          >
            <Mail className="h-3 w-3 mr-1" />
            {user.email}
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">Instellingen</TabsTrigger>
            <TabsTrigger value="preview">Voorbeeld</TabsTrigger>
            <TabsTrigger value="history">Geschiedenis</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Email Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Email Notificatie Instellingen</span>
                </CardTitle>
                <CardDescription>
                  Configureer welke emails je wilt ontvangen van FocusFlow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notificaties Inschakelen</Label>
                    <p className="text-sm text-gray-600">
                      Hoofdschakelaar voor alle email functionaliteit
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.emailDigests}
                    onCheckedChange={(checked) =>
                      updateEmailSetting("emailDigests", checked)
                    }
                  />
                </div>

                {emailSettings.emailDigests && (
                  <>
                    <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                      <h3 className="font-semibold text-gray-800">
                        📊 Rapporten
                      </h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Dagelijks Productiviteitsrapport</Label>
                          <p className="text-sm text-gray-600">
                            Ontvang elke dag om 20:00 een overzicht van je
                            prestaties
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={emailSettings.dailyReport}
                            onCheckedChange={(checked) =>
                              updateEmailSetting("dailyReport", checked)
                            }
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendTestEmail("daily")}
                            disabled={isSending}
                          >
                            Test
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Wekelijks Overzichtsrapport</Label>
                          <p className="text-sm text-gray-600">
                            Elke maandag om 09:00 een samenvatting van je week
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={emailSettings.weeklyReport}
                            onCheckedChange={(checked) =>
                              updateEmailSetting("weeklyReport", checked)
                            }
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendTestEmail("weekly")}
                            disabled={isSending}
                          >
                            Test
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pl-4 border-l-2 border-green-200">
                      <h3 className="font-semibold text-gray-800">
                        ⏰ Herinneringen
                      </h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Focus Herinneringen</Label>
                          <p className="text-sm text-gray-600">
                            Krijg een reminder om je focus sessie te starten
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={emailSettings.focusReminders}
                            onCheckedChange={(checked) =>
                              updateEmailSetting("focusReminders", checked)
                            }
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendTestEmail("reminder")}
                            disabled={isSending}
                          >
                            Test
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Pauze Herinneringen</Label>
                          <p className="text-sm text-gray-600">
                            Reminder om een pauze te nemen na lange werksessies
                          </p>
                        </div>
                        <Switch
                          checked={emailSettings.breakReminders}
                          onCheckedChange={(checked) =>
                            updateEmailSetting("breakReminders", checked)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
                      <h3 className="font-semibold text-gray-800">
                        🏆 Prestaties
                      </h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Prestatie Notificaties</Label>
                          <p className="text-sm text-gray-600">
                            Vier je successen met achievement notifications
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={emailSettings.achievementNotifications}
                            onCheckedChange={(checked) =>
                              updateEmailSetting(
                                "achievementNotifications",
                                checked,
                              )
                            }
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendTestEmail("achievement")}
                            disabled={isSending}
                          >
                            Test
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Preview */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Email Voorbeelden</span>
                </CardTitle>
                <CardDescription>
                  Bekijk hoe je emails eruit zullen zien
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Email Type</Label>
                  <Select
                    value={previewType}
                    onValueChange={(value: any) => setPreviewType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">
                        📊 Dagelijks Rapport
                      </SelectItem>
                      <SelectItem value="weekly">
                        📈 Wekelijks Rapport
                      </SelectItem>
                      <SelectItem value="reminder">
                        ⏰ Focus Herinnering
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">FocusFlow</p>
                          <p className="text-sm text-gray-600">
                            noreply@focusflow.app
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">Voorbeeld</Badge>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <h3 className="font-semibold text-lg mb-2">
                      {mockEmailPreviews[previewType].subject}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {mockEmailPreviews[previewType].preview}
                    </p>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Verstuurschema:
                        </span>
                        <span className="text-sm font-medium">
                          {previewType === "daily" && "Dagelijks om 20:00"}
                          {previewType === "weekly" && "Maandag om 09:00"}
                          {previewType === "reminder" && "Bij focus tijd"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Email Geschiedenis</span>
                    </CardTitle>
                    <CardDescription>
                      Overzicht van alle verstuurde emails
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={loadEmailHistory}>
                    <Download className="h-4 w-4 mr-2" />
                    Vernieuwen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {emailHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-600 mb-2">
                      Nog geen emails verstuurd
                    </h3>
                    <p className="text-gray-500">
                      Emails zullen hier verschijnen zodra ze worden verstuurd.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emailHistory.slice(0, 10).map((email) => (
                      <div
                        key={email.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {getEmailTypeIcon(email.type)}
                          <div>
                            <p className="font-medium">{email.subject}</p>
                            <p className="text-sm text-gray-600">
                              {getEmailTypeLabel(email.type)} •{" "}
                              {new Date(email.sentAt).toLocaleDateString(
                                "nl-NL",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {email.success ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 border-green-200 text-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verstuurd
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-50 border-red-200 text-red-700"
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Mislukt
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Email Analytics</span>
                </CardTitle>
                <CardDescription>
                  Statistieken over je email notificaties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {emailHistory.length}
                    </div>
                    <div className="text-sm text-blue-600">
                      Totaal Verstuurd
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {emailHistory.filter((e) => e.success).length}
                    </div>
                    <div className="text-sm text-green-600">Succesvol</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {
                        emailHistory.filter((e) => e.type === "daily_report")
                          .length
                      }
                    </div>
                    <div className="text-sm text-purple-600">Dagrapporten</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {
                        emailHistory.filter((e) => e && typeof e.type === "string" && e.type.includes("reminder")).length
                      }
                    </div>
                    <div className="text-sm text-orange-600">Herinneringen</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Email Types Breakdown</h3>
                  <div className="space-y-2">
                    {[
                      "daily_report",
                      "weekly_report",
                      "focus_reminder",
                      "break_reminder",
                      "achievement",
                    ].map((type) => {
                      const count = emailHistory.filter(
                        (e) => e.type === type,
                      ).length;
                      const percentage =
                        emailHistory.length > 0
                          ? (count / emailHistory.length) * 100
                          : 0;

                      return (
                        <div
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            {getEmailTypeIcon(type)}
                            <span className="text-sm">
                              {getEmailTypeLabel(type)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">
                              {count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmailManagement;
