import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Plus, 
  Settings, 
  FileText,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AddTeacher from '@/components/admin/AddTeacher';
import AddClass from '@/components/admin/AddClass';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

const AdminDashboard: React.FC = () => {
  // Mock data - em produção viria de APIs
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const stats = {
    totalStudents: 1247,
    totalTeachers: 45,
    activeClasses: 18,
    completedLessons: 2534
  };

  const recentActivities = [
    {
      id: 1,
      type: 'new_student',
      message: 'Novo aluno cadastrado: João Silva',
      time: '5 min atrás',
      icon: Users,
      variant: 'success' as const
    },
    {
      id: 2,
      type: 'class_created',
      message: 'Prof. Maria criou aula de Cálculo II',
      time: '15 min atrás',
      icon: BookOpen,
      variant: 'info' as const
    },
    {
      id: 3,
      type: 'system_alert',
      message: 'Sistema será atualizado às 22:00',
      time: '1 hora atrás',
      icon: AlertTriangle,
      variant: 'warning' as const
    }
  ];

  const quickActions = [
    {
      title: 'Convidar Professor',
      description: 'Enviar convite para professor se cadastrar',
      icon: Plus,
      action: () => setShowAddTeacher(true),
      variant: 'outline' as const
    },
    {
      title: 'Criar Turma',
      description: 'Criar nova turma e definir horários',
      icon: GraduationCap,
      action: () => setShowAddClass(true),
      variant: 'outline' as const
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatórios e estatísticas',
      icon: FileText,
      action: () => console.log('Relatórios'),
      variant: 'outline' as const
    }
  ];

  const getVariantColor = (variant: 'success' | 'info' | 'warning') => {
    switch (variant) {
      case 'success': return 'text-[#0029ff] bg-[#f0f6ff]';
      case 'info': return 'text-[#28b0ff] bg-[#f0f6ff]';
      case 'warning': return 'text-[#ff7a28] bg-[#fffaf0]';
      default: return 'text-[#030025] bg-[#f0f6ff]';
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Dialog open={showAddTeacher} onOpenChange={setShowAddTeacher}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Professor</DialogTitle>
            <DialogDescription>Envie um convite para o professor se cadastrar no sistema</DialogDescription>
          </DialogHeader>
          <AddTeacher onCancel={() => setShowAddTeacher(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Criar Nova Turma</DialogTitle>
            <DialogDescription>Cadastre uma nova turma no sistema</DialogDescription>
          </DialogHeader>
          <AddClass 
            onSave={(newClass) => {
              console.log('Nova turma criada:', newClass);
              setShowAddClass(false);
            }} 
            onCancel={() => setShowAddClass(false)}
          />
        </DialogContent>
      </Dialog>

      <Header 
        title="Painel Administrativo"
        subtitle="Gerencie o sistema educacional"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Estatísticas Principais */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <Card className="bg-gradient-to-r from-[#28b0ff] to-[#0029ff] text-white border-[#28b0ff]">
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-white/80 text-xs lg:text-sm">Alunos</p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold truncate">{stats.totalStudents.toLocaleString()}</p>
                </div>
                <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white/60 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#ff7a28] to-[#d75200] text-white border-[#ff7a28]">
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-white/80 text-xs lg:text-sm">Professores</p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold">{stats.totalTeachers}</p>
                </div>
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white/60 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#28b0ff] to-[#0029ff] text-white border-[#28b0ff]">
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-white/80 text-xs lg:text-sm">Turmas Ativas</p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold">{stats.activeClasses}</p>
                </div>
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white/60 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#00a86b] to-[#008853] text-white border-[#00a86b]">
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-white/80 text-xs lg:text-sm">Aulas Completas</p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold truncate">{stats.completedLessons.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white/60 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ações Rápidas */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold text-[#030025] mb-3 sm:mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-[#fffaf0] border-[#28b0ff] hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-[#f0f6ff] rounded-lg border border-[#28b0ff] flex-shrink-0">
                      <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0029ff]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm sm:text-base text-[#030025] leading-tight">{action.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-[#001cab] line-clamp-2 mt-0.5">{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant={action.variant} 
                    size="sm" 
                    onClick={action.action}
                    className="w-full border-[#28b0ff] text-[#001cab] hover:bg-[#0029ff] hover:text-white hover:border-[#0029ff] transition-colors text-xs sm:text-sm"
                  >
                    Executar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Atividades Recentes */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold text-[#030025] mb-3 sm:mb-4">Atividades Recentes</h2>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-0">
              <div className="space-y-0">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`p-2 sm:p-3 lg:p-4 flex items-center space-x-2 sm:space-x-3 ${
                      index !== recentActivities.length - 1 ? 'border-b border-[#e0e7ff]' : ''
                    }`}
                  >
                    <div className={`p-1 sm:p-1.5 lg:p-2 rounded-full flex-shrink-0 ${getVariantColor(activity.variant)}`}>
                      <activity.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#030025] line-clamp-2 leading-tight">{activity.message}</p>
                      <div className="flex items-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#001cab] flex-shrink-0" />
                        <span className="text-xs text-[#001cab]">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Avisos Importantes */}
        <section>
          <Card className="bg-gradient-to-r from-[#ffb646] to-[#ff9800] text-white border-[#ffb646]">
            <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>Avisos Importantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-white/90 leading-tight">• Backup do sistema programado para hoje às 23:00</p>
                <p className="text-xs sm:text-sm text-white/90 leading-tight">• 3 professores pendentes de aprovação</p>
                <p className="text-xs sm:text-sm text-white/90 leading-tight">• Relatório mensal deve ser enviado até sexta-feira</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <AdminNavigation />
    </div>
  );
};

export default AdminDashboard;