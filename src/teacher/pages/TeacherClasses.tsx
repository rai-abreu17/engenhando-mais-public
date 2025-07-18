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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedStatuses.length === 0 || selectedStatuses.includes(classItem.status);
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSearchTerm('');
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchTerm || selectedStatuses.length > 0;

  // Estatísticas dos status
  const statusStats = [
    { value: 'Ativa', label: 'Ativas', count: classes.filter(c => c.status === 'Ativa').length },
    { value: 'Concluída', label: 'Concluídas', count: classes.filter(c => c.status === 'Concluída').length },
  ];

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Minhas Turmas 👥"
        subtitle="Gerencie suas turmas e acompanhe o progresso"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#030025]">Turmas Ativas</h2>
            <p className="text-xs sm:text-sm text-[#001cab]">{classes.length} {classes.length === 1 ? 'turma' : 'turmas'} no total</p>
          </div>
        </section>

        <section className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#030025]">
              Turmas ({classes.length})
              {hasActiveFilters && ` • ${filteredClasses.length} ${filteredClasses.length === 1 ? 'corresponde' : 'correspondem'} aos filtros`}
            </h2>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Buscar por nome ou código da turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
            
            {/* Botão de Filtros */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className={`border-[#28b0ff] hover:bg-[#f0f6ff] w-8 sm:w-auto text-xs sm:text-sm h-8 sm:h-10 p-0 sm:px-3 ${hasActiveFilters ? 'bg-[#0029ff] text-white border-[#0029ff]' : 'text-[#0029ff]'}`}
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Filtros</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="hidden sm:inline-flex ml-2 bg-white/20 text-white text-xs">
                      {selectedStatuses.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#030025]">Filtrar Turmas</h4>
                    {hasActiveFilters && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="text-xs text-[#d75200] hover:text-[#d75200] hover:bg-[#fffaf0] h-8 px-2"
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-[#030025] mb-3">Status</h5>
                      <div className="space-y-2">
                        {statusStats.map((status) => (
                          <div key={status.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`status-${status.value}`}
                              checked={selectedStatuses.includes(status.value)}
                              onCheckedChange={() => toggleStatus(status.value)}
                              className="border-[#28b0ff] data-[state=checked]:bg-[#0029ff] data-[state=checked]:border-[#0029ff]"
                            />
                            <label 
                              htmlFor={`status-${status.value}`} 
                              className="text-xs sm:text-sm text-[#030025] cursor-pointer flex items-center gap-2"
                            >
                              {status.label}
                              <Badge variant="secondary" className="bg-[#f0f6ff] text-[#0029ff] text-xs">
                                {status.count}
                              </Badge>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Classes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{classItem.avgRating}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <section className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma turma encontrada</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Você ainda não possui turmas cadastradas.'}
            </p>
          </section>
        )}
      </div>

      <TeacherNavigation />
    </div>
  );
};

export default TeacherClasses;
