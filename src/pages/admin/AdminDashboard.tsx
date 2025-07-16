import React from 'react';
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

const AdminDashboard: React.FC = () => {
  // Mock data - em produção viria de APIs
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
      title: 'Adicionar Professor',
      description: 'Cadastrar novo professor no sistema',
      icon: Plus,
      action: () => console.log('Adicionar professor'),
      variant: 'default' as const
    },
    {
      title: 'Criar Turma',
      description: 'Criar nova turma e definir horários',
      icon: GraduationCap,
      action: () => console.log('Criar turma'),
      variant: 'secondary' as const
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
      case 'success': return 'text-green-600 bg-green-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Painel Administrativo"
        subtitle="Gerencie o sistema educacional"
      />

      <div className="px-6 space-y-6">
        {/* Estatísticas Principais */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-[#28b0ff] to-[#0029ff] text-white border-[#28b0ff]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Alunos</p>
                  <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-white/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#ff7a28] to-[#d75200] text-white border-[#ff7a28]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Professores</p>
                  <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-white/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#28b0ff] to-[#0029ff] text-white border-[#28b0ff]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Turmas Ativas</p>
                  <p className="text-2xl font-bold">{stats.activeClasses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-white/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#00a86b] to-[#008853] text-white border-[#00a86b]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Aulas Completas</p>
                  <p className="text-2xl font-bold">{stats.completedLessons.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-white/60" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ações Rápidas */}
        <section>
          <h2 className="text-lg font-semibold text-[#030025] mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-[#fffaf0] border-[#28b0ff] hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                      <action.icon className="h-5 w-5 text-[#0029ff]" />
                    </div>
                    <div>
                      <CardTitle className="text-sm text-[#030025]">{action.title}</CardTitle>
                      <CardDescription className="text-xs text-[#001cab]">{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant={action.variant} 
                    size="sm" 
                    onClick={action.action}
                    className="w-full"
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
          <h2 className="text-lg font-semibold text-[#030025] mb-4">Atividades Recentes</h2>
          <Card className="bg-[#fffaf0] border-[#28b0ff]">
            <CardContent className="p-0">
              <div className="space-y-0">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`p-4 flex items-center space-x-3 ${
                      index !== recentActivities.length - 1 ? 'border-b border-[#e0e7ff]' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full ${getVariantColor(activity.variant)}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#030025]">{activity.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-[#001cab]" />
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Avisos Importantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-white/90">• Backup do sistema programado para hoje às 23:00</p>
                <p className="text-sm text-white/90">• 3 professores pendentes de aprovação</p>
                <p className="text-sm text-white/90">• Relatório mensal deve ser enviado até sexta-feira</p>
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