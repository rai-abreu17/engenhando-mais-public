import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/shared/hooks/useAuth';

interface LoginFormProps {
  onToggleForm: (form: 'login' | 'signup' | 'forgot-password') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Fazer Login</h2>
        <p className="text-muted-foreground mt-2">
          Entre em sua conta para continuar aprendendo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <button
          onClick={() => onToggleForm('forgot-password')}
          className="text-primary hover:underline text-sm"
        >
          Esqueceu a senha?
        </button>
        
        <div className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <button
            onClick={() => onToggleForm('signup')}
            className="text-primary hover:underline"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;