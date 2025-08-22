/**
 * Mock data for the application
 * 
 * This file contains all the mock data used throughout the application
 * for development and testing purposes.
 */

import { Subject, RecentVideo, PopularVideo, GameQuestion } from '../types';

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: 'Cálculo I',
    icon: '∫',
    progress: 75,
    videoCount: 24,
    color: 'bg-[#0029ff]',
    isMine: true,
    isFavorite: true,
    lastAccessed: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Física I',
    icon: '⚗️',
    progress: 45,
    videoCount: 18,
    color: 'bg-[#28b0ff]',
    isMine: true,
    isFavorite: false,
    lastAccessed: new Date('2024-01-14')
  },
  {
    id: 3,
    name: 'Algoritmos',
    icon: '💻',
    progress: 60,
    videoCount: 32,
    color: 'bg-[#ff7a28]',
    isMine: true,
    isFavorite: true,
    lastAccessed: new Date('2024-01-13')
  },
  {
    id: 4,
    name: 'Álgebra Linear',
    icon: '📊',
    progress: 30,
    videoCount: 20,
    color: 'bg-[#d75200]',
    isMine: true,
    isFavorite: false,
    lastAccessed: new Date('2024-01-12')
  },
  {
    id: 5,
    name: 'Química Geral',
    icon: '🧪',
    progress: 0,
    videoCount: 15,
    color: 'bg-[#ffb646]',
    isMine: false,
    isFavorite: false,
    lastAccessed: null
  },
  {
    id: 6,
    name: 'Estatística',
    icon: '📈',
    progress: 0,
    videoCount: 22,
    color: 'bg-[#001cab]',
    isMine: false,
    isFavorite: false,
    lastAccessed: null
  }
];

export const MOCK_RECENT_VIDEOS: RecentVideo[] = [
  {
  id: 1,
  lessonId: 'X0OZt35ASgU',
  title: 'Limites e Continuidade',
    subject: 'Cálculo I',
    progress: 75,
    duration: '45 min',
    thumbnail: '📊'
  },
  {
  id: 2,
  lessonId: 'j5i6XlfwxeA',
  title: 'Leis de Newton',
    subject: 'Física I',
    progress: 30,
    duration: '38 min',
    thumbnail: '⚗️'
  },
  {
  id: 3,
  lessonId: '7GLGVQUkQC4',
  title: 'Algoritmos de Busca',
    subject: 'Programação',
    progress: 60,
    duration: '52 min',
    thumbnail: '💻'
  },
  {
  id: 4,
  lessonId: 'dMdpOoSnu2I',
  title: 'Derivadas Básicas',
    subject: 'Cálculo I',
    progress: 20,
    duration: '35 min',
    thumbnail: '📈'
  },
  {
  id: 5,
  lessonId: '91sLDPJRdhk',
  title: 'Estruturas de Dados',
    subject: 'Programação',
    progress: 85,
    duration: '42 min',
    thumbnail: '🗃️'
  },
  {
  id: 6,
  lessonId: '2D_rTqUfuLQ',
  title: 'Termodinâmica',
    subject: 'Física II',
    progress: 45,
    duration: '48 min',
    thumbnail: '🌡️'
  }
];

export const MOCK_POPULAR_VIDEOS: PopularVideo[] = [
  {
  id: 1,
  lessonId: '0Zhx5MnJWmc',
  title: 'Derivadas - Conceitos',
    subject: 'Cálculo I',
    difficulty: 'Intermediário',
    thumbnail: '📈'
  },
  {
  id: 2,
  lessonId: '-0eq7qMgOqc',
  title: 'Algoritmos de Ordenação',
    subject: 'Programação',
    difficulty: 'Avançado',
    thumbnail: '💻'
  },
  {
  id: 3,
  lessonId: 'TwntXlUBr1I',
  title: 'Teorema de Pitágoras',
    subject: 'Matemática',
    difficulty: 'Básico',
    thumbnail: '📐'
  },
  {
  id: 4,
  lessonId: 'AClRmo2iH5o',
  title: 'Circuitos Elétricos',
    subject: 'Física II',
    difficulty: 'Intermediário',
    thumbnail: '⚡'
  },
  {
  id: 5,
  lessonId: 'nIlfIo3jz3o',
  title: 'Banco de Dados',
    subject: 'Programação',
    difficulty: 'Intermediário',
    thumbnail: '🗄️'
  },
  {
  id: 6,
  lessonId: 'lt9zW3YuTj0',
  title: 'Integrais Definidas',
    subject: 'Cálculo II',
    difficulty: 'Avançado',
    thumbnail: '∫'
  }
];

export const MOCK_QUIZ_QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    question: 'Qual é a derivada de x²?',
    options: ['2x', 'x', '2', 'x²'],
    correct: 0,
    explanation: 'A derivada de x² é 2x, aplicando a regra da potência.',
    subject: 'Cálculo I',
    difficulty: 'easy'
  },
  {
    id: 2,
    question: 'Qual é a unidade de força no Sistema Internacional?',
    options: ['Joule', 'Newton', 'Watt', 'Pascal'],
    correct: 1,
    explanation: 'O Newton (N) é a unidade de força no SI, definida como kg⋅m/s².',
    subject: 'Física I',
    difficulty: 'easy'
  },
  {
    id: 3,
    question: 'Qual a complexidade do algoritmo de busca binária?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correct: 1,
    explanation: 'A busca binária tem complexidade O(log n) pois divide o espaço de busca pela metade a cada iteração.',
    subject: 'Algoritmos',
    difficulty: 'medium'
  },
  {
    id: 4,
    question: 'O que é o determinante de uma matriz 2x2?',
    options: ['ad - bc', 'ab - cd', 'ac - bd', 'a + d'],
    correct: 0,
    explanation: 'Para uma matriz [[a,b],[c,d]], o determinante é ad - bc.',
    subject: 'Álgebra Linear',
    difficulty: 'medium'
  }
];
