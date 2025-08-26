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
    // Verifica se o usuário está autenticado
    const checkAuth = () => {
      const token = localStorage.getItem('engenha_token');
      const userType = localStorage.getItem('engenha_user_type');
      
      console.log('Verificando autenticação na página de login:', { token, userType });
      
      // Verifica se o usuário está na página de login por acidente enquanto já está autenticado
      if (token && window.location.pathname === '/login') {
        console.log('Usuário já autenticado, redirecionando...');
        // Redirect based on user type
        if (userType === 'admin') {
          console.log('Redirecionando para dashboard de admin');
          navigate('/admin/dashboard');
        } else if (userType === 'teacher') {
          console.log('Redirecionando para dashboard de professor');
          navigate('/professores/dashboard');
        } else {
          console.log('Redirecionando para home (aluno)');
          navigate('/home');
        }
      }
    };
    
    checkAuth();
    
    // Adicionar um event listener para verificar quando o localStorage muda
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [navigate]);

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
