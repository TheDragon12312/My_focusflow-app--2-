import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";

// 🔒 BELANGRIJK: Gebruik environment variables voor de API key
const API_KEY = "AIzaSyAW65ss1aUDSFkM9apP9zxRycAvZ3WUV7U";
const MODEL_NAME = "gemini-1.5-flash";
const FALLBACK_MODEL = "gemini-1.5-pro"; // Fallback model voor overbelasting

// Initialiseer Google AI
const genAI = new GoogleGenerativeAI(API_KEY);

// System instructie voor de AI coach
const SYSTEM_INSTRUCTION = `Je bent een vriendelijke en praktische AI-productiviteitscoach voor FocusFlow. 

Jouw rol:
- Help gebruikers met focus, motivatie, planning en productiviteit
- Geef praktische, uitvoerbare tips
- Wees empathisch en ondersteunend
- Gebruik af en toe emoji's voor een persoonlijk gevoel
- Houd antwoorden beknopt maar waardevol (max 200 woorden)
- Stel vervolgvragen om gebruikers te helpen reflecteren

Focus gebieden:
- Tijdmanagement en planning
- Focus en concentratie technieken
- Motivatie en doelen stellen
- Werk-leven balans
- Stress management
- Productiviteitsgewoontes

Antwoord altijd in de taal van de promt die jij krijgt en wees praktisch en motiverend.`;

// Meertalige welkomstberichten
const WELCOME_MESSAGES = {
  nl: "Hallo! Ik ben je persoonlijke AI-productiviteitscoach. Ik help je graag met focus, motivatie, planning en alles wat met productiviteit te maken heeft. Waar kan ik je vandaag mee helpen? 😊",
  en: "Hello! I'm your personal AI productivity coach. I'm here to help you with focus, motivation, planning, and everything related to productivity. How can I help you today? 😊",
  fr: "Bonjour ! Je suis votre coach personnel de productivité IA. Je suis là pour vous aider avec la concentration, la motivation, la planification et tout ce qui concerne la productivité. Comment puis-je vous aider aujourd'hui ? 😊",
  de: "Hallo! Ich bin Ihr persönlicher KI-Produktivitätscoach. Ich helfe Ihnen gerne bei Fokus, Motivation, Planung und allem, was mit Produktivität zu tun hat. Wie kann ich Ihnen heute helfen? 😊",
  es: "¡Hola! Soy tu entrenador personal de productividad IA. Estoy aquí para ayudarte con el enfoque, la motivación, la planificación y todo lo relacionado con la productividad. ¿Cómo puedo ayudarte hoy? 😊"
};

export type Language = "nl" | "en" | "fr" | "de" | "es";

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export class GoogleAIService {
  private model: any;
  private fallbackModel: any;
  private chatSession: any = null;
  private chatHistory: ChatMessage[] = [];
  private lastRequestTime = 0;
  private minInterval = 1000; // Minimum 1 seconde tussen verzoeken
  private currentLanguage: Language = "nl"; // Default taal

  constructor() {
    this.model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 400,
      },
    });

    // Fallback model voor wanneer het primaire model overbelast is
    this.fallbackModel = genAI.getGenerativeModel({
      model: FALLBACK_MODEL,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 400,
      },
    });

    // Detecteer de huidige taal uit de instellingen
    this.detectCurrentLanguage();
  }

  /**
   * Detecteer de huidige taal uit localStorage of browser instellingen
   */
  private detectCurrentLanguage(): void {
    try {
      // Probeer eerst de taal uit localStorage te halen (FocusFlow instellingen)
      const savedLanguage = localStorage.getItem("focusflow_language");
      if (savedLanguage && this.isValidLanguage(savedLanguage)) {
        this.currentLanguage = savedLanguage as Language;
        console.log(`🌍 Taal gedetecteerd uit instellingen: ${this.currentLanguage}`);
        return;
      }

      // Fallback naar browser taal
      const browserLang = navigator.language.split("-")[0];
      if (this.isValidLanguage(browserLang)) {
        this.currentLanguage = browserLang as Language;
        console.log(`🌍 Taal gedetecteerd uit browser: ${this.currentLanguage}`);
      } else {
        console.log(`🌍 Onbekende browser taal (${browserLang}), gebruik Nederlands als default`);
      }
    } catch (error) {
      console.warn("Kon taal niet detecteren, gebruik Nederlands als default", error);
      this.currentLanguage = "nl";
    }
  }

  /**
   * Controleer of een taal geldig is
   */
  private isValidLanguage(lang: string): boolean {
    return ["nl", "en", "fr", "de", "es"].includes(lang);
  }

  /**
   * Stel de taal in voor de AI coach
   */
  public setLanguage(language: Language): void {
    this.currentLanguage = language;
    console.log(`🌍 AI Coach taal gewijzigd naar: ${language}`);
    
    // Update het welkomstbericht in de nieuwe taal als er al een chat actief is
    if (this.chatHistory.length > 0 && this.chatHistory[0].role === "model") {
      this.chatHistory[0].content = this.getWelcomeMessage();
    }
  }

  /**
   * Krijg het welkomstbericht in de huidige taal
   */
  private getWelcomeMessage(): string {
    return WELCOME_MESSAGES[this.currentLanguage] || WELCOME_MESSAGES.nl;
  }

  /**
   * Helper functie voor delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Rate limiting - wacht tussen verzoeken
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: wachten ${waitTime}ms...`);
      await this.delay(waitTime);
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Probeer een model met retry logic
   */
  private async tryModelWithRetry(
    model: any, 
    message: string, 
    maxRetries: number = 3
  ): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.enforceRateLimit();
        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        if (!text || text.trim().length === 0) {
          throw new Error("AI gaf een leeg antwoord terug.");
        }

        return text.trim();
      } catch (error) {
        console.error(`❌ Poging ${attempt}/${maxRetries} gefaald:`, error);

        if (error instanceof GoogleGenerativeAIFetchError) {
          // Check voor 503 Service Unavailable errors
          if (error.message.includes('503') || 
              error.message.includes('overloaded') || 
              error.message.includes('Service Unavailable')) {
            
            if (attempt < maxRetries) {
              // Exponential backoff: 2s, 4s, 8s
              const waitTime = Math.pow(2, attempt) * 1000;
              console.log(`⏳ Model overbelast, wachten ${waitTime}ms voor poging ${attempt + 1}/${maxRetries}...`);
              await this.delay(waitTime);
              continue;
            } else {
              throw new Error('🔄 AI service is momenteel overbelast. Probeer het over een paar minuten opnieuw.');
            }
          }
          
          // Check voor quota errors
          if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
            throw new Error('📊 API quota bereikt. Probeer het later opnieuw.');
          }
          
          // Check voor andere HTTP errors
          if (error.message.includes('429')) {
            throw new Error('⚡ Te veel verzoeken. Wacht even voordat je opnieuw probeert.');
          }
        }

        // Als het de laatste poging is, gooi de originele error
        if (attempt === maxRetries) {
          throw error;
        }
      }
    }

    throw new Error('Alle retry pogingen zijn mislukt');
  }

  /**
   * Initialiseer een nieuwe chat sessie
   */
  async initializeChat(language?: Language): Promise<void> {
    try {
      // Update de taal als meegegeven
      if (language) {
        this.setLanguage(language);
      } else {
        // Detecteer de huidige taal opnieuw (voor als de instellingen zijn gewijzigd)
        this.detectCurrentLanguage();
      }

      this.chatSession = this.model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
        },
      });

      // Voeg welkomstbericht toe in de juiste taal
      const welcomeMessage: ChatMessage = {
        role: "model",
        content: this.getWelcomeMessage(),
        timestamp: new Date(),
      };

      this.chatHistory = [welcomeMessage];

      console.log(`✅ Google AI chat geïnitialiseerd in het ${this.currentLanguage.toUpperCase()}`);
    } catch (error) {
      console.error("❌ Fout bij initialiseren Google AI chat:", error);
      throw new Error(
        "Kon geen verbinding maken met Google AI. Controleer je internetverbinding.",
      );
    }
  }

  /**
   * Verstuur een bericht naar Google AI met retry en fallback logic
   */
  async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error(
        "Chat sessie niet geïnitialiseerd. Roep eerst initializeChat() aan.",
      );
    }

    if (!message.trim()) {
      throw new Error("Bericht mag niet leeg zijn.");
    }

    try {
      console.log(
        "📤 Versturen naar Google AI:",
        message.substring(0, 50) + "...",
      );

      // Voeg gebruikersbericht toe aan geschiedenis
      const userMessage: ChatMessage = {
        role: "user",
        content: message.trim(),
        timestamp: new Date(),
      };
      this.chatHistory.push(userMessage);

      let responseText: string;

      try {
        // Probeer eerst het primaire model
        const result = await this.chatSession.sendMessage(message.trim());
        const response = result.response;
        responseText = response.text();
      } catch (error) {
        console.log("🔄 Primair model mislukt, proberen met fallback...");
        
        // Als het primaire model faalt, probeer de fallback
        if (error instanceof GoogleGenerativeAIFetchError && 
            (error.message.includes('503') || error.message.includes('overloaded'))) {
          
          responseText = await this.tryModelWithRetry(this.fallbackModel, message.trim());
        } else {
          throw error;
        }
      }

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Google AI gaf een leeg antwoord terug.");
      }

      // Voeg AI antwoord toe aan geschiedenis
      const aiMessage: ChatMessage = {
        role: "model",
        content: responseText.trim(),
        timestamp: new Date(),
      };
      this.chatHistory.push(aiMessage);

      console.log(
        "✅ Antwoord ontvangen van Google AI:",
        responseText.substring(0, 100) + "...",
      );

      return responseText.trim();
    } catch (error) {
      console.error("❌ Fout bij versturen bericht naar Google AI:", error);

      // Bepaal de juiste foutmelding op basis van de huidige taal
      let fallbackResponse = this.getFallbackMessage(error);

      const fallbackMessage: ChatMessage = {
        role: "model",
        content: fallbackResponse,
        timestamp: new Date(),
      };
      this.chatHistory.push(fallbackMessage);

      return fallbackResponse;
    }
  }

  /**
   * Krijg de juiste foutmelding in de huidige taal
   */
  private getFallbackMessage(error: any): string {
    const errorMessages = {
      nl: {
        generic: "Sorry, ik kan je vraag momenteel niet beantwoorden. ",
        overloaded: "De AI service is momenteel overbelast. Probeer het over een paar minuten opnieuw. 🔄",
        quota: "Het API quotum is bereikt. Probeer het later opnieuw. 📊",
        tooManyRequests: "Je stuurt berichten te snel. Wacht even voordat je opnieuw probeert. ⚡",
        connection: "Dit kan komen door een tijdelijk verbindingsprobleem. Probeer het over een paar seconden opnieuw. 🔄",
        unknown: "Er is een onbekende fout opgetreden. Probeer het opnieuw. ❌"
      },
      en: {
        generic: "Sorry, I can't answer your question right now. ",
        overloaded: "The AI service is currently overloaded. Please try again in a few minutes. 🔄",
        quota: "The API quota has been reached. Please try again later. 📊",
        tooManyRequests: "You're sending messages too quickly. Please wait before trying again. ⚡",
        connection: "This might be due to a temporary connection issue. Please try again in a few seconds. 🔄",
        unknown: "An unknown error occurred. Please try again. ❌"
      },
      fr: {
        generic: "Désolé, je ne peux pas répondre à votre question en ce moment. ",
        overloaded: "Le service IA est actuellement surchargé. Veuillez réessayer dans quelques minutes. 🔄",
        quota: "Le quota de l'API a été atteint. Veuillez réessayer plus tard. 📊",
        tooManyRequests: "Vous envoyez des messages trop rapidement. Veuillez attendre avant de réessayer. ⚡",
        connection: "Cela peut être dû à un problème de connexion temporaire. Veuillez réessayer dans quelques secondes. 🔄",
        unknown: "Une erreur inconnue s'est produite. Veuillez réessayer. ❌"
      },
      de: {
        generic: "Entschuldigung, ich kann Ihre Frage momentan nicht beantworten. ",
        overloaded: "Der AI-Service ist derzeit überlastet. Bitte versuchen Sie es in ein paar Minuten erneut. 🔄",
        quota: "Das API-Kontingent wurde erreicht. Bitte versuchen Sie es später erneut. 📊",
        tooManyRequests: "Sie senden Nachrichten zu schnell. Bitte warten Sie, bevor Sie es erneut versuchen. ⚡",
        connection: "Dies könnte an einem vorübergehenden Verbindungsproblem liegen. Bitte versuchen Sie es in ein paar Sekunden erneut. 🔄",
        unknown: "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut. ❌"
      },
      es: {
        generic: "Lo siento, no puedo responder a tu pregunta en este momento. ",
        overloaded: "El servicio de IA está actualmente sobrecargado. Por favor, inténtalo de nuevo en unos minutos. 🔄",
        quota: "Se ha alcanzado la cuota de la API. Por favor, inténtalo más tarde. 📊",
        tooManyRequests: "Estás enviando mensajes demasiado rápido. Por favor, espera antes de intentarlo de nuevo. ⚡",
        connection: "Esto puede deberse a un problema de conexión temporal. Por favor, inténtalo de nuevo en unos segundos. 🔄",
        unknown: "Se ha producido un error desconocido. Por favor, inténtalo de nuevo. ❌"
      }
    };

    const messages = errorMessages[this.currentLanguage] || errorMessages.nl;
    let fallbackResponse = messages.generic;

    if (error instanceof Error) {
      if (error.message.includes('overbelast') || error.message.includes('overloaded')) {
        fallbackResponse += messages.overloaded;
      } else if (error.message.includes('quota')) {
        fallbackResponse += messages.quota;
      } else if (error.message.includes('Te veel verzoeken') || error.message.includes('too many requests')) {
        fallbackResponse += messages.tooManyRequests;
      } else {
        fallbackResponse += messages.connection;
      }
    } else {
      fallbackResponse += messages.unknown;
    }

    return fallbackResponse;
  }

  /**
   * Verstuur een bericht met streaming response
   */
  async sendMessageStream(
    message: string,
  ): Promise<AsyncIterable<{ text: string }>> {
    if (!this.chatSession) {
      throw new Error(
        "Chat sessie niet geïnitialiseerd. Roep eerst initializeChat() aan.",
      );
    }

    if (!message.trim()) {
      throw new Error("Bericht mag niet leeg zijn.");
    }

    try {
      console.log(
        "📤 Versturen naar Google AI (streaming):",
        message.substring(0, 50) + "...",
      );

      // Voeg gebruikersbericht toe aan geschiedenis
      const userMessage: ChatMessage = {
        role: "user",
        content: message.trim(),
        timestamp: new Date(),
      };
      this.chatHistory.push(userMessage);

      await this.enforceRateLimit();

      // Verstuur naar Google AI met streaming
      const result = await this.chatSession.sendMessageStream(message.trim());

      let fullResponse = "";

      // Maak een async generator voor streaming
      const streamGenerator = async function* () {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullResponse += chunkText;
          yield { text: chunkText };
        }
      };

      return streamGenerator();
    } catch (error) {
      console.error("❌ Fout bij streaming naar Google AI:", error);

      // Return een fallback als async generator
      const fallbackResponse = this.getFallbackMessage(error);

      const fallbackMessage: ChatMessage = {
        role: "model",
        content: fallbackResponse,
        timestamp: new Date(),
      };
      this.chatHistory.push(fallbackMessage);

      return (async function* () {
        yield { text: fallbackResponse };
      })();
    }
  }

  /**
   * Krijg de chat geschiedenis
   */
  getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  /**
   * Wis de chat geschiedenis
   */
  clearHistory(): void {
    this.chatHistory = [];
    // Herstart de chat sessie met de huidige taal
    this.initializeChat();
  }

  /**
   * Voeg een bericht toe aan de geschiedenis (voor streaming responses)
   */
  addToHistory(message: ChatMessage): void {
    this.chatHistory.push(message);
  }

  /**
   * Krijg de huidige taal
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Test de Google AI verbinding met retry logic
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    response?: string;
  }> {
    try {
      console.log("🧪 Testen Google AI verbinding...");

      const testModel = genAI.getGenerativeModel({ model: MODEL_NAME });
      
      const response = await this.tryModelWithRetry(
        testModel, 
        'Test: Antwoord alleen met "Google AI werkt!" in het Nederlands'
      );

      return {
        success: true,
        message: "Google AI verbinding succesvol!",
        response: response,
      };
    } catch (error) {
      console.error("🧪 Google AI test gefaald:", error);
      return {
        success: false,
        message: `Google AI test gefaald: ${error instanceof Error ? error.message : "Onbekende fout"}`,
      };
    }
  }
}

// Singleton instance
export const googleAIService = new GoogleAIService();

// Maak test functie global beschikbaar
if (typeof window !== "undefined") {
  (window as any).testGoogleAI = () => googleAIService.testConnection();
  (window as any).googleAIService = googleAIService;
}

// Luister naar taal wijzigingen in de instellingen
if (typeof window !== "undefined") {
  window.addEventListener('languageChanged', (event: CustomEvent) => {
    const newLanguage = event.detail as Language;
    googleAIService.setLanguage(newLanguage);
  });
}
