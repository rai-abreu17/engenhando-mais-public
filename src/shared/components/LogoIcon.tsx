import React from 'react';

interface LogoIconProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ size = 'medium', className = '' }) => {
  // Determinar tamanho baseado na propriedade size
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28'
  };
  
  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <img 
        src="/images/logo2.png" 
        alt="Engenha+ Logo" 
        className="w-full h-full object-contain" 
      />
    </div>
  );
};

export default LogoIcon;