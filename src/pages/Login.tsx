import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import Logo from '../components/common/Logo';

type AuthView = 'login' | 'signup' | 'forgot-password';

const Login = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

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
