
export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string;
}

export interface OpponentCar {
  id: number;
  lane: number;
  position: number;
  speed: number;
  color: string;
}

export type GameState = 'playing' | 'question' | 'finished';
export type EndGameReason = 'time' | 'collision' | 'questions' | null;
