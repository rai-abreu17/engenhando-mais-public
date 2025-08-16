/**
 * Custom hook for managing subject state
 * 
 * This hook provides functionality for managing subjects including
 * filtering, searching, and favoriting operations.
 */

import { useState, useMemo } from 'react';
import { Subject, FilterType } from '../../types';
import { filterSubjects } from '../../utils';

export const useSubjects = (initialSubjects: Subject[]) => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Todas');

  const filteredSubjects = useMemo(
    () => filterSubjects(subjects, selectedFilter, searchTerm),
    [subjects, selectedFilter, searchTerm]
  );

  const toggleFavorite = (subjectId: number | string) => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject =>
        subject.id === subjectId 
          ? { ...subject, isFavorite: !subject.isFavorite }
          : subject
      )
    );
  };

  const updateSubjectProgress = (subjectId: number | string, progress: number) => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject =>
        subject.id === subjectId 
          ? { ...subject, progress }
          : subject
      )
    );
  };

  return {
    subjects,
    filteredSubjects,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    toggleFavorite,
    updateSubjectProgress,
  };
};