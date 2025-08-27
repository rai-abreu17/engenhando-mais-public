
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
      setBoost(true);
      setSpeed(prev => prev * GAME_CONFIG.BOOST_MULTIPLIER);
      setTimeout(() => {
        setBoost(false);
        setSpeed(prev => prev / GAME_CONFIG.BOOST_MULTIPLIER);
      }, GAME_CONFIG.BOOST_DURATION);
    }
  }, [boost]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correct) {
      setSpeed(prev => Math.min(prev + 0.5, GAME_CONFIG.MAX_SPEED));
      activateBoost();
      setScore(prev => prev + 150);
      setConsecutiveWrongAnswers(0);
    } else {
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
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState === 'playing' && gameStarted) {
      setDistance(prev => prev + speed);
      setScore(prev => prev + Math.floor(speed * 3));
      setRoadOffset(prev => (prev + speed * 3) % 100);
      
      // Spawn de novos carros com maior frequência e logs de debug
      if (Math.random() < GAME_CONFIG.SPAWN_CHANCE * 2) { // Doubled spawn chance for testing
        setOpponentCars(prevCars => {
          if (prevCars.length < GAME_CONFIG.MAX_OPPONENT_CARS) {
            const randomLane = Math.floor(Math.random() * 3);
            const hasNearCar = prevCars.some(car => 
              car.lane === randomLane && car.position > 120
            );
            
            if (!hasNearCar) {
              const newCar = createOpponentCar(randomLane);
              console.log('🚙 Novo carro spawned:', {
                id: newCar.id,
                lane: newCar.lane + 1,
                position: newCar.position,
                color: newCar.color,
                speed: newCar.speed.toFixed(2)
              });
              return [...prevCars, newCar];
            } else {
              console.log('⚠️ Spawn bloqueado - carro próximo na lane', randomLane + 1);
            }
          } else {
            console.log('⚠️ Spawn bloqueado - máximo de carros atingido:', prevCars.length);
          }
          return prevCars;
        });
      }
    }

    // Atualizar posições dos carros e verificar colisões
    setOpponentCars(prevCars => {
      const updatedCars = prevCars
        .map(car => ({
          ...car,
          position: car.position - (car.speed + speed * 0.3),
        }))
        .filter(car => {
          const shouldKeep = car.position > -30;
          if (!shouldKeep) {
            console.log('🗑️ Removendo carro que saiu da tela:', car.id);
          }
          return shouldKeep;
        });

      // Verificar colisões apenas quando o jogo está ativo
      if (gameState === 'playing' && gameStarted && protectionTime === 0) {
        const collision = updatedCars.find(car => 
          car.lane === currentLane && 
          car.position >= GAME_CONFIG.COLLISION_RANGE_MIN && 
          car.position <= GAME_CONFIG.COLLISION_RANGE_MAX
        );
        
  if (collision) {
          console.log('💥 Colisão detectada!', {
            carId: collision.id,
            playerLane: currentLane + 1,
            carLane: collision.lane + 1,
            carPosition: collision.position.toFixed(1),
            collisionRange: `${GAME_CONFIG.COLLISION_RANGE_MIN}-${GAME_CONFIG.COLLISION_RANGE_MAX}`
          });
          
          // Encerrar o jogo imediatamente para acionar a tela de Game Over no componente pai
          try {
            if (gameLoopRef.current) {
              cancelAnimationFrame(gameLoopRef.current);
            }
          } catch (e) {
            console.warn('⚠️ Falha ao cancelar animation frame', e);
          }
          setGameState('finished');
          setEndGameReason('collision');
          setGameStarted(false);
          // Notifica o componente pai (CanvasRacingGame) para tratar o Game Over
          try {
            onGameEnd(score, calculateCoinsReward(score, distance));
          } catch (e) {
            console.warn('⚠️ onGameEnd lançou erro:', e);
          }

          // Mostrar a mensagem de colisão (visível antes do overlay)
          const collisionMessage = document.createElement('div');
          collisionMessage.className = 'fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xl md:text-3xl font-bold py-4 px-8 rounded-xl collision-message shadow-xl border-4 border-white';
          collisionMessage.textContent = '💥 BATIDA! 💥';
          // Garantir que a mensagem fique acima do canvas do jogo (que usa z-index alto)
          collisionMessage.style.zIndex = '10002';
          collisionMessage.style.pointerEvents = 'none';
          document.body.appendChild(collisionMessage);

          // Efeito sonoro (opcional)
          try {
            const audio = new Audio();
            audio.volume = 0.7;
            audio.src = "data:audio/wav;base64,UklGRnQHAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8HAACA/4r/oP+y/8b/0v/X/+P/6v/r/+v/5//X/8z/vP+r/53/i/97/2z/Yf9Z/1X/Vf9a/2L/bf97/5H/qf/E/97/+/8ZAC8APgBKAFQAWgBhAGEAWgBVAE0AQgA4AC0AHgALAPv/6//a/8j/vP+y/6j/nv+W/5T/lP+W/5z/p/+y/7//y//Y/+j/9/8IABYAIgAxAD0ASABRAFgAYABgAGIAYABcAFkAUQBMAEUAPAA0ACwAIQAYAAoAAQDz/+v/4P/a/9L/zf/K/8n/yP/K/8r/0P/U/9r/4P/n/+7/9v/8/wQACgAOABIAFgAZAB0AHgAhACEAIQAgAB4AHAAYABUAFAAOAA0ACgAFAAQAAgD//wEA/v/+//z//P/8//v//P/8//7///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA/v/+//3//f/9//3//f/9//3//f/9//3//f/9//3//f/+//7//v/+//7//v8AAP//AAAAAAAAAAAAAAAAAAAAAAAA///6//X/8f/q/+X/4//e/9v/2P/T/9P/0v/Q/8//zv/N/83/zP/N/8z/zf/M/87/zv/Q/9D/0f/S/9P/1v/X/9n/2f/b/97/3//h/+H/4//k/+X/5v/o/+j/6f/r/+z/7P/s/+7/7//w//H/8f/y//T/9P/2//f/9//4//r/+//9//3//v8AAP//AAD///3//P/+//v/+v/7//r/+P/2//X/8//y//D/7//u/+3/7P/q/+r/6P/o/+f/5v/l/+X/5P/k/+P/4//j/+P/4//k/+T/5P/j/+T/5P/l/+X/5v/n/+j/6f/q/+r/6//s/+3/7v/v//D/8P/y//P/9P/1//f/+P/5//n/+//8//z//v/+/wAAAAAAAAAAAAD/////AAD///7//f/9//z/+v/6//j/+P/1//X/8//z//H/8f/w/+7/7f/s/+r/6f/o/+f/5v/l/+X/5P/j/+P/4v/i/+L/4v/j/+T/5f/l/+b/5//o/+r/6//t/+3/7//x//L/9P/1//f/+f/7//z//f////7/AAAAAAAAAAAAAP///v/+//7//f/8//v/+v/5//j/9v/1//T/8//y//H/7//v/+7/7f/s/+v/6v/p/+n/6f/o/+j/6P/o/+j/6f/p/+r/6v/r/+z/7f/u/+//7//w//L/8//0//X/9v/3//j/+f/6//v//P/9//3//v/+/wAAAAAAAAAAAAAAAAEAAgABAAIAAwACAAMAAwADAAMAAwADAAMAAwADAAMAAgACAAIAAQABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v/9//z/+//6//n/+P/3//b/9f/1//T/9P/z//L/8v/y//H/8f/x//H/8f/x//L/8v/z//P/9P/1//b/9v/3//j/+f/6//v//P/9//7//v8AAAEAAAADAAQABAAGAAQABQAGAAUABQAFAAUABQAFAAQABQAEAAQABAADAAQABAADAAMABAADAAQABAADAAMABAADAAQABAAEAAQABQAFAAUABQAGAAYABQAGAAYABQAGAAUABQAFAAQABQAEAAQABAADAAQABAADAAQABAAAAAAAAAAAAAAAAAAA//8AAP///v/+//3//P/8//v/+v/6//n/+P/4//j/+P/3//f/+P/3//j/+P/4//n/+v/6//v//P/9//3//v/+//7//v8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////AAD+//7//f/9//3//f/9//z//P/8//z//P/8//z//P/8//z//P/8//z//f/9//3//v/+//7//v8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
            audio.play();
          } catch (e) {
            console.warn('⚠️ Não foi possível reproduzir som de colisão', e);
          }
          
          // Remover a mensagem após alguns segundos (sem alterar o estado do jogo novamente)
          setTimeout(() => {
            if (document.body.contains(collisionMessage)) {
              document.body.removeChild(collisionMessage);
            }
          }, 1500);
        }
      }

      return updatedCars;
    });

    if (gameState !== 'finished') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState, speed, currentLane, gameStarted, protectionTime]);

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
