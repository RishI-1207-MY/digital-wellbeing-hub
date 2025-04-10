
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div 
      className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex ${message.is_bot ? 'items-start' : 'items-end'} gap-2 max-w-[80%]`}>
        {message.is_bot && (
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-blue-500 text-white">MB</AvatarFallback>
          </Avatar>
        )}
        <div 
          className={`p-3 rounded-lg ${
            message.is_bot 
              ? 'bg-gray-100 text-gray-900' 
              : 'bg-blue-500 text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        {!message.is_bot && (
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gray-500 text-white">You</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
