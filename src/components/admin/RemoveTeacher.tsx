import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  status: 'active' | 'pending' | 'inactive';
  classesAssigned: number;
  studentsCount: number;
  joinDate: string;
  location: string;
}

interface RemoveTeacherProps {
  teacher: Teacher;
  onConfirm: (teacherId: number) => void;
  onCancel: () => void;
}

const RemoveTeacher: React.FC<RemoveTeacherProps> = ({ teacher, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm(teacher.id);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-[#d75200]">
          <AlertTriangle className="h-5 w-5" />
          Remover Professor
        </DialogTitle>
        <DialogDescription>
          Esta ação não pode ser desfeita. Confirme se deseja remover o professor do sistema.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">Professor a ser removido:</h4>
          <div className="space-y-1 text-sm text-red-700">
            <p><strong>Nome:</strong> {teacher.name}</p>
            <p><strong>Email:</strong> {teacher.email}</p>
            <p><strong>Matéria:</strong> {teacher.subject}</p>
            <p><strong>Turmas Atribuídas:</strong> {teacher.classesAssigned}</p>
            <p><strong>Alunos:</strong> {teacher.studentsCount}</p>
          </div>
        </div>

        {teacher.classesAssigned > 0 && (
          <div className="bg-[#fffaf0] border border-[#ff7a28] rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-[#ff7a28] mt-0.5" />
              <div className="text-sm text-[#d75200]">
                <strong>Atenção:</strong> Este professor possui {teacher.classesAssigned} {teacher.classesAssigned === 1 ? 'turma atribuída' : 'turmas atribuídas'} 
                com {teacher.studentsCount} {teacher.studentsCount === 1 ? 'aluno' : 'alunos'}. Certifique-se de reatribuir essas turmas antes de remover.
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Confirmar Remoção
          </Button>
        </div>
      </div>
    </>
  );
};

export default RemoveTeacher;
