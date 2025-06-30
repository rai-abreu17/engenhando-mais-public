
import React from 'react';
import { Zap } from 'lucide-react';

interface GameControlsProps {
  currentLane: number;
  boost: boolean;
  onLaneChange: (direction: 'left' | 'right') => void;
  onBoost: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  currentLane, 
  boost, 
  onLaneChange, 
  onBoost 
}) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 px-4 z-20">
      <button
        className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex justify-center items-center shadow-lg active:bg-blue-700"
        onClick={() => onLaneChange('left')}
        disabled={currentLane === 0}
        style={{ opacity: currentLane === 0 ? '0.5' : '1' }}
      >
        ←
      </button>
      
      <button
        className="w-20 h-20 rounded-full text-white text-lg font-bold flex flex-col justify-center items-center shadow-lg"
        onClick={onBoost}
        disabled={boost}
        style={{
          background: boost 
            ? 'radial-gradient(circle, #ef4444 0%, #b91c1c 100%)' 
            : 'radial-gradient(circle, #3b82f6 0%, #1d4ed8 100%)',
          opacity: boost ? '0.7' : '1'
        }}
      >
        <span>TURBO</span>
        <Zap size={20} />
      </button>
      
      <button
        className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex justify-center items-center shadow-lg active:bg-blue-700"
        onClick={() => onLaneChange('right')}
        disabled={currentLane === 2}
        style={{ opacity: currentLane === 2 ? '0.5' : '1' }}
      >
        →
      </button>
    </div>
  );
};

export default GameControls;
