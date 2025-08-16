import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Biblioteca from "./pages/Biblioteca";
import MascoteNovo from './pages/MascoteNovo';
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import WatchLesson from "./pages/WatchLesson";

// Admin Pages
import AdminDashboard from './admin/pages/AdminDashboard';
import TeacherManagement from './pages/admin/TeacherManagement';
import ClassManagement from './pages/admin/ClassManagement';
import LessonManagement from './pages/admin/LessonManagement';
import AddLessonPage from './pages/admin/AddLessonPage';
import ReviewLessonPage from './pages/admin/ReviewLessonPage';
import ReportsPage from './pages/admin/ReportsPage';
import AdminSettings from './pages/admin/AdminSettings';
import AccessControlPage from './pages/admin/AccessControlPage';

// Teacher Pages
import TeacherDashboard from './professores/pages/TeacherDashboard';
import TeacherClasses from './professores/pages/TeacherClasses';
import TeacherLessons from './professores/pages/TeacherLessons';
import TeacherFeedback from './professores/pages/TeacherFeedback';
import TeacherAnalytics from './professores/pages/TeacherAnalytics';
import CreateLesson from './professores/pages/CreateLesson';
import ProfessorSettings from './professores/pages/ProfessorSettings';
import { useAuth } from './shared/hooks/useAuth';

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, isLoading, userType } = useAuth();

  // Se estiver carregando, pode mostrar um spinner ou tela de loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Componente para proteger rotas
  const ProtectedRoute = ({ children, allowedUserTypes }: { children: React.ReactNode, allowedUserTypes: string[] }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedUserTypes.length > 0 && userType && !allowedUserTypes.includes(userType)) {
      // Redirecionar para a página apropriada baseada no tipo de usuário
      if (userType === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userType === 'teacher') {
        return <Navigate to="/professores/dashboard" replace />;
      } else if (userType === 'student' || userType === 'authenticated') {
        return <Navigate to="/home" replace />;
      } else {
        // Caso o tipo de usuário não seja reconhecido, redirecionar para login
        localStorage.removeItem('engenha_token');
        localStorage.removeItem('engenha_user_type');
        return <Navigate to="/login" replace />;
      }
    }
    
    return <>{children}</>;
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            
            {/* Student Routes */}
            <Route path="/home" element={
              <ProtectedRoute allowedUserTypes={['authenticated']}>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/biblioteca" element={
              <ProtectedRoute allowedUserTypes={['authenticated']}>
                <Biblioteca />
              </ProtectedRoute>
            } />
            <Route path="/mascote" element={
              <ProtectedRoute allowedUserTypes={['authenticated']}>
                <MascoteNovo />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute allowedUserTypes={['authenticated']}>
                <Configuracoes />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute allowedUserTypes={['authenticated', 'teacher', 'admin']}>
                <Help />
              </ProtectedRoute>
            } />
            <Route path="/watch/:lessonId" element={
              <ProtectedRoute allowedUserTypes={['authenticated', 'teacher', 'admin']}>
                <WatchLesson />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/teachers" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <TeacherManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/classes" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <ClassManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/lessons" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <LessonManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/lessons/add" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <AddLessonPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/lessons/review/:id" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <ReviewLessonPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/access-control" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <AccessControlPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            } />
            
            {/* Teacher Routes */}
            <Route path="/professores/dashboard" element={
              <ProtectedRoute allowedUserTypes={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/professores/turmas" element={
              <ProtectedRoute allowedUserTypes={['teacher']}>
                <TeacherClasses />
              </ProtectedRoute>
            } />
            <Route path="/professores/aulas" element={
              <ProtectedRoute allowedUserTypes={['teacher']}>
                <TeacherLessons />
              </ProtectedRoute>
            } />
            <Route path="/professores/aulas/criar" element={
              <ProtectedRoute allowedUserTypes={['teacher']}>
                <CreateLesson />
              </ProtectedRoute>
            } />
            <Route path="/professores/feedback" element={
              <ProtectedRoute allowedUserTypes={['teacher']}>
                <TeacherFeedback />
              </ProtectedRoute>
            } />
            <Route path="/professores/analytics" element={
              <ProtectedRoute allowedUserTypes={['teacher']}>
                <TeacherAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/professores/configuracoes" element={
              <ProtectedRoute allowedUserTypes={['teacher']}>
                <ProfessorSettings />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
