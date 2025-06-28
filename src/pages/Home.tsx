
import React, { useState } from 'react';
import { Play, BookOpen, Trophy, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Home = () => {
  const [coins, setCoins] = useState(120);
  const [studyStreak, setStudyStreak] = useState(7);
  const [recentVideoIndex, setRecentVideoIndex] = useState(0);
  const [recommendationIndex, setRecommendationIndex] = useState(0);

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
    }
  ];

  const recommendations = [
    {
      id: 3,
      title: 'Derivadas - Conceitos',
      subject: 'Cálculo I',
      difficulty: 'Intermediário',
      thumbnail: '📈'
    },
    {
      id: 4,
      title: 'Algoritmos de Ordenação',
      subject: 'Programação',
      difficulty: 'Avançado',
      thumbnail: '💻'
    },
    {
      id: 5,
      title: 'Teorema de Pitágoras',
      subject: 'Matemática',
      difficulty: 'Básico',
      thumbnail: '📐'
    },
    {
      id: 6,
      title: 'Circuitos Elétricos',
      subject: 'Física II',
      difficulty: 'Intermediário',
      thumbnail: '⚡'
    }
  ];

  const nextRecentVideo = () => {
    setRecentVideoIndex((prev) => (prev + 1) % recentVideos.length);
  };

  const prevRecentVideo = () => {
    setRecentVideoIndex((prev) => (prev - 1 + recentVideos.length) % recentVideos.length);
  };

  const nextRecommendation = () => {
    setRecommendationIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevRecommendation = () => {
    setRecommendationIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  return (
    <div className="min-h-screen bg-engenha-light-blue pb-20">
      <Header 
        title={`Olá, Estudante! 👋`}
        subtitle={`${studyStreak} dias consecutivos estudando`}
        showCoins={true}
        coins={coins}
      />

      <div className="px-6 space-y-6">
        {/* Continue watching - Carrossel com setas */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-engenha-dark-navy">Continue de onde parou</h2>
          </div>
          <div className="relative">
            <button
              onClick={prevRecentVideo}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-engenha-light-cream rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="text-engenha-sky-blue" size={20} />
            </button>
            <button
              onClick={nextRecentVideo}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-engenha-light-cream rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="text-engenha-sky-blue" size={20} />
            </button>
            
            <div className="overflow-hidden mx-8">
              <div 
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${recentVideoIndex * 100}%)` }}
              >
                {recentVideos.map((video) => (
                  <div key={video.id} className="w-full flex-shrink-0 px-2">
                    <div className="bg-engenha-light-cream p-4 rounded-xl shadow-sm border border-engenha-sky-blue">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{video.thumbnail}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-engenha-dark-navy text-sm">{video.title}</h3>
                          <p className="text-xs text-engenha-dark-navy">{video.subject} • {video.duration}</p>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-engenha-blue h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${video.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-engenha-dark-navy mt-1">{video.progress}% completo</p>
                          </div>
                        </div>
                        <button className="bg-engenha-blue text-white p-2 rounded-full hover:bg-engenha-bright-blue transition-colors flex items-center justify-center">
                          <Play size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations - Carrossel com setas */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#030025]">Recomendado para você</h2>
          </div>
          <div className="relative">
            <button
              onClick={prevRecommendation}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="text-[#96CCDB]" size={20} />
            </button>
            <button
              onClick={nextRecommendation}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="text-[#96CCDB]" size={20} />
            </button>
            
            <div className="overflow-hidden mx-8">
              <div 
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${recommendationIndex * 100}%)` }}
              >
                {recommendations.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0 px-2">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#96CCDB] hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{item.thumbnail}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-[#030025] text-sm">{item.title}</h3>
                          <p className="text-xs text-[#030025]">{item.subject}</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-[#001cab] text-xs rounded-full border border-[#96CCDB]">
                            {item.difficulty}
                          </span>
                        </div>
                        <BookOpen className="text-[#96CCDB]" size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-xl text-white border border-[#96CCDB]">
            <div className="flex items-center space-x-3">
              <TrendingUp size={24} />
              <div>
                <p className="text-green-100 text-sm">Esta semana</p>
                <p className="text-xl font-bold">12h 30min</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-4 rounded-xl text-white border border-[#96CCDB]">
            <div className="flex items-center space-x-3">
              <Trophy size={24} />
              <div>
                <p className="text-purple-100 text-sm">Conquistas</p>
                <p className="text-xl font-bold">8 troféus</p>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Challenge */}
        <section className="bg-gradient-to-r from-[#ff7a28] to-[#d75200] p-6 rounded-xl text-white border border-[#96CCDB]">
          <div className="flex items-start space-x-3 mb-3">
            <span className="text-2xl">🔥</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Desafio da Semana</h3>
              <p className="text-orange-100">Complete 5 videoaulas de Cálculo I</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="w-32 bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full w-3/5"></div>
              </div>
              <p className="text-xs text-orange-100 mt-1">3/5 completas</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-orange-100">Recompensa</p>
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
