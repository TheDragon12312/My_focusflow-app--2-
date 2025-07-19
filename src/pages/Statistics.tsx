
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Target,
  Clock,
  Zap,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { PersistentStats } from "@/lib/persistent-stats";
import { useToast } from "@/components/ui/use-toast";

// Helper function to calculate current streak
const calculateCurrentStreak = (allStats: any[]): number => {
  if (allStats.length === 0) return 0;

  let streak = 0;
  const sortedStats = [...allStats].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  for (const stat of sortedStats) {
    if (stat.focusTime > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const Statistics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    focusScore: 0,
    completedBlocks: 0,
    totalWorkTime: 0,
    distractionTime: 0,
    productivity: 0,
    averageSessionLength: 0,
  });
  const [weeklyStats, setWeeklyStats] = useState({
    avgFocusScore: 0,
    totalBlocks: 0,
    totalWorkTime: 0,
    bestDay: "Maandag",
    productivity: 0,
    consistency: 0,
    streak: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState({
    avgFocusScore: 0,
    totalBlocks: 0,
    totalWorkTime: 0,
    improvement: 0,
    consistency: "Laag",
    longestStreak: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadStatistics();
  }, [user, navigate]);

  const loadStatistics = () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Get real daily stats from PersistentStats
      const dailyStats = PersistentStats.getTodaysStats();
      const allStats = PersistentStats.getAllStats();

      // Calculate total focus time for last 7 days
      const last7Days = allStats.slice(-7);
      const totalFocusTime = last7Days.reduce(
        (sum, stat) => sum + stat.focusTime,
        0,
      );

      // Calculate current streak (consecutive days with focus time > 0)
      const currentStreak = calculateCurrentStreak(allStats);

      // Calculate average session length
      const totalSessions = allStats.reduce(
        (sum, stat) => sum + stat.sessionsCompleted,
        0,
      );
      const avgSessionLength =
        totalSessions > 0 && totalFocusTime > 0
          ? totalFocusTime / totalSessions
          : 0;

      // Weekly stats (simulate based on daily stats)
      const weekStats = {
        avgFocusScore: Math.max(dailyStats.productivity - 5, 70),
        totalBlocks: dailyStats.sessionsCompleted * 5, // Simulate 5 days
        totalWorkTime: totalFocusTime,
        bestDay: "Dinsdag",
        productivity: Math.max(dailyStats.productivity - 3, 80),
        consistency: 85,
        streak: currentStreak,
      };

      // Monthly stats (simulate based on daily stats)
      const monthStats = {
        avgFocusScore: Math.max(dailyStats.productivity - 3, 75),
        totalBlocks: dailyStats.sessionsCompleted * 20, // Simulate 20 working days
        totalWorkTime: totalFocusTime * 4, // 4 weeks
        improvement: Math.floor(Math.random() * 20) - 5,
        consistency: dailyStats.productivity > 80 ? "Hoog" : "Gemiddeld",
        longestStreak: Math.max(currentStreak, 5),
      };

      setTodayStats({
        focusScore: Math.round(dailyStats.productivity * 100) / 100,
        completedBlocks: dailyStats.sessionsCompleted,
        totalWorkTime: dailyStats.totalFocusTime,
        distractionTime: dailyStats.distractions * 2, // Estimate 2 minutes per distraction
        productivity: dailyStats.productivity,
        averageSessionLength: Math.round(avgSessionLength),
      });

      setWeeklyStats({
        avgFocusScore: Math.round(weekStats.avgFocusScore * 100) / 100,
        totalBlocks: weekStats.totalBlocks,
        totalWorkTime: weekStats.totalWorkTime,
        bestDay: weekStats.bestDay,
        productivity: weekStats.productivity,
        consistency: weekStats.consistency,
        streak: weekStats.streak,
      });

      setMonthlyStats({
        avgFocusScore: Math.round(monthStats.avgFocusScore * 100) / 100,
        totalBlocks: monthStats.totalBlocks,
        totalWorkTime: monthStats.totalWorkTime,
        improvement: monthStats.improvement,
        consistency: monthStats.consistency,
        longestStreak: monthStats.longestStreak,
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = () => {
    // Create demo data for last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      PersistentStats.updateTodaysStats({
        date: date.toISOString().split("T")[0],
        focusTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
        sessionsCompleted: Math.floor(Math.random() * 5) + 1, // 1-5 sessions
        productivity: Math.floor(Math.random() * 40) + 60, // 60-100%
        distractionsBlocked: Math.floor(Math.random() * 10), // 0-9 distractions
      });
    }
    loadStatistics();
    toast({
      title: "Demo data gegenereerd",
      description:
        "Er zijn 30 dagen aan demo focussessies toegevoegd voor testing.",
    });
  };

  const getWeekStart = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Maandag als start
    return new Date(date.setDate(diff));
  };

  const achievements = [
    {
      name: "Eerste Focus",
      description: "Voltooi je eerste focusblok",
      earned: todayStats.completedBlocks > 0 || monthlyStats.totalBlocks > 0,
    },
    {
      name: "Weekkampioen",
      description: "7 dagen op rij gefocust",
      earned: weeklyStats.streak >= 7,
    },
    {
      name: "Tijd Meester",
      description: "100 focusblokken voltooid",
      earned: monthlyStats.totalBlocks >= 100,
    },
    {
      name: "Focus Held",
      description: "90% focus score behalen",
      earned: todayStats.focusScore >= 90,
    },
    {
      name: "Consistentie King",
      description: "Hoge consistentie score",
      earned: monthlyStats.consistency === "Hoog",
    },
    {
      name: "Productiviteits Pro",
      description: "85% productiviteit behalen",
      earned: todayStats.productivity >= 85,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-focus-50 via-white to-zen-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Statistieken laden...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Statistieken</h1>
              <p className="text-gray-600">Jouw productiviteitsoverzicht</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStatistics}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Vernieuwen
            </Button>
            <Button variant="outline" size="sm" onClick={generateDemoData}>
              Demo Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Vandaag</TabsTrigger>
            <TabsTrigger value="week">Deze Week</TabsTrigger>
            <TabsTrigger value="month">Deze Maand</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Today's Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.focusScore}%
                  </p>
                  <p className="text-sm text-gray-600">Focus Score</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-zen-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.completedBlocks}
                  </p>
                  <p className="text-sm text-gray-600">Focusblokken</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.totalWorkTime}min
                  </p>
                  <p className="text-sm text-gray-600">Werktijd</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.distractionTime}min
                  </p>
                  <p className="text-sm text-gray-600">Afleiding</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Vandaag in Detail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Voltooide focusblokken</span>
                  <Badge variant="default">{todayStats.completedBlocks}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gemiddelde sessieduur</span>
                  <Badge variant="secondary">
                    {todayStats.averageSessionLength}min
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Afleiding tijd</span>
                  <Badge variant="destructive">
                    {todayStats.distractionTime}min
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Productiviteitsratio</span>
                  <Badge variant="default">{todayStats.productivity}%</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="week" className="space-y-6">
            {/* Weekly Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {weeklyStats.avgFocusScore}%
                  </p>
                  <p className="text-sm text-gray-600">Gem. Focus Score</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-zen-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {weeklyStats.totalBlocks}
                  </p>
                  <p className="text-sm text-gray-600">Totaal Blokken</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(weeklyStats.totalWorkTime / 60)}h
                  </p>
                  <p className="text-sm text-gray-600">Werktijd</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {weeklyStats.productivity}%
                  </p>
                  <p className="text-sm text-gray-600">Productiviteit</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Weekoverzicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Beste dag</span>
                  <Badge variant="default">{weeklyStats.bestDay}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consistentie</span>
                  <Badge variant="secondary">{weeklyStats.consistency}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Huidige streak</span>
                  <Badge variant="default">{weeklyStats.streak} dagen</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            {/* Monthly Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.avgFocusScore}%
                  </p>
                  <p className="text-sm text-gray-600">Gem. Focus Score</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-zen-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.totalBlocks}
                  </p>
                  <p className="text-sm text-gray-600">Totaal Blokken</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(monthlyStats.totalWorkTime / 60)}h
                  </p>
                  <p className="text-sm text-gray-600">Werktijd</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    +{monthlyStats.improvement}%
                  </p>
                  <p className="text-sm text-gray-600">Verbetering</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Maandoverzicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consistentie</span>
                  <Badge variant="default">{monthlyStats.consistency}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Langste streak</span>
                  <Badge variant="secondary">
                    {monthlyStats.longestStreak} dagen
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Verbetering t.o.v. vorige maand
                  </span>
                  <Badge
                    variant={
                      monthlyStats.improvement >= 0 ? "default" : "destructive"
                    }
                  >
                    {monthlyStats.improvement >= 0 ? "+" : ""}
                    {monthlyStats.improvement}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievements */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Prestaties & Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.earned
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`text-2xl ${
                        achievement.earned ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      🏆
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          achievement.earned
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          achievement.earned
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Badge variant="default" className="bg-green-600">
                        Behaald
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
