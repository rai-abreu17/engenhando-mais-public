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
import AdminNavigation from '@/components/admin/AdminNavigation';

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

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Configurações do Sistema"
        subtitle="Gerencie configurações e controle de acesso"
      />

      <div className="px-4 sm:px-6 space-y-4 sm:space-y-6">
        {/* Informações do Sistema */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center space-x-2 text-[#030025] text-base sm:text-lg">
              <Database className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Informações do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-2 sm:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs sm:text-sm text-[#001cab]">Versão</p>
                <p className="font-bold text-[#030025] text-sm sm:text-base">{systemInfo.version}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs sm:text-sm text-[#001cab]">Uptime</p>
                <p className="font-bold text-[#030025] text-sm sm:text-base">{systemInfo.uptime}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs sm:text-sm text-[#001cab]">Armazenamento</p>
                <p className="font-bold text-[#030025] text-sm sm:text-base">{systemInfo.storage}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs sm:text-sm text-[#001cab]">Usuários</p>
                <p className="font-bold text-[#030025] text-sm sm:text-base">{systemInfo.users.toLocaleString()}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs sm:text-sm text-[#001cab]">Último Backup</p>
                <p className="font-bold text-[#030025] text-xs sm:text-sm">{systemInfo.lastBackup}</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <p className="text-xs sm:text-sm text-[#001cab]">Atualização</p>
                <p className="font-bold text-[#030025] text-sm sm:text-base">{systemInfo.lastUpdate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações Gerais */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center space-x-2 text-[#030025] text-base sm:text-lg">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Configurações Gerais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#030025]">Notificações por Email</p>
                <p className="text-sm text-[#001cab]">Receber alertas importantes por email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#030025]">Backup Automático</p>
                <p className="text-sm text-[#001cab]">Backup diário dos dados do sistema</p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#030025]">Aprovação de Professores</p>
                <p className="text-sm text-[#001cab]">Requer aprovação para novos professores</p>
              </div>
              <Switch
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-[#d75200]" />
                <div>
                  <p className="font-medium text-[#030025]">Modo Manutenção</p>
                  <p className="text-sm text-[#001cab]">Bloqueia acesso de usuários temporariamente</p>
                </div>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gerenciamento de Usuários */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#030025]">
              <Users className="h-5 w-5" />
              <span>Controle de Acesso</span>
            </CardTitle>
            <CardDescription className="text-[#001cab]">
              Gerencie permissões e status dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userManagement.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <p className="font-medium text-[#030025]">{user.name}</p>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-sm text-[#001cab]">{user.email}</p>
                    <p className="text-xs text-[#001cab]">Último acesso: {new Date(user.lastAccess).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                      <Key className="h-4 w-4 mr-1" />
                      Reset Senha
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={user.status === 'active' ? 'border-[#d75200] text-[#d75200] hover:bg-red-50' : 'border-[#00a86b] text-[#00a86b] hover:bg-green-50'}
                    >
                      {user.status === 'active' ? 'Desativar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#030025]">
              <Shield className="h-5 w-5" />
              <span>Configurações de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#030025] mb-2">
                Tempo de Sessão (minutos)
              </label>
              <Input
                type="number"
                defaultValue="60"
                className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#030025] mb-2">
                Tentativas de Login Máximas
              </label>
              <Input
                type="number"
                defaultValue="5"
                className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                <Lock className="h-4 w-4 mr-2" />
                Alterar Senha Admin
              </Button>
              <Button variant="outline" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                <Shield className="h-4 w-4 mr-2" />
                Log de Segurança
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup e Manutenção */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#030025]">
              <Database className="h-5 w-5" />
              <span>Backup e Manutenção</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="bg-[#0029ff] hover:bg-[#001cab] text-white">
                <Download className="h-4 w-4 mr-2" />
                Fazer Backup Agora
              </Button>
              <Button variant="outline" className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]">
                <Upload className="h-4 w-4 mr-2" />
                Restaurar Backup
              </Button>
              <Button variant="outline" className="border-[#ff7a28] text-[#ff7a28] hover:bg-orange-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar Cache
              </Button>
              <Button variant="outline" className="border-[#d75200] text-[#d75200] hover:bg-red-50">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reiniciar Sistema
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Salvar Configurações */}
        <Card className="bg-gradient-to-r from-[#00a86b] to-[#008853] text-white border-[#00a86b]">
          <CardContent className="p-4">
            <Button className="w-full bg-white text-[#00a86b] hover:bg-gray-100">
              <Save className="h-4 w-4 mr-2" />
              Salvar Todas as Configurações
            </Button>
          </CardContent>
        </Card>
      </div>

      <AdminNavigation />
    </div>
  );
};

export default AdminSettings;