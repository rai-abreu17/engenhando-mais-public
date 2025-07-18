import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChart3,
  Plus,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { COLORS } from '@/constants/theme';

const TeacherNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/teacher/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      ariaLabel: 'Ir para Dashboard'
    },
    { 
      path: '/teacher/classes', 
      icon: Users, 
      label: 'Turmas',
      ariaLabel: 'Gerenciar turmas'
    },
    { 
      path: '/teacher/lessons', 
      icon: BookOpen, 
      label: 'Aulas',
      ariaLabel: 'Gerenciar aulas'
    },
    { 
      path: '/teacher/feedback', 
      icon: MessageSquare, 
      label: 'Feedback',
      ariaLabel: 'Ver feedback'
    },
    { 
      path: '/teacher/analytics', 
      icon: BarChart3, 
      label: 'Relatórios',
      ariaLabel: 'Ver relatórios'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile: Barra inferior com 3 ícones + menu hambúrguer */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 border-t z-40"
        style={{ 
          backgroundColor: COLORS.lightCream,
          borderColor: COLORS.skyBlue 
        }}
      >
        <div className="flex items-center justify-around py-2 px-2">
          {/* 3 principais itens no mobile */}
          {navigationItems.slice(0, 3).map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 flex-1 max-w-[80px] ${
                  active ? 'shadow-sm' : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: active ? COLORS.brightBlue : 'transparent',
                  color: active ? 'white' : COLORS.darkNavy,
                }}
                onTouchStart={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = COLORS.lightBlue;
                  }
                }}
                onTouchEnd={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                aria-label={item.ariaLabel}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* Menu hambúrguer para as outras opções */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 flex-1 max-w-[80px] h-auto ${
                  navigationItems.slice(3).some(item => isActive(item.path))
                    ? 'shadow-sm' 
                    : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: navigationItems.slice(3).some(item => isActive(item.path)) 
                    ? COLORS.brightBlue 
                    : 'transparent',
                  color: navigationItems.slice(3).some(item => isActive(item.path)) 
                    ? 'white' 
                    : COLORS.darkNavy,
                }}
                aria-label="Abrir menu de navegação"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  Menu
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="bottom" 
              className="h-auto max-h-[60vh] p-0"
              style={{ backgroundColor: COLORS.lightCream }}
            >
              <div className="p-4 border-b" style={{ borderColor: COLORS.skyBlue }}>
                <h2 
                  className="text-lg font-semibold"
                  style={{ color: COLORS.darkNavy }}
                >
                  Mais Opções
                </h2>
              </div>
              
              <nav className="p-4 space-y-2" role="navigation" aria-label="Menu adicional do professor">
                {navigationItems.slice(3).map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        active ? 'shadow-md' : 'hover:shadow-sm'
                      }`}
                      style={{
                        backgroundColor: active ? COLORS.brightBlue : 'transparent',
                        color: active ? 'white' : COLORS.darkNavy,
                      }}
                      onTouchStart={(e) => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = COLORS.lightBlue;
                        }
                      }}
                      onTouchEnd={(e) => {
                        if (!active) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      aria-label={item.ariaLabel}
                      aria-current={active ? 'page' : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop: Barra inferior */}
      <div 
        className="hidden md:block fixed bottom-0 left-0 right-0 border-t z-40"
        style={{ 
          backgroundColor: COLORS.lightCream,
          borderColor: COLORS.skyBlue 
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <nav 
            className="flex items-center justify-center space-x-1 py-3"
            role="navigation" 
            aria-label="Menu principal do professor"
          >
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 min-w-[80px] ${
                    active ? 'shadow-sm' : 'hover:shadow-sm'
                  }`}
                  style={{
                    backgroundColor: active ? COLORS.brightBlue : 'transparent',
                    color: active ? 'white' : COLORS.darkNavy,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = COLORS.lightBlue;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  aria-label={item.ariaLabel}
                  aria-current={active ? 'page' : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium text-center leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Floating Action Button - Create Lesson */}
      <Link
        to="/teacher/lessons/create"
        className="fixed bottom-20 right-4 p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        style={{
          background: `linear-gradient(135deg, ${COLORS.brightBlue}, ${COLORS.darkNavy})`,
          color: 'white'
        }}
        aria-label="Criar nova aula"
      >
        <Plus size={24} />
      </Link>
    </>
  );
};

export default TeacherNavigation;
