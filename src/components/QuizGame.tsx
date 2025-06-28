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
    if (gamePhase === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === 'playing') {
      handleAnswer(-1); // Tempo esgotado
    }
  }, [timeLeft, gamePhase]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setGamePhase('result');
    setShowExplanation(true);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-engenha-light-cream rounded-xl p-6 mx-4 max-w-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-engenha-dark-navy">
              {currentQ.subject}
            </span>
            <span className="bg-engenha-sky-blue text-white px-2 py-1 rounded text-xs">
              {difficulty.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="text-engenha-orange" size={16} />
            <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-engenha-dark-navy'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-engenha-dark-navy mb-1">
            <span>Questão {currentQuestion + 1} de {filteredQuestions.length}</span>
            <span>Pontos: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-engenha-sky-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center justify-center mb-4 bg-engenha-gold bg-opacity-20 rounded-lg p-2">
            <Star className="text-engenha-gold mr-2" size={16} />
            <span className="text-sm font-medium text-engenha-dark-navy">
              Sequência: {streak} acertos!
            </span>
          </div>
        )}

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-engenha-dark-navy mb-4">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={gamePhase !== 'playing'}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  gamePhase === 'playing'
                    ? 'border-engenha-sky-blue bg-engenha-light-blue hover:bg-engenha-sky-blue hover:text-white'
                    : selectedAnswer === index
                    ? index === currentQ.correct
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-red-500 bg-red-100 text-red-800'
                    : index === currentQ.correct
                    ? 'border-green-500 bg-green-100 text-green-800'
                    : 'border-gray-300 bg-gray-100 text-gray-600'
                }`}
              >
                <div className="flex items-center">
                  {gamePhase === 'result' && (
                    <div className="mr-3">
                      {index === currentQ.correct ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : selectedAnswer === index ? (
                        <XCircle className="text-red-600" size={20} />
                      ) : null}
                    </div>
                  )}
                  <span className="font-medium">{String.fromCharCode(65 + index)})</span>
                  <span className="ml-2">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-engenha-light-blue rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-engenha-dark-navy mb-2">Explicação:</h4>
            <p className="text-sm text-engenha-dark-navy">{currentQ.explanation}</p>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400"
        >
          Sair do Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizGame;

