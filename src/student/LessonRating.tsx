import React, { useState } from 'react';

interface LessonRatingProps {
  onRate: (stars: number) => void;
}

const LessonRating: React.FC<LessonRatingProps> = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => { setRating(star); onRate(star); }}
          className="focus:outline-none"
        >
          <span style={{color: star <= rating ? '#ffb646' : '#0029ff'}} className="text-xl">★</span>
        </button>
      ))}
      <span className="ml-2 text-sm">{rating > 0 ? `${rating} estrelas` : 'Avalie a aula'}</span>
    </div>
  );
};

export default LessonRating;
