import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Users, 
  Key, 
  Search,
  UserPlus,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/admin/components/AdminNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AccessControlPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock data - em produção viria de APIs
  const users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@escola.com',
      role: 'student',
      status: 'active',
      lastAccess: '2024-01-16',
      permissions: ['read_lessons', 'submit_homework']
    },
    {
      id: 2,
      name: 'Prof. Maria Santos',
      email: 'maria@escola.com',
      role: 'teacher',
      status: 'active',
      lastAccess: '2024-01-16',
      permissions: ['create_lessons', 'grade_students', 'manage_class']
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@escola.com',
      role: 'student',
      status: 'inactive',
      lastAccess: '2024-01-10',
      permissions: ['read_lessons']
    },
    {
      id: 4,
      name: 'Admin Silva',
      email: 'admin@escola.com',
      role: 'admin',
      status: 'active',
      lastAccess: '2024-01-16',
      permissions: ['full_access']
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>;
      case 'teacher':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Professor</Badge>;
      case 'student':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aluno</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-[#fffaf0] text-[#d75200] border-[#ff7a28]">Pendente</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Controle de Acesso"
        subtitle="Gerencie usuários, permissões e segurança"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-3 text-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#030025]">{stats.totalUsers}</p>
              <p className="text-xs text-[#001cab]">Total Usuários</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-3 text-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#00a86b]">{stats.activeUsers}</p>
              <p className="text-xs text-[#001cab]">Usuários Ativos</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-3 text-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0029ff]">{stats.teachers}</p>
              <p className="text-xs text-[#001cab]">Professores</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-3 text-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#ff7a28]">{stats.students}</p>
              <p className="text-xs text-[#001cab]">Alunos</p>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#001cab]" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-[#28b0ff] focus:border-[#0029ff] h-9 sm:h-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#28b0ff] rounded-md text-sm focus:border-[#0029ff] outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Professor</option>
                  <option value="student">Aluno</option>
                </select>
                <Button className="bg-[#0029ff] hover:bg-[#001cab] text-white h-9 sm:h-10">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center space-x-2 text-[#030025] text-sm sm:text-base lg:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Usuários ({filteredUsers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 sm:gap-3 p-3 border-b border-[#28b0ff]/30 hover:bg-[#f0f6ff]/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                      <p className="font-medium text-[#030025] text-sm sm:text-base truncate">{user.name}</p>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-xs sm:text-sm text-[#001cab] truncate">{user.email}</p>
                    <p className="text-xs text-[#001cab]">
                      Último acesso: {new Date(user.lastAccess).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff] h-8 px-2 sm:px-3"
                    >
                      <Key className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-8 px-2 sm:px-3 ${
                        user.status === 'active' 
                          ? 'border-[#d75200] text-[#d75200] hover:bg-red-50' 
                          : 'border-[#00a86b] text-[#00a86b] hover:bg-green-50'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <>
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Desativar</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Ativar</span>
                        </>
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-[#28b0ff]">
                        <DropdownMenuItem className="text-[#001cab] hover:bg-[#f0f6ff]">
                          Ver Permissões
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#001cab] hover:bg-[#f0f6ff]">
                          Editar Usuário
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#001cab] hover:bg-[#f0f6ff]">
                          Histórico de Acesso
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#d75200] hover:bg-red-50">
                          Excluir Usuário
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card className="bg-gradient-to-r from-[#0029ff] to-[#001cab] text-white border-[#0029ff]">
          <CardContent className="p-3 sm:p-4">
            <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Ações Rápidas de Segurança</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button variant="secondary" size="sm" className="bg-white text-[#0029ff] hover:bg-gray-100 h-8 sm:h-10">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Logs</span>
              </Button>
              <Button variant="secondary" size="sm" className="bg-white text-[#0029ff] hover:bg-gray-100 h-8 sm:h-10">
                <Key className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Reset Geral</span>
              </Button>
              <Button variant="secondary" size="sm" className="bg-white text-[#0029ff] hover:bg-gray-100 h-8 sm:h-10 col-span-2 sm:col-span-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Exportar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminNavigation />
    </div>
  );
};

export default AccessControlPage;