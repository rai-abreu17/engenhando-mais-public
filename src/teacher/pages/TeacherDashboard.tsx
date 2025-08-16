import React from 'react';
import { 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp,
  MessageSquare,
  Calendar,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/shared/StatsCard';
import TeacherNavigation from '@/features/teacher/components/TeacherNavigation';
import Header from '@/features/student/components/Header';
import { NavLink } from 'react-router-dom';

const recentClasses = [
  {
    id: 1,
    name: 'Cálculo I - Turma A',
    students: 32,
    lastLesson: 'Limites Fundamentais',
    avgRating: 4.8,
    views: 156,
    publishedDate: '2024-01-10',
  },
  {
    id: 2,
    name: 'Física I - Turma B',
    students: 28,
    lastLesson: 'Movimento Retilíneo',
    avgRating: 4.6,
    views: 142,
    publishedDate: '2024-01-08',
  },
];

const recentFeedback = [
  {
    id: 1,
    student: 'Ana Silva',
    lesson: 'Derivadas Básicas',
    rating: 5,
    comment: 'Excelente explicação! Consegui entender perfeitamente.',
    date: '2024-01-10',
  },
  {
    id: 2,
    student: 'João Santos',
    lesson: 'Integrais Definidas', 
    rating: 4,
    comment: 'Muito bom, mas poderia ter mais exemplos práticos.',
    date: '2024-01-09',
  },
];

const TeacherDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Bem-vindo, Professor! 👨‍🏫"
        subtitle="Gerencie suas turmas e acompanhe o progresso dos alunos"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            icon={Users}
            title="Alunos Ativos"
            value="156"
            gradient="from-[#0029ff] to-[#28b0ff]"
            iconColor="white"
          />
          <StatsCard
            icon={BookOpen}
            title="Aulas Criadas"
            value="42"
            gradient="from-[#28b0ff] to-[#0029ff]"
            iconColor="white"
          />
          <StatsCard
            icon={Star}
            title="Avaliação Média"
            value="4.7"
            gradient="from-[#ff7a28] to-[#ffb646]"
            iconColor="white"
          />
          <StatsCard
            icon={TrendingUp}
            title="Engajamento"
            value="89%"
            gradient="from-[#001cab] to-[#0029ff]"
            iconColor="white"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 flex-col gap-2">
                <NavLink to="/teacher/lessons/create">
                  <BookOpen size={24} />
                  <span>Criar Nova Aula</span>
                </NavLink>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <NavLink to="/teacher/classes">
                  <Users size={24} />
                  <span>Gerenciar Turmas</span>
                </NavLink>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                <NavLink to="/teacher/feedback">
                  <MessageSquare size={24} />
                  <span>Ver Feedback</span>
                </NavLink>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Aulas Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClasses.map((classItem) => (
                <div 
                  key={classItem.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{classItem.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {classItem.students} alunos • Última aula: {classItem.lastLesson}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{classItem.avgRating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{classItem.views} visualizações</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      Publicado em
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(classItem.publishedDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare size={20} />
              Feedback Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="p-4 border border-border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{feedback.student}</h4>
                      <p className="text-sm text-muted-foreground">{feedback.lesson}</p>
                    </div>
                    <div className="flex items-center gap-1">
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
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{feedback.comment}"</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(feedback.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <TeacherNavigation />
    </div>
  );
};

export default TeacherDashboard;