
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { Message } from './types';
import { callAiChatFunction, saveChatMessage } from './chatService';

const HealthChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Add initial welcome message
    const welcomeMessage: Message = {
      content: "Hello! I'm MediBot, your LifeSage Health assistant. How can I help you today?",
      is_bot: true,
      created_at: new Date().toISOString()
    };
    setMessages([welcomeMessage]);

    // Load chat history from Supabase is skipped for now
  }, []);

  const handleSendMessage = async (inputText: string) => {
    try {
      setLoading(true);

      // Add user message to state
      const userMessage: Message = {
        content: inputText,
        is_bot: false,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Save user message (commented out due to TS errors)
      // await saveChatMessage({
      //   content: inputText,
      //   is_bot: false,
      // });

      // Call the AI edge function
      const aiResponse = await callAiChatFunction(inputText);

      // Add bot response to state
      const botResponse: Message = {
        content: aiResponse,
        is_bot: true,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);

      // Save bot message (commented out due to TS errors)
      // await saveChatMessage({
      //   content: aiResponse,
      //   is_bot: true,
      // });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async () => {
    try {
      // Reset messages to just the welcome message
      const welcomeMessage: Message = {
        content: "Hello! I'm MediBot, your LifeSage Health assistant. How can I help you today?",
        is_bot: true,
        created_at: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
      
      toast({
        title: "New Conversation Started",
        description: "Your previous messages have been cleared.",
      });
    } catch (error: any) {
      console.error('Error starting new conversation:', error);
      toast({
        title: "Error",
        description: `Failed to start new conversation: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>MediBot Health Assistant</CardTitle>
            <CardDescription>Ask questions about your health concerns</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={startNewConversation}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto mb-4">
        <ChatMessageList messages={messages} />
      </CardContent>
      <CardFooter className="pt-0">
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </CardFooter>
    </Card>
  );
};

export default HealthChatbot;
