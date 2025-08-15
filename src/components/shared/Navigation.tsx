import React from 'react';
import { Home, Book, Settings, Users, LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 shadow-xl",
        className
      )}
    >
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {items.map(({ icon: Icon, label, path }, index) => {
          const active = isActive(path);
          return (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <motion.button
                onClick={() => navigate(path)}
                className="flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-300 relative"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={label}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl shadow-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <motion.div
                  className={cn(
                    "relative z-10 flex flex-col items-center",
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                  whileHover={{ 
                    color: active ? undefined : 'hsl(var(--primary))',
                    scale: 1.1 
                  }}
                >
                  <Icon size={20} className="mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                </motion.div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navigation;