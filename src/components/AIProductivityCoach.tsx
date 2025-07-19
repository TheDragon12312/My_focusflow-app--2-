import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Zap,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  AlertTriangle,
  Trophy,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Settings,
  Calendar,
  BarChart3,
  Send,
  Plane as Planning,
} from "lucide-react";
import {
  enhancedAIService,
  EnhancedAIInsight,
  AIChat,
} from "@/lib/enhanced-ai-service";
import { SettingsManager } from "@/lib/settings-manager";
import { PersistentStats } from "@/lib/persistent-stats";
import { notificationService } from "@/lib/notification-service";
import { useTranslation } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import {
  googleAIService,
  ChatMessage as GoogleChatMessage,
} from "@/lib/google-ai-service";
import "@/lib/test-google-ai";

interface CoachState {
  isMinimized: boolean;
  currentInsight: EnhancedAIInsight | null;
  currentInsightIndex: number;
  insights: EnhancedAIInsight[];
  lastUpdate: Date;
  isGenerating: boolean;
  showChat: boolean;
  chatMessage: string;
  chatHistory: GoogleChatMessage[];
  isSendingMessage: boolean;
  isGoogleAIInitialized: boolean;
  googleAIError: string | null;
}

// Meertalige UI teksten
const UI_TEXTS = {
  nl: {
    analyzing: "Analyseert...",
    googleAIError: "Google AI fout",
    initializing: "Google AI initialiseren...",
    insightsAvailable: "insights beschikbaar",
    chatTitle: "Chat met AI Coach",
    refreshInsights: "Vernieuw insights",
    expand: "Uitklappen",
    collapse: "Inklappen",
    aiThinking: "AI Coach denkt na...",
    tip: "💡 Tip: Vraag me alles over focus, planning of motivatie!",
    backToInsights: "← Terug naar Insights",
    aiAnalyzing: "AI analyseert je productiviteit...",
    noInsights: "Geen insights beschikbaar",
    generateInsights: "Genereer Insights",
    lastUpdate: "Laatste update:",
    testGoogleAI: "Test Google AI API",
  },
  en: {
    analyzing: "Analyzing...",
    googleAIError: "Google AI error",
    initializing: "Initializing Google AI...",
    insightsAvailable: "insights available",
    chatTitle: "Chat with AI Coach",
    refreshInsights: "Refresh insights",
    expand: "Expand",
    collapse: "Collapse",
    aiThinking: "AI Coach is thinking...",
    tip: "💡 Tip: Ask me anything about focus, planning or motivation!",
    backToInsights: "← Back to Insights",
    aiAnalyzing: "AI is analyzing your productivity...",
    noInsights: "No insights available",
    generateInsights: "Generate Insights",
    lastUpdate: "Last update:",
    testGoogleAI: "Test Google AI API",
  },
  fr: {
    analyzing: "Analyse en cours...",
    googleAIError: "Erreur Google AI",
    initializing: "Initialisation Google AI...",
    insightsAvailable: "insights disponibles",
    chatTitle: "Chatter avec le Coach IA",
    refreshInsights: "Actualiser les insights",
    expand: "Développer",
    collapse: "Réduire",
    aiThinking: "Le Coach IA réfléchit...",
    tip: "💡 Conseil: Demandez-moi tout sur la concentration, la planification ou la motivation!",
    backToInsights: "← Retour aux Insights",
    aiAnalyzing: "L'IA analyse votre productivité...",
    noInsights: "Aucun insight disponible",
    generateInsights: "Générer des Insights",
    lastUpdate: "Dernière mise à jour:",
    testGoogleAI: "Test Google AI API",
  },
  de: {
    analyzing: "Analysiert...",
    googleAIError: "Google AI Fehler",
    initializing: "Google AI initialisieren...",
    insightsAvailable: "Insights verfügbar",
    chatTitle: "Chat mit AI Coach",
    refreshInsights: "Insights aktualisieren",
    expand: "Erweitern",
    collapse: "Minimieren",
    aiThinking: "AI Coach denkt nach...",
    tip: "💡 Tipp: Fragen Sie mich alles über Fokus, Planung oder Motivation!",
    backToInsights: "← Zurück zu Insights",
    aiAnalyzing: "KI analysiert Ihre Produktivität...",
    noInsights: "Keine Insights verfügbar",
    generateInsights: "Insights generieren",
    lastUpdate: "Letztes Update:",
    testGoogleAI: "Test Google AI API",
  },
  es: {
    analyzing: "Analizando...",
    googleAIError: "Error de Google AI",
    initializing: "Inicializando Google AI...",
    insightsAvailable: "insights disponibles",
    chatTitle: "Chat con Entrenador IA",
    refreshInsights: "Actualizar insights",
    expand: "Expandir",
    collapse: "Contraer",
    aiThinking: "El Entrenador IA está pensando...",
    tip: "💡 Consejo: ¡Pregúntame cualquier cosa sobre enfoque, planificación o motivación!",
    backToInsights: "← Volver a Insights",
    aiAnalyzing: "La IA está analizando tu productividad...",
    noInsights: "No hay insights disponibles",
    generateInsights: "Generar Insights",
    lastUpdate: "Última actualización:",
    testGoogleAI: "Probar Google AI API",
  },
};

const AIProductivityCoach = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, language: currentLanguage } = useTranslation();
  const [coachState, setCoachState] = useState<CoachState>({
    isMinimized: false,
    currentInsight: null,
    currentInsightIndex: 0,
    insights: [],
    lastUpdate: new Date(),
    isGenerating: false,
    showChat: false,
    chatMessage: "",
    chatHistory: [],
    isSendingMessage: false,
    isGoogleAIInitialized: false,
    googleAIError: null,
  });

  // Get UI texts for current language
  const uiTexts = UI_TEXTS[currentLanguage] || UI_TEXTS.nl;

  useEffect(() => {
    if (!user?.id) return;

    // Initialize Google AI with current language
    const initializeGoogleAI = async () => {
      try {
        await googleAIService.initializeChat(currentLanguage);
        const googleChatHistory = googleAIService.getChatHistory();

        setCoachState((prev) => ({
          ...prev,
          chatHistory: googleChatHistory,
          isGoogleAIInitialized: true,
          googleAIError: null,
        }));

        console.log(`✅ Google AI geïnitialiseerd voor AI Coach in ${currentLanguage}`);
      } catch (error) {
        console.error("❌ Fout bij initialiseren Google AI:", error);
        setCoachState((prev) => ({
          ...prev,
          googleAIError:
            error instanceof Error
              ? error.message
              : "Onbekende fout bij Google AI",
          isGoogleAIInitialized: false,
        }));
      }
    };

    // Load existing insights
    loadStoredInsights();

    // Initialize Google AI
    initializeGoogleAI();

    // Generate new insights if needed
    const shouldGenerate =
      coachState.insights.length === 0 || shouldRefreshInsights();
    if (shouldGenerate) {
      generateInsights();
    }

    // Auto-refresh insights every 15 minutes
    const interval = setInterval(
      () => {
        if (shouldRefreshInsights()) {
          generateInsights();
        }
      },
      15 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [user, currentLanguage]);

  // Re-initialize Google AI when language changes
  useEffect(() => {
    if (coachState.isGoogleAIInitialized && user?.id) {
      const reinitializeWithNewLanguage = async () => {
        try {
          await googleAIService.initializeChat(currentLanguage);
          const googleChatHistory = googleAIService.getChatHistory();

          setCoachState((prev) => ({
            ...prev,
            chatHistory: googleChatHistory,
            googleAIError: null,
          }));

          console.log(`🌍 Google AI taal gewijzigd naar ${currentLanguage}`);
        } catch (error) {
          console.error("❌ Fout bij wijzigen taal Google AI:", error);
        }
      };

      reinitializeWithNewLanguage();
    }
  }, [currentLanguage]);

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    if (coachState.showChat && coachState.chatHistory.length > 0) {
      setTimeout(() => {
        const chatContainer = document.querySelector(
          "[data-chat-container] [data-radix-scroll-area-viewport]",
        );
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  }, [
    coachState.chatHistory.length,
    coachState.showChat,
    coachState.isSendingMessage,
  ]);

  const loadStoredInsights = () => {
    const storedInsights = enhancedAIService.getStoredInsights();

    setCoachState((prev) => ({
      ...prev,
      insights: storedInsights,
      currentInsight: storedInsights.length > 0 ? storedInsights[0] : null,
      currentInsightIndex: 0,
    }));
  };

  const shouldRefreshInsights = (): boolean => {
    if (coachState.insights.length === 0) return true;
    const latestInsight = coachState.insights[0];
    const hoursSinceUpdate =
      (Date.now() - new Date(latestInsight.timestamp).getTime()) /
      (1000 * 60 * 60);
    return hoursSinceUpdate > 1; // Refresh every hour
  };

  const generateInsights = async () => {
    if (!user?.id || coachState.isGenerating) return;

    const aiCoachingEnabled = SettingsManager.getSetting("aiCoaching");
    if (!aiCoachingEnabled) return;

    setCoachState((prev) => ({ ...prev, isGenerating: true }));

    try {
      console.log("🤖 Generating personalized AI insights...");

      // Get user stats for AI analysis
      const todayStats = PersistentStats.getTodaysStats();
      const userStats = {
        focusTime: todayStats.focusTime,
        sessionsCompleted: todayStats.sessionsCompleted,
        distractionsBlocked: todayStats.distractionsBlocked,
        productivity: todayStats.productivity,
      };

      // Pass current language to AI service
      const newInsights = await enhancedAIService.generateRealInsights(
        userStats,
        user.id,
        currentLanguage // Pass current language
      );

      // Combine with existing insights
      const allInsights = [...newInsights, ...coachState.insights].slice(0, 10);

      setCoachState((prev) => ({
        ...prev,
        insights: allInsights,
        currentInsight: allInsights.length > 0 ? allInsights[0] : null,
        currentInsightIndex: 0,
        lastUpdate: new Date(),
        isGenerating: false,
      }));

      console.log(`✅ Personalized AI insights generated successfully in ${currentLanguage}`);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      setCoachState((prev) => ({ ...prev, isGenerating: false }));
    }
  };

  const sendChatMessage = async () => {
    if (
      !coachState.chatMessage.trim() ||
      coachState.isSendingMessage ||
      !user?.id ||
      !coachState.isGoogleAIInitialized
    )
      return;

    const messageToSend = coachState.chatMessage.trim();

    // Clear input immediately for better UX
    setCoachState((prev) => ({
      ...prev,
      chatMessage: "",
      isSendingMessage: true,
    }));

    try {
      console.log("💬 Sending chat message to Google AI:", messageToSend);

      // Send message using Google AI service
      const response = await googleAIService.sendMessage(messageToSend);

      console.log(
        "✅ Google AI response received:",
        response.substring(0, 100) + "...",
      );

      // Update chat history from Google AI service
      const updatedHistory = googleAIService.getChatHistory();
      setCoachState((prev) => ({
        ...prev,
        chatHistory: updatedHistory,
        isSendingMessage: false,
        googleAIError: null,
      }));

      // Auto-scroll to bottom of chat
      setTimeout(() => {
        const chatContainer = document.querySelector("[data-chat-container]");
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("❌ Failed to send chat message to Google AI:", error);

      // Show error message in chat in current language
      const errorMessages = {
        nl: "Sorry, er ging iets mis bij het versturen van je bericht. Probeer het opnieuw! 🔄",
        en: "Sorry, something went wrong sending your message. Please try again! 🔄",
        fr: "Désolé, une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer! 🔄",
        de: "Entschuldigung, beim Senden Ihrer Nachricht ist etwas schief gelaufen. Bitte versuchen Sie es erneut! 🔄",
        es: "Lo siento, algo salió mal al enviar tu mensaje. ¡Por favor, inténtalo de nuevo! 🔄",
      };

      const errorMessage: GoogleChatMessage = {
        role: "model",
        content: errorMessages[currentLanguage] || errorMessages.nl,
        timestamp: new Date(),
      };

      setCoachState((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory, errorMessage],
        isSendingMessage: false,
        googleAIError:
          error instanceof Error ? error.message : "Onbekende fout",
      }));
    }
  };

  const toggleChat = () => {
    setCoachState((prev) => ({
      ...prev,
      showChat: !prev.showChat,
    }));
  };

  const dismissInsight = () => {
    if (!user?.id || !coachState.currentInsight) return;

    enhancedAIService.markInsightAsRead(coachState.currentInsight.id);

    const remainingInsights = coachState.insights.filter(
      (insight) => insight.id !== coachState.currentInsight?.id,
    );

    setCoachState((prev) => ({
      ...prev,
      insights: remainingInsights,
      currentInsight: remainingInsights[0] || null,
      currentInsightIndex: 0,
    }));
  };

  const navigateInsight = (direction: "prev" | "next") => {
    if (coachState.insights.length === 0) return;

    let newIndex = coachState.currentInsightIndex;

    if (direction === "next") {
      newIndex = (newIndex + 1) % coachState.insights.length;
    } else {
      newIndex = newIndex === 0 ? coachState.insights.length - 1 : newIndex - 1;
    }

    setCoachState((prev) => ({
      ...prev,
      currentInsightIndex: newIndex,
      currentInsight: prev.insights[newIndex] || null,
    }));
  };

  const toggleMinimize = () => {
    setCoachState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  };

  const handleAction = async () => {
    if (!coachState.currentInsight?.action) return;

    const action = coachState.currentInsight.action.toLowerCase();
    console.log("🤖 AI Action triggered:", action);

    try {
      // Multi-language action detection
      const actionPatterns = {
        focus: ["ga verder", "start sessie", "start", "continue", "commencer", "weiter", "continuar"],
        pause: ["pauze", "pause", "pausa", "descanso"],
        statistics: ["statistieken", "statistics", "statistiques", "statistiken", "estadísticas"],
        settings: ["instellingen", "settings", "paramètres", "einstellungen", "configuración"],
      };

      let actionType = null;
      for (const [type, patterns] of Object.entries(actionPatterns)) {
        if (patterns.some(pattern => action.includes(pattern))) {
          actionType = type;
          break;
        }
      }

      switch (actionType) {
        case "focus":
          navigate("/focus");
          break;
        case "pause":
          navigate("/pause");
          break;
        case "statistics":
          navigate("/statistics");
          break;
        case "settings":
          navigate("/settings");
          break;
        default:
          notificationService.showNotification({
            title: "🤖 AI Actie Uitgevoerd",
            message: `"${coachState.currentInsight.action}" is succesvol uitgevoerd!`,
            type: "success",
          });
      }

      dismissInsight();
    } catch (error) {
      console.error("❌ Error executing AI action:", error);

      notificationService.showNotification({
        title: "⚠️ Actie Mislukt",
        message: "Er ging iets mis bij het uitvoeren van de AI actie.",
        type: "error",
      });
    }
  };

  const getInsightIcon = (type: EnhancedAIInsight["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "achievement":
        return <Trophy className="h-4 w-4" />;
      case "tip":
        return <Lightbulb className="h-4 w-4" />;
      case "suggestion":
        return <Target className="h-4 w-4" />;
      case "motivation":
        return <Zap className="h-4 w-4" />;
      case "health":
        return <Coffee className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: EnhancedAIInsight["type"]) => {
    switch (type) {
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "achievement":
        return "text-green-600 bg-green-50 border-green-200";
      case "tip":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "suggestion":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "motivation":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "health":
        return "text-teal-600 bg-teal-50 border-teal-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority: EnhancedAIInsight["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Don't render if AI is disabled
  const aiCoachingEnabled = SettingsManager.getSetting("aiCoaching");
  if (!aiCoachingEnabled || !user) return null;

  return (
    <Card
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        coachState.isMinimized
          ? "w-16 h-16"
          : coachState.showChat
            ? "w-96 max-h-[600px]"
            : "w-80 max-h-96"
      } shadow-xl border-l-4 border-l-blue-500 bg-white`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/ai-coach-avatar.png" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                <Brain className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {!coachState.isMinimized && (
              <div>
                <CardTitle className="text-sm font-medium">
                  {t("aiCoach.title")}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {coachState.isGenerating
                    ? uiTexts.analyzing
                    : coachState.googleAIError
                      ? uiTexts.googleAIError
                      : !coachState.isGoogleAIInitialized
                        ? uiTexts.initializing
                        : `${coachState.insights.length} ${uiTexts.insightsAvailable}`}
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {!coachState.isMinimized && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-6 w-6 p-0"
                  title={uiTexts.chatTitle}
                >
                  <MessageCircle className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateInsights}
                  disabled={coachState.isGenerating}
                  className="h-6 w-6 p-0"
                  title={uiTexts.refreshInsights}
                >
                  <RefreshCw
                    className={`h-3 w-3 ${coachState.isGenerating ? "animate-spin" : ""}`}
                  />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMinimize}
              className="h-6 w-6 p-0"
              title={coachState.isMinimized ? uiTexts.expand : uiTexts.collapse}
            >
              {coachState.isMinimized ? (
                <Maximize2 className="h-3 w-3" />
              ) : (
                <Minimize2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!coachState.isMinimized && (
        <CardContent className="pt-0">
          {coachState.showChat ? (
            // Chat Interface
            <div className="space-y-3">
              <ScrollArea className="h-60" data-chat-container>
                <div className="space-y-2 pr-4">
                  {coachState.chatHistory.length === 0 ? (
                    <div className="text-center py-4">
                      <Brain className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {t("aiCoach.welcome")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("aiCoach.inputPlaceholder")}
                      </p>
                    </div>
                  ) : (
                    <>
                      {coachState.chatHistory.map((chat, index) => (
                        <div
                          key={`${chat.role}-${index}-${chat.timestamp.getTime()}`}
                          className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                              chat.role === "user"
                                ? "bg-blue-600 text-white rounded-br-sm"
                                : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                            }`}
                          >
                            <p className="leading-relaxed">{chat.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {chat.timestamp.toLocaleTimeString(
                                currentLanguage === "nl" ? "nl-NL" : 
                                currentLanguage === "en" ? "en-US" :
                                currentLanguage === "fr" ? "fr-FR" :
                                currentLanguage === "de" ? "de-DE" :
                                currentLanguage === "es" ? "es-ES" : "nl-NL",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ))}

                      {coachState.isSendingMessage && (
                        <div className="flex justify-start animate-fade-in">
                          <div className="bg-white border border-gray-200 rounded-lg rounded-bl-sm p-3 max-w-[85%] shadow-sm">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-blue-500 animate-pulse" />
                              <span className="text-sm text-gray-600">
                                {uiTexts.aiThinking}
                              </span>
                              <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={coachState.chatMessage}
                  onChange={(e) =>
                    setCoachState((prev) => ({
                      ...prev,
                      chatMessage: e.target.value,
                    }))
                  }
                  placeholder={t("aiCoach.inputPlaceholder")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  className="flex-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={
                    coachState.isSendingMessage ||
                    !coachState.isGoogleAIInitialized
                  }
                  autoComplete="off"
                />
                <Button
                  onClick={sendChatMessage}
                  disabled={
                    !coachState.chatMessage.trim() ||
                    coachState.isSendingMessage ||
                    !coachState.isGoogleAIInitialized
                  }
                  size="sm"
                  className={`px-3 transition-all duration-200 ${
                    coachState.chatMessage.trim() &&
                    !coachState.isSendingMessage &&
                    coachState.isGoogleAIInitialized
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {coachState.isSendingMessage ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">
                    {uiTexts.tip}
                  </p>
                  {process.env.NODE_ENV === "development" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        googleAIService.testConnection().then(console.log)
                      }
                      className="text-xs px-1 py-0.5 h-auto opacity-50 hover:opacity-100"
                      title={uiTexts.testGoogleAI}
                    >
                      🧪
                    </Button>
                  )}
                  {coachState.googleAIError && (
                    <span
                      className="text-xs text-red-500"
                      title={coachState.googleAIError}
                    >
                      ⚠️
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="text-xs px-2 py-1 h-auto"
                >
                  {uiTexts.backToInsights}
                </Button>
              </div>
            </div>
          ) : (
            // Insights Interface
            <>
              {coachState.isGenerating ? (
                <div className="text-center py-4">
                  <Brain className="h-8 w-8 mx-auto text-blue-500 mb-2 animate-pulse" />
                  <p className="text-sm text-blue-600 font-medium">
                    {uiTexts.aiAnalyzing}
                  </p>
                  <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              ) : coachState.currentInsight ? (
                <div className="space-y-3">
                  {/* Current Insight */}
                  <div
                    className={`p-3 rounded-lg border ${getInsightColor(coachState.currentInsight.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {getInsightIcon(coachState.currentInsight.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">
                              {coachState.currentInsight.title}
                            </h4>
                            {coachState.insights.length > 1 && (
                              <Badge
                                variant="outline"
                                className="text-xs px-1 h-5"
                              >
                                {coachState.currentInsightIndex + 1}/
                                {coachState.insights.length}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${getPriorityColor(coachState.currentInsight.priority)}`}
                            />
                            {coachState.insights.length > 1 && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigateInsight("prev")}
                                  className="h-4 w-4 p-0 opacity-60 hover:opacity-100"
                                >
                                  <ChevronLeft className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigateInsight("next")}
                                  className="h-4 w-4 p-0 opacity-60 hover:opacity-100"
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={dismissInsight}
                              className="h-4 w-4 p-0 opacity-60 hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                          {coachState.currentInsight.message}
                        </p>
                        {coachState.currentInsight.actionable &&
                          coachState.currentInsight.action && (
                            <Button
                              size="sm"
                              onClick={handleAction}
                              className="text-xs h-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {coachState.currentInsight.action}
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Last Update */}
                  <div className="text-xs text-gray-400 text-center">
                    {uiTexts.lastUpdate}{" "}
                    {coachState.lastUpdate.toLocaleTimeString(
                      currentLanguage === "nl" ? "nl-NL" : 
                      currentLanguage === "en" ? "en-US" :
                      currentLanguage === "fr" ? "fr-FR" :
                      currentLanguage === "de" ? "de-DE" :
                      currentLanguage === "es" ? "es-ES" : "nl-NL",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Brain className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    {uiTexts.noInsights}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateInsights}
                    disabled={coachState.isGenerating}
                    className="text-xs"
                  >
                    <RefreshCw
                      className={`h-3 w-3 mr-1 ${coachState.isGenerating ? "animate-spin" : ""}`}
                    />
                    {uiTexts.generateInsights}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default AIProductivityCoach;
