import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, FileText, Upload, Play } from 'lucide-react';

interface AddLessonProps {
  onSave?: (lessonData: any) => void;
  onCancel?: () => void;
}

const AddLesson: React.FC<AddLessonProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    teacher: '',
    class: '',
    duration: '',
    type: 'video',
    status: 'pending',
    description: '',
    scheduledFor: '',
    videoUrl: '',
    materials: [],
    files: [],
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoPreview, setVideoPreview] = useState('');

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYouTubeUrl = (url: string) => {
    setYoutubeUrl(url);
    const videoId = extractYouTubeId(url);
    if (videoId) {
      setVideoPreview(`https://www.youtube.com/embed/${videoId}`);
      handleInputChange('videoUrl', url);
    } else {
      setVideoPreview('');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Informações Básicas
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Vídeo YouTube
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Materiais
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Visualizar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título da Aula */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title" className="text-[#030025] font-medium">Título da Aula *</Label>
              <Input
                id="title"
                placeholder="Ex: Introdução ao Cálculo Diferencial"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
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
                </SelectContent>
              </Select>
            </div>

            {/* Professor */}
            <div className="space-y-2">
              <Label htmlFor="teacher" className="text-[#030025] font-medium">Professor *</Label>
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

            {/* Turma */}
            <div className="space-y-2">
              <Label htmlFor="class" className="text-[#030025] font-medium">Turma *</Label>
              <Select onValueChange={(value) => handleInputChange('class', value)}>
                <SelectTrigger className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]">
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1º Ano A">1º Ano A</SelectItem>
                  <SelectItem value="1º Ano B">1º Ano B</SelectItem>
                  <SelectItem value="2º Ano A">2º Ano A</SelectItem>
                  <SelectItem value="2º Ano B">2º Ano B</SelectItem>
                  <SelectItem value="3º Ano A">3º Ano A</SelectItem>
                  <SelectItem value="3º Ano B">3º Ano B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duração */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-[#030025] font-medium">Duração (minutos) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Ex: 60"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
              />
            </div>

            {/* Descrição */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description" className="text-[#030025] font-medium">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o conteúdo e objetivos da aula..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] min-h-[100px]"
                rows={4}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url" className="text-[#030025] font-medium">URL do YouTube *</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => handleYouTubeUrl(e.target.value)}
                className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
              />
              <p className="text-sm text-[#001cab]">
                Cole o link do vídeo do YouTube que será usado na aula
              </p>
            </div>

            {videoPreview && (
              <div className="space-y-2">
                <Label className="text-[#030025] font-medium">Pré-visualização do Vídeo</Label>
                <div className="w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={videoPreview}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video preview"
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <div className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-[#28b0ff] rounded-lg">
              <Upload className="h-12 w-12 text-[#28b0ff] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#030025] mb-2">Adicionar Materiais</h3>
              <p className="text-[#001cab] mb-4">
                Faça upload de arquivos PDF, documentos ou apresentações para acompanhar a aula
              </p>
              <Button 
                variant="outline" 
                className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]"
              >
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Arquivos
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="space-y-4">
            <div className="bg-[#f0f6ff] border border-[#28b0ff] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#030025] mb-4">Resumo da Aula</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-[#001cab]">Título:</p>
                  <p className="text-[#030025]">{formData.title || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#001cab]">Matéria:</p>
                  <p className="text-[#030025]">{formData.subject || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#001cab]">Professor:</p>
                  <p className="text-[#030025]">{formData.teacher || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#001cab]">Turma:</p>
                  <p className="text-[#030025]">{formData.class || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#001cab]">Duração:</p>
                  <p className="text-[#030025]">{formData.duration ? `${formData.duration} minutos` : 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#001cab]">Vídeo:</p>
                  <p className="text-[#030025]">{youtubeUrl ? 'Configurado' : 'Não configurado'}</p>
                </div>
              </div>

              {formData.description && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-[#001cab] mb-2">Descrição:</p>
                  <p className="text-[#030025]">{formData.description}</p>
                </div>
              )}

              {videoPreview && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#001cab]">Vídeo da Aula:</p>
                  <div className="w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      src={videoPreview}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube video preview"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
          className="bg-[#0029ff] hover:bg-[#001cab] text-white"
          disabled={!formData.title || !formData.subject || !formData.teacher || !formData.class}
        >
          Criar Aula
        </Button>
      </div>
    </div>
  );
};

export default AddLesson;
