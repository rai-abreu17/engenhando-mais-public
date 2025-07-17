import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Eye,
  MoreVertical
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/admin/components/AdminNavigation';
import RemoveLesson from '@/components/admin/RemoveLesson';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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

const LessonManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLessonForDeletion, setSelectedLessonForDeletion] = useState<Lesson | null>(null);

  // Mock data - em produção viria de APIs
  const [lessons, setLessons] = useState<Lesson[]>([
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
      description: 'Tipos de reações orgânicas e mecanismos de reação',
      rejectionComment: 'A aula precisa de mais exemplos práticos e experimentos demonstrativos. O conteúdo teórico está bom, mas falta aplicação prática dos conceitos apresentados.'
    },
    {
      id: 5,
      title: 'Álgebra Linear - Espaços Vetoriais',
      subject: 'Matemática',
      teacher: 'Prof. Maria Silva',
      class: 'Álgebra Linear - Turma A',
      duration: 90,
      type: 'video',
      status: 'pending',
      views: 0,
      createdAt: '2024-01-18',
      scheduledFor: '2024-01-28',
      description: 'Introdução aos espaços vetoriais e suas propriedades fundamentais'
    }
  ]);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(lesson.status);
    const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(lesson.subject);
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedSubjects([]);
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchTerm || selectedStatuses.length > 0 || selectedSubjects.length > 0;

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

  const handleDeleteLesson = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setSelectedLessonForDeletion(lesson);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDeleteLesson = (lessonId: number) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
    setShowDeleteModal(false);
    setSelectedLessonForDeletion(null);
    console.log(`🗑️ Aula ${lessonId} excluída`);
  };

  const handleCancelDeleteLesson = () => {
    setShowDeleteModal(false);
    setSelectedLessonForDeletion(null);
  };

  const subjects = ['Matemática', 'Física', 'Química', 'Programação'];

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Gerenciar Aulas"
        subtitle="Aprove, edite e monitore as aulas do sistema"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Cabeçalho da seção */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 lg:gap-4">
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#030025]">Aulas Cadastradas</h2>
            <p className="text-xs sm:text-sm text-[#001cab]">
              {lessons.length} {lessons.length === 1 ? 'aula' : 'aulas'} no total
              {hasActiveFilters && ` • ${filteredLessons.length} ${filteredLessons.length === 1 ? 'corresponde' : 'correspondem'} aos filtros`}
            </p>
          </div>
          <Button 
            className="bg-[#0029ff] hover:bg-[#001cab] text-white w-full sm:w-auto text-xs sm:text-sm"
            onClick={() => navigate('/admin/lessons/add')}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Nova Aula</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </section>

        {/* Barra de Ações */}
        <section className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-3 w-3 sm:h-4 sm:w-4" />
            <Input
              placeholder="Buscar por título, professor ou matéria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-8 sm:h-10 text-xs sm:text-sm"
            />
          </div>
          
          {/* Botão de Filtros */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className={`border-[#28b0ff] hover:bg-[#f0f6ff] w-8 sm:w-auto text-xs sm:text-sm h-8 sm:h-10 p-0 sm:px-3 ${hasActiveFilters ? 'bg-[#0029ff] text-white border-[#0029ff]' : 'text-[#0029ff]'}`}
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filtros</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="hidden sm:inline-flex ml-2 bg-white/20 text-white text-xs">
                    {selectedStatuses.length + selectedSubjects.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#030025]">Filtrar Aulas</h4>
                    {hasActiveFilters && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="h-6 px-2 text-xs text-[#0029ff]"
                      >
                        Limpar tudo
                      </Button>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-[#001cab]">Status</h5>
                    {[
                      { value: 'approved', label: 'Aprovadas', count: lessons.filter(l => l.status === 'approved').length },
                      { value: 'pending', label: 'Pendentes', count: lessons.filter(l => l.status === 'pending').length },
                      { value: 'rejected', label: 'Rejeitadas', count: lessons.filter(l => l.status === 'rejected').length }
                    ].map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={status.value}
                          checked={selectedStatuses.includes(status.value)}
                          onCheckedChange={() => handleStatusToggle(status.value)}
                        />
                        <label 
                          htmlFor={status.value}
                          className="text-sm flex-1 flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-[#030025]">{status.label}</span>
                          <Badge variant="secondary" className="bg-[#f0f6ff] text-[#001cab]">
                            {status.count}
                          </Badge>
                        </label>
                      </div>
                    ))}
                  </div>

                  <Separator />
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-[#001cab]">Matérias</h5>
                    {subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject}
                          checked={selectedSubjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <label 
                          htmlFor={subject}
                          className="text-sm flex-1 flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-[#030025]">{subject}</span>
                          <Badge variant="secondary" className="bg-[#f0f6ff] text-[#001cab]">
                            {lessons.filter(l => l.subject === subject).length}
                          </Badge>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
          {/* Resultado da busca/filtro */}
          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-[#f0f6ff] border border-[#28b0ff] rounded-lg">
              <p className="text-sm text-[#001cab]">
                {filteredLessons.length === 0 ? (
                  <>Nenhum resultado encontrado</>
                ) : (
                  <>
                    Mostrando <strong>{filteredLessons.length}</strong> de <strong>{lessons.length}</strong> {filteredLessons.length === 1 ? 'aula' : 'aulas'}
                    {searchTerm && <> para "<strong>{searchTerm}</strong>"</>}
                    {selectedStatuses.length > 0 && (
                      <> com status: <strong>
                        {selectedStatuses.map(status => 
                          status === 'approved' ? 'Aprovadas' : 
                          status === 'pending' ? 'Pendentes' : 'Rejeitadas'
                        ).join(', ')}
                      </strong></>
                    )}
                    {selectedSubjects.length > 0 && (
                      <> nas matérias: <strong>
                        {selectedSubjects.join(', ')}
                      </strong></>
                    )}
                  </>
                )}
              </p>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 h-6 px-2 text-xs text-[#0029ff]"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          )}

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
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteLesson(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir aula
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

                  {lesson.status === 'approved' && (
                    <div className="flex items-center pt-3 border-t border-[#e0e7ff]">
                      <div className="flex items-center space-x-2 text-sm text-[#00a86b]">
                        <Check className="h-4 w-4" />
                        <span>Aula aprovada e publicada</span>
                      </div>
                    </div>
                  )}

                  {lesson.status === 'rejected' && (
                    <div className="pt-3 border-t border-[#e0e7ff] space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-[#d75200]">
                        <X className="h-4 w-4" />
                        <span>Aula rejeitada - requer revisão</span>
                      </div>
                      
                      {lesson.rejectionComment && (
                        <div className="bg-[#fff4f4] border border-[#ffcdd2] rounded-lg p-3">
                          <h4 className="text-sm font-medium text-[#d32f2f] mb-2">Comentários da Revisão:</h4>
                          <p className="text-sm text-[#b71c1c] leading-relaxed">{lesson.rejectionComment}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botão de ação principal */}
                  <div className="pt-4 border-t border-[#e0e7ff] mt-4">
                    <div className="flex justify-end">
                      {lesson.status === 'approved' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#0029ff] text-[#0029ff] hover:bg-[#0029ff] hover:text-white"
                          onClick={() => navigate(`/admin/lessons/review/${lesson.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-[#0029ff] hover:bg-[#001cab] text-white"
                          onClick={() => navigate(`/admin/lessons/review/${lesson.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Revisar
                        </Button>
                      )}
                    </div>
                  </div>
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

      {/* Modal para excluir aula */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          {selectedLessonForDeletion && (
            <RemoveLesson
              lesson={selectedLessonForDeletion}
              onConfirm={handleConfirmDeleteLesson}
              onCancel={handleCancelDeleteLesson}
            />
          )}
        </DialogContent>
      </Dialog>

      <AdminNavigation />
    </div>
  );
};

export default LessonManagement;