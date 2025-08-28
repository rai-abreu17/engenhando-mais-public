import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, Users, Calendar, Clock } from 'lucide-react';

interface Class {
  id: number;
  name: string;
  subject: string;
  teacher: string;
  teacherId: number;
  studentsCount: number;
  lessonsCount: number;
  startDate: string;
  endDate: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  status: 'active' | 'completed' | 'scheduled';
  description: string;
}

interface RemoveClassProps {
  classData: Class;
  onConfirm: (classId: number) => void;
  onCancel: () => void;
}

const RemoveClass: React.FC<RemoveClassProps> = ({ classData, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm(classData.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'completed':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'scheduled':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'completed':
        return 'Concluída';
      case 'scheduled':
        return 'Agendada';
      default:
        return 'Indefinido';
    }
  };

  const formatSchedule = (schedule: { day: string; startTime: string; endTime: string; }[]) => {
    return schedule.map(item => `${item.day}: ${item.startTime} - ${item.endTime}`).join(', ');
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-[#d75200]">
          <AlertTriangle className="h-5 w-5" />
          Excluir Turma
        </DialogTitle>
        <DialogDescription>
          Esta ação não pode ser desfeita. Confirme se deseja excluir esta turma do sistema.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-3">Turma a ser excluída:</h4>
          <div className="space-y-2 text-sm text-red-700">
            <p><strong>Nome:</strong> {classData.name}</p>
            <p><strong>Matéria:</strong> {classData.subject}</p>
            <p><strong>Professor:</strong> {classData.teacher}</p>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span><strong>Alunos:</strong> {classData.studentsCount}</span>
            </div>
            <p><strong>Aulas criadas:</strong> {classData.lessonsCount}</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span><strong>Período:</strong> {new Date(classData.startDate).toLocaleDateString('pt-BR')} - {new Date(classData.endDate).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span><strong>Horários:</strong> {formatSchedule(classData.schedule)}</span>
            </div>
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(classData.status)}`}>
                {getStatusLabel(classData.status)}
              </span>
            </div>
          </div>
        </div>

        {(classData.studentsCount > 0 || classData.lessonsCount > 0) && (
          <div className="bg-[#fffaf0] border border-[#ff7a28] rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-[#ff7a28] mt-0.5" />
              <div className="text-sm text-[#d75200]">
                <strong>Atenção:</strong> Esta turma possui {classData.studentsCount} {classData.studentsCount === 1 ? 'aluno matriculado' : 'alunos matriculados'}
                {classData.lessonsCount > 0 && ` e ${classData.lessonsCount} ${classData.lessonsCount === 1 ? 'aula criada' : 'aulas criadas'}`}. 
                A exclusão removerá todos os dados relacionados e pode impactar o progresso dos alunos.
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
            Confirmar Exclusão
          </Button>
        </div>
      </div>
    </>
  );
};

export default RemoveClass;
