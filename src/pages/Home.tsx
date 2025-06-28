
import React, { useState } from 'react';
import { Play, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Home = () => {
  const [coins, setCoins] = useState(120);
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header 
        title={`Olá, Estudante! 👋`}
        subtitle={`${studyStreak} dias consecutivos estudando`}
        showCoins={true}
        coins={coins}
      />

      <div className="px-6 space-y-6">
        {/* Continue watching */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Continue de onde parou</h2>
          <div className="space-y-3">
            {recentVideos.map((video) => (
              <div key={video.id} className="bg-white p-4 rounded-xl shadow-sm border border-engenha-border">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{video.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-engenha-text-light">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.subject} • {video.duration}</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-engenha-blue h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{video.progress}% completo</p>
                    </div>
                  </div>
                  <button className="bg-engenha-blue text-white p-2 rounded-full hover:bg-engenha-blue-dark transition-colors flex items-center justify-center">
                    <Play size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recomendado para você</h2>
          <div className="grid grid-cols-1 gap-3">
            {recommendations.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-engenha-border hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{item.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-engenha-text-light">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.subject}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-engenha-blue text-xs rounded-full border border-engenha-border">
                      {item.difficulty}
                    </span>
                  </div>
                  <BookOpen className="text-gray-400" size={20} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-xl text-white border border-engenha-border">
            <div className="flex items-center space-x-3">
              <TrendingUp size={24} />
              <div>
                <p className="text-green-100 text-sm">Esta semana</p>
                <p className="text-xl font-bold">12h 30min</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-4 rounded-xl text-white border border-engenha-border">
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
        <section className="bg-gradient-to-r from-engenha-orange to-red-500 p-6 rounded-xl text-white border border-engenha-border">
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
