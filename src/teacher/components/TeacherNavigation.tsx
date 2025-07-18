import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart3,
  Plus
} from 'lucide-react';

const navigationItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/teacher/dashboard' 
  },
  { 
    icon: Users, 
    label: 'Turmas', 
    path: '/teacher/classes' 
  },
  { 
    icon: BookOpen, 
    label: 'Aulas', 
    path: '/teacher/lessons' 
  },
  { 
    icon: MessageSquare, 
    label: 'Feedback', 
    path: '/teacher/feedback' 
  },
  { 
    icon: BarChart3, 
    label: 'Relatórios', 
    path: '/teacher/analytics' 
  },
];

const TeacherNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary/20 px-4 py-2 md:static md:bg-transparent md:border-0 md:p-0">
      <div className="flex justify-around md:flex-col md:space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors md:flex-row md:justify-start md:px-4 md:py-3 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Icon size={20} className="mb-1 md:mb-0 md:mr-3" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
      
      {/* Floating Action Button - Create Lesson */}
      <NavLink
        to="/teacher/lessons/create"
        className="fixed bottom-20 right-4 bg-gradient-to-r from-accent to-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all md:hidden"
        aria-label="Criar nova aula"
      >
        <Plus size={24} />
      </NavLink>
    </nav>
  );
};

export default TeacherNavigation;