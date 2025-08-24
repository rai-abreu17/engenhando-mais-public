/**
 * Global type definitions for the Engenhando Mais application
 * 
 * This file contains all the shared type definitions used across the application
 * to ensure type safety and consistency.
 */

export interface BaseEntity {
  id: number | string;
}

export interface Video extends BaseEntity {
  title: string;
  subject: string;
  duration: string;
  thumbnail: string;
  difficulty?: string;
  creator?: string;
  watchedAt?: Date;
}

export interface RecentVideo extends Video {
  progress: number;
  lessonId?: string;
}

export interface PopularVideo extends BaseEntity {
  title: string;
  subject: string;
  difficulty: string;
  thumbnail: string;
  lessonId?: string;
}

export interface Subject extends BaseEntity {
  name: string;
  icon: string;
  progress: number;
  videoCount: number;
  color: string;
  isMine: boolean;
  isFavorite: boolean;
  lastAccessed: Date | null;
}

export interface MascotStats {
  hunger: number;
  energy: number;
  happiness: number;
  health: number;
}

export interface Mascot extends BaseEntity {
  name: string;
  type: string;
  level: number;
  experience: number;
  stats: MascotStats;
  color?: string;
  accessory?: string;
}

export interface GameQuestion extends BaseEntity {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  coinsEarned: number;
}

export interface UserProfile {
  name: string;
  email: string;
  university: string;
  course: string;
  semester: number;
  avatar?: string;
}

export type FilterType = 'Todas' | 'Minhas Disciplinas' | 'Favoritas' | 'Recentes';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type GamePhase = 'idle' | 'playing' | 'paused' | 'finished';
