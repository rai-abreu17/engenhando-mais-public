import React, { useState, ReactNode, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, School, BookOpen, Mail, Lock } from 'lucide-react';

interface SocialButton {
  name: string;
  icon: ReactNode;
  color: string;
}

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showUniversityList, setShowUniversityList] = useState(false);
  const [showCourseList, setShowCourseList] = useState(false);
  const [universitySearch, setUniversitySearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    university: '',
    course: ''
  });
  const navigate = useNavigate();
  const universityRef = useRef<HTMLDivElement>(null);
  const courseRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    'Universidade Federal Rural do Rio de Janeiro (UFRRJ)',
    'Instituto Tecnológico de Aeronáutica (ITA)',
    'Instituto Militar de Engenharia (IME)',
    'Centro Federal de Educação Tecnológica de Minas Gerais (CEFET-MG)',
    'Universidade Tecnológica Federal do Paraná (UTFPR)',
    'Faculdade de Tecnologia de São Paulo (FATEC)',
    'Universidade Nove de Julho (UNINOVE)',
    'Universidade Paulista (UNIP)',
    'Universidade Anhembi Morumbi',
    'Universidade São Judas Tadeu',
    'Centro Universitário FEI',
    'Universidade Federal do Maranhão (UFMA)',
    'Universidade Federal do Piauí (UFPI)',
    'Universidade Federal de Alagoas (UFAL)',
    'Universidade Federal de Sergipe (UFS)',
    'Universidade Federal do Espírito Santo (UFES)',
    'Universidade Federal de Mato Grosso (UFMT)',
    'Universidade Federal de Mato Grosso do Sul (UFMS)',
    'Universidade Federal de Rondônia (UNIR)',
    'Universidade Federal do Acre (UFAC)',
    'Universidade Federal de Roraima (UFRR)',
    'Universidade Federal do Amapá (UNIFAP)',
    'Universidade Federal do Tocantins (UFT)',
    'Universidade Estadual Paulista (UNESP)',
    'Universidade Estadual de Londrina (UEL)',
    'Universidade Estadual de Maringá (UEM)'
  ];

  const filteredUniversities = universities.filter(uni =>
    uni.toLowerCase().includes(universitySearch.toLowerCase())
  );

  // Lista de cursos
  const courses = [
    // Cursos Básicos/Interdisciplinares
    'Bacharelado em Ciências e Tecnologia (BCT)',
    
    // Engenharias Clássicas
    'Engenharia Civil',
    'Engenharia Mecânica',
    'Engenharia Elétrica',
    'Engenharia Eletrônica',
    'Engenharia da Computação',
    'Engenharia Química',
    
    // Engenharias Especializadas
    'Engenharia Aeronáutica',
    'Engenharia Aeroespacial',
    'Engenharia Agrícola',
    'Engenharia Agroindustrial',
    'Engenharia de Agronegócio',
    'Engenharia de Alimentos',
    'Engenharia Ambiental',
    'Engenharia Ambiental e Sanitária',
    'Engenharia de Automação',
    'Engenharia de Controle e Automação',
    'Engenharia Automotiva',
    'Engenharia Biomédica',
    'Engenharia de Bioprocessos',
    'Engenharia de Biotecnologia',
    'Engenharia Cartográfica e de Agrimensura',
    'Engenharia de Energia',
    'Engenharia Física',
    'Engenharia Florestal',
    'Engenharia Geológica',
    'Engenharia Hídrica',
    'Engenharia de Recursos Hídricos',
    'Engenharia Industrial',
    'Engenharia da Informação',
    'Engenharia de Materiais',
    'Engenharia Mecânica-Aeronáutica',
    'Engenharia Mecatrônica',
    'Engenharia Metalúrgica',
    'Engenharia de Minas',
    'Engenharia Naval e Oceânica',
    'Engenharia de Petróleo e Gás',
    'Engenharia de Pesca',
    'Engenharia de Produção',
    'Engenharia Robótica',
    'Engenharia de Segurança do Trabalho',
    'Engenharia de Software',
    'Engenharia de Telecomunicações',
    'Engenharia Têxtil',
    'Engenharia de Transportes',
    
    // Outros Cursos Relacionados
    'Arquitetura e Urbanismo',
    'Ciência da Computação',
    'Sistemas de Informação',
    'Análise e Desenvolvimento de Sistemas',
    'Matemática',
    'Física',
    'Química',
    'Curso Superior de Tecnologia',
    'Curso Técnico',
    'Outros'
  ];

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUniversitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUniversitySearch(value);
    setFormData({ ...formData, university: value });
    setShowUniversityList(true);
  };

  const selectUniversity = (university: string) => {
    // Se selecionou "Não tenho universidade", limpar o curso também
    if (university === 'Não tenho universidade') {
      setFormData({ ...formData, university, course: '' });
      setCourseSearch('');
    } else {
      setFormData({ ...formData, university });
    }
    setUniversitySearch(university);
    setShowUniversityList(false);
  };

  const handleCourseSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCourseSearch(value);
    setFormData({ ...formData, course: value });
    setShowCourseList(true);
  };

  const selectCourse = (course: string) => {
    setFormData({ ...formData, course });
    setCourseSearch(course);
    setShowCourseList(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasNoUniversity = formData.university === 'Não tenho universidade';
    
    // Validação adicional
    if (!formData.fullName || !formData.email || !formData.password || 
        !formData.confirmPassword || !formData.university || 
        (!hasNoUniversity && !formData.course)) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    
    console.log('SignUp submitted:', formData);
    localStorage.setItem('engenha_token', 'mock-token-student');
    localStorage.setItem('engenha_user_type', 'student');
    navigate('/home');
  };

  // Função para verificar se todos os campos estão preenchidos
  const isFormValid = () => {
    const hasNoUniversity = formData.university === 'Não tenho universidade';
    
    return formData.fullName && 
           formData.email && 
           formData.password && 
           formData.confirmPassword && 
           formData.university && 
           (hasNoUniversity || formData.course) && // Se não tem universidade, não precisa de curso
           formData.password === formData.confirmPassword;
  };

  const socialButtons: SocialButton[] = [
    { name: 'Google', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>, color: 'bg-white border border-gray-300' },
    { name: 'Apple', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.05 12.04c-.03-2.98 2.43-4.4 2.55-4.46-1.38-2.03-3.55-2.31-4.32-2.35-1.84-.19-3.58 1.08-4.52 1.08-.93 0-2.38-1.05-3.91-1.03-2.01.04-3.86 1.17-4.9 2.97-2.08 3.61-.53 8.97 1.5 11.9 1 1.43 2.18 3.05 3.73 3 1.5-.06 2.07-.97 3.88-.97 1.82 0 2.33.97 3.92.94 1.61-.03 2.64-1.47 3.64-2.91 1.14-1.68 1.62-3.29 1.64-3.36-.03-.02-3.15-1.2-3.18-4.79z" fill="black"/><path d="M14.44 3.96c.83-1 1.39-2.39 1.24-3.76-1.19.05-2.63.79-3.48 1.79-.76.88-1.44 2.29-1.25 3.65 1.33.1 2.66-.68 3.49-1.68z" fill="black"/></svg>, color: 'bg-white border border-gray-300' },
    { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>, color: 'bg-white border border-gray-300' }
  ];

  return (
    <>
      <h1 className="text-white text-2xl font-semibold mb-8">
        Crie sua conta no ENGENHA+
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#96CCDB]" size={20} />
          <input
            type="text"
            name="fullName"
            placeholder="DIGITE SEU NOME COMPLETO"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full bg-white/20 border border-[#96CCDB] rounded-lg pl-12 pr-4 py-3 text-[#B5FDFF] placeholder-[#96CCDB] focus:outline-none focus:ring-2 focus:ring-[#96CCDB]"
            required
          />
        </div>

        <div className="relative" ref={universityRef}>
          <School className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#96CCDB]" size={20} />
          <input
            type="text"
            name="university"
            placeholder="BUSQUE SUA UNIVERSIDADE"
            value={universitySearch}
            onChange={handleUniversitySearch}
            onFocus={() => setShowUniversityList(true)}
            className="w-full bg-white/20 border border-[#96CCDB] rounded-lg pl-12 pr-4 py-3 text-[#B5FDFF] placeholder-[#96CCDB] focus:outline-none focus:ring-2 focus:ring-[#96CCDB]"
            required
            autoComplete="off"
          />
          {showUniversityList && (
            <div className="absolute top-full left-0 right-0 bg-white border border-[#96CCDB] rounded-lg mt-1 max-h-48 overflow-y-auto z-50 shadow-lg">
              {filteredUniversities.slice(0, 10).map((university, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectUniversity(university)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-800 text-sm ${
                    university === 'Não tenho universidade' ? 'border-b border-gray-200 font-medium text-gray-600' : ''
                  }`}
                >
                  {university}
                </button>
              ))}
              {filteredUniversities.length > 10 && (
                <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
                  Mostrando primeiros 10 resultados. Continue digitando para refinar.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={courseRef}>
          <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-sky-blue" size={20} />
          <input
            type="text"
            name="course"
            placeholder={formData.university === 'Não tenho universidade' ? 'CURSO NÃO APLICÁVEL' : 'BUSQUE SEU CURSO'}
            value={courseSearch}
            onChange={handleCourseSearch}
            onFocus={() => setShowCourseList(true)}
            disabled={formData.university === 'Não tenho universidade'}
            className={`w-full bg-white/20 border border-engenha-sky-blue rounded-lg pl-12 pr-4 py-3 text-engenha-light-blue placeholder-engenha-sky-blue focus:outline-none focus:ring-2 focus:ring-engenha-sky-blue ${
              formData.university === 'Não tenho universidade' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            required={formData.university !== 'Não tenho universidade'}
            autoComplete="off"
          />
          {formData.university === 'Não tenho universidade' && (
            <p className="text-engenha-sky-blue text-xs mt-1">
              * Como você não possui universidade, o campo de curso não é necessário.
            </p>
          )}
          {showCourseList && formData.university !== 'Não tenho universidade' && (
            <div className="absolute top-full left-0 right-0 bg-white border border-engenha-sky-blue rounded-lg mt-1 max-h-48 overflow-y-auto z-50 shadow-lg">
              {filteredCourses.slice(0, 8).map((course, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectCourse(course)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-800 text-sm"
                >
                  {course}
                </button>
              ))}
              {filteredCourses.length > 8 && (
                <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
                  Mostrando primeiros 8 resultados. Continue digitando para refinar.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-sky-blue" size={20} />
          <input
            type="email"
            name="email"
            placeholder="DIGITE SEU EMAIL"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-white/20 border border-engenha-sky-blue rounded-lg pl-12 pr-4 py-3 text-engenha-light-blue placeholder-engenha-sky-blue focus:outline-none focus:ring-2 focus:ring-engenha-sky-blue"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-engenha-sky-blue" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="DIGITE SUA SENHA"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-white/20 border border-engenha-sky-blue rounded-lg pl-12 pr-12 py-3 text-engenha-light-blue placeholder-engenha-sky-blue focus:outline-none focus:ring-2 focus:ring-engenha-sky-blue"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#96CCDB]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#96CCDB]" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="CONFIRME SUA SENHA"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full bg-white/20 border border-engenha-sky-blue rounded-lg pl-12 pr-4 py-3 text-engenha-light-blue placeholder-engenha-sky-blue focus:outline-none focus:ring-2 focus:ring-engenha-sky-blue"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className="w-full bg-engenha-orange hover:bg-engenha-dark-orange disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
        >
          CADASTRE-SE
        </button>
      </form>

      <button
        onClick={onSwitchToLogin}
        className="text-engenha-light-cream text-sm underline mt-4"
      >
        Já tem uma conta? Entre aqui!
      </button>

      {/* Social Login */}
      <div className="mt-8 w-full max-w-sm">
        <div className="flex items-center mb-4">
          <div className="flex-1 h-px bg-engenha-sky-blue"></div>
          <span className="px-4 text-engenha-light-cream text-sm">
            CADASTRE-SE COM
          </span>
          <div className="flex-1 h-px bg-engenha-sky-blue"></div>
        </div>

        <div className="flex justify-center space-x-4">
          {socialButtons.map((social) => (
            <button
              key={social.name}
              className={`${social.color} w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all`}
              aria-label={`Cadastrar com ${social.name}`}
            >
              {social.icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
