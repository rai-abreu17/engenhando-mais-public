import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface StudentRatingProps {
  onSubmit: (rating: number, comment: string) => void;
}

export const StudentRating: React.FC<StudentRatingProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    
    onSubmit(rating, comment);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
    }, 3000);
  };

  if (submitted) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-green-600 fill-current" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Obrigado pela avaliação!</h3>
          <p className="text-green-600">Sua opinião é muito importante para nós.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-engenha-sky-blue/20">
      <h3 className="text-xl font-bold text-engenha-dark-navy mb-4">
        Avalie esta aula
      </h3>
      
      <p className="text-engenha-blue mb-6">
        Como você avalia o conteúdo desta aula? Sua avaliação nos ajuda a melhorar!
      </p>

      {/* Rating Stars */}
      <div className="flex gap-2 mb-6 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                (hoveredRating >= star || rating >= star)
                  ? "text-engenha-gold fill-current"
                  : "text-engenha-sky-blue"
              )}
            />
          </button>
        ))}
      </div>

      {/* Rating Text */}
      {rating > 0 && (
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-engenha-dark-navy">
            {rating === 1 && "Muito ruim"}
            {rating === 2 && "Ruim"}
            {rating === 3 && "Regular"}
            {rating === 4 && "Bom"}
            {rating === 5 && "Excelente"}
          </p>
        </div>
      )}

      {/* Comment */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-engenha-dark-navy mb-2">
          Deixe um comentário (opcional)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua opinião sobre a aula..."
          className="min-h-[80px] border-engenha-sky-blue/30 focus:border-engenha-bright-blue"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full bg-engenha-bright-blue hover:bg-engenha-blue disabled:opacity-50"
      >
        <Send className="h-4 w-4 mr-2" />
        Enviar Avaliação
      </Button>

      {/* Quick feedback options */}
      {rating > 0 && (
        <div className="mt-4">
          <p className="text-xs text-engenha-blue mb-2">Feedback rápido:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Muito claro",
              "Boa explicação", 
              "Ritmo adequado",
              "Exemplos úteis",
              "Conteúdo completo"
            ].map((feedback, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setComment(prev => prev ? `${prev}, ${feedback}` : feedback)}
                className="text-xs border-engenha-sky-blue/50 text-engenha-blue hover:bg-engenha-light-blue/50"
              >
                {feedback}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};