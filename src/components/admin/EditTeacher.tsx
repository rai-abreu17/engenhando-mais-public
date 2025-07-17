import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Teacher {
  id: number;
  name: string;
  email: string;
  university: string;
  subject: string;
  status: string;
  classes: string[];
  joinDate: string;
}

interface EditTeacherProps {
  teacher: Teacher;
  onSave: (teacher: Teacher) => void;
  onCancel: () => void;
}

const EditTeacher: React.FC<EditTeacherProps> = ({ teacher, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Teacher>({
    ...teacher,
    classes: [...teacher.classes] // Criar cópia do array
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClassChange = (index: number, value: string) => {
    const newClasses = [...formData.classes];
    newClasses[index] = value;
    setFormData(prev => ({
      ...prev,
      classes: newClasses
    }));
  };

  const addClassField = () => {
    setFormData(prev => ({
      ...prev,
      classes: [...prev.classes, '']
    }));
  };

  const removeClassField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtra classes vazias
    const filteredClasses = formData.classes.filter(cls => cls.trim() !== '');
    
    onSave({
      ...formData,
      classes: filteredClasses
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Ex: João Silva"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="joao.silva@escola.edu.br"
          />
        </div>
        
        <div>
          <Label htmlFor="university">Universidade</Label>
          <Input
            id="university"
            name="university"
            value={formData.university}
            onChange={handleInputChange}
            required
            placeholder="Ex: BICT - UFMA"
          />
        </div>
        
        <div>
          <Label htmlFor="subject">Matéria</Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            placeholder="Ex: Matemática"
          />
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#28b0ff] rounded-md focus:outline-none focus:ring-[#28b0ff] focus:border-[#28b0ff]"
            required
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>
      
      <div>
        <Label>Turmas</Label>
        <div className="space-y-2">
          {formData.classes.map((cls, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={cls}
                onChange={(e) => handleClassChange(index, e.target.value)}
                placeholder="Ex: 5º A"
                className="flex-1"
              />
              {formData.classes.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeClassField(index)}
                  className="px-3"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addClassField}
            className="w-full"
          >
            + Adicionar Turma
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-[#28b0ff] hover:bg-[#001cab]">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export default EditTeacher;
