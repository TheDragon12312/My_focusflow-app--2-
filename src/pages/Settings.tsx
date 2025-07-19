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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Bell,
  Palette,
  Shield,
  Zap,
  Brain,
  Clock,
  Target,
  Eye,
  Globe,
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Trash2,
  HelpCircle,
  Calendar,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { SettingsManager, AppSettings } from "@/lib/settings-manager";
import { notificationService } from "@/lib/notification-service";
import { useTranslation } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, setLanguage, language: currentLanguage } = useTranslation();

  const [profile, setProfile] = useState({
    name: user?.email?.split("@")[0] || t("settings.defaultUserName"),
    email: user?.email || "",
    timezone: "Europe/Amsterdam",
    language: currentLanguage,
  });

  const [settings, setSettings] = useState<AppSettings>(() =>
    SettingsManager.getSettings(),
  );

  // Sync language with current i18n language
  useEffect(() => {
    setProfile(prev => ({
      ...prev,
      language: currentLanguage
    }));
    
    setSettings(prev => ({
      ...prev,
      language: currentLanguage
    }));
  }, [currentLanguage]);

  const handleSave = (section: string) => {
    toast.success(t("settings.saveSuccess", { section }));
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    SettingsManager.updateSetting(key, value);
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Apply language change immediately
    if (key === "language") {
      setLanguage(value as Language);
      setProfile(prev => ({ ...prev, language: value }));
      
      // Show success message in the new language (with slight delay)
      setTimeout(() => {
        toast.success(t("settings.languageChanged", { language: t(`lang.${value}`) }));
      }, 100);
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        profile,
        settings,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "focusflow-settings.json";
      a.click();
      URL.revokeObjectURL(url);

      toast.success(t("settings.exportSuccess"));
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t("settings.exportFailed"));
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(t("settings.deleteAccountConfirm"));

    if (confirmed) {
      logout();
      navigate("/");
      toast.success(t("settings.accountDeleted"));
    }
  };

  const resetToDefaults = () => {
    const confirmed = window.confirm(t("settings.resetConfirm"));

    if (confirmed) {
      SettingsManager.resetToDefaults();
      const newSettings = SettingsManager.getSettings();
      setSettings(newSettings);
      
      // Reset language if it was changed
      if (newSettings.language !== currentLanguage) {
        setLanguage(newSettings.language as Language);
      }
      
      toast.success(t("settings.resetSuccess"));
    }
  };

  const testNotification = () => {
    notificationService.showNotification({
      title: t("settings.testNotificationTitle"),
      message: t("settings.testNotificationMessage"),
      type: "info",
    });
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">{t("auth.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-focus-50 via-white to-zen-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("settings.title")}</h1>
              <p className="text-gray-600">{t("settings.subtitle")}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleExportData}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{t("settings.exportData")}</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="focus" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="focus" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.focus")}</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.aiCoach")}</span>
            </TabsTrigger>
            <TabsTrigger value="distraction" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.distraction")}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.notifications")}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.appearance")}</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings.tabs.integrations")}</span>
            </TabsTrigger>
          </TabsList>

          {/* Focus Settings */}
          <TabsContent value="focus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>{t("settings.focus.title")}</span>
                </CardTitle>
                <CardDescription>{t("settings.focus.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t("settings.focus.defaultFocusTime")}</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.defaultFocusTime]}
                        onValueChange={(value) =>
                          updateSetting("defaultFocusTime", value[0])
                        }
                        max={60}
                        min={5}
                        step={5}
                      />
                      <div className="text-center text-sm text-gray-600">
                        {t("settings.focus.minutes", { count: settings.defaultFocusTime })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("settings.focus.shortBreak")}</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.defaultBreakTime]}
                        onValueChange={(value) =>
                          updateSetting("defaultBreakTime", value[0])
                        }
                        max={15}
                        min={3}
                        step={1}
                      />
                      <div className="text-center text-sm text-gray-600">
                        {t("settings.focus.minutes", { count: settings.defaultBreakTime })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("settings.focus.longBreak")}</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[settings.longBreakTime]}
                        onValueChange={(value) =>
                          updateSetting("longBreakTime", value[0])
                        }
                        max={30}
                        min={10}
                        step={5}
                      />
                      <div className="text-center text-sm text-gray-600">
                        {t("settings.focus.minutes", { count: settings.longBreakTime })}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("settings.focus.autoStartBreaks.title")}</Label>
                      <p className="text-sm text-gray-600">
                        {t("settings.focus.autoStartBreaks.description")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoStartBreaks}
                      onCheckedChange={(checked) =>
                        updateSetting("autoStartBreaks", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("settings.focus.autoStartFocus.title")}</Label>
                      <p className="text-sm text-gray-600">
                        {t("settings.focus.autoStartFocus.description")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoStartFocus}
                      onCheckedChange={(checked) =>
                        updateSetting("autoStartFocus", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("settings.focus.playSounds.title")}</Label>
                      <p className="text-sm text-gray-600">
                        {t("settings.focus.playSounds.description")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.playSounds}
                      onCheckedChange={(checked) =>
                        updateSetting("playSounds", checked)
                      }
                    />
                  </div>

                  {settings.playSounds && (
                    <div className="space-y-2">
                      <Label>{t("settings.focus.soundVolume")}</Label>
                      <Slider
                        value={[settings.soundVolume]}
                        onValueChange={(value) =>
                          updateSetting("soundVolume", value[0])
                        }
                        max={100}
                        min={0}
                        step={10}
                      />
                      <div className="text-center text-sm text-gray-600">
                        {settings.soundVolume}%
                      </div>
                    </div>
                  )}
                </div>

                <Button onClick={() => handleSave(t("settings.tabs.focus"))} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {t("settings.focus.save")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Coach Settings */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>{t("settings.aiCoach.title")}</span>
                  <Badge className="bg-purple-100 text-purple-700">
                    {t("settings.aiCoach.premium")}
                  </Badge>
                </CardTitle>
                <CardDescription>{t("settings.aiCoach.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("settings.aiCoach.enable.title")}</Label>
                    <p className="text-sm text-gray-600">
                      {t("settings.aiCoach.enable.description")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableAiCoach}
                    onCheckedChange={(checked) =>
                      updateSetting("enableAiCoach", checked)
                    }
                  />
                </div>

                {settings.enableAiCoach && (
                  <>
                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t("settings.aiCoach.personality.title")}</Label>
                        <Select
                          value={settings.coachPersonality}
                          onValueChange={(value: "motivating" | "calm" | "professional") => 
                            updateSetting("coachPersonality", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="motivating">
                              {t("settings.aiCoach.personality.motivating")}
                            </SelectItem>
                            <SelectItem value="calm">
                              {t("settings.aiCoach.personality.calm")}
                            </SelectItem>
                            <SelectItem value="professional">
                              {t("settings.aiCoach.personality.professional")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("settings.aiCoach.insightFrequency.title")}</Label>
                        <Select
                          value={settings.insightFrequency}
                          onValueChange={(value: "low" | "medium" | "high") =>
                            updateSetting("insightFrequency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              {t("settings.aiCoach.insightFrequency.low")}
                            </SelectItem>
                            <SelectItem value="medium">
                              {t("settings.aiCoach.insightFrequency.medium")}
                            </SelectItem>
                            <SelectItem value="high">
                              {t("settings.aiCoach.insightFrequency.high")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Alert>
                      <HelpCircle className="h-4 w-4" />
                      <AlertDescription>
                        {t("settings.aiCoach.privacyNotice")}
                      </AlertDescription>
                    </Alert>
                  </>
                )}

                <Button onClick={() => handleSave(t("settings.tabs.aiCoach"))} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {t("settings.aiCoach.save")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distraction Settings */}
          <TabsContent value="distraction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>{t("settings.distraction.title")}</span>
                </CardTitle>
                <CardDescription>{t("settings.distraction.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("settings.distraction.enableDetection.title")}</Label>
                    <p className="text-sm text-gray-600">
                      {t("settings.distraction.enableDetection.description")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableDetection}
                    onCheckedChange={(checked) =>
                      updateSetting("enableDetection", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("settings.distraction.customBlockedSites.title")}</Label>
                  <p className="text-xs text-gray-500">
                    {t("settings.distraction.customBlockedSites.description")}
                  </p>
                  <Input
                    value={settings.customBlockedSites}
                    onChange={(e) =>
                      updateSetting("customBlockedSites", e.target.value)
                    }
                    placeholder={t("settings.distraction.customBlockedSites.placeholder")}
                  />
                </div>

                <Button onClick={() => handleSave(t("settings.tabs.distraction"))} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {t("settings.distraction.save")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>{t("settings.notifications.title")}</span>
                </CardTitle>
                <CardDescription>{t("settings.notifications.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("settings.notifications.focusReminders.title")}</Label>
                      <p className="text-sm text-gray-600">
                        {t("settings.notifications.focusReminders.description")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.focusReminders}
                      onCheckedChange={(checked) =>
                        updateSetting("focusReminders", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("settings.notifications.breakReminders.title")}</Label>
                      <p className="text-sm text-gray-600">
                        {t("settings.notifications.breakReminders.description")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.breakReminders}
                      onCheckedChange={(checked) =>
                        updateSetting("breakReminders", checked)
                      }
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={() => handleSave(t("settings.tabs.notifications"))} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {t("settings.notifications.save")}
                  </Button>
                  <Button variant="outline" onClick={testNotification}>
                    <Bell className="h-4 w-4 mr-2" />
                    {t("settings.notifications.test")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>{t("settings.appearance.title")}</span>
                </CardTitle>
                <CardDescription>{t("settings.appearance.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t("settings.appearance.language")}</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value: Language) =>
                        updateSetting("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nl">{t("lang.nl")}</SelectItem>
                        <SelectItem value="en">{t("lang.en")}</SelectItem>
                        <SelectItem value="fr">{t("lang.fr")}</SelectItem>
                        <SelectItem value="de">{t("lang.de")}</SelectItem>
                        <SelectItem value="es">{t("lang.es")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("settings.appearance.theme.title")}</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value: "light" | "dark" | "auto") =>
                        updateSetting("theme", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t("theme.light")}</SelectItem>
                        <SelectItem value="dark">{t("theme.dark")}</SelectItem>
                        <SelectItem value="auto">{t("theme.auto")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("settings.appearance.accentColor.title")}</Label>
                    <Select
                      value={settings.accentColor}
                      onValueChange={(value: "blue" | "purple" | "green" | "orange") => 
                        updateSetting("accentColor", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">{t("settings.appearance.accentColor.blue")}</SelectItem>
                        <SelectItem value="purple">{t("settings.appearance.accentColor.purple")}</SelectItem>
                        <SelectItem value="green">{t("settings.appearance.accentColor.green")}</SelectItem>
                        <SelectItem value="orange">{t("settings.appearance.accentColor.orange")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("settings.compact_mode")}</Label>
                      <p className="text-sm text-gray-600">
                        {t("settings.compact_mode_desc")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) =>
                        updateSetting("compactMode", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("settings.appearance.animations.title")}</Label>
                      <p className="text-sm text-gray-600">
                        {t("settings.appearance.animations.description")}
                      </p>
                    </div>
                    <Switch
                      checked={settings.animationsEnabled}
                      onCheckedChange={(checked) =>
                        updateSetting("animationsEnabled", checked)
                      }
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave(t("settings.tabs.appearance"))} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {t("settings.appearance.save")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{t("settings.integrations.title")}</span>
                </CardTitle>
                <CardDescription>{t("settings.integrations.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Google Calendar Integration */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{t("calendar.connectGoogle")}</h4>
                      <p className="text-sm text-gray-600">
                        {t("settings.integrations.googleCalendar.status")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button onClick={() => navigate("/calendar")}>
                      {t("settings.integrations.configure")}
                    </Button>
                  </div>
                </div>

                <Button onClick={() => handleSave(t("settings.tabs.integrations"))} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {t("settings.integrations.save")}
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{t("settings.dangerZone.title")}</span>
                </CardTitle>
                <CardDescription className="text-red-600">
                  {t("settings.dangerZone.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-700">
                      {t("settings.dangerZone.resetSettings.title")}
                    </h4>
                    <p className="text-sm text-red-600">
                      {t("settings.dangerZone.resetSettings.description")}
                    </p>
                  </div>
                  <Button variant="outline" onClick={resetToDefaults}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("settings.dangerZone.resetSettings.action")}
                  </Button>
                </div>

                <Separator className="bg-red-200" />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-700">
                      {t("settings.dangerZone.deleteAccount.title")}
                    </h4>
                    <p className="text-sm text-red-600">
                      {t("settings.dangerZone.deleteAccount.description")}
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("settings.dangerZone.deleteAccount.action")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
