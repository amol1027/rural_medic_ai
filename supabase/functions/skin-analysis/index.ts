import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  image: string;
  userId: string;
  language?: 'en' | 'hi' | 'mr';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { image, userId, language = 'en' }: RequestBody = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "Image is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }

    const systemPrompts = {
      en: `You are an AI medical triage assistant for rural healthcare. Analyze the skin condition image and provide:
1. A possible condition name (NOT a diagnosis)
2. Severity level: Mild, Moderate, or Urgent
3. Immediate care steps (3-5 bullet points)

CRITICAL SAFETY RULES:
- Never provide a definitive diagnosis
- Always recommend seeing a healthcare professional for proper evaluation
- If condition appears serious, mark as "Urgent" and emphasize immediate medical attention
- Keep language simple and accessible

Response format (JSON):
{
  "condition": "Possible condition description",
  "severity": "Mild/Moderate/Urgent",
  "careSteps": ["Step 1", "Step 2", "Step 3"],
  "disclaimer": "Appropriate safety disclaimer"
}`,
      hi: `आप ग्रामीण स्वास्थ्य सेवा के लिए एक AI चिकित्सा ट्राइएज सहायक हैं। त्वचा की स्थिति की छवि का विश्लेषण करें और प्रदान करें:
1. संभावित स्थिति का नाम (निदान नहीं)
2. गंभीरता स्तर: Mild, Moderate, या Urgent
3. तत्काल देखभाल कदम (3-5 बिंदु) - हिंदी में

महत्वपूर्ण सुरक्षा नियम:
- कभी भी निश्चित निदान न दें
- हमेशा उचित मूल्यांकन के लिए स्वास्थ्य पेशेवर से परामर्श की सिफारिश करें
- यदि स्थिति गंभीर दिखाई देती है, तो "Urgent" चिह्नित करें और तत्काल चिकित्सा ध्यान पर जोर दें
- भाषा सरल और सुलभ रखें

प्रतिक्रिया प्रारूप (JSON):
{
  "condition": "हिंदी में संभावित स्थिति का विवरण",
  "severity": "Mild/Moderate/Urgent",
  "careSteps": ["हिंदी में कदम 1", "हिंदी में कदम 2", "हिंदी में कदम 3"],
  "disclaimer": "हिंदी में उपयुक्त सुरक्षा अस्वीकरण"
}`,
      mr: `तुम्ही ग्रामीण आरोग्यसेवेसाठी AI वैद्यकीय ट्रायज सहाय्यक आहात. त्वचेच्या स्थितीच्या प्रतिमेचे विश्लेषण करा आणि प्रदान करा:
1. संभाव्य स्थितीचे नाव (निदान नाही)
2. तीव्रता स्तर: Mild, Moderate, किंवा Urgent
3. तात्काळ काळजी पायऱ्या (3-5 मुद्दे) - मराठीत

महत्त्वाचे सुरक्षा नियम:
- कधीही निश्चित निदान देऊ नका
- योग्य मूल्यमापनासाठी नेहमी आरोग्य व्यावसायिकाचा सल्ला घेण्याची शिफारस करा
- स्थिती गंभीर दिसत असल्यास, "Urgent" म्हणून चिन्हांकित करा आणि तात्काळ वैद्यकीय लक्षावर भर द्या
- भाषा सोपी आणि सुलभ ठेवा

प्रतिसाद स्वरूप (JSON):
{
  "condition": "मराठीत संभाव्य स्थितीचे वर्णन",
  "severity": "Mild/Moderate/Urgent",
  "careSteps": ["मराठीत पायरी 1", "मराठीत पायरी 2", "मराठीत पायरी 3"],
  "disclaimer": "मराठीत योग्य सुरक्षा अस्वीकरण"
}`
    };

    const systemPrompt = systemPrompts[language] || systemPrompts.en;

    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    const mimeType = image.startsWith("data:") ? image.split(";")[0].split(":")[1] : "image/jpeg";

    const visionResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `${systemPrompt}\n\nAnalyze this skin condition and provide triage information.` },
              { inlineData: { mimeType, data: base64Data } },
            ],
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!visionResponse.ok) {
      const errorData = await visionResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Failed to analyze image");
    }

    const visionData = await visionResponse.json();
    const parts = visionData.candidates?.[0]?.content?.parts || [];
    let responseText = '';
    for (const part of parts) {
      if (part.text) {
        responseText = part.text;
      }
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = {
        condition: responseText,
        severity: "Moderate",
        careSteps: [
          "Keep the area clean and dry",
          "Avoid scratching or touching the affected area",
          "Consult a healthcare professional for proper evaluation",
        ],
        disclaimer:
          "This is NOT a medical diagnosis. Please consult a qualified healthcare professional for proper evaluation and treatment.",
      };
    }

    if (userId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (supabaseUrl && supabaseServiceKey) {
        await fetch(`${supabaseUrl}/rest/v1/queries`, {
          method: "POST",
          headers: {
            "apikey": supabaseServiceKey,
            "Authorization": `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({
            user_id: userId,
            question: "Skin condition analysis",
            answer: JSON.stringify(result),
            language: language,
            query_type: "skin",
          }),
        });
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
