import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Users, 
  Key, 
  Search,
  MoreVertical,
  Eye,
  EyeOff,
  Filter
} from 'lucide-react';
import Header from '@/features/student/components/Header';
import AdminNavigation from '@/admin/components/AdminNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const AccessControlPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data - em produção viria de APIs
  const [users, setUsers] = useState([
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
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(user.role);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(user.status);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Função para alternar status do usuário (ativar/desativar)
  const handleToggleUserStatus = (userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              status: user.status === 'active' ? 'inactive' : 'active',
              lastAccess: user.status === 'inactive' ? new Date().toISOString().split('T')[0] : user.lastAccess
            }
          : user
      )
    );
  };

  // Função para reset de senha
  const handlePasswordReset = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      // Simular reset de senha - em produção faria uma chamada API
      alert(`Reset de senha enviado para ${user.email}`);
      console.log(`Password reset requested for user: ${user.name} (${user.email})`);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchTerm || selectedRoles.length > 0 || selectedStatuses.length > 0;

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

        {/* Controles de Busca e Filtros */}
        <section>
          <div className="flex gap-2 items-center mb-2 sm:mb-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-[#001cab]" />
              <Input
                placeholder="Buscar por nome ou email..."
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
                      {selectedRoles.length + selectedStatuses.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#030025]">Filtrar Usuários</h4>
                    {hasActiveFilters && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="h-6 px-2 text-xs text-[#0029ff]"
                      >
                        Limpar tudo
                      </Button>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-[#001cab]">Função</h5>
                    {[
                      { value: 'admin', label: 'Administradores', count: users.filter(u => u.role === 'admin').length },
                      { value: 'teacher', label: 'Professores', count: users.filter(u => u.role === 'teacher').length },
                      { value: 'student', label: 'Alunos', count: users.filter(u => u.role === 'student').length }
                    ].map((role) => (
                      <div key={role.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={role.value}
                          checked={selectedRoles.includes(role.value)}
                          onCheckedChange={() => handleRoleToggle(role.value)}
                        />
                        <label 
                          htmlFor={role.value}
                          className="text-sm flex-1 flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-[#030025]">{role.label}</span>
                          <Badge variant="secondary" className="bg-[#f0f6ff] text-[#001cab]">
                            {role.count}
                          </Badge>
                        </label>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-[#001cab]">Status</h5>
                    {[
                      { value: 'active', label: 'Ativos', count: users.filter(u => u.status === 'active').length },
                      { value: 'inactive', label: 'Inativos', count: users.filter(u => u.status === 'inactive').length },
                      { value: 'pending', label: 'Pendentes', count: users.filter(u => u.status === 'pending').length }
                    ].map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={status.value}
                          checked={selectedStatuses.includes(status.value)}
                          onCheckedChange={() => handleStatusToggle(status.value)}
                        />
                        <label 
                          htmlFor={status.value}
                          className="text-sm flex-1 flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-[#030025]">{status.label}</span>
                          <Badge variant="secondary" className="bg-[#f0f6ff] text-[#001cab]">
                            {status.count}
                          </Badge>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {/* Resultado da busca/filtro */}
        {hasActiveFilters && (
          <div className="mb-4 p-3 bg-[#f0f6ff] border border-[#28b0ff] rounded-lg">
            <p className="text-sm text-[#001cab]">
              {filteredUsers.length === 0 ? (
                'Nenhum usuário encontrado com os critérios atuais.'
              ) : (
                `${filteredUsers.length} ${filteredUsers.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}.`
              )}
              {hasActiveFilters && ` • ${filteredUsers.length} ${filteredUsers.length === 1 ? 'corresponde' : 'correspondem'} aos filtros`}
            </p>
          </div>
        )}

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
                      onClick={() => handlePasswordReset(user.id)}
                      className="border-[#28b0ff] text-[#0029ff] hover:bg-[#0029ff] hover:text-white hover:border-[#0029ff] transition-all duration-200 h-8 px-2 sm:px-3"
                    >
                      <Key className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`h-8 px-2 sm:px-3 transition-all duration-200 ${
                        user.status === 'active' 
                          ? 'border-[#d75200] text-[#d75200] hover:bg-[#d75200] hover:text-white hover:border-[#d75200]' 
                          : 'border-[#00a86b] text-[#00a86b] hover:bg-[#00a86b] hover:text-white hover:border-[#00a86b]'
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
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-[#f0f6ff] text-[#001cab] hover:text-[#0029ff]">
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