import React, { useRef, useEffect, useState } from 'react';
import CarRacingGame from '@/lib/CarRacingGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Coins, X } from 'lucide-react';

interface CanvasRacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const CanvasRacingGame: React.FC<CanvasRacingGameProps> = ({ onGameEnd, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameInstance = useRef<CarRacingGame | null>(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleGameOver = (finalScore: number, finalCoins: number) => {
      setGameOver(true);
      onGameEnd(finalScore, finalCoins);
    };

    const handleScoreUpdate = (currentScore: number, currentCoins: number) => {
      setScore(currentScore);
      setCoins(currentCoins);
    };

    gameInstance.current = new CarRacingGame(canvas, handleGameOver, handleScoreUpdate);

    return () => {
      if (gameInstance.current) {
        gameInstance.current.destroy();
      }
    };
  }, [onGameEnd]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && gameOver) {
        gameInstance.current?.resetGame();
        setGameOver(false);
        setScore(0);
        setCoins(0);
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            🏎️ Corrida Educativa
          </CardTitle>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* HUD do Jogo */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-md">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">{score}</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-md">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">{coins}</span>
              </div>
            </div>
          </div>

          {/* Canvas do Jogo */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full max-w-4xl border-2 border-gray-300 rounded-lg bg-gray-900 cursor-pointer"
              style={{ aspectRatio: '4/3' }}
            />
            
            {/* Loading indicator */}
            {!gameInstance.current && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-lg">
                <div className="text-center text-white space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="text-sm">Carregando carros...</p>
                </div>
              </div>
            )}
          </div>

          {/* Instruções */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Como Jogar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Controles:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd> Mover para esquerda</li>
                    <li>• <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> Mover para direita</li>
                    <li>• <kbd className="px-2 py-1 bg-muted rounded text-xs">ESPAÇO</kbd> Reiniciar (após game over)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Objetivo:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Desvie dos carros inimigos</li>
                    <li>• Colete moedas douradas (+5 pontos)</li>
                    <li>• Pegue power-ups verdes (+20 pontos)</li>
                    <li>• Sobreviva o máximo possível!</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default CanvasRacingGame;