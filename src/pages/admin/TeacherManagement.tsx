import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/admin/components/AdminNavigation';
import AddTeacher from '@/components/admin/AddTeacher';
import EditTeacher from '@/components/admin/EditTeacher';
import RemoveTeacher from '@/components/admin/RemoveTeacher';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const initialTeachers = [
  {
    id: 1,
    name: 'Prof. Maria Silva',
    email: 'maria.silva@escola.com',
    university: 'BICT - UFMA',
    subject: 'Matemática',
    status: 'active',
    classesAssigned: 5,
    studentsCount: 120,
    joinDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Prof. João Santos',
    email: 'joao.santos@escola.com',
    university: 'Engenharia Física - USP',
    subject: 'Física',
    status: 'active',
    classesAssigned: 3,
    studentsCount: 89,
    joinDate: '2023-03-20'
  },
  {
    id: 3,
    name: 'Prof. Ana Costa',
    email: 'ana.costa@escola.com',
    university: 'Química Industrial - UFRJ',
    subject: 'Química',
    status: 'pending',
    classesAssigned: 0,
    studentsCount: 0,
    joinDate: '2024-01-10'
  },
  {
    id: 4,
    name: 'Prof. Carlos Lima',
    email: 'carlos.lima@escola.com',
    university: 'Ciência da Computação - UNICAMP',
    subject: 'Programação',
    status: 'inactive',
    classesAssigned: 2,
    studentsCount: 45,
    joinDate: '2022-08-05'
  }
];

interface Teacher {
  id: number;
  name: string;
  email: string;
  university: string;
  subject: string;
  status: 'active' | 'pending' | 'inactive';
  classesAssigned: number;
  studentsCount: number;
  joinDate: string;
}

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers as Teacher[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showEditTeacher, setShowEditTeacher] = useState(false);
  const [showRemoveTeacher, setShowRemoveTeacher] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedStatuses.length === 0 || selectedStatuses.includes(teacher.status);
    return matchesSearch && matchesFilter;
  });

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatuses([]);
    setIsFilterOpen(false);
  };

  const hasActiveFilters = searchTerm || selectedStatuses.length > 0;

  const getStatusBadge = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-[#f0f6ff] text-[#001cab] border-[#28b0ff]">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-[#fffaf0] text-[#ff7a28] border-[#ffb646]">Pendente</Badge>;
      case 'inactive':
        return <Badge className="bg-[#fffaf0] text-[#d75200] border-[#d75200]">Inativo</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: Teacher['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-[#001cab]" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-[#ff7a28]" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-[#d75200]" />;
      default:
        return null;
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowEditTeacher(true);
  };

  const handleRemoveTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowRemoveTeacher(true);
  };

  const handleSaveTeacher = (updatedTeacher: any) => {
    const teacherToSave: Teacher = {
      id: updatedTeacher.id,
      name: updatedTeacher.name,
      email: updatedTeacher.email,
      university: updatedTeacher.university,
      subject: updatedTeacher.subject,
      status: updatedTeacher.status === 'Ativo' ? 'active' : 
              updatedTeacher.status === 'Inativo' ? 'inactive' : 'pending',
      classesAssigned: selectedTeacher?.classesAssigned || 0,
      studentsCount: selectedTeacher?.studentsCount || 0,
      joinDate: updatedTeacher.joinDate
    };

    setTeachers(prev => prev.map(t => t.id === teacherToSave.id ? teacherToSave : t));
    setShowEditTeacher(false);
    setSelectedTeacher(null);
  };

  const handleConfirmRemove = (teacherId: number) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    setShowRemoveTeacher(false);
    setSelectedTeacher(null);
  };

  const handleCancelEdit = () => {
    setShowEditTeacher(false);
    setSelectedTeacher(null);
  };

  const handleCancelRemove = () => {
    setShowRemoveTeacher(false);
    setSelectedTeacher(null);
  };

  const handleAddTeacher = (newTeacherData: any) => {
    const newTeacher: Teacher = {
      id: Date.now(),
      name: newTeacherData.name,
      email: newTeacherData.email,
      university: newTeacherData.university,
      subject: newTeacherData.subject,
      status: newTeacherData.status === 'Ativo' ? 'active' : 
              newTeacherData.status === 'Inativo' ? 'inactive' : 'pending',
      classesAssigned: 0,
      studentsCount: 0,
      joinDate: newTeacherData.joinDate
    };

    setTeachers(prev => [...prev, newTeacher]);
    setShowAddTeacher(false);
  };

  const handleCancelAddTeacher = () => {
    setShowAddTeacher(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Dialog open={showAddTeacher} onOpenChange={setShowAddTeacher}>
        <DialogContent className="sm:max-w-md w-[90vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convidar Professor</DialogTitle>
            <DialogDescription>Envie um convite para o professor se cadastrar no sistema</DialogDescription>
          </DialogHeader>
          <AddTeacher onCancel={() => setShowAddTeacher(false)} />
        </DialogContent>
      </Dialog>
      
      <Header 
        title="Gerenciar Professores"
        subtitle="Cadastre e gerencie professores do sistema"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#030025]">Professores Cadastrados</h2>
            <p className="text-xs sm:text-sm text-[#001cab]">{teachers.length} {teachers.length === 1 ? 'professor' : 'professores'} no total</p>
          </div>
          <Button 
            className="bg-[#0029ff] hover:bg-[#001cab] text-white w-full sm:w-auto text-xs sm:text-sm"
            onClick={() => setShowAddTeacher(true)}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Convidar Professor</span>
            <span className="sm:hidden">Convidar</span>
          </Button>
        </section>

        <section className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Buscar por nome, email ou matéria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] h-8 sm:h-10 text-xs sm:text-sm"
              />
            </div>
            
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
                    <h4 className="font-medium text-[#030025]">Filtrar Professores</h4>
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
                    <h5 className="text-sm font-medium text-[#001cab]">Status</h5>
                    {[
                      { value: 'active', label: 'Ativos', count: teachers.filter(t => t.status === 'active').length },
                      { value: 'pending', label: 'Pendentes', count: teachers.filter(t => t.status === 'pending').length },
                      { value: 'inactive', label: 'Inativos', count: teachers.filter(t => t.status === 'inactive').length }
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

        <section>
          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-[#f0f6ff] border border-[#28b0ff] rounded-lg">
              <p className="text-sm text-[#001cab]">
                {filteredTeachers.length === 0 ? (
                  <>Nenhum resultado encontrado</>
                ) : (
                  <>
                    Mostrando <strong>{filteredTeachers.length}</strong> de <strong>{teachers.length}</strong> {filteredTeachers.length === 1 ? 'professor' : 'professores'}
                    {searchTerm && <> para "<strong>{searchTerm}</strong>"</>}
                    {selectedStatuses.length > 0 && (
                      <> com status: <strong>
                        {selectedStatuses.map(status => 
                          status === 'active' ? 'Ativo' : 
                          status === 'pending' ? 'Pendente' : 'Inativo'
                        ).join(', ')}
                      </strong></>
                    )}
                  </>
                )}
              </p>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 h-6 px-2 text-xs text-[#0029ff]"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          )}

          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="bg-[#fffaf0] border-[#28b0ff] hover:shadow-md transition-shadow">
                <CardContent className="p-2 sm:p-3 lg:p-4">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2 lg:mb-3">
                        <h3 className="font-semibold text-[#030025] text-xs sm:text-sm lg:text-base truncate">{teacher.name}</h3>
                        {getStatusIcon(teacher.status)}
                        {getStatusBadge(teacher.status)}
                      </div>
                      <div className="grid grid-cols-1 gap-0.5 sm:gap-1 lg:gap-2 text-xs sm:text-sm text-[#001cab]">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="font-medium text-xs sm:text-sm">Universidade:</span>
                          <span className="truncate text-xs sm:text-sm">{teacher.university}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="font-medium text-xs sm:text-sm">Matéria:</span>
                          <span className="text-xs sm:text-sm">{teacher.subject}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-4 mt-1 sm:mt-2 lg:mt-3 pt-1 sm:pt-2 lg:pt-3 border-t border-[#e0e7ff]">
                        <div className="text-center">
                          <p className="text-xs sm:text-sm lg:text-lg font-bold text-[#0029ff]">{teacher.classesAssigned}</p>
                          <p className="text-xs text-[#001cab]">Turmas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm lg:text-lg font-bold text-[#0029ff]">{teacher.studentsCount}</p>
                          <p className="text-xs text-[#001cab]">Alunos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs sm:text-sm font-medium text-[#001cab]">{new Date(teacher.joinDate).toLocaleDateString('pt-BR')}</p>
                          <p className="text-xs text-[#001cab]">Admissão</p>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0">
                          <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 sm:w-48">
                        <DropdownMenuItem onClick={() => handleEditTeacher(teacher)}>
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          <span className="text-xs sm:text-sm">Editar professor</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleRemoveTeacher(teacher)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          <span className="text-xs sm:text-sm">Remover professor</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <Card className="bg-[#fffaf0] border-[#28b0ff]">
              <CardContent className="p-8 text-center">
                {hasActiveFilters ? (
                  <div className="space-y-2">
                    <p className="text-[#001cab]">Nenhum professor encontrado com os critérios atuais.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]"
                      onClick={clearFilters}
                    >
                      Limpar filtros
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[#001cab]">Nenhum professor cadastrado ainda.</p>
                    <Button 
                      className="bg-[#0029ff] hover:bg-[#001cab] text-white"
                      onClick={() => setShowAddTeacher(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Convidar Primeiro Professor
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {showEditTeacher && selectedTeacher && (
        <Dialog open={showEditTeacher} onOpenChange={setShowEditTeacher}>
          <DialogContent className="sm:max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <EditTeacher
              teacher={{
                ...selectedTeacher,
                status: selectedTeacher.status === 'active' ? 'Ativo' : 
                       selectedTeacher.status === 'inactive' ? 'Inativo' : 'Pendente',
                classes: [`${selectedTeacher.classesAssigned} ${selectedTeacher.classesAssigned === 1 ? 'turma' : 'turmas'}`]
              }}
              onSave={handleSaveTeacher}
              onCancel={handleCancelEdit}
            />
          </DialogContent>
        </Dialog>
      )}

      {showRemoveTeacher && selectedTeacher && (
        <Dialog open={showRemoveTeacher} onOpenChange={setShowRemoveTeacher}>
          <DialogContent className="sm:max-w-md w-[90vw]">
            <RemoveTeacher
              teacher={selectedTeacher}
              onConfirm={handleConfirmRemove}
              onCancel={handleCancelRemove}
            />
          </DialogContent>
        </Dialog>
      )}

      <AdminNavigation />
    </div>
  );
};

export default TeacherManagement;