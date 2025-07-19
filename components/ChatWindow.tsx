import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import Message from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {messages.map((msg, index) => (
        <Message key={index} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={endOfMessagesRef} />
    </main>
  );
};

export default ChatWindow;
