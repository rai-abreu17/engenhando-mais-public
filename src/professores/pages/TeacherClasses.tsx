import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Star, 
  Calendar,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TeacherNavigation from '../components/TeacherNavigation';
import Header from '@/components/common/Header';

const classes = [
  {
    id: 1,
    name: 'Cálculo I - Turma A',
    code: 'CALC001-A',
    students: 32,
    totalLessons: 18,
    completedLessons: 12,
    avgRating: 4.8,
    schedule: 'Seg/Qua/Sex - 14:00-16:00',
    semester: '2024.1',
    status: 'Ativa',
  },
  {
    id: 2,
    name: 'Física I - Turma B',
    code: 'FIS001-B',
    students: 28,
    totalLessons: 16,
    completedLessons: 10,
    avgRating: 4.6,
    schedule: 'Ter/Qui - 10:00-12:00',
    semester: '2024.1',
    status: 'Ativa',
  },
  {
    id: 3,
    name: 'Matemática Básica',
    code: 'MAT001',
    students: 45,
    totalLessons: 20,
    completedLessons: 20,
    avgRating: 4.9,
    schedule: 'Seg/Qua - 08:00-10:00',
    semester: '2023.2',
    status: 'Concluída',
  },
];

const TeacherClasses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todas');

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'Todas' || classItem.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20 md:pb-0">
          <Header 
            title="Minhas Turmas 👥"
            subtitle="Gerencie suas turmas e acompanhe o progresso"
          />

          <div className="p-6 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou código da turma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {['Todas', 'Ativa', 'Concluída'].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{classItem.code}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        classItem.status === 'Ativa' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {classItem.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{classItem.students} alunos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{classItem.completedLessons}/{classItem.totalLessons} aulas</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{Math.round((classItem.completedLessons / classItem.totalLessons) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(classItem.completedLessons / classItem.totalLessons) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{classItem.avgRating}</span>
                        <span className="text-sm text-muted-foreground">avaliação</span>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{classItem.schedule}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        Ver Detalhes
                      </Button>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredClasses.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma turma encontrada
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Você ainda não possui turmas cadastradas.'}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Nova Turma
                </Button>
              </div>
            )}
          </div>
        </div>

      <TeacherNavigation />
    </div>
  );
};

export default TeacherClasses;