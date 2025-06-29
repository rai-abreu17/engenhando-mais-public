import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy, Clock, Star } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
}

interface QuizGameProps {
  onGameEnd: (score: number, coins: number) => void;
  onClose: () => void;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizGame: React.FC<QuizGameProps> = ({ onGameEnd, onClose, difficulty }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'playing' | 'result' | 'finished'>('playing');
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "Qual é a derivada de x²?",
      options: ["2x", "x", "2", "x²"],
      correct: 0,
      explanation: "A derivada de x² é 2x, usando a regra da potência: d/dx(xⁿ) = n·xⁿ⁻¹",
      difficulty: 'easy',
      subject: 'Cálculo'
    },
    {
      id: 2,
      question: "Qual é a unidade de força no Sistema Internacional?",
      options: ["Joule", "Newton", "Watt", "Pascal"],
      correct: 1,
      explanation: "Newton (N) é a unidade de força no SI. 1 Newton = 1 kg·m/s²",
      difficulty: 'easy',
      subject: 'Física'
    },
    {
      id: 3,
      question: "Qual é o resultado de ∫x dx?",
      options: ["x²/2 + C", "x + C", "2x + C", "x²"],
      correct: 0,
      explanation: "A integral de x é x²/2 + C, onde C é a constante de integração",
      difficulty: 'medium',
      subject: 'Cálculo'
    },
    {
      id: 4,
      question: "Qual lei da termodinâmica afirma que a energia não pode ser criada nem destruída?",
      options: ["Lei Zero", "Primeira Lei", "Segunda Lei", "Terceira Lei"],
      correct: 1,
      explanation: "A Primeira Lei da Termodinâmica é o princípio da conservação de energia",
      difficulty: 'medium',
      subject: 'Física'
    },
    {
      id: 5,
      question: "Qual é o limite de (sin x)/x quando x tende a 0?",
      options: ["0", "1", "∞", "Não existe"],
      correct: 1,
      explanation: "Este é um limite fundamental: lim(x→0) (sin x)/x = 1",
      difficulty: 'hard',
      subject: 'Cálculo'
    }
  ];

  const filteredQuestions = questions.filter(q => q.difficulty === difficulty).slice(0, 3);
  const currentQ = filteredQuestions[currentQuestion];

  useEffect(() => {
    if (gamePhase === 'playing' && gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'playing') {
      handleAnswer(-1); // Tempo esgotado
    }
  }, [timeLeft, gamePhase, gameStarted]);

  const handleAnswer = (answerIndex: number) => {
    if (!gameStarted) return;
    
    setSelectedAnswer(answerIndex);
    setGamePhase('result');
    setShowExplanation(true);

    // Feedback tátil baseado na resposta
    if (navigator.vibrate) {
      if (answerIndex === currentQ.correct) {
        navigator.vibrate(100); // Vibração de sucesso
      } else {
        navigator.vibrate([50, 50, 50]); // Vibração de erro
      }
    }

    if (answerIndex === currentQ.correct) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      const timeBonus = Math.floor(timeLeft / 5);
      const streakBonus = streak * 5;
      const totalPoints = points + timeBonus + streakBonus;
      
      setScore(score + totalPoints);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
        setGamePhase('playing');
        setShowExplanation(false);
      } else {
        setGamePhase('finished');
      }
    }, 3000);
  };

  const getCoinsReward = () => {
    const baseReward = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40;
    const scoreMultiplier = Math.floor(score / 50);
    return baseReward + scoreMultiplier * 5;
  };

  const getPerformanceMessage = () => {
    const percentage = (score / (filteredQuestions.length * 30)) * 100;
    if (percentage >= 80) return "Excelente! 🌟";
    if (percentage >= 60) return "Muito bom! 👏";
    if (percentage >= 40) return "Bom trabalho! 👍";
    return "Continue praticando! 💪";
  };

  if (gamePhase === 'finished') {
    const coinsEarned = getCoinsReward();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-md w-full">
          <div className="text-center">
            <Trophy className="mx-auto text-engenha-gold mb-4" size={48} />
            <h2 className="text-2xl font-bold text-engenha-dark-navy mb-2">
              Quiz Concluído!
            </h2>
            <p className="text-lg text-engenha-dark-navy mb-4">
              {getPerformanceMessage()}
            </p>
            
            <div className="bg-engenha-light-blue rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Pontuação:</span>
                <span className="font-bold text-engenha-dark-navy">{score} pts</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-engenha-dark-navy">Sequência máxima:</span>
                <span className="font-bold text-engenha-dark-navy">{streak}</span>
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

  if (!currentQ) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Tela inicial */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="text-center text-white max-w-lg mx-4 animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce">🧠</div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4 animate-pulse">
              QUIZ TIME
            </h1>
            <div className="text-xl mb-8 text-gray-300 leading-relaxed">
              Teste seus conhecimentos com perguntas de<br/>
              <span className="text-yellow-400 font-bold">{currentQ.subject}</span> em nível <span className="text-green-400 font-bold">{difficulty.toUpperCase()}</span>!
            </div>
            
            <div className="bg-gray-900 bg-opacity-80 rounded-xl p-6 mb-8 text-left border-2 border-purple-400">
              <h3 className="text-purple-400 font-bold text-xl mb-4 text-center">📋 Informações</h3>
              <div className="space-y-3 text-lg">
                <div className="flex items-center justify-between">
                  <span>🎯 Questões:</span>
                  <span className="font-bold text-cyan-400">{filteredQuestions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>⏱️ Tempo por questão:</span>
                  <span className="font-bold text-yellow-400">30s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>📊 Nível:</span>
                  <span className={`font-bold ${
                    difficulty === 'easy' ? 'text-green-400' : 
                    difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {difficulty.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🪙 Recompensa base:</span>
                  <span className="font-bold text-yellow-400">
                    {difficulty === 'easy' ? '15' : difficulty === 'medium' ? '25' : '40'} moedas
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center text-purple-300 text-sm">
                💡 Responda rápido para ganhar bônus de tempo!
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setGameStarted(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-bold py-4 px-10 rounded-xl text-2xl transition-all transform hover:scale-110 shadow-lg hover:shadow-purple-500/25 animate-pulse"
              >
                🚀 COMEÇAR QUIZ
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

      <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-2xl w-full border-4 border-purple-400">
        {/* Header aprimorado */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold">
              {currentQ.subject}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
              difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
              difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {difficulty.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <Clock className="text-purple-600" size={20} />
              <span className={`font-bold text-xl ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-purple-600'}`}>
                {timeLeft}s
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              ❌
            </button>
          </div>
        </div>

        {/* Progress bar aprimorada */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">
              Questão {currentQuestion + 1} de {filteredQuestions.length}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-bold text-purple-600">
                💰 {score} pontos
              </span>
              {streak > 0 && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                  🔥 {streak} sequência
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Streak display aprimorado */}
        {streak > 0 && (
          <div className="flex items-center justify-center mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-300">
            <Star className="text-yellow-600 mr-2 animate-spin" size={24} />
            <span className="text-lg font-bold text-yellow-800">
              🔥 SEQUÊNCIA DE {streak} ACERTOS! Você está voando!
            </span>
            <Star className="text-yellow-600 ml-2 animate-spin" size={24} />
          </div>
        )}

        {/* Question aprimorada */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border-l-4 border-purple-500">
            <h3 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          <div className="grid gap-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={gamePhase !== 'playing' || !gameStarted}
                className={`p-4 rounded-xl border-3 text-left transition-all transform hover:scale-[1.02] shadow-lg ${
                  gamePhase === 'playing' && gameStarted
                    ? 'border-purple-300 bg-white hover:bg-purple-50 hover:border-purple-500 hover:shadow-purple-200'
                    : selectedAnswer === index
                    ? index === currentQ.correct
                      ? 'border-green-500 bg-green-50 text-green-800 shadow-green-200'
                      : 'border-red-500 bg-red-50 text-red-800 shadow-red-200'
                    : index === currentQ.correct
                    ? 'border-green-500 bg-green-50 text-green-800 shadow-green-200'
                    : 'border-gray-300 bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center">
                  {gamePhase === 'result' && (
                    <div className="mr-4">
                      {index === currentQ.correct ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-white" size={20} />
                        </div>
                      ) : selectedAnswer === index ? (
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <XCircle className="text-white" size={20} />
                        </div>
                      ) : (
                        <div className="w-8 h-8"></div>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-lg font-medium">{option}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation aprimorada */}
        {showExplanation && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 text-white p-2 rounded-full mr-3">
                💡
              </div>
              <h4 className="text-xl font-bold text-blue-800">Explicação</h4>
            </div>
            <p className="text-blue-700 text-lg leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Dica de tempo */}
        {timeLeft <= 10 && gamePhase === 'playing' && gameStarted && (
          <div className="text-center mb-4">
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold animate-pulse">
              ⏰ Tempo se esgotando! {timeLeft}s restantes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;

