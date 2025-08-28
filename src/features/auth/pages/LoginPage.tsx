import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import Logo from '../components/common/Logo';

type AuthView = 'login' | 'signup' | 'forgot-password';

const Login = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AuthView>('login');

  React.useEffect(() => {
    // Verifica se o usuário já está autenticado ao carregar a página
    const checkAuth = () => {
      const token = localStorage.getItem('engenha_token');
      const userType = localStorage.getItem('engenha_user_type');
      
      console.log('Login: Verificando autenticação na página de login:', { token, userType });
      
      // Se o usuário já está autenticado, redirecionar
      if (token && window.location.pathname === '/login') {
        console.log('Login: Usuário já autenticado, redirecionando...');
        // Redirect based on user type using window.location.href for full page reload
        if (userType === 'admin') {
          console.log('Login: Redirecionando para dashboard de admin');
          window.location.href = '/admin/dashboard';
        } else if (userType === 'teacher') {
          console.log('Login: Redirecionando para dashboard de professor');
          window.location.href = '/professores/dashboard';
        } else {
          console.log('Login: Redirecionando para home (aluno)');
          window.location.href = '/home';
        }
      }
    };
    
    // Verificar apenas uma vez ao carregar a página
    checkAuth();
  }, []);

  const handleSwitchToSignUp = () => setCurrentView('signup');
  const handleSwitchToLogin = () => setCurrentView('login');
  const handleForgotPassword = () => setCurrentView('forgot-password');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm onSwitchToSignUp={handleSwitchToSignUp} onForgotPassword={handleForgotPassword} />;
      case 'signup':
        return <SignUpForm onSwitchToLogin={handleSwitchToLogin} />;
      case 'forgot-password':
        return <ForgotPasswordForm onBackToLogin={handleSwitchToLogin} />;
      default:
        return <LoginForm onSwitchToSignUp={handleSwitchToSignUp} onForgotPassword={handleForgotPassword} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-engenha-blue to-engenha-bright-blue flex flex-col">
      {/* Header with logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo para todas as telas, com tamanho diferente para forgot-password */}
        <Logo 
          variant={currentView === 'forgot-password' ? 'small' : 'default'}
          className="mb-4"
        />

        {/* Render the appropriate form component */}
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Login;
