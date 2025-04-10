
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.24.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    // If no API key is set, send a mock response to allow frontend testing
    if (!Deno.env.get("OPENAI_API_KEY")) {
      console.log("OPENAI_API_KEY not set, returning mock response");
      const mockResponses = [
        "I'm MediBot, your healthcare assistant. While I can provide general health information, I'm not a replacement for professional medical advice.",
        "Remember to stay hydrated and get plenty of rest when you're feeling unwell. These simple steps can help with many common ailments.",
        "If you're experiencing severe symptoms, please contact a healthcare provider immediately.",
        "Regular check-ups are important for maintaining good health. Have you scheduled your annual physical examination?",
        "I can help explain medical terms, but always consult with your doctor for personalized medical advice."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return new Response(
        JSON.stringify({ reply: randomResponse }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const healthAssistantPrompt = `You are a helpful healthcare assistant for LifeSage Health called MediBot. 
    You provide helpful, compassionate health information, focusing on general wellness advice, 
    explaining medical terms in simple language, and suggesting when a user should consult with a healthcare professional. 
    You do not diagnose conditions, prescribe specific treatments, or provide emergency medical advice.
    Always remind users that for specific medical concerns or emergencies, they should consult with a healthcare professional immediately.
    
    User message: ${message}`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: healthAssistantPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const botReply = response.choices[0].message.content;
    
    return new Response(
      JSON.stringify({ reply: botReply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in AI chat:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
