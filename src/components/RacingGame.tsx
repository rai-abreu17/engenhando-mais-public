import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Trophy, Clock, Zap } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string;
}

interface OpponentCar {
  id: number;
  lane: number;
  position: number;
  speed: number;
  color: string;
}

interface RacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ onGameEnd, onClose }) => {
  const [gameState, setGameState] = useState<'playing' | 'question' | 'finished'>('playing');
  const [endGameReason, setEndGameReason] = useState<'time' | 'collision' | 'questions' | null>(null);
  const [carPosition, setCarPosition] = useState(50);
  const [currentLane, setCurrentLane] = useState(1);
  const [speed, setSpeed] = useState(3);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(10);
  const [boost, setBoost] = useState(false);
  const [carRotation, setCarRotation] = useState(0);
  const gameLoopRef = useRef<number>();
  const [consecutiveWrongAnswers, setConsecutiveWrongAnswers] = useState(0);
  
  const [opponentCars, setOpponentCars] = useState<OpponentCar[]>([]);
  const [roadOffset, setRoadOffset] = useState(0);

  const lanes = [25, 50, 75]; // Posições das pistas em %
  const carColors = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed'];

  // Inicializar com alguns carros para teste
  useEffect(() => {
    console.log('Inicializando carros adversários...');
    const initialCars: OpponentCar[] = [
      {
        id: 1,
        lane: 0,
        position: 120,
        speed: 2,
        color: '#dc2626'
      },
      {
        id: 2,
        lane: 2,
        position: 150,
        speed: 1.8,
        color: '#2563eb'
      }
    ];
    setOpponentCars(initialCars);
    console.log('Carros inicializados:', initialCars);
  }, []);

  // Atualizar posição do carro quando muda de pista
  useEffect(() => {
    setCarPosition(lanes[currentLane]);
    
    if (currentLane === 0) {
      setCarRotation(-8);
      setTimeout(() => setCarRotation(0), 150);
    } else if (currentLane === 2) {
      setCarRotation(8);
      setTimeout(() => setCarRotation(0), 150);
    }
  }, [currentLane]);

  // Perguntas para o quiz
  const questions: Question[] = [
    {
      id: 1,
      question: "Qual é a fórmula da velocidade?",
      options: ["v = d/t", "v = d*t", "v = t/d", "v = d+t"],
      correct: 0,
      subject: "Física"
    },
    {
      id: 2,
      question: "Qual é a unidade de aceleração no SI?",
      options: ["m/s", "m/s²", "km/h", "N"],
      correct: 1,
      subject: "Física"
    },
    {
      id: 3,
      question: "Qual é a derivada de x³?",
      options: ["3x²", "x²", "3x", "x³"],
      correct: 0,
      subject: "Matemática"
    },
    {
      id: 4,
      question: "Qual é a força necessária para acelerar 10kg a 2m/s²?",
      options: ["5N", "12N", "20N", "8N"],
      correct: 2,
      subject: "Física"
    },
    {
      id: 5,
      question: "Qual é o resultado de 2³?",
      options: ["6", "8", "9", "4"],
      correct: 1,
      subject: "Matemática"
    }
  ];

  // Timer principal do jogo
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setEndGameReason('time');
      setGameState('finished');
    }
  }, [timeLeft, gameState]);

  // Timer da pergunta
  useEffect(() => {
    if (gameState === 'question' && questionTimeLeft > 0) {
      const timer = setTimeout(() => setQuestionTimeLeft(questionTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questionTimeLeft === 0 && gameState === 'question') {
      handleAnswer(-1);
    }
  }, [questionTimeLeft, gameState]);

  // Gerar pergunta
  useEffect(() => {
    if (gameState === 'playing' && distance > 0 && distance % 400 === 0) {
      triggerQuestion();
    }
  }, [distance, gameState]);

  // Controles de teclado
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
  }, [gameState, currentLane, boost]);

  const activateBoost = () => {
    if (!boost) {
      setBoost(true);
      setSpeed(prev => prev * 1.8);
      setTimeout(() => {
        setBoost(false);
        setSpeed(prev => prev / 1.8);
      }, 2000);
    }
  };

  const handleAnswer = useCallback((answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correct) {
      setSpeed(prev => Math.min(prev + 0.5, 7));
      activateBoost();
      setScore(prev => prev + 150);
      setConsecutiveWrongAnswers(0);
    } else {
      setConsecutiveWrongAnswers(prev => prev + 1);
      
      if (consecutiveWrongAnswers + 1 >= 3) {
        setEndGameReason('questions');
        setGameState('finished');
        return;
      }
      
      setSpeed(prev => Math.max(prev - 0.3, 1.5));
    }
    
    setGameState('playing');
    setCurrentQuestion(null);
  }, [currentQuestion, consecutiveWrongAnswers]);

  const gameLoop = useCallback(() => {
    if (gameState === 'playing') {
      // Atualizar distância e pontuação
      setDistance(prev => prev + speed);
      setScore(prev => prev + Math.floor(speed * 3));
      
      // Atualizar offset da estrada para efeito de movimento
      setRoadOffset(prev => (prev + speed * 3) % 100);
      
      // Spawnar novos carros adversários com mais frequência
      if (Math.random() < 0.02) { // 2% de chance a cada frame
        setOpponentCars(prevCars => {
          if (prevCars.length < 6) {
            // Escolher uma pista aleatória
            const randomLane = Math.floor(Math.random() * 3);
            
            // Verificar se não há carro muito próximo nesta pista
            const hasNearCar = prevCars.some(car => 
              car.lane === randomLane && car.position > 85
            );
            
            if (!hasNearCar) {
              const newCar: OpponentCar = {
                id: Date.now() + Math.random(),
                lane: randomLane,
                position: 110, // Começar um pouco fora da tela
                speed: 1.5 + Math.random() * 1.5,
                color: carColors[Math.floor(Math.random() * carColors.length)]
              };
              console.log('Novo carro criado:', newCar);
              return [...prevCars, newCar];
            }
          }
          return prevCars;
        });
      }
    }

    // Atualizar posição dos carros adversários
    setOpponentCars(prevCars => {
      const updatedCars = prevCars
        .map(car => ({
          ...car,
          position: car.position - (car.speed + speed * 0.3),
        }))
        .filter(car => car.position > -15);

      // Verificar colisões
      if (gameState === 'playing') {
        const collision = updatedCars.some(car => 
          car.lane === currentLane && 
          car.position >= 10 && 
          car.position <= 30
        );
        
        if (collision) {
          console.log('Colisão detectada!');
          setGameState('finished');
          setEndGameReason('collision');
        }
      }

      return updatedCars;
    });

    if (gameState !== 'finished') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState, speed, currentLane]);

  // Loop principal do jogo
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

  // Log para debug
  useEffect(() => {
    console.log('Carros adversários atuais:', opponentCars.length);
    opponentCars.forEach(car => {
      console.log(`Carro ${car.id}: Lane ${car.lane}, Position ${car.position.toFixed(1)}`);
    });
  }, [opponentCars]);

  const triggerQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setQuestionTimeLeft(10);
    setGameState('question');
  };

  const getCoinsReward = () => {
    return Math.floor(score / 12) + Math.floor(distance / 25);
  };

  // Tela de fim de jogo
  if (gameState === 'finished') {
    const coinsEarned = getCoinsReward();
    
    let gameOverReason = '';
    if (consecutiveWrongAnswers >= 3) {
      gameOverReason = "Você errou 3 perguntas seguidas!";
    } else if (timeLeft === 0) {
      gameOverReason = "O tempo acabou!";
    } else {
      gameOverReason = "Você colidiu com outro carro!";
    }
    
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
  }

  // Tela do jogo
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-400 to-green-600 z-50 overflow-hidden">
      {/* Overlay de pergunta */}
      {gameState === 'question' && currentQuestion && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-20 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentQuestion.subject}</h2>
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

      {/* Header do jogo */}
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

      {/* Debug info */}
      <div className="absolute top-20 right-4 bg-black bg-opacity-60 text-white p-2 rounded text-xs z-10">
        <div>Carros: {opponentCars.length}</div>
        <div>Pista atual: {currentLane}</div>
      </div>

      {/* Pista de corrida */}
      <div className="relative h-full bg-gray-800 overflow-hidden">
        {/* Estrada com efeito de movimento */}
        <div className="absolute inset-0">
          {/* Grama lateral */}
          <div className="absolute left-0 top-0 w-20 h-full bg-green-500"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-green-500"></div>
          
          {/* Asfalto principal */}
          <div className="absolute left-20 right-20 top-0 h-full bg-gray-700">
            {/* Linhas centrais animadas */}
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
              {/* Divisor entre pistas 1 e 2 */}
              <div className="absolute left-1/3 w-1 h-full bg-white opacity-60"></div>
              {/* Divisor entre pistas 2 e 3 */}
              <div className="absolute left-2/3 w-1 h-full bg-white opacity-60"></div>
            </div>
            
            {/* Bordas laterais */}
            <div className="absolute left-0 w-2 h-full bg-white"></div>
            <div className="absolute right-0 w-2 h-full bg-white"></div>
          </div>
        </div>

        {/* Marcadores de pista */}
        {lanes.map((lane, index) => (
          <div 
            key={index}
            className="absolute top-4 text-white font-bold text-sm"
            style={{ 
              left: `${lane}%`,
              transform: 'translateX(-50%)',
              zIndex: 5
            }}
          >
            Pista {index + 1}
          </div>
        ))}

        {/* Carro do jogador */}
        <div 
          className="absolute transition-all duration-200 ease-out z-20"
          style={{
            left: `${lanes[currentLane]}%`,
            bottom: '15%',
            transform: `translateX(-50%) rotate(${carRotation}deg)`,
            width: '60px',
            height: '100px'
          }}
        >
          {/* Sombra do carro */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-black opacity-40 rounded-full"
            style={{ filter: 'blur(3px)' }}
          />
          
          {/* Corpo do carro do jogador */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-red-600 rounded-lg shadow-lg"
                 style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)' }}>
              {/* Janelas */}
              <div className="absolute left-1/4 right-1/4 top-2 h-6 bg-blue-200 rounded-t opacity-80" />
              {/* Faróis */}
              <div className="absolute left-2 top-1 w-3 h-2 bg-yellow-300 rounded-sm" />
              <div className="absolute right-2 top-1 w-3 h-2 bg-yellow-300 rounded-sm" />
              {/* Listras */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-white opacity-60" />
            </div>
          </div>
          
          {/* Efeito de turbo */}
          {boost && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-12"
                 style={{
                   background: 'linear-gradient(to top, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.9))',
                   filter: 'blur(2px)',
                   zIndex: -1,
                   animation: 'pulse 0.3s infinite'
                 }}
            />
          )}
        </div>

        {/* Carros adversários */}
        {opponentCars.map((car) => (
          <div 
            key={car.id}
            className="absolute z-15"
            style={{
              left: `${lanes[car.lane]}%`,
              bottom: `${car.position}%`,
              transform: 'translateX(-50%) rotate(180deg)',
              width: '60px',
              height: '100px'
            }}
          >
            {/* Sombra do carro adversário */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-black opacity-40 rounded-full"
              style={{ filter: 'blur(3px)' }}
            />
            
            {/* Corpo do carro adversário */}
            <div className="relative w-full h-full">
              <div 
                className="absolute inset-0 rounded-lg shadow-lg"
                style={{ 
                  backgroundColor: car.color,
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)'
                }}
              >
                {/* Janelas */}
                <div className="absolute left-1/4 right-1/4 top-2 h-6 bg-gray-200 rounded-t opacity-80" />
                {/* Faróis traseiros */}
                <div className="absolute left-2 top-1 w-3 h-2 bg-red-400 rounded-sm" />
                <div className="absolute right-2 top-1 w-3 h-2 bg-red-400 rounded-sm" />
                {/* Listras */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-white opacity-40" />
              </div>
            </div>
          </div>
        ))}

        {/* Controles na tela */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 px-4 z-20">
          <button
            className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex justify-center items-center shadow-lg active:bg-blue-700"
            onClick={() => currentLane > 0 && setCurrentLane(prev => prev - 1)}
            disabled={currentLane === 0}
            style={{ opacity: currentLane === 0 ? '0.5' : '1' }}
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
            className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex justify-center items-center shadow-lg active:bg-blue-700"
            onClick={() => currentLane < 2 && setCurrentLane(prev => prev + 1)}
            disabled={currentLane === 2}
            style={{ opacity: currentLane === 2 ? '0.5' : '1' }}
          >
            →
          </button>
        </div>

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
