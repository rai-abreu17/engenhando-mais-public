import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus, 
  Search, 
  Clock, 
  Edit,
  Trash2,
  BookOpen,
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/admin/components/AdminNavigation';
import AddClass from '@/components/admin/AddClass';
import RemoveClass from '@/components/admin/RemoveClass';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const ClassManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClassForDeletion, setSelectedClassForDeletion] = useState<any | null>(null);
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'Cálculo I - Turma A',
      subject: 'Matemática',
      teacher: 'Prof. Maria Silva',
      studentsEnrolled: 25,
      lessonsRecorded: 8,
      status: 'active'
    },
    {
      id: 2,
      name: 'Física Experimental',
      subject: 'Física', 
      teacher: 'Prof. João Santos',
      studentsEnrolled: 18,
      lessonsRecorded: 12,
      status: 'active'
    },
    {
      id: 3,
      name: 'Química Orgânica',
      subject: 'Química',
      teacher: 'Prof. Ana Costa',
      studentsEnrolled: 0,
      lessonsRecorded: 0,
      status: 'pending'
    },
    {
      id: 4,
      name: 'Programação Avançada',
      subject: 'Tecnologia',
      teacher: 'Prof. Carlos Lima',
      studentsEnrolled: 22,
      lessonsRecorded: 15,
      status: 'active'
    }
  ]);

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(classItem.status);
    
    return matchesSearch && matchesStatus;
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

  const handleAddClass = (newClass: any) => {
    setClasses(prev => [...prev, newClass]);
    setShowAddClass(false);
  };

  const handleCancelAddClass = () => {
    setShowAddClass(false);
  };

  const handleEditClass = (classId: number) => {
    console.log('Editar turma:', classId);
    // Aqui você implementaria a lógica de edição
  };

  const handleDeleteClass = (classId: number) => {
    const classData = classes.find(c => c.id === classId);
    if (classData) {
      // Preparar dados no formato esperado pelo RemoveClass
      const formattedClass = {
        ...classData,
        teacherId: 1, // Mock ID
        studentsCount: classData.studentsEnrolled,
        lessonsCount: classData.lessonsRecorded,
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        schedule: [
          { day: 'Segunda', startTime: '08:00', endTime: '10:00' },
          { day: 'Quarta', startTime: '14:00', endTime: '16:00' }
        ],
        description: `Turma de ${classData.subject} ministrada por ${classData.teacher}`
      };
      setSelectedClassForDeletion(formattedClass);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDeleteClass = (classId: number) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
    setShowDeleteModal(false);
    setSelectedClassForDeletion(null);
    console.log('Turma excluída:', classId);
  };

  const handleCancelDeleteClass = () => {
    setShowDeleteModal(false);
    setSelectedClassForDeletion(null);
  };

  const handleManageLessons = (classId: number) => {
    console.log('Gerenciar aulas da turma:', classId);
    // Aqui você navegaria para a página de gerenciamento de aulas
    // ou abriria um modal
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>;
      case 'pending':
        return <Badge className="bg-[#fffaf0] text-[#d75200] border-[#ff7a28]">Pendente</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inativa</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-[#0029ff]" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-[#ff7a28]" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-[#d75200]" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Turma</DialogTitle>
            <DialogDescription>Cadastre uma nova turma no sistema</DialogDescription>
          </DialogHeader>
          <AddClass 
            onSave={handleAddClass} 
            onCancel={handleCancelAddClass}
          />
        </DialogContent>
      </Dialog>

      <Header 
        title="Gerenciar Turmas"
        subtitle="Administre as turmas do sistema"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 lg:gap-4">
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#030025]">Turmas Cadastradas</h2>
            <p className="text-xs sm:text-sm text-[#001cab]">
              {classes.length} {classes.length === 1 ? 'turma' : 'turmas'} no total
              {hasActiveFilters && ` • ${filteredClasses.length} ${filteredClasses.length === 1 ? 'corresponde' : 'correspondem'} aos filtros`}
            </p>
          </div>
          <Button 
            className="bg-[#0029ff] hover:bg-[#001cab] text-white w-full sm:w-auto text-xs sm:text-sm"
            onClick={() => setShowAddClass(true)}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Criar Turma</span>
            <span className="sm:hidden">Criar</span>
          </Button>
        </section>

        {/* Barra de Busca e Filtros */}
        <section className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#001cab] h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Buscar por nome, matéria ou professor..."
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
                  className={`border-[#28b0ff] hover:bg-[#f0f6ff] w-auto text-xs sm:text-sm h-8 sm:h-10 ${hasActiveFilters ? 'bg-[#0029ff] text-white border-[#0029ff]' : 'text-[#0029ff]'}`}
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Filtros</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 sm:ml-2 bg-white/20 text-white text-xs">
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
                      { value: 'active', label: 'Ativas', count: classes.filter(c => c.status === 'active').length },
                      { value: 'pending', label: 'Pendentes', count: classes.filter(c => c.status === 'pending').length },
                      { value: 'completed', label: 'Concluídas', count: classes.filter(c => c.status === 'completed').length }
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

        {/* Lista de Turmas */}
        <section>
          {/* Resultado da busca/filtro */}
          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-[#f0f6ff] border border-[#28b0ff] rounded-lg">
              <p className="text-sm text-[#001cab]">
                {filteredClasses.length === 0 ? (
                  <>Nenhum resultado encontrado</>
                ) : (
                  <>
                    Mostrando <strong>{filteredClasses.length}</strong> de <strong>{classes.length}</strong> {filteredClasses.length === 1 ? 'turma' : 'turmas'}
                    {searchTerm && <> para "<strong>{searchTerm}</strong>"</>}
                    {selectedStatuses.length > 0 && (
                      <> com status: <strong>
                        {selectedStatuses.map(status => 
                          status === 'active' ? 'Ativas' : 
                          status === 'pending' ? 'Pendentes' : 'Concluídas'
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
          <div className="space-y-3 sm:space-y-4">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="bg-[#fffaf0] border-[#28b0ff] hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm sm:text-lg text-[#030025] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="truncate">{classItem.name}</span>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {getStatusIcon(classItem.status)}
                          {getStatusBadge(classItem.status)}
                        </div>
                      </CardTitle>
                      <CardDescription className="text-[#001cab] mt-1 text-xs sm:text-sm">
                        {classItem.subject} • {classItem.teacher}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEditClass(classItem.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar turma
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageLessons(classItem.id)}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Gerenciar aulas
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir turma
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-3 sm:px-6 pb-4 sm:pb-6">
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {/* Alunos Matriculados */}
                    <div className="text-center">
                      <p className="text-lg sm:text-2xl font-bold text-[#0029ff]">{classItem.studentsEnrolled}</p>
                      <p className="text-xs sm:text-sm text-[#001cab]">Alunos Matriculados</p>
                    </div>

                    {/* Aulas Gravadas */}
                    <div className="text-center">
                      <p className="text-lg sm:text-2xl font-bold text-[#0029ff]">{classItem.lessonsRecorded}</p>
                      <p className="text-xs sm:text-sm text-[#001cab]">Aulas Gravadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <Card className="bg-[#fffaf0] border-[#28b0ff]">
              <CardContent className="p-8 text-center">
                {hasActiveFilters ? (
                  <div className="space-y-2">
                    <p className="text-[#001cab]">Nenhuma turma encontrada com os critérios atuais.</p>
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
                    <p className="text-[#001cab]">Nenhuma turma cadastrada ainda.</p>
                    <Button className="bg-[#0029ff] hover:bg-[#001cab] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Turma
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {/* Modal para excluir turma */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          {selectedClassForDeletion && (
            <RemoveClass
              classData={selectedClassForDeletion}
              onConfirm={handleConfirmDeleteClass}
              onCancel={handleCancelDeleteClass}
            />
          )}
        </DialogContent>
      </Dialog>

      <AdminNavigation />
    </div>
  );
};

export default ClassManagement;