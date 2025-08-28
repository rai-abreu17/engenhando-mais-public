import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { LessonCard } from '@/components/student/LessonCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Trophy, TrendingUp } from 'lucide-react';

const mockLessons = [
  {
    id: '1-1',
    title: 'Introdução: visão geral do curso',
    description: 'Uma visão completa sobre o que você aprenderá neste curso de Java, desde conceitos básicos até tópicos avançados.',
    duration: '17m',
    difficulty: 'Fácil' as const,
    subject: 'Java - Introdução'
  },
  {
    id: '1-2',
    title: 'Mapa de estudos da carreira Java',
    description: 'Conheça o roadmap completo para se tornar um desenvolvedor Java profissional.',
    duration: '4m',
    difficulty: 'Fácil' as const,
    subject: 'Java - Introdução'
  },
  {
    id: '3-3',
    title: 'Entendendo as versões do Java',
    description: 'Aprenda sobre as diferentes versões do Java e suas principais características.',
    duration: '4m',
    difficulty: 'Médio' as const,
    subject: 'Java - Conceitos'
  },
  {
    id: '3-5',
    title: 'JDK / JVM - Máquina Virtual do Java',
    description: 'Entenda como funciona a JVM e a importância do JDK no desenvolvimento Java.',
    duration: '7m',
    difficulty: 'Médio' as const,
    subject: 'Java - Conceitos'
  }
];

export default function StudentHome() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Bem-vindo ao ENGENHA+</h1>
          <p className="text-muted-foreground">Continue seu aprendizado de onde parou</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-engenha-bright-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Aulas Concluídas</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-engenha-orange" />
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Total</p>
                  <p className="text-2xl font-bold">4h 32m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Trophy className="h-8 w-8 text-engenha-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Conquistas</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Progresso</p>
                  <p className="text-2xl font-bold">75%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Aprendendo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Curso de Java Completo</h3>
                  <p className="text-sm text-muted-foreground">Última aula: JDK / JVM - Máquina Virtual do Java</p>
                </div>
                <Badge variant="secondary">Em progresso</Badge>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-sm text-muted-foreground">65% concluído • 23 de 35 aulas</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Lessons */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Aulas Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                {...lesson}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Concluiu: Histórico e edições de Java</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Iniciou: JDK / JVM - Máquina Virtual do Java</p>
                  <p className="text-xs text-muted-foreground">Há 3 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ganhou conquista: Primeiro Programa</p>
                  <p className="text-xs text-muted-foreground">Ontem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}