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
import ReportsPage from './pages/ReportsPage';
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

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userType, setUserType] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('engenha_token');
        const storedUserType = localStorage.getItem('engenha_user_type');
        
        if (token) {
          setIsAuthenticated(true);
          setUserType(storedUserType || 'authenticated');
        } else {
          setIsAuthenticated(false);
          setUserType(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Se estiver carregando, pode mostrar um spinner ou tela de loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f6ff]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0029ff] border-solid rounded-full border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-[#030025] font-medium">Carregando ENGENHA+...</p>
        </div>
      </div>
    );
  }

  // Componente para proteger rotas com regras específicas por tipo de URL
  const ProtectedRoute = ({ children, allowedUserTypes }: { children: React.ReactNode, allowedUserTypes: string[] }) => {
    const currentPath = window.location.pathname;

    // Permitir acesso à rota /watch/:lessonId sem autenticação
    if (currentPath.startsWith('/watch/')) {
      console.log('ProtectedRoute: acesso público permitido para', currentPath);
      return <>{children}</>;
    }

    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
      console.log('ProtectedRoute: usuário não autenticado, redirecionando para /login (path)', currentPath);
      return <Navigate to="/login" replace />;
    }
    
    // Regras existentes continuam aqui...
    if (currentPath.startsWith('/admin/') && userType !== 'admin') {
      // Rotas /admin/ são acessíveis apenas por administradores
      if (userType === 'teacher') {
        return <Navigate to="/professores/dashboard" replace />;
      } else {
        return <Navigate to="/home" replace />;
      }
    }
    
    // Rotas /professores/ são acessíveis por professores e administradores
    if (currentPath.startsWith('/professores/') && userType !== 'admin' && userType !== 'teacher') {
      return <Navigate to="/home" replace />;
    }
    
    // Para outras rotas, verificar os tipos permitidos
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
            <Route path="/" element={<Navigate to="/login" replace />} />
            
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
            <Route path="/watch/:lessonId" element={<WatchLesson />} />
            
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
              <ProtectedRoute allowedUserTypes={['teacher', 'admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/professores/turmas" element={
              <ProtectedRoute allowedUserTypes={['teacher', 'admin']}>
                <TeacherClasses />
              </ProtectedRoute>
            } />
            <Route path="/professores/aulas" element={
              <ProtectedRoute allowedUserTypes={['teacher', 'admin']}>
                <TeacherLessons />
              </ProtectedRoute>
            } />
            <Route path="/professores/aulas/criar" element={
              <ProtectedRoute allowedUserTypes={['teacher', 'admin']}>
                <CreateLesson />
              </ProtectedRoute>
            } />
            <Route path="/professores/feedback" element={
              <ProtectedRoute allowedUserTypes={['teacher', 'admin']}>
                <TeacherFeedback />
              </ProtectedRoute>
            } />
            <Route path="/professores/analytics" element={
              <ProtectedRoute allowedUserTypes={['teacher', 'admin']}>
                <TeacherAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/professores/configuracoes" element={
              <ProtectedRoute allowedUserTypes={['teacher', 'admin']}>
                <ProfessorSettings />
              </ProtectedRoute>
            } />
            <Route path="/professores/relatorios" element={
              <ProtectedRoute allowedUserTypes={['teacher', 'admin']}>
                <ReportsPage />
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
