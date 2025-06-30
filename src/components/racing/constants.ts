
import { Question } from './types';

export const LANES = [25, 50, 75]; // Posições das pistas em %
export const CAR_COLORS = ['#dc2626', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed'];

export const GAME_CONFIG = {
  INITIAL_TIME: 60,
  QUESTION_TIME: 10,
  PROTECTION_TIME: 3,
  INITIAL_SPEED: 3,
  MAX_SPEED: 7,
  MIN_SPEED: 1.5,
  BOOST_MULTIPLIER: 1.8,
  BOOST_DURATION: 2000,
  MAX_CONSECUTIVE_WRONG: 3,
  MAX_OPPONENT_CARS: 5,
  SPAWN_CHANCE: 0.05,
  COLLISION_RANGE_MIN: 10,
  COLLISION_RANGE_MAX: 25,
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Qual é a fórmula da velocidade?",
    options: ["v = d/t", "v = d*t", "v = t/d", "v = d+t"],
    correct: 0,
    subject: "Física"
  },
  {
    id: 2,
    question: "Qual é a unidade de aceleração no SI?",
    options: ["m/s", "m/s²", "km/h", "N"],
    correct: 1,
    subject: "Física"
  },
  {
    id: 3,
    question: "Qual é a derivada de x³?",
    options: ["3x²", "x²", "3x", "x³"],
    correct: 0,
    subject: "Matemática"
  },
  {
    id: 4,
    question: "Qual é a força necessária para acelerar 10kg a 2m/s²?",
    options: ["5N", "12N", "20N", "8N"],
    correct: 2,
    subject: "Física"
  },
  {
    id: 5,
    question: "Qual é o resultado de 2³?",
    options: ["6", "8", "9", "4"],
    correct: 1,
    subject: "Matemática"
  }
];
