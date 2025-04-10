
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = "https://wdbwvrtixcrvozznreof.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms } = await req.json();
    
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return new Response(
        JSON.stringify({ error: "Symptoms array is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Simple ML algorithm to predict diseases based on symptoms
    const diseaseRules = [
      {
        name: "Common Cold",
        matchThreshold: 0.6,
        symptoms: ["cough", "sore-throat", "runny-nose", "congestion", "headache", "fever"],
        confidence: 0.8,
        recommendation: "Rest, stay hydrated, and take over-the-counter cold medications. If symptoms worsen or persist beyond 10 days, consult your doctor."
      },
      {
        name: "Influenza",
        matchThreshold: 0.5,
        symptoms: ["fever", "body-aches", "fatigue", "cough", "headache"],
        confidence: 0.75,
        recommendation: "Rest, stay hydrated, and consider contacting your doctor within 48 hours of symptom onset for possible antiviral medications."
      },
      {
        name: "Seasonal Allergies",
        matchThreshold: 0.7,
        symptoms: ["itchy-eyes", "sneezing", "runny-nose", "congestion"],
        confidence: 0.85,
        recommendation: "Try over-the-counter antihistamines and avoid known allergens. If symptoms are severe or persistent, consult with an allergist."
      }
    ];

    // Calculate match percentages for each disease
    const results = diseaseRules.map(disease => {
      const matchingSymptoms = disease.symptoms.filter(s => symptoms.includes(s));
      const matchPercentage = matchingSymptoms.length / disease.symptoms.length;
      
      return {
        disease: disease.name,
        matchPercentage,
        confidence: matchPercentage * disease.confidence,
        recommendation: disease.recommendation,
        threshold: disease.matchThreshold
      };
    });

    // Find the best match
    const bestMatch = results.reduce((prev, current) => {
      return (current.matchPercentage > prev.matchPercentage) ? current : prev;
    }, { matchPercentage: 0 });

    // No good matches found
    if (bestMatch.matchPercentage < bestMatch.threshold) {
      const prediction = {
        prediction: "Inconclusive",
        confidence: 0,
        recommendation: "Your symptoms don't match our common patterns. Please consult with a healthcare provider for personalized advice."
      };
      
      return new Response(
        JSON.stringify(prediction),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create prediction
    const prediction = {
      prediction: bestMatch.disease,
      confidence: bestMatch.confidence,
      recommendation: bestMatch.recommendation
    };

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save prediction to database
    const { data, error } = await supabase
      .from('disease_predictions')
      .insert({
        symptoms,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        recommendation: prediction.recommendation
      });

    if (error) {
      console.error("Error saving prediction:", error);
    }
    
    return new Response(
      JSON.stringify(prediction),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in disease prediction:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
