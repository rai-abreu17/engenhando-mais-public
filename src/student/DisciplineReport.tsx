import React from 'react';

interface QuestionFeedback {
  question: string;
  correct: boolean;
  feedback?: string;
}

interface DisciplineReportProps {
  discipline: string;
  questions: QuestionFeedback[];
}

const DisciplineReport: React.FC<DisciplineReportProps> = ({ discipline, questions }) => {
  const correctCount = questions.filter(q => q.correct).length;
  const total = questions.length;

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-blue-200 mb-4">
      <h3 className="font-bold text-lg mb-2">Relatório: {discipline}</h3>
      <p className="mb-2">Acertos: {correctCount} / {total}</p>
      <ul className="space-y-2">
        {questions.map((q, idx) => (
          <li key={idx} className="text-sm">
            <span style={{color: q.correct ? '#0029ff' : '#d75200'}}>
              {q.correct ? '✔️' : '❌'}
            </span>
            {' '}Questão: {q.question}
            {!q.correct && q.feedback && (
              <span className="ml-2 text-[#030025]">Feedback: {q.feedback}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisciplineReport;
