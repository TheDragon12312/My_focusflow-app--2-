import { supabase } from "@/integrations/supabase/client";

/**
 * Test of de Supabase function correct is gedeployed
 */
export async function testFunctionDeployment() {
  console.log("🚀 Testing function deployment...");

  try {
    const testPayload = {
      message:
        "Test deployment: Antwoord met 'Function werkt!' als je dit via OpenRouter krijgt.",
      chatHistory: [],
      userId: "deployment-test",
    };

    console.log("📤 Sending test request:", testPayload);

    const { data, error } = await supabase.functions.invoke("ai-coach-chat", {
      body: testPayload,
    });

    console.log("📥 Function response:", { data, error });

    if (error) {
      console.error("❌ Function call error:", error);
      return {
        success: false,
        error: "Function call failed",
        details: error,
      };
    }

    if (!data) {
      console.error("❌ No data received");
      return {
        success: false,
        error: "No data received",
        details: null,
      };
    }

    if (!data.response) {
      console.error("❌ No response field in data:", data);
      return {
        success: false,
        error: "No response field",
        details: data,
      };
    }

    const response = data.response;
    console.log("📝 AI Response:", response);

    // Check for error indicators
    if (
      response.includes("❌") ||
      response.includes("error") ||
      response.includes("fout")
    ) {
      return {
        success: false,
        error: "Function returned error response",
        details: response,
      };
    }

    // Check if it's a fallback response
    if (
      response.includes("problemen met mijn verbinding") ||
      response.includes("technische storing")
    ) {
      return {
        success: false,
        error: "Function returned fallback response - OpenRouter not working",
        details: response,
      };
    }

    return {
      success: true,
      response: response,
      details: data,
    };
  } catch (error) {
    console.error("❌ Test failed:", error);
    return {
      success: false,
      error: "Test threw exception",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Test API key configuration
 */
export async function testAPIKeyConfig() {
  console.log("🔑 Testing API key configuration...");

  const { data, error } = await supabase.functions.invoke("ai-coach-chat", {
    body: {
      message: "API test",
      chatHistory: [],
      userId: "api-key-test",
    },
  });

  console.log("🔑 API key test response:", { data, error });

  if (error) {
    console.error("❌ Function call failed:", error);
    return false;
  }

  if (data?.response?.includes("Geen Google AI API key")) {
    console.error("❌ Google AI API key not found in environment");
    return false;
  }

  if (data?.response?.includes("Google AI API fout")) {
    console.error("❌ Google AI API error - check key validity");
    return false;
  }

  console.log("✅ API key configuration looks good");
  return true;
}

/**
 * Comprehensive deployment check
 */
export async function checkDeployment() {
  console.log("🔍 Running comprehensive deployment check...");

  // First check API key
  const apiKeyOK = await testAPIKeyConfig();

  if (!apiKeyOK) {
    console.error("❌ API Key configuration failed!");
    console.log("\n🛠️ TROUBLESHOOTING:");
    console.log("1. Deploy function: supabase functions deploy ai-coach-chat");
    console.log("2. Check if API key is working in OpenRouter dashboard");
    console.log(
      "3. Google AI API key should be: AIzaSyAW65ss1aUDSFkM9apP9zxRycAvZ3WUV7U",
    );
    return { success: false, error: "API key configuration failed" };
  }

  // Then test full functionality
  const result = await testFunctionDeployment();

  if (result.success) {
    console.log("✅ DEPLOYMENT SUCCESS!");
    console.log("🤖 AI Response:", result.response);
    console.log("💡 The function is working correctly with OpenRouter!");
  } else {
    console.error("❌ DEPLOYMENT FAILED!");
    console.error("🔍 Error:", result.error);
    console.error("📝 Details:", result.details);

    console.log("\n🛠️ TROUBLESHOOTING STEPS:");
    console.log(
      "1. Deploy the function: supabase functions deploy ai-coach-chat",
    );
    console.log("2. Check function logs in Supabase dashboard");
    console.log("3. Verify Google AI model: gemini-1.5-flash");
  }

  return result;
}

// Make available globally
if (typeof window !== "undefined") {
  (window as any).testDeployment = checkDeployment;
  (window as any).testFunctionDeployment = testFunctionDeployment;
  (window as any).testAPIKey = testAPIKeyConfig;
}
