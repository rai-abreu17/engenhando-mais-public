import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart3,
  Plus,
  Settings,
  FileText
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
    icon: FileText, 
    label: 'Relatórios', 
    path: '/professores/relatorios' 
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navigationItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              isActive(path) 
                ? 'text-engenha-bright-blue bg-engenha-light-blue border border-engenha-sky-blue' 
                : 'text-gray-500 hover:text-engenha-bright-blue'
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
        className="fixed bottom-20 right-4 bg-gradient-to-r from-engenha-bright-blue to-engenha-blue text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Criar nova aula"
      >
        <Plus size={24} />
      </button>
    </nav>
  );
};

export default TeacherNavigation;