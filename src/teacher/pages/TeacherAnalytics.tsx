import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Calendar,
  Target,
  Award,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TeacherNavigation from '../components/TeacherNavigation';
import Header from '@/components/common/Header';

const analyticsData = {
  overview: {
    totalStudents: 156,
    totalLessons: 42,
    totalViews: 3240,
    avgRating: 4.7,
    engagementRate: 89,
    completionRate: 76,
  },
  monthlyData: [
    { month: 'Jan', views: 680, students: 32, lessons: 8 },
    { month: 'Fev', views: 890, students: 45, lessons: 12 },
    { month: 'Mar', views: 1200, students: 58, lessons: 15 },
    { month: 'Abr', views: 1470, students: 67, lessons: 18 },
  ],
  topLessons: [
    { title: 'Limites Fundamentais', views: 456, rating: 4.9, completion: 92 },
    { title: 'Derivadas Básicas', views: 398, rating: 4.8, completion: 87 },
    { title: 'Integrais Definidas', views: 321, rating: 4.7, completion: 79 },
    { title: 'Movimento Retilíneo', views: 289, rating: 4.6, completion: 83 },
  ],
  classPerformance: [
    { class: 'Cálculo I - Turma A', students: 32, avgScore: 8.5, engagement: 94 },
    { class: 'Física I - Turma B', students: 28, avgScore: 7.8, engagement: 87 },
    { class: 'Matemática Básica', students: 45, avgScore: 9.1, engagement: 91 },
  ],
  studentFeedback: {
    positive: 78,
    neutral: 18,
    negative: 4,
  },
};

const TeacherAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const { overview, topLessons, classPerformance, studentFeedback } = analyticsData;

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
            title="Relatórios e Análises 📊"
            subtitle="Acompanhe o desempenho de suas aulas e alunos"
          />

          <div className="p-6 space-y-6">
            {/* Period Selector */}
            <div className="flex gap-2">
              {['7d', '30d', '90d', '1y'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period === '7d' && '7 dias'}
                  {period === '30d' && '30 dias'}
                  {period === '90d' && '3 meses'}
                  {period === '1y' && '1 ano'}
                </Button>
              ))}
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Alunos</p>
                      <p className="text-lg font-bold">{overview.totalStudents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Visualizações</p>
                      <p className="text-lg font-bold">{overview.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Avaliação</p>
                      <p className="text-lg font-bold">{overview.avgRating}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Engajamento</p>
                      <p className="text-lg font-bold">{overview.engagementRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Conclusão</p>
                      <p className="text-lg font-bold">{overview.completionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Aulas</p>
                      <p className="text-lg font-bold">{overview.totalLessons}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Visualizações por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.monthlyData.map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="flex items-center gap-4 flex-1 max-w-xs">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(month.views / 1500) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                            {month.views}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Distribuição de Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">Positivo</span>
                      <div className="flex items-center gap-4 flex-1 max-w-xs">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${studentFeedback.positive}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                          {studentFeedback.positive}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-600">Neutro</span>
                      <div className="flex items-center gap-4 flex-1 max-w-xs">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${studentFeedback.neutral}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                          {studentFeedback.neutral}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-600">Negativo</span>
                      <div className="flex items-center gap-4 flex-1 max-w-xs">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${studentFeedback.negative}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                          {studentFeedback.negative}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Aulas Mais Assistidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topLessons.map((lesson, index) => (
                    <div key={lesson.title} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-foreground">{lesson.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{lesson.views} visualizações</span>
                            <span>★ {lesson.rating}</span>
                            <span>{lesson.completion}% conclusão</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Class Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Performance por Turma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classPerformance.map((classData) => (
                    <div key={classData.class} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{classData.class}</h4>
                        <p className="text-sm text-muted-foreground">{classData.students} alunos</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Nota Média: {classData.avgScore}</p>
                        <p className="text-sm text-muted-foreground">Engajamento: {classData.engagement}%</p>
                      </div>
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

export default TeacherAnalytics;