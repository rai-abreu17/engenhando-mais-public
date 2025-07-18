import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Shield, 
  Users, 
  Key, 
  Bell,
  Database,
  Mail,
  Lock,
  AlertTriangle,
  Save,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import Header from '@/components/common/Header';
import AdminNavigation from '@/admin/components/AdminNavigation';

const AdminSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);

  // Mock data - em produção viria de APIs
  const userManagement = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@escola.com',
      role: 'student',
      status: 'active',
      lastAccess: '2024-01-16'
    },
    {
      id: 2,
      name: 'Prof. Maria Santos',
      email: 'maria@escola.com',
      role: 'teacher',
      status: 'active',
      lastAccess: '2024-01-16'
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@escola.com',
      role: 'student',
      status: 'inactive',
      lastAccess: '2024-01-10'
    }
  ];

  const systemInfo = {
    version: '2.1.4',
    lastUpdate: '2024-01-15',
    uptime: '15 dias',
    storage: '2.3GB / 10GB',
    users: 1247,
    lastBackup: '2024-01-16 03:00'
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>;
      case 'teacher':
        return <Badge className="bg-engenha-light-blue text-engenha-bright-blue border-engenha-sky-blue">Professor</Badge>;
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

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Configurações do Sistema"
        subtitle="Gerencie configurações e controle de acesso"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Informações do Sistema */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="flex items-center space-x-2 text-[#030025] text-sm sm:text-base lg:text-lg">
              <Database className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              <span>Informações do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs text-[#001cab]">Versão</p>
                <p className="font-bold text-[#030025] text-xs sm:text-sm lg:text-base">{systemInfo.version}</p>
              </div>
              <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs text-[#001cab]">Uptime</p>
                <p className="font-bold text-[#030025] text-xs sm:text-sm lg:text-base">{systemInfo.uptime}</p>
              </div>
              <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs text-[#001cab]">Armazenamento</p>
                <p className="font-bold text-[#030025] text-xs sm:text-sm lg:text-base">{systemInfo.storage}</p>
              </div>
              <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs text-[#001cab]">Usuários</p>
                <p className="font-bold text-[#030025] text-xs sm:text-sm lg:text-base">{systemInfo.users.toLocaleString()}</p>
              </div>
              <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs text-[#001cab]">Último Backup</p>
                <p className="font-bold text-[#030025] text-xs">{systemInfo.lastBackup}</p>
              </div>
              <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs text-[#001cab]">Atualização</p>
                <p className="font-bold text-[#030025] text-xs sm:text-sm lg:text-base">{systemInfo.lastUpdate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações Gerais */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
            <CardTitle className="flex items-center space-x-2 text-[#030025] text-sm sm:text-base lg:text-lg">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              <span>Configurações Gerais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#030025] text-sm sm:text-base">Notificações por Email</p>
                <p className="text-xs sm:text-sm text-[#001cab]">Receber alertas importantes por email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                className="self-start sm:self-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#030025] text-sm sm:text-base">Backup Automático</p>
                <p className="text-xs sm:text-sm text-[#001cab]">Backup diário dos dados do sistema</p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
                className="self-start sm:self-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#030025] text-sm sm:text-base">Aprovação de Professores</p>
                <p className="text-xs sm:text-sm text-[#001cab]">Requer aprovação para novos professores</p>
              </div>
              <Switch
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
                className="self-start sm:self-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-start sm:items-center space-x-2 flex-1 min-w-0">
                <AlertTriangle className="h-4 w-4 text-[#d75200] flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="min-w-0">
                  <p className="font-medium text-[#030025] text-sm sm:text-base">Modo Manutenção</p>
                  <p className="text-xs sm:text-sm text-[#001cab]">Bloqueia acesso de usuários temporariamente</p>
                </div>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
                className="self-start sm:self-auto"
              />
            </div>
          </CardContent>
        </Card>


        {/* Segurança */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#030025] text-sm sm:text-base lg:text-lg">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              <span>Configurações de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#030025] mb-1 sm:mb-2">
                  Tempo de Sessão (min)
                </label>
                <Input
                  type="number"
                  defaultValue="60"
                  className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#030025] mb-1 sm:mb-2">
                  Max Tentativas Login
                </label>
                <Input
                  type="number"
                  defaultValue="5"
                  className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff] text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <Button variant="outline" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff] text-xs sm:text-sm h-8 sm:h-10">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span>Senha Admin</span>
              </Button>
              <Button variant="outline" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff] text-xs sm:text-sm h-8 sm:h-10">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span>Logs Segurança</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup e Manutenção */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#030025] text-sm sm:text-base lg:text-lg">
              <Database className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              <span>Backup e Manutenção</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-3">
              <Button className="bg-[#0029ff] hover:bg-[#001cab] text-white text-xs sm:text-sm h-8 sm:h-10">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Backup</span>
              </Button>
              <Button variant="outline" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff] text-xs sm:text-sm h-8 sm:h-10">
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Restaurar</span>
              </Button>
              <Button variant="outline" className="border-[#ff7a28] text-[#ff7a28] hover:bg-orange-50 text-xs sm:text-sm h-8 sm:h-10">
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Cache</span>
              </Button>
              <Button variant="outline" className="border-[#d75200] text-[#d75200] hover:bg-red-50 text-xs sm:text-sm h-8 sm:h-10">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>Reiniciar</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Salvar Configurações */}
        <Card className="bg-gradient-to-r from-[#00a86b] to-[#008853] text-white border-[#00a86b]">
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <Button className="w-full bg-white text-[#00a86b] hover:bg-gray-100 text-xs sm:text-sm lg:text-base h-8 sm:h-10 lg:h-12">
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>Salvar Configurações</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <AdminNavigation />
    </div>
  );
};

export default AdminSettings;