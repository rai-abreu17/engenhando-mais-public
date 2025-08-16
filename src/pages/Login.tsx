import React, { useState } from 'react';
import LoginForm from '../features/auth/components/LoginForm';
import SignUpForm from '../features/auth/components/SignUpForm';
import ForgotPasswordForm from '../features/auth/components/ForgotPasswordForm';
import Logo from '../components/layout/Logo';

type AuthView = 'login' | 'signup' | 'forgot-password';

const Login = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const handleSwitchToSignUp = () => setCurrentView('signup');
  const handleSwitchToLogin = () => setCurrentView('login');
  const handleForgotPassword = () => setCurrentView('forgot-password');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm onToggleForm={setCurrentView} />;
      case 'signup':
        return <SignUpForm onToggleForm={setCurrentView} />;
      case 'forgot-password':
        return <ForgotPasswordForm onToggleForm={setCurrentView} />;
      default:
        return <LoginForm onToggleForm={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-engenha-blue to-engenha-bright-blue flex flex-col">
      {/* Header with logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo para todas as telas, com tamanho diferente para forgot-password */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Render the appropriate form component */}
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Login;
