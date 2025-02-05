import React, { useState } from 'react';
import { signIn } from '../lib/auth';
import logo from '../assets/logo.svg';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await signIn(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`max-w-md w-full rounded-lg shadow-md p-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="relative">
          <ThemeToggle className="absolute right-0 top-0" />
          
          <div className="flex items-center justify-center mb-8">
            <div className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
                : 'bg-gradient-to-r from-indigo-50 to-blue-50'
            }`}>
              <img 
                src={logo} 
                alt="Logo Semeando Família" 
                className="h-24 w-auto drop-shadow-md hover:drop-shadow-xl transition-all duration-300" 
              />
            </div>
          </div>
        </div>

        <h2 className={`text-center text-2xl font-bold mb-8 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Semeando Família
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            } ${
              theme === 'dark' ? 'focus:ring-offset-gray-800' : ''
            }`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}