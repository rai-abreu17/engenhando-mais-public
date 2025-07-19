import React from 'react';
import { Home, Book, Settings, Users, LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface NavigationProps {
  items?: NavigationItem[];
  className?: string;
}

const defaultItems: NavigationItem[] = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Book, label: 'Biblioteca', path: '/biblioteca' },
  { icon: Users, label: 'Mascote', path: '/mascote' },
  { icon: Settings, label: 'Config', path: '/configuracoes' }
];

/**
 * Componente de navegação inferior reutilizável
 */
const Navigation: React.FC<NavigationProps> = ({ 
  items = defaultItems,
  className 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-lg",
      className
    )}>
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {items.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200",
              isActive(path) 
                ? 'text-engenha-bright-blue bg-engenha-light-blue border border-engenha-sky-blue shadow-sm' 
                : 'text-muted-foreground hover:text-engenha-bright-blue hover:bg-engenha-light-blue/50'
            )}
            aria-label={label}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;