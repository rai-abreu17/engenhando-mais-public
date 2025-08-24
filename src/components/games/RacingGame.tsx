
import React from 'react';
import CanvasRacingGame from './CanvasRacingGame';

interface RacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ onGameEnd, onClose }) => {
  return <CanvasRacingGame onGameEnd={onGameEnd} onClose={onClose} />;
};

export default RacingGame;
