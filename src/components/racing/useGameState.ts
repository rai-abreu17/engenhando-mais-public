
import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, EndGameReason, Question, OpponentCar } from './types';
import { GAME_CONFIG, LANES } from './constants';
import { getRandomQuestion, createOpponentCar, calculateCoinsReward, getGameOverReason } from './utils';

export const useGameState = (onGameEnd: (score: number, coins: number) => void) => {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [endGameReason, setEndGameReason] = useState<EndGameReason>(null);
  const [carPosition, setCarPosition] = useState(50);
  const [currentLane, setCurrentLane] = useState(1);
  const [speed, setSpeed] = useState(GAME_CONFIG.INITIAL_SPEED);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.INITIAL_TIME);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(GAME_CONFIG.QUESTION_TIME);
  const [boost, setBoost] = useState(false);
  const [carRotation, setCarRotation] = useState(0);
  const [consecutiveWrongAnswers, setConsecutiveWrongAnswers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [protectionTime, setProtectionTime] = useState(GAME_CONFIG.PROTECTION_TIME);
  const [opponentCars, setOpponentCars] = useState<OpponentCar[]>([]);
  const [roadOffset, setRoadOffset] = useState(0);

  const gameLoopRef = useRef<number>();

  const activateBoost = useCallback(() => {
    if (!boost) {
      console.log('🚀 Turbo ativado!');
      setBoost(true);
      setSpeed(prev => prev * GAME_CONFIG.BOOST_MULTIPLIER);
      setTimeout(() => {
        setBoost(false);
        setSpeed(prev => prev / GAME_CONFIG.BOOST_MULTIPLIER);
        console.log('🚀 Turbo desativado');
      }, GAME_CONFIG.BOOST_DURATION);
    }
  }, [boost]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correct) {
      console.log('✅ Resposta correta!');
      setSpeed(prev => Math.min(prev + 0.5, GAME_CONFIG.MAX_SPEED));
      activateBoost();
      setScore(prev => prev + 150);
      setConsecutiveWrongAnswers(0);
    } else {
      console.log('❌ Resposta incorreta');
      setConsecutiveWrongAnswers(prev => prev + 1);
      
      if (consecutiveWrongAnswers + 1 >= GAME_CONFIG.MAX_CONSECUTIVE_WRONG) {
        setEndGameReason('questions');
        setGameState('finished');
        return;
      }
      
      setSpeed(prev => Math.max(prev - 0.3, GAME_CONFIG.MIN_SPEED));
    }
    
    setGameState('playing');
    setCurrentQuestion(null);
  }, [currentQuestion, consecutiveWrongAnswers, activateBoost]);

  const triggerQuestion = useCallback(() => {
    const randomQuestion = getRandomQuestion();
    setCurrentQuestion(randomQuestion);
    setQuestionTimeLeft(GAME_CONFIG.QUESTION_TIME);
    setGameState('question');
    console.log('❓ Pergunta acionada:', randomQuestion.question);
  }, []);

  const spawnOpponentCar = useCallback(() => {
    setOpponentCars(prevCars => {
      if (prevCars.length >= GAME_CONFIG.MAX_OPPONENT_CARS) {
        return prevCars;
      }

      const randomLane = Math.floor(Math.random() * 3);
      const hasNearCar = prevCars.some(car => 
        car.lane === randomLane && car.position > 120
      );

      if (!hasNearCar) {
        const newCar = createOpponentCar(randomLane);
        console.log('🚙 SPAWN: Novo carro criado', {
          id: newCar.id,
          lane: newCar.lane + 1,
          position: newCar.position,
          color: newCar.color
        });
        return [...prevCars, newCar];
      }

      return prevCars;
    });
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState === 'playing' && gameStarted) {
      setDistance(prev => prev + speed);
      setScore(prev => prev + Math.floor(speed * 3));
      setRoadOffset(prev => (prev + speed * 3) % 100);
      
      // Spawn mais frequente para teste
      if (Math.random() < 0.08) {
        spawnOpponentCar();
      }
    }

    // Atualizar posições dos carros
    setOpponentCars(prevCars => {
      const updatedCars = prevCars
        .map(car => ({
          ...car,
          position: car.position - (car.speed + speed * 0.5),
        }))
        .filter(car => {
          if (car.position <= -50) {
            console.log(`🗑️ Carro ${car.id} removido (posição: ${car.position.toFixed(1)})`);
            return false;
          }
          return true;
        });

      // Log do estado atual
      if (updatedCars.length > 0) {
        console.log('🎯 CARROS ATIVOS:', updatedCars.map(car => ({
          id: car.id.toString().slice(-4),
          lane: car.lane + 1,
          pos: car.position.toFixed(1)
        })));
      }

      // Detecção de colisão
      if (gameState === 'playing' && gameStarted && protectionTime === 0) {
        const collision = updatedCars.some(car => {
          const isColliding = car.lane === currentLane && 
            car.position >= 5 && 
            car.position <= 30;
          
          if (isColliding) {
            console.log(`💥 COLISÃO! Player lane: ${currentLane + 1}, Car lane: ${car.lane + 1}, Pos: ${car.position.toFixed(1)}`);
          }
          
          return isColliding;
        });
        
        if (collision) {
          setGameState('finished');
          setEndGameReason('collision');
        }
      }

      return updatedCars;
    });

    if (gameState !== 'finished') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState, speed, currentLane, gameStarted, protectionTime, spawnOpponentCar]);

  return {
    gameState,
    endGameReason,
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
    consecutiveWrongAnswers,
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
    getCoinsReward: () => calculateCoinsReward(score, distance),
    getGameOverReason: () => getGameOverReason(consecutiveWrongAnswers, timeLeft)
  };
};
