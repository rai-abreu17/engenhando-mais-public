import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SignUpFormProps {
  onToggleForm: (form: 'login' | 'signup' | 'forgot-password') => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cadastro:', formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Criar Conta</h2>
        <p className="text-muted-foreground mt-2">
          Junte-se à nossa plataforma de estudos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Nome completo"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
        
        <Input
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
        
        <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Estudante</SelectItem>
            <SelectItem value="teacher">Professor</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          type="password"
          placeholder="Senha"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Confirmar senha"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          required
        />

        <Button type="submit" className="w-full">
          Criar Conta
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <button
          onClick={() => onToggleForm('login')}
          className="text-primary hover:underline"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;