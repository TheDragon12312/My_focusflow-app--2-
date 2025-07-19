import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  userStats: {
    focusTime: number;
    sessionsCompleted: number;
    distractionsBlocked: number;
    productivity: number;
  };
  userId: string;
  language?: string; // Voeg taal toe aan de request
}

// Meertalige prompts en fallback responses
const LANGUAGE_PROMPTS = {
  nl: {
    systemPrompt: "Je bent een AI productiviteitscoach die Nederlandse gebruikers helpt met focus en productiviteit. Geef altijd JSON responses.",
    userPrompt: (userStats: any, userId: string) => `Als AI productiviteitscoach, analyseer deze gebruikersstatistieken en geef praktische inzichten:

Gebruiker ID: ${userId}
Focus tijd vandaag: ${userStats.focusTime} minuten
Voltooide sessies: ${userStats.sessionsCompleted}
Geblokkeerde afleidingen: ${userStats.distractionsBlocked}
Productiviteitsscore: ${userStats.productivity}%

Geef een JSON response met:
1. Een korte motiverende titel (max 30 karakters)
2. Een praktische tip of observatie (max 120 karakters)
3. Een actionable suggestie (max 40 karakters)
4. Prioriteit: "high", "medium", of "low"
5. Type: "motivation", "tip", "warning", of "achievement"

Antwoord alleen in het Engels en geef praktische, persoonlijke feedback.`,
    fallback: {
      title: "Blijf gefocust! 🎯",
      message: "Je bent goed bezig met je productiviteit. Blijf volhouden!",
      action: "Ga verder"
    }
  },
  en: {
    systemPrompt: "You are an AI productivity coach helping English-speaking users with focus and productivity. Always provide JSON responses.",
    userPrompt: (userStats: any, userId: string) => `As an AI productivity coach, analyze these user statistics and provide practical insights:

User ID: ${userId}
Focus time today: ${userStats.focusTime} minutes
Completed sessions: ${userStats.sessionsCompleted}
Blocked distractions: ${userStats.distractionsBlocked}
Productivity score: ${userStats.productivity}%

Provide a JSON response with:
1. A short motivational title (max 30 characters)
2. A practical tip or observation (max 120 characters)
3. An actionable suggestion (max 40 characters)
4. Priority: "high", "medium", or "low"
5. Type: "motivation", "tip", "warning", or "achievement"

Respond only in English and provide practical, personal feedback.`,
    fallback: {
      title: "Stay focused! 🎯",
      message: "You're doing great with your productivity. Keep it up!",
      action: "Continue"
    }
  },
  fr: {
    systemPrompt: "Tu es un coach de productivité IA qui aide les utilisateurs francophones avec la concentration et la productivité. Fournis toujours des réponses JSON.",
    userPrompt: (userStats: any, userId: string) => `En tant que coach de productivité IA, analyse ces statistiques utilisateur et fournis des insights pratiques :

ID utilisateur : ${userId}
Temps de concentration aujourd'hui : ${userStats.focusTime} minutes
Sessions terminées : ${userStats.sessionsCompleted}
Distractions bloquées : ${userStats.distractionsBlocked}
Score de productivité : ${userStats.productivity}%

Fournis une réponse JSON avec :
1. Un titre motivant court (max 30 caractères)
2. Un conseil pratique ou une observation (max 120 caractères)
3. Une suggestion actionnable (max 40 caractères)
4. Priorité : "high", "medium", ou "low"
5. Type : "motivation", "tip", "warning", ou "achievement"

Réponds uniquement en français et fournis des commentaires pratiques et personnels.`,
    fallback: {
      title: "Restez concentré ! 🎯",
      message: "Vous faites du bon travail avec votre productivité. Continuez !",
      action: "Continuer"
    }
  },
  de: {
    systemPrompt: "Du bist ein KI-Produktivitätscoach, der deutschsprachigen Nutzern bei Fokus und Produktivität hilft. Gib immer JSON-Antworten.",
    userPrompt: (userStats: any, userId: string) => `Als KI-Produktivitätscoach analysiere diese Nutzerstatistiken und gib praktische Einblicke:

Nutzer-ID: ${userId}
Fokuszeit heute: ${userStats.focusTime} Minuten
Abgeschlossene Sitzungen: ${userStats.sessionsCompleted}
Blockierte Ablenkungen: ${userStats.distractionsBlocked}
Produktivitätsscore: ${userStats.productivity}%

Gib eine JSON-Antwort mit:
1. Ein kurzer motivierender Titel (max 30 Zeichen)
2. Ein praktischer Tipp oder eine Beobachtung (max 120 Zeichen)
3. Ein umsetzbarer Vorschlag (max 40 Zeichen)
4. Priorität: "high", "medium", oder "low"
5. Typ: "motivation", "tip", "warning", oder "achievement"

Antworte nur auf Deutsch und gib praktisches, persönliches Feedback.`,
    fallback: {
      title: "Bleib fokussiert! 🎯",
      message: "Du machst das toll mit deiner Produktivität. Weiter so!",
      action: "Weitermachen"
    }
  },
  es: {
    systemPrompt: "Eres un coach de productividad IA que ayuda a usuarios hispanohablantes con el enfoque y la productividad. Siempre proporciona respuestas JSON.",
    userPrompt: (userStats: any, userId: string) => `Como coach de productividad IA, analiza estas estadísticas de usuario y proporciona insights prácticos:

ID de usuario: ${userId}
Tiempo de enfoque hoy: ${userStats.focusTime} minutos
Sesiones completadas: ${userStats.sessionsCompleted}
Distracciones bloqueadas: ${userStats.distractionsBlocked}
Puntuación de productividad: ${userStats.productivity}%

Proporciona una respuesta JSON con:
1. Un título motivador corto (máx 30 caracteres)
2. Un consejo práctico u observación (máx 120 caracteres)
3. Una sugerencia accionable (máx 40 caracteres)
4. Prioridad: "high", "medium", o "low"
5. Tipo: "motivation", "tip", "warning", o "achievement"

Responde solo en español y proporciona comentarios prácticos y personales.`,
    fallback: {
      title: "¡Mantén el enfoque! 🎯",
      message: "Lo estás haciendo genial con tu productividad. ¡Sigue así!",
      action: "Continuar"
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userStats, userId, language = 'nl' }: AnalysisRequest = await req.json();

    // Gebruik de juiste taal (fallback naar Nederlands)
    const lang = language as keyof typeof LANGUAGE_PROMPTS;
    const languageConfig = LANGUAGE_PROMPTS[lang] || LANGUAGE_PROMPTS.nl;

    const prompt = languageConfig.userPrompt(userStats, userId);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: languageConfig.systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    let aiInsight;

    try {
      aiInsight = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails - gebruik taal-specifieke fallback
      aiInsight = {
        title: languageConfig.fallback.title,
        message: languageConfig.fallback.message,
        action: languageConfig.fallback.action,
        priority: "medium",
        type: "motivation"
      };
    }

    // Add metadata
    const insight = {
      id: `ai_${Date.now()}`,
      timestamp: new Date(),
      read: false,
      actionable: true,
      ...aiInsight
    };

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI coach analysis:', error);
    
    // Fallback response - probeer de taal uit de request te gebruiken
    const requestLanguage = req.headers.get('Accept-Language')?.split(',')[0]?.split('-')[0] || 'nl';
    const lang = requestLanguage as keyof typeof LANGUAGE_PROMPTS;
    const languageConfig = LANGUAGE_PROMPTS[lang] || LANGUAGE_PROMPTS.nl;
    
    const fallbackInsight = {
      id: `fallback_${Date.now()}`,
      title: languageConfig.fallback.title,
      message: languageConfig.fallback.message,
      action: languageConfig.fallback.action,
      priority: "medium",
      type: "motivation",
      timestamp: new Date(),
      read: false,
      actionable: true
    };

    return new Response(JSON.stringify({ insight: fallbackInsight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
