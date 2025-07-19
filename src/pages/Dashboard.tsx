
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  Target,
  Settings,
  BarChart3,
  Play,
  Pause,
  LogOut,
  Mail,
  Link,
  Users,
} from "lucide-react";
import { PersistentStats } from "@/lib/persistent-stats";
import { realGoogleIntegration } from "@/lib/real-google-integration";
import { realMicrosoftIntegration } from "@/lib/real-microsoft-integration";
import { SettingsManager } from "@/lib/settings-manager";
import AIProductivityCoach from "@/components/AIProductivityCoach";
import NotificationCenter from "@/components/NotificationCenter";
import { useTranslation } from "@/lib/i18n";

interface FocusBlock {
  id: string;
  task: string;
  duration: number;
  completed: boolean;
  type: "focus" | "break";
  startTime: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [focusBlocks, setFocusBlocks] = useState<FocusBlock[]>([
    {
      id: "1",
      task: t("focus.task_placeholder").split(",")[0] || "E-mails beantwoorden",
      duration: 30,
      completed: true,
      type: "focus",
      startTime: "09:00",
    },
    {
      id: "2",
      task: "Pauze",
      duration: 15,
      completed: true,
      type: "break",
      startTime: "09:30",
    },
    {
      id: "3",
      task: "Presentatie voorbereiden",
      duration: 60,
      completed: false,
      type: "focus",
      startTime: "09:45",
    },
    {
      id: "4",
      task: "Korte pauze",
      duration: 15,
      completed: false,
      type: "break",
      startTime: "10:45",
    },
    {
      id: "5",
      task: "Vergadering bijwonen",
      duration: 45,
      completed: false,
      type: "focus",
      startTime: "11:00",
    },
  ]);

  // Krijg persistente dagelijkse statistieken (veranderen niet bij refresh!)
  const todayStats = user
    ? PersistentStats.getTodaysStats()
    : {
        date: new Date().toISOString().split("T")[0],
        focusTime: 0,
        sessionsCompleted: 0,
        productivity: 0,
        distractionsBlocked: 0,
        tasksCompleted: 0,
      };

  const focusScore = Math.round(todayStats.productivity * 100) / 100;
  const completedFocusBlocks = todayStats.sessionsCompleted;
  const totalWorkTime = Math.round((todayStats.focusTime / 60) * 100) / 100; // Converteer naar uren
  const completedWorkTime = todayStats.focusTime;

  // Check integration status
  const isGoogleConnected = realGoogleIntegration.isConnected();
  const isMicrosoftConnected = realMicrosoftIntegration.isConnected();
  const isAnyCalendarConnected = isGoogleConnected || isMicrosoftConnected;
  const emailSettings = SettingsManager.getSection("emailNotifications");
  const hasEmailsEnabled =
    emailSettings.dailyReport || emailSettings.weeklyReport;

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getCurrentBlock = () => {
    return focusBlocks.find((block) => !block.completed);
  };

  const startFocusSession = () => {
    const currentBlock = getCurrentBlock();
    if (currentBlock) {
      navigate("/focus", { state: { block: currentBlock } });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-focus-50 via-white to-zen-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.title")}</h1>
            <p className="text-gray-600">
              {t("dashboard.welcome")}, {user.email?.split("@")[0]}!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationCenter />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/calendar")}
              title={t("calendar.integration")}
            >
              <Calendar className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/email")}
              title="Email Management"
            >
              <Mail className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/statistics")}
              title={t("nav.statistics")}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/team")}
              title={t("nav.team")}
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              title={t("nav.settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Focus Score */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-primary">
              {focusScore}%
            </CardTitle>
            <CardDescription className="text-lg">
              {t("dashboard.focusScore")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={focusScore} className="h-3" />
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {completedFocusBlocks}
              </p>
              <p className="text-sm text-gray-600">{t("dashboard.focusBlocksCompleted")}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {completedWorkTime >= 60
                  ? `${totalWorkTime}h`
                  : `${completedWorkTime}min`}
              </p>
              <p className="text-sm text-gray-600">{t("dashboard.workTimeToday")}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {todayStats.distractionsBlocked || 0}
              </p>
              <p className="text-sm text-gray-600">{t("dashboard.distractionNotifications")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Integrations Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link className="h-5 w-5" />
                <span>{t("dashboard.integrations")}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/calendar")}
              >
                Beheren
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">
                      {isGoogleConnected
                        ? "Google Calendar"
                        : isMicrosoftConnected
                          ? "Microsoft Outlook"
                          : "Calendar"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isAnyCalendarConnected ? "Verbonden" : "Niet verbonden"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={isAnyCalendarConnected ? "default" : "outline"}
                  className={
                    isAnyCalendarConnected
                      ? "bg-green-100 text-green-700 border-green-200"
                      : ""
                  }
                >
                  {isAnyCalendarConnected ? "Actief" : "Inactief"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Email Rapporten</p>
                    <p className="text-sm text-gray-600">
                      {hasEmailsEnabled ? "Ingeschakeld" : "Uitgeschakeld"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={hasEmailsEnabled ? "default" : "outline"}
                  className={
                    hasEmailsEnabled
                      ? "bg-green-100 text-green-700 border-green-200"
                      : ""
                  }
                >
                  {hasEmailsEnabled ? "Actief" : "Inactief"}
                </Badge>
              </div>
            </div>

            {(!isAnyCalendarConnected || !hasEmailsEnabled) && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 Tip: Koppel je Calendar (Google of Microsoft) en schakel
                  email rapporten in voor een nog betere
                  productiviteitservaring!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Session */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{t("dashboard.currentSession")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getCurrentBlock() ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {getCurrentBlock()?.task}
                    </h3>
                    <p className="text-gray-600">
                      {getCurrentBlock()?.duration} minuten
                    </p>
                  </div>
                  <Badge
                    variant={
                      getCurrentBlock()?.type === "focus"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {getCurrentBlock()?.type === "focus" ? "Focus" : "Pauze"}
                  </Badge>
                </div>
                <Button
                  onClick={startFocusSession}
                  className="w-full"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {t("dashboard.startSession")}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">{t("dashboard.allTasksCompleted")}</p>
                <Button variant="outline" onClick={() => navigate("/planning")}>
                  {t("dashboard.planNewTasks")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Planning */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("dashboard.dailyPlanning")}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/planning")}
            >
              Aanpassen
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {focusBlocks.map((block) => (
                <div
                  key={block.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    block.completed
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      block.completed
                        ? "bg-green-500"
                        : block.type === "focus"
                          ? "bg-primary"
                          : "bg-accent"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${
                          block.completed
                            ? "text-green-700 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {block.task}
                      </span>
                      <span className="text-sm text-gray-500">
                        {block.startTime} ({block.duration}min)
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={block.type === "focus" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {block.type === "focus" ? "Focus" : "Pauze"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Productivity Coach */}
      <AIProductivityCoach />
    </div>
  );
};

export default Dashboard;
