/**
 * Sistema de Design ENGENHA+
 * Utilitários para garantir consistência visual
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Classes de cores padronizadas do sistema ENGENHA+
export const colors = {
  // Backgrounds
  background: {
    primary: 'bg-background',
    card: 'bg-card',
    muted: 'bg-muted',
    accent: 'bg-accent',
  },
  
  // Text colors
  text: {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    accent: 'text-accent-foreground',
    white: 'text-white',
  },
  
  // ENGENHA specific colors
  engenha: {
    lightBlue: 'bg-engenha-light-blue text-engenha-dark-navy',
    lightCream: 'bg-engenha-light-cream text-engenha-dark-navy',
    brightBlue: 'bg-engenha-bright-blue text-white',
    orange: 'bg-engenha-orange text-white',
    skyBlue: 'bg-engenha-sky-blue text-white',
    gold: 'bg-engenha-gold text-engenha-dark-navy',
  },
  
  // Borders
  border: {
    default: 'border-border',
    primary: 'border-primary',
    secondary: 'border-secondary',
    engenha: 'border-engenha-sky-blue',
  }
} as const;

// Variantes de componentes padronizadas
export const variants = {
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    engenha: 'bg-engenha-bright-blue text-white hover:bg-engenha-blue',
    engenhiSecondary: 'bg-engenha-orange text-white hover:bg-engenha-dark-orange',
  },
  
  card: {
    default: 'bg-card text-card-foreground border-border',
    engenha: 'bg-card text-card-foreground border-engenha-sky-blue',
    gradient: 'bg-gradient-to-br from-engenha-bright-blue to-engenha-blue text-white',
  }
} as const;

// Espaçamentos padronizados
export const spacing = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const;

// Shadows padronizadas
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
} as const;

// Transições padronizadas
export const transitions = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-200',
  slow: 'transition-all duration-300',
} as const;

// Função para criar classes de status
export const statusClasses = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-engenha-gold text-engenha-dark-navy border-engenha-orange',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-engenha-light-blue text-engenha-blue border-engenha-sky-blue',
} as const;

// Função utilitária para combinar classes de forma segura
export function combineClasses(...classes: (string | undefined | null | false)[]): string {
  return cn(...classes.filter(Boolean));
}