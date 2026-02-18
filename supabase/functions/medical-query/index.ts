import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  question: string;
  language: string;
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
    const { question, language, userId }: RequestBody = await req.json();

    if (!question || !language) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }

    // Generate query embedding using Gemini
    const embeddingResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: { parts: [{ text: question }] },
        }),
      }
    );

    if (!embeddingResponse.ok) {
      throw new Error("Failed to generate embedding");
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.embedding.values;

    const searchResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/match_embeddings`,
      {
        method: "POST",
        headers: {
          "apikey": supabaseServiceKey!,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 5,
        }),
      }
    );

    let contextChunks: string[] = [];
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      contextChunks = searchData.map((item: any) => item.chunk_text);
    }

    const languageInstructions: { [key: string]: string } = {
      en: "You are Ascleon AI, an expert rural medical assistant. Respond in simple, non-technical English.",
      hi: "आप Ascleon AI हैं, एक विशेषज्ञ ग्रामीण चिकित्सा सहायक। सरल, गैर-तकनीकी हिंदी में जवाब दें।",
      mr: "तुम्ही Ascleon AI आहात, एक तज्ञ ग्रामीण वैद्यकीय सहाय्यक. साध्या, गैर-तांत्रिक मराठीमध्ये उत्तर द्या।",
    };

    const systemPrompt = `${languageInstructions[language] || languageInstructions.en}

You are providing medical guidance to people in rural areas with limited healthcare access.

IMPORTANT RULES:
1. ALWAYS prioritize safety - never suggest anything that could cause harm
2. If symptoms are severe or life-threatening, IMMEDIATELY advise visiting nearest clinic/hospital
3. Base your answers on the provided medical context when available
4. If you don't have enough information, say so clearly
5. Never diagnose - only provide general guidance
6. Always end with: "This is not a substitute for professional medical care."

${contextChunks.length > 0 ? `\nVerified Medical Context:\n${contextChunks.join("\n\n")}` : ""}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nQuestion: ${question}`,
            }],
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error("Failed to get AI response");
    }

    const geminiData = await geminiResponse.json();
    const parts = geminiData.candidates?.[0]?.content?.parts || [];
    let answer = '';
    for (const part of parts) {
      if (part.text && !part.thought) {
        answer = part.text;
      }
    }
    if (!answer) {
      answer = parts.find((p: any) => p.text)?.text || 'Sorry, I could not generate a response.';
    }

    if (userId && supabaseUrl && supabaseServiceKey) {
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
          question: question,
          answer: answer,
          language: language,
          query_type: "medical",
        }),
      });
    }

    return new Response(
      JSON.stringify({ answer }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
