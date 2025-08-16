import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, FileText, Upload, Play, ArrowLeft, Save } from 'lucide-react';
import Header from '@/features/student/components/Header';

const AddLessonPage: React.FC = () => {
  const navigate = useNavigate();
  
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
    // Aqui você pode adicionar a lógica para salvar a aula
    console.log('Dados da aula:', formData);
    // Voltar para a página de gerenciamento de aulas
    navigate('/admin/lessons');
  };

  const handleBack = () => {
    navigate('/admin/lessons');
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Adicionar Nova Aula"
        subtitle="Crie e configure uma nova aula para seus alunos"
      />

      <div className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Botão Voltar */}
          <div className="mb-4 sm:mb-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff] w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Gerenciar Aulas
            </Button>
          </div>

          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-[#030025] text-lg sm:text-xl">Nova Aula</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8 h-auto">
                  <TabsTrigger value="basic" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-center">Informações<br className="sm:hidden" /> Básicas</span>
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                    <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-center">Vídeo<br className="sm:hidden" /> YouTube</span>
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Materiais</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Visualizar</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Título da Aula */}
                    <div className="lg:col-span-2 space-y-2">
                      <Label htmlFor="title" className="text-[#030025] font-medium text-base sm:text-lg">Título da Aula *</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Introdução ao Cálculo Diferencial"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-10 sm:h-12 text-sm sm:text-lg"
                      />
                    </div>

                    {/* Matéria */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-[#030025] font-medium text-base sm:text-lg">Matéria *</Label>
                      <Select onValueChange={(value) => handleInputChange('subject', value)}>
                        <SelectTrigger className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-10 sm:h-12 text-sm sm:text-lg">
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
                      <Label htmlFor="teacher" className="text-[#030025] font-medium text-base sm:text-lg">Professor *</Label>
                      <Select onValueChange={(value) => handleInputChange('teacher', value)}>
                        <SelectTrigger className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-10 sm:h-12 text-sm sm:text-lg">
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
                      <Label htmlFor="class" className="text-[#030025] font-medium text-base sm:text-lg">Turma *</Label>
                      <Select onValueChange={(value) => handleInputChange('class', value)}>
                        <SelectTrigger className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-10 sm:h-12 text-sm sm:text-lg">
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
                      <Label htmlFor="duration" className="text-[#030025] font-medium text-base sm:text-lg">Duração (minutos) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="Ex: 60"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-10 sm:h-12 text-sm sm:text-lg"
                      />
                    </div>

                    {/* Descrição */}
                    <div className="lg:col-span-2 space-y-2">
                      <Label htmlFor="description" className="text-[#030025] font-medium text-base sm:text-lg">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva o conteúdo e objetivos da aula..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] min-h-[100px] sm:min-h-[120px] text-sm sm:text-lg"
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="video" className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="youtube-url" className="text-[#030025] font-medium text-base sm:text-lg">URL do YouTube *</Label>
                        <Input
                          id="youtube-url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={youtubeUrl}
                          onChange={(e) => handleYouTubeUrl(e.target.value)}
                          className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-10 sm:h-12 text-sm sm:text-lg"
                        />
                        <p className="text-xs sm:text-sm text-[#001cab] mt-2">
                          Cole o link do vídeo do YouTube que será usado na aula
                        </p>
                      </div>

                      <div className="bg-[#f0f6ff] border border-[#28b0ff] rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-[#030025] mb-2 text-sm sm:text-base">Dicas para o vídeo:</h4>
                        <ul className="text-xs sm:text-sm text-[#001cab] space-y-1">
                          <li>• Use vídeos educativos de qualidade</li>
                          <li>• Verifique se o vídeo está público</li>
                          <li>• Prefira vídeos com duração adequada à aula</li>
                          <li>• Teste o vídeo antes de salvar</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {videoPreview ? (
                        <div className="space-y-2">
                          <Label className="text-[#030025] font-medium text-base sm:text-lg">Pré-visualização do Vídeo</Label>
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
                      ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Pré-visualização do vídeo aparecerá aqui</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="text-center p-8 border-2 border-dashed border-[#28b0ff] rounded-lg">
                        <Upload className="h-16 w-16 text-[#28b0ff] mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-[#030025] mb-2">Adicionar Materiais</h3>
                        <p className="text-[#001cab] mb-6">
                          Faça upload de arquivos PDF, documentos ou apresentações para acompanhar a aula
                        </p>
                        <Button 
                          variant="outline" 
                          className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff] h-12 px-6 text-lg"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Selecionar Arquivos
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-[#030025]">Tipos de arquivos suportados:</h4>
                      <div className="bg-[#f0f6ff] border border-[#28b0ff] rounded-lg p-4">
                        <ul className="text-[#001cab] space-y-2">
                          <li>📄 PDF - Documentos e apostilas</li>
                          <li>📊 PowerPoint - Apresentações (ppt, pptx)</li>
                          <li>📝 Word - Documentos de texto (doc, docx)</li>
                          <li>📈 Excel - Planilhas (xls, xlsx)</li>
                          <li>🖼️ Imagens - PNG, JPG, JPEG</li>
                        </ul>
                      </div>
                      <p className="text-sm text-[#001cab]">
                        Tamanho máximo por arquivo: 10MB
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-8">
                  <div className="space-y-6">
                    <Card className="bg-[#f0f6ff] border-[#28b0ff]">
                      <CardHeader>
                        <CardTitle className="text-xl text-[#030025]">Resumo da Aula</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-medium text-[#001cab] mb-1">Título:</p>
                            <p className="text-[#030025] text-lg">{formData.title || 'Não informado'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#001cab] mb-1">Matéria:</p>
                            <p className="text-[#030025] text-lg">{formData.subject || 'Não informado'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#001cab] mb-1">Professor:</p>
                            <p className="text-[#030025] text-lg">{formData.teacher || 'Não informado'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#001cab] mb-1">Turma:</p>
                            <p className="text-[#030025] text-lg">{formData.class || 'Não informado'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#001cab] mb-1">Duração:</p>
                            <p className="text-[#030025] text-lg">{formData.duration ? `${formData.duration} minutos` : 'Não informado'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#001cab] mb-1">Vídeo:</p>
                            <p className="text-[#030025] text-lg">{youtubeUrl ? 'Configurado ✅' : 'Não configurado ❌'}</p>
                          </div>
                        </div>

                        {formData.description && (
                          <div>
                            <p className="text-sm font-medium text-[#001cab] mb-2">Descrição:</p>
                            <p className="text-[#030025] bg-white p-4 rounded-lg border border-[#e0e7ff]">{formData.description}</p>
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
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Botões de Ação Fixos */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-[#e0e7ff] mt-6 sm:mt-8 gap-3 sm:gap-0">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff] h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-lg w-full sm:w-auto order-3 sm:order-1"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Cancelar
                </Button>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto order-1 sm:order-2">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('preview')}
                    className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff] h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-lg w-full sm:w-auto"
                  >
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Visualizar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="bg-[#0029ff] hover:bg-[#001cab] text-white h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-lg w-full sm:w-auto"
                    disabled={!formData.title || !formData.subject || !formData.teacher || !formData.class}
                  >
                    <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Criar Aula
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddLessonPage;
