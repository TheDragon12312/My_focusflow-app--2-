import { googleAIService } from "@/lib/google-ai-service";

/**
 * Comprehensive Google AI test
 */
export async function runGoogleAITests() {
  console.log("🧪 Running comprehensive Google AI tests...");

  // Test 1: API Connection
  console.log("\n1️⃣ Testing Google AI API connection...");
  const connectionTest = await googleAIService.testConnection();

  if (connectionTest.success) {
    console.log("✅ Google AI API connection successful!");
    console.log("📝 Response:", connectionTest.response);
  } else {
    console.error("❌ Google AI API connection failed!");
    console.error("📝 Error:", connectionTest.message);
    return { success: false, error: connectionTest.message };
  }

  // Test 2: Chat Initialization
  console.log("\n2️⃣ Testing chat initialization...");
  try {
    await googleAIService.initializeChat();
    console.log("✅ Chat initialization successful!");

    const history = googleAIService.getChatHistory();
    console.log("📝 Initial chat history length:", history.length);
    console.log(
      "📝 Welcome message:",
      history[0]?.content || "No welcome message",
    );
  } catch (error) {
    console.error("❌ Chat initialization failed!");
    console.error("📝 Error:", error);
    return { success: false, error: "Chat initialization failed" };
  }

  // Test 3: Send Test Message
  console.log("\n3️⃣ Testing message sending...");
  try {
    const testMessage =
      "Hoi! Dit is een test bericht. Kun je antwoorden met 'Google AI werkt perfect!'?";
    const response = await googleAIService.sendMessage(testMessage);

    console.log("✅ Message sending successful!");
    console.log("📝 Test message:", testMessage);
    console.log("📝 AI response:", response);

    const history = googleAIService.getChatHistory();
    console.log("📝 Updated chat history length:", history.length);
  } catch (error) {
    console.error("❌ Message sending failed!");
    console.error("📝 Error:", error);
    return { success: false, error: "Message sending failed" };
  }

  // Test 4: Chat History
  console.log("\n4️⃣ Testing chat history...");
  const finalHistory = googleAIService.getChatHistory();
  console.log("📝 Final chat history:");
  finalHistory.forEach((msg, index) => {
    console.log(
      `  ${index + 1}. [${msg.role}]: ${msg.content.substring(0, 100)}...`,
    );
  });

  console.log("\n🎉 All Google AI tests passed successfully!");
  return {
    success: true,
    message: "All tests passed",
    historyLength: finalHistory.length,
  };
}

/**
 * Quick test function
 */
export async function quickTestGoogleAI() {
  console.log("⚡ Quick Google AI test...");

  const result = await googleAIService.testConnection();

  if (result.success) {
    console.log("✅ Google AI is working!");
    console.log("📝 Response:", result.response);
  } else {
    console.error("❌ Google AI test failed!");
    console.error("📝 Error:", result.message);
  }

  return result;
}

// Make functions globally available
if (typeof window !== "undefined") {
  (window as any).testGoogleAI = runGoogleAITests;
  (window as any).quickTestGoogleAI = quickTestGoogleAI;
  (window as any).googleAIService = googleAIService;
}
