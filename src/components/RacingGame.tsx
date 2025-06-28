import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Trophy, Clock } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string;
}

interface RacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ onGameEnd, onClose }) => {
  const [gameState, setGameState] = useState<'playing' | 'question' | 'finished'>('playing');
  const [carPosition, setCarPosition] = useState(50);
  const [speed, setSpeed] = useState(1);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(10);
  const [boost, setBoost] = useState(false);
  const [obstacles, setObstacles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const gameLoopRef = useRef<number>();

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
      setGameState('finished');
    }
  }, [timeLeft, gameState]);

  // Timer da pergunta
  useEffect(() => {
    if (gameState === 'question' && questionTimeLeft > 0) {
      const timer = setTimeout(() => setQuestionTimeLeft(questionTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questionTimeLeft === 0 && gameState === 'question') {
      // Tempo esgotado - resposta errada
      handleAnswer(-1);
    }
  }, [questionTimeLeft, gameState]);

  // Loop principal do jogo
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return () => {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    }
  }, [gameState, speed, distance]);

  // Gerar pergunta aleatoriamente
  useEffect(() => {
    if (gameState === 'playing' && distance > 0 && distance % 200 === 0) {
      triggerQuestion();
    }
  }, [distance, gameState]);

  const gameLoop = () => {
    setDistance(prev => prev + speed);
    setScore(prev => prev + Math.floor(speed));
    
    // Gerar obstáculos
    if (Math.random() < 0.02) {
      setObstacles(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: 0
      }]);
    }
    
    // Mover obstáculos
    setObstacles(prev => prev
      .map(obs => ({ ...obs, y: obs.y + 2 }))
      .filter(obs => obs.y < 100)
    );

    // Reduzir boost
    if (boost) {
      setTimeout(() => setBoost(false), 3000);
    }

    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const triggerQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setQuestionTimeLeft(10);
    setGameState('question');
  };

  const handleAnswer = (answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correct) {
      // Resposta correta
      setSpeed(prev => Math.min(prev + 0.5, 5));
      setBoost(true);
      setScore(prev => prev + 50);
    } else {
      // Resposta errada
      setSpeed(prev => Math.max(prev - 0.3, 0.5));
    }
    
    setGameState('playing');
    setCurrentQuestion(null);
  };

  const moveCarLeft = () => {
    setCarPosition(prev => Math.max(prev - 10, 10));
  };

  const moveCarRight = () => {
    setCarPosition(prev => Math.min(prev + 10, 90));
  };

  const getCoinsReward = () => {
    return Math.floor(score / 10) + Math.floor(distance / 50);
  };

  if (gameState === 'finished') {
    const coinsEarned = getCoinsReward();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full">
          <div className="text-center">
            <Trophy className="mx-auto text-engenha-gold mb-4" size={48} />
            <h2 className="text-2xl font-bold text-engenha-dark-navy mb-2">
              Corrida Finalizada!
            </h2>
            
            <div className="bg-engenha-light-blue rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Distância:</span>
                <span className="font-bold text-engenha-dark-navy">{distance}m</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Pontuação:</span>
                <span className="font-bold text-engenha-dark-navy">{score} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-engenha-dark-navy">Moedas ganhas:</span>
                <span className="font-bold text-engenha-gold">🪙 {coinsEarned}</span>
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
                className="flex-1 bg-engenha-orange text-white py-2 px-4 rounded-lg font-medium hover:bg-engenha-dark-orange"
              >
                Coletar Recompensa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'question' && currentQuestion) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="text-engenha-orange" size={20} />
              <span className="text-sm font-medium text-engenha-dark-navy">
                {currentQuestion.subject}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-engenha-orange" size={16} />
              <span className={`font-bold ${questionTimeLeft <= 3 ? 'text-red-500' : 'text-engenha-dark-navy'}`}>
                {questionTimeLeft}s
              </span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-engenha-dark-navy mb-4">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3 mb-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full p-3 rounded-lg border-2 border-engenha-sky-blue bg-engenha-light-blue hover:bg-engenha-sky-blue hover:text-white text-left transition-all"
              >
                <span className="font-medium">{String.fromCharCode(65 + index)})</span>
                <span className="ml-2">{option}</span>
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-engenha-dark-navy opacity-70">
            Responda rápido para ganhar boost de velocidade! 🏎️💨
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 to-blue-600 z-50">
      {/* Header do jogo */}
      <div className="flex justify-between items-center p-4 text-white">
        <button
          onClick={onClose}
          className="bg-white bg-opacity-20 rounded-full p-2"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span className="font-bold">{timeLeft}s</span>
          </div>
          <div className="font-bold">Distância: {distance}m</div>
          <div className="font-bold">Pontos: {score}</div>
        </div>
      </div>

      {/* Pista de corrida */}
      <div className="relative h-full bg-gray-700 overflow-hidden">
        {/* Faixas da pista */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-8 bg-white opacity-50"
              style={{
                left: '50%',
                top: `${(i * 10 + (distance % 10)) % 100}%`,
                transform: 'translateX(-50%)'
              }}
            />
          ))}
        </div>

        {/* Obstáculos */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute w-8 h-8 bg-red-500 rounded"
            style={{
              left: `${obstacle.x}%`,
              top: `${obstacle.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}

        {/* Carro do jogador */}
        <div
          className={`absolute bottom-20 w-12 h-20 transition-all duration-200 ${
            boost ? 'animate-pulse' : ''
          }`}
          style={{
            left: `${carPosition}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className={`w-full h-full rounded-lg ${boost ? 'bg-yellow-400' : 'bg-red-500'} shadow-lg`}>
            <div className="text-center text-white font-bold text-xs pt-2">🏎️</div>
          </div>
        </div>

        {/* Indicador de boost */}
        {boost && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-yellow-400 text-4xl font-bold animate-bounce">
              ⚡ BOOST! ⚡
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8">
          <button
            onClick={moveCarLeft}
            className="bg-white bg-opacity-20 rounded-full p-4 text-white font-bold text-xl"
          >
            ←
          </button>
          <button
            onClick={moveCarRight}
            className="bg-white bg-opacity-20 rounded-full p-4 text-white font-bold text-xl"
          >
            →
          </button>
        </div>

        {/* Velocímetro */}
        <div className="absolute top-20 right-4 bg-white bg-opacity-20 rounded-lg p-3 text-white">
          <div className="text-center">
            <div className="text-xs">Velocidade</div>
            <div className="text-2xl font-bold">{speed.toFixed(1)}</div>
            <div className="text-xs">m/s</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RacingGame;

