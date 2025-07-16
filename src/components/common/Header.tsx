
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showStreak?: boolean;
  streakDays?: number;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showStreak = false, streakDays = 0 }) => {
  return (
    <header className="bg-gradient-to-r from-[#001cab] to-[#0029ff] text-white p-6 rounded-b-3xl mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-white mt-1">{subtitle}</p>}
        </div>
        {showStreak && (
          <div className="bg-white/20 px-3 py-1 rounded-full border border-[#28b0ff]">
            <div className="flex items-center space-x-1">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-semibold text-white">{streakDays}</span>
              <span className="text-xs text-white opacity-90">dias</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
