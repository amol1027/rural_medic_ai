import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      if (err.message?.includes('rate limit')) {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3 md:p-6 bg-[mask-image:radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 via-slate-50 to-slate-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-2xl shadow-sky-900/10 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side - Brand / Info - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:flex md:w-1/2 bg-sky-600 p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-6 ring-1 ring-white/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">Rural Medic AI</h1>
            <p className="text-sky-100 text-base lg:text-lg leading-relaxed">
              Empowering communities with accessible, AI-driven healthcare support anywhere, anytime.
            </p>
          </div>

          <div className="relative z-10 space-y-3 lg:space-y-4">
            <div className="flex items-center space-x-3 lg:space-x-4 text-sm text-sky-100 bg-sky-700/50 p-3 lg:p-4 rounded-xl border border-sky-500/30 backdrop-blur-sm">
                <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span>Verified medical knowledge base</span>
            </div>
            <div className="flex items-center space-x-3 lg:space-x-4 text-sm text-sky-100 bg-sky-700/50 p-3 lg:p-4 rounded-xl border border-sky-500/30 backdrop-blur-sm">
                <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <span>Offline-ready emergency guides</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
          {/* Mobile header with branding */}
          <div className="md:hidden mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-600 rounded-xl mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Rural Medic AI</h1>
          </div>

          <div className="max-w-md mx-auto w-full">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1.5 md:mb-2">
                {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-slate-500 text-sm md:text-base mb-6 md:mb-8">
                {isSignUp ? 'Join us to access personalized healthcare support' : 'Enter your credentials to access your account'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none"
                    placeholder="John Doe"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs md:text-sm flex items-start space-x-2">
                    <svg className="w-4 md:w-5 h-4 md:h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 md:py-4 rounded-lg md:rounded-xl transition-all shadow-lg shadow-sky-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 md:mt-8 text-center">
              <p className="text-slate-500 text-xs md:text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-sky-600 hover:text-sky-700 font-bold hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
