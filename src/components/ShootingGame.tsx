import React, { useState, useEffect, useRef } from 'react';
import { X, Target, Zap, Trophy, Clock } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string;
}

interface Target {
  id: number;
  x: number;
  y: number;
  speed: number;
  direction: number;
}

interface ShootingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const ShootingGame: React.FC<ShootingGameProps> = ({ onGameEnd, onClose }) => {
  const [gameState, setGameState] = useState<'playing' | 'question' | 'finished'>('playing');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [ammo, setAmmo] = useState(10);
  const [specialAmmo, setSpecialAmmo] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(8);
  const [crosshair, setCrosshair] = useState({ x: 50, y: 50 });
  const gameLoopRef = useRef<number>();

  const questions: Question[] = [
    {
      id: 1,
      question: "Qual é a área de um círculo com raio 3?",
      options: ["6π", "9π", "3π", "12π"],
      correct: 1,
      subject: "Matemática"
    },
    {
      id: 2,
      question: "Qual é a segunda lei de Newton?",
      options: ["F = ma", "E = mc²", "v = d/t", "P = mv"],
      correct: 0,
      subject: "Física"
    },
    {
      id: 3,
      question: "Qual é o valor de log₁₀(100)?",
      options: ["1", "2", "10", "100"],
      correct: 1,
      subject: "Matemática"
    },
    {
      id: 4,
      question: "Qual é a unidade de energia no SI?",
      options: ["Watt", "Joule", "Newton", "Pascal"],
      correct: 1,
      subject: "Física"
    },
    {
      id: 5,
      question: "Qual é a integral de 2x?",
      options: ["x²", "x² + C", "2", "2x + C"],
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
  }, [gameState, targets]);

  // Gerar pergunta quando munição especial acaba
  useEffect(() => {
    if (gameState === 'playing' && ammo <= 2 && specialAmmo === 0) {
      triggerQuestion();
    }
  }, [ammo, specialAmmo, gameState]);

  const gameLoop = () => {
    // Gerar novos alvos
    if (Math.random() < 0.03 && targets.length < 5) {
      setTargets(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 10,
        speed: Math.random() * 2 + 1,
        direction: Math.random() * 360
      }]);
    }

    // Mover alvos
    setTargets(prev => prev.map(target => {
      let newX = target.x + Math.cos(target.direction) * target.speed;
      let newY = target.y + Math.sin(target.direction) * target.speed;
      let newDirection = target.direction;

      // Rebater nas bordas
      if (newX <= 5 || newX >= 95) {
        newDirection = Math.PI - target.direction;
        newX = Math.max(5, Math.min(95, newX));
      }
      if (newY <= 5 || newY >= 75) {
        newDirection = -target.direction;
        newY = Math.max(5, Math.min(75, newY));
      }

      return {
        ...target,
        x: newX,
        y: newY,
        direction: newDirection
      };
    }));

    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const triggerQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setQuestionTimeLeft(8);
    setGameState('question');
  };

  const handleAnswer = (answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correct) {
      // Resposta correta - ganha munição especial
      setSpecialAmmo(prev => prev + 5);
      setAmmo(prev => prev + 3);
      setScore(prev => prev + 100);
    } else {
      // Resposta errada - perde munição
      setAmmo(prev => Math.max(prev - 1, 0));
    }
    
    setGameState('playing');
    setCurrentQuestion(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrosshair({ x, y });
  };

  const handleShoot = (e: React.MouseEvent) => {
    if (ammo <= 0 && specialAmmo <= 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Verificar se acertou algum alvo
    const hitTarget = targets.find(target => {
      const distance = Math.sqrt(
        Math.pow(target.x - clickX, 2) + Math.pow(target.y - clickY, 2)
      );
      return distance < 8; // Raio de acerto
    });

    if (hitTarget) {
      // Acertou o alvo
      setTargets(prev => prev.filter(t => t.id !== hitTarget.id));
      
      if (specialAmmo > 0) {
        setSpecialAmmo(prev => prev - 1);
        setScore(prev => prev + 50); // Pontuação maior com munição especial
      } else {
        setAmmo(prev => prev - 1);
        setScore(prev => prev + 25);
      }
    } else {
      // Errou o tiro
      if (specialAmmo > 0) {
        setSpecialAmmo(prev => prev - 1);
      } else {
        setAmmo(prev => prev - 1);
      }
    }
  };

  const getCoinsReward = () => {
    return Math.floor(score / 20) + Math.floor(targets.length * 2);
  };

  if (gameState === 'finished') {
    const coinsEarned = getCoinsReward();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full">
          <div className="text-center">
            <Trophy className="mx-auto text-engenha-gold mb-4" size={48} />
            <h2 className="text-2xl font-bold text-engenha-dark-navy mb-2">
              Tiro ao Alvo Finalizado!
            </h2>
            
            <div className="bg-engenha-light-blue rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Pontuação:</span>
                <span className="font-bold text-engenha-dark-navy">{score} pts</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Alvos restantes:</span>
                <span className="font-bold text-engenha-dark-navy">{targets.length}</span>
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
            Responda corretamente para ganhar munição especial! 🎯⚡
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-green-400 to-green-600 z-50">
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
          <div className="font-bold">Pontos: {score}</div>
        </div>
      </div>

      {/* Área de jogo */}
      <div 
        className="relative h-full bg-gradient-to-b from-sky-200 to-green-300 overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={handleShoot}
      >
        {/* Alvos */}
        {targets.map(target => (
          <div
            key={target.id}
            className="absolute w-16 h-16 transition-all duration-100"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Target className="w-full h-full text-red-500" />
          </div>
        ))}

        {/* Crosshair */}
        <div
          className="absolute w-8 h-8 pointer-events-none"
          style={{
            left: `${crosshair.x}%`,
            top: `${crosshair.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-full h-full border-2 border-red-500 rounded-full bg-red-500 bg-opacity-20">
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* HUD */}
        <div className="absolute top-20 left-4 bg-white bg-opacity-20 rounded-lg p-3 text-white">
          <div className="text-center">
            <div className="text-xs">Munição Normal</div>
            <div className="text-2xl font-bold">{ammo}</div>
          </div>
        </div>

        <div className="absolute top-20 right-4 bg-white bg-opacity-20 rounded-lg p-3 text-white">
          <div className="text-center">
            <div className="text-xs">Munição Especial</div>
            <div className="text-2xl font-bold text-yellow-400">{specialAmmo}</div>
          </div>
        </div>

        {/* Instruções */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 rounded-lg p-3 text-white text-center">
          <div className="text-sm">
            Clique nos alvos para atirar! 🎯
            <br />
            Responda perguntas para ganhar munição especial! ⚡
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShootingGame;

