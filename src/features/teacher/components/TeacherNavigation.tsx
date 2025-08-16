import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart3,
  Plus,
  Settings
} from 'lucide-react';

const navigationItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/professores/dashboard' 
  },
  { 
    icon: Users, 
    label: 'Turmas', 
    path: '/professores/turmas' 
  },
  { 
    icon: BookOpen, 
    label: 'Aulas', 
    path: '/professores/aulas' 
  },
  { 
    icon: MessageSquare, 
    label: 'Feedback', 
    path: '/professores/feedback' 
  },
  { 
    icon: BarChart3, 
    label: 'Analytics', 
    path: '/professores/analytics' 
  },
  { 
    icon: Settings, 
    label: 'Configurações', 
    path: '/professores/configuracoes' 
  },
];

const TeacherNavigation: React.FC = () => {
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
      
      {/* Floating Action Button - Create Lesson */}
      <button
        onClick={() => navigate('/professores/aulas/criar')}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Criar nova aula"
      >
        <Plus size={24} />
      </button>
    </nav>
  );
};

export default TeacherNavigation;