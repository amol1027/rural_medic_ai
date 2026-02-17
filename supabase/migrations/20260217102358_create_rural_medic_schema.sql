/*
  # Rural Medic AI Database Schema

  ## Overview
  This migration creates the complete database schema for Rural Medic AI,
  a healthcare accessibility assistant for rural areas.

  ## New Tables

  ### 1. `profiles`
  Extended user profile with role management
  - `id` (uuid, FK to auth.users)
  - `name` (text)
  - `role` (text) - 'user' or 'admin'
  - `created_at` (timestamptz)

  ### 2. `documents`
  Tracks uploaded medical PDF documents
  - `id` (uuid, primary key)
  - `filename` (text)
  - `original_name` (text)
  - `uploaded_by` (uuid, FK to auth.users)
  - `file_size` (bigint)
  - `status` (text) - 'processing', 'completed', 'failed'
  - `uploaded_at` (timestamptz)

  ### 3. `embeddings`
  Stores text chunks and their vector embeddings for RAG
  - `id` (uuid, primary key)
  - `document_id` (uuid, FK to documents)
  - `chunk_text` (text)
  - `chunk_index` (integer)
  - `embedding` (vector) - using pgvector extension
  - `created_at` (timestamptz)

  ### 4. `queries`
  Logs all user queries and AI responses
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to auth.users)
  - `question` (text)
  - `answer` (text)
  - `language` (text)
  - `query_type` (text) - 'medical', 'emergency', 'skin'
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can view their own data
  - Admins have full access
  - Public users cannot access sensitive data

  ## Important Notes
  1. Requires pgvector extension for vector similarity search
  2. Embeddings use 1536 dimensions (OpenAI ada-002)
  3. All tables have proper indexes for performance
*/

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  file_size bigint NOT NULL,
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create embeddings table with vector column
CREATE TABLE IF NOT EXISTS embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  chunk_text text NOT NULL,
  chunk_index integer NOT NULL,
  embedding vector(1536),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx ON embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create queries table
CREATE TABLE IF NOT EXISTS queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  query_type text NOT NULL CHECK (query_type IN ('medical', 'emergency', 'skin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS queries_user_id_idx ON queries(user_id);
CREATE INDEX IF NOT EXISTS queries_created_at_idx ON queries(created_at DESC);
CREATE INDEX IF NOT EXISTS embeddings_document_id_idx ON embeddings(document_id);

-- RLS Policies for profiles

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for documents

CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for embeddings

CREATE POLICY "Authenticated users can view embeddings"
  ON embeddings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert embeddings"
  ON embeddings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete embeddings"
  ON embeddings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for queries

CREATE POLICY "Users can view their own queries"
  ON queries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queries"
  ON queries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all queries"
  ON queries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create a function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();