import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/LoginPage";
import Home from "./features/student/pages/HomePage";
import Biblioteca from "./features/student/pages/BibliotecaPage";
import MascoteNovo from './features/student/pages/MascotePage';
import Configuracoes from "./features/student/pages/ConfiguracoesPage";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import WatchLesson from "./features/video/pages/WatchLessonPage";

// Admin Pages
import AdminDashboard from './features/admin/pages/AdminDashboard';
import TeacherManagement from './features/admin/pages/TeacherManagement';
import ClassManagement from './features/admin/pages/ClassManagement';
import LessonManagement from './features/admin/pages/LessonManagement';
import AddLessonPage from './features/admin/pages/AddLessonPage';
import ReviewLessonPage from './features/admin/pages/ReviewLessonPage';
import ReportsPage from './pages/ReportsPage';
import AdminSettings from './features/admin/pages/AdminSettings';
import AccessControlPage from './features/admin/pages/AccessControlPage';

// Teacher Pages
import TeacherDashboard from './features/teacher/pages/TeacherDashboard';
import TeacherClasses from './features/teacher/pages/TeacherClasses';
import TeacherLessons from './features/teacher/pages/TeacherLessons';
import TeacherFeedback from './features/teacher/pages/TeacherFeedback';
import TeacherAnalytics from './features/teacher/pages/TeacherAnalytics';
import CreateLesson from './features/teacher/pages/CreateLesson';
import ProfessorSettings from './features/teacher/pages/ProfessorSettings';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [userType, setUserType] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkAuth = () => {
      console.log('App: Verificando autenticação...');
      try {
        const token = localStorage.getItem('engenha_token');
        const storedUserType = localStorage.getItem('engenha_user_type');
        
        console.log('App: Token:', token ? 'existe' : 'não existe');
        console.log('App: Tipo de usuário:', storedUserType);
        
        if (token) {
          setIsAuthenticated(true);
          setUserType(storedUserType || 'authenticated');
          console.log('App: Usuário autenticado como', storedUserType || 'authenticated');
        } else {
          setIsAuthenticated(false);
          setUserType(null);
          console.log('App: Usuário não autenticado');
        }
      } catch (error) {
        console.error('App: Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
        console.log('App: Verificação de autenticação concluída');
      }
    };
    
    checkAuth();
  }, []);

  // Se estiver carregando ou a verificação de auth não foi concluída, mostrar loading
  if (isLoading || !authChecked) {
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

    console.log('ProtectedRoute: Verificando acesso para', currentPath);
    console.log('ProtectedRoute: Usuário autenticado:', isAuthenticated);
    console.log('ProtectedRoute: Tipo de usuário:', userType);
    console.log('ProtectedRoute: Tipos permitidos:', allowedUserTypes);

    // Permitir acesso à rota /watch/:lessonId sem autenticação
    if (currentPath.startsWith('/watch/')) {
      console.log('ProtectedRoute: Acesso público permitido para', currentPath);
      return <>{children}</>;
    }

    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
      console.log('ProtectedRoute: Usuário não autenticado, redirecionando para /login');
      return <Navigate to="/login" replace />;
    }
    
    // Verificar se é uma rota de admin e o usuário não é admin
    if (currentPath.startsWith('/admin/') && userType !== 'admin') {
      console.log('ProtectedRoute: Usuário não é admin, redirecionando conforme tipo');
      if (userType === 'teacher') {
        return <Navigate to="/professores/dashboard" replace />;
      } else {
        return <Navigate to="/home" replace />;
      }
    }
    
    // Verificar se é uma rota de professor e o usuário não tem permissão
    if (currentPath.startsWith('/professores/') && userType !== 'admin' && userType !== 'teacher') {
      console.log('ProtectedRoute: Usuário não tem permissão para rota de professor');
      return <Navigate to="/home" replace />;
    }
    
    // Para outras rotas, verificar os tipos permitidos (apenas se allowedUserTypes não estiver vazio)
    if (allowedUserTypes.length > 0 && userType && !allowedUserTypes.includes(userType)) {
      console.log('ProtectedRoute: Tipo de usuário não permitido para esta rota');
      
      // Evitar loops de redirecionamento: não redirecionar se já estamos na página correta
      const shouldRedirect = (() => {
        if (userType === 'admin' && !currentPath.startsWith('/admin/')) return '/admin/dashboard';
        if (userType === 'teacher' && !currentPath.startsWith('/professores/')) return '/professores/dashboard';
        if ((userType === 'student' || userType === 'authenticated') && 
            !currentPath.startsWith('/home') && 
            !currentPath.startsWith('/biblioteca') && 
            !currentPath.startsWith('/mascote') && 
            !currentPath.startsWith('/configuracoes') &&
            !currentPath.startsWith('/help')) return '/home';
        return null;
      })();

      if (shouldRedirect) {
        console.log('ProtectedRoute: Redirecionando para', shouldRedirect);
        return <Navigate to={shouldRedirect} replace />;
      }
    }
    
    console.log('ProtectedRoute: Acesso permitido para', currentPath);
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
              <ProtectedRoute allowedUserTypes={['authenticated', 'student']}>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/biblioteca" element={
              <ProtectedRoute allowedUserTypes={['authenticated', 'student']}>
                <Biblioteca />
              </ProtectedRoute>
            } />
            <Route path="/mascote" element={
              <ProtectedRoute allowedUserTypes={['authenticated', 'student']}>
                <MascoteNovo />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute allowedUserTypes={['authenticated', 'student']}>
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
