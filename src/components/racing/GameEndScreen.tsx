
import React from 'react';
import { Trophy } from 'lucide-react';

interface GameEndScreenProps {
  gameOverReason: string;
  distance: number;
  score: number;
  coinsEarned: number;
  onClose: () => void;
  onGameEnd: (score: number, coins: number) => void;
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({
  gameOverReason,
  distance,
  score,
  coinsEarned,
  onClose,
  onGameEnd
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 mx-4 max-w-md w-full">
        <div className="text-center">
          <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Corrida Finalizada!
          </h2>
          
          <div className="text-red-600 mb-3">
            {gameOverReason}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Distância:</span>
              <span className="font-bold text-gray-800">{distance.toFixed(0)}m</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Pontuação:</span>
              <span className="font-bold text-gray-800">{score} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Moedas ganhas:</span>
              <span className="font-bold text-yellow-600">🪙 {coinsEarned}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium"
            >
              Fechar
            </button>
            <button
              onClick={() => onGameEnd(score, coinsEarned)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
            >
              Coletar Recompensa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEndScreen;
