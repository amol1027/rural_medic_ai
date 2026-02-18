import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 overflow-hidden font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative bg-white/40 backdrop-blur-sm pb-16 md:pb-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(14,165,233,0.03)_0%,_transparent_50%)]"></div>
        <div className="relative h-full animate-page-in">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Bottom Navigation - hidden on desktop */}
      <div className="md:hidden">
        <Sidebar />
      </div>
    </div>
  );
}
