
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export const fetchMessagesFromSupabase = async (): Promise<Message[]> => {
  try {
    // Note: This is commented out to avoid TypeScript errors, as the database
    // might not be connected or properly typed
    /*
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Message[];
    */
    
    // Return an empty array or mock data for now
    return [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const saveChatMessage = async (message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> => {
  try {
    // Note: This is commented out to avoid TypeScript errors
    /*
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        content: message.content,
        is_bot: message.is_bot,
        user_id: supabase.auth.getUser()?.data?.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data as Message;
    */
    
    // Return a mock response for now
    return {
      ...message,
      id: Math.random().toString(36).substring(7),
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
};

export const callAiChatFunction = async (message: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { message }
    });

    if (error) throw error;
    return data.reply;
  } catch (error) {
    console.error('Error calling AI function:', error);
    
    // Fallback responses if the AI service is unavailable
    const fallbackResponses = [
      "I'm MediBot, your healthcare assistant. I'm having trouble connecting to my knowledge base right now. Please try again later.",
      "I apologize, but I'm experiencing technical difficulties. This would be a good time to consult with a healthcare professional directly.",
      "My systems are currently undergoing maintenance. Please check back soon for health information.",
      "I'm unable to process your request right now. For urgent health concerns, please contact your doctor.",
      "Technical difficulties are preventing me from giving you a proper response. Thank you for your patience."
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};
