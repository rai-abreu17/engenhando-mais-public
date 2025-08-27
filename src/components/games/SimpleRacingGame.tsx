import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Clock, Zap } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Car {
  id: number;
  lane: number;
  position: number;
  color: string;
}

const QUESTIONS: Question[] = [
  {
    question: "Qual é 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1
  },
  {
    question: "Qual é a capital do Brasil?",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    correct: 2
  },
  {
    question: "Quanto é 5 x 3?",
    options: ["12", "15", "18", "20"],
    correct: 1
  }
];

const LANE_POSITIONS = [25, 50, 75]; // Posições das pistas em %
const CAR_COLORS = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed'];

interface SimpleRacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const SimpleRacingGame: React.FC<SimpleRacingGameProps> = ({ onGameEnd, onClose }) => {
  const [gameState, setGameState] = useState<'playing' | 'question' | 'collision_detected' | 'finished'>('playing');
  const [playerLane, setPlayerLane] = useState(1);
  const [cars, setCars] = useState<Car[]>([]);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(10);
  const [speed, setSpeed] = useState(3);
  const [boost, setBoost] = useState(false);

  const gameLoopRef = useRef<number>();
  const carIdRef = useRef(1);

  // Criar carro adversário
  const createCar = useCallback(() => {
    const lane = Math.floor(Math.random() * 3);
    const newCar: Car = {
      id: carIdRef.current++,
      lane,
      position: 110 + Math.random() * 20,
      color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
    };
    
    console.log('🚗 Criando carro:', newCar);
    return newCar;
  }, []);

  // Inicializar carros
  useEffect(() => {
    const initialCars = [
      createCar(),
      createCar(),
      createCar()
    ];
    setCars(initialCars);
    console.log('🚗 Carros iniciais:', initialCars);
  }, [createCar]);

  // Game loop principal
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    setDistance(prev => prev + speed);
    setScore(prev => prev + Math.floor(speed * 2));

    // Atualizar posição dos carros
    setCars(prevCars => {
      const updatedCars = prevCars.map(car => ({
        ...car,
        position: car.position - speed * 0.8
      })).filter(car => car.position > -30);

      // Adicionar novos carros
      if (Math.random() < 0.03 && updatedCars.length < 5) {
        updatedCars.push(createCar());
      }

      // Verificar colisões
      const collision = updatedCars.find(car => 
        car.lane === playerLane && 
        car.position >= 10 && 
        car.position <= 30
      );

      if (collision) {
        console.log('💥 Colisão!');
        setGameState('collision_detected');
        return updatedCars;
      }

      return updatedCars;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, speed, playerLane, createCar]);

  // Iniciar game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState]);

  // Timer do jogo
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
  }, [timeLeft, gameState]);

  // Perguntas
  useEffect(() => {
    if (gameState === 'playing' && distance > 0 && distance % 300 === 0) {
      const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
      setCurrentQuestion(question);
      setQuestionTimeLeft(10);
      setGameState('question');
    }
  }, [distance, gameState]);

  // Timer da pergunta
  useEffect(() => {
    if (gameState === 'question' && questionTimeLeft > 0) {
      const timer = setTimeout(() => setQuestionTimeLeft(questionTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questionTimeLeft === 0 && gameState === 'question') {
      handleAnswer(-1);
    }
  }, [questionTimeLeft, gameState]);

  // Controles do teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'collision_detected') {
        // Qualquer tecla sai da tela de colisão
        e.preventDefault();
        setGameState('finished');
        return;
      }
      
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          if (playerLane > 0) setPlayerLane(prev => prev - 1);
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          if (playerLane < 2) setPlayerLane(prev => prev + 1);
          break;
        case ' ':
          e.preventDefault();
          activateBoost();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, playerLane]);

  const handleAnswer = (answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correct) {
      setScore(prev => prev + 100);
      setSpeed(prev => Math.min(prev + 0.5, 6));
      activateBoost();
    } else {
      setSpeed(prev => Math.max(prev - 0.3, 1.5));
    }
    
    setGameState('playing');
    setCurrentQuestion(null);
  };

  const activateBoost = () => {
    if (!boost) {
      setBoost(true);
      setSpeed(prev => prev * 1.5);
      setTimeout(() => {
        setBoost(false);
        setSpeed(prev => prev / 1.5);
      }, 2000);
    }
  };

  const handleLaneChange = (direction: 'left' | 'right') => {
    if (direction === 'left' && playerLane > 0) {
      setPlayerLane(prev => prev - 1);
    } else if (direction === 'right' && playerLane < 2) {
      setPlayerLane(prev => prev + 1);
    }
  };

  // Tela de colisão
  if (gameState === 'collision_detected') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[10003]">
        <div className="text-center text-white space-y-4 max-w-md p-6 bg-red-900/80 rounded-xl border border-red-500/30 pointer-events-auto">
          <h2 className="text-4xl font-bold text-red-300 mb-4 animate-pulse">💥 BATIDA! 💥</h2>
          <p className="text-lg text-white">Você colidiu com outro carro!</p>
          <div className="bg-red-800/50 rounded-lg p-4 mb-4">
            <div className="text-sm text-red-200 mb-2">Resultado da corrida:</div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-red-200">Distância:</span>
              <span className="font-bold text-white">{distance.toFixed(0)}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-200">Pontuação:</span>
              <span className="font-bold text-white">{score} pts</span>
            </div>
          </div>
          <button 
            className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 rounded-lg font-bold text-white hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all"
            onClick={() => setGameState('finished')}
          >
            Continuar
          </button>
          <p className="text-sm text-red-200">Ou pressione qualquer tecla</p>
        </div>
      </div>
    );
  }

  // Tela de fim de jogo
  if (gameState === 'finished') {
    const coinsEarned = Math.floor(score / 50);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 mx-4 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Corrida Finalizada!</h2>
            
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
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 to-blue-600 z-50 overflow-hidden">
      {/* Header */}
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

      {/* Pergunta */}
      {gameState === 'question' && currentQuestion && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-20 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pergunta</h2>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {questionTimeLeft}s
              </div>
            </div>
            
            <p className="text-lg mb-6">{currentQuestion.question}</p>
            
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className="p-3 text-left bg-gray-100 hover:bg-blue-100 transition-colors rounded-lg"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pista */}
      <div className="relative h-full bg-gray-800">
        {/* Fundo da pista */}
        <div className="absolute left-20 right-20 top-0 h-full bg-gray-700">
          <div className="absolute left-1/3 w-1 h-full bg-white opacity-60"></div>
          <div className="absolute left-2/3 w-1 h-full bg-white opacity-60"></div>
          <div className="absolute left-0 w-2 h-full bg-white"></div>
          <div className="absolute right-0 w-2 h-full bg-white"></div>
        </div>

        {/* Carro do jogador */}
        <div 
          className="absolute transition-all duration-200 ease-out z-30"
          style={{
            left: `${LANE_POSITIONS[playerLane]}%`,
            bottom: '15%',
            transform: 'translateX(-50%)',
            width: '50px',
            height: '80px'
          }}
        >
          <div 
            className="w-full h-full rounded-lg border-2 border-white"
            style={{ 
              backgroundColor: '#dc2626',
              boxShadow: boost ? '0 0 20px #dc2626' : 'none'
            }}
          >
            <div className="absolute left-2 right-2 top-2 h-6 bg-blue-200 rounded" />
            <div className="absolute left-1 top-1 w-2 h-2 bg-yellow-300 rounded" />
            <div className="absolute right-1 top-1 w-2 h-2 bg-yellow-300 rounded" />
          </div>
        </div>

        {/* Carros adversários */}
        {cars.map((car) => (
          <div 
            key={car.id}
            className="absolute z-20"
            style={{
              left: `${LANE_POSITIONS[car.lane]}%`,
              bottom: `${car.position}%`,
              transform: 'translateX(-50%)',
              width: '50px',
              height: '80px'
            }}
          >
            <div 
              className="w-full h-full rounded-lg border-2 border-white"
              style={{ backgroundColor: car.color }}
            >
              <div className="absolute left-2 right-2 top-2 h-6 bg-gray-200 rounded" />
              <div className="absolute left-1 top-1 w-2 h-2 bg-red-300 rounded" />
              <div className="absolute right-1 top-1 w-2 h-2 bg-red-300 rounded" />
            </div>
            
            {/* Debug label */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-1 rounded text-xs">
              {car.id}
            </div>
          </div>
        ))}

        {/* Controles */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 px-4 z-30">
          <button
            className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex justify-center items-center shadow-lg"
            onClick={() => handleLaneChange('left')}
            disabled={playerLane === 0}
            style={{ opacity: playerLane === 0 ? '0.5' : '1' }}
          >
            ←
          </button>
          
          <button
            className="w-20 h-20 rounded-full text-white text-lg font-bold flex flex-col justify-center items-center shadow-lg"
            onClick={activateBoost}
            disabled={boost}
            style={{
              background: boost 
                ? 'radial-gradient(circle, #ef4444 0%, #b91c1c 100%)' 
                : 'radial-gradient(circle, #3b82f6 0%, #1d4ed8 100%)',
              opacity: boost ? '0.7' : '1'
            }}
          >
            <span>TURBO</span>
            <Zap size={20} />
          </button>
          
          <button
            className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex justify-center items-center shadow-lg"
            onClick={() => handleLaneChange('right')}
            disabled={playerLane === 2}
            style={{ opacity: playerLane === 2 ? '0.5' : '1' }}
          >
            →
          </button>
        </div>

        {/* Debug info */}
        <div className="absolute top-20 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-sm">
          <div>Carros: {cars.length}</div>
          <div>Pista: {playerLane + 1}</div>
          <div>Velocidade: {speed.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleRacingGame;