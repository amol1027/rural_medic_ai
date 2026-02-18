import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  filename: string;
  fileData: string;
  fileSize: number;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight - return headers immediately
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { filename, fileData, fileSize }: RequestBody = await req.json();

    if (!filename || !fileData) {
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

    if (!geminiApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Required environment variables not configured");
    }

    const base64Data = fileData.split(",")[1];
    if (!base64Data) {
      throw new Error("Invalid file data format");
    }

    const documentId = crypto.randomUUID();

    const insertDocResponse = await fetch(`${supabaseUrl}/rest/v1/documents`, {
      method: "POST",
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        id: documentId,
        filename: `${documentId}.pdf`,
        original_name: filename,
        file_size: fileSize,
        status: "processing",
      }),
    });

    if (!insertDocResponse.ok) {
      const errorData = await insertDocResponse.json().catch(() => ({}));
      throw new Error(`Failed to create document record: ${errorData.message || insertDocResponse.statusText}`);
    }

    const extractResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Extract all text content from this PDF document. Return only the extracted text without any commentary." },
              { inlineData: { mimeType: "application/pdf", data: base64Data } }
            ],
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8000,
          },
        }),
      }
    );

    if (!extractResponse.ok) {
      const errorData = await extractResponse.json().catch(() => ({}));
      throw new Error(`Failed to extract PDF text: ${errorData.error?.message || extractResponse.statusText}`);
    }

    const extractData = await extractResponse.json();
    const parts = extractData.candidates?.[0]?.content?.parts || [];
    let fullText = '';
    for (const part of parts) {
      if (part.text && !part.thought) {
        fullText = part.text;
      }
    }
    if (!fullText) {
      throw new Error("Failed to extract text from document");
    }

    const chunkSize = 800;
    const words = fullText.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(" "));
    }

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const embeddingResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: { parts: [{ text: chunk }] },
          }),
        }
      );

      if (!embeddingResponse.ok) {
        console.error(`Failed to generate embedding for chunk ${i}`);
        continue;
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.embedding.values;

      const insertEmbedding = await fetch(`${supabaseUrl}/rest/v1/embeddings`, {
        method: "POST",
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          document_id: documentId,
          chunk_text: chunk,
          chunk_index: i,
          embedding: embedding,
        }),
      });

      if (!insertEmbedding.ok) {
        console.error(`Failed to insert embedding for chunk ${i}:`, await insertEmbedding.text());
      }
    }

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/documents?id=eq.${documentId}`, {
      method: "PATCH",
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "completed",
      }),
    });

    if (!updateResponse.ok) {
      console.error("Failed to update document status:", await updateResponse.text());
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        chunksProcessed: chunks.length,
      }),
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
