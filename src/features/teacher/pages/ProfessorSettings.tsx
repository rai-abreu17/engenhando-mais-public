import React, { useState } from 'react';
import { User, Bell, BookOpen, Shield, LogOut, Settings, Save, ChevronRight } from 'lucide-react';
import TeacherNavigation from '../components/TeacherNavigation';
import Header from '@/components/common/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ProfessorSettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Perfil do professor
  const [profileForm, setProfileForm] = useState({
    name: 'Prof. Maria Santos',
    email: 'maria.santos@universidade.edu.br',
    phone: '(31) 98765-4321',
    bio: 'Professora de Engenharia há 8 anos, especializada em cálculo e física aplicada.'
  });

  // Preferências de notificação
  const [notifications, setNotifications] = useState({
    newQuestions: true,
    studentFeedback: true,
    classUpdates: true,
    adminAnnouncements: true,
    emailNotifications: true,
    pushNotifications: false
  });

  // Preferências de ensino
  const [teachingPreferences, setTeachingPreferences] = useState({
    defaultLessonVisibility: 'draft',
    autoFeedbackRequest: true,
    studentInteractionLevel: 'medium',
    feedbackAnonymity: true
  });

  // Integração com outras ferramentas
  const [integrations, setIntegrations] = useState({
    googleClassroom: false,
    microsoftTeams: false,
    zoom: true,
    moodle: false
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting: string) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleTeachingPrefChange = (setting: string, value: any) => {
    setTeachingPreferences(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleIntegrationChange = (integration: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: !prev[integration as keyof typeof prev]
    }));
  };

  const handleLogout = () => {
    // Limpar dados de autenticação
    localStorage.removeItem('engenha_token');
    localStorage.removeItem('engenha_user_type');
    localStorage.removeItem('selectedMascot');
    localStorage.removeItem('unlockedMascots');
    localStorage.removeItem('customMascotNames');
    
    // Redirecionar para a página de login
    navigate('/login');
  };

  const handleSaveSettings = () => {
    // Simular salvamento das configurações
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
      duration: 3000
    });
  };

  const settingsItems = [
    {
      icon: User,
      title: 'Perfil e Conta',
      subtitle: 'Editar informações pessoais e profissionais',
      component: 'profile'
    },
    {
      icon: Bell,
      title: 'Notificações',
      subtitle: 'Gerenciar alertas e preferências de comunicação',
      component: 'notifications'
    },
    {
      icon: BookOpen,
      title: 'Ensino',
      subtitle: 'Configurar preferências pedagógicas',
      component: 'teaching'
    },
    {
      icon: Shield,
      title: 'Integrações',
      subtitle: 'Conectar com ferramentas externas',
      component: 'integrations'
    }
  ];

  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const userInfo = {
    name: 'Prof. Maria Santos',
    email: 'maria.santos@universidade.edu.br',
    department: 'Engenharia Civil',
    role: 'Professor'
  };
  // Componente de Perfil
  const ProfileSettings = React.memo(() => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveComponent(null)}
            className="text-engenha-blue font-medium"
          >
            ← Voltar
          </button>
          <h3 className="font-semibold text-engenha-dark-navy">Perfil e Conta</h3>
          <div></div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações de contato e perfil profissional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={profileForm.name} 
                  onChange={handleProfileChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email institucional</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profileForm.email} 
                  onChange={handleProfileChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={profileForm.phone} 
                  onChange={handleProfileChange} 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Biografia profissional</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  rows={4} 
                  value={profileForm.bio} 
                  onChange={handleProfileChange} 
                  placeholder="Descreva sua experiência profissional e áreas de atuação"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Salvar alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  });

  // Componente de Notificações
  const NotificationSettings = React.memo(() => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveComponent(null)}
            className="text-engenha-blue font-medium"
          >
            ← Voltar
          </button>
          <h3 className="font-semibold text-engenha-dark-navy">Notificações</h3>
          <div></div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Notificação</CardTitle>
            <CardDescription>
              Configure como e quando deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notificações da Plataforma</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Perguntas de alunos</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado quando alunos fizerem perguntas nas suas aulas
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.newQuestions} 
                    onCheckedChange={() => handleNotificationChange('newQuestions')} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Feedback de alunos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando alunos avaliarem suas aulas
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.studentFeedback} 
                    onCheckedChange={() => handleNotificationChange('studentFeedback')} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atualizações de turma</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja informado sobre mudanças nas suas turmas
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.classUpdates} 
                    onCheckedChange={() => handleNotificationChange('classUpdates')} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comunicados administrativos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações sobre atualizações da plataforma
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.adminAnnouncements} 
                    onCheckedChange={() => handleNotificationChange('adminAnnouncements')} 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Canais de Notificação</h3>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por email
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.emailNotifications} 
                    onCheckedChange={() => handleNotificationChange('emailNotifications')} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações push</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações no navegador ou aplicativo
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.pushNotifications} 
                    onCheckedChange={() => handleNotificationChange('pushNotifications')} 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Salvar alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  });

  // Componente de Ensino
  const TeachingSettings = React.memo(() => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveComponent(null)}
            className="text-engenha-blue font-medium"
          >
            ← Voltar
          </button>
          <h3 className="font-semibold text-engenha-dark-navy">Ensino</h3>
          <div></div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Ensino</CardTitle>
            <CardDescription>
              Configure como suas aulas e interações com alunos funcionam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="lessonVisibility">Visibilidade padrão para novas aulas</Label>
                <Select 
                  value={teachingPreferences.defaultLessonVisibility}
                  onValueChange={(value) => handleTeachingPrefChange('defaultLessonVisibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="published">Publicada (visível para todos)</SelectItem>
                      <SelectItem value="draft">Rascunho (visível apenas para você)</SelectItem>
                      <SelectItem value="scheduled">Agendada (publicação automática)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interactionLevel">Nível de interação com alunos</Label>
                <Select 
                  value={teachingPreferences.studentInteractionLevel}
                  onValueChange={(value) => handleTeachingPrefChange('studentInteractionLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="high">Alto (permitir comentários e perguntas em tempo real)</SelectItem>
                      <SelectItem value="medium">Médio (permitir perguntas, mas moderar comentários)</SelectItem>
                      <SelectItem value="low">Baixo (desabilitar comentários, apenas perguntas)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>Solicitar feedback automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Pedir avaliação aos alunos após concluírem uma aula
                  </p>
                </div>
                <Switch 
                  checked={teachingPreferences.autoFeedbackRequest} 
                  onCheckedChange={(checked) => handleTeachingPrefChange('autoFeedbackRequest', checked)} 
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonimato em feedbacks</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que alunos enviem feedback anônimo
                  </p>
                </div>
                <Switch 
                  checked={teachingPreferences.feedbackAnonymity} 
                  onCheckedChange={(checked) => handleTeachingPrefChange('feedbackAnonymity', checked)} 
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Salvar alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  });

  // Componente de Integrações
  const IntegrationSettings = React.memo(() => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveComponent(null)}
            className="text-engenha-blue font-medium"
          >
            ← Voltar
          </button>
          <h3 className="font-semibold text-engenha-dark-navy">Integrações</h3>
          <div></div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Integrações com Ferramentas Externas</CardTitle>
            <CardDescription>
              Conecte sua conta com outras plataformas educacionais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Google Classroom</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar turmas e conteúdos com Google Classroom
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={integrations.googleClassroom} 
                    onCheckedChange={() => handleIntegrationChange('googleClassroom')} 
                  />
                  {!integrations.googleClassroom && 
                    <Button variant="outline" size="sm">Conectar</Button>
                  }
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Microsoft Teams</Label>
                  <p className="text-sm text-muted-foreground">
                    Integrar com Microsoft Teams para aulas ao vivo
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={integrations.microsoftTeams} 
                    onCheckedChange={() => handleIntegrationChange('microsoftTeams')} 
                  />
                  {!integrations.microsoftTeams && 
                    <Button variant="outline" size="sm">Conectar</Button>
                  }
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Zoom</Label>
                  <p className="text-sm text-muted-foreground">
                    Conectar com Zoom para videoconferências
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={integrations.zoom} 
                    onCheckedChange={() => handleIntegrationChange('zoom')} 
                  />
                  {!integrations.zoom && 
                    <Button variant="outline" size="sm">Conectar</Button>
                  }
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Moodle</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar conteúdos com plataforma Moodle
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={integrations.moodle} 
                    onCheckedChange={() => handleIntegrationChange('moodle')} 
                  />
                  {!integrations.moodle && 
                    <Button variant="outline" size="sm">Conectar</Button>
                  }
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSaveSettings} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Salvar alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  });

  // Renderização condicional para cada seção
  if (activeComponent === 'profile') {
    return (
      <div className="min-h-screen bg-engenha-light-blue pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <ProfileSettings />
        </div>
        <TeacherNavigation />
      </div>
    );
  }

  if (activeComponent === 'notifications') {
    return (
      <div className="min-h-screen bg-engenha-light-blue pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <NotificationSettings />
        </div>
        <TeacherNavigation />
      </div>
    );
  }

  if (activeComponent === 'teaching') {
    return (
      <div className="min-h-screen bg-engenha-light-blue pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <TeachingSettings />
        </div>
        <TeacherNavigation />
      </div>
    );
  }

  if (activeComponent === 'integrations') {
    return (
      <div className="min-h-screen bg-engenha-light-blue pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <IntegrationSettings />
        </div>
        <TeacherNavigation />
      </div>
    );
  }

  // Tela principal com botões/cards
  return (
    <div className="min-h-screen bg-engenha-light-blue pb-20">
      <Header title="Configurações" subtitle="Personalize sua experiência na plataforma" />

      <div className="px-6 space-y-6">
        {/* User Profile */}
        <section className="bg-engenha-light-cream p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-engenha-gradient rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">{userInfo.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-engenha-dark-navy">{userInfo.name}</h3>
              <p className="text-sm text-engenha-dark-navy opacity-70">{userInfo.email}</p>
              <p className="text-sm text-engenha-dark-navy opacity-70">{userInfo.department} • {userInfo.role}</p>
            </div>
          </div>
        </section>

        {/* Settings Items */}
        <section className="space-y-3">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.component) {
                  setActiveComponent(item.component);
                }
              }}
              className="w-full bg-engenha-light-cream p-4 rounded-xl shadow-sm border border-engenha-sky-blue hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-engenha-light-blue p-2 rounded-lg">
                  <item.icon className="text-engenha-blue" size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-engenha-dark-navy">{item.title}</h3>
                  <p className="text-sm text-engenha-dark-navy opacity-70">{item.subtitle}</p>
                </div>
                <ChevronRight className="text-engenha-dark-navy opacity-50" size={20} />
              </div>
            </button>
          ))}
        </section>

        {/* Additional Options */}
        <section className="space-y-3">
          <div className="bg-engenha-light-cream p-4 rounded-xl shadow-sm">
            <h3 className="font-medium text-engenha-dark-navy mb-2">Sobre o Aplicativo</h3>
            <div className="space-y-2 text-sm text-engenha-dark-navy opacity-70">
              <p>Versão 1.0.0</p>
              <p>ENGENHA+ © 2024</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full bg-engenha-dark-orange border border-engenha-dark-orange p-4 rounded-xl hover:bg-engenha-orange transition-colors"
          >
            <div className="flex items-center justify-center space-x-2 text-white">
              <LogOut size={20} />
              <span className="font-medium">Sair da Conta</span>
            </div>
          </button>
        </section>
      </div>

      <TeacherNavigation />
    </div>
  );
};

export default ProfessorSettings;
