import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showStreak?: boolean;
  streakDays?: number;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Componente Header reutilizável com design system consistente
 */
const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showStreak = false, 
  streakDays = 0,
  className,
  variant = 'default'
}) => {
  return (
    <header 
      className={cn(
        "bg-gradient-to-r from-engenha-blue to-engenha-bright-blue text-white rounded-b-3xl mb-4 sm:mb-6",
        variant === 'compact' ? "p-3 sm:p-4" : "p-4 sm:p-6",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h1 className={cn(
            "font-bold text-white truncate",
            variant === 'compact' ? "text-base sm:text-xl" : "text-lg sm:text-2xl"
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              "text-white mt-1 opacity-90 line-clamp-2",
              variant === 'compact' ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        
        {showStreak && (
          <div className="bg-white/20 px-2 sm:px-3 py-1 rounded-full border border-engenha-sky-blue ml-3 flex-shrink-0">
            <div className="flex items-center space-x-1">
              <span className="text-sm sm:text-lg">🔥</span>
              <span className={cn(
                "font-semibold text-white",
                variant === 'compact' ? "text-xs sm:text-sm" : "text-xs sm:text-sm"
              )}>
                {streakDays}
              </span>
              <span className="text-xs text-white opacity-90 hidden sm:inline">
                dias
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;