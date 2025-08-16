
/**
 * Biblioteca Page Component
 * 
 * Displays the library of subjects and videos available to the user.
 * Includes search functionality and filtering options.
 */

import React, { useState } from 'react';
import { Search, Star, Play, Clock } from 'lucide-react';

import Header from '../features/student/components/Header';
import Navigation from '../features/student/components/Navigation';
import { Subject, Video, FilterType } from '../types/index';
import { COLORS } from '../constants/index';
import { MOCK_SUBJECTS } from '../data/mockData';
import { useSubjects } from '../hooks/useSubjects';

const Biblioteca: React.FC = () => {
  const {
    filteredSubjects,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    toggleFavorite,
  } = useSubjects(MOCK_SUBJECTS);

  const recentVideos: Video[] = [
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

  const filters: FilterType[] = ['Todas', 'Minhas Disciplinas', 'Favoritas', 'Recentes'];

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
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
            className="w-full bg-[#fffaf0] border border-[#28b0ff] rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#0029ff] focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#001cab]" size={20} />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#0029ff] text-white shadow-md'
                  : 'bg-[#fffaf0] text-[#030025] border border-[#28b0ff] hover:bg-[#f0f6ff] hover:shadow-sm'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Filtered Subjects */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#030025]">
              {selectedFilter === 'Todas' ? 'Todas as disciplinas' :
               selectedFilter === 'Minhas Disciplinas' ? 'Suas disciplinas atuais' :
               selectedFilter === 'Favoritas' ? 'Disciplinas favoritas' :
               'Disciplinas recentes'}
            </h2>
            <span className="text-sm text-[#030025] opacity-70">
              {filteredSubjects.length} {filteredSubjects.length === 1 ? 'disciplina' : 'disciplinas'}
            </span>
          </div>
          
          {filteredSubjects.length === 0 ? (
            <div className="bg-[#fffaf0] p-8 rounded-xl text-center border border-[#28b0ff] shadow-sm">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-medium text-[#030025] mb-2">Nenhuma disciplina encontrada</h3>
              <p className="text-[#030025] opacity-70 text-sm">
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
                <div key={subject.id} className="bg-[#fffaf0] p-4 rounded-xl shadow-sm border border-[#28b0ff] hover:shadow-md transition-all duration-200">
                  <div className={`${subject.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-3`}>
                    {subject.icon}
                  </div>
                  <h3 className="font-medium text-[#030025] mb-2">{subject.name}</h3>
                  <div className="flex items-center justify-between text-sm text-[#030025] opacity-70 mb-2">
                    <span>{subject.videoCount} aulas</span>
                    <button 
                      onClick={() => toggleFavorite(subject.id)}
                      className="transition-colors"
                    >
                      <Star 
                        className={subject.isFavorite ? 'text-[#ffb646] fill-current' : 'text-[#28b0ff] opacity-50'} 
                        size={16} 
                      />
                    </button>
                  </div>
                  {subject.isMine && (
                    <>
                      <div className="w-full bg-[#f0f6ff] rounded-full h-2">
                        <div 
                          className="bg-[#0029ff] h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[#030025] opacity-70 mt-1">{subject.progress}% completo</p>
                    </>
                  )}
                  {!subject.isMine && (
                    <button className="w-full mt-2 bg-[#ff7a28] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#d75200] transition-colors">
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
            <h2 className="text-lg font-semibold text-[#030025] mb-4">Videoaulas recentes</h2>
            <div className="space-y-3">
              {recentVideos.map((video) => (
                <div key={video.id} className="bg-[#fffaf0] p-4 rounded-xl shadow-sm border border-[#28b0ff] hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{video.thumbnail}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#030025]">{video.title}</h3>
                      <p className="text-sm text-[#030025] opacity-70">{video.subject} • {video.creator}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-xs text-[#030025] opacity-70">
                          <Clock size={12} />
                          <span>{video.duration}</span>
                        </div>
                        <span className="inline-block px-2 py-1 bg-[#f0f6ff] text-[#001cab] text-xs rounded-full border border-[#28b0ff]">
                          {video.difficulty}
                        </span>
                      </div>
                    </div>
                    <button className="bg-[#ff7a28] text-white p-2 rounded-full hover:bg-[#d75200] transition-colors">
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
