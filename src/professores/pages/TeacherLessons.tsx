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
import TeacherNavigation from '../components/TeacherNavigation';
import Header from '@/components/common/Header';
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
];

const TeacherLessons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');
  const [selectedSubject, setSelectedSubject] = useState('Todas');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const subjects = ['Todas', ...Array.from(new Set(lessons.map(lesson => lesson.subject)))];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'Todas' || lesson.status === selectedFilter;
    const matchesSubject = selectedSubject === 'Todas' || lesson.subject === selectedSubject;
    return matchesSearch && matchesFilter && matchesSubject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicada': return 'bg-green-100 text-green-800';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-800';
      case 'Arquivada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-engenha-light-blue text-engenha-bright-blue';
      case 'Intermediário': return 'bg-orange-100 text-orange-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20 md:pb-0">
          <Header 
            title="Minhas Aulas 📚"
            subtitle="Gerencie e acompanhe suas videoaulas"
          />

          <div className="p-6 space-y-6">
            {/* Barra de Pesquisa com Filtro */}
            <div className="flex items-center mb-4 gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Buscar aulas por título ou descrição"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#28b0ff] rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#0029ff] focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#001cab]" size={20} />
              </div>
              {/* Ícone de filtro */}
              <div className="relative">
                <Button variant="outline" size="icon" className="rounded-full" aria-label="Filtrar aulas" onClick={() => setShowFilterMenu(v => !v)}>
                  <Filter className="h-5 w-5" />
                </Button>
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-10 p-2 space-y-2">
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 mb-1">Status</span>
                      {['Todas', 'Publicada', 'Rascunho', 'Arquivada'].map((filter) => (
                        <button
                          key={filter}
                          className={`w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-sm ${selectedFilter === filter ? 'font-bold text-primary' : ''}`}
                          onClick={() => { setSelectedFilter(filter); setShowFilterMenu(false); }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <span className="block text-xs font-semibold text-gray-500 mb-1">Disciplina</span>
                      {subjects.map((subject) => (
                        <button
                          key={subject}
                          className={`w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-sm ${selectedSubject === subject ? 'font-bold text-primary' : ''}`}
                          onClick={() => { setSelectedSubject(subject); setShowFilterMenu(false); }}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Create Lesson Button */}
            <div className="flex justify-end">
              <Button asChild>
                <NavLink to="/teacher/lessons/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Nova Aula
                </NavLink>
              </Button>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
            </div>

            {/* Empty State */}
            {filteredLessons.length === 0 && (
              <div className="text-center py-12">
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
              </div>
            )}
          </div>
        </div>

      <TeacherNavigation />
    </div>
  );
};

export default TeacherLessons;