import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { signOut } from './lib/auth';
import { Home } from './pages/Home';
import { Membros } from './pages/Membros';
import { MembroDetalhes } from './pages/MembroDetalhes';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const { user, profile, loading } = useAuth();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-600'
      }`}>
        <div className="text-xl font-semibold">Carregando...</div>
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
            <div className={`min-h-screen ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
            }`}>
              <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              />
              
              <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
                <div className="p-4">
                  <div className="max-w-7xl mx-auto">
                    <header className={`shadow rounded-lg p-4 mb-6 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <div className="flex justify-between items-center">
                        <h1 className={`text-2xl font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          Semeando Família
                        </h1>
                        <div className="flex items-center gap-4">
                          <ThemeToggle />
                          <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {profile?.full_name} ({profile?.role})
                          </span>
                          <button
                            onClick={() => signOut()}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                              theme === 'dark'
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                          >
                            Sair
                          </button>
                        </div>
                      </div>
                    </header>

                    <main className={`rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
                    }`}>
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