import React, { useState } from 'react';
import { LayoutDashboard, Users, GraduationCap, BookOpen, Settings, FileText, Menu, X, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Professores', path: '/admin/teachers' },
    { icon: GraduationCap, label: 'Turmas', path: '/admin/classes' },
    { icon: BookOpen, label: 'Aulas', path: '/admin/lessons' },
    { icon: Shield, label: 'Controle de Acesso', path: '/admin/access-control' },
    { icon: FileText, label: 'Relatórios', path: '/admin/reports' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  // Mobile: apenas 3 principais + menu hambúrguer
  const mobileItems = navItems.slice(0, 3);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden sm:flex fixed bottom-0 left-0 right-0 bg-white border-t border-[#28b0ff] z-50 safe-area-pb">
        <div className="flex justify-around items-center py-2 max-w-6xl mx-auto overflow-x-auto px-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1 max-w-[100px] ${
                isActive(path) 
                  ? 'text-[#0029ff] bg-[#f0f6ff] border border-[#28b0ff]' 
                  : 'text-[#001cab] hover:text-[#0029ff] hover:bg-[#f0f6ff]/50'
              }`}
            >
              <Icon size={18} className="mb-1 flex-shrink-0" />
              <span className="text-xs leading-tight truncate max-w-full text-center">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#28b0ff] z-50 safe-area-pb">
        <div className="flex items-center py-2 px-2">
          {/* 3 principais no mobile */}
          {mobileItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors flex-1 ${
                isActive(path) 
                  ? 'text-[#0029ff] bg-[#f0f6ff] border border-[#28b0ff]' 
                  : 'text-[#001cab] hover:text-[#0029ff] hover:bg-[#f0f6ff]/50'
              }`}
            >
              <Icon size={16} className="mb-0.5 flex-shrink-0" />
              <span className="text-xs text-center">{label}</span>
            </button>
          ))}
          
          {/* Menu Hambúrguer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center py-1 px-2 h-auto flex-1 ${
                  navItems.slice(3).some(item => isActive(item.path))
                    ? 'text-[#0029ff] bg-[#f0f6ff] border border-[#28b0ff]' 
                    : 'text-[#001cab] hover:text-[#0029ff] hover:bg-[#f0f6ff]/50'
                }`}
              >
                <Menu size={16} className="mb-0.5" />
                <span className="text-xs">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-white border-t border-[#28b0ff] rounded-t-lg">
              <div className="space-y-2 pt-4">
                {navItems.slice(3).map(({ icon: Icon, label, path }) => (
                  <Button
                    key={path}
                    variant="ghost"
                    onClick={() => handleNavigate(path)}
                    className={`w-full justify-start h-12 text-left ${
                      isActive(path) 
                        ? 'text-[#0029ff] bg-[#f0f6ff] border border-[#28b0ff]' 
                        : 'text-[#001cab] hover:text-[#0029ff] hover:bg-[#f0f6ff]/50'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};

export default AdminNavigation;