
import React from 'react';
import ResponsiveCarousel from '../components/common/ResponsiveCarousel';
import Header from '@/components/shared/Header';
import Navigation from '@/components/shared/Navigation';
import PageLayout from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/card-enhanced';
import { Progress } from '@/components/ui/progress-enhanced';
import { Button } from '@/components/ui/button';
import { MOCK_SUBJECTS } from '../data/mockData';
import { useSubjects } from '../hooks/useSubjects';
import { BookOpen, TrendingUp, Trophy, Play } from 'lucide-react';

const studyStreak = 7;

const recentVideos = [
  {
    id: 1,
    title: 'Limites Fundamentais',
    subject: 'Cálculo I',
    progress: 80,
    duration: '25 min',
    thumbnail: '∫',
  },
  {
    id: 2,
    title: 'Movimento Retilíneo',
    subject: 'Física I',
    progress: 60,
    duration: '30 min',
    thumbnail: '⚗️',
  },
  {
    id: 3,
    title: 'Algoritmos Básicos',
    subject: 'Algoritmos',
    progress: 90,
    duration: '40 min',
    thumbnail: '💻',
  },
  {
    id: 4,
    title: 'Teorema de Pitágoras',
    subject: 'Matemática',
    progress: 50,
    duration: '20 min',
    thumbnail: '📐',
  },
  {
    id: 5,
    title: 'Circuitos Elétricos',
    subject: 'Física II',
    progress: 30,
    duration: '35 min',
    thumbnail: '⚡',
  },
  {
    id: 6,
    title: 'Banco de Dados',
    subject: 'Programação',
    progress: 70,
    duration: '45 min',
    thumbnail: '🗄️',
  },
  {
    id: 7,
    title: 'Integrais Definidas',
    subject: 'Cálculo II',
    progress: 20,
    duration: '50 min',
    thumbnail: '∫',
  },
];

const recommendations = [
  {
    id: 1,
    title: 'Derivadas - Conceitos',
    subject: 'Cálculo I',
    difficulty: 'Intermediário',
    thumbnail: '📈',
  },
  {
    id: 2,
    title: 'Algoritmos de Ordenação',
    subject: 'Programação',
    difficulty: 'Avançado',
    thumbnail: '🗃️',
  },
  {
    id: 3,
    title: 'Teorema de Pitágoras',
    subject: 'Matemática',
    difficulty: 'Básico',
    thumbnail: '📐',
  },
  {
    id: 4,
    title: 'Circuitos Elétricos',
    subject: 'Física II',
    difficulty: 'Intermediário',
    thumbnail: '⚡',
  },
  {
    id: 5,
    title: 'Banco de Dados',
    subject: 'Programação',
    difficulty: 'Intermediário',
    thumbnail: '🗄️',
  },
  {
    id: 6,
    title: 'Integrais Definidas',
    subject: 'Cálculo II',
    difficulty: 'Avançado',
    thumbnail: '∫',
  },
];

const Home: React.FC = () => {
  const { filteredSubjects } = useSubjects(MOCK_SUBJECTS);

  // Função para renderizar cada item do carrossel "Continue de onde parou"
  const renderRecentVideo = (video: any) => (
    <Card variant="engenha" interactive className="flex items-center gap-4 p-4 h-full">
      <div className="text-3xl">{video.thumbnail}</div>
      <div className="flex-1">
        <h3 className="font-medium text-card-foreground text-sm">{video.title}</h3>
        <p className="text-xs text-muted-foreground">{video.subject} • {video.duration}</p>
        <div className="mt-2 space-y-1">
          <Progress 
            value={video.progress} 
            variant="engenha" 
            indicatorVariant="engenha"
            className="h-2"
          />
          <p className="text-xs text-card-foreground">{video.progress}% completo</p>
        </div>
      </div>
      <Button variant="engenha-secondary" size="icon" className="rounded-full">
        <Play size={16} />
      </Button>
    </Card>
  );

  // Função para renderizar cada item do carrossel "Recomendado para você"
  const renderRecommendation = (item: any) => (
    <Card variant="engenha" interactive className="flex items-center gap-4 p-4 h-full">
      <div className="text-3xl">{item.thumbnail}</div>
      <div className="flex-1">
        <h3 className="font-medium text-card-foreground text-sm">{item.title}</h3>
        <p className="text-xs text-muted-foreground">{item.subject}</p>
        <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full border">
          {item.difficulty}
        </span>
      </div>
      <div className="flex items-center">
        <BookOpen className="text-engenha-sky-blue" size={20} />
      </div>
    </Card>
  );

  return (
    <PageLayout
      header={
        <Header 
          title="Olá, Estudante! 👋"
          subtitle={`${studyStreak} dias consecutivos estudando`}
          showStreak={true}
          streakDays={studyStreak}
        />
      }
      navigation={<Navigation />}
    >
      <div className="space-y-6">
        {/* Continue watching - Carrossel Responsivo */}
        <ResponsiveCarousel
          items={recentVideos}
          renderItem={renderRecentVideo}
          title="Continue de onde parou"
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        />

        {/* Recommendations - Carrossel Responsivo */}
        <ResponsiveCarousel
          items={recommendations}
          renderItem={renderRecommendation}
          title="Recomendado para você"
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        />

        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-4">
          <Card variant="engenha-gradient" className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp size={24} />
              <div>
                <p className="text-white/80 text-sm">Esta semana</p>
                <p className="text-xl font-bold text-white">12h 30min</p>
              </div>
            </div>
          </Card>
          
          <Card variant="engenha-gradient" className="p-4">
            <div className="flex items-center space-x-3">
              <Trophy size={24} />
              <div>
                <p className="text-white/80 text-sm">Conquistas</p>
                <p className="text-xl font-bold text-white">8 troféus</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Weekly Challenge */}
        <Card variant="engenha-warm" className="p-6">
          <div className="flex items-start space-x-3 mb-3">
            <span className="text-2xl">🔥</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Desafio da Semana</h3>
              <p className="text-white/80">Complete 5 videoaulas de Cálculo I</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <Progress 
                value={60} 
                className="bg-white/20" 
                indicatorVariant="default"
              />
              <p className="text-xs text-white/80 mt-1">3/5 completas</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Recompensa</p>
              <p className="font-bold text-white">🪙 +50 moedas</p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Home;
