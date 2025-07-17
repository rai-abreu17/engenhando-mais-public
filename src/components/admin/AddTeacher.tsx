import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface AddTeacherProps {
  onAddTeacher?: (teacher: any) => void;
  onCancel: () => void;
}

const AddTeacher: React.FC<AddTeacherProps> = ({ onAddTeacher, onCancel }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor, insira um email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simular envio do convite
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        onCancel();
        // Reset do formulário
        setEmail('');
        setIsSuccess(false);
        setIsLoading(false);
      }, 2000);
      
    } catch (err) {
      setError('Erro ao enviar convite. Tente novamente.');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-16 h-16 bg-[#f0f6ff] rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#0029ff]" />
        </div>
        <h3 className="text-lg font-semibold text-[#030025] mb-2">Convite Enviado!</h3>
        <p className="text-[#001cab] text-sm">
          Um convite foi enviado para <strong>{email}</strong>
        </p>
        <p className="text-[#001cab] text-xs mt-2">
          O professor receberá um email com instruções para se cadastrar no sistema.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-[#f0f6ff] rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-[#0029ff]" />
        </div>
        <h3 className="text-lg font-semibold text-[#030025] mb-2">Convidar Professor</h3>
        <p className="text-[#001cab] text-sm">
          Digite o email do professor para enviar um convite de cadastro
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-[#030025] font-medium">
            Email do Professor
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="professor@exemplo.com"
            className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
            disabled={isLoading}
          />
          {error && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="w-4 h-4 text-[#d75200]" />
              <span className="text-sm text-[#d75200]">{error}</span>
            </div>
          )}
        </div>

        <Alert className="border-[#28b0ff] bg-[#f0f6ff]">
          <AlertCircle className="h-4 w-4 text-[#0029ff]" />
          <AlertDescription className="text-[#001cab]">
            <strong>Como funciona:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>O professor receberá um email com link de cadastro</li>
              <li>Ele preencherá seus próprios dados no sistema</li>
              <li>Após o cadastro, você poderá atribuir turmas e permissões</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
          className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !email.trim()}
          className="bg-[#0029ff] hover:bg-[#001cab] text-white"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enviando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Enviar Convite
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddTeacher;
