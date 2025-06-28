
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showCoins?: boolean;
  coins?: number;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showCoins = false, coins = 0 }) => {
  return (
    <header className="bg-engenha-gradient text-white p-6 rounded-b-3xl mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-engenha-text-light">{title}</h1>
          {subtitle && <p className="text-engenha-text-light mt-1">{subtitle}</p>}
        </div>
        {showCoins && (
          <div className="bg-white/20 px-3 py-1 rounded-full border border-engenha-border">
            <div className="flex items-center space-x-1">
              <span className="text-lg">🪙</span>
              <span className="text-sm font-semibold text-engenha-text-light">{coins}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
