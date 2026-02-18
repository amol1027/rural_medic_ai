import { useState, useEffect } from 'react';
import { Upload, FileText, Users, MessageSquare, Trash2, Loader2, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Stats = {
  totalUsers: number;
  totalDocuments: number;
  totalQueries: number;
};

type Document = {
  id: string;
  filename: string;
  original_name: string;
  status: string;
  uploaded_at: string;
  file_size: number;
};

type QueryLog = {
  id: string;
  question: string;
  query_type: string;
  created_at: string;
  profiles: { name: string };
};

export default function Admin() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalDocuments: 0, totalQueries: 0 });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [queries, setQueries] = useState<QueryLog[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'queries'>('documents');

  useEffect(() => {
    loadStats();
    loadDocuments();
    loadQueries();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, docsRes, queriesRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('queries').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalDocuments: docsRes.count || 0,
        totalQueries: queriesRes.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const loadQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('queries')
        .select('id, question, query_type, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Fetch user profiles separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(q => q.user_id))].filter(Boolean);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);
        
        const profileMap = new Map(profiles?.map(p => [p.id, p.name]) || []);
        const enrichedData = data.map(q => ({
          ...q,
          profiles: { name: profileMap.get(q.user_id) || 'Unknown' }
        }));
        setQueries(enrichedData);
      } else {
        setQueries([]);
      }
    } catch (error) {
      console.error('Error loading queries:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      e.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!geminiKey) throw new Error('Gemini API key not configured');

      // Step 1: Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const base64Data = base64.split(',')[1];
      if (!base64Data) throw new Error('Invalid file data');

      // Step 2: Create document record
      const documentId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          id: documentId,
          filename: `${documentId}.pdf`,
          original_name: file.name,
          file_size: file.size,
          status: 'processing',
        });

      if (insertError) throw new Error(`Failed to create document: ${insertError.message}`);

      // Step 3: Extract text from PDF using Gemini
      const extractResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: 'Extract all text content from this PDF document. Return only the extracted text without any commentary.' },
                { inlineData: { mimeType: 'application/pdf', data: base64Data } }
              ],
            }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 8000 },
          }),
        }
      );

      if (!extractResponse.ok) throw new Error('Failed to extract PDF text');

      const extractData = await extractResponse.json();
      const parts = extractData.candidates?.[0]?.content?.parts || [];
      let fullText = '';
      for (const part of parts) {
        if (part.text && !part.thought) fullText = part.text;
      }
      if (!fullText) throw new Error('Failed to extract text from document');

      // Step 4: Chunk text
      const chunkSize = 800;
      const words = fullText.split(/\s+/);
      const chunks: string[] = [];
      for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
      }

      // Step 5: Generate embeddings and store
      for (let i = 0; i < chunks.length; i++) {
        const embeddingResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: { parts: [{ text: chunks[i] }] },
            }),
          }
        );

        if (!embeddingResponse.ok) {
          console.error(`Failed to generate embedding for chunk ${i}`);
          continue;
        }

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.embedding.values;

        const { error: embError } = await supabase
          .from('embeddings')
          .insert({
            document_id: documentId,
            chunk_text: chunks[i],
            chunk_index: i,
            embedding: embedding,
          });

        if (embError) console.error(`Failed to insert embedding ${i}:`, embError.message);
      }

      // Step 6: Update document status
      await supabase
        .from('documents')
        .update({ status: 'completed' })
        .eq('id', documentId);

      alert(`Document processed successfully! ${chunks.length} chunks created.`);
      loadStats();
      loadDocuments();
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`);
      e.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document and all its embeddings?')) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      alert('Document deleted successfully');
      loadStats();
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
              <Settings className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage knowledge base and view analytics</p>
            </div>
          </div>
          <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium">
            System Status: <span className="text-emerald-600 font-bold">● Operations Normal</span>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.totalUsers}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Documents</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.totalDocuments}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Queries</p>
              <h3 className="text-3xl font-bold text-slate-800">{stats.totalQueries}</h3>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <div className="flex space-x-2">
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'documents'
                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                    Documents
                </button>
                <button
                    onClick={() => setActiveTab('queries')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'queries'
                        ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                    Recent Queries
                </button>
            </div>
            
            {activeTab === 'documents' && (
                <div className="relative">
                    <input
                        type="file"
                        accept=".pdf,.txt,.md"
                        // @ts-ignore
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />
                    <button
                        className={`flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 active:scale-95 transition-all
                            ${uploading ? 'opacity-70 cursor-wait' : 'hover:bg-indigo-500'}
                        `}
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span>{uploading ? 'Processing...' : 'Upload Document'}</span>
                    </button>
                </div>
            )}
        </div>

        {/* Content Area */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {activeTab === 'documents' ? (
            <div className="overflow-x-auto">
              {documents.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No documents uploaded yet</p>
                </div>
              ) : (
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Uploaded</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-slate-700">{doc.original_name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                                ${doc.status === 'processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                            `}>
                                {doc.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete document"
                            >
                            <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Time</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Query</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {queries.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                {new Date(q.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                    {q.profiles?.name || 'Unknown'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-slate-700 line-clamp-2 max-w-xl font-medium">{q.question}</p>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
