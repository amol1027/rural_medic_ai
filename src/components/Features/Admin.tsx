import { useState, useEffect } from 'react';
import { Upload, FileText, Users, MessageSquare, Trash2, Loader2 } from 'lucide-react';
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
        .select('id, question, query_type, created_at, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setQueries(data || []);
    } catch (error) {
      console.error('Error loading queries:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-document`;
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
            fileData: base64,
            fileSize: file.size
          })
        });

        if (!response.ok) {
          throw new Error('Failed to upload document');
        }

        alert('Document uploaded successfully! Processing will begin shortly.');
        loadStats();
        loadDocuments();
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload document');
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 text-sm mt-1">Manage documents and monitor system usage</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Documents</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDocuments}</p>
              </div>
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Queries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalQueries}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Upload Medical Documents</h3>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="doc-upload"
          />
          <label
            htmlFor="doc-upload"
            className={`flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload PDF Document</span>
              </>
            )}
          </label>
          <p className="text-gray-500 text-sm mt-2">Upload verified medical manuals for RAG knowledge base</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'documents'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('queries')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'queries'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Query Logs
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'documents' && (
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <FileText className="w-8 h-8 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.original_name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(doc.file_size)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                          doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status}
                        </span>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'queries' && (
              <div className="space-y-3">
                {queries.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No queries logged yet</p>
                ) : (
                  queries.map((query) => (
                    <div key={query.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-gray-900">{query.question}</p>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {query.query_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        By {query.profiles?.name || 'Unknown'} • {new Date(query.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
