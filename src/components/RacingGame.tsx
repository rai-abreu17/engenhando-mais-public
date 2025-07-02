
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

  // Initialize game with protection
  useEffect(() => {
    console.log('🚗 Inicializando jogo com proteção...');
    
    // Força o spawn de carros iniciais para demonstração
    const safeCars = [
      {
        id: 1,
        lane: 0,
        position: 120,
        speed: 2.2,
        color: '#dc2626'
      },
      {
        id: 2,
        lane: 2,
        position: 150,
        speed: 1.8,
        color: '#2563eb'
      },
      {
        id: 3,
        lane: 1,
        position: 180,
        speed: 2.0,
        color: '#16a34a'
      }
    ];
    
    setOpponentCars(safeCars);
    console.log('🚙 Carros iniciais spawned:', safeCars.length);
    
    const protectionTimer = setInterval(() => {
      setProtectionTime(prev => {
        if (prev <= 1) {
          setGameStarted(true);
          clearInterval(protectionTimer);
          console.log('✅ Proteção inicial finalizada - jogo ativo');
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
    } else if (direction === 'right' && currentLane < 2) {
      setCurrentLane(prev => prev + 1);
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
      {/* Protection screen */}
      {protectionTime > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="text-white text-6xl font-bold animate-pulse text-center">
            <div className="text-yellow-400 mb-4">🛡️ PROTEÇÃO ATIVA</div>
            <div>{protectionTime}</div>
            <div className="text-2xl mt-4">Prepare-se para correr!</div>
          </div>
        </div>
      )}

      {/* Question overlay */}
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

      {/* Debug info */}
      <div className="absolute top-20 right-4 bg-black bg-opacity-90 text-white p-3 rounded text-sm z-30">
        <div className="font-bold text-yellow-300 mb-1">🔧 DEBUG PANEL</div>
        <div>Status: <span className="text-green-300">{!gameStarted ? 'PROTEÇÃO' : 'ATIVO'}</span></div>
        <div>Carros: <span className="text-blue-300">{opponentCars.length}</span></div>
        <div>Pista: <span className="text-purple-300">{currentLane + 1}</span></div>
        <div>Velocidade: <span className="text-red-300">{speed.toFixed(1)}</span></div>
        {protectionTime > 0 && (
          <div className="text-yellow-200">Proteção: {protectionTime}s</div>
        )}
        {opponentCars.length > 0 && (
          <div className="mt-2 text-xs">
            <div className="text-yellow-200">Carros visíveis:</div>
            {opponentCars
              .filter(car => car.position >= -20 && car.position <= 150)
              .slice(0, 3)
              .map(car => (
                <div key={car.id} className="text-gray-300">
                  P{car.lane + 1}: {car.position.toFixed(0)}% 
                  <span className="text-xs ml-1" style={{color: car.color}}>●</span>
                </div>
              ))
            }
            {opponentCars.filter(car => car.position >= -20 && car.position <= 150).length === 0 && (
              <div className="text-red-300">Nenhum carro visível!</div>
            )}
          </div>
        )}
      </div>

      {/* Race track */}
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
            className="absolute top-4 text-white font-bold text-sm z-15"
            style={{ 
              left: `${lane}%`,
              transform: 'translateX(-50%)'
            }}
          >
            Pista {index + 1}
          </div>
        ))}

        {/* Player car - z-index mais baixo para não cobrir oponentes */}
        <PlayerCar
          currentLane={currentLane}
          carRotation={carRotation}
          protectionTime={protectionTime}
          boost={boost}
        />

        {/* Opponent cars - z-index mais alto para garantir visibilidade */}
        <div className="relative z-20">
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
          <div className="text-sm font-bold mb-2">🧪 CONTROLES DE TESTE:</div>
          <div className="text-xs space-y-1">
            <div>← → ou A/D: Trocar pista</div>
            <div>ESPAÇO: Turbo</div>
            <button 
              onClick={() => {
                const testCar = {
                  id: Date.now(),
                  lane: Math.floor(Math.random() * 3),
                  position: 100,
                  speed: 2,
                  color: '#dc2626'
                };
                setOpponentCars(prev => [...prev, testCar]);
                console.log('🧪 Carro de teste spawned:', testCar);
              }}
              className="block mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
            >
              Spawn Carro Teste
            </button>
          </div>
        </div>

        <div className="absolute right-6 top-20 w-24 h-24 rounded-full bg-gray-900 border-4 border-white flex flex-col justify-center items-center shadow-lg z-10">
          <div className="text-xs text-gray-300">VEL</div>
          <div className="text-2xl font-bold text-white">{Math.floor(speed * 40)}</div>
          <div className="text-xs text-gray-300">km/h</div>
        </div>

        {boost && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
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
