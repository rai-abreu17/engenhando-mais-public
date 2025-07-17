import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddClassProps {
  onSave?: (classData: any) => void;
  onCancel?: () => void;
}

const AddClass: React.FC<AddClassProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    teacher: '',
    status: 'active'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Simular salvamento
    const newClass = {
      id: Date.now(), // ID temporário
      ...formData,
      studentsEnrolled: 0,
      lessonsRecorded: 0
    };
    
    if (onSave) {
      onSave(newClass);
    }
    
    // Resetar formulário
    setFormData({
      name: '',
      subject: '',
      teacher: '',
      status: 'active'
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        {/* Nome da Turma */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#030025] font-medium">Nome da Turma *</Label>
          <Input
            id="name"
            placeholder="Ex: Cálculo I - Turma A"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
          />
        </div>

        {/* Matéria */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-[#030025] font-medium">Matéria *</Label>
          <Select onValueChange={(value) => handleInputChange('subject', value)}>
            <SelectTrigger className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]">
              <SelectValue placeholder="Selecione a matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Matemática">Matemática</SelectItem>
              <SelectItem value="Física">Física</SelectItem>
              <SelectItem value="Química">Química</SelectItem>
              <SelectItem value="Programação">Programação</SelectItem>
              <SelectItem value="História">História</SelectItem>
              <SelectItem value="Geografia">Geografia</SelectItem>
              <SelectItem value="Português">Português</SelectItem>
              <SelectItem value="Inglês">Inglês</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Professor */}
        <div className="space-y-2">
          <Label htmlFor="teacher" className="text-[#030025] font-medium">Professor Responsável *</Label>
          <Select onValueChange={(value) => handleInputChange('teacher', value)}>
            <SelectTrigger className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]">
              <SelectValue placeholder="Selecione o professor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Prof. Maria Silva">Prof. Maria Silva</SelectItem>
              <SelectItem value="Prof. João Santos">Prof. João Santos</SelectItem>
              <SelectItem value="Prof. Ana Costa">Prof. Ana Costa</SelectItem>
              <SelectItem value="Prof. Carlos Lima">Prof. Carlos Lima</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-[#030025] font-medium">Status</Label>
          <Select onValueChange={(value) => handleInputChange('status', value)} defaultValue="active">
            <SelectTrigger className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativa</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="inactive">Inativa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-[#e0e7ff]">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!formData.name || !formData.subject || !formData.teacher}
          className="bg-[#0029ff] hover:bg-[#001cab] text-white disabled:opacity-50"
        >
          Criar Turma
        </Button>
      </div>
    </div>
  );
};

export default AddClass;
