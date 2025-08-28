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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const subjects = Array.from(new Set(feedbacks.map(f => f.subject)));
  const ratings = ['5', '4', '3', '2', '1'];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.lesson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(feedback.rating.toString());
    const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(feedback.subject);
    return matchesSearch && matchesRating && matchesSubject;
  });

  const toggleRating = (rating: string) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const clearFilters = () => {
    setSelectedRatings([]);
    setSelectedSubjects([]);
    setSearchTerm('');
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchTerm || selectedRatings.length > 0 || selectedSubjects.length > 0;

  // Statistics
  const totalFeedbacks = feedbacks.length;
  const averageRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks).toFixed(1);
  const positivePercentage = Math.round((feedbacks.filter(f => f.rating >= 4).length / totalFeedbacks) * 100);

  // Stats para os filtros
  const ratingStats = ratings.map(rating => ({
    value: rating,
    label: `${rating} estrelas`,
    count: feedbacks.filter(f => f.rating.toString() === rating).length
  }));

  const subjectStats = subjects.map(subject => ({
    value: subject,
    label: subject,
    count: feedbacks.filter(f => f.subject === subject).length
  }));

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Feedback dos Alunos 💬"
        subtitle="Veja o que seus alunos estão dizendo sobre suas aulas"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
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
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#030025]">
                Feedbacks ({totalFeedbacks})
                {hasActiveFilters && ` • ${filteredFeedbacks.length} ${filteredFeedbacks.length === 1 ? 'corresponde' : 'correspondem'} aos filtros`}
              </h2>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-3 w-3 sm:h-4 sm:w-4" />
                <Input
                  placeholder="Buscar por aluno, aula ou comentário..."
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
                        {selectedRatings.length + selectedSubjects.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-[#030025]">Filtrar Feedbacks</h4>
                      {hasActiveFilters && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFilters}
                          className="text-xs text-[#d75200] hover:text-[#d75200] hover:bg-[#fffaf0] h-8 px-2"
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs sm:text-sm font-medium text-[#030025] mb-3">Avaliação</h5>
                        <div className="space-y-2">
                          {ratingStats.map((rating) => (
                            <div key={rating.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`rating-${rating.value}`}
                                checked={selectedRatings.includes(rating.value)}
                                onCheckedChange={() => toggleRating(rating.value)}
                                className="border-[#28b0ff] data-[state=checked]:bg-[#0029ff] data-[state=checked]:border-[#0029ff]"
                              />
                              <label 
                                htmlFor={`rating-${rating.value}`} 
                                className="text-xs sm:text-sm text-[#030025] cursor-pointer flex items-center gap-2"
                              >
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3 w-3 ${i < parseInt(rating.value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <Badge variant="secondary" className="bg-[#f0f6ff] text-[#0029ff] text-xs">
                                  {rating.count}
                                </Badge>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h5 className="text-xs sm:text-sm font-medium text-[#030025] mb-3">Disciplina</h5>
                        <div className="space-y-2">
                          {subjectStats.map((subject) => (
                            <div key={subject.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`subject-${subject.value}`}
                                checked={selectedSubjects.includes(subject.value)}
                                onCheckedChange={() => toggleSubject(subject.value)}
                                className="border-[#28b0ff] data-[state=checked]:bg-[#0029ff] data-[state=checked]:border-[#0029ff]"
                              />
                              <label 
                                htmlFor={`subject-${subject.value}`} 
                                className="text-xs sm:text-sm text-[#030025] cursor-pointer flex items-center gap-2"
                              >
                                {subject.label}
                                <Badge variant="secondary" className="bg-[#f0f6ff] text-[#0029ff] text-xs">
                                  {subject.count}
                                </Badge>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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

      <TeacherNavigation />
    </div>
  );
};

export default TeacherFeedback;
