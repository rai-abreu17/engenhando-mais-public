import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, User, Bell, Smartphone, HelpCircle, LogOut, Building, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const Configuracoes = () => {
  const navigate = useNavigate();
  
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

  // Estados para os campos de busca
  const [universitySearch, setUniversitySearch] = useState('UFMG');
  const [courseSearch, setCourseSearch] = useState('Engenharia Civil');
  const [showUniversityList, setShowUniversityList] = useState(false);
  const [showCourseList, setShowCourseList] = useState(false);
  
  // Estados para os campos do formulário de perfil
  const [profileForm, setProfileForm] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com'
  });
  
  // Estado para controle de validação
  const [showValidation, setShowValidation] = useState(false);
  
  // Refs para controle dos dropdowns
  const universityRef = useRef<HTMLDivElement>(null);
  const courseRef = useRef<HTMLDivElement>(null);

  // Lista de universidades brasileiras
  const universities = [
    'Não tenho universidade',
    'Universidade de São Paulo (USP)',
    'Universidade Estadual de Campinas (UNICAMP)',
    'Universidade Federal do Rio de Janeiro (UFRJ)',
    'Universidade Federal de Minas Gerais (UFMG)',
    'Universidade Federal do Rio Grande do Sul (UFRGS)',
    'Universidade Federal de São Paulo (UNIFESP)',
    'Universidade Federal de Santa Catarina (UFSC)',
    'Universidade Federal do Paraná (UFPR)',
    'Universidade Federal da Bahia (UFBA)',
    'Universidade Federal de Pernambuco (UFPE)',
    'Universidade Federal do Ceará (UFC)',
    'Universidade Federal Fluminense (UFF)',
    'Universidade Federal de Goiás (UFG)',
    'Universidade Federal do Pará (UFPA)',
    'Universidade de Brasília (UnB)',
    'Pontifícia Universidade Católica do Rio de Janeiro (PUC-Rio)',
    'Pontifícia Universidade Católica de São Paulo (PUC-SP)',
    'Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)',
    'Universidade Presbiteriana Mackenzie',
    'Universidade Federal de São Carlos (UFSCar)',
    'Universidade Federal do ABC (UFABC)',
    'Universidade Federal de Viçosa (UFV)',
    'Universidade Federal de Lavras (UFLA)',
    'Instituto Tecnológico de Aeronáutica (ITA)',
    'Instituto Militar de Engenharia (IME)',
    'Centro Federal de Educação Tecnológica de Minas Gerais (CEFET-MG)',
    'Universidade Tecnológica Federal do Paraná (UTFPR)',
    'Universidade Estadual Paulista (UNESP)',
    'Universidade Estadual de Londrina (UEL)',
    'Universidade Estadual de Maringá (UEM)'
  ];

  // Lista de cursos
  const courses = [
    'Bacharelado em Ciências e Tecnologia (BCT)',
    'Engenharia Civil',
    'Engenharia Mecânica',
    'Engenharia Elétrica',
    'Engenharia Eletrônica',
    'Engenharia da Computação',
    'Engenharia Química',
    'Engenharia Aeronáutica',
    'Engenharia Aeroespacial',
    'Engenharia Agrícola',
    'Engenharia de Alimentos',
    'Engenharia Ambiental',
    'Engenharia de Automação',
    'Engenharia de Controle e Automação',
    'Engenharia Automotiva',
    'Engenharia Biomédica',
    'Engenharia de Bioprocessos',
    'Engenharia de Biotecnologia',
    'Engenharia de Energia',
    'Engenharia Física',
    'Engenharia Florestal',
    'Engenharia Geológica',
    'Engenharia Industrial',
    'Engenharia da Informação',
    'Engenharia de Materiais',
    'Engenharia Mecatrônica',
    'Engenharia Metalúrgica',
    'Engenharia de Minas',
    'Engenharia Naval e Oceânica',
    'Engenharia Nuclear',
    'Engenharia de Petróleo',
    'Engenharia de Produção',
    'Engenharia de Software',
    'Engenharia de Telecomunicações',
    'Engenharia Têxtil'
  ];

  const filteredUniversities = universities.filter(uni =>
    uni.toLowerCase().includes(universitySearch.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (universityRef.current && !universityRef.current.contains(event.target as Node)) {
        setShowUniversityList(false);
      }
      if (courseRef.current && !courseRef.current.contains(event.target as Node)) {
        setShowCourseList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Limpar todos os dados do localStorage relacionados à autenticação
    localStorage.removeItem('engenha_token');
    localStorage.removeItem('selectedMascot');
    localStorage.removeItem('unlockedMascots');
    localStorage.removeItem('customMascotNames');
    
    // Redirecionar para a página de login
    navigate('/login');
  };

  const handleUniversitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUniversitySearch(value);
    setShowUniversityList(true);
  };

  const selectUniversity = (university: string) => {
    setUniversitySearch(university);
    setShowUniversityList(false);
  };

  const handleCourseSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCourseSearch(value);
    setShowCourseList(true);
  };

  const selectCourse = (course: string) => {
    setCourseSearch(course);
    setShowCourseList(false);
  };

  // Função para validar campos obrigatórios
  const validateForm = useCallback(() => {
    const nameValid = profileForm.name.trim() !== '';
    const emailValid = profileForm.email.trim() !== '' && profileForm.email.includes('@');
    const universityValid = universitySearch.trim() !== '';
    const courseValid = universitySearch === 'Não tenho universidade' || courseSearch.trim() !== '';
    
    return nameValid && emailValid && universityValid && courseValid;
  }, [profileForm.name, profileForm.email, universitySearch, courseSearch]);

  // Função para verificar se um campo específico é válido
  const isFieldValid = useCallback((fieldName: string) => {
    switch (fieldName) {
      case 'name':
        return profileForm.name.trim() !== '';
      case 'email':
        return profileForm.email.trim() !== '' && profileForm.email.includes('@');
      case 'university':
        return universitySearch.trim() !== '';
      case 'course':
        return universitySearch === 'Não tenho universidade' || courseSearch.trim() !== '';
      default:
        return true;
    }
  }, [profileForm.name, profileForm.email, universitySearch, courseSearch]);

  // Função para verificar se deve mostrar erro de um campo específico
  const shouldShowFieldError = useCallback((fieldName: string) => {
    if (!showValidation) return false;
    return !isFieldValid(fieldName);
  }, [showValidation, isFieldValid]);

  // Memorizar o estado do botão
  const isFormValid = useMemo(() => validateForm(), [validateForm]);

  // Função para salvar alterações
  const handleSaveChanges = useCallback(() => {
    setShowValidation(true);
    
    if (validateForm()) {
      // Aqui você salvaria os dados (API call, localStorage, etc.)
      alert('Alterações salvas com sucesso!');
      setShowValidation(false);
    }
  }, [validateForm]);

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

  // Utilizando React.memo para evitar re-renderizações desnecessárias
  const ProfileSettings = React.memo(() => {
    // Estado local para validação apenas quando o botão é clicado
    const [localValidation, setLocalValidation] = useState(false);
    
    // Estados locais para o formulário
    const [localName, setLocalName] = useState(profileForm.name);
    const [localEmail, setLocalEmail] = useState(profileForm.email);
    const [localUniversity, setLocalUniversity] = useState(universitySearch);
    const [localCourse, setLocalCourse] = useState(courseSearch);
    const [showLocalUnivList, setShowLocalUnivList] = useState(false);
    const [showLocalCourseList, setShowLocalCourseList] = useState(false);
    
    // Funções de validação locais
    const isLocalValid = (field: string) => {
      if (!localValidation) return true;
      
      switch (field) {
        case 'name':
          return localName.trim() !== '';
        case 'email':
          return localEmail.trim() !== '' && localEmail.includes('@');
        case 'university':
          return localUniversity.trim() !== '';
        case 'course':
          return localUniversity === 'Não tenho universidade' || localCourse.trim() !== '';
        default:
          return true;
      }
    };
    
    const isFormLocalValid = 
      localName.trim() !== '' && 
      localEmail.trim() !== '' && 
      localEmail.includes('@') && 
      localUniversity.trim() !== '' && 
      (localUniversity === 'Não tenho universidade' || localCourse.trim() !== '');
    
    // Função para salvar mudanças
    const handleLocalSave = () => {
      setLocalValidation(true);
      
      if (isFormLocalValid) {
        setProfileForm({
          name: localName,
          email: localEmail
        });
        setUniversitySearch(localUniversity);
        setCourseSearch(localCourse);
        alert('Alterações salvas com sucesso!');
        setLocalValidation(false);
      }
    };
    
    // Filtragens locais
    const localFilteredUniversities = universities.filter(uni =>
      uni.toLowerCase().includes(localUniversity.toLowerCase())
    );
    
    const localFilteredCourses = courses.filter(course =>
      course.toLowerCase().includes(localCourse.toLowerCase())
    );
    
    // Refs locais
    const localUnivRef = useRef<HTMLDivElement>(null);
    const localCourseRef = useRef<HTMLDivElement>(null);
    
    // Efeito para clicar fora
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (localUnivRef.current && !localUnivRef.current.contains(event.target as Node)) {
          setShowLocalUnivList(false);
        }
        if (localCourseRef.current && !localCourseRef.current.contains(event.target as Node)) {
          setShowLocalCourseList(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    return (
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
        
        <div className="bg-engenha-light-cream p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-blue ${
                !isLocalValid('name') ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Digite seu nome completo"
            />
            {!isLocalValid('name') && (
              <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-blue ${
                !isLocalValid('email') ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Digite seu email"
            />
            {!isLocalValid('email') && (
              <p className="text-red-500 text-xs mt-1">Email válido é obrigatório</p>
            )}
          </div>
          
          <div className="relative" ref={localUnivRef}>
            <label className="block text-sm font-medium text-engenha-dark-navy mb-1">
              Universidade <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-engenha-sky-blue" size={20} />
              <input
                type="text"
                placeholder="BUSQUE SUA UNIVERSIDADE"
                value={localUniversity}
                onChange={(e) => {
                  setLocalUniversity(e.target.value);
                  setShowLocalUnivList(true);
                }}
                onFocus={() => setShowLocalUnivList(true)}
                className={`w-full border rounded-lg pl-11 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-orange text-engenha-dark-navy ${
                  !isLocalValid('university') ? 'border-red-500' : 'border-engenha-sky-blue'
                }`}
                autoComplete="off"
              />
            </div>
            {!isLocalValid('university') && (
              <p className="text-red-500 text-xs mt-1">Universidade é obrigatória</p>
            )}
            {showLocalUnivList && (
              <div className="absolute top-full left-0 right-0 bg-white border border-engenha-sky-blue rounded-lg mt-1 max-h-48 overflow-y-auto z-50 shadow-lg">
                {localFilteredUniversities.slice(0, 10).map((university, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setLocalUniversity(university);
                      setShowLocalUnivList(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-engenha-light-blue focus:bg-engenha-light-blue focus:outline-none text-engenha-dark-navy text-sm ${
                      university === 'Não tenho universidade' ? 'border-b border-gray-200 font-medium text-gray-600' : ''
                    }`}
                  >
                    {university}
                  </button>
                ))}
                {localFilteredUniversities.length > 10 && (
                  <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
                    Mostrando primeiros 10 resultados. Continue digitando para refinar.
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="relative" ref={localCourseRef}>
            <label className="block text-sm font-medium text-engenha-dark-navy mb-1">
              Curso {localUniversity !== 'Não tenho universidade' && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-engenha-sky-blue" size={20} />
              <input
                type="text"
                placeholder={localUniversity === 'Não tenho universidade' ? 'CURSO NÃO APLICÁVEL' : 'BUSQUE SEU CURSO'}
                value={localCourse}
                onChange={(e) => {
                  setLocalCourse(e.target.value);
                  setShowLocalCourseList(true);
                }}
                onFocus={() => setShowLocalCourseList(true)}
                disabled={localUniversity === 'Não tenho universidade'}
                className={`w-full border rounded-lg pl-11 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-engenha-orange text-engenha-dark-navy ${
                  localUniversity === 'Não tenho universidade' ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                } ${
                  !isLocalValid('course') ? 'border-red-500' : 'border-engenha-sky-blue'
                }`}
                autoComplete="off"
              />
            </div>
            {localUniversity === 'Não tenho universidade' && (
              <p className="text-engenha-sky-blue text-xs mt-1">
                * Como você não possui universidade, o campo de curso não é necessário.
              </p>
            )}
            {!isLocalValid('course') && localUniversity !== 'Não tenho universidade' && (
              <p className="text-red-500 text-xs mt-1">Curso é obrigatório</p>
            )}
            {showLocalCourseList && localUniversity !== 'Não tenho universidade' && (
              <div className="absolute top-full left-0 right-0 bg-white border border-engenha-sky-blue rounded-lg mt-1 max-h-48 overflow-y-auto z-50 shadow-lg">
                {localFilteredCourses.slice(0, 8).map((course, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setLocalCourse(course);
                      setShowLocalCourseList(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-engenha-light-blue focus:bg-engenha-light-blue focus:outline-none text-engenha-dark-navy text-sm"
                  >
                    {course}
                  </button>
                ))}
                {localFilteredCourses.length > 8 && (
                  <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
                    Mostrando primeiros 8 resultados. Continue digitando para refinar.
                  </div>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={handleLocalSave}
            disabled={!isFormLocalValid}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              isFormLocalValid
                ? 'bg-engenha-orange text-white hover:bg-engenha-dark-orange' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    );
  });

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
        <div className="bg-gradient-to-r from-engenha-blue to-engenha-bright-blue p-4 rounded-lg text-white">
          <h4 className="font-bold text-lg mb-2">Plano Estudante</h4>
          <p className="text-engenha-light-cream opacity-80 text-sm mb-3">Ideal para estudantes universitários</p>
          <div className="text-2xl font-bold mb-3">R$ 19,90/mês</div>
          <ul className="text-sm space-y-1 mb-4">
            <li>✓ Acesso a todas as videoaulas</li>
            <li>✓ Download para assistir offline</li>
            <li>✓ Exercícios ilimitados</li>
            <li>✓ Suporte prioritário</li>
          </ul>
          <button className="w-full bg-engenha-light-cream text-engenha-blue py-2 rounded-lg font-medium hover:bg-engenha-light-blue transition-colors">
            Assinar Agora
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-engenha-orange to-engenha-dark-orange p-4 rounded-lg text-white">
          <h4 className="font-bold text-lg mb-2">Plano Premium</h4>
          <p className="text-engenha-light-cream opacity-80 text-sm mb-3">Para quem quer o máximo de recursos</p>
          <div className="text-2xl font-bold mb-3">R$ 39,90/mês</div>
          <ul className="text-sm space-y-1 mb-4">
            <li>✓ Tudo do Plano Estudante</li>
            <li>✓ Mentoria individual</li>
            <li>✓ Simulados exclusivos</li>
            <li>✓ Certificados de conclusão</li>
            <li>✓ Acesso antecipado a novos conteúdos</li>
          </ul>
          <button className="w-full bg-engenha-light-cream text-engenha-orange py-2 rounded-lg font-medium hover:bg-engenha-light-blue transition-colors">
            Assinar Agora
          </button>
        </div>
        
        <div className="bg-engenha-light-blue p-4 rounded-lg">
          <h4 className="font-bold text-lg mb-2 text-engenha-dark-navy">Plano Gratuito</h4>
          <p className="text-engenha-dark-navy opacity-70 text-sm mb-3">Seu plano atual</p>
          <ul className="text-sm space-y-1 text-engenha-dark-navy">
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
        <div key={key} className="flex items-center justify-between bg-engenha-light-cream p-4 rounded-lg">
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
              value ? 'bg-engenha-blue' : 'bg-engenha-light-blue'
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
      <div className="min-h-screen bg-engenha-light-blue pb-20">
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
      <div className="min-h-screen bg-engenha-light-blue pb-20">
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
      <div className="min-h-screen bg-engenha-light-blue pb-20">
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
      <div className="min-h-screen bg-engenha-light-blue pb-20">
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
      <div className="min-h-screen bg-engenha-light-blue pb-20">
        <Header title="Configurações" />
        <div className="px-6">
          <StudySettings />
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-engenha-light-blue pb-20">
      <Header title="Configurações" subtitle="Personalize sua experiência" />

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
              <p className="text-sm text-engenha-dark-navy opacity-70">{userInfo.university} • {userInfo.course}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-engenha-light-blue rounded-lg">
            <div>
              <p className="font-medium text-engenha-dark-navy">Plano {userInfo.plan}</p>
              <p className="text-sm text-engenha-dark-navy opacity-70">Upgrade para mais recursos</p>
            </div>
            <button 
              onClick={() => setActiveComponent('upgrade')}
              className="bg-engenha-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-engenha-dark-orange transition-colors"
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

      <Navigation />
    </div>
  );
};

export default Configuracoes;
