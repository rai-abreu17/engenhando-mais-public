import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Calendar,
  User,
  BookOpen,
  Video,
  CheckCircle,
  XCircle,
  FileText,
  Play
} from 'lucide-react';
import Header from '@/components/common/Header';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const ReviewLessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Mock data - em produção viria de uma API baseada no ID
  const lesson = {
    id: 1,
    title: 'Introdução ao Cálculo Diferencial',
    subject: 'Matemática',
    teacher: 'Prof. Maria Silva',
    class: '2º Ano A',
    duration: 45,
    type: 'video' as const,
    status: 'pending' as const,
    description: 'Nesta aula introdutória, vamos explorar os conceitos fundamentais do cálculo diferencial, incluindo limites, derivadas e suas aplicações práticas. Os alunos aprenderão a calcular derivadas de funções simples e compreenderão o significado geométrico das derivadas.',
    videoUrl: 'https://www.youtube.com/watch?v=gC8Rzemch_8&list=RDgC8Rzemch_8&start_radio=1',
    scheduledFor: '2024-03-20T10:00:00',
    submittedAt: '2024-03-15T14:30:00',
    materials: [
      'Lista de exercícios - Derivadas básicas.pdf',
      'Slides - Introdução ao Cálculo.pptx'
    ]
  };

  const handleBack = () => {
    navigate('/admin/lessons');
  };

  const handleApprove = () => {
    // Aqui você faria a chamada da API para aprovar a aula
    console.log('Aula aprovada:', lesson.id);
    setShowApproveDialog(false);
    navigate('/admin/lessons');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Por favor, forneça um motivo para a rejeição.');
      return;
    }
    // Aqui você faria a chamada da API para reprovar a aula
    console.log('Aula rejeitada:', lesson.id, 'Motivo:', rejectReason);
    setShowRejectDialog(false);
    navigate('/admin/lessons');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-[#f0f6ff] text-[#001cab] border-[#28b0ff]">Aprovada</Badge>;
      case 'pending':
        return <Badge className="bg-[#fffaf0] text-[#ff7a28] border-[#ffb646]">Pendente</Badge>;
      case 'rejected':
        return <Badge className="bg-[#fffaf0] text-[#d75200] border-[#d75200]">Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Vídeo Aula';
      case 'practical': return 'Aula Prática';
      case 'theoretical': return 'Aula Teórica';
      default: return 'Outro';
    }
  };

  // Extrair ID do vídeo do YouTube
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(lesson.videoUrl);

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      {/* Dialog de Aprovação */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Aprovar Aula</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja aprovar esta aula? Ela ficará disponível para os alunos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-3 mt-4">
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Rejeição */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Reprovar Aula</DialogTitle>
            <DialogDescription>
              Forneça um motivo claro para a rejeição desta aula. Isso ajudará o professor a fazer as correções necessárias.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Ex: O áudio está com baixa qualidade, há erro no conteúdo do slide 5..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700">
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Header 
        title="Revisão de Aula"
        subtitle="Analise e aprove ou reprove a aula"
      />

      <div className="px-4 sm:px-6 space-y-6">
        {/* Botão Voltar */}
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Aulas
        </Button>

        {/* Informações Principais */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl sm:text-2xl text-[#030025]">{lesson.title}</CardTitle>
                  {getStatusBadge(lesson.status)}
                </div>
                <CardDescription className="text-[#001cab] text-base">
                  {lesson.subject} • {lesson.teacher} • {lesson.class}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-[#0029ff]" />
                <span className="text-sm text-[#001cab]">{getTypeLabel(lesson.type)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-[#001cab]" />
                <span className="text-sm text-[#001cab]">{lesson.duration} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-[#001cab]" />
                <span className="text-sm text-[#001cab]">
                  {new Date(lesson.scheduledFor).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-[#001cab]" />
                <span className="text-sm text-[#001cab]">{lesson.teacher}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-[#001cab]" />
                <span className="text-sm text-[#001cab]">{lesson.class}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#030025] mb-2">Descrição da Aula</h3>
                <p className="text-sm text-[#001cab] leading-relaxed">{lesson.description}</p>
              </div>

              {lesson.materials.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#030025] mb-2">Materiais Anexados</h3>
                  <div className="space-y-2">
                    {lesson.materials.map((material, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-[#001cab]" />
                        <span className="text-sm text-[#001cab]">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vídeo da Aula */}
        {videoId && (
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#030025]">
                <Play className="h-5 w-5" />
                Vídeo da Aula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações de Aprovação/Rejeição */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="text-[#030025]">Decisão de Revisão</CardTitle>
            <CardDescription className="text-[#001cab]">
              Depois de revisar todo o conteúdo, você pode aprovar ou reprovar esta aula.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowApproveDialog(true)}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar Aula
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                className="border-red-500 text-red-600 hover:bg-red-50 flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reprovar Aula
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewLessonPage;
