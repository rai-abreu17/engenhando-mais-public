import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onToggleForm: (form: 'login' | 'signup' | 'forgot-password') => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">E-mail Enviado!</h2>
          <p className="text-muted-foreground mt-2">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
        </div>
        
        <Button onClick={() => onToggleForm('login')} className="w-full">
          Voltar ao Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Esqueceu a Senha?</h2>
        <p className="text-muted-foreground mt-2">
          Digite seu e-mail para receber instruções de redefinição
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" className="w-full">
          Enviar Instruções
        </Button>
      </form>

      <button
        onClick={() => onToggleForm('login')}
        className="flex items-center gap-2 text-primary hover:underline text-sm w-full justify-center"
      >
        <ArrowLeft size={16} />
        Voltar ao Login
      </button>
    </div>
  );
};

export default ForgotPasswordForm;