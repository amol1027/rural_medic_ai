/*
  # Add Vector Similarity Search Function

  ## Overview
  Creates a PostgreSQL function to perform vector similarity search
  for the RAG (Retrieval-Augmented Generation) system.

  ## New Functions

  ### `match_embeddings`
  Searches for the most similar text chunks based on vector embeddings
  - Takes query embedding, similarity threshold, and match count
  - Returns matching chunks ordered by similarity
  - Uses cosine similarity for comparison

  ## Important Notes
  1. Requires pgvector extension (already enabled)
  2. Used by medical-query edge function for RAG queries
  3. Performance optimized with IVFFlat index
*/

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
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
