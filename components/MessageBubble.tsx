
import React from 'react';
import { ChatMessage } from '../types';
import { UserIcon, InformationCircleIcon } from './IconComponents'; // Assuming BotIcon might be character specific via picsum

interface MessageBubbleProps {
  message: ChatMessage;
  botAvatarSeed?: string; 
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, botAvatarSeed }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isUser ? 'bg-sky-500 text-white' : (isSystem ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-stone-200 text-stone-800');
  const borderRadius = isUser ? 'rounded-l-xl rounded-tr-xl' : 'rounded-r-xl rounded-tl-xl';

  const Avatar = () => {
    if (isUser) {
      return <UserIcon className="w-8 h-8 text-stone-400 bg-stone-100 rounded-full p-1" />;
    }
    if (isSystem) {
      return <InformationCircleIcon className="w-8 h-8 text-yellow-500" />;
    }
    // Bot
    return (
      <img 
        src={`https://picsum.photos/seed/${botAvatarSeed || 'default_bot'}/30/30`} 
        alt="Bot Avatar" 
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  };
  
  // Basic markdown link parsing: [text](url) -> <a href="url">text</a>
  // This is a very simplified parser. For more robust markdown, a library would be better.
  const formatText = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return text.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-300 hover:text-sky-100 underline">$1</a>');
  };

  const formattedText = formatText(message.text);

  return (
    <div className={`flex items-end space-x-2 ${bubbleAlignment}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar />
        </div>
      )}
      <div
        className={`max-w-xl lg:max-w-2xl px-4 py-3 shadow ${bubbleColor} ${borderRadius}`}
      >
        <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedText }}></p>
        {/* <span className="text-xs opacity-70 block mt-1 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span> */}
      </div>
      {isUser && (
        <div className="flex-shrink-0">
          <Avatar />
        </div>
      )}
    </div>
  );
};
