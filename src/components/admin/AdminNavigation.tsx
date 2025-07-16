import React from 'react';
import { LayoutDashboard, Users, GraduationCap, BookOpen, Settings, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Professores', path: '/admin/teachers' },
    { icon: GraduationCap, label: 'Turmas', path: '/admin/classes' },
    { icon: BookOpen, label: 'Aulas', path: '/admin/lessons' },
    { icon: FileText, label: 'Relatórios', path: '/admin/reports' },
    { icon: Settings, label: 'Config', path: '/admin/settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#28b0ff] z-50">
      <div className="flex justify-around items-center py-2 max-w-6xl mx-auto overflow-x-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 ${
              isActive(path) 
                ? 'text-[#0029ff] bg-[#f0f6ff] border border-[#28b0ff]' 
                : 'text-[#001cab] hover:text-[#0029ff] hover:bg-[#f0f6ff]/50'
            }`}
          >
            <Icon size={18} className="mb-1 flex-shrink-0" />
            <span className="text-xs truncate max-w-[60px]">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default AdminNavigation;