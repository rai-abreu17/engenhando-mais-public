/**
 * Teacher Module Entry Point
 * 
 * This module handles all teacher-related functionality including:
 * - Dashboard with class statistics
 * - Class management 
 * - Lesson creation and management
 * - Student feedback and ratings
 * - Performance analytics
 */

export { default as TeacherDashboard } from './pages/TeacherDashboard';
export { default as TeacherClasses } from './pages/TeacherClasses';
export { default as TeacherLessons } from './pages/TeacherLessons';
export { default as TeacherFeedback } from './pages/TeacherFeedback';
export { default as TeacherAnalytics } from './pages/TeacherAnalytics';
export { default as CreateLesson } from './pages/CreateLesson';

// Components
export { default as TeacherNavigation } from './components/TeacherNavigation';