export enum MessageRole {
  USER = "user",
  MODEL = "model",
  ASSISTANT = "assistant",
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp?: Date;
}

export interface ChatSession {
  sendMessage: (message: string) => Promise<string>;
  sendMessageStream: (options: {
    message: string;
  }) => AsyncIterable<{ text: string }>;
}
