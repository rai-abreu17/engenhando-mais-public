import React from 'react';
import LogoIcon from '@/components/layout/LogoIcon';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground p-4 shadow-lg">
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <LogoIcon />
        <div className="flex-1">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-primary-foreground/80">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;