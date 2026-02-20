import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Homepage from './components/Home/Homepage';
import AskAI from './components/Features/AskAI';
import Emergency from './components/Features/Emergency';
import EmergencyContacts from './components/Features/EmergencyContacts';
import NearbyCare from './components/Features/NearbyCare';
import SkinCheck from './components/Features/SkinCheck';
import Admin from './components/Features/Admin';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 border-4 border-sky-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-semibold">Loading Rural Medic AI...</p>
          <p className="text-slate-400 text-sm mt-1">Preparing your health assistant</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border-3 border-sky-200 rounded-full"></div>
          <div className="absolute inset-0 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return isAdmin ? children : <Navigate to="/app" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<ProtectedLayout />}>
            <Route index element={<Navigate to="/app/emergency" replace />} />
            <Route path="ask-ai" element={<AskAI />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="emergency-contacts" element={<EmergencyContacts />} />
            <Route path="nearby-care" element={<NearbyCare />} />
            <Route path="skin-check" element={<SkinCheck />} />
            <Route path="admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
