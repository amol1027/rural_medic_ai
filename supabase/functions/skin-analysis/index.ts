import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  image: string;
  userId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { image, userId }: RequestBody = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "Image is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiApiKey = Deno.env.get("VITE_OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const systemPrompt = `You are an AI medical triage assistant for rural healthcare. Analyze the skin condition image and provide:
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
}`;

    const visionResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this skin condition and provide triage information.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: image,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      }
    );

    if (!visionResponse.ok) {
      const errorData = await visionResponse.json();
      throw new Error(errorData.error?.message || "Failed to analyze image");
    }

    const visionData = await visionResponse.json();
    const responseText = visionData.choices[0].message.content;

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
            language: "en",
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
