import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Camera, Database, LogOut, HeartPulse, Stethoscope, Sparkles, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function Sidebar() {
  const { signOut, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/app/emergency', icon: HeartPulse, label: 'Emergency', shortLabel: 'Emergency', color: 'text-red-500' },
    { path: '/app/ask-ai', icon: MessageSquare, label: 'Ascleon AI', shortLabel: 'Ascleon', color: 'text-sky-500' },
    { path: '/app/skin-check', icon: Camera, label: 'Skin Analysis', shortLabel: 'Skin Check', color: 'text-purple-500' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/app/admin', icon: Database, label: 'Admin Panel', shortLabel: 'Admin', color: 'text-emerald-500' });
  }

  return (
    <>
      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/80 shadow-lg">
        <nav className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px] ${
                  isActive
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-500 active:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-6 h-6 mb-1 ${isActive ? item.color : 'text-slate-400'}`} />
                  <span className="text-xs font-medium truncate max-w-[64px]">{item.shortLabel}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px] text-slate-500 active:bg-slate-50"
          >
            <Menu className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </nav>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.user_metadata.full_name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 active:bg-red-100 transition-colors text-sm font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-72 bg-gradient-to-b from-slate-50 to-slate-100/80 border-r border-slate-200/80 flex-col h-full flex-shrink-0">
        {/* Brand Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center space-x-3 mb-2">
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl shadow-lg shadow-sky-500/30">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">RuralMedic</span>
              <div className="flex items-center space-x-1 text-[10px] font-semibold text-sky-600 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Navigation</p>
          <nav className="space-y-1.5">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? 'bg-white text-slate-800 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/50'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-800 hover:shadow-sm'
                  }`
                }
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-sky-400 to-sky-600 rounded-r-full"></div>
                    )}
                    <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-slate-100' : 'group-hover:bg-slate-100/50'}`}>
                      <item.icon className={`w-5 h-5 transition-all duration-200 ${isActive ? item.color : 'text-slate-400 group-hover:text-slate-600'}`} />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200/60">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-500/20">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.user_metadata.full_name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft"></div>
              <span className="font-semibold">Connected & Ready</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-sm font-medium group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
