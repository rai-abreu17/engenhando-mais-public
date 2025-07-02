
import { OpponentCar, Question } from './types';
import { CAR_COLORS, QUESTIONS } from './constants';

export const getRandomQuestion = (): Question => {
  return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
};

export const createOpponentCar = (lane: number): OpponentCar => {
  const car = {
    id: Date.now() + Math.random(),
    lane,
    position: 140 + Math.random() * 20, // Posição inicial mais variada
    speed: 1.5 + Math.random() * 1.0, // Velocidade mais variada
    color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]
  };
  
  console.log('🚗 Criando novo carro:', {
    id: car.id.toString().slice(-6),
    lane: car.lane + 1,
    position: car.position.toFixed(1),
    speed: car.speed.toFixed(2),
    color: car.color
  });
  
  return car;
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
