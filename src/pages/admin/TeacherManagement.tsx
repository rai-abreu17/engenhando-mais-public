import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/components/admin/AdminNavigation';

const TeacherManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - em produção viria de APIs
  const teachers = [
    {
      id: 1,
      name: 'Prof. Maria Silva',
      email: 'maria.silva@escola.com',
      phone: '(11) 99999-9999',
      subject: 'Matemática',
      status: 'active',
      classesAssigned: 5,
      studentsCount: 120,
      joinDate: '2023-01-15',
      location: 'São Paulo - SP'
    },
    {
      id: 2,
      name: 'Prof. João Santos',
      email: 'joao.santos@escola.com',
      phone: '(11) 88888-8888',
      subject: 'Física',
      status: 'active',
      classesAssigned: 3,
      studentsCount: 89,
      joinDate: '2023-03-20',
      location: 'Rio de Janeiro - RJ'
    },
    {
      id: 3,
      name: 'Prof. Ana Costa',
      email: 'ana.costa@escola.com',
      phone: '(11) 77777-7777',
      subject: 'Química',
      status: 'pending',
      classesAssigned: 0,
      studentsCount: 0,
      joinDate: '2024-01-10',
      location: 'Belo Horizonte - MG'
    },
    {
      id: 4,
      name: 'Prof. Carlos Lima',
      email: 'carlos.lima@escola.com',
      phone: '(11) 66666-6666',
      subject: 'Programação',
      status: 'inactive',
      classesAssigned: 2,
      studentsCount: 45,
      joinDate: '2022-08-05',
      location: 'Brasília - DF'
    }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || teacher.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Gerenciar Professores"
        subtitle="Cadastre e gerencie professores do sistema"
      />

      <div className="px-6 space-y-6">
        {/* Barra de Ações */}
        <section className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email ou matéria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-[#fffaf0] border border-[#28b0ff] rounded-md text-sm text-[#030025] focus:border-[#0029ff] focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="pending">Pendentes</option>
              <option value="inactive">Inativos</option>
            </select>
            
            <Button className="bg-[#0029ff] hover:bg-[#001cab] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Professor
            </Button>
          </div>
        </section>

        {/* Estatísticas Rápidas */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#0029ff]">{teachers.filter(t => t.status === 'active').length}</p>
              <p className="text-sm text-[#001cab]">Ativos</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#ff7a28]">{teachers.filter(t => t.status === 'pending').length}</p>
              <p className="text-sm text-[#001cab]">Pendentes</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#d75200]">{teachers.filter(t => t.status === 'inactive').length}</p>
              <p className="text-sm text-[#001cab]">Inativos</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#0029ff]">{teachers.length}</p>
              <p className="text-sm text-[#001cab]">Total</p>
            </CardContent>
          </Card>
        </section>

        {/* Lista de Professores */}
        <section>
          <div className="space-y-4">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="bg-[#fffaf0] border-[#28b0ff] hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-[#030025]">{teacher.name}</h3>
                        {getStatusIcon(teacher.status)}
                        {getStatusBadge(teacher.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#001cab]">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{teacher.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{teacher.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{teacher.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Matéria:</span>
                          <span>{teacher.subject}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-[#e0e7ff]">
                        <div className="text-center">
                          <p className="text-lg font-bold text-[#0029ff]">{teacher.classesAssigned}</p>
                          <p className="text-xs text-[#001cab]">Turmas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-[#0029ff]">{teacher.studentsCount}</p>
                          <p className="text-xs text-[#001cab]">Alunos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-[#001cab]">{new Date(teacher.joinDate).toLocaleDateString('pt-BR')}</p>
                          <p className="text-xs text-[#001cab]">Admissão</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button variant="outline" size="sm" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#d75200] text-[#d75200] hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <Card className="bg-[#fffaf0] border-[#28b0ff]">
              <CardContent className="p-8 text-center">
                <p className="text-[#001cab]">Nenhum professor encontrado com os filtros aplicados.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      <AdminNavigation />
    </div>
  );
};

export default TeacherManagement;