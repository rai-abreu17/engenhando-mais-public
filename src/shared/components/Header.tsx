import React, { ReactNode } from 'react';
import LogoIcon from './LogoIcon';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showStreak?: boolean;
  streakDays?: number;
  icon?: ReactNode;
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showStreak = false, streakDays = 0, icon, showLogo = false }) => {
  return (
    <header className="bg-gradient-to-r from-[#001cab] to-[#0029ff] text-white p-4 sm:p-6 rounded-b-3xl mb-4 sm:mb-6">
      <div className="flex justify-between items-start">
        {showLogo && (
          <div className="flex-shrink-0 mr-5">
            <LogoIcon size="medium" />
          </div>
        )}
        <div className="flex-1 min-w-0 flex items-start gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{title}</h1>
            {subtitle && <p className="text-white mt-1 text-sm sm:text-base opacity-90 line-clamp-2">{subtitle}</p>}
          </div>
        </div>
        {showStreak && (
          <div className="bg-white/20 px-2 sm:px-3 py-1 rounded-full border border-[#28b0ff] ml-3 flex-shrink-0">
            <div className="flex items-center space-x-1">
              <span className="text-sm sm:text-lg">🔥</span>
              <span className="text-xs sm:text-sm font-semibold text-white">{streakDays}</span>
              <span className="text-xs text-white opacity-90 hidden sm:inline">dias</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;