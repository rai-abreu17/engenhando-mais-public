
import React, { useState } from 'react';
import { Play, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import ResponsiveCarousel from '../components/ResponsiveCarousel';

const Home = () => {
  const [studyStreak, setStudyStreak] = useState(7);

  const recentVideos = [
    {
      id: 1,
      title: 'Limites e Continuidade',
      subject: 'Cálculo I',
      progress: 75,
      duration: '45 min',
      thumbnail: '📊'
    },
    {
      id: 2,
      title: 'Leis de Newton',
      subject: 'Física I',
      progress: 30,
      duration: '38 min',
      thumbnail: '⚗️'
    },
    {
      id: 3,
      title: 'Algoritmos de Busca',
      subject: 'Programação',
      progress: 60,
      duration: '52 min',
      thumbnail: '💻'
    },
    {
      id: 4,
      title: 'Derivadas Básicas',
      subject: 'Cálculo I',
      progress: 20,
      duration: '35 min',
      thumbnail: '📈'
    },
    {
      id: 5,
      title: 'Estruturas de Dados',
      subject: 'Programação',
      progress: 85,
      duration: '42 min',
      thumbnail: '🗃️'
    },
    {
      id: 6,
      title: 'Termodinâmica',
      subject: 'Física II',
      progress: 45,
      duration: '48 min',
      thumbnail: '🌡️'
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Derivadas - Conceitos',
      subject: 'Cálculo I',
      difficulty: 'Intermediário',
      thumbnail: '📈'
    },
    {
      id: 2,
      title: 'Algoritmos de Ordenação',
      subject: 'Programação',
      difficulty: 'Avançado',
      thumbnail: '💻'
    },
    {
      id: 3,
      title: 'Teorema de Pitágoras',
      subject: 'Matemática',
      difficulty: 'Básico',
      thumbnail: '📐'
    },
    {
      id: 4,
      title: 'Circuitos Elétricos',
      subject: 'Física II',
      difficulty: 'Intermediário',
      thumbnail: '⚡'
    },
    {
      id: 5,
      title: 'Banco de Dados',
      subject: 'Programação',
      difficulty: 'Intermediário',
      thumbnail: '🗄️'
    },
    {
      id: 6,
      title: 'Integrais Definidas',
      subject: 'Cálculo II',
      difficulty: 'Avançado',
      thumbnail: '∫'
    }
  ];

  // Função para renderizar cada item do carrossel "Continue de onde parou"
  const renderRecentVideo = (video: any) => (
    <div className="bg-[#fffaf0] p-4 rounded-xl shadow-sm border border-[#28b0ff]">
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{video.thumbnail}</div>
        <div className="flex-1">
          <h3 className="font-medium text-[#030025] text-sm">{video.title}</h3>
          <p className="text-xs text-[#030025]">{video.subject} • {video.duration}</p>
          <div className="mt-2">
            <div className="w-full bg-[#f0f6ff] rounded-full h-2">
              <div 
                className="bg-[#0029ff] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${video.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#030025] mt-1">{video.progress}% completo</p>
          </div>
        </div>
        <button className="bg-[#ff7a28] text-white p-2 rounded-full hover:bg-[#d75200] transition-colors flex items-center justify-center">
          <Play size={16} />
        </button>
      </div>
    </div>
  );

  // Função para renderizar cada item do carrossel "Recomendado para você"
  const renderRecommendation = (item: any) => (
    <div className="bg-[#fffaf0] p-4 rounded-xl shadow-sm border border-[#28b0ff] hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{item.thumbnail}</div>
        <div className="flex-1">
          <h3 className="font-medium text-[#030025] text-sm">{item.title}</h3>
          <p className="text-xs text-[#030025]">{item.subject}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-[#f0f6ff] text-[#001cab] text-xs rounded-full border border-[#28b0ff]">
            {item.difficulty}
          </span>
        </div>
        <BookOpen className="text-[#28b0ff]" size={20} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title={`Olá, Estudante! 👋`}
        subtitle={`${studyStreak} dias consecutivos estudando`}
        showStreak={true}
        streakDays={studyStreak}
      />

      <div className="px-6 space-y-6">
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
          <div className="bg-gradient-to-r from-[#28b0ff] to-[#0029ff] p-4 rounded-xl text-white border border-[#28b0ff]">
            <div className="flex items-center space-x-3">
              <TrendingUp size={24} />
              <div>
                <p className="text-[#f0f6ff] text-sm">Esta semana</p>
                <p className="text-xl font-bold">12h 30min</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#28b0ff] to-[#0029ff] p-4 rounded-xl text-white border border-[#28b0ff]">
            <div className="flex items-center space-x-3">
              <Trophy size={24} />
              <div>
                <p className="text-[#fffaf0] text-sm">Conquistas</p>
                <p className="text-xl font-bold">8 troféus</p>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Challenge */}
        <section className="bg-gradient-to-r from-[#ff7a28] to-[#d75200] p-6 rounded-xl text-white border border-[#ff7a28]">
          <div className="flex items-start space-x-3 mb-3">
            <span className="text-2xl">🔥</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Desafio da Semana</h3>
              <p className="text-[#fffaf0]">Complete 5 videoaulas de Cálculo I</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="w-32 bg-white/20 rounded-full h-2">
                <div className="bg-[#fffaf0] h-2 rounded-full w-3/5"></div>
              </div>
              <p className="text-xs text-[#fffaf0] mt-1">3/5 completas</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#fffaf0]">Recompensa</p>
              <p className="font-bold">🪙 +50 moedas</p>
            </div>
          </div>
        </section>
      </div>

      <Navigation />
    </div>
  );
};

export default Home;
