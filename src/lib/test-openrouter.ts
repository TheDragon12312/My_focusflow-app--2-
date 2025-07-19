import { supabase } from "@/integrations/supabase/client";

/**
 * Test functie om OpenRouter AI connectie te controleren
 * Deze functie kan worden gebruikt om te debuggen of de API werkt
 */
export async function testOpenRouterConnection(): Promise<{
  success: boolean;
  message: string;
  response?: string;
  error?: string;
  fullData?: any;
}> {
  try {
    console.log("🧪 Testing OpenRouter AI connection...");

    const testMessage =
      "Test bericht: Zeg alleen 'OpenRouter werkt!' als je dit via OpenRouter ontvangt.";

    console.log("🧪 Sending test request to ai-coach-chat function...");

    const { data, error } = await supabase.functions.invoke("ai-coach-chat", {
      body: {
        message: testMessage,
        chatHistory: [],
        userId: "test-user-debug",
      },
    });

    console.log("🧪 Function response:", { data, error });
    console.log("🧪 Full data object:", data);

    if (error) {
      console.error("🧪 Supabase function error:", error);
      return {
        success: false,
        message: "Supabase function call failed",
        error: JSON.stringify(error, null, 2),
        fullData: { data, error },
      };
    }

    if (!data) {
      return {
        success: false,
        message: "No data received from function",
        error: "Empty response",
        fullData: { data, error },
      };
    }

    // Check if we have a response
    if (!data.response) {
      return {
        success: false,
        message: "No AI response in data",
        error: "Missing response field",
        fullData: data,
      };
    }

    // Check if this is a fallback response (contains certain keywords)
    const response = data.response;
    const isFallback =
      response.includes("problemen met mijn verbinding") ||
      response.includes("technische storing") ||
      response.includes("kan je momenteel niet helpen") ||
      response.includes("API key");

    if (isFallback) {
      return {
        success: false,
        message: "Received fallback response instead of OpenRouter AI",
        error: "OpenRouter API call is failing inside the function",
        response: response,
        fullData: data,
      };
    }

    // Check for specific success indicators
    const isOpenRouterResponse =
      response.includes("OpenRouter werkt!") || response.length > 50; // Real AI responses are usually longer

    return {
      success: isOpenRouterResponse,
      message: isOpenRouterResponse
        ? "OpenRouter AI connection successful!"
        : "Received response but may be fallback",
      response: response,
      fullData: data,
    };
  } catch (error) {
    console.error("🧪 Test failed with exception:", error);
    return {
      success: false,
      message: "Test threw an exception",
      error: error instanceof Error ? error.message : String(error),
      fullData: null,
    };
  }
}

/**
 * Test directe verbinding met Google AI API (bypass Supabase)
 */
export async function testDirectGoogleAI(): Promise<{
  success: boolean;
  message: string;
  response?: string;
  error?: string;
}> {
  try {
    console.log("🧪 Testing direct Google AI API connection...");

    const API_KEY = "AIzaSyAW65ss1aUDSFkM9apP9zxRycAvZ3WUV7U";
    const API_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Test: Antwoord alleen met 'Google AI werkt!' in het Nederlands",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 50,
        },
      }),
    });

    console.log("🧪 Direct Google AI response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🧪 Direct Google AI error:", errorText);
      return {
        success: false,
        message: `Direct Google AI API failed with status ${response.status}`,
        error: errorText,
      };
    }

    const data = await response.json();
    console.log("🧪 Direct Google AI response data:", data);

    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!aiResponse) {
      return {
        success: false,
        message: "No response content from direct Google AI API",
        error: JSON.stringify(data),
      };
    }

    return {
      success: true,
      message: "Direct Google AI API connection successful!",
      response: aiResponse,
    };
  } catch (error) {
    console.error("🧪 Direct Google AI test failed:", error);
    return {
      success: false,
      message: "Direct Google AI API test threw an exception",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Voer de test uit in de browser console
 * Gebruik: testAndLog()
 */
export async function testAndLog() {
  console.log("🧪 Running comprehensive Google AI tests...");

  // Test 1: Direct API
  console.log("\n1️⃣ Testing direct Google AI API...");
  const directResult = await testDirectGoogleAI();

  if (directResult.success) {
    console.log("✅ Direct Google AI API WERKT!");
    console.log("📝 Direct Response:", directResult.response);
  } else {
    console.error("❌ Direct Google AI API GEFAALD!");
    console.error("📝 Error:", directResult.error);
  }

  // Test 2: Via Supabase function
  console.log("\n2️⃣ Testing via Supabase function...");
  const functionResult = await testOpenRouterConnection();

  if (functionResult.success) {
    console.log("✅ Supabase Function Test SUCCESVOL!");
    console.log("📝 Function Response:", functionResult.response);
  } else {
    console.error("❌ Supabase Function Test GEFAALD!");
    console.error("📝 Error:", functionResult.error);
    console.error("📝 Message:", functionResult.message);
    console.error("📝 Full Data:", functionResult.fullData);
  }

  // Summary
  console.log("\n📊 TEST SAMENVATTING:");
  console.log(
    "Direct Google AI API:",
    directResult.success ? "✅ WERKT" : "❌ FAALT",
  );
  console.log(
    "Supabase Function:",
    functionResult.success ? "✅ WERKT" : "❌ FAALT",
  );

  if (directResult.success && !functionResult.success) {
    console.log(
      "🔍 DIAGNOSE: Google AI API werkt, maar Supabase function heeft een probleem",
    );
    console.log(
      "💡 OPLOSSING: Deploy de function opnieuw met: supabase functions deploy ai-coach-chat",
    );
  } else if (!directResult.success) {
    console.log("🔍 DIAGNOSE: Google AI API zelf is niet bereikbaar");
    console.log("💡 OPLOSSING: Controleer Google AI API key en quotum");
  }

  return { directResult, functionResult };
}

// Maak functies globally beschikbaar voor debugging
if (typeof window !== "undefined") {
  (window as any).testGoogleAI = testAndLog;
  (window as any).testAIConnection = testOpenRouterConnection;
  (window as any).testDirectGoogleAI = testDirectGoogleAI;
  (window as any).testAIFull = testAndLog;

  // Backwards compatibility
  (window as any).testOpenRouter = testAndLog;
}
