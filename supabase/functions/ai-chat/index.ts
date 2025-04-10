
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

    // If no API key is set, send a more robust mock response system
    if (!Deno.env.get("OPENAI_API_KEY")) {
      console.log("OPENAI_API_KEY not set, using enhanced mock response system");
      
      // Create a more sophisticated mock response system
      const keywords = {
        appointment: [
          "You can book an appointment through the Appointments tab. Would you like me to guide you there?",
          "I can help you schedule a doctor's appointment. Please use the booking feature in the Appointments section."
        ],
        headache: [
          "Headaches can be caused by various factors including stress, dehydration, or lack of sleep. If it persists, please consult with a doctor.",
          "For your headache, make sure you're hydrated and getting enough rest. Over-the-counter pain relievers might help. Consider booking an appointment if it continues."
        ],
        fever: [
          "Fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and take acetaminophen if needed. If it persists over 101°F for more than two days, please seek medical attention.",
          "A fever is your body's natural defense against infection. Monitor your temperature, rest, and drink fluids. Contact a healthcare professional if it's high or lasts more than a few days."
        ],
        diabetes: [
          "Diabetes management includes regular blood sugar monitoring, a balanced diet, regular exercise, and medication as prescribed. Would you like more specific information?",
          "For diabetes, it's important to follow your doctor's recommendations about diet, exercise, and medication. Regular check-ups are essential for managing the condition effectively."
        ],
        medication: [
          "Always take medications as prescribed by your doctor. If you're experiencing side effects, consult with your healthcare provider before making any changes.",
          "Medication adherence is crucial for effective treatment. Set reminders if you have trouble remembering to take your prescriptions on time."
        ],
        reports: [
          "You can upload your medical reports through the 'Upload Medical Reports' feature in your dashboard. Your doctor will be able to review them before your appointment.",
          "Medical reports can be shared securely through our platform. Use the upload feature to ensure your doctor has all the information needed for your consultation."
        ]
      };
      
      // Default responses if no keywords match
      const defaultResponses = [
        "I'm MediBot, your healthcare assistant. I can provide general health information, help you book appointments, or assist with uploading medical reports. How can I help you today?",
        "As your health assistant, I can offer general guidance on common health concerns, but remember to consult with a healthcare professional for personalized advice.",
        "I can help you navigate our healthcare platform, provide general health information, or assist with appointments. What do you need help with today?",
        "For specific medical concerns, it's best to consult with a healthcare provider. I can help you book an appointment with one of our doctors.",
        "Regular check-ups are important for preventive healthcare. Would you like me to help you schedule your next appointment?"
      ];
      
      // Find matching keywords in the user's message
      let responses = defaultResponses;
      for (const [keyword, keywordResponses] of Object.entries(keywords)) {
        if (message.toLowerCase().includes(keyword)) {
          responses = keywordResponses;
          break;
        }
      }
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return new Response(
        JSON.stringify({ reply: randomResponse }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const healthAssistantPrompt = `You are a helpful healthcare assistant for LifeSage Health called MediBot. 
    You provide helpful, compassionate health information, focusing on general wellness advice, 
    explaining medical terms in simple language, and suggesting when a user should consult with a healthcare professional. 
    You do not diagnose conditions, prescribe specific treatments, or provide emergency medical advice.
    
    You can help users book appointments with doctors and remind them about the appointment booking feature.
    You can also inform users about the medical report upload feature and guide them on how to use it.
    
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
