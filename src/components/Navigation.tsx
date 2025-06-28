
import React from 'react';
import { Home, Book, Settings, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Book, label: 'Biblioteca', path: '/biblioteca' },
    { icon: Users, label: 'Mascote', path: '/mascote' },
    { icon: Settings, label: 'Config', path: '/configuracoes' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-engenha-border z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              isActive(path) 
                ? 'text-engenha-blue bg-blue-50 border border-engenha-border' 
                : 'text-gray-500 hover:text-engenha-blue'
            }`}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
