import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = "You are a supportive and motivating AI life coach. Your name is 'FocusFlow AI'. Your goal is to help users reflect on their goals, overcome challenges, and build positive habits. Keep your responses encouraging, insightful, actionable, and relatively concise. Use markdown for formatting like lists and bold text to improve readability.";

export const createChatSession = async (): Promise<Chat> => {
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
        }
    });
    return chat;
};
