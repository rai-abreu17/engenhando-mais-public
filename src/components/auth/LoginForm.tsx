import React, { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface SocialButton {
  name: string;
  icon: ReactNode;
  color: string;
}

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp, onForgotPassword }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const login = (token: string, userType: string) => {
    localStorage.setItem('engenha_token', token);
    localStorage.setItem('engenha_user_type', userType);
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    const newErrors = {
      email: '',
      password: ''
    };

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    // Normalizar email (remover espaços e converter para minúsculo)
    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedPassword = formData.password.trim();

    console.log('Tentativa de login:', { email: normalizedEmail, password: normalizedPassword });

    // Login administrador
    if (normalizedEmail === 'admin@gmail.com' && normalizedPassword === '1234') {
      console.log('Login como administrador');
      login('mock-token-admin', 'admin');
      navigate('/admin/dashboard');
      return;
    }

    // Login professor
    if (normalizedEmail === 'professor@gmail.com' && normalizedPassword === '1234') {
      console.log('Login como professor');
      login('mock-token-teacher', 'teacher');
      navigate('/professores/dashboard');
      return;
    }

    // Login aluno (credenciais padrão ou outras credenciais válidas)
    if (normalizedEmail === 'aluno@gmail.com' && normalizedPassword === '1234') {
      console.log('Login como aluno');
      login('mock-token-student', 'student');
      navigate('/home');
      return;
    }

    // Se chegou até aqui, credenciais inválidas
    setErrors({
      email: 'Credenciais inválidas',
      password: 'Credenciais inválidas'
    });
    console.log('Credenciais inválidas:', { email: normalizedEmail, password: normalizedPassword });
  };

  const isFormValid = () => {
    return formData.email && formData.password && validateEmail(formData.email);
  };

  const socialButtons: SocialButton[] = [
    { name: 'Google', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>, color: 'bg-white border border-gray-300' },
    { name: 'Apple', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 12.04c-.03-2.98 2.43-4.4 2.55-4.46-1.38-2.03-3.55-2.31-4.32-2.35-1.84-.19-3.58 1.08-4.52 1.08-.93 0-2.38-1.05-3.91-1.03-2.01.04-3.86 1.17-4.9 2.97-2.08 3.61-.53 8.97 1.5 11.9 1 1.43 2.18 3.05 3.73 3 1.5-.06 2.07-.97 3.88-.97 1.82 0 2.33.97 3.92.94 1.61-.03 2.64-1.47 3.64-2.91 1.14-1.68 1.62-3.29 1.64-3.36-.03-.02-3.15-1.2-3.18-4.79z" fill="black"/><path d="M14.44 3.96c.83-1 1.39-2.39 1.24-3.76-1.19.05-2.63.79-3.48 1.79-.76.88-1.44 2.29-1.25 3.65 1.33.1 2.66-.68 3.49-1.68z" fill="black"/></svg>, color: 'bg-white border border-gray-300' },
    { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>, color: 'bg-white border border-gray-300' }
  ];

  return (
    <>
      <h1 className="text-white text-2xl font-semibold mb-8">
        Seja bem-vindo ao ENGENHA+
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-sky-blue" size={20} />
          <input
            type="email"
            name="email"
            placeholder="DIGITE SEU EMAIL OU USUÁRIO"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full bg-white/20 border rounded-lg pl-12 pr-4 py-3 text-engenha-light-blue placeholder-engenha-sky-blue focus:outline-none focus:ring-2 transition-colors ${
              errors.email 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-engenha-sky-blue focus:ring-engenha-sky-blue'
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-sky-blue" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="DIGITE SUA SENHA"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full bg-white/20 border rounded-lg pl-12 pr-12 py-3 text-engenha-light-blue placeholder-engenha-sky-blue focus:outline-none focus:ring-2 transition-colors ${
              errors.password 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-engenha-sky-blue focus:ring-engenha-sky-blue'
            }`}
            required
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#96CCDB]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-engenha-light-cream text-sm font-semibold underline"
        >
          Esqueceu a senha? Clique aqui!
        </button>

        <button
          type="submit"
          disabled={!isFormValid()}
          className="w-full bg-engenha-orange hover:bg-engenha-dark-orange disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
        >
          LOGIN
        </button>
      </form>

      <button
        onClick={onSwitchToSignUp}
        className="text-engenha-light-cream text-sm underline mt-4"
      >
        Não tem uma conta? Clique aqui!
      </button>

      {/* Social Login */}
      <div className="mt-8 w-full max-w-sm">
        <div className="flex items-center mb-4">
          <div className="flex-1 h-px bg-engenha-sky-blue"></div>
          <span className="px-4 text-engenha-light-cream text-sm">
            LOGAR COM
          </span>
          <div className="flex-1 h-px bg-engenha-sky-blue"></div>
        </div>

        <div className="flex justify-center space-x-4">
          {socialButtons.map((social) => (
            <button
              key={social.name}
              className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all`}
              aria-label={`Login com ${social.name}`}
            >
              {social.icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default LoginForm;
