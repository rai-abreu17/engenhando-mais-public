import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart3,
  Plus,
  Settings,
  FileText,
  Menu
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

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
    label: 'Config', 
    path: '/professores/configuracoes' 
  },
];

const TeacherNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Primeiros 4 itens para mobile - mais importantes
  const primaryItems = navigationItems.slice(0, 4);
  // Itens restantes para o menu
  const secondaryItems = navigationItems.slice(4);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2 max-w-md mx-auto">
          {/* Itens principais no mobile */}
          {primaryItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
                isActive(path) 
                  ? 'text-engenha-bright-blue bg-engenha-light-blue border border-engenha-sky-blue' 
                  : 'text-gray-500 hover:text-engenha-bright-blue'
              }`}
            >
              <Icon size={18} className="mb-1" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
          
          {/* Menu hambúrguer para itens secundários */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
                  secondaryItems.some(item => isActive(item.path))
                    ? 'text-engenha-bright-blue bg-engenha-light-blue border border-engenha-sky-blue'
                    : 'text-gray-500 hover:text-engenha-bright-blue'
                }`}
              >
                <Menu size={18} className="mb-1" />
                <span className="text-xs">Mais</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[50vh]">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Mais Opções</h3>
                <div className="space-y-2">
                  {secondaryItems.map(({ icon: Icon, label, path }) => (
                    <button
                      key={path}
                      onClick={() => {
                        navigate(path);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                        isActive(path) 
                          ? 'text-engenha-bright-blue bg-engenha-light-blue border border-engenha-sky-blue' 
                          : 'text-gray-500 hover:text-engenha-bright-blue hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
    </>
  );
};

export default TeacherNavigation;