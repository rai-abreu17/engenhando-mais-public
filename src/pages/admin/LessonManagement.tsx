import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Users,
  Play,
  Pause,
  Check,
  X,
  Edit,
  Trash2,
  BookOpen,
  Video,
  FileText,
  Eye
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/components/admin/AdminNavigation';

const LessonManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // Mock data - em produção viria de APIs
  const lessons = [
    {
      id: 1,
      title: 'Introdução ao Cálculo Diferencial',
      subject: 'Matemática',
      teacher: 'Prof. Maria Silva',
      class: 'Cálculo I - Turma A',
      duration: 90,
      type: 'video',
      status: 'approved',
      views: 245,
      createdAt: '2024-01-10',
      scheduledFor: '2024-01-20',
      description: 'Conceitos fundamentais do cálculo diferencial e suas aplicações'
    },
    {
      id: 2,
      title: 'Leis de Newton - Aplicações Práticas',
      subject: 'Física',
      teacher: 'Prof. João Santos',
      class: 'Física I - Turma B',
      duration: 75,
      type: 'practical',
      status: 'pending',
      views: 0,
      createdAt: '2024-01-15',
      scheduledFor: '2024-01-22',
      description: 'Demonstrações práticas das três leis de Newton com experimentos'
    },
    {
      id: 3,
      title: 'Estruturas de Dados - Arrays e Listas',
      subject: 'Programação',
      teacher: 'Prof. Carlos Lima',
      class: 'Algoritmos - Turma C',
      duration: 120,
      type: 'video',
      status: 'approved',
      views: 189,
      createdAt: '2024-01-12',
      scheduledFor: '2024-01-18',
      description: 'Implementação e manipulação de arrays e listas em diferentes linguagens'
    },
    {
      id: 4,
      title: 'Reações Químicas Orgânicas',
      subject: 'Química',
      teacher: 'Prof. Ana Costa',
      class: 'Química Orgânica',
      duration: 105,
      type: 'theoretical',
      status: 'rejected',
      views: 0,
      createdAt: '2024-01-16',
      scheduledFor: '2024-01-25',
      description: 'Tipos de reações orgânicas e mecanismos de reação'
    }
  ];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || lesson.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || lesson.subject === filterSubject;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprovada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
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

  const handleApprove = (lessonId: number) => {
    console.log(`Approving lesson ${lessonId}`);
  };

  const handleReject = (lessonId: number) => {
    console.log(`Rejecting lesson ${lessonId}`);
  };

  const subjects = ['Matemática', 'Física', 'Química', 'Programação'];

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Gerenciar Aulas"
        subtitle="Aprove, edite e monitore as aulas do sistema"
      />

      <div className="px-6 space-y-6">
        {/* Barra de Ações */}
        <section className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-4 w-4" />
            <Input
              placeholder="Buscar por título, professor ou matéria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#fffaf0] border border-[#28b0ff] rounded-md text-sm text-[#030025] focus:border-[#0029ff] focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="approved">Aprovadas</option>
              <option value="pending">Pendentes</option>
              <option value="rejected">Rejeitadas</option>
            </select>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 bg-[#fffaf0] border border-[#28b0ff] rounded-md text-sm text-[#030025] focus:border-[#0029ff] focus:outline-none"
            >
              <option value="all">Todas as Matérias</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            
            <Button className="bg-[#0029ff] hover:bg-[#001cab] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Aula
            </Button>
          </div>
        </section>

        {/* Estatísticas Rápidas */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#00a86b]">{lessons.filter(l => l.status === 'approved').length}</p>
              <p className="text-sm text-[#001cab]">Aprovadas</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#ffb646]">{lessons.filter(l => l.status === 'pending').length}</p>
              <p className="text-sm text-[#001cab]">Pendentes</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#d75200]">{lessons.filter(l => l.status === 'rejected').length}</p>
              <p className="text-sm text-[#001cab]">Rejeitadas</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#0029ff]">{lessons.reduce((sum, l) => sum + l.views, 0)}</p>
              <p className="text-sm text-[#001cab]">Total Visualizações</p>
            </CardContent>
          </Card>
        </section>

        {/* Lista de Aulas */}
        <section>
          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="bg-[#fffaf0] border-[#28b0ff] hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-[#030025]">{lesson.title}</h3>
                        {getStatusBadge(lesson.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-[#001cab]">
                        <span>{lesson.teacher}</span>
                        <span>•</span>
                        <span>{lesson.class}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(lesson.type)}
                          <span>{getTypeLabel(lesson.type)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#d75200] text-[#d75200] hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-[#001cab] mb-4">{lesson.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                      <Eye className="h-4 w-4 text-[#001cab]" />
                      <span className="text-sm text-[#001cab]">{lesson.views} visualizações</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[#001cab]">
                        Criada em {new Date(lesson.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {lesson.status === 'pending' && (
                    <div className="flex space-x-2 pt-3 border-t border-[#e0e7ff]">
                      <Button 
                        size="sm" 
                        className="bg-[#00a86b] hover:bg-[#008853] text-white"
                        onClick={() => handleApprove(lesson.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-[#d75200] text-[#d75200] hover:bg-red-50"
                        onClick={() => handleReject(lesson.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  )}

                  {lesson.status === 'approved' && (
                    <div className="flex items-center justify-between pt-3 border-t border-[#e0e7ff]">
                      <div className="flex items-center space-x-2 text-sm text-[#00a86b]">
                        <Check className="h-4 w-4" />
                        <span>Aula aprovada e publicada</span>
                      </div>
                      <Button variant="outline" size="sm" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                        <Play className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </div>
                  )}

                  {lesson.status === 'rejected' && (
                    <div className="flex items-center justify-between pt-3 border-t border-[#e0e7ff]">
                      <div className="flex items-center space-x-2 text-sm text-[#d75200]">
                        <X className="h-4 w-4" />
                        <span>Aula rejeitada - requer revisão</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-[#00a86b] hover:bg-[#008853] text-white"
                        onClick={() => handleApprove(lesson.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Revisar e Aprovar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <Card className="bg-[#fffaf0] border-[#28b0ff]">
              <CardContent className="p-8 text-center">
                <p className="text-[#001cab]">Nenhuma aula encontrada com os filtros aplicados.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      <AdminNavigation />
    </div>
  );
};

export default LessonManagement;