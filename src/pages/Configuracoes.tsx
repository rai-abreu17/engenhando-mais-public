
import React, { useState } from 'react';
import { ChevronRight, User, Bell, Smartphone, HelpCircle, LogOut } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Configuracoes = () => {
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    mascotAlerts: true,
    newContent: false,
    achievements: true
  });

  const [studyMethod, setStudyMethod] = useState('pomodoro');
  const [pomodoroSettings, setPomodoroSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    cycles: 4
  });

  const userInfo = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    university: 'UFMG',
    course: 'Engenharia Civil',
    plan: 'Gratuito'
  };

  const settingsItems = [
    {
      icon: User,
      title: 'Perfil e Conta',
      subtitle: 'Editar informações pessoais',
      component: 'profile'
    },
    {
      icon: Bell,
      title: 'Notificações',
      subtitle: 'Gerenciar alertas e lembretes',
      component: 'notifications'
    },
    {
      icon: Smartphone,
      title: 'Método de Estudo',
      subtitle: 'Personalizar experiência de aprendizado',
      component: 'study'
    },
    {
      icon: HelpCircle,
      title: 'Ajuda e Suporte',
      subtitle: 'FAQ, contato e documentação',
      component: 'help'
    }
  ];

  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const ProfileSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveComponent(null)}
          className="text-engenha-blue font-medium"
        >
          ← Voltar
        </button>
        <h3 className="font-semibold text-gray-800">Perfil e Conta</h3>
        <div></div>
      </div>
      
      <div className="bg-white p-4 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <input
            type="text"
            defaultValue={userInfo.name}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            defaultValue={userInfo.email}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Universidade</label>
          <input
            type="text"
            defaultValue={userInfo.university}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-blue">
            <option value="civil">Engenharia Civil</option>
            <option value="mecanica">Engenharia Mecânica</option>
            <option value="eletrica">Engenharia Elétrica</option>
            <option value="computacao">Engenharia da Computação</option>
            <option value="quimica">Engenharia Química</option>
          </select>
        </div>
        <button className="w-full bg-engenha-blue text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Salvar Alterações
        </button>
      </div>
    </div>
  );

  const HelpSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveComponent(null)}
          className="text-engenha-blue font-medium"
        >
          ← Voltar
        </button>
        <h3 className="font-semibold text-gray-800">Ajuda e Suporte</h3>
        <div></div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Perguntas Frequentes</h4>
          <div className="space-y-2">
            <details className="cursor-pointer">
              <summary className="text-sm text-gray-600 hover:text-gray-800">Como funciona o sistema de moedas?</summary>
              <p className="text-xs text-gray-500 mt-1 pl-4">Você ganha moedas assistindo videoaulas, completando exercícios e mantendo sua sequência de estudos.</p>
            </details>
            <details className="cursor-pointer">
              <summary className="text-sm text-gray-600 hover:text-gray-800">Como cuidar do meu mascote?</summary>
              <p className="text-xs text-gray-500 mt-1 pl-4">Seu mascote precisa de atenção diária. Alimente-o, brinque e compre itens na loja para mantê-lo feliz.</p>
            </details>
            <details className="cursor-pointer">
              <summary className="text-sm text-gray-600 hover:text-gray-800">Posso baixar as videoaulas?</summary>
              <p className="text-xs text-gray-500 mt-1 pl-4">Sim, usuários Premium podem baixar videoaulas para assistir offline.</p>
            </details>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Contato</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📧 suporte@engenhamais.com</p>
            <p>📱 WhatsApp: (11) 99999-9999</p>
            <p>🕒 Atendimento: Seg-Sex, 9h às 18h</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Documentação</h4>
          <div className="space-y-2">
            <button className="text-sm text-engenha-blue hover:underline">Termos de Uso</button>
            <br />
            <button className="text-sm text-engenha-blue hover:underline">Política de Privacidade</button>
            <br />
            <button className="text-sm text-engenha-blue hover:underline">Guia do Usuário</button>
          </div>
        </div>
      </div>
    </div>
  );

  const UpgradeSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveComponent(null)}
          className="text-engenha-blue font-medium"
        >
          ← Voltar
        </button>
        <h3 className="font-semibold text-gray-800">Planos Premium</h3>
        <div></div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <h4 className="font-bold text-lg mb-2">Plano Estudante</h4>
          <p className="text-blue-100 text-sm mb-3">Ideal para estudantes universitários</p>
          <div className="text-2xl font-bold mb-3">R$ 19,90/mês</div>
          <ul className="text-sm space-y-1 mb-4">
            <li>✓ Acesso a todas as videoaulas</li>
            <li>✓ Download para assistir offline</li>
            <li>✓ Exercícios ilimitados</li>
            <li>✓ Suporte prioritário</li>
          </ul>
          <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Assinar Agora
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <h4 className="font-bold text-lg mb-2">Plano Premium</h4>
          <p className="text-purple-100 text-sm mb-3">Para quem quer o máximo de recursos</p>
          <div className="text-2xl font-bold mb-3">R$ 39,90/mês</div>
          <ul className="text-sm space-y-1 mb-4">
            <li>✓ Tudo do Plano Estudante</li>
            <li>✓ Mentoria individual</li>
            <li>✓ Simulados exclusivos</li>
            <li>✓ Certificados de conclusão</li>
            <li>✓ Acesso antecipado a novos conteúdos</li>
          </ul>
          <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Assinar Agora
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold text-lg mb-2 text-gray-800">Plano Gratuito</h4>
          <p className="text-gray-600 text-sm mb-3">Seu plano atual</p>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>✓ 3 videoaulas por semana</li>
            <li>✓ Exercícios básicos</li>
            <li>✓ Mascote virtual</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveComponent(null)}
          className="text-engenha-blue font-medium"
        >
          ← Voltar
        </button>
        <h3 className="font-semibold text-gray-800">Notificações</h3>
        <div></div>
      </div>
      
      {Object.entries(notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between bg-white p-4 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-800">
              {key === 'studyReminders' && 'Lembretes de Estudo'}
              {key === 'mascotAlerts' && 'Alertas do Mascote'}
              {key === 'newContent' && 'Novos Conteúdos'}
              {key === 'achievements' && 'Conquistas'}
            </h4>
            <p className="text-sm text-gray-500">
              {key === 'studyReminders' && 'Notificações diárias para manter rotina'}
              {key === 'mascotAlerts' && 'Quando seu mascote precisar de cuidados'}
              {key === 'newContent' && 'Novas videoaulas e materiais'}
              {key === 'achievements' && 'Troféus e marcos importantes'}
            </p>
          </div>
          <button
            onClick={() => setNotifications({...notifications, [key]: !value})}
            className={`w-12 h-6 rounded-full transition-colors ${
              value ? 'bg-engenha-blue' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}></div>
          </button>
        </div>
      ))}
    </div>
  );

  const StudySettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveComponent(null)}
          className="text-engenha-blue font-medium"
        >
          ← Voltar
        </button>
        <h3 className="font-semibold text-gray-800">Método de Estudo</h3>
        <div></div>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3">Escolha seu método preferido</h4>
        <div className="space-y-3">
          {[
            { id: 'pomodoro', name: 'Técnica Pomodoro', desc: '25 min foco + 5 min pausa' },
            { id: 'continuous', name: 'Estudo Contínuo', desc: 'Sem intervalos fixos' },
            { id: 'custom', name: 'Personalizado', desc: 'Defina seus próprios tempos' }
          ].map((method) => (
            <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="studyMethod"
                value={method.id}
                checked={studyMethod === method.id}
                onChange={(e) => setStudyMethod(e.target.value)}
                className="text-engenha-blue"
              />
              <div>
                <p className="font-medium text-gray-800">{method.name}</p>
                <p className="text-sm text-gray-500">{method.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {studyMethod === 'pomodoro' && (
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Configurações Pomodoro</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(pomodoroSettings).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key === 'focusTime' && 'Foco (min)'}
                  {key === 'shortBreak' && 'Pausa curta (min)'}
                  {key === 'longBreak' && 'Pausa longa (min)'}
                  {key === 'cycles' && 'Ciclos'}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setPomodoroSettings({
                    ...pomodoroSettings,
                    [key]: parseInt(e.target.value)
                  })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-blue"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (activeComponent === 'upgrade') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <UpgradeSettings />
        </div>
        <Navigation />
      </div>
    );
  }

  if (activeComponent === 'profile') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <ProfileSettings />
        </div>
        <Navigation />
      </div>
    );
  }

  if (activeComponent === 'help') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <HelpSettings />
        </div>
        <Navigation />
      </div>
    );
  }

  if (activeComponent === 'notifications') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <NotificationSettings />
        </div>
        <Navigation />
      </div>
    );
  }

  if (activeComponent === 'study') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <StudySettings />
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Configurações" subtitle="Personalize sua experiência" />

      <div className="px-6 space-y-6">
        {/* User Profile */}
        <section className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-engenha-gradient rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">{userInfo.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{userInfo.name}</h3>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
              <p className="text-sm text-gray-500">{userInfo.university} • {userInfo.course}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Plano {userInfo.plan}</p>
              <p className="text-sm text-gray-500">Upgrade para mais recursos</p>
            </div>
            <button 
              onClick={() => setActiveComponent('upgrade')}
              className="bg-engenha-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Upgrade
            </button>
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
                } else if (item.action) {
                  item.action();
                }
              }}
              className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <item.icon className="text-engenha-blue" size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </button>
          ))}
        </section>

        {/* Additional Options */}
        <section className="space-y-3">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">Sobre o Aplicativo</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Versão 1.0.0</p>
              <p>ENGENHA+ © 2024</p>
            </div>
          </div>

          <button className="w-full bg-red-50 border border-red-200 p-4 rounded-xl hover:bg-red-100 transition-colors">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <LogOut size={20} />
              <span className="font-medium">Sair da Conta</span>
            </div>
          </button>
        </section>
      </div>

      <Navigation />
    </div>
  );
};

export default Configuracoes;
