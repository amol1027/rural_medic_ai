/*
  # Switch to Gemini Embeddings (768 dimensions)

  ## Overview
  Updates the vector column and search function to use 768-dimensional
  embeddings (Gemini text-embedding-004) instead of 1536-dimensional
  embeddings (OpenAI ada-002).

  ## Changes
  1. Drop existing embedding index
  2. Alter embedding column from vector(1536) to vector(768)
  3. Recreate IVFFlat index
  4. Update match_embeddings function for new dimensions

  ## Important Notes
  - Existing embeddings will be cleared (incompatible dimensions)
  - Documents will need to be re-uploaded and re-processed
*/

-- Clear existing embeddings (incompatible with new dimensions)
TRUNCATE TABLE embeddings;

-- Drop existing index
DROP INDEX IF EXISTS embeddings_embedding_idx;

-- Alter embedding column to 768 dimensions (Gemini text-embedding-004)
ALTER TABLE embeddings
  ALTER COLUMN embedding TYPE vector(768);

-- Recreate index for vector similarity search
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx ON embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Update the match_embeddings function for 768 dimensions
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_text text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    embeddings.id,
    embeddings.document_id,
    embeddings.chunk_text,
    1 - (embeddings.embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
