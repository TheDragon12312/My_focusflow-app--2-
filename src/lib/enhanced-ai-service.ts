import { aiService } from "./ai-service";
import { supabase } from "@/integrations/supabase/client";

export interface EnhancedAIInsight {
  id: string;
  type:
    | "productivity"
    | "break"
    | "motivation"
    | "health"
    | "schedule"
    | "warning"
    | "achievement"
    | "tip"
    | "suggestion";
  title: string;
  message: string;
  actionable: boolean;
  action?: string;
  priority: "low" | "medium" | "high";
  timestamp: Date;
  read: boolean;
}

export interface AIChat {
  id: string;
  role: "user" | "assistant";
  message: string;
  timestamp: Date;
}

class EnhancedAIService {
  private isGenerating = false;
  private chatHistory: AIChat[] = [];

  // Diverse AI responses gebaseerd op gebruikersstatistieken
  private generatePersonalizedInsights(userStats: any): EnhancedAIInsight[] {
    const insights: EnhancedAIInsight[] = [];
    const currentHour = new Date().getHours();

    // Diversiteit van insights gebaseerd op verschillende factoren
    const insightTemplates = [
      // Productiviteitspatronen
      {
        condition: () => userStats.focusTime > 120,
        type: "achievement" as const,
        title: "Uitstekende focus! 🎯",
        message: `Je hebt vandaag al ${Math.floor(userStats.focusTime / 60)} uur gefocust gewerkt. Dit is een geweldige prestatie!`,
        action: "Blijf volhouden",
        priority: "high" as const,
      },
      {
        condition: () => userStats.focusTime < 30 && currentHour > 14,
        type: "motivation" as const,
        title: "Even opnieuw beginnen? 💪",
        message:
          "De middag is een perfecte tijd om je focus te herwinnen. Een korte sessie kan wonderen doen!",
        action: "Start 25min sessie",
        priority: "medium" as const,
      },
      // Gezondheidsadvies
      {
        condition: () =>
          userStats.sessionsCompleted > 3 && userStats.focusTime > 90,
        type: "health" as const,
        title: "Tijd voor een pauze! 🌿",
        message:
          "Je hebt hard gewerkt vandaag. Een korte wandeling of stretch oefening kan je energie opnieuw opladen.",
        action: "Neem een pauze",
        priority: "medium" as const,
      },
      // Tijdspecifieke tips
      {
        condition: () => currentHour >= 9 && currentHour <= 11,
        type: "tip" as const,
        title: "Ochtend productiviteit! ☀️",
        message:
          "Dit is je gouden uur! De meeste mensen zijn 's ochtends het meest productief. Pak je moeilijkste taak aan!",
        action: "Start moeilijkste taak",
        priority: "high" as const,
      },
      {
        condition: () => currentHour >= 14 && currentHour <= 16,
        type: "suggestion" as const,
        title: "Middagdip overwinnen 🔄",
        message:
          "De middagdip is normaal. Probeer een korte wandeling of een gezonde snack voor meer energie.",
        action: "Korte pauze nemen",
        priority: "medium" as const,
      },
      // Motivatie gebaseerd op prestaties
      {
        condition: () => userStats.productivity > 80,
        type: "achievement" as const,
        title: "Top prestatie! 🏆",
        message: `Je productiviteitsscore van ${userStats.productivity}% is uitstekend! Je bent echt in de flow.`,
        action: "Ga zo door",
        priority: "high" as const,
      },
      {
        condition: () => userStats.distractionsBlocked > 5,
        type: "warning" as const,
        title: "Veel afleidingen! 🚫",
        message: `${userStats.distractionsBlocked} afleidingen geblokkeerd. Misschien tijd om je werkplek aan te passen?`,
        action: "Check omgeving",
        priority: "medium" as const,
      },
      // Algemene motivatie
      {
        condition: () => true,
        type: "motivation" as const,
        title: "Elke stap telt! 👣",
        message:
          "Kleine, consistente acties leiden tot grote resultaten. Je bent op de goede weg!",
        action: "Volgende stap zetten",
        priority: "low" as const,
      },
      {
        condition: () => userStats.sessionsCompleted === 0,
        type: "suggestion" as const,
        title: "Laten we beginnen! 🚀",
        message:
          "Een reis van duizend mijl begint met een eerste stap. Start je eerste focus sessie vandaag!",
        action: "Start eerste sessie",
        priority: "high" as const,
      },
    ];

    // Selecteer relevante insights
    insightTemplates.forEach((template) => {
      if (template.condition()) {
        insights.push({
          id: `insight_${Date.now()}_${Math.random()}`,
          type: template.type,
          title: template.title,
          message: template.message,
          actionable: true,
          action: template.action,
          priority: template.priority,
          timestamp: new Date(),
          read: false,
        });
      }
    });

    // Shuffle en limiteer tot 3 insights
    return insights.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  async generateRealInsights(
    userStats: any,
    userId: string,
  ): Promise<EnhancedAIInsight[]> {
    if (this.isGenerating) {
      console.log("AI analysis already in progress...");
      return [];
    }

    this.isGenerating = true;

    try {
      console.log("🤖 Starting personalized AI analysis...", userStats);

      // Genereer gepersonaliseerde insights
      const personalizedInsights = this.generatePersonalizedInsights(userStats);

      // Probeer ook externe AI als beschikbaar
      try {
        const { data, error } = await supabase.functions.invoke(
          "ai-coach-analysis",
          {
            body: {
              userStats,
              userId,
            },
          },
        );

        if (!error && data?.insight) {
          const aiInsight: EnhancedAIInsight = {
            ...data.insight,
            timestamp: new Date(data.insight.timestamp),
          };
          personalizedInsights.unshift(aiInsight);
        }
      } catch (error) {
        console.log("External AI not available, using personalized insights");
      }

      // Store insights
      personalizedInsights.forEach((insight) => this.storeInsight(insight));

      console.log(
        "✅ Personalized AI insights generated:",
        personalizedInsights,
      );
      return personalizedInsights;
    } catch (error) {
      console.error("Failed to generate AI insights:", error);

      // Fallback naar basis motivatie
      const fallbackInsight: EnhancedAIInsight = {
        id: `fallback_${Date.now()}`,
        type: "motivation",
        title: "Blijf gefocust! 🎯",
        message:
          "Je doet het geweldig! Elke focus sessie brengt je dichter bij je doelen.",
        actionable: true,
        action: "Ga verder",
        priority: "medium",
        timestamp: new Date(),
        read: false,
      };

      this.storeInsight(fallbackInsight);
      return [fallbackInsight];
    } finally {
      this.isGenerating = false;
    }
  }

  // Verbeterde chat functionaliteit met echte AI begrip
  async sendChatMessage(message: string, userId: string): Promise<string> {
    const userMessage: AIChat = {
      id: `user_${Date.now()}`,
      role: "user",
      message,
      timestamp: new Date(),
    };

    this.chatHistory.push(userMessage);

    // Probeer eerst externe AI via nieuwe OpenRouter function
    let aiResponse: string;

    try {
      console.log("🤖 Sending message to Google AI...", {
        message: message.substring(0, 50) + "...",
      });

      const { data, error } = await supabase.functions.invoke("ai-coach-chat", {
        body: {
          message: message.trim(),
          chatHistory: this.chatHistory.slice(-10).map((chat) => ({
            role: chat.role,
            message: chat.message,
            timestamp: chat.timestamp.toISOString(),
          })),
          userId,
        },
      });

      console.log("🤖 Google AI response:", { data, error });

      if (!error && data?.response && data.response.trim().length > 0) {
        const response = data.response.trim();

        // Check if this is a fallback response from the function
        const isFallbackResponse =
          response.includes("problemen met mijn verbinding") ||
          response.includes("technische storing") ||
          response.includes("API key") ||
          response.includes("kan nu even geen antwoord") ||
          response.includes("❌") ||
          response.includes("Google AI API fout");

        if (isFallbackResponse) {
          console.log(
            "⚠️ Received fallback response from function, AI API call failed inside function",
          );
          console.log("📝 Fallback response:", response);
          aiResponse =
            "❌ AI API call faalde in de Supabase function. Controleer de deployment en API key configuratie.";
        } else {
          aiResponse = response;
          console.log(
            "✅ Got REAL AI response from Google AI:",
            aiResponse.substring(0, 100) + "...",
          );
        }
      } else {
        console.log(
          "⚠️ OpenRouter function call failed:",
          error || "Empty response",
        );
        aiResponse =
          "❌ Supabase function call faalde. Controleer of de function correct is gedeployed.";
      }
    } catch (error) {
      console.error("❌ External AI chat failed:", error);
      console.log("🔄 Using intelligent local responses");
      aiResponse = this.generateIntelligentResponse(message);
    }

    const assistantMessage: AIChat = {
      id: `ai_${Date.now()}`,
      role: "assistant",
      message: aiResponse,
      timestamp: new Date(),
    };

    this.chatHistory.push(assistantMessage);
    this.storeChatHistory();

    return aiResponse;
  }

  private generateIntelligentResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    const words = lowerMessage.split(" ");

    // Detecteer sentiment en intentie
    const isQuestion =
      lowerMessage.includes("?") ||
      lowerMessage.startsWith("hoe") ||
      lowerMessage.startsWith("wat") ||
      lowerMessage.startsWith("waarom") ||
      lowerMessage.startsWith("wanneer") ||
      lowerMessage.startsWith("waar");

    const isNegative = words.some((word) =>
      [
        "moe",
        "uitgeput",
        "demotiverend",
        "moeilijk",
        "lukt niet",
        "probleem",
        "stress",
        "druk",
      ].includes(word),
    );
    const isPositive = words.some((word) =>
      [
        "goed",
        "geweldig",
        "super",
        "top",
        "succesvol",
        "gelukt",
        "blij",
        "tevreden",
      ].includes(word),
    );

    // Specifieke onderwerpen detecteren
    if (
      lowerMessage.includes("focus") ||
      lowerMessage.includes("concentratie") ||
      lowerMessage.includes("aandacht")
    ) {
      if (isQuestion) {
        if (
          lowerMessage.includes("verbeteren") ||
          lowerMessage.includes("beter")
        ) {
          return "Om je focus te verbeteren kun je proberen: 1) Een rustige werkruimte creëren zonder afleidingen, 2) De Pomodoro techniek gebruiken (25 min werken, 5 min pauze), 3) Je telefoon wegleggen tijdens werkblokken. Wat voor werk doe je meestal waar je je op wilt concentreren?";
        } else if (
          lowerMessage.includes("lang") ||
          lowerMessage.includes("tijd")
        ) {
          return "De ideale focustijd verschilt per persoon, maar gemiddeld kunnen we 90-120 minuten diep geconcentreerd zijn. Begin met kortere blokken van 25-45 minuten en bouw langzaam op. Luister naar je lichaam - merk je dat je aandacht wegdwaalt? Dan is het tijd voor een pauze!";
        }
      }

      if (isNegative) {
        return "Ik begrijp dat focus soms lastig kan zijn. Dit is heel normaal! Probeer niet jezelf te hard te beoordelen. Begin klein - zelfs 15 minuten gefocust werk is een overwinning. Wat maakt het op dit moment moeilijk om je te concentreren?";
      }

      return "Focus is zoals een spier - hoe meer je het traint, hoe sterker het wordt! Start met korte sessies en vergeet niet regelmatig pauzes te nemen. Wat is je grootste uitdaging met concentreren?";
    }

    if (
      lowerMessage.includes("motivatie") ||
      lowerMessage.includes("gemotiveerd") ||
      lowerMessage.includes("inspiratie")
    ) {
      if (isNegative) {
        return "Het is oké om periodes te hebben waarin motivatie laag is - dit overkomt iedereen! Probeer je 'waarom' te herinneren: waarom ben je met dit project/doel begonnen? Soms helpt het ook om een kleine, makkelijke taak te doen om momentum op te bouwen. Wat zou je vandaag helpen om weer een stapje vooruit te zetten?";
      }

      if (isQuestion) {
        return "Motivatie is als het weer - het komt en gaat. Daarom zijn gewoontes zo belangrijk! Maak kleine dagelijkse routines die je richting je doel brengen, ook als je niet gemotiveerd bent. Wat is iets kleins dat je elke dag kunt doen voor je doel?";
      }

      return "Geweldig dat je bezig bent met je motivatie! Onthoud: kleine stappen leiden tot grote veranderingen. Vier elke kleine overwinning - ze tellen allemaal mee! 🌟";
    }

    if (
      lowerMessage.includes("moe") ||
      lowerMessage.includes("energie") ||
      lowerMessage.includes("uitgeput")
    ) {
      if (isQuestion) {
        return "Vermoeidheid kan verschillende oorzaken hebben. Check eerst: slaap je genoeg (7-9 uur)? Eet je regelmatige, gezonde maaltijden? Beweeg je genoeg? Ook mentale vermoeidheid is echt - neem pauzes en doe iets leuks! Wat denk je dat het grootste bijdraagt aan je vermoeidheid?";
      }

      return "Ik hoor dat je moe bent. Dat is een belangrijk signaal van je lichaam! Misschien is het tijd voor een echte pauze - een korte wandeling, wat water drinken, of een paar diepe ademhalingen. Je productiviteit wordt beter als je eerst voor jezelf zorgt. ❤️";
    }

    if (
      lowerMessage.includes("planning") ||
      lowerMessage.includes("organiseren") ||
      lowerMessage.includes("structuur")
    ) {
      if (isQuestion) {
        return "Voor goede planning kun je proberen: 1) Start elke dag met je 3 belangrijkste taken (MIT), 2) Gebruik tijdblokken in je agenda, 3) Plan ook pauzes in! Heb je al een planning systeem dat je gebruikt, of begin je helemaal opnieuw?";
      }

      return "Planning is de sleutel tot succes! Begin simpel: schrijf vanavond 3 dingen op die je morgen wilt bereiken. Niet meer, niet minder. Complexiteit kun je later toevoegen. 📋";
    }

    if (
      lowerMessage.includes("pauze") ||
      lowerMessage.includes("rust") ||
      lowerMessage.includes("ontspanning")
    ) {
      return "Pauzes zijn geen luxe, maar noodzaak! Je brein heeft tijd nodig om te herstellen en nieuwe ideeën te vormen. Probeer de 20-20-20 regel: elke 20 minuten, kijk 20 seconden naar iets 20 meter weg. Wat doe je graag in je pauzes?";
    }

    // Emotionele ondersteuning
    if (isPositive) {
      return "Wat fijn om te horen dat het goed gaat! 🎉 Dat is geweldig. Blijf dit momentum vasthouden en vergeet niet om jezelf te belonen voor je successen. Wat heeft het meest geholpen om dit resultaat te bereiken?";
    }

    if (isNegative && !lowerMessage.includes("moe")) {
      return "Ik begrijp dat dit moeilijk voor je is. Het is oké om moeilijke momenten te hebben - ze maken deel uit van de reis naar je doelen. Probeer jezelf met compassie te behandelen. Wat zou je tegen een goede vriend zeggen in jouw situatie? 💙";
    }

    // Vragen over de AI coach zelf
    if (
      lowerMessage.includes("wie ben je") ||
      lowerMessage.includes("wat ben je") ||
      lowerMessage.includes("help")
    ) {
      return "Ik ben je persoonlijke AI productiviteitscoach! Ik help je met focus, motivatie, planning en alles rond productiviteit. Je kunt me alles vragen over tijdmanagement, werkgewoontes, of gewoon een gesprek voeren als je even wilt praten. Waar kan ik je mee helpen? 🤖";
    }

    // Algemene gesprekssituaties
    if (isQuestion) {
      return "Dat is een interessante vraag! Om je beter te kunnen helpen, vertel me wat meer over je situatie. Wat heb je al geprobeerd en wat zou je graag anders willen zien? Ik denk graag met je mee! 🤔";
    }

    // Default intelligente antwoorden gebaseerd op context
    const contextualResponses = [
      "Ik begrijp wat je bedoelt. Productiviteit is heel persoonlijk - wat voor de ene persoon werkt, werkt niet voor iedereen. Vertel me meer over je specifieke situatie, dan kan ik je gerichtere tips geven.",
      "Dank je voor het delen! Het is belangrijk om deze dingen bespreekbaar te maken. Hoe voel je je er nu over, en wat zou je helpen om je beter te voelen?",
      "Dat klinkt als iets waar veel mensen mee worstelen. Je bent niet alleen hierin! Wat denk je dat de grootste uitdaging is in jouw specifieke situatie?",
      "Ik waardeer je openheid. Soms helpt het om gewoon je gedachten te delen. Wat zou je het meest helpen op dit moment - praktische tips of gewoon iemand die luistert?",
    ];

    return contextualResponses[
      Math.floor(Math.random() * contextualResponses.length)
    ];
  }

  getChatHistory(): AIChat[] {
    return this.chatHistory;
  }

  private storeChatHistory() {
    localStorage.setItem("ai_chat_history", JSON.stringify(this.chatHistory));
  }

  loadChatHistory() {
    try {
      const stored = localStorage.getItem("ai_chat_history");
      if (stored) {
        this.chatHistory = JSON.parse(stored).map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }

  clearChatHistory() {
    this.chatHistory = [];
    localStorage.removeItem("ai_chat_history");
  }

  private storeInsight(insight: EnhancedAIInsight) {
    const stored = localStorage.getItem("ai_insights") || "[]";
    const insights = JSON.parse(stored);
    insights.unshift(insight);

    // Keep only latest 10 insights
    if (insights.length > 10) {
      insights.splice(10);
    }

    localStorage.setItem("ai_insights", JSON.stringify(insights));
  }

  getStoredInsights(): EnhancedAIInsight[] {
    try {
      const stored = localStorage.getItem("ai_insights") || "[]";
      const insights = JSON.parse(stored);
      return insights.map((insight: any) => ({
        ...insight,
        timestamp: new Date(insight.timestamp),
      }));
    } catch (error) {
      console.error("Failed to load stored insights:", error);
      return [];
    }
  }

  markInsightAsRead(insightId: string) {
    const stored = localStorage.getItem("ai_insights") || "[]";
    const insights = JSON.parse(stored);
    const insight = insights.find((i: any) => i.id === insightId);
    if (insight) {
      insight.read = true;
      localStorage.setItem("ai_insights", JSON.stringify(insights));
    }
  }

  isGeneratingInsights(): boolean {
    return this.isGenerating;
  }
}

export const enhancedAIService = new EnhancedAIService();
