
import React from 'react';
import RetroRacingGame from './RetroRacingGame';

interface RacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ onGameEnd, onClose }) => {
  const handleGameEnd = () => {
    // Valor padrão de pontuação e moedas ao finalizar o jogo retrô
    const defaultScore = Math.floor(Math.random() * 500) + 100;
    const defaultCoins = Math.floor(Math.random() * 20) + 5;
    onGameEnd(defaultScore, defaultCoins);
  };

  return <RetroRacingGame onClose={() => {
    handleGameEnd();
    onClose();
  }} />;
};

export default RacingGame;
