import React, { useState } from 'react';
import { 
  BookOpen, 
  Star, 
  Calendar,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import TeacherNavigation from '@/features/teacher/components/TeacherNavigation';
import Header from '@/features/student/components/Header';
import { NavLink } from 'react-router-dom';

const lessons = [
  {
    id: 1,
    title: 'Limites Fundamentais',
    description: 'Introdução aos conceitos básicos de limites em cálculo',
    subject: 'Cálculo I',
    class: 'Turma A',
    duration: '45 min',
    views: 156,
    avgRating: 4.8,
    totalRatings: 32,
    status: 'Publicada',
    publishedAt: '2024-01-10',
    difficulty: 'Intermediário',
    tags: ['limites', 'fundamentos', 'cálculo'],
  },
  {
    id: 2,
    title: 'Derivadas - Conceitos Básicos',
    description: 'Conceitos fundamentais sobre derivadas e suas aplicações',
    subject: 'Cálculo I',
    class: 'Turma A',
    duration: '50 min',
    views: 142,
    avgRating: 4.9,
    totalRatings: 28,
    status: 'Publicada',
    publishedAt: '2024-01-08',
    difficulty: 'Intermediário',
    tags: ['derivadas', 'conceitos', 'aplicações'],
  },
  {
    id: 3,
    title: 'Movimento Retilíneo Uniforme',
    description: 'Estudo do movimento em linha reta com velocidade constante',
    subject: 'Física I',
    class: 'Turma B',
    duration: '40 min',
    views: 98,
    avgRating: 4.7,
    totalRatings: 22,
    status: 'Rascunho',
    publishedAt: null,
    difficulty: 'Básico',
    tags: ['física', 'movimento', 'cinemática'],
  },
  {
    id: 4,
    title: 'Equações Diferenciais',
    description: 'Introdução às equações diferenciais ordinárias',
    subject: 'Cálculo II',
    class: 'Turma A',
    duration: '55 min',
    views: 0,
    avgRating: 0,
    totalRatings: 0,
    status: 'Rejeitada',
    publishedAt: null,
    difficulty: 'Avançado',
    tags: ['equações', 'diferenciais', 'cálculo'],
    rejectionReason: 'Áudio com problema técnico, necessita regravação'
  },
];

const TeacherLessons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const subjects = Array.from(new Set(lessons.map(lesson => lesson.subject)));

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicada': return 'bg-[#f0f6ff] text-[#001cab] border-[#28b0ff]';
      case 'Rascunho': return 'bg-[#fffaf0] text-[#ff7a28] border-[#ffb646]';
      case 'Rejeitada': return 'bg-[#fffaf0] text-[#d75200] border-[#d75200]';
      case 'Arquivada': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-blue-100 text-blue-800';
      case 'Intermediário': return 'bg-orange-100 text-orange-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Minhas Aulas 📚"
        subtitle="Gerencie e acompanhe suas videoaulas"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#030025]">Aulas Criadas</h2>
            <p className="text-xs sm:text-sm text-[#001cab]">
              {lessons.length} {lessons.length === 1 ? 'aula' : 'aulas'} no total
              {hasActiveFilters && ` • ${filteredLessons.length} ${filteredLessons.length === 1 ? 'corresponde' : 'correspondem'} aos filtros`}
            </p>
          </div>
          <Button 
            className="bg-[#0029ff] hover:bg-[#001cab] text-white w-full sm:w-auto text-xs sm:text-sm"
            asChild
          >
            <NavLink to="/teacher/lessons/create">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Nova Aula</span>
              <span className="sm:hidden">Nova</span>
            </NavLink>
          </Button>
        </section>

        <section className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-3 w-3 sm:h-4 sm:w-4" />
            <Input
              placeholder="Buscar por título ou descrição..."
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
                    { value: 'Publicada', label: 'Publicadas', count: lessons.filter(l => l.status === 'Publicada').length },
                    { value: 'Rascunho', label: 'Rascunhos', count: lessons.filter(l => l.status === 'Rascunho').length },
                    { value: 'Rejeitada', label: 'Rejeitadas', count: lessons.filter(l => l.status === 'Rejeitada').length },
                    { value: 'Arquivada', label: 'Arquivadas', count: lessons.filter(l => l.status === 'Arquivada').length }
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

        {/* Lessons Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{lesson.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{lesson.subject} • {lesson.class}</p>
                  </div>
                  <Badge className={getStatusColor(lesson.status)}>
                    {lesson.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
                
                {/* Rejection Reason */}
                {lesson.status === 'Rejeitada' && lesson.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                    <p className="text-xs text-red-700">
                      <strong>Motivo da rejeição:</strong> {lesson.rejectionReason}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metadata */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{lesson.duration}</span>
                  </div>
                  <Badge className={getDifficultyColor(lesson.difficulty)}>
                    {lesson.difficulty}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lesson.views} visualizações</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{lesson.avgRating} ({lesson.totalRatings})</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {lesson.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{lesson.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Publication Date */}
                {lesson.publishedAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Publicada em {new Date(lesson.publishedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <section className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma aula encontrada
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Você ainda não criou nenhuma aula.'}
            </p>
            <Button asChild>
              <NavLink to="/teacher/lessons/create">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Aula
              </NavLink>
            </Button>
          </section>
        )}
      </div>

      <TeacherNavigation />
    </div>
  );
};

export default TeacherLessons;
