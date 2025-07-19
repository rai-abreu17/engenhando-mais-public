import React from 'react';
import { Home, Book, Users, Settings } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';

/**
 * Navegação específica para estudantes
 */
const StudentNavigation: React.FC = () => {
  const studentItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Book, label: 'Biblioteca', path: '/biblioteca' },
    { icon: Users, label: 'Mascote', path: '/mascote' },
    { icon: Settings, label: 'Config', path: '/configuracoes' }
  ];

  return <Navigation items={studentItems} />;
};

export default StudentNavigation;