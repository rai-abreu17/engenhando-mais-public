import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuestionModalProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  onClose: () => void;
}

interface ErrorReasonModalProps {
  onSelect: (reason: string) => void;
  onRewatch: () => void;
  onContinue: () => void;
}

interface SuccessModalProps {
  explanation?: string;
  onContinue: () => void;
}

interface RewatchModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({ 
  question, 
  onAnswer, 
  onClose 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const answerIndex = parseInt(selectedAnswer);
    const correct = answerIndex === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      onAnswer(correct);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white">
        <div className="p-6">
          {!showResult ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-engenha-dark-navy">Pergunta da Aula</h3>
                <div className="px-3 py-1 bg-engenha-orange/10 text-engenha-orange rounded-full text-sm font-medium">
                  Questão {question.id}
                </div>
              </div>

              <p className="text-lg text-engenha-blue mb-6">{question.question}</p>

              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 p-3 rounded-lg border border-engenha-sky-blue/30 hover:bg-engenha-light-blue/50 cursor-pointer transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="w-full bg-engenha-bright-blue hover:bg-engenha-blue"
                >
                  Responder
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                isCorrect ? "bg-green-100" : "bg-red-100"
              )}>
                {isCorrect ? (
                  <CheckCircle className="h-10 w-10 text-green-600" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              
              <h3 className={cn(
                "text-2xl font-bold mb-2",
                isCorrect ? "text-green-600" : "text-red-600"
              )}>
                {isCorrect ? "Parabéns!" : "Ops!"}
              </h3>
              
              <p className="text-engenha-blue mb-4">
                {isCorrect 
                  ? "Você acertou a questão!" 
                  : "Resposta incorreta. Vamos continuar aprendendo!"
                }
              </p>
              
              {question.explanation && (
                <div className="bg-engenha-light-blue/30 p-4 rounded-lg mb-4">
                  <p className="text-sm text-engenha-dark-navy">{question.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export const ErrorReasonModal: React.FC<ErrorReasonModalProps> = ({ 
  onSelect, 
  onRewatch, 
  onContinue 
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');

  const reasons = [
    'Falta de atenção',
    'Não ficou claro o conceito',
    'Conteúdo muito rápido',
    'Preciso de mais exemplos',
    'Distrações externas'
  ];

  const handleContinue = () => {
    if (selectedReason) {
      onSelect(selectedReason);
    }
    onContinue();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-engenha-orange" />
            <h3 className="text-xl font-bold text-engenha-dark-navy">
              O que pode ter causado o erro?
            </h3>
          </div>

          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            <div className="space-y-3 mb-6">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={reason} id={`reason-${index}`} />
                  <Label 
                    htmlFor={`reason-${index}`} 
                    className="flex-1 p-2 cursor-pointer"
                  >
                    {reason}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          <p className="text-sm text-engenha-blue mb-6">
            Gostaria de reassistir o conteúdo desde a última estrela para entender melhor?
          </p>

          <div className="flex gap-3">
            <Button 
              onClick={onRewatch}
              className="flex-1 bg-engenha-bright-blue hover:bg-engenha-blue"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reassistir
            </Button>
            <Button 
              variant="outline" 
              onClick={handleContinue}
              className="flex-1 border-engenha-sky-blue text-engenha-blue hover:bg-engenha-light-blue"
            >
              Continuar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const SuccessModal: React.FC<SuccessModalProps> = ({ 
  explanation, 
  onContinue 
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-green-600 mb-2">Excelente!</h3>
          <p className="text-engenha-blue mb-4">Você respondeu corretamente!</p>
          
          {explanation && (
            <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
              <h4 className="font-semibold text-green-800 mb-2">Explicação:</h4>
              <p className="text-sm text-green-700">{explanation}</p>
            </div>
          )}

          <Button 
            onClick={onContinue}
            className="w-full bg-engenha-bright-blue hover:bg-engenha-blue"
          >
            Continuar Assistindo
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const RewatchModal: React.FC<RewatchModalProps> = ({ 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-engenha-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="h-8 w-8 text-engenha-bright-blue" />
          </div>
          
          <h3 className="text-xl font-bold text-engenha-dark-navy mb-2">
            Reassistir Conteúdo
          </h3>
          <p className="text-engenha-blue mb-6">
            O vídeo voltará para a última estrela e você poderá revisar o conteúdo antes de tentar novamente.
          </p>

          <div className="flex gap-3">
            <Button 
              onClick={onConfirm}
              className="flex-1 bg-engenha-bright-blue hover:bg-engenha-blue"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Confirmar
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 border-engenha-sky-blue text-engenha-blue hover:bg-engenha-light-blue"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};