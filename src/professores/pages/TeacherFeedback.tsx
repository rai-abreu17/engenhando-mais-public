import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import TeacherNavigation from '../components/TeacherNavigation';
import Header from '@/components/common/Header';

const feedbacks = [
  {
    id: 1,
    student: 'Ana Silva',
    studentAvatar: '👩‍🎓',
    lesson: 'Limites Fundamentais',
    subject: 'Cálculo I',
    class: 'Turma A',
    rating: 5,
    comment: 'Excelente explicação! O professor conseguiu tornar um conceito complexo muito mais fácil de entender. Os exemplos práticos foram fundamentais para minha compreensão.',
    date: '2024-01-12',
    helpful: true,
    tags: ['clara', 'didática', 'exemplos'],
  },
  {
    id: 2,
    student: 'João Santos',
    studentAvatar: '👨‍🎓',
    lesson: 'Derivadas - Conceitos Básicos',
    subject: 'Cálculo I', 
    class: 'Turma A',
    rating: 4,
    comment: 'Muito boa aula! Só senti falta de mais exercícios resolvidos passo a passo. Talvez pudesse ter mais exemplos práticos aplicados.',
    date: '2024-01-11',
    helpful: true,
    tags: ['boa', 'mais exercícios'],
  },
  {
    id: 3,
    student: 'Maria Oliveira',
    studentAvatar: '👩‍🎓',
    lesson: 'Movimento Retilíneo',
    subject: 'Física I',
    class: 'Turma B',
    rating: 5,
    comment: 'Perfeita! A forma como relacionou a teoria com exemplos do dia a dia foi incrível. Consegui entender completamente o conceito.',
    date: '2024-01-10',
    helpful: true,
    tags: ['perfeita', 'exemplos práticos'],
  },
  {
    id: 4,
    student: 'Pedro Costa',
    studentAvatar: '👨‍🎓',
    lesson: 'Limites Fundamentais',
    subject: 'Cálculo I',
    class: 'Turma A',
    rating: 3,
    comment: 'A aula está boa, mas achei um pouco rápida. Talvez pudesse ter pausas maiores entre os conceitos para absorvermos melhor.',
    date: '2024-01-09',
    helpful: true,
    tags: ['muito rápida', 'pausas'],
  },
  {
    id: 5,
    student: 'Carla Lima',
    studentAvatar: '👩‍🎓',
    lesson: 'Derivadas - Conceitos Básicos',
    subject: 'Cálculo I',
    class: 'Turma A',
    rating: 5,
    comment: 'Simplesmente fantástica! O professor tem um dom para ensinar. Recomendo para todos os colegas.',
    date: '2024-01-08',
    helpful: true,
    tags: ['fantástica', 'dom para ensinar'],
  },
];

const TeacherFeedback: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('Todas');
  const [selectedSubject, setSelectedSubject] = useState('Todas');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const subjects = ['Todas', ...Array.from(new Set(feedbacks.map(f => f.subject)))];
  const ratings = ['Todas', '5', '4', '3', '2', '1'];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.lesson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = selectedRating === 'Todas' || feedback.rating.toString() === selectedRating;
    const matchesSubject = selectedSubject === 'Todas' || feedback.subject === selectedSubject;
    return matchesSearch && matchesRating && matchesSubject;
  });

  // Statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks).toFixed(1);
  const positivePercentage = Math.round((feedbacks.filter(f => f.rating >= 4).length / totalFeedbacks) * 100);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20 md:pb-0">
          <Header 
            title="Feedback dos Alunos 💬"
            subtitle="Veja o que seus alunos estão dizendo sobre suas aulas"
          />

          <div className="p-6 space-y-6">
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Feedbacks</p>
                      <p className="text-2xl font-bold">{totalFeedbacks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-8 w-8 text-yellow-500 fill-current" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avaliação Média</p>
                      <p className="text-2xl font-bold">{averageRating}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avaliações Positivas</p>
                      <p className="text-2xl font-bold">{positivePercentage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center mb-4 gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Buscar por aluno, aula ou comentário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#fffaf0] border border-[#28b0ff] rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#0029ff] focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#001cab]" size={20} />
              </div>
              {/* Ícone de filtro */}
              <div className="relative">
                <Button variant="outline" size="icon" className="rounded-full" aria-label="Filtrar feedbacks" onClick={() => setShowFilterMenu(v => !v)}>
                  <Filter className="h-5 w-5" />
                </Button>
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 p-2 space-y-2">
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 mb-1">Nota</span>
                      {ratings.map((rating) => (
                        <button
                          key={rating}
                          className={`w-full text-left px-3 py-1 rounded hover:bg-gray-100 text-sm ${selectedRating === rating ? 'font-bold text-primary' : ''}`}
                          onClick={() => { setSelectedRating(rating); setShowFilterMenu(false); }}
                        >
                          {rating === 'Todas' ? 'Todas as notas' : `${rating} estrelas`}
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

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedbacks.map((feedback) => (
                <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{feedback.studentAvatar}</span>
                        <div>
                          <h3 className="font-semibold text-foreground">{feedback.student}</h3>
                          <p className="text-sm text-muted-foreground">
                            {feedback.lesson} • {feedback.subject} • {feedback.class}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < feedback.rating 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          ))}
                          <span className={`ml-1 font-medium ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(feedback.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-foreground italic mb-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                      "{feedback.comment}"
                    </blockquote>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {feedback.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {feedback.helpful && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Útil
                          </Badge>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Responder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredFeedbacks.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum feedback encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Seus alunos ainda não deixaram comentários.'}
                </p>
              </div>
            )}
          </div>
        </div>

      <TeacherNavigation />
    </div>
  );
};

export default TeacherFeedback;