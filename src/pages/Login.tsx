import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

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
        <div className={`bg-engenha-light-cream rounded-full flex items-center justify-center mb-8 shadow-lg ${
          currentView === 'forgot-password' ? 'w-20 h-20' : 'w-32 h-32'
        }`}>
          <span className={`font-bold text-engenha-blue ${
            currentView === 'forgot-password' ? 'text-2xl' : 'text-4xl'
          }`}>LOGO</span>
        </div>

        {/* Render the appropriate form component */}
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Login;
