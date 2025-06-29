import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { X, Trophy, Clock, Zap } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string;
}

// Interface para representar os carros adversários
interface OpponentCar {
  id: number;
  lane: number; // 0, 1, ou 2
  position: number; // posição vertical (0 a 100%)
  speed: number;
}

interface RacingGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ onGameEnd, onClose }) => {
  const [gameState, setGameState] = useState<'playing' | 'question' | 'finished'>('playing');
  const [endGameReason, setEndGameReason] = useState<'time' | 'collision' | 'questions' | null>(null);
  const [carPosition, setCarPosition] = useState(50);
  const [currentLane, setCurrentLane] = useState(1); // 0=esquerda, 1=centro, 2=direita  
  const [speed, setSpeed] = useState(1);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(10);
  const [boost, setBoost] = useState(false);
  const [carRotation, setCarRotation] = useState(0);
  const gameLoopRef = useRef<number>();
  const [consecutiveWrongAnswers, setConsecutiveWrongAnswers] = useState(0);
  
  // Estado para controlar os carros adversários
  const [opponentCars, setOpponentCars] = useState<OpponentCar[]>([]);
  const [lastCarSpawn, setLastCarSpawn] = useState(0);

  // Limpar carros quando o componente é montado
  useEffect(() => {
    setOpponentCars([]);
    setEndGameReason(null);
  }, []);

  // Variáveis derivadas para animações
  const isMoving = gameState === 'playing' || gameState === 'question';
  const isTurboActive = boost;

  // Pistas/lanes do jogo (3 pistas bem definidas)
  const lanes = [25, 50, 75]; // Posições das 3 pistas em %
  
  // Efeito para inicialização dos carros adversários quando o jogo começa
  useEffect(() => {
    if (gameState === 'playing' && opponentCars.length === 0) {
      const timer = setTimeout(() => {
        const initialCars = [];
        for (let i = 0; i < 2; i++) {
          initialCars.push({
            id: Date.now() + i,
            lane: Math.floor(Math.random() * 3),
            position: 90 - (i * 20), // 90% e 70% (área visível)
            speed: 0.3, // bem lento
          });
        }
        setOpponentCars(initialCars);
        console.log("🚗 Carros iniciais criados:", initialCars);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, opponentCars.length]);
  
  // Atualizar posição do carro quando muda de pista
  useEffect(() => {
    setCarPosition(lanes[currentLane]);
    
    // Efeito de rotação ao trocar de faixa
    if (currentLane === 0) {
      setCarRotation(-8); // Rotação para a esquerda
      setTimeout(() => setCarRotation(0), 300);
    } else if (currentLane === 2) {
      setCarRotation(8); // Rotação para a direita
      setTimeout(() => setCarRotation(0), 300);
    } else {
      setCarRotation(0); // Centralizado
    }
  }, [currentLane]);

  // Calcular a velocidade da animação da pista com base na velocidade do carro
  // Essa variável é usada em componentes de estilo CSS
  const roadAnimationSpeed = useMemo(() => {
    // Quanto maior a velocidade, mais rápida é a animação (tempo mais curto)
    const baseSpeed = isTurboActive ? speed * 1.8 : speed;
    // Durante perguntas, mantemos algum movimento mas mais lento
    const visualSpeed = gameState === 'question' ? baseSpeed * 0.5 : baseSpeed;
    // Inversamente proporcional à velocidade (2.0/visualSpeed = mais rápido com velocidade maior)
    return Math.max(0.5, 2.0/visualSpeed);
  }, [speed, isTurboActive, gameState]);

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
      // Tempo esgotado - conta como resposta errada
      handleAnswer(-1);
    }
  }, [questionTimeLeft, gameState]);

  // Gerar pergunta aleatoriamente (com intervalo ajustado à nova velocidade)
  useEffect(() => {
    if (gameState === 'playing' && distance > 0 && distance % 200 === 0) {
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
      setSpeed(prev => prev * 2);
      // Desativar o boost após 3 segundos
      setTimeout(() => {
        setBoost(false);
        setSpeed(prev => prev / 2);
      }, 3000);
    }
  };

  const handleAnswer = useCallback((answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correct) {
      // Resposta correta - ajustes reduzidos para nova escala de velocidade
      setSpeed(prev => Math.min(prev + 0.3, 5));
      activateBoost();
      setScore(prev => prev + 50);
      // Resetar o contador de erros consecutivos quando acerta
      setConsecutiveWrongAnswers(0);
    } else {
      // Resposta errada
      setConsecutiveWrongAnswers(prev => prev + 1);
      
      // Verifica se já são 3 erros consecutivos
      if (consecutiveWrongAnswers + 1 >= 3) {
        // Game over após 3 erros consecutivos
        setEndGameReason('questions');
        setGameState('finished');
        return;
      }
      
      // Continua o jogo mas reduz a velocidade
      setSpeed(prev => Math.max(prev - 0.2, 0.5));
    }
    
    setGameState('playing');
    setCurrentQuestion(null);
  }, [currentQuestion, consecutiveWrongAnswers]);

  const gameLoop = useCallback(() => {
    if (gameState === 'playing') {
      setDistance(prev => prev + (speed * 0.33));
      setScore(prev => prev + Math.floor(speed * 0.5));
      const now = Date.now();
      setLastCarSpawn(prevLastCarSpawn => {
        if (now - prevLastCarSpawn > 4000) {
          setOpponentCars(prevCars => {
            if (prevCars.length < 4) {
              const randomLane = Math.floor(Math.random() * 3);
              const newCar: OpponentCar = {
                id: Date.now(),
                lane: randomLane,
                position: 90,
                speed: 0.3,
              };
              const canSpawn = !prevCars.some(car => car.lane === newCar.lane && car.position > 70);
              if (canSpawn) {
                console.log("🚗 Novo carro gerado:", newCar);
                return [...prevCars, newCar];
              }
            }
            return prevCars;
          });
          return now;
        }
        return prevLastCarSpawn;
      });
    }
    setOpponentCars(prevCars => {
      const updatedCars = prevCars
        .map(car => ({
          ...car,
          position: car.position - car.speed * 0.3,
        }))
        .filter(car => car.position > 10); // só remove quando passa do jogador
      if (gameState === 'playing') {
        const collision = updatedCars.some(car => car.lane === currentLane && car.position >= 15 && car.position <= 35);
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
  }, [gameState, speed, currentLane]);

  // Loop principal do jogo - inicialização
  useEffect(() => {
    // Inicia o gameLoop quando o jogo não estiver finalizado
    if (gameState !== 'finished') {      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState]);

  const triggerQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setQuestionTimeLeft(10);
    setGameState('question');
  };

  const getCoinsReward = () => {
    // Ajustado para nova escala de velocidade/distância
    return Math.floor(score / 10) + Math.floor(distance / 20);
  };

  // Tela de fim de jogo
  if (gameState === 'finished') {
    const coinsEarned = getCoinsReward();
    
    // Determinar motivo da derrota
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
        <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full">
          <div className="text-center">
            <Trophy className="mx-auto text-engenha-gold mb-4" size={48} />
            <h2 className="text-2xl font-bold text-engenha-dark-navy mb-2">
              Corrida Finalizada!
            </h2>
            
            {/* Motivo da derrota */}
            <div className="text-engenha-dark-red mb-3">
              {gameOverReason}
            </div>
            
            <div className="bg-engenha-light-blue rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Distância:</span>
                <span className="font-bold text-engenha-dark-navy">{distance.toFixed(0)}m</span>
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

  // Tela de pergunta é agora um overlay que será renderizado junto com o jogo
  const QuestionOverlay = () => {
    if (gameState !== 'question' || !currentQuestion) return null;
    
    return (
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
    );
  };

  // Tela do jogo
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 to-blue-600 z-50">
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
          <div className="font-bold">Distância: {distance.toFixed(0)}m</div>
          <div className="font-bold">Pontos: {score}</div>
        </div>
      </div>

      {/* Pista de corrida */}
      <div className="relative h-full bg-gray-700 overflow-hidden">
        {/* Pista principal simplificada com movimento automático */}
        <div className="absolute inset-0 bg-gray-800">
          {/* Linhas centrais amarelas da pista com movimento automático para trás */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-4 bg-yellow-400"
               style={{
                 backgroundImage: `repeating-linear-gradient(0deg, 
                   transparent, 
                   transparent 10px, 
                   #eab308 10px, 
                   #eab308 20px)`,
                 animation: `moveRoadLines ${roadAnimationSpeed}s infinite linear`,
                 backgroundSize: '100% 40px'
               }}>
          </div>
          
          {/* Linhas laterais brancas com movimento automático para trás */}
          <div className="absolute left-8 top-0 bottom-0 w-2 bg-white"
               style={{
                 backgroundImage: `repeating-linear-gradient(0deg, 
                   white, 
                   white 30px, 
                   transparent 30px, 
                   transparent 60px)`,
                 animation: `moveRoadLines ${roadAnimationSpeed}s infinite linear`,
                 backgroundSize: '100% 60px'
               }}>
          </div>
          <div className="absolute right-8 top-0 bottom-0 w-2 bg-white"
               style={{
                 backgroundImage: `repeating-linear-gradient(0deg, 
                   white, 
                   white 30px, 
                   transparent 30px, 
                   transparent 60px)`,
                 animation: `moveRoadLines ${roadAnimationSpeed}s infinite linear`,
                 backgroundSize: '100% 60px'
               }}>
          </div>
          
          {/* Asfalto simplificado e mais limpo */}
          <div className="absolute inset-0 z-0"
               style={{
                 backgroundImage: `linear-gradient(0deg, 
                   rgba(50,50,50,1), 
                   rgba(30,30,30,1))`,
               }}>
          </div>
        </div>

        {/* Pistas/lanes simplificadas - removido o destaque de cor */}
        {lanes.map((lane, index) => (
          <div 
            key={index}
            className="absolute top-0 bottom-0 transition-all bg-gray-800"
            style={{ 
              left: `${lane - 15}%`,
              width: '30%',
              borderLeft: index > 0 ? '2px solid rgba(255, 255, 255, 0.2)' : 'none',
              borderRight: index < 2 ? '2px solid rgba(255, 255, 255, 0.2)' : 'none',
            }}
          >
            {/* Número da pista - mais discreto, sem cor diferente */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-500">
              {index + 1}
            </div>

            {/* Linhas de divisão das pistas simples com movimento automático - sem cor diferente para pista selecionada */}
            <div 
              className="absolute left-0 right-0 h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, 
                  rgba(255, 255, 255, 0.15) 0px, 
                  rgba(255, 255, 255, 0.15) 20px, 
                  transparent 20px, 
                  transparent 80px)`,
                animation: `moveRoadLines ${roadAnimationSpeed * 1.2}s infinite linear`,
                backgroundSize: '100% 80px',
                opacity: 0.7
              }}
            />
          </div>
        ))}

        {/* CSS para animações do carro */}
        <style>
          {`
            @keyframes carVibration {
              0% { transform: translateY(0) rotate(0deg); }
              25% { transform: translateY(-1px) rotate(0.5deg); }
              50% { transform: translateY(0) rotate(0deg); }
              75% { transform: translateY(1px) rotate(-0.5deg); }
              100% { transform: translateY(0) rotate(0deg); }
            }
            
            @keyframes dustParticle {
              0% { opacity: 0.5; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-20px); }
            }
            
            @keyframes flameFlicker {
              0% { opacity: 0.6; height: 100%; }
              50% { opacity: 0.8; height: 110%; }
              100% { opacity: 0.6; height: 100%; }
            }
            
            @keyframes moveRoadLines {
              0% { background-position: 0 0; }
              100% { background-position: 0 200px; }
            }
          `}
        </style>
        
        {/* Carro do jogador - posicionado com distância segura da borda */}
        <div 
          className="absolute w-20 h-32 transition-all duration-150 ease-in-out transform"
          style={{
            left: `${lanes[currentLane]}%`,
            bottom: '25%',
            transform: `translateZ(0) translateX(-50%) rotate(${carRotation}deg)`,
            filter: isTurboActive ? 'drop-shadow(0 0 10px #3b82f6) brightness(1.2)' : 'none',
            transition: 'left 0.3s ease-out',
            zIndex: 10
          }}
        >
          {/* Sombra do carro */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black opacity-50 rounded-full"
            style={{
              filter: 'blur(4px)',
              animation: isMoving ? 'carVibration 0.1s ease-in-out infinite' : 'none',
            }}
          />
          
          {/* Corpo do carro */}
          <div 
            className="absolute inset-0 bg-red-600 rounded-lg"
            style={{
              animation: isMoving ? 'carVibration 0.1s ease-in-out infinite' : 'none',
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)',
            }}
          >
            {/* Detalhes do carro */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              {/* Faixas centrais do carro */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-4 bg-white" />
              
              {/* Janelas */}
              <div className="absolute left-1/4 right-1/4 top-2 h-8 bg-blue-400 rounded-t-lg" />
              
              {/* Faróis */}
              <div className="absolute left-1 top-1 w-4 h-2 bg-yellow-300 rounded-sm" />
              <div className="absolute right-1 top-1 w-4 h-2 bg-yellow-300 rounded-sm" />
              
              {/* Rodas */}
              <div className="absolute left-0 top-12 w-3 h-10 bg-gray-900 rounded-l-lg" />
              <div className="absolute right-0 top-12 w-3 h-10 bg-gray-900 rounded-r-lg" />
              <div className="absolute left-0 bottom-2 w-3 h-10 bg-gray-900 rounded-l-lg" />
              <div className="absolute right-0 bottom-2 w-3 h-10 bg-gray-900 rounded-r-lg" />
            </div>
          </div>
          
          {/* Efeito de turbo */}
          {isTurboActive && (
            <>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-16"
                style={{
                  background: 'linear-gradient(to top, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.8))',
                  filter: 'blur(4px)',
                  zIndex: -1,
                  animation: 'flameFlicker 0.1s ease-in-out infinite'
                }}
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-12"
                style={{
                  background: 'linear-gradient(to top, rgba(239, 68, 68, 0), rgba(239, 68, 68, 0.8))',
                  filter: 'blur(3px)',
                  zIndex: -2,
                  animation: 'flameFlicker 0.15s ease-in-out infinite'
                }}
              />
            </>
          )}
          
          {/* Rastro de poeira/fumaça quando em movimento */}
          {isMoving && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-14 h-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={`dust-${i}`}
                  className="absolute rounded-full bg-gray-300 opacity-50"
                  style={{
                    width: `${3 + Math.random() * 6}px`,
                    height: `${3 + Math.random() * 6}px`,
                    left: `${Math.random() * 100}%`,
                    bottom: `${Math.random() * 100}%`,
                    filter: 'blur(1px)',
                    animation: `dustParticle ${0.5 + Math.random()}s infinite`,
                    animationDelay: `${Math.random() * 0.5}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Indicador de boost */}
        {boost && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-yellow-400 text-4xl font-bold animate-pulse">
              ⚡ TURBO! ⚡
            </div>
          </div>
        )}

        {/* Instruções de controle */}
        <div className="absolute top-20 left-4 bg-black bg-opacity-60 text-white p-3 rounded-lg">
          <div className="text-sm font-bold mb-2">🎮 CONTROLES:</div>
          <div className="text-xs space-y-1">
            <div>← → ou A/D: Trocar pista</div>
            <div>ESPAÇO: Turbo</div>
          </div>
          <div className="text-xs text-yellow-300 mt-2 border-t border-white border-opacity-20 pt-1">
            <div className="font-bold">⚠️ ATENÇÃO:</div>
            <div>• Evite colidir com os carros</div>
            <div>• Máximo 3 erros seguidos</div>
          </div>
        </div>

        {/* Controles na tela para dispositivos móveis - mais visíveis e com melhor feedback */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 px-4">
          <button
            className="w-20 h-20 rounded-full bg-blue-600 text-white text-4xl flex justify-center items-center shadow-lg active:bg-blue-700 active:scale-95 focus:outline-none relative overflow-hidden"
            onClick={() => currentLane > 0 && setCurrentLane(prev => prev - 1)}
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transform: currentLane === 0 ? 'scale(0.9)' : 'scale(1)',
              opacity: currentLane === 0 ? '0.7' : '1',
              transition: 'all 0.2s ease-out',
            }}
          >
            <span className="transform -translate-y-1">←</span>
            {/* Efeito de onda quando pressionado */}
            <div className="absolute inset-0 bg-white opacity-20 scale-0 rounded-full" 
                 style={{animation: 'ripple 0.8s ease-out'}}></div>
          </button>
          
          <button
            className="w-24 h-24 rounded-full text-white text-2xl font-bold flex flex-col justify-center items-center shadow-lg focus:outline-none relative overflow-hidden"
            onClick={activateBoost}
            disabled={boost}
            style={{
              background: isTurboActive 
                ? 'radial-gradient(circle, #ef4444 0%, #b91c1c 100%)' 
                : 'radial-gradient(circle, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: isTurboActive 
                ? '0 0 20px rgba(239, 68, 68, 0.7), 0 4px 8px rgba(0,0,0,0.4)' 
                : '0 4px 12px rgba(0,0,0,0.4)',
              transform: isTurboActive ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease-out',
            }}
          >
            <span>{isTurboActive ? "TURBO" : "TURBO"}</span>
            <Zap size={28} className={`mt-1 ${isTurboActive ? 'animate-pulse' : ''}`} />
            
            {/* Efeito de ondas quando turbo ativado */}
            {isTurboActive && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-white opacity-40"
                     style={{animation: 'pulse-out 1s infinite'}}></div>
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-20"
                     style={{animation: 'pulse-out 1s infinite 0.3s'}}></div>
              </>
            )}
          </button>
          
          <button
            className="w-20 h-20 rounded-full bg-blue-600 text-white text-4xl flex justify-center items-center shadow-lg active:bg-blue-700 active:scale-95 focus:outline-none relative overflow-hidden"
            onClick={() => currentLane < 2 && setCurrentLane(prev => prev + 1)}
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transform: currentLane === 2 ? 'scale(0.9)' : 'scale(1)',
              opacity: currentLane === 2 ? '0.7' : '1',
              transition: 'all 0.2s ease-out',
            }}
          >
            <span className="transform -translate-y-1">→</span>
            {/* Efeito de onda quando pressionado */}
            <div className="absolute inset-0 bg-white opacity-20 scale-0 rounded-full" 
                 style={{animation: 'ripple 0.8s ease-out'}}></div>
          </button>
        </div>
        
        {/* Animações adicionais para controles */}
        <style>
          {`
            @keyframes ripple {
              0% { transform: scale(0); opacity: 0.5; }
              100% { transform: scale(2.5); opacity: 0; }
            }
            @keyframes pulse-out {
              0% { transform: scale(0.8); opacity: 0.4; }
              100% { transform: scale(1.2); opacity: 0; }
            }
          `}
        </style>

        {/* HUD - Painel de informações */}
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center bg-black bg-opacity-30 text-white">
          <div className="flex items-center space-x-2">
            <Clock size={20} />
            <span className="font-bold">{timeLeft}s</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="font-bold">{Math.floor(distance)}m</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Trophy size={20} />
            <span className="font-bold">{score}</span>
          </div>
        </div>
        
        {/* Velocímetro com efeito visual mais dinâmico */}
        <div className="absolute right-6 top-20 w-28 h-28 rounded-full bg-gray-800 border-4 border-gray-300 flex flex-col justify-center items-center shadow-lg"
             style={{
               transform: `rotate(${isTurboActive ? speed * 3 : 0}deg)`,
               transition: 'transform 0.5s ease-out',
             }}>
          <div className="text-xs text-gray-300">VELOC.</div>
          <div className="text-3xl font-bold text-white">{Math.floor(speed * 100)}</div>
          <div className="text-xs text-gray-300">km/h</div>
          
          {/* Indicador de velocidade ao redor do velocímetro */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 rounded-full"
                 style={{
                   background: `conic-gradient(
                     from 225deg,
                     ${isTurboActive ? '#ef4444' : '#3b82f6'} 0%,
                     ${isTurboActive ? '#ef4444' : '#3b82f6'} ${(speed / 5) * 75}%,
                     transparent ${(speed / 5) * 75}%,
                     transparent 100%
                   )`,
                   opacity: 0.8,
                 }}></div>
          </div>
          
          {/* Efeito de brilho quando turbo ativo */}
          {isTurboActive && (
            <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Pista simples sem elementos laterais */}
        
        {/* Carros adversários - Debug */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded text-xs z-50">
          Carros: {opponentCars.length}
          {opponentCars.map(car => (
            <div key={car.id}>
              Carro {car.id}: Pista {car.lane}, Pos {car.position.toFixed(1)}
            </div>
          ))}
        </div>
        
        {/* Carros adversários com design melhorado - sentido contrário */}
        {opponentCars.map((car) => (
          <div 
            key={car.id}
            className="absolute"
            style={{
              left: `${lanes[car.lane]}%`,
              bottom: `${car.position}%`,
              width: '60px',
              height: '100px',
              transform: `translateX(-50%) rotate(180deg)`, // Rotação para simular sentido contrário
              zIndex: 30,
            }}
          >
            {/* Corpo principal do carro adversário */}
            <div className="relative w-full h-full">
              {/* Sombra do carro */}
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-black opacity-30 rounded-full"
                style={{ filter: 'blur(2px)' }}
              />
              
              {/* Corpo do carro - cores variadas para diferenciação */}
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: car.id % 3 === 0 ? '#2563eb' : car.id % 3 === 1 ? '#dc2626' : '#16a34a', // Azul, vermelho ou verde
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)',
                }}
              >
                {/* Faixa central do carro adversário */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-3 bg-white" />
                
                {/* Janelas */}
                <div className="absolute left-1/4 right-1/4 top-1 h-6 bg-gray-200 rounded-t-lg" />
                
                {/* Faróis (agora na traseira por causa da rotação) */}
                <div className="absolute left-1 top-1 w-3 h-2 bg-red-500 rounded-sm" />
                <div className="absolute right-1 top-1 w-3 h-2 bg-red-500 rounded-sm" />
                
                {/* Rodas */}
                <div className="absolute left-0 top-8 w-2 h-8 bg-gray-900 rounded-l-lg" />
                <div className="absolute right-0 top-8 w-2 h-8 bg-gray-900 rounded-r-lg" />
                <div className="absolute left-0 bottom-2 w-2 h-8 bg-gray-900 rounded-l-lg" />
                <div className="absolute right-0 bottom-2 w-2 h-8 bg-gray-900 rounded-r-lg" />
              </div>
            </div>
          </div>
        ))}
        
        {/* Removido indicador de debug */}

        {/* Sem efeito de colisão */}
      </div>
    </div>
  );
};

export default RacingGame;

