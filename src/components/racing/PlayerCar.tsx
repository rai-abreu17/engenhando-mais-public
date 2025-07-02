
import React from 'react';
import { LANES } from './constants';

interface PlayerCarProps {
  currentLane: number;
  carRotation: number;
  protectionTime: number;
  boost: boolean;
}

const PlayerCar: React.FC<PlayerCarProps> = ({ 
  currentLane, 
  carRotation, 
  protectionTime, 
  boost 
}) => {
  return (
    <div 
      className="absolute transition-all duration-200 ease-out z-15"
      style={{
        left: `${LANES[currentLane]}%`,
        bottom: '15%',
        transform: `translateX(-50%) rotate(${carRotation}deg)`,
        width: '60px',
        height: '100px'
      }}
    >
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-black opacity-40 rounded-full"
        style={{ filter: 'blur(3px)' }}
      />
      
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-red-600 rounded-lg shadow-lg"
             style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)' }}>
          <div className="absolute left-1/4 right-1/4 top-2 h-6 bg-blue-200 rounded-t opacity-80" />
          <div className="absolute left-2 top-1 w-3 h-2 bg-yellow-300 rounded-sm" />
          <div className="absolute right-2 top-1 w-3 h-2 bg-yellow-300 rounded-sm" />
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-white opacity-60" />
        </div>
      </div>
      
      {protectionTime > 0 && (
        <div className="absolute inset-0 rounded-lg border-4 border-yellow-400 animate-pulse"
             style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.8)' }}
        />
      )}
      
      {boost && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-12"
             style={{
               background: 'linear-gradient(to top, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.9))',
               filter: 'blur(2px)',
               zIndex: -1,
               animation: 'pulse 0.3s infinite'
             }}
        />
      )}
    </div>
  );
};

export default PlayerCar;
