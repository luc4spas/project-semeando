import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors ${
        theme === 'dark' 
          ? 'text-yellow-400 hover:bg-gray-700' 
          : 'text-gray-600 hover:bg-gray-100'
      } ${className}`}
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
