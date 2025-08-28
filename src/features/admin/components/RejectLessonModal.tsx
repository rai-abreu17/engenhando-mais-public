import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { AlertTriangle, X } from 'lucide-react';

interface RejectLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lessonId: number, rejectionComment: string) => void;
  lessonId: number;
  lessonTitle: string;
}

const RejectLessonModal: React.FC<RejectLessonModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  lessonId, 
  lessonTitle 
}) => {
  const [rejectionComment, setRejectionComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rejectionComment.trim().length < 10) {
      return; // Validação já está sendo feita pelo botão disabled
    }

    setIsSubmitting(true);
    try {
      await onConfirm(lessonId, rejectionComment);
      handleClose();
    } catch (error) {
      console.error('Erro ao rejeitar aula:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRejectionComment('');
    setIsSubmitting(false);
    onClose();
  };

  const isCommentValid = rejectionComment.trim().length >= 10;
  const characterCount = rejectionComment.length;
  const minCharacters = 10;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-[#d75200]" />
            <DialogTitle className="text-[#030025]">Rejeitar Aula</DialogTitle>
          </div>
          <DialogDescription className="text-[#001cab]">
            Você está prestes a rejeitar a aula: <strong>"{lessonTitle}"</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rejection-comment" className="text-[#030025] font-medium">
              Motivo da Rejeição *
            </Label>
            <Textarea
              id="rejection-comment"
              placeholder="Descreva detalhadamente os motivos da rejeição e as revisões necessárias para que a aula seja aprovada..."
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              className="min-h-[120px] bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center text-xs">
              <span className={`${isCommentValid ? 'text-[#00a86b]' : 'text-[#d75200]'}`}>
                {isCommentValid ? '✓ Comentário válido' : `Mínimo de ${minCharacters} caracteres necessários`}
              </span>
              <span className={`${characterCount >= minCharacters ? 'text-[#001cab]' : 'text-[#d75200]'}`}>
                {characterCount}/{minCharacters}+ caracteres
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#fff4e6] border border-[#ffa726] rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-[#ff8f00] mt-0.5 flex-shrink-0" />
              <div className="text-sm text-[#e65100]">
                <p className="font-medium mb-1">Importante:</p>
                <ul className="text-xs space-y-1">
                  <li>• O professor receberá uma notificação com seus comentários</li>
                  <li>• Seja específico sobre o que precisa ser corrigido</li>
                  <li>• A aula ficará disponível para revisão após a rejeição</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isCommentValid || isSubmitting}
            className="bg-[#d75200] hover:bg-[#b8451c] text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Rejeitando...
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Confirmar Rejeição
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectLessonModal;
