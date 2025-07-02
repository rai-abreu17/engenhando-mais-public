import React, { useEffect } from 'react';
import { useGameState } from './racing/useGameState';
import { LANES, GAME_CONFIG } from './racing/constants';
import PlayerCar from './racing/PlayerCar';
import OpponentCars from './racing/OpponentCars';
import QuestionOverlay from './racing/QuestionOverlay';
import GameHeader from './racing/GameHeader';
import GameControls from './racing/GameControls';
import GameEndScreen from './racing/GameEndScreen';

interface RacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ onGameEnd, onClose }) => {
  const {
    gameState,
    carPosition,
    currentLane,
    setCurrentLane,
    speed,
    distance,
    score,
    timeLeft,
    setTimeLeft,
    currentQuestion,
    questionTimeLeft,
    setQuestionTimeLeft,
    boost,
    carRotation,
    setCarRotation,
    gameStarted,
    setGameStarted,
    protectionTime,
    setProtectionTime,
    opponentCars,
    setOpponentCars,
    roadOffset,
    gameLoopRef,
    activateBoost,
    handleAnswer,
    triggerQuestion,
    gameLoop,
    getCoinsReward,
    getGameOverReason
  } = useGameState(onGameEnd);

  // Inicialização simplificada
  useEffect(() => {
    console.log('🎮 INIT: Inicializando jogo');
    
    // Criar carros iniciais para teste
    const testCars = [
      {
        id: Date.now() + 1,
        lane: 0,
        position: 80,
        speed: 2,
        color: '#dc2626'
      },
      {
        id: Date.now() + 2,
        lane: 2,
        position: 120,
        speed: 1.5,
        color: '#2563eb'
      }
    ];
    
    setOpponentCars(testCars);
    console.log('🚙 INIT: Carros de teste criados:', testCars);
    
    const protectionTimer = setInterval(() => {
      setProtectionTime(prev => {
        if (prev <= 1) {
          setGameStarted(true);
          clearInterval(protectionTimer);
          console.log('✅ INIT: Jogo ativo');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(protectionTimer);
  }, [setOpponentCars, setProtectionTime, setGameStarted]);

  // Update car position when changing lanes
  useEffect(() => {
    if (currentLane === 0) {
      setCarRotation(-8);
      setTimeout(() => setCarRotation(0), 150);
    } else if (currentLane === 2) {
      setCarRotation(8);
      setTimeout(() => setCarRotation(0), 150);
    }
  }, [currentLane, setCarRotation]);

  // Main game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Game end logic handled in useGameState
    }
  }, [timeLeft, gameState, setTimeLeft]);

  // Question timer
  useEffect(() => {
    if (gameState === 'question' && questionTimeLeft > 0) {
      const timer = setTimeout(() => setQuestionTimeLeft(questionTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questionTimeLeft === 0 && gameState === 'question') {
      handleAnswer(-1);
    }
  }, [questionTimeLeft, gameState, handleAnswer, setQuestionTimeLeft]);

  // Trigger questions
  useEffect(() => {
    if (gameState === 'playing' && distance > 0 && distance % 400 === 0) {
      triggerQuestion();
    }
  }, [distance, gameState, triggerQuestion]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (currentLane > 0) {
            setCurrentLane(prev => prev - 1);
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (currentLane < 2) {
            setCurrentLane(prev => prev + 1);
          }
          break;
        case ' ':
        case 'w':
        case 'W':
          e.preventDefault();
          activateBoost();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentLane, boost, setCurrentLane, activateBoost]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'finished') {      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState]);

  const handleLaneChange = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentLane > 0) {
      setCurrentLane(prev => prev - 1);
      console.log(`🏁 Mudando para pista ${currentLane}`);
    } else if (direction === 'right' && currentLane < 2) {
      setCurrentLane(prev => prev + 1);
      console.log(`🏁 Mudando para pista ${currentLane + 2}`);
    }
  };

  if (gameState === 'finished') {
    const coinsEarned = getCoinsReward();
    const gameOverReason = getGameOverReason();
    
    return (
      <GameEndScreen
        gameOverReason={gameOverReason}
        distance={distance}
        score={score}
        coinsEarned={coinsEarned}
        onClose={onClose}
        onGameEnd={onGameEnd}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-400 to-green-600 z-50 overflow-hidden">
      {/* Tela de proteção */}
      {protectionTime > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="text-white text-6xl font-bold animate-pulse text-center">
            <div className="text-yellow-400 mb-4">🛡️ PROTEÇÃO</div>
            <div>{protectionTime}</div>
            <div className="text-2xl mt-4">Prepare-se!</div>
          </div>
        </div>
      )}

      {/* Overlay de pergunta */}
      {gameState === 'question' && currentQuestion && (
        <QuestionOverlay
          question={currentQuestion}
          questionTimeLeft={questionTimeLeft}
          onAnswer={handleAnswer}
        />
      )}

      <GameHeader
        timeLeft={timeLeft}
        distance={distance}
        score={score}
        onClose={onClose}
      />

      {/* Debug info melhorado */}
      <div className="absolute top-20 right-4 bg-black bg-opacity-95 text-white p-4 rounded-lg text-sm z-40 max-w-sm border-2 border-yellow-400">
        <div className="font-bold text-yellow-300 mb-2 text-center">🔧 DEBUG STATUS</div>
        <div className="space-y-1">
          <div>Estado: <span className="text-green-300 font-bold">{!gameStarted ? 'PROTEÇÃO' : 'ATIVO'}</span></div>
          <div>Total de carros: <span className="text-blue-300 font-bold">{opponentCars.length}</span></div>
          <div>Player pista: <span className="text-purple-300 font-bold">{currentLane + 1}</span></div>
          <div>Velocidade: <span className="text-red-300 font-bold">{speed.toFixed(1)}</span></div>
          {protectionTime > 0 && (
            <div className="text-yellow-200 font-bold">Proteção: {protectionTime}s</div>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-600">
          <div className="text-yellow-200 font-bold mb-1">🚗 Carros visíveis:</div>
          {opponentCars.length === 0 ? (
            <div className="text-red-400 font-bold">❌ NENHUM CARRO!</div>
          ) : (
            <div className="space-y-1">
              {opponentCars.map(car => (
                <div key={car.id} className="flex justify-between items-center text-xs bg-gray-700 px-2 py-1 rounded">
                  <span className="font-bold">#{car.id.toString().slice(-3)}</span>
                  <span>P{car.lane + 1}</span>
                  <span>{car.position.toFixed(0)}%</span>
                  <div 
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: car.color }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pista de corrida */}
      <div className="relative h-full bg-gray-800 overflow-hidden">
        {/* Road with movement effect */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 w-20 h-full bg-green-500"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-green-500"></div>
          
          <div className="absolute left-20 right-20 top-0 h-full bg-gray-700">
            <div 
              className="absolute w-full h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, 
                  #fbbf24 0px, 
                  #fbbf24 20px, 
                  transparent 20px, 
                  transparent 40px)`,
                transform: `translateY(${roadOffset % 40}px)`,
              }}
            >
              <div className="absolute left-1/3 w-1 h-full bg-white opacity-60"></div>
              <div className="absolute left-2/3 w-1 h-full bg-white opacity-60"></div>
            </div>
            
            <div className="absolute left-0 w-2 h-full bg-white"></div>
            <div className="absolute right-0 w-2 h-full bg-white"></div>
          </div>
        </div>

        {/* Lane markers */}
        {LANES.map((lane, index) => (
          <div 
            key={index}
            className="absolute top-4 text-white font-bold text-sm z-5"
            style={{ 
              left: `${lane}%`,
              transform: 'translateX(-50%)'
            }}
          >
            Pista {index + 1}
          </div>
        ))}

        {/* Carros - ordem importante! */}
        <PlayerCar
          currentLane={currentLane}
          carRotation={carRotation}
          protectionTime={protectionTime}
          boost={boost}
        />

        {/* CARROS ADVERSÁRIOS - z-index alto para garantir visibilidade */}
        <div className="relative z-30">
          <OpponentCars opponentCars={opponentCars} />
        </div>

        <GameControls
          currentLane={currentLane}
          boost={boost}
          onLaneChange={handleLaneChange}
          onBoost={activateBoost}
        />

        {/* Additional UI elements */}
        <div className="absolute top-16 left-4 bg-black bg-opacity-60 text-white p-3 rounded-lg z-10">
          <div className="text-sm font-bold mb-2">🎮 CONTROLES:</div>
          <div className="text-xs space-y-1">
            <div>← → ou A/D: Trocar pista</div>
            <div>ESPAÇO: Turbo</div>
          </div>
        </div>

        <div className="absolute right-6 top-20 w-24 h-24 rounded-full bg-gray-900 border-4 border-white flex flex-col justify-center items-center shadow-lg z-10">
          <div className="text-xs text-gray-300">VEL</div>
          <div className="text-2xl font-bold text-white">{Math.floor(speed * 40)}</div>
          <div className="text-xs text-gray-300">km/h</div>
        </div>

        {boost && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-35">
            <div className="text-yellow-400 text-4xl font-bold animate-pulse">
              ⚡ TURBO ATIVO! ⚡
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RacingGame;
