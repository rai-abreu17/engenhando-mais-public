/**
 * Utility functions for the application
 * 
 * This file contains reusable utility functions that are used across
 * multiple components and pages.
 */

import { FilterType, Subject } from '../types';

/**
 * Formats a duration in minutes to a human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "1h 30min" or "45min")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Formats a date to a localized string
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Calculates the progress percentage
 * @param current - Current value
 * @param total - Total value
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.max((current / total) * 100, 0), 100);
};

/**
 * Filters subjects based on the selected filter type and search term
 * @param subjects - Array of subjects to filter
 * @param filter - Filter type to apply
 * @param searchTerm - Search term to filter by
 * @returns Filtered array of subjects
 */
export const filterSubjects = (
  subjects: Subject[],
  filter: FilterType,
  searchTerm: string
): Subject[] => {
  let filtered = [...subjects];

  // Apply filter
  switch (filter) {
    case 'Minhas Disciplinas':
      filtered = filtered.filter(subject => subject.isMine);
      break;
    case 'Favoritas':
      filtered = filtered.filter(subject => subject.isFavorite);
      break;
    case 'Recentes':
      filtered = filtered
        .filter(subject => subject.lastAccessed)
        .sort((a, b) => b.lastAccessed!.getTime() - a.lastAccessed!.getTime());
      break;
    default:
      // 'Todas' - no additional filtering
      break;
  }

  // Apply search term
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(subject =>
      subject.name.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

/**
 * Generates a random ID
 * @returns Random string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
): ((...args: T) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Safely parses JSON from localStorage
 * @param key - Storage key
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed value or fallback
 */
export const safeJSONParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Safely stores data in localStorage
 * @param key - Storage key
 * @param value - Value to store
 */
export const safeJSONStore = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to store data in localStorage:', error);
  }
};

/**
 * Clamps a number between min and max values
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
