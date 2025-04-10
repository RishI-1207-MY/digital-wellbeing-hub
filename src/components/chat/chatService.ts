
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export const fetchMessagesFromSupabase = async (): Promise<Message[]> => {
  try {
    // For now, we'll return mock data
    // In a production environment, uncomment the supabase query
    /*
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Message[];
    */
    
    // Return an empty array for now
    return [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const saveChatMessage = async (message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> => {
  try {
    // For now, we'll mock saving a message
    // In a production environment, uncomment the supabase query
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
    // Call the enhanced AI edge function
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { message }
    });

    if (error) {
      console.error('Error calling AI function:', error);
      throw error;
    }
    
    return data.reply;
  } catch (error) {
    console.error('Error calling AI function:', error);
    
    // Enhanced fallback responses if the AI service is unavailable
    const fallbackResponses = [
      "I'm MediBot, your healthcare assistant. I can help with general health information, booking appointments, or uploading medical reports. How can I assist you today?",
      "I apologize, but I'm experiencing technical difficulties. In the meantime, you can use our appointment booking feature to schedule a consultation with a healthcare professional.",
      "My systems are currently undergoing maintenance. You can still upload your medical reports or book an appointment through the respective tabs in your dashboard.",
      "I'm unable to process your request right now. For health concerns, please consider using our symptom checker or booking a video consultation with a doctor.",
      "Technical difficulties are preventing me from giving you a proper response. You can access our appointment booking and medical report upload features from the dashboard tabs."
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};
