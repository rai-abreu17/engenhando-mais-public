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
import TeacherNavigation from '../components/TeacherNavigation';
import Header from '@/components/common/Header';
import { NavLink } from 'react-router-dom';

const recentClasses = [
  {
    id: 1,
    name: 'Cálculo I - Turma A',
    students: 32,
    lastLesson: 'Limites Fundamentais',
    avgRating: 4.8,
    nextClass: '2024-01-15T14:00:00',
  },
  {
    id: 2,
    name: 'Física I - Turma B',
    students: 28,
    lastLesson: 'Movimento Retilíneo',
    avgRating: 4.6,
    nextClass: '2024-01-16T10:00:00',
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
    <div className="min-h-screen bg-background">
      <div className="md:flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r border-border bg-card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary mb-6">Portal do Professor</h2>
            <TeacherNavigation />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pb-20 md:pb-0">
          <Header 
            title="Bem-vindo, Professor! 👨‍🏫"
            subtitle="Gerencie suas turmas e acompanhe o progresso dos alunos"
          />

          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                icon={Users}
                title="Alunos Ativos"
                value="156"
                gradient="from-primary to-accent"
              />
              <StatsCard
                icon={BookOpen}
                title="Aulas Criadas"
                value="42"
                gradient="from-accent to-secondary"
              />
              <StatsCard
                icon={Star}
                title="Avaliação Média"
                value="4.7"
                gradient="from-secondary to-primary"
              />
              <StatsCard
                icon={TrendingUp}
                title="Engajamento"
                value="89%"
                gradient="from-destructive to-accent"
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
                  <Calendar size={20} />
                  Próximas Aulas
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
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-muted-foreground">{classItem.avgRating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {new Date(classItem.nextClass).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(classItem.nextClass).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
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
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <TeacherNavigation />
      </div>
    </div>
  );
};

export default TeacherDashboard;