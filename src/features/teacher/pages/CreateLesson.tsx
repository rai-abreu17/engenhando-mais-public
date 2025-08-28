import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  BookOpen, 
  Save, 
  Eye,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import TeacherNavigation from '../components/TeacherNavigation';
import Header from '@/components/common/Header';
import { NavLink } from 'react-router-dom';

const CreateLesson: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    difficulty: 'Básico',
    duration: '',
    tags: [] as string[],
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
    materials: [] as File[],
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (files && files.length > 0) {
      if (field === 'materials') {
        handleInputChange(field, [...formData.materials, ...Array.from(files)]);
      } else {
        handleInputChange(field, files[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log('Submitting lesson:', { ...formData, isDraft });
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Criar Nova Aula ✏️"
        subtitle="Compartilhe seu conhecimento com os alunos"
      />

          <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
              {/* Back Button */}
              <Button variant="outline" asChild className="mb-4">
                <NavLink to="/teacher/lessons">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Aulas
                </NavLink>
              </Button>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título da Aula *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Ex: Introdução aos Limites"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duração Estimada</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        placeholder="Ex: 45 min"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descreva o conteúdo da aula, objetivos de aprendizagem e pré-requisitos..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="subject">Disciplina *</Label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="Cálculo I">Cálculo I</option>
                        <option value="Física I">Física I</option>
                        <option value="Matemática Básica">Matemática Básica</option>
                        <option value="Algoritmos">Algoritmos</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="class">Turma</Label>
                      <select
                        id="class"
                        value={formData.class}
                        onChange={(e) => handleInputChange('class', e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="">Selecione...</option>
                        <option value="Turma A">Turma A</option>
                        <option value="Turma B">Turma B</option>
                        <option value="Turma C">Turma C</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Dificuldade</Label>
                      <select
                        id="difficulty"
                        value={formData.difficulty}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="Básico">Básico</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags e Categorias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Video Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload de Vídeo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="video">Arquivo de Vídeo *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arraste e solte o arquivo de vídeo ou clique para selecionar
                      </p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload('videoFile', e.target.files)}
                        className="hidden"
                        id="video-upload"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('video-upload')?.click()}
                      >
                        Selecionar Arquivo
                      </Button>
                      {formData.videoFile && (
                        <p className="text-sm text-primary mt-2">
                          Arquivo selecionado: {formData.videoFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="thumbnail">Thumbnail (Opcional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('thumbnailFile', e.target.files)}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('thumbnail-upload')?.click()}
                      >
                        Selecionar Imagem
                      </Button>
                      {formData.thumbnailFile && (
                        <p className="text-sm text-primary mt-2">
                          {formData.thumbnailFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Materials */}
              <Card>
                <CardHeader>
                  <CardTitle>Materiais Complementares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>Arquivos de Apoio (PDFs, slides, etc.)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.ppt,.pptx,.doc,.docx"
                        onChange={(e) => handleFileUpload('materials', e.target.files)}
                        className="hidden"
                        id="materials-upload"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('materials-upload')?.click()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Materiais
                      </Button>
                      {formData.materials.length > 0 && (
                        <div className="mt-2">
                          {formData.materials.map((file, index) => (
                            <p key={index} className="text-sm text-primary">
                              {file.name}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={(e) => handleSubmit(e, true)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar como Rascunho
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Pré-visualizar
                </Button>
                <Button type="submit" className="flex-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Publicar Aula
                </Button>
              </div>
            </form>
          </div>

      <TeacherNavigation />
    </div>
  );
};

export default CreateLesson;