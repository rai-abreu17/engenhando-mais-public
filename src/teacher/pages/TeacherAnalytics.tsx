import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Eye, 
  Award, 
  BookOpen, 
  Clock, 
  TrendingUp,
  BarChart3,
  Star,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import Header from '@/features/student/components/Header';
import TeacherNavigation from '@/features/teacher/components/TeacherNavigation';

// Mock data - em produção viria de APIs
const analyticsData = {
  overview: {
    totalStudents: 156,
    totalViews: 2847,
    avgRating: 4.7,
    totalLessons: 24,
    totalHours: 18.5,
    engagement: 87
  },
  topLessons: [
    { id: 1, title: 'Limites Fundamentais', views: 342, rating: 4.8, subject: 'Cálculo I' },
    { id: 2, title: 'Derivadas Básicas', views: 298, rating: 4.9, subject: 'Cálculo I' },
    { id: 3, title: 'Movimento Retilíneo', views: 265, rating: 4.6, subject: 'Física I' },
    { id: 4, title: 'Integrais Simples', views: 231, rating: 4.7, subject: 'Cálculo I' },
    { id: 5, title: 'Cinemática', views: 198, rating: 4.5, subject: 'Física I' }
  ],
  classPerformance: [
    { class: 'Turma A - Cálculo I', students: 45, avgScore: 8.3, engagement: 92 },
    { class: 'Turma B - Física I', students: 38, avgScore: 7.8, engagement: 85 },
    { class: 'Turma C - Cálculo I', students: 42, avgScore: 8.1, engagement: 88 },
    { class: 'Turma D - Física I', students: 31, avgScore: 7.9, engagement: 83 }
  ],
  studentFeedback: [
    { id: 1, student: 'Ana Silva', lesson: 'Limites Fundamentais', rating: 5, comment: 'Excelente explicação!' },
    { id: 2, student: 'João Santos', lesson: 'Derivadas Básicas', rating: 5, comment: 'Muito didático' },
    { id: 3, student: 'Maria Costa', lesson: 'Movimento Retilíneo', rating: 4, comment: 'Bom conteúdo' },
    { id: 4, student: 'Pedro Lima', lesson: 'Integrais Simples', rating: 5, comment: 'Entendi perfeitamente' }
  ]
};

const TeacherAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const { overview, topLessons, classPerformance, studentFeedback } = analyticsData;

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Relatórios e Análises 📊"
        subtitle="Acompanhe o desempenho de suas aulas e alunos"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Period Selector */}
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={`text-xs sm:text-sm ${
                selectedPeriod === period 
                  ? 'bg-[#0029ff] text-white border-[#0029ff]' 
                  : 'border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]'
              }`}
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
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0029ff]" />
                <div>
                  <p className="text-xs text-[#001cab]">Alunos</p>
                  <p className="text-lg font-bold text-[#030025]">{overview.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#28b0ff]" />
                <div>
                  <p className="text-xs text-[#001cab]">Visualizações</p>
                  <p className="text-lg font-bold text-[#030025]">{overview.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#ff7a28]" />
                <div>
                  <p className="text-xs text-[#001cab]">Avaliação</p>
                  <p className="text-lg font-bold text-[#030025]">{overview.avgRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0029ff]" />
                <div>
                  <p className="text-xs text-[#001cab]">Aulas</p>
                  <p className="text-lg font-bold text-[#030025]">{overview.totalLessons}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#28b0ff]" />
                <div>
                  <p className="text-xs text-[#001cab]">Horas</p>
                  <p className="text-lg font-bold text-[#030025]">{overview.totalHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#ff7a28]" />
                <div>
                  <p className="text-xs text-[#001cab]">Engajamento</p>
                  <p className="text-lg font-bold text-[#030025]">{overview.engagement}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Lessons */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="text-[#030025] flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Aulas Mais Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#28b0ff]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0029ff] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#030025]">{lesson.title}</p>
                      <p className="text-sm text-[#001cab]">{lesson.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#28b0ff]" />
                      <span className="text-sm font-medium text-[#030025]">{lesson.views}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#ff7a28] fill-current" />
                      <span className="text-sm text-[#001cab]">{lesson.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="text-[#030025] flex items-center gap-2">
              <Users className="h-5 w-5" />
              Desempenho por Turma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classPerformance.map((classData, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#28b0ff]">
                  <div>
                    <p className="font-medium text-[#030025]">{classData.class}</p>
                    <p className="text-sm text-[#001cab]">{classData.students} alunos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#030025]">Nota Média: {classData.avgScore}</p>
                    <p className="text-sm text-[#001cab]">Engajamento: {classData.engagement}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Feedback */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="text-[#030025] flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Feedbacks Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentFeedback.map((feedback) => (
                <div key={feedback.id} className="p-3 bg-white rounded-lg border border-[#28b0ff]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-[#030025]">{feedback.student}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < feedback.rating ? 'text-[#ff7a28] fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#001cab] mb-2">{feedback.lesson}</p>
                  <p className="text-sm text-[#030025]">"{feedback.comment}"</p>
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

export default TeacherAnalytics;
