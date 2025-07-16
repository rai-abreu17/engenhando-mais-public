import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Users, 
  Clock, 
  Calendar,
  MapPin,
  Edit,
  Trash2,
  UserPlus,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/components/admin/AdminNavigation';

const ClassManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Mock data - em produção viria de APIs
  const classes = [
    {
      id: 1,
      name: 'Cálculo I - Turma A',
      subject: 'Matemática',
      teacher: 'Prof. Maria Silva',
      period: 'Manhã',
      schedule: 'Seg/Qua/Sex - 08:00-10:00',
      room: 'Sala 101',
      studentsEnrolled: 25,
      maxStudents: 30,
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      status: 'active'
    },
    {
      id: 2,
      name: 'Física Experimental',
      subject: 'Física',
      teacher: 'Prof. João Santos',
      period: 'Tarde',
      schedule: 'Ter/Qui - 14:00-16:00',
      room: 'Lab 202',
      studentsEnrolled: 18,
      maxStudents: 20,
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      status: 'active'
    },
    {
      id: 3,
      name: 'Química Orgânica',
      subject: 'Química',
      teacher: 'Prof. Ana Costa',
      period: 'Noite',
      schedule: 'Seg/Qua - 19:00-21:00',
      room: 'Lab 301',
      studentsEnrolled: 0,
      maxStudents: 25,
      startDate: '2024-03-01',
      endDate: '2024-07-15',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Programação Avançada',
      subject: 'Tecnologia',
      teacher: 'Prof. Carlos Lima',
      period: 'Manhã',
      schedule: 'Ter/Qui/Sex - 09:00-11:00',
      room: 'Lab Info 401',
      studentsEnrolled: 22,
      maxStudents: 25,
      startDate: '2024-01-15',
      endDate: '2024-05-30',
      status: 'active'
    }
  ];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterPeriod === 'all' || classItem.period.toLowerCase() === filterPeriod;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Concluída</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getOccupancyColor = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Gerenciar Turmas"
        subtitle="Crie e gerencie turmas e horários"
      />

      <div className="px-6 space-y-6">
        {/* Barra de Ações */}
        <section className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-4 w-4" />
            <Input
              placeholder="Buscar por nome, matéria ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-3 py-2 bg-[#fffaf0] border border-[#28b0ff] rounded-md text-sm text-[#030025] focus:border-[#0029ff] focus:outline-none"
            >
              <option value="all">Todos os Períodos</option>
              <option value="manhã">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>
            
            <Button className="bg-[#0029ff] hover:bg-[#001cab] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Turma
            </Button>
          </div>
        </section>

        {/* Estatísticas Rápidas */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#0029ff]">{classes.filter(c => c.status === 'active').length}</p>
              <p className="text-sm text-[#001cab]">Turmas Ativas</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#ff7a28]">{classes.reduce((sum, c) => sum + c.studentsEnrolled, 0)}</p>
              <p className="text-sm text-[#001cab]">Total Alunos</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#d75200]">{classes.reduce((sum, c) => sum + c.maxStudents, 0)}</p>
              <p className="text-sm text-[#001cab]">Vagas Totais</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#0029ff]">{Math.round((classes.reduce((sum, c) => sum + c.studentsEnrolled, 0) / classes.reduce((sum, c) => sum + c.maxStudents, 0)) * 100)}%</p>
              <p className="text-sm text-[#001cab]">Ocupação</p>
            </CardContent>
          </Card>
        </section>

        {/* Lista de Turmas */}
        <section>
          <div className="space-y-4">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="bg-[#fffaf0] border-[#28b0ff] hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-[#030025] flex items-center space-x-2">
                        <span>{classItem.name}</span>
                        {getStatusBadge(classItem.status)}
                      </CardTitle>
                      <CardDescription className="text-[#001cab] mt-1">
                        {classItem.subject} • {classItem.teacher}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#d75200] text-[#d75200] hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Informações de Horário */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-[#001cab]">
                        <Clock className="h-4 w-4" />
                        <span>{classItem.schedule}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-[#001cab]">
                        <MapPin className="h-4 w-4" />
                        <span>{classItem.room}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-[#001cab]">
                        <Calendar className="h-4 w-4" />
                        <span>{classItem.period}</span>
                      </div>
                    </div>

                    {/* Alunos Matriculados */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#030025]">Matriculados</span>
                        <span className="text-sm text-[#001cab]">{classItem.studentsEnrolled}/{classItem.maxStudents}</span>
                      </div>
                      <div className="w-full bg-[#f0f6ff] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getOccupancyColor(classItem.studentsEnrolled, classItem.maxStudents)}`}
                          style={{ width: `${(classItem.studentsEnrolled / classItem.maxStudents) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-[#001cab]" />
                        <span className="text-sm text-[#001cab]">
                          {classItem.maxStudents - classItem.studentsEnrolled} vagas disponíveis
                        </span>
                      </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Gerenciar Alunos
                      </Button>
                      <Button variant="outline" size="sm" className="w-full border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ver Aulas
                      </Button>
                    </div>
                  </div>

                  {/* Período da Turma */}
                  <div className="mt-4 pt-3 border-t border-[#e0e7ff]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#001cab]">
                        Período: {new Date(classItem.startDate).toLocaleDateString('pt-BR')} - {new Date(classItem.endDate).toLocaleDateString('pt-BR')}
                      </span>
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="h-4 w-4 text-[#0029ff]" />
                        <span className="text-[#0029ff] font-medium">{classItem.subject}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <Card className="bg-[#fffaf0] border-[#28b0ff]">
              <CardContent className="p-8 text-center">
                <p className="text-[#001cab]">Nenhuma turma encontrada com os filtros aplicados.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      <AdminNavigation />
    </div>
  );
};

export default ClassManagement;