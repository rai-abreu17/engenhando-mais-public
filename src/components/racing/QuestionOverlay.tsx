
import React from 'react';
import { Question } from './types';

interface QuestionOverlayProps {
  question: Question;
  questionTimeLeft: number;
  onAnswer: (answerIndex: number) => void;
}

const QuestionOverlay: React.FC<QuestionOverlayProps> = ({ 
  question, 
  questionTimeLeft, 
  onAnswer 
}) => {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-20 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{question.subject}</h2>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            {questionTimeLeft}s
          </div>
        </div>
        
        <p className="text-lg mb-6">{question.question}</p>
        
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="p-3 text-left bg-gray-100 hover:bg-blue-100 transition-colors rounded-lg"
              onClick={() => onAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionOverlay;
