import { useNavigate } from 'react-router-dom';
import { Heart, Zap, MessageSquare, Camera, Globe, Shield, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function Homepage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: 'Ascleon AI',
      description: 'Get instant answers to health questions from our RAG-powered AI assistant trained on verified medical knowledge.',
      color: 'sky'
    },
    {
      icon: Zap,
      title: 'Emergency Offline Guides',
      description: 'Access critical first-aid decision trees for 16+ emergencies without internet connectivity.',
      color: 'red'
    },
    {
      icon: Camera,
      title: 'Skin Condition Analysis',
      description: 'Upload images for AI-powered triage of skin conditions with severity assessment and care steps.',
      color: 'purple'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Available in English, Hindi, and Marathi to serve diverse communities.',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your health data is protected with enterprise-grade encryption and secure authentication.',
      color: 'slate'
    },
    {
      icon: Heart,
      title: 'Always Available',
      description: 'Designed for low-connectivity areas with smart caching and offline-first features.',
      color: 'pink'
    }
  ];

  const emergencyTypes = [
    'High Fever', 'Snake Bite', 'Severe Bleeding', 'Burns', 'Fractures',
    'Heat Stroke', 'Choking', 'Chest Pain', 'Poisoning', 'Seizures'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-sky-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-base sm:text-xl font-bold text-slate-800 truncate">Rural Medic AI</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-sky-600/30 active:scale-95"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-sky-400/20 rounded-full blur-3xl -mr-32 sm:-mr-48 -mt-32 sm:-mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400/20 rounded-full blur-3xl -ml-32 sm:-ml-48 -mb-32 sm:-mb-48"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-sky-100 text-sky-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="leading-tight">AI Healthcare for Rural Communities</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-2">
              Healthcare Guidance
              <br />
              <span className="text-sky-600">Accessible Anywhere</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Empowering communities with verified medical knowledge, emergency first-aid guides, and AI-driven health support—even in low-connectivity areas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl font-semibold text-base sm:text-lg transition-all hover:shadow-xl hover:shadow-sky-600/30 active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Start Free Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 rounded-xl font-semibold text-base sm:text-lg transition-all border-2 border-slate-200 hover:border-slate-300 active:scale-95"
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-slate-600 px-4">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span>Verified Medical Sources</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span>Offline-Ready</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Comprehensive Health Support
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              Advanced AI technology meets practical healthcare needs, designed specifically for rural and underserved areas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                sky: 'bg-sky-100 text-sky-600',
                red: 'bg-red-100 text-red-600',
                purple: 'bg-purple-100 text-purple-600',
                green: 'bg-green-100 text-green-600',
                slate: 'bg-slate-100 text-slate-600',
                pink: 'bg-pink-100 text-pink-600'
              };
              
              return (
                <div
                  key={index}
                  className="p-5 sm:p-6 bg-slate-50 hover:bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-lg group active:scale-[0.98]"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Coverage */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-red-50 to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-red-100 text-red-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Critical Emergency Support</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              16+ Emergency Decision Trees
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              Step-by-step first-aid guidance available offline when you need it most.
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-xl border border-red-100">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {emergencyTypes.map((emergency, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 text-red-700 rounded-lg text-xs sm:text-sm font-medium border border-red-200"
                >
                  {emergency}
                </div>
              ))}
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-100 text-red-800 rounded-lg text-xs sm:text-sm font-bold border-2 border-red-300">
                + 6 More
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4">
              Simple, Fast, Reliable
            </h2>
            <p className="text-base sm:text-lg text-slate-600 px-4">
              Get the healthcare guidance you need in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-slate-50 sm:bg-transparent p-6 sm:p-0 rounded-xl sm:rounded-none">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sky-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg shadow-sky-600/20">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                Create Account
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                Quick sign-up with just your email and password. No complex forms.
              </p>
            </div>

            <div className="text-center bg-slate-50 sm:bg-transparent p-6 sm:p-0 rounded-xl sm:rounded-none">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sky-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg shadow-sky-600/20">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                Choose Your Feature
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                Chat with Ascleon AI, access emergency guides, or analyze skin conditions.
              </p>
            </div>

            <div className="text-center bg-slate-50 sm:bg-transparent p-6 sm:p-0 rounded-xl sm:rounded-none">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-sky-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg shadow-sky-600/20">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                Get Instant Guidance
              </h3>
              <p className="text-sm sm:text-base text-slate-600">
                Receive verified, actionable medical information in your preferred language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-sky-600 to-sky-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -mr-32 sm:-mr-48 -mt-32 sm:-mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-sky-400/20 rounded-full blur-3xl -ml-32 sm:-ml-48 -mb-32 sm:-mb-48"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 px-4">
            Ready to Access Better Healthcare?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-sky-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Join thousands relying on Rural Medic AI for trustworthy health guidance.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-sky-600 rounded-xl font-semibold text-base sm:text-lg transition-all hover:shadow-2xl active:scale-95 inline-flex items-center justify-center space-x-2 max-w-sm mx-auto"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-sky-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-white font-semibold text-base sm:text-lg">Rural Medic AI</span>
            </div>
            <div className="text-xs sm:text-sm text-center md:text-right">
              <p className="text-slate-400">&copy; 2026 Rural Medic AI. Empowering communities with accessible healthcare.</p>
              <p className="mt-1 text-slate-500">This is not a substitute for professional medical advice.</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
