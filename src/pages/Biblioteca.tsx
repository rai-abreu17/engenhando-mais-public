
import React, { useState } from 'react';
import { Search, Star, Play, Clock } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Biblioteca = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');

  const allSubjects = [
    {
      id: 1,
      name: 'Cálculo I',
      icon: '∫',
      progress: 75,
      videoCount: 24,
      color: 'bg-blue-500',
      isMine: true,
      isFavorite: true,
      lastAccessed: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Física I',
      icon: '⚗️',
      progress: 45,
      videoCount: 18,
      color: 'bg-green-500',
      isMine: true,
      isFavorite: false,
      lastAccessed: new Date('2024-01-14')
    },
    {
      id: 3,
      name: 'Algoritmos',
      icon: '💻',
      progress: 60,
      videoCount: 32,
      color: 'bg-purple-500',
      isMine: true,
      isFavorite: true,
      lastAccessed: new Date('2024-01-13')
    },
    {
      id: 4,
      name: 'Álgebra Linear',
      icon: '📊',
      progress: 30,
      videoCount: 20,
      color: 'bg-red-500',
      isMine: true,
      isFavorite: false,
      lastAccessed: new Date('2024-01-12')
    },
    {
      id: 5,
      name: 'Química Geral',
      icon: '🧪',
      progress: 0,
      videoCount: 15,
      color: 'bg-yellow-500',
      isMine: false,
      isFavorite: false,
      lastAccessed: null
    },
    {
      id: 6,
      name: 'Estatística',
      icon: '📈',
      progress: 0,
      videoCount: 22,
      color: 'bg-indigo-500',
      isMine: false,
      isFavorite: false,
      lastAccessed: null
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
      thumbnail: '📈',
      watchedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Leis de Newton Explicadas',
      subject: 'Física I',
      duration: '32 min',
      difficulty: 'Intermediário',
      creator: 'João Santos',
      thumbnail: '🚀',
      watchedAt: new Date('2024-01-14')
    },
    {
      id: 3,
      title: 'Algoritmos de Busca',
      subject: 'Algoritmos',
      duration: '28 min',
      difficulty: 'Avançado',
      creator: 'Maria Costa',
      thumbnail: '🔍',
      watchedAt: new Date('2024-01-13')
    }
  ];

  const filters = ['Todas', 'Minhas Disciplinas', 'Favoritas', 'Recentes'];

  // Filter subjects based on selected filter and search term
  const getFilteredSubjects = () => {
    let filtered = allSubjects;

    // Apply filter
    switch (selectedFilter) {
      case 'Minhas Disciplinas':
        filtered = filtered.filter(subject => subject.isMine);
        break;
      case 'Favoritas':
        filtered = filtered.filter(subject => subject.isFavorite);
        break;
      case 'Recentes':
        filtered = filtered.filter(subject => subject.lastAccessed)
          .sort((a, b) => b.lastAccessed!.getTime() - a.lastAccessed!.getTime());
        break;
      default:
        // 'Todas' - no additional filtering
        break;
    }

    // Apply search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const toggleFavorite = (subjectId: number) => {
    // In a real app, this would update the backend
    console.log(`Toggling favorite for subject ${subjectId}`);
  };

  const filteredSubjects = getFilteredSubjects();

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

        {/* Filtered Subjects */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedFilter === 'Todas' ? 'Todas as disciplinas' :
               selectedFilter === 'Minhas Disciplinas' ? 'Suas disciplinas atuais' :
               selectedFilter === 'Favoritas' ? 'Disciplinas favoritas' :
               'Disciplinas recentes'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredSubjects.length} {filteredSubjects.length === 1 ? 'disciplina' : 'disciplinas'}
            </span>
          </div>
          
          {filteredSubjects.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-medium text-gray-800 mb-2">Nenhuma disciplina encontrada</h3>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 
                  `Não encontramos disciplinas com "${searchTerm}"` :
                  selectedFilter === 'Favoritas' ? 'Você ainda não favoritou nenhuma disciplina' :
                  selectedFilter === 'Minhas Disciplinas' ? 'Você ainda não se inscreveu em nenhuma disciplina' :
                  'Nenhuma disciplina acessada recentemente'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredSubjects.map((subject) => (
                <div key={subject.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className={`${subject.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
                    {subject.icon}
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">{subject.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{subject.videoCount} aulas</span>
                    <button 
                      onClick={() => toggleFavorite(subject.id)}
                      className="transition-colors"
                    >
                      <Star 
                        className={subject.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                        size={16} 
                      />
                    </button>
                  </div>
                  {subject.isMine && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-engenha-blue h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{subject.progress}% completo</p>
                    </>
                  )}
                  {!subject.isMine && (
                    <button className="w-full mt-2 bg-engenha-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Começar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Videos - only show if not filtering by specific categories */}
        {selectedFilter === 'Todas' && !searchTerm && (
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
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Biblioteca;
