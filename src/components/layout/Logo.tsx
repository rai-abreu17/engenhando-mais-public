import React from 'react';
import LogoIcon from './LogoIcon';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <LogoIcon />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Engenha+</h1>
        <p className="text-sm text-muted-foreground">Plataforma de Estudos</p>
      </div>
    </div>
  );
};

export default Logo;