import React from 'react';

interface LogoProps {
  variant?: 'default' | 'small';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  // Determinar qual logo usar (as duas opções estão disponíveis)
  const logoSrc = '/images/logo2.png'; // Trocar para logo2.png
  
  // Definir classes de tamanho com base na variante
  const sizeClasses = variant === 'small' ? 'w-40 h-40' : 'w-64 h-64';
  
  return (
    <div className={`flex items-center justify-center ${sizeClasses} ${className}`}>
      <img 
        src={logoSrc} 
        alt="Engenha+ Logo" 
        className="w-full h-full object-contain" 
      />
    </div>
  );
};

export default Logo;
