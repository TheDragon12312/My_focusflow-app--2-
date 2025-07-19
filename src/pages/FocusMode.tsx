import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  CheckCircle,
  AlertTriangle,
  Settings,
  Brain,
  Coffee,
  ArrowLeft,
} from "lucide-react";
import { PersistentStats } from "@/lib/persistent-stats";
import { SettingsManager } from "@/lib/settings-manager";
import { notificationService } from "@/lib/notification-service";
import { useToast } from "@/hooks/use-toast";

interface TaskBlock {
  id: string;
  task: string;
  duration: number;
  description: string;
  completed: boolean;
}

const FocusMode = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const block = location.state?.block as TaskBlock;
  const initialTask = localStorage.getItem("suggestedTask") || block?.task || "Focus Sessie";
  const initialDuration = parseInt(localStorage.getItem("suggestedDuration") || block?.duration?.toString() || "25", 10);

  const [task, setTask] = useState(initialTask);
  const [duration, setDuration] = useState(initialDuration);
  const [focusTime, setFocusTime] = useState(duration * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);
  const [currentPhase, setCurrentPhase] = useState<"focus" | "break" | "longBreak">("focus");
  const [timeRemaining, setTimeRemaining] = useState(focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get settings
  const settings = SettingsManager.getSettings();
  const playSounds = settings.playSounds;
  const aiCoachingEnabled = settings.aiCoaching;

  useEffect(() => {
    // Load suggested task
    const suggestedTask = localStorage.getItem("suggestedTask");
    if (suggestedTask) {
      setTask(suggestedTask);
      localStorage.removeItem("suggestedTask");
    }

    // Load suggested duration
    const suggestedDuration = localStorage.getItem("suggestedDuration");
    if (suggestedDuration) {
      setDuration(parseInt(suggestedDuration, 10));
      localStorage.removeItem("suggestedDuration");
    }

    // Set initial time remaining
    setTimeRemaining(focusTime);
  }, []);

  useEffect(() => {
    setFocusTime(duration * 60);
    setTimeRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isRunning) {
      clearInterval(timerRef.current || 0);
    }

    return () => clearInterval(timerRef.current || 0);
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      clearInterval(timerRef.current || 0);
      playSound();

      if (currentPhase === "focus") {
        setSessionsCompleted((prevSessions) => prevSessions + 1);

        // Check if it's time for a long break
        if ((sessionsCompleted + 1) % 4 === 0) {
          setCurrentPhase("longBreak");
          setTimeRemaining(longBreakTime);
          notificationService.showNotification({
            title: "☕ Tijd voor een lange pauze!",
            message: "Je hebt 4 focus sessies voltooid. Neem een lange pauze van 15 minuten.",
            type: "info",
            actionable: true,
            actions: [
              {
                label: "Start pauze",
                action: "startLongBreak",
                style: "primary",
              },
            ],
          });
        } else {
          setCurrentPhase("break");
          setTimeRemaining(breakTime);
          notificationService.showNotification({
            title: "☕ Tijd voor een korte pauze!",
            message: "Neem een korte pauze van 5 minuten om je gedachten te verzetten.",
            type: "info",
            actionable: true,
            actions: [
              {
                label: "Start pauze",
                action: "startBreak",
                style: "primary",
              },
            ],
          });
        }
      } else {
        // Back to focus
        setCurrentPhase("focus");
        setTimeRemaining(focusTime);
        notificationService.showNotification({
          title: "🎯 Pauze voorbij!",
          message: "Tijd om weer te focussen op je taak.",
          type: "info",
          actionable: true,
          actions: [
            {
              label: "Start focus",
              action: "startFocus",
              style: "primary",
            },
          ],
        });
      }
      setIsRunning(false);
    }
  }, [timeRemaining, currentPhase, breakTime, longBreakTime, sessionsCompleted]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsRunning((prevState) => !prevState);
  };

  const resetSession = () => {
    clearInterval(timerRef.current || 0);
    setIsRunning(false);
    setCurrentPhase("focus");
    setTimeRemaining(focusTime);
  };

  const skipToNextPhase = () => {
    clearInterval(timerRef.current || 0);
    setIsRunning(false);

    if (currentPhase === "focus") {
      setCurrentPhase("break");
      setTimeRemaining(breakTime);
    } else {
      setCurrentPhase("focus");
      setTimeRemaining(focusTime);
    }
  };

  const skipToPreviousPhase = () => {
    clearInterval(timerRef.current || 0);
    setIsRunning(false);

    if (currentPhase === "focus") {
      setCurrentPhase("break");
      setTimeRemaining(breakTime);
    } else {
      setCurrentPhase("focus");
      setTimeRemaining(focusTime);
    }
  };

  const playSound = () => {
    if (playSounds && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
    }
  };

  const startSession = () => {
    if (isRunning) return;

    console.log("🎯 Starting focus session...");
    setIsRunning(true);
    setCurrentPhase("focus");
    PersistentStats.startFocusSession(user?.id || "");
    
    notificationService.showNotification({
      title: "🚀 Focus Sessie Gestart",
      message: `Je bent begonnen met een focus sessie van ${duration} minuten.`,
      type: "success",
    });
  };

  const startBreak = (breakType: "break" | "longBreak") => {
    setIsRunning(true);
    const breakDuration = breakType === "longBreak" ? longBreakTime : breakTime;
    setTimeRemaining(breakDuration);
    setCurrentPhase(breakType);

    notificationService.showNotification({
      title: "☕ Pauze Gestart",
      message: `Je hebt een pauze van ${breakDuration / 60} minuten gestart.`,
      type: "info",
    });
  };

  const completeSession = () => {
    console.log("✅ Session completed!");
    PersistentStats.completeFocusSession(user?.id || "");
    
    // Update stats
    const todayStats = PersistentStats.getTodaysStats();
    const newStats = {
      ...todayStats,
      focusTime: todayStats.focusTime + duration,
      sessionsCompleted: todayStats.sessionsCompleted + 1,
    };

    // Show completion notification
    notificationService.showNotification({
      title: "🎉 Session Voltooid!",
      message: `Je hebt ${duration} minuten gefocust gewerkt. Goed gedaan!`,
      type: "success",
      actionable: true,
      actions: [
        {
          label: "Nieuwe sessie",
          action: "newSession",
          style: "primary",
        },
        {
          label: "Pauze nemen",
          action: "takePause",
          style: "secondary",
        },
      ],
    });

    // Achievement notification
    if (newStats.sessionsCompleted === 1) {
      notificationService.showAchievement(
        "Eerste Focus Blok Voltooid",
        "Gefeliciteerd met het voltooien van je eerste focus blok!",
      );
    }

    // Navigate back to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-focus-50 via-white to-zen-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Terug naar Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Focus Mode</h1>
              <p className="text-gray-600">Blijf gefocust op je taak</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Instellingen
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Task and Timer */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              <Brain className="h-5 w-5 mr-2 text-blue-600 inline-block align-middle" />
              {task}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold">
                {formatTime(timeRemaining)}
              </div>
              <Badge variant="secondary">
                {currentPhase === "focus"
                  ? "Focus Sessie"
                  : currentPhase === "break"
                    ? "Korte Pauze"
                    : "Lange Pauze"}
              </Badge>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="icon" onClick={skipToPreviousPhase}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={toggleTimer}>
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pauze
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={skipToNextPhase}>
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Sessies voltooid: {sessionsCompleted}</span>
              <span>
                Volgende:{" "}
                {currentPhase === "focus"
                  ? "Pauze"
                  : currentPhase === "break"
                    ? "Focus"
                    : "Focus"}
              </span>
            </div>

            <Button
              className="w-full"
              variant="destructive"
              onClick={completeSession}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Sessie Voltooien
            </Button>
          </CardContent>
        </Card>

        {/* Settings Modal */}
        {isSettingsOpen && (
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                <Settings className="h-5 w-5 mr-2 text-orange-600 inline-block align-middle" />
                Sessie Instellingen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="editTask">Taak</Label>
                <Input
                  type="text"
                  id="editTask"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editDuration">Duur (minuten)</Label>
                <Input
                  type="number"
                  id="editDuration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              <Button onClick={() => setIsSettingsOpen(false)} className="w-full">
                Sluiten
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Audio element */}
      <audio ref={audioRef} src="/notification-sound.mp3" preload="auto" />
    </div>
  );
};

export default FocusMode;
