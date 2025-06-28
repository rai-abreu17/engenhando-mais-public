
import React, { useState } from 'react';
import { Search, Star, Play, Clock } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Biblioteca = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');

  const subjects = [
    {
      id: 1,
      name: 'Cálculo I',
      icon: '∫',
      progress: 75,
      videoCount: 24,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Física I',
      icon: '⚗️',
      progress: 45,
      videoCount: 18,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Algoritmos',
      icon: '💻',
      progress: 60,
      videoCount: 32,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'Álgebra Linear',
      icon: '📊',
      progress: 30,
      videoCount: 20,
      color: 'bg-red-500'
    }
  ];

  const recentVideos = [
    {
      id: 1,
      title: 'Introdução aos Limites',
      subject: 'Cálculo I',
      duration: '25 min',
      difficulty: 'Iniciante',
      creator: 'Ana Silva',
      thumbnail: '📈'
    },
    {
      id: 2,
      title: 'Leis de Newton Explicadas',
      subject: 'Física I',
      duration: '32 min',
      difficulty: 'Intermediário',
      creator: 'João Santos',
      thumbnail: '🚀'
    }
  ];

  const filters = ['Todas', 'Minhas Disciplinas', 'Favoritas', 'Recentes'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header 
        title="Biblioteca"
        subtitle="Encontre conteúdos para suas disciplinas"
      />

      <div className="px-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar disciplinas, tópicos ou conceitos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-engenha-blue focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-engenha-blue text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* My Subjects */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Suas disciplinas atuais</h2>
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className={`${subject.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
                  {subject.icon}
                </div>
                <h3 className="font-medium text-gray-800 mb-2">{subject.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>{subject.videoCount} aulas</span>
                  <Star className="text-gray-300" size={16} />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-engenha-blue h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{subject.progress}% completo</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Videos */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Videoaulas recentes</h2>
          <div className="space-y-3">
            {recentVideos.map((video) => (
              <div key={video.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{video.thumbnail}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.subject} • {video.creator}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{video.duration}</span>
                      </div>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-engenha-blue text-xs rounded-full">
                        {video.difficulty}
                      </span>
                    </div>
                  </div>
                  <button className="bg-engenha-blue text-white p-2 rounded-full hover:bg-engenha-blue-dark transition-colors">
                    <Play size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Subjects Categories */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Todas as disciplinas</h2>
          <div className="space-y-4">
            {['Matemática', 'Física', 'Computação', 'Química', 'Engenharia Específica'].map((category) => (
              <div key={category} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-medium text-gray-800 mb-2">{category}</h3>
                <p className="text-sm text-gray-500">
                  {category === 'Matemática' && 'Cálculo, Álgebra Linear, Estatística, Matemática Discreta'}
                  {category === 'Física' && 'Mecânica, Termodinâmica, Eletromagnetismo, Física Moderna'}
                  {category === 'Computação' && 'Algoritmos, Programação, Estruturas de Dados, Sistemas'}
                  {category === 'Química' && 'Química Geral, Orgânica, Inorgânica, Físico-química'}
                  {category === 'Engenharia Específica' && 'Resistência dos Materiais, Circuitos, Mecânica dos Fluidos'}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Navigation />
    </div>
  );
};

export default Biblioteca;
