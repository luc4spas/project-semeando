import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Menu, X, BaggageClaim } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const { theme } = useTheme();

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/membros', icon: Users, label: 'Membros' },
    { path: '/visitantes', icon: BaggageClaim, label: 'Visitantes' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-lg z-30 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 lg:w-16'
        } ${
          theme === 'dark' ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
        }`}
      >
        <div className={`flex flex-col h-full ${!isOpen && 'lg:items-center'}`}>
          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className={`p-4 flex items-center justify-center transition-colors ${
              theme === 'dark' 
                ? 'text-gray-200 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 transition-colors ${!isOpen && 'lg:justify-center'} ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-indigo-50 text-indigo-600'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon size={20} />
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
