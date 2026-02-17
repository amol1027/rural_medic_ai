# Rural Medic AI

A full-stack AI-powered healthcare accessibility assistant designed for rural and low-connectivity areas. Provides verified medical guidance using RAG (Retrieval-Augmented Generation), emergency triage, multilingual support, and vision-based skin condition analysis.

## Features

### 1. User Authentication
- Simple email/password authentication via Supabase Auth
- Role-based access control (user/admin)
- Secure session management

### 2. Medical Query Assistant (RAG System)
- Chat-style interface for medical questions
- Searches verified medical knowledge base using vector similarity
- Powered by OpenAI GPT-4o for accurate responses
- Always includes safety disclaimers
- Caches last 10 responses for low-connectivity scenarios

### 3. Knowledge Base Management
- Admin can upload verified medical PDF manuals
- Automatic text extraction and chunking
- Generates embeddings using OpenAI Embeddings API
- Stores in PostgreSQL with pgvector for similarity search

### 4. Emergency Mode
- Offline-first decision trees for common emergencies:
  - High Fever
  - Snake Bite
  - Dehydration
  - Burns
- Step-by-step first aid instructions
- Works without internet connectivity
- Clear warnings and when to seek professional help

### 5. Vision-Based Skin Triage
- Upload skin condition images
- AI analysis using OpenAI Vision API
- Returns:
  - Possible condition (non-diagnostic)
  - Severity level (Mild/Moderate/Urgent)
  - Immediate care steps
- Safety disclaimers included

### 6. Multilingual Support
- English
- Hindi (हिंदी)
- Marathi (मराठी)
- Language-specific AI responses

### 7. Low Connectivity Features
- Local caching of recent queries
- Offline emergency decision trees
- Optimized for slow connections

### 8. Admin Dashboard
- Upload medical PDFs
- View user statistics
- Monitor query logs
- Delete documents and unsafe content

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend
- Supabase (PostgreSQL + Auth + Edge Functions)
- pgvector extension for vector similarity search
- Supabase Edge Functions (Deno runtime)

### AI Services
- OpenAI GPT-4o (medical guidance generation)
- OpenAI Embeddings API (text-embedding-ada-002 for RAG)
- OpenAI Vision API (skin condition analysis)

## Database Schema

### Tables
- `profiles` - Extended user profiles with roles
- `documents` - Uploaded medical documents
- `embeddings` - Text chunks with vector embeddings (1536 dimensions)
- `queries` - Query logs for monitoring

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admins have full access to manage content

## Environment Setup

1. Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

2. Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

## Production Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Edge Functions

The application uses three Supabase Edge Functions:

### 1. medical-query
- Handles medical question queries
- Performs RAG search on embeddings
- Generates AI responses with context
- Logs queries to database

### 2. skin-analysis
- Analyzes skin condition images
- Uses OpenAI Vision API
- Returns triage information
- Logs analysis to database

### 3. process-document
- Processes uploaded PDF documents
- Extracts text content
- Chunks text into manageable pieces
- Generates and stores embeddings

## Creating an Admin User

By default, new users are created with the 'user' role. To create an admin:

1. Sign up with a regular account
2. In your Supabase dashboard, run this SQL:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id';
```

## Usage Guidelines

### For Users
1. Sign up for an account
2. Ask medical questions in natural language
3. Use Emergency Mode for offline first-aid guidance
4. Upload skin condition images for triage
5. Switch language as needed

### For Admins
1. Upload verified medical PDF manuals
2. Monitor query logs for safety
3. Delete inappropriate or unsafe content
4. View system statistics

## Safety Features

- All responses include medical disclaimers
- Severe symptoms trigger immediate clinic recommendations
- Non-diagnostic approach for skin analysis
- Emergency mode emphasizes when to seek professional help
- Query logging for safety monitoring

## Security Best Practices

- Validates all file uploads
- Limits image size to 5MB
- Rate limiting on AI requests (managed by Supabase)
- Sanitizes all outputs
- Environment variables for API keys
- RLS policies on all database tables

## Deployment

The application is ready for deployment on Vercel or similar platforms:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## License

This project is intended for educational and healthcare accessibility purposes.

## Important Disclaimer

This application provides informational medical guidance only and is NOT a substitute for professional medical care. Users should always consult qualified healthcare professionals for diagnosis and treatment. In emergencies, contact local emergency services immediately.
