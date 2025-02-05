import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { useAuth } from './contexts/AuthContext';
import { signOut } from './lib/auth';
import { Home } from './pages/Home';
import { Membros } from './pages/Membros';
import { MembroDetalhes } from './pages/MembroDetalhes';

function App() {
  const { user, profile, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <div>
          {!user ? (
            <Auth />
          ) : (
            <div className="min-h-screen bg-gray-100">
              <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              />
              
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
                <div className="p-4">
                  <div className="max-w-7xl mx-auto">
                    <header className="bg-white shadow rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Semeando Família</h1>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {profile?.full_name} ({profile?.role})
                          </span>
                          <button
                            onClick={() => signOut()}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                          >
                            Sair
                          </button>
                        </div>
                      </div>
                    </header>

                    <main className="bg-white shadow rounded-lg">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/membros" element={<Membros />} />
                        <Route path="/membro/:id" element={<MembroDetalhes />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;