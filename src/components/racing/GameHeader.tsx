
import React from 'react';
import { X, Clock } from 'lucide-react';

interface GameHeaderProps {
  timeLeft: number;
  distance: number;
  score: number;
  onClose: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  timeLeft, 
  distance, 
  score, 
  onClose 
}) => {
  return (
    <div className="flex justify-between items-center p-4 text-white relative z-10">
      <button
        onClick={onClose}
        className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30"
      >
        <X size={20} />
      </button>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Clock size={16} />
          <span className="font-bold">{timeLeft}s</span>
        </div>
        <div className="font-bold">Distância: {distance.toFixed(0)}m</div>
        <div className="font-bold">Pontos: {score}</div>
      </div>
    </div>
  );
};

export default GameHeader;
