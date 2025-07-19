/**
 * Constantes da aplicação
 * Centralizando valores importantes para fácil manutenção
 */

// Breakpoints responsivos
export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px',
} as const;

// Configurações de carrossel
export const CAROUSEL_CONFIG = {
  itemsPerView: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  autoplayDelay: 3000,
  animationDuration: 300,
} as const;

// Configurações de authenticação
export const AUTH_CONFIG = {
  tokenKey: 'engenha_token',
  userTypeKey: 'engenha_user_type',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher', 
  STUDENT: 'student',
} as const;

// Rotas base por tipo de usuário
export const BASE_ROUTES = {
  [USER_ROLES.ADMIN]: '/admin/dashboard',
  [USER_ROLES.TEACHER]: '/teacher/dashboard',
  [USER_ROLES.STUDENT]: '/home',
} as const;

// Configurações de games
export const GAME_CONFIG = {
  racing: {
    lanes: 3,
    carSpeed: 2,
    questionInterval: 5000,
  },
  quiz: {
    timeLimit: 30000,
    pointsPerCorrect: 10,
  },
} as const;

// Status de lições
export const LESSON_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending', 
  REJECTED: 'rejected',
} as const;

// Dificuldades
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type LessonStatus = typeof LESSON_STATUS[keyof typeof LESSON_STATUS];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];