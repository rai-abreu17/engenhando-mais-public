import React from 'react';
import DisciplineReport from './DisciplineReport';
import LessonRating from './LessonRating';

const StudentApp: React.FC = () => {
  // Exemplo de uso dos componentes
  const questions = [
    { question: 'Questão 1', correct: true },
    { question: 'Questão 2', correct: false, feedback: 'Reveja o conceito X.' },
    { question: 'Questão 3', correct: true },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fluxo do Aluno</h1>
      <DisciplineReport discipline="Matemática" questions={questions} />
      <LessonRating onRate={stars => alert(`Você avaliou com ${stars} estrelas!`)} />
    </div>
  );
};

export default StudentApp;
