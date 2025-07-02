
import React, { useState } from 'react';
import { Play, Trophy, Gamepad2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navigation from '../components/Navigation';
import RacingGame from '../components/RacingGame';

const MascoteNovo = () => {
  const [showRacingGame, setShowRacingGame] = useState(false);
  const [gameStats, setGameStats] = useState({ totalScore: 0, totalCoins: 0 });

  const handleGameEnd = (score: number, coins: number) => {
    setGameStats(prev => ({
      totalScore: prev.totalScore + score,
      totalCoins: prev.totalCoins + coins
    }));
    setShowRacingGame(false);
    console.log(`🎮 Jogo finalizado! Score: ${score}, Moedas: ${coins}`);
  };

  const handleCloseGame = () => {
    setShowRacingGame(false);
    console.log("🚪 Jogo fechado pelo usuário");
  };

  if (showRacingGame) {
    return (
      <RacingGame 
        onGameEnd={handleGameEnd}
        onClose={handleCloseGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Centro de Jogos</h1>
          <p className="text-gray-600">Teste o jogo de corrida educativo</p>
        </div>

        {/* Game Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="mr-2 text-yellow-500" />
            Suas Estatísticas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{gameStats.totalScore}</div>
              <div className="text-sm text-gray-600">Pontos Totais</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">🪙 {gameStats.totalCoins}</div>
              <div className="text-sm text-gray-600">Moedas Ganhas</div>
            </div>
          </div>
        </div>

        {/* Game Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">🏎️ Jogo de Corrida Educativo</h3>
          <div className="space-y-2 text-gray-700">
            <p>• Responda perguntas de Matemática e Física para acelerar</p>
            <p>• Desvie dos carros adversários mudando de pista</p>
            <p>• Use o turbo para ganhar velocidade extra</p>
            <p>• Sobreviva o máximo de tempo possível</p>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Controles:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>← → ou A/D: Trocar de pista</div>
              <div>ESPAÇO ou W: Ativar turbo</div>
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          <Button 
            onClick={() => {
              console.log("🚀 Iniciando teste de funcionalidade do jogo...");
              setShowRacingGame(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <Gamepad2 className="mr-2" size={24} />
            🎮 TESTAR JOGO DE CORRIDA
          </Button>
          
          <p className="text-sm text-gray-500 mt-3">
            Clique para iniciar o teste de funcionalidade completo
          </p>
        </div>

        {/* Test Instructions */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">📋 Roteiro de Teste:</h4>
          <div className="text-sm text-green-700 space-y-1">
            <div>1. ✅ Inicie o jogo e observe a proteção inicial de 3 segundos</div>
            <div>2. ✅ Teste a movimentação entre pistas (← →)</div>
            <div>3. ✅ Ative o turbo (ESPAÇO) e veja o efeito visual</div>
            <div>4. ✅ Responda uma pergunta quando aparecer</div>
            <div>5. ✅ Observe os carros adversários se movimentando</div>
            <div>6. ✅ Teste a detecção de colisão (deixe colidir propositalmente)</div>
            <div>7. ✅ Verifique a tela de fim de jogo e recompensas</div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default MascoteNovo;
