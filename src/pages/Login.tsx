
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, School, BookOpen, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    university: '',
    course: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup and redirect to home
    navigate('/');
  };

  const socialButtons = [
    { name: 'Google', icon: 'G', color: 'bg-white border border-engenha-border text-gray-700' },
    { name: 'Apple', icon: '', color: 'bg-black text-white' },
    { name: 'Facebook', icon: 'f', color: 'bg-blue-600 text-white' }
  ];

  return (
    <div className="min-h-screen bg-engenha-gradient flex flex-col">
      {/* Header with logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mb-8 shadow-lg">
          <span className="text-4xl font-bold text-engenha-blue">LOGO</span>
        </div>

        <h1 className="text-engenha-text-light text-2xl font-bold mb-8">
          {isSignUp ? 'Crie sua conta no ENGENHA+' : 'Seja bem vindo ao ENGENHA+'}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {isSignUp && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-border" size={20} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="DIGITE SEU NOME COMPLETO"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-white/20 border border-engenha-border rounded-lg pl-12 pr-4 py-3 text-engenha-text-light placeholder-engenha-border focus:outline-none focus:ring-2 focus:ring-engenha-border"
                  required
                />
              </div>

              <div className="relative">
                <School className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-border" size={20} />
                <input
                  type="text"
                  name="university"
                  placeholder="DIGITE SUA UNIVERSIDADE"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="w-full bg-white/20 border border-engenha-border rounded-lg pl-12 pr-4 py-3 text-engenha-text-light placeholder-engenha-border focus:outline-none focus:ring-2 focus:ring-engenha-border"
                  required
                />
              </div>

              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-border" size={20} />
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full bg-white/20 border border-engenha-border rounded-lg pl-12 pr-4 py-3 text-engenha-text-light focus:outline-none focus:ring-2 focus:ring-engenha-border appearance-none"
                  required
                >
                  <option value="" className="text-gray-800">SELECIONE SEU CURSO</option>
                  <option value="civil" className="text-gray-800">Engenharia Civil</option>
                  <option value="mecanica" className="text-gray-800">Engenharia Mecânica</option>
                  <option value="eletrica" className="text-gray-800">Engenharia Elétrica</option>
                  <option value="computacao" className="text-gray-800">Engenharia da Computação</option>
                  <option value="quimica" className="text-gray-800">Engenharia Química</option>
                </select>
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-border" size={20} />
            <input
              type="email"
              name="email"
              placeholder={isSignUp ? "DIGITE SEU EMAIL" : "DIGITE SEU EMAIL OU USUÁRIO"}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-white/20 border border-engenha-border rounded-lg pl-12 pr-4 py-3 text-engenha-text-light placeholder-engenha-border focus:outline-none focus:ring-2 focus:ring-engenha-border"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-border" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="DIGITE SUA SENHA"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-white/20 border border-engenha-border rounded-lg pl-12 pr-12 py-3 text-engenha-text-light placeholder-engenha-border focus:outline-none focus:ring-2 focus:ring-engenha-border"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-engenha-border"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isSignUp && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-border" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="CONFIRME SUA SENHA"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-white/20 border border-engenha-border rounded-lg pl-12 pr-4 py-3 text-engenha-text-light placeholder-engenha-border focus:outline-none focus:ring-2 focus:ring-engenha-border"
                required
              />
            </div>
          )}

          {!isSignUp && (
            <button
              type="button"
              className="text-engenha-text-light text-sm underline"
            >
              Esqueceu a senha? Clique aqui!
            </button>
          )}

          <button
            type="submit"
            className="w-full bg-engenha-orange hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {isSignUp ? 'CADASTRE-SE' : 'LOGIN'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-engenha-text-light text-sm underline mt-4"
        >
          {isSignUp ? 'Já tem uma conta? Entre aqui!' : 'Não tem uma conta? Clique aqui!'}
        </button>

        {/* Social Login */}
        <div className="mt-8 w-full max-w-sm">
          <div className="flex items-center mb-4">
            <div className="flex-1 h-px bg-engenha-border"></div>
            <span className="px-4 text-engenha-text-light text-sm">
              {isSignUp ? 'CADASTRE-SE COM' : 'LOGAR COM'}
            </span>
            <div className="flex-1 h-px bg-engenha-border"></div>
          </div>

          <div className="flex justify-center space-x-4">
            {socialButtons.map((social) => (
              <button
                key={social.name}
                className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center text-xl hover:scale-105 transition-transform`}
              >
                {social.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
