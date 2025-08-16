import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Plus, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/admin/components/AdminNavigation';
import AddTeacher from '@/components/admin/AddTeacher';
import AddClass from '@/components/admin/AddClass';
import QuickActionCarousel from '@/components/shared/QuickActionCarousel';
import StatsCard from '@/components/shared/StatsCard';
import ActivityItem from '@/components/shared/ActivityItem';
import { COLORS, GRADIENTS } from '@/constants/theme';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

const AdminDashboard: React.FC = () => {
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

  return (
    <div 
      className="min-h-screen pb-20 md:pb-24"
      style={{ backgroundColor: COLORS.lightBlue }}
    >
      <Dialog open={showAddTeacher} onOpenChange={setShowAddTeacher}>
        <DialogContent style={{ backgroundColor: COLORS.lightCream }}>
          <DialogHeader>
            <DialogTitle style={{ color: COLORS.darkNavy }}>
              Convidar Professor
            </DialogTitle>
            <DialogDescription style={{ color: COLORS.blue }}>
              Envie um convite para o professor se cadastrar no sistema
            </DialogDescription>
          </DialogHeader>
          <AddTeacher onCancel={() => setShowAddTeacher(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
        <DialogContent 
          className="sm:max-w-3xl"
          style={{ backgroundColor: COLORS.lightCream }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: COLORS.darkNavy }}>
              Criar Nova Turma
            </DialogTitle>
            <DialogDescription style={{ color: COLORS.blue }}>
              Cadastre uma nova turma no sistema
            </DialogDescription>
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
          <StatsCard
            title="Alunos"
            value={stats.totalStudents}
            icon={Users}
            gradient="from-[#28b0ff] to-[#0029ff]"
            iconColor="white"
          />
          <StatsCard
            title="Professores"
            value={stats.totalTeachers}
            icon={GraduationCap}
            gradient="from-[#ff7a28] to-[#d75200]"
            iconColor="white"
          />
          <StatsCard
            title="Turmas Ativas"
            value={stats.activeClasses}
            icon={BookOpen}
            gradient="from-[#28b0ff] to-[#0029ff]"
            iconColor="white"
          />
          <StatsCard
            title="Aulas Completas"
            value={stats.completedLessons}
            icon={TrendingUp}
            gradient="from-[#00a86b] to-[#008853]"
            iconColor="white"
          />
        </section>

        {/* Ações Rápidas com Carrossel */}
        <QuickActionCarousel actions={quickActions} />

        {/* Atividades Recentes */}
        <section>
          <h2 
            className="text-base sm:text-lg font-semibold mb-3 sm:mb-4"
            style={{ color: COLORS.darkNavy }}
          >
            Atividades Recentes
          </h2>
          <Card 
            style={{ 
              backgroundColor: COLORS.lightCream, 
              borderColor: COLORS.skyBlue 
            }}
          >
            <CardContent className="p-0">
              <div className="space-y-0">
                {recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    id={activity.id}
                    message={activity.message}
                    time={activity.time}
                    icon={activity.icon}
                    variant={activity.variant}
                    isLast={index === recentActivities.length - 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Avisos Importantes */}
        <section>
          <Card 
            className="text-white border-0"
            style={{ background: GRADIENTS.warning }}
          >
            <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>Avisos Importantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-white/90 leading-tight">
                  • Backup do sistema programado para hoje às 23:00
                </p>
                <p className="text-xs sm:text-sm text-white/90 leading-tight">
                  • 3 professores pendentes de aprovação
                </p>
                <p className="text-xs sm:text-sm text-white/90 leading-tight">
                  • Relatório mensal deve ser enviado até sexta-feira
                </p>
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