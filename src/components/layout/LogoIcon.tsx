import React from 'react';

const LogoIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-8 h-8 bg-background rounded-full">
      <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-primary-foreground">E</span>
      </div>
    </div>
  );
};

export default LogoIcon;