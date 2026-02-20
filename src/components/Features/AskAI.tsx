import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, Sparkles, Bot, User, Zap, Trash2, Mic, MicOff, Volume2, Square } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'mr', name: 'Marathi (मराठी)' }
];

const SPEECH_LANGUAGE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

const ACCESSIBILITY_TEXT: Record<string, {
  startVoiceInput: string;
  stopVoiceInput: string;
  readAloud: string;
  stopReading: string;
  voiceInputNotSupported: string;
  readAloudNotSupported: string;
}> = {
  en: {
    startVoiceInput: 'Start voice input',
    stopVoiceInput: 'Stop voice input',
    readAloud: 'Read aloud',
    stopReading: 'Stop reading',
    voiceInputNotSupported: 'Voice input is not supported in this browser.',
    readAloudNotSupported: 'Read-aloud is not supported in this browser.',
  },
  hi: {
    startVoiceInput: 'आवाज़ से लिखना शुरू करें',
    stopVoiceInput: 'आवाज़ से लिखना बंद करें',
    readAloud: 'जोर से पढ़ें',
    stopReading: 'पढ़ना बंद करें',
    voiceInputNotSupported: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।',
    readAloudNotSupported: 'इस ब्राउज़र में जोर से पढ़ना समर्थित नहीं है।',
  },
  mr: {
    startVoiceInput: 'आवाज इनपुट सुरू करा',
    stopVoiceInput: 'आवाज इनपुट थांबवा',
    readAloud: 'मोठ्याने वाचा',
    stopReading: 'वाचन थांबवा',
    voiceInputNotSupported: 'या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही.',
    readAloudNotSupported: 'या ब्राउझरमध्ये मोठ्याने वाचन उपलब्ध नाही.',
  },
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export default function AskAI() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('mr');
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const chatCacheKey = user ? `medic_chat_cache_${user.id}` : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Clear messages when user changes, then load their own history
    setMessages([]);
    if (!chatCacheKey) return;
    const cached = localStorage.getItem(chatCacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setMessages(parsed.slice(-10).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (e) {
        console.error('Error loading cached messages:', e);
      }
    }
  }, [chatCacheKey]);

  const getQueryEmbedding = async (text: string, apiKey: string): Promise<number[] | null> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: { parts: [{ text }] }
          })
        }
      );
      if (!response.ok) return null;
      const data = await response.json();
      return data.embedding?.values || null;
    } catch {
      console.warn('Embedding generation failed, proceeding without RAG context');
      return null;
    }
  };

  const searchKnowledgeBase = async (embedding: number[]): Promise<string[]> => {
    try {
      const { data, error } = await supabase.rpc('match_embeddings', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 5
      });
      if (error) {
        console.warn('Knowledge base search failed:', error.message);
        return [];
      }
      return (data || []).map((item: { chunk_text: string }) => item.chunk_text);
    } catch {
      console.warn('Knowledge base search failed, proceeding without context');
      return [];
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (chatCacheKey) {
      localStorage.removeItem(chatCacheKey);
    }
  };

  const handleToggleVoiceInput = () => {
    const speechRecognitionCtor = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;

    if (!speechRecognitionCtor) {
      alert(ACCESSIBILITY_TEXT[language]?.voiceInputNotSupported || ACCESSIBILITY_TEXT.en.voiceInputNotSupported);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new speechRecognitionCtor();
    recognition.lang = SPEECH_LANGUAGE_MAP[language] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript || '')
        .join(' ')
        .trim();

      if (transcript) {
        setInput(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const handleReadAloud = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert(ACCESSIBILITY_TEXT[language]?.readAloudNotSupported || ACCESSIBILITY_TEXT.en.readAloudNotSupported);
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANGUAGE_MAP[language] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!geminiKey) throw new Error('Gemini API key not configured');

      const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';

      // --- RAG: Retrieve relevant context from knowledge base ---
      let contextSection = '';
      const embedding = await getQueryEmbedding(userMessage.content, geminiKey);
      if (embedding) {
        const contextChunks = await searchKnowledgeBase(embedding);
        if (contextChunks.length > 0) {
          contextSection = `\n\nVerified Medical Context (use this to inform your answer):\n${contextChunks.join('\n\n')}`;
        }
      }

      // --- Generate response with RAG context ---
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

      const systemPrompt = `You are Ascleon AI, an expert rural medical assistant. Respond in simple, non-technical ${langName}.

IMPORTANT RULES:
1. ALWAYS prioritize safety - never suggest anything that could cause harm
2. If symptoms are severe or life-threatening, IMMEDIATELY advise visiting nearest clinic/hospital
3. Base your answers on the provided medical context when available
4. If you don't have enough information, say so clearly
5. Never diagnose - only provide general guidance
6. Always end with: "This is not a substitute for professional medical care."${contextSection}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nQuestion: ${userMessage.content}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      // Gemini 2.5 Flash thinking model: skip thought parts, get actual response
      const parts = data.candidates?.[0]?.content?.parts || [];
      let answer = '';
      for (const part of parts) {
        if (part.text && !part.thought) {
          answer = part.text;
        }
      }
      if (!answer) {
        answer = parts.find((p: any) => p.text)?.text || 'Sorry, I could not generate a response.';
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: answer,
        timestamp: new Date()
      };

      const newMessages = [...messages, userMessage, assistantMessage];
      setMessages(newMessages);

      if (chatCacheKey) {
        localStorage.setItem(chatCacheKey, JSON.stringify(newMessages.slice(-10)));
      }

      // Log query to database (best-effort, don't block on failure)
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase.from('queries').insert({
            user_id: user.id,
            question: userMessage.content,
            answer,
            language,
            query_type: 'medical'
          }).then(() => {});
        }
      });

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="hidden md:block absolute top-0 right-0 p-8 text-sky-500/[0.03] pointer-events-none">
        <MessageSquare className="w-[500px] h-[500px]" />
      </div>
      <div className="absolute bottom-0 left-0 w-48 md:w-96 h-48 md:h-96 bg-sky-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 py-3 md:py-5 flex items-center justify-between sticky top-0 z-10 gap-2">
        <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
          <div className="p-2 md:p-2.5 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg md:rounded-xl shadow-lg shadow-sky-500/25 flex-shrink-0">
            <Bot className="w-5 md:w-6 h-5 md:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base md:text-xl font-bold text-slate-800 truncate">Ascleon AI</h2>
            <p className="text-slate-500 text-[10px] md:text-xs mt-0.5 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="truncate">Online</span>
            </p>
          </div>
        </div>
        
        {/* Language Selector & Clear Chat */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
          <span className="text-[10px] md:text-xs font-medium text-slate-400 hidden sm:inline">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs md:text-sm rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 block px-2 md:px-3 py-1.5 md:py-2 outline-none font-medium cursor-pointer hover:bg-white hover:border-slate-300 transition-all"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-1.5 md:p-2 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 rounded-lg md:rounded-xl transition-all active:scale-95 group"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-4 md:mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-sky-100 to-sky-50 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg shadow-sky-100">
                <Sparkles className="w-8 md:w-10 h-8 md:h-10 text-sky-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-3 md:w-4 h-3 md:h-4 text-white" />
              </div>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-slate-800 mb-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>Hello! I'm Ascleon AI</h3>
            <p className="text-xs md:text-base text-slate-500 max-w-md mx-auto mb-6 md:mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              How can I help you today? Ask about symptoms, medical conditions, first aid, or general health advice.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 max-w-2xl w-full">
              {[
                { text: "What are the symptoms of dengue?", icon: "🦟" },
                { text: "How to treat a minor burn?", icon: "🔥" },
                { text: "First aid for snake bite", icon: "🐍" },
                { text: "Diet for high blood pressure", icon: "❤️" }
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => setInput(query.text)}
                  className="opacity-0 animate-fade-in bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-200 text-left text-slate-600 hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md group flex items-center space-x-2 md:space-x-3"
                  style={{ animationDelay: `${0.4 + i * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">{query.icon}</span>
                  <span className="font-medium text-xs md:text-sm">{query.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const messageId = `${msg.role}-${idx}-${msg.timestamp.getTime()}`;
            const isReadingThis = speakingMessageId === messageId;

            return (
            <div
              key={idx}
              className={`flex w-full items-start space-x-2 md:space-x-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 md:w-9 h-8 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20">
                  <Bot className="w-4 md:w-5 h-4 md:h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-tr-sm shadow-lg shadow-sky-500/20'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                }`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div style={{ whiteSpace: 'pre-wrap' }} className="leading-relaxed text-xs md:text-sm">{msg.content}</div>
                </div>
                <div
                  className={`text-[9px] md:text-[10px] mt-2 md:mt-2.5 font-medium flex items-center space-x-1 ${
                    msg.role === 'user' ? 'text-sky-100 justify-end' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handleReadAloud(messageId, msg.content)}
                      className="ml-2 inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                      title={isReadingThis ? (ACCESSIBILITY_TEXT[language]?.stopReading || ACCESSIBILITY_TEXT.en.stopReading) : (ACCESSIBILITY_TEXT[language]?.readAloud || ACCESSIBILITY_TEXT.en.readAloud)}
                    >
                      {isReadingThis ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isReadingThis ? (ACCESSIBILITY_TEXT[language]?.stopReading || ACCESSIBILITY_TEXT.en.stopReading) : (ACCESSIBILITY_TEXT[language]?.readAloud || ACCESSIBILITY_TEXT.en.readAloud)}</span>
                    </button>
                  )}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 md:w-9 h-8 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <User className="w-4 md:w-5 h-4 md:h-5 text-slate-500" />
                </div>
              )}
            </div>
            );
          })
        )}
        {loading && (
          <div className="flex justify-start items-start space-x-2 md:space-x-3 animate-fade-in">
            <div className="flex-shrink-0 w-8 md:w-9 h-8 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Bot className="w-4 md:w-5 h-4 md:h-5 text-white" />
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl rounded-tl-sm px-4 md:px-5 py-3 md:py-4 border border-slate-100 shadow-sm flex items-center space-x-2 md:space-x-3">
              <div className="flex space-x-1 md:space-x-1.5">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs md:text-sm text-slate-500 font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2 md:gap-3">
            <div className="relative flex-1">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Describe your symptoms or ask a question..."
                    className="w-full pl-3 md:pl-5 pr-3 md:pr-4 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl resize-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white outline-none transition-all duration-200 min-h-[48px] md:min-h-[56px] max-h-[120px] text-sm md:text-base text-slate-700 placeholder-slate-400"
                    rows={1}
                />
            </div>

          <button
            type="button"
            onClick={handleToggleVoiceInput}
            disabled={loading}
            className={`h-[48px] md:h-[56px] w-[48px] md:w-[56px] rounded-xl md:rounded-2xl text-white font-medium transition-all duration-200 active:scale-95 flex items-center justify-center ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30'
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? (ACCESSIBILITY_TEXT[language]?.stopVoiceInput || ACCESSIBILITY_TEXT.en.stopVoiceInput) : (ACCESSIBILITY_TEXT[language]?.startVoiceInput || ACCESSIBILITY_TEXT.en.startVoiceInput)}
          >
            {isListening ? <MicOff className="w-4 md:w-5 h-4 md:h-5" /> : <Mic className="w-4 md:w-5 h-4 md:h-5" />}
          </button>
          
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-[48px] md:h-[56px] w-[48px] md:w-[56px] bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl md:rounded-2xl text-white font-medium transition-all duration-200 shadow-lg shadow-sky-500/30 active:scale-95 flex items-center justify-center group"
          >
            {loading ? (
              <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
            ) : (
              <Send className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </form>
        <p className="text-center text-[10px] md:text-[11px] text-slate-400 mt-2 md:mt-2.5">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
