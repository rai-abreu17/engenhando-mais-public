import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Target, Zap, Trophy, Clock, Pause } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string;
}

interface TargetType {
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
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [ammo, setAmmo] = useState(10);
  const [specialAmmo, setSpecialAmmo] = useState(0);
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(10);
  const [showQuestion, setShowQuestion] = useState(false);
  const [crosshair, setCrosshair] = useState({ x: 50, y: 50 });
  const [gameStarted, setGameStarted] = useState(false);
  const [showOutOfAmmo, setShowOutOfAmmo] = useState(false);
  const gameLoopRef = useRef<number>();
  const lastQuestionTime = useRef(0);

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
    if (gameState === 'playing' && !showQuestion && gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
  }, [timeLeft, gameState, showQuestion, gameStarted]);

  // Timer da pergunta
  useEffect(() => {
    if (showQuestion && questionTimeLeft > 0) {
      const timer = setTimeout(() => setQuestionTimeLeft(questionTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questionTimeLeft === 0 && showQuestion) {
      handleQuestionTimeout();
    }
  }, [questionTimeLeft, showQuestion]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState === 'playing' && !showQuestion && gameStarted) {
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

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState, targets, showQuestion, gameStarted]);

  // Iniciar game loop
  useEffect(() => {
    if (gameState === 'playing' && !showQuestion && gameStarted) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return () => {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    }
  }, [gameState, gameLoop, showQuestion, gameStarted]);

  // Mostrar pergunta quando munição baixa (com controle para evitar loop)
  useEffect(() => {
    const currentTime = Date.now();
    if (gameState === 'playing' && !showQuestion && ammo <= 2 && specialAmmo === 0 && 
        currentTime - lastQuestionTime.current > 15000) { // Aumentado para 15 segundos
      triggerQuestion();
    }
    // Encerrar jogo se ficar sem munição por muito tempo
    else if (gameState === 'playing' && ammo === 0 && specialAmmo === 0 && !showQuestion &&
             currentTime - lastQuestionTime.current > 20000) {
      setGameState('finished');
    }
  }, [ammo, specialAmmo, gameState, showQuestion]);

  const triggerQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setQuestionTimeLeft(15);
    setShowQuestion(true);
    lastQuestionTime.current = Date.now();
  };

  const handleQuestionAnswer = (answerIndex: number) => {
    if (!currentQuestion) return;

    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      setSpecialAmmo(prev => prev + 5);
      setAmmo(prev => prev + 3);
      setScore(prev => prev + 100);
    } else {
      setAmmo(prev => Math.max(prev - 1, 0));
    }
    
    setShowQuestion(false);
    setCurrentQuestion(null);
  };

  const handleQuestionTimeout = () => {
    setAmmo(prev => Math.max(prev - 2, 0));
    setShowQuestion(false);
    setCurrentQuestion(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (showQuestion) return; // Não mover mira durante pergunta
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrosshair({ x, y });
  };

  const handleShoot = (e: React.MouseEvent) => {
    if (showQuestion || !gameStarted) return; // Não atirar durante pergunta ou antes de começar
    
    // Verificar se tem munição
    if (ammo <= 0 && specialAmmo <= 0) {
      setShowOutOfAmmo(true);
      setTimeout(() => setShowOutOfAmmo(false), 1000);
      // Se não tem munição, mostrar pergunta imediatamente
      const currentTime = Date.now();
      if (currentTime - lastQuestionTime.current > 5000) { // 5 segundos de cooldown
        triggerQuestion();
      }
      return;
    }

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
      setScore(prev => prev + (specialAmmo > 0 ? 30 : 20));
      
      // Feedback tátil para acerto
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    } else {
      // Errou o tiro - feedback tátil leve
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }

    // Usar munição
    if (specialAmmo > 0) {
      setSpecialAmmo(prev => prev - 1);
    } else {
      setAmmo(prev => prev - 1);
    }
  };

  const handleEndGame = () => {
    const coinsEarned = Math.floor(score / 100) + 15;
    onGameEnd(score, coinsEarned);
  };

  if (gameState === 'finished') {
    const coinsEarned = Math.floor(score / 100) + 15;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full">
          <div className="text-center">
            <Trophy className="mx-auto text-engenha-gold mb-4" size={48} />
            <h2 className="text-2xl font-bold text-engenha-dark-navy mb-2">
              Ótima Pontaria!
            </h2>
            <p className="text-lg text-engenha-dark-navy mb-4">
              Você completou o desafio de tiro!
            </p>
            
            <div className="bg-engenha-light-blue rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Pontuação:</span>
                <span className="font-bold text-engenha-dark-navy">{score}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Alvos Atingidos:</span>
                <span className="font-bold text-engenha-dark-navy">{Math.floor(score / 20)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-engenha-dark-navy">Moedas:</span>
                <span className="font-bold text-engenha-gold">{coinsEarned}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={handleEndGame}
                className="flex-1 px-4 py-2 bg-engenha-orange text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Coletar Recompensas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Header melhorado */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-900 to-orange-900 text-white border-b-2 border-yellow-400">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold text-yellow-400">🎯 TIRO AO ALVO</h2>
          <div className="flex items-center gap-4 text-lg">
            <div className="flex items-center gap-2 bg-black bg-opacity-30 px-3 py-1 rounded">
              <Clock size={20} className="text-yellow-400" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2 bg-black bg-opacity-30 px-3 py-1 rounded">
              <Trophy size={20} className="text-green-400" />
              <span className="font-mono">{score.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-300">Munição</div>
            <div className={`font-mono text-xl ${ammo <= 2 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
              {ammo}
            </div>
          </div>
          {specialAmmo > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-300">Especial</div>
              <div className="font-mono text-xl text-yellow-400">{specialAmmo}</div>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Tela inicial */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 bg-opacity-95 flex items-center justify-center z-60">
          <div className="text-center text-white max-w-lg animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce">🎯</div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-yellow-500 bg-clip-text text-transparent mb-4 animate-pulse">
              TIRO AO ALVO
            </h1>
            <div className="text-xl mb-8 text-gray-300 leading-relaxed">
              Mire e atire nos alvos em movimento!<br/>
              Responda perguntas para ganhar munição especial.
            </div>
            
            <div className="bg-gray-900 bg-opacity-80 rounded-xl p-6 mb-8 text-left border-2 border-red-400">
              <h3 className="text-red-400 font-bold text-xl mb-4 text-center">🎮 Como Jogar</h3>
              <div className="space-y-3 text-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 px-3 py-1 rounded font-mono">MOUSE</div>
                  <span>Mover mira</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 px-3 py-1 rounded font-mono">CLICK</div>
                  <span>Atirar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-600 px-3 py-1 rounded font-mono">?</div>
                  <span>Perguntas = Munição</span>
                </div>
              </div>
              <div className="mt-4 text-center text-yellow-300 text-sm">
                🎯 Acerte os alvos vermelhos em movimento!
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setGameStarted(true)}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold py-4 px-10 rounded-xl text-2xl transition-all transform hover:scale-110 shadow-lg hover:shadow-red-500/25 animate-pulse"
              >
                🎯 COMEÇAR TIRO
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
              >
                ❌ Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Area melhorada */}
      <div 
        className={`flex-1 relative overflow-hidden transition-all duration-300 ${
          showOutOfAmmo ? 'bg-red-600' : 'bg-gradient-to-br from-blue-900 via-purple-900 to-black'
        }`}
        onMouseMove={handleMouseMove}
        onClick={handleShoot}
        style={{ cursor: showQuestion || !gameStarted ? 'default' : 'crosshair' }}
      >
        {/* Fundo animado */}
        <div className="absolute inset-0">
          {/* Estrelas */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Alvos aprimorados */}
        {targets.map(target => (
          <div
            key={target.id}
            className="absolute transition-all duration-100"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px'
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
              </div>
              {/* Anéis concêntricos */}
              <div className="absolute inset-2 rounded-full border-2 border-white opacity-60"></div>
            </div>
          </div>
        ))}

        {/* Mira aprimorada */}
        {!showQuestion && gameStarted && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: `${crosshair.x}%`,
              top: `${crosshair.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-12 h-12 border-3 border-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
            {/* Linhas de mira */}
            <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-red-500 transform -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
            <div className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-red-500 transform -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
            {/* Pontos de referência */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full opacity-60"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full opacity-60"></div>
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full opacity-60"></div>
            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full opacity-60"></div>
          </div>
        )}

        {/* Feedback de sem munição */}
        {showOutOfAmmo && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-2xl animate-bounce shadow-lg">
              🚫 SEM MUNIÇÃO!
            </div>
          </div>
        )}

        {/* Controles na tela */}
        <div className="absolute bottom-6 left-6 text-white bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border-2 border-red-400 shadow-lg">
          <div className="font-bold text-red-400 mb-2 text-lg flex items-center gap-2">
            🎯 <span>TIRO AO ALVO</span>
          </div>
          <div className="space-y-1 text-sm">
            <div>🖱️ Mouse: Mover mira</div>
            <div>🔫 Click: Atirar</div>
            <div className="flex items-center gap-2">
              <Zap size={16} className={specialAmmo > 0 ? 'text-yellow-400 animate-pulse' : 'text-gray-400'} />
              <span className={specialAmmo > 0 ? 'text-yellow-400' : 'text-gray-400'}>
                {specialAmmo > 0 ? `Especial: ${specialAmmo}` : 'Sem munição especial'}
              </span>
            </div>
          </div>
          {ammo === 0 && specialAmmo === 0 && (
            <div className="mt-2 text-red-400 font-bold animate-pulse text-xs border-t border-red-400 pt-2">
              ⚠️ SEM MUNIÇÃO! Clique para pergunta
            </div>
          )}
        </div>

        {/* Status avançado */}
        <div className="absolute top-6 right-6 text-white bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border-2 border-cyan-400 shadow-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-cyan-400 font-bold">Alvos</div>
              <div className="text-2xl font-mono text-red-400">{targets.length}</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">Acertos</div>
              <div className="text-2xl font-mono text-green-400">{Math.floor(score / 20)}</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold">Munição</div>
              <div className={`text-xl font-mono ${ammo <= 2 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                {ammo}
              </div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold">Especial</div>
              <div className="text-xl font-mono text-yellow-400">{specialAmmo}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pergunta */}
      {showQuestion && currentQuestion && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-60">
          <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Pause className="text-engenha-orange" size={20} />
                <span className="font-bold text-engenha-dark-navy">Jogo Pausado</span>
              </div>
              <div className="flex items-center gap-1 text-engenha-dark-navy">
                <Clock size={16} />
                <span className="font-bold">{questionTimeLeft}s</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-xs text-engenha-dark-navy opacity-60 mb-1">
                {currentQuestion.subject}
              </div>
              <h3 className="text-lg font-bold text-engenha-dark-navy mb-4">
                {currentQuestion.question}
              </h3>
              
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionAnswer(index)}
                    className="w-full p-3 text-left bg-white border-2 border-gray-200 rounded-lg hover:border-engenha-orange hover:bg-engenha-light-blue transition-colors"
                  >
                    <span className="font-medium text-engenha-dark-navy">
                      {String.fromCharCode(65 + index)}) {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center text-sm text-engenha-dark-navy opacity-70">
              Responda corretamente para ganhar munição especial!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShootingGame;

