import { useState } from 'react';
import Sidebar from './Sidebar';
import AskAI from '../Features/AskAI';
import Emergency from '../Features/Emergency';
import SkinCheck from '../Features/SkinCheck';
import Admin from '../Features/Admin';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
  const [currentPage, setCurrentPage] = useState('ask');
  const { isAdmin } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'ask':
        return <AskAI />;
      case 'emergency':
        return <Emergency />;
      case 'skin':
        return <SkinCheck />;
      case 'admin':
        return isAdmin ? <Admin /> : <AskAI />;
      default:
        return <AskAI />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
