
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { LoadingSpinner } from './LoadingSpinner';
import { SendIcon } from './IconComponents';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
  isLoading: boolean;
  currentCharacterName: string;
  avatarSeed: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, currentCharacterName, avatarSeed }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 rounded-lg shadow-inner">
      <div className="p-3 border-b border-stone-200 flex items-center bg-white rounded-t-lg">
        <img 
            src={`https://picsum.photos/seed/${avatarSeed}/40/40`} 
            alt={currentCharacterName} 
            className="w-10 h-10 rounded-full mr-3 border-2 border-sky-300 object-cover"
        />
        <h2 className="text-lg font-semibold text-sky-700">{currentCharacterName}</h2>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} botAvatarSeed={avatarSeed} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <img 
                src={`https://picsum.photos/seed/${avatarSeed}/30/30`} 
                alt="Bot Avatar" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-stone-200 bg-white rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-stone-400 transition-colors flex items-center justify-center"
            disabled={isLoading || !inputText.trim()}
          >
            <SendIcon className="w-5 h-5" />
            <span className="ml-2 sr-only">Enviar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
