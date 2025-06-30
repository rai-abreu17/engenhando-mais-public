
import { OpponentCar, Question } from './types';
import { CAR_COLORS, QUESTIONS } from './constants';

export const getRandomQuestion = (): Question => {
  return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
};

export const createOpponentCar = (lane: number): OpponentCar => {
  return {
    id: Date.now() + Math.random(),
    lane,
    position: 140,
    speed: 1.2 + Math.random() * 1.5,
    color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
  };
};

export const calculateCoinsReward = (score: number, distance: number): number => {
  return Math.floor(score / 12) + Math.floor(distance / 25);
};

export const getGameOverReason = (consecutiveWrongAnswers: number, timeLeft: number): string => {
  if (consecutiveWrongAnswers >= 3) {
    return "Você errou 3 perguntas seguidas!";
  } else if (timeLeft === 0) {
    return "O tempo acabou!";
  } else {
    return "Você colidiu com outro carro!";
  }
};
