import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, Video, BookOpen, FileText } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  class: string;
  duration: number;
  type: 'video' | 'practical' | 'theoretical';
  status: 'approved' | 'pending' | 'rejected';
  views: number;
  createdAt: string;
  scheduledFor: string;
  description: string;
  rejectionComment?: string;
}

interface RemoveLessonProps {
  lesson: Lesson;
  onConfirm: (lessonId: number) => void;
  onCancel: () => void;
}

const RemoveLesson: React.FC<RemoveLessonProps> = ({ lesson, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm(lesson.id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'practical':
        return <BookOpen className="h-4 w-4" />;
      case 'theoretical':
        return <FileText className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Videoaula';
      case 'practical':
        return 'Prática';
      case 'theoretical':
        return 'Teórica';
      default:
        return 'Não definido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovada';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitada';
      default:
        return 'Indefinido';
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-[#d75200]">
          <AlertTriangle className="h-5 w-5" />
          Excluir Aula
        </DialogTitle>
        <DialogDescription>
          Esta ação não pode ser desfeita. Confirme se deseja excluir esta aula do sistema.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-3">Aula a ser excluída:</h4>
          <div className="space-y-2 text-sm text-red-700">
            <p><strong>Título:</strong> {lesson.title}</p>
            <p><strong>Professor:</strong> {lesson.teacher}</p>
            <p><strong>Turma:</strong> {lesson.class}</p>
            <p><strong>Matéria:</strong> {lesson.subject}</p>
            <div className="flex items-center gap-2">
              <strong>Tipo:</strong>
              {getTypeIcon(lesson.type)}
              <span>{getTypeLabel(lesson.type)}</span>
            </div>
            <p><strong>Duração:</strong> {lesson.duration} minutos</p>
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(lesson.status)}`}>
                {getStatusLabel(lesson.status)}
              </span>
            </div>
            <p><strong>Visualizações:</strong> {lesson.views}</p>
            <p><strong>Criada em:</strong> {new Date(lesson.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {lesson.status === 'approved' && lesson.views > 0 && (
          <div className="bg-[#fffaf0] border border-[#ff7a28] rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-[#ff7a28] mt-0.5" />
              <div className="text-sm text-[#d75200]">
                <strong>Atenção:</strong> Esta aula já foi visualizada {lesson.views} {lesson.views === 1 ? 'vez' : 'vezes'} 
                e está aprovada no sistema. A exclusão pode impactar os alunos que já acessaram este conteúdo.
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

export default RemoveLesson;
