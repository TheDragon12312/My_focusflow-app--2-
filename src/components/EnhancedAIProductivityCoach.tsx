import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Send,
  Target,
  Clock,
  Sparkles,
  BarChart3,
  Trophy,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface UserStats {
  focusTime: number;
  distractions: number;
  productivity: number;
  streak: number;
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = "YOUR_API_KEY_HIER"; // Vervang dit door je echte API key!

const EnhancedAIProductivityCoach = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    focusTime: 0,
    distractions: 0,
    productivity: 85,
    streak: 5,
  });

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: t("aiCoach.welcome"),
      timestamp: new Date(),
      suggestions: [
        t("aiCoach.suggestions.focusTips"),
        t("aiCoach.suggestions.dailyGoals"),
        t("aiCoach.suggestions.distractionHelp"),
        t("aiCoach.suggestions.timeManagement"),
      ],
    };
    setMessages([welcomeMessage]);

    // Load user stats
    loadUserStats();
  }, [t]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Mock data - in real app, fetch from database
      setUserStats({
        focusTime: 245, // minutes today
        distractions: 3,
        productivity: 87,
        streak: 7,
      });
    } catch (error) {
      console.error("Failed to load user stats:", error);
    }
  };

const SUPABASE_EDGE_FUNCTION_URL = "https://cwgnlsrqnyugloobrsxz.supabase.co/functions/v1/chat"; 

  
const generateAIResponse = async (userMessage: string, chatHistory: Message[]) => {
  try {
    // Transformeer chatHistory naar het formaat dat jouw backend verwacht
    const backendChatHistory = chatHistory.map((msg) => ({
      role: msg.role,
      message: msg.content,
      timestamp: msg.timestamp.toISOString(),
    }));

    const response = await fetch(SUPABASE_EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        chatHistory: backendChatHistory,
        userId: user?.id ?? "anonymous",
      }),
    });

    if (!response.ok) throw new Error("Backend gaf geen geldige respons");

    const data = await response.json();

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: data.response,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Fout bij AI response:", error);
    return {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "Sorry, er ging iets mis met het ophalen van een antwoord. Probeer het later nog eens.",
      timestamp: new Date(),
    };
  }
};

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI response error:", error);
      toast.error(t("aiCoach.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  // Voeg deze handlers toe:
  const handleAddFiveMinutes = () => {
    setUserStats(prev => ({
      ...prev,
      focusTime: prev.focusTime + 5,
    }));
  };

  const handleSubtractFiveMinutes = () => {
    setUserStats(prev => ({
      ...prev,
      focusTime: Math.max(0, prev.focusTime - 5),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(userStats.focusTime / 60)}h {userStats.focusTime % 60}m
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("aiCoach.stats.focusTime")}
            </p>
            {/* Knoppen voor +5 en -5 minuten */}
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={handleSubtractFiveMinutes}
                className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="5 minuten terug"
              >
                Terug
              </button>
              <button
                onClick={handleAddFiveMinutes}
                className="px-2 py-1 rounded bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-600"
                aria-label="5 minuten meer"
              >
                Meer
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userStats.distractions}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("aiCoach.stats.distractions")}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userStats.productivity}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("aiCoach.stats.productivity")}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userStats.streak}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("aiCoach.stats.streak")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Interface */}
      <Card className="h-[500px] flex flex-col dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Brain className="h-5 w-5 text-purple-600" />
            {t("aiCoach.title")}
            <Badge variant="outline" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === "assistant" && (
                        <Brain className="h-4 w-4 mt-0.5 text-purple-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs h-6 bg-white/20 hover:bg-white/30 text-left justify-start w-full"
                              >
                                <Lightbulb className="h-3 w-3 mr-1" />
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 animate-pulse max-w-[80%]">
                    <p className="text-sm text-gray-400 dark:text-gray-300">AI is aan het typen...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-4 flex gap-2">
            <Input
              aria-label={t("aiCoach.inputAriaLabel")}
              placeholder={t("aiCoach.inputPlaceholder")}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              aria-label={t("aiCoach.sendButtonAriaLabel")}
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAIProductivityCoach;
