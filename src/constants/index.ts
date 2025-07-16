/**
 * Application constants
 * 
 * This file contains all the constant values used throughout the application
 * to ensure consistency and make maintenance easier.
 */

export const APP_CONFIG = {
  NAME: 'Engenhando Mais',
  VERSION: '1.0.0',
  DEFAULT_TIMEOUT: 5000,
} as const;

export const COLORS = {
  PRIMARY: '#0029ff',
  SECONDARY: '#28b0ff',
  ACCENT: '#ff7a28',
  WARNING: '#ffb646',
  DANGER: '#d75200',
  SUCCESS: '#00a86b',
  BACKGROUND: '#f0f6ff',
  SURFACE: '#fffaf0',
  TEXT_PRIMARY: '#030025',
  TEXT_SECONDARY: '#001cab',
  BORDER: '#28b0ff',
} as const;

export const GAME_CONFIG = {
  QUIZ: {
    TIME_PER_QUESTION: 30,
    POINTS_PER_CORRECT: {
      easy: 15,
      medium: 25,
      hard: 40,
    },
    TIME_BONUS_MULTIPLIER: 0.1,
  },
  RACING: {
    GAME_DURATION: 120,
    CAR_SPEED: 2,
    QUESTION_INTERVAL: 15,
  },
  SHOOTING: {
    GAME_DURATION: 90,
    BULLET_SPEED: 5,
    ENEMY_SPAWN_RATE: 2000,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  BIBLIOTECA: '/biblioteca',
  MASCOTE: '/mascote',
  MASCOTE_INTERATIVO: '/mascote-interativo',
  MASCOTE_NOVO: '/mascote-novo',
  CONFIGURACOES: '/configuracoes',
  NOT_FOUND: '/404',
} as const;

export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  MASCOT_DATA: 'mascot_data',
  GAME_PROGRESS: 'game_progress',
  SETTINGS: 'app_settings',
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
