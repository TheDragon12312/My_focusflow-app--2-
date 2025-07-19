import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("🚀 AI Coach Chat function starting with Google AI...");

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req: Request) => {
  const requestId = Math.random().toString(36).substring(2, 8);
  console.log(`[${requestId}] ${req.method} ${req.url}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] CORS preflight`);
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  if (req.method !== "POST") {
    console.log(`[${requestId}] Method not allowed: ${req.method}`);
    return new Response(
      JSON.stringify({ response: "Alleen POST requests toegestaan" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Parse request
    const body = await req.json();
    console.log(`[${requestId}] Request body:`, {
      message: body.message?.substring(0, 50) + "...",
      userId: body.userId,
      historyLength: body.chatHistory?.length || 0,
    });

    const { message, chatHistory = [], userId } = body;

    if (!message?.trim()) {
      console.log(`[${requestId}] Empty message`);
      return new Response(JSON.stringify({ response: "Bericht is leeg" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Google AI configuration
    const GOOGLE_API_KEY =
      Deno.env.get("GOOGLE_AI_API_KEY") ||
      "AIzaSyAW65ss1aUDSFkM9apP9zxRycAvZ3WUV7U";
    const GOOGLE_AI_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    if (!GOOGLE_API_KEY) {
      console.error(`[${requestId}] Geen Google AI API key beschikbaar`);
      return new Response(
        JSON.stringify({
          response: "❌ Geen Google AI API key beschikbaar.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      `[${requestId}] Using Google AI API key: ${GOOGLE_API_KEY.substring(0, 10)}...`,
    );

    // Build conversation for Google AI
    const systemInstruction =
      "Je bent een vriendelijke en praktische AI-productiviteitscoach voor FocusFlow. Help gebruikers met focus, motivatie, planning en productiviteit. Geef praktische, uitvoerbare tips. Wees empathisch en ondersteunend. Gebruik af en toe emoji's voor een persoonlijk gevoel. Houd antwoorden beknopt maar waardevol (max 200 woorden). Stel vervolgvragen om gebruikers te helpen reflecteren. Focus gebieden: tijdmanagement, concentratie technieken, motivatie, werk-leven balans, stress management, productiviteitsgewoontes. Antwoord altijd in het Nederlands.";

    // Build conversation history for Google AI format
    const contents = [];

    // Add system instruction as first user message (Gemini doesn't have system role)
    contents.push({
      role: "user",
      parts: [
        {
          text: `INSTRUCTIE: ${systemInstruction}\n\nGebruiker: ${message.trim()}`,
        },
      ],
    });

    // Add chat history if available
    if (chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-5); // Last 5 messages

      let conversationText = "Eerdere gesprek context:\n";
      for (const item of recentHistory) {
        if (item.role && item.message) {
          const roleLabel = item.role === "user" ? "Gebruiker" : "AI Coach";
          conversationText += `${roleLabel}: ${item.message}\n`;
        }
      }
      conversationText += `\nHuidige vraag: ${message.trim()}`;

      // Replace the content with full context
      contents[0].parts[0].text = `INSTRUCTIE: ${systemInstruction}\n\n${conversationText}`;
    }

    console.log(`[${requestId}] Sending request to Google AI`);

    // Call Google AI API
    const googleResponse = await fetch(
      `${GOOGLE_AI_URL}?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 400,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    );

    console.log(
      `[${requestId}] Google AI response status: ${googleResponse.status}`,
    );

    if (!googleResponse.ok) {
      const errorText = await googleResponse.text();
      console.error(`[${requestId}] Google AI error:`, errorText);

      return new Response(
        JSON.stringify({
          response: `❌ Google AI API fout (${googleResponse.status}): Controleer API key en quotum.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const googleData = await googleResponse.json();
    console.log(`[${requestId}] Google AI response:`, {
      candidates: googleData.candidates?.length || 0,
      usage: googleData.usageMetadata,
    });

    // Extract AI response from Google AI format
    const aiMessage =
      googleData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!aiMessage) {
      console.error(`[${requestId}] Geen AI antwoord ontvangen`, googleData);
      return new Response(
        JSON.stringify({
          response:
            "❌ Google AI gaf geen antwoord terug. Probeer het opnieuw.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(
      `[${requestId}] ✅ Succes! Google AI response: ${aiMessage.substring(0, 100)}...`,
    );

    return new Response(
      JSON.stringify({
        response: aiMessage,
        model: "gemini-1.5-flash",
        usage: googleData.usageMetadata,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error(`[${requestId}] ❌ Unexpected error:`, error);
    return new Response(
      JSON.stringify({
        response: `❌ Function error: ${error.message}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
