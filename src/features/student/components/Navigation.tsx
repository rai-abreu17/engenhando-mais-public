import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Settings, 
  Heart,
  Sparkles
} from 'lucide-react';

const navigationItems = [
  { icon: Home, label: 'Início', path: '/' },
  { icon: BookOpen, label: 'Biblioteca', path: '/biblioteca' },
  { icon: Sparkles, label: 'Mascote', path: '/mascote' },
  { icon: Trophy, label: 'Jogos', path: '/jogos' },
  { icon: Settings, label: 'Config', path: '/configuracoes' },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navigationItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-300 ${
              isActive(path) 
                ? 'text-primary bg-primary/10 scale-105' 
                : 'text-muted-foreground hover:text-primary hover:scale-105'
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