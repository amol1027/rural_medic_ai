import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
};

export type Document = {
  id: string;
  filename: string;
  original_name: string;
  uploaded_by: string | null;
  file_size: number;
  status: 'processing' | 'completed' | 'failed';
  uploaded_at: string;
};

export type Embedding = {
  id: string;
  document_id: string;
  chunk_text: string;
  chunk_index: number;
  embedding: number[];
  created_at: string;
};

export type Query = {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  language: string;
  query_type: 'medical' | 'emergency' | 'skin';
  created_at: string;
};
