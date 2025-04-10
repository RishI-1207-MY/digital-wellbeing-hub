import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Send, Plus, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id?: string;
  content: string;
  is_bot: boolean;
  created_at?: string;
}

const HealthChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add initial welcome message
    const welcomeMessage: Message = {
      content: "Hello! I'm MediBot, your LifeSage Health assistant. How can I help you today?",
      is_bot: true,
      created_at: new Date().toISOString()
    };
    setMessages([welcomeMessage]);

    // Load chat history from Supabase
    const loadChatHistory = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session.session) {
          const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: true });

          if (error) {
            console.error('Error loading chat history:', error);
            return;
          }

          if (data && data.length > 0) {
            // Add history to messages, keeping the welcome message first
            setMessages([welcomeMessage, ...data]);
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    try {
      setLoading(true);

      // Add user message to state
      const userMessage: Message = {
        content: input,
        is_bot: false,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Save user message to Supabase
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        const { error: saveError } = await supabase
          .from('chat_messages')
          .insert({
            content: input,
            is_bot: false,
            user_id: session.session.user.id
          });

        if (saveError) {
          console.error('Error saving message:', saveError);
        }
      }

      // Call the AI edge function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: input }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Add bot response to state
      const botResponse: Message = {
        content: data.reply,
        is_bot: true,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);

      // Save bot message to Supabase
      if (session.session) {
        const { error: saveBotError } = await supabase
          .from('chat_messages')
          .insert({
            content: data.reply,
            is_bot: true,
            user_id: session.session.user.id
          });

        if (saveBotError) {
          console.error('Error saving bot message:', saveBotError);
        }
      }
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
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        // Delete previous messages from database
        const { error } = await supabase
          .from('chat_messages')
          .delete()
          .eq('user_id', session.session.user.id);

        if (error) {
          console.error('Error deleting messages:', error);
          throw error;
        }
      }

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
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
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
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question..."
            disabled={loading}
            className="flex-grow"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default HealthChatbot;
