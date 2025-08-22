import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, Maximize, Settings, ChevronDown, ChevronRight, CheckCircle, Circle, Bot, Menu, X, ArrowLeft, MoreVertical, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { AIChat } from '@/components/video/AIChat';
import { QuestionModal, ErrorReasonModal, SuccessModal, RewatchModal } from '@/components/video/QuestionModal';
import { StudentRating } from '@/components/video/StudentRating';
import { VideoPlayer } from '@/components/video/VideoPlayer';

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  watchTime: number;
  totalTime: number;
}

interface Section {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'text' | 'quiz';
  }[];
}

const mockCourseData: Section[] = [
  {
    id: '1',
    title: 'Seção 1: Introdução e Fundamentos',
    lessons: [
      { id: 'X0OZt35ASgU', title: 'Aula Inaugural - O que estudaremos neste Curso', duration: '6:32', type: 'video' },
      { id: 'j5i6XlfwxeA', title: 'Conjuntos e Operações com Conjuntos', duration: '16:42', type: 'video' },
      { id: '7GLGVQUkQC4', title: 'Números Reais e Intervalos', duration: '18:37', type: 'video' },
      { id: 'dMdpOoSnu2I', title: 'Operações com Frações e Dicas', duration: '11:15', type: 'video' },
      { id: '91sLDPJRdhk', title: 'Racionalização e Simplificação de Raízes', duration: '11:43', type: 'video' },
      { id: '2D_rTqUfuLQ', title: 'Polinômios', duration: '16:52', type: 'video' },
      { id: '0Zhx5MnJWmc', title: 'Divisão de polinômios', duration: '19:27', type: 'video' },
      { id: '-0eq7qMgOqc', title: 'Fatoração de polinômios', duration: '18:31', type: 'video' }
    ]
  },
  {
    id: '2',
    title: 'Seção 2: Funções e Equações',
    lessons: [
      { id: 'TwntXlUBr1I', title: 'Expressões Fracionárias', duration: '15:32', type: 'video' },
      { id: 'AClRmo2iH5o', title: 'Conceitos Iniciais de Funções', duration: '16:25', type: 'video' },
      { id: 'nIlfIo3jz3o', title: 'Funções Potência e Polinomiais', duration: '13:12', type: 'video' },
      { id: 'lt9zW3YuTj0', title: 'Função Polinomial do 1° Grau (Função Afim)', duration: '25:27', type: 'video' },
      { id: '9Kn_e_WjxPE', title: 'Equações e Inequações do 1º Grau', duration: '20:36', type: 'video' },
      { id: 'bc_-20DGUzs', title: 'Função Polinomial do 2º Grau', duration: '16:16', type: 'video' },
      { id: 'YnYhNKsrK9o', title: 'Equação e Inequação do Segundo Grau', duration: '21:03', type: 'video' },
      { id: 'MSUreYH2bDE', title: 'Função Exponencial', duration: '17:54', type: 'video' }
    ]
  },
  {
    id: '3',
    title: 'Seção 3: Tópicos Avançados',
    lessons: [
      { id: '-bAwwBI9eOQ', title: 'Equações e Inequações Exponenciais', duration: '18:18', type: 'video' },
      { id: 'sQxf9oJ87QI', title: 'Problemas Envolvendo Funções Exponenciais', duration: '14:02', type: 'video' },
      { id: 'nPE5TXdqug0', title: 'Logaritmo', duration: '19:38', type: 'video' },
      { id: 'CbQ0qgxId8k', title: 'Função Logarítmica', duration: '12:25', type: 'video' },
      { id: 'Wl6P-LQxK20', title: 'Equações e Inequações Logarítmicas', duration: '14:07', type: 'video' },
      { id: 'rJHLsAxfmxk', title: 'Inequações Fracionárias (ou Quociente)', duration: '13:10', type: 'video' },
      { id: 'ANcLc07mIAg', title: 'Trigonometria - Conceitos Básicos', duration: '18:34', type: 'video' },
      { id: 'ZBp-bSioul0', title: 'Introdução às Funções Trigonométricas', duration: '22:45', type: 'video' }
    ]
  },
  {
    id: '4',
    title: 'Seção 4: Aprofundamento e Finalização',
    lessons: [
      { id: 'AC3znUH68Wc', title: 'Gráficos das Funções Seno e Cosseno e Variações', duration: '15:03', type: 'video' },
      { id: 'UWweMHaNHB4', title: 'Outras Funções Trigonométricas', duration: '11:47', type: 'video' },
      { id: 'tkWwODF9-_M', title: 'Função Modular', duration: '14:29', type: 'video' },
      { id: 'cluldRX1TOc', title: 'Equação e Inequação Modular', duration: '17:36', type: 'video' },
      { id: '9oYmJv1G4WA', title: 'Funções Inversas e Compostas', duration: '16:54', type: 'video' },
      { id: 'ZsP3vV3W3ls', title: 'Uma Conversa Sobre Infinito (Aula de Encerramento)', duration: '17:21', type: 'video' },
      { id: 'LWrmVePfuTY', title: 'Live de Pré-Cálculo - Revisão e Dúvidas', duration: '58:07', type: 'video' }
    ]
  }
];

// Dados padrão das perguntas do vídeo
const defaultVideoQuestions = [
  {
    id: 'q1',
    time: 45, // 45 segundos
    question: 'O que significa o termo "pré-cálculo"?',
    options: [
      'Uma forma de evitar estudar cálculo',
      'Tópicos matemáticos essenciais para o estudo do cálculo',
      'Um método alternativo ao cálculo diferencial',
      'Cálculos realizados por computadores'
    ],
    correctAnswer: 1,
    explanation: 'Pré-cálculo compreende os tópicos matemáticos fundamentais necessários para o estudo do cálculo, como funções, trigonometria, e álgebra avançada.'
  },
  {
    id: 'q2',
    time: 120, // 2 minutos
    question: 'Qual destes tópicos é fundamental no pré-cálculo?',
    options: [
      'Programação linear',
      'Funções e suas propriedades',
      'Teoria dos conjuntos avançada',
      'Estatística descritiva'
    ],
    correctAnswer: 1,
    explanation: 'O estudo de funções e suas propriedades é central no pré-cálculo, pois forma a base para entender os conceitos de limite, derivada e integral no cálculo.'
  },
  {
    id: 'q3',
    time: 240, // 4 minutos
    question: 'Por que o estudo das funções trigonométricas é importante no pré-cálculo?',
    options: [
      'Apenas por tradição acadêmica',
      'São raramente usadas em cálculo',
      'São fundamentais para modelar fenômenos periódicos',
      'São úteis apenas para engenheiros civis'
    ],
    correctAnswer: 2,
    explanation: 'Funções trigonométricas são essenciais para modelar fenômenos periódicos na natureza e engenharia, além de serem amplamente utilizadas em várias aplicações do cálculo diferencial e integral.'
  }
];

// Perguntas específicas para aula de Conjuntos
const conjuntosVideoQuestions = [
  {
    id: 'q1',
    time: 60, // 1 minuto
    question: 'Dados os conjuntos A = {1, 2, 3, 4}, B = {3, 4, 5, 6} e C = {1, 3, 5, 7}, qual o resultado de (A ∩ B) ∪ C?',
    options: [
      '{1, 3, 4, 5, 7}',
      '{1, 3, 5}',
      '{3, 4}',
      '{1, 3, 4, 5, 6, 7}'
    ],
    correctAnswer: 0,
    explanation: 'A ∩ B = {3, 4} e (A ∩ B) ∪ C = {3, 4} ∪ {1, 3, 5, 7} = {1, 3, 4, 5, 7}. A intersecção seleciona elementos comuns aos dois conjuntos, e a união combina todos os elementos sem repetição.'
  },
  {
    id: 'q2',
    time: 180, // 3 minutos
    question: 'Se U é o conjunto universo, A e B são subconjuntos de U, e A\' representa o complemento de A, qual destas expressões representa a Lei de De Morgan?',
    options: [
      '(A ∪ B)\' = A\' ∪ B\'',
      '(A ∪ B)\' = A\' ∩ B\'',
      '(A ∩ B)\' = A\' ∪ B\'',
      '(A ∩ B)\' = A\' ∩ B\''
    ],
    correctAnswer: 2,
    explanation: 'A Lei de De Morgan estabelece que o complemento da intersecção de dois conjuntos é igual à união dos complementos: (A ∩ B)\' = A\' ∪ B\'. De modo similar, (A ∪ B)\' = A\' ∩ B\'. Estas relações são fundamentais em lógica matemática e teoria dos conjuntos.'
  },
  {
    id: 'q3',
    time: 300, // 5 minutos
    question: 'Seja A = {x ∈ ℝ | x² < 9} e B = {x ∈ ℝ | -1 ≤ x < 4}. O conjunto A ∩ B pode ser representado como:',
    options: [
      '(-3, 3)',
      '[-1, 3)',
      '(-3, 4)',
      '[-1, 4)'
    ],
    correctAnswer: 1,
    explanation: 'A = {x ∈ ℝ | x² < 9} = {x ∈ ℝ | -3 < x < 3} e B = {x ∈ ℝ | -1 ≤ x < 4}. A intersecção seleciona valores que pertencem simultaneamente aos dois conjuntos, resultando em A ∩ B = [-1, 3). O intervalo começa fechado em -1 (incluído) e termina aberto em 3 (não incluído).'
  },
  {
    id: 'q4',
    time: 420, // 7 minutos
    question: 'Se A = {a, b, c, d}, B = {c, d, e, f} e C = {e, f, g, h}, qual o valor de |A × (B ∩ C)|?',
    options: [
      '0',
      '4',
      '8',
      '16'
    ],
    correctAnswer: 0,
    explanation: 'B ∩ C = {c, d, e, f} ∩ {e, f, g, h} = {e, f}. Como A = {a, b, c, d} e A × (B ∩ C) = A × {e, f}, se tivéssemos elementos comuns, o produto cartesiano teria cardinalidade |A| × |(B ∩ C)| = 4 × 2 = 8 pares ordenados. Porém, como B ∩ C = {e, f} e estes elementos não pertencem a A, então A × (B ∩ C) = ∅, logo |A × (B ∩ C)| = 0.'
  },
  {
    id: 'q5',
    time: 600, // 10 minutos
    question: 'Considere o conjunto das partes P(A) onde A = {1, 2, 3}. Quantos subconjuntos X ∈ P(A) satisfazem a condição X ∩ {1, 3} ≠ ∅?',
    options: [
      '3',
      '4',
      '6',
      '7'
    ],
    correctAnswer: 3,
    explanation: 'O conjunto das partes P(A) de A = {1, 2, 3} contém 2³ = 8 subconjuntos: ∅, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}. A condição X ∩ {1, 3} ≠ ∅ significa que X deve conter pelo menos um dos elementos 1 ou 3. Os conjuntos que satisfazem essa condição são: {1}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}, totalizando 7 subconjuntos. Apenas o conjunto vazio ∅ não satisfaz a condição.'
  }
];

export default function WatchLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  // Debug: log do lessonId
  console.log('WatchLesson - lessonId recebido:', lessonId);
  
  // Seleção dinâmica de perguntas com base no ID da lição
  const videoQuestions = lessonId === 'j5i6XlfwxeA' 
    ? conjuntosVideoQuestions // Perguntas específicas para aula de Conjuntos
    : defaultVideoQuestions; // Perguntas padrão para outras aulas
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutos exemplo
  const [expandedSections, setExpandedSections] = useState<string[]>(['1', '2', '3']);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useLocalStorage<LessonProgress[]>('course-progress', []);
  
  // Estados para funcionalidades novas
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRewatchModal, setShowRewatchModal] = useState(false);
  const [lastQuestionStar, setLastQuestionStar] = useState<number>(0);

  const currentLesson = mockCourseData
    .flatMap(section => section.lessons)
    .find(lesson => lesson.id === lessonId);

  const currentSection = mockCourseData.find(section => 
    section.lessons.some(lesson => lesson.id === lessonId)
  );

  useEffect(() => {
    console.log(`[WatchLesson] Nova lição carregada: ${lessonId}`);
    if (!currentLesson) {
      navigate('/');
      return;
    }

    // Reset time to start for the new lesson by default - SEMPRE
    console.log('[WatchLesson] Forçando currentTime = 0 para nova lição');
    setCurrentTime(0);

    // DESABILITANDO carregamento de progresso anterior 
    // Comentado para forçar sempre início em 0
    /*
    // Carregar progresso salvo (se existir)
    const savedProgress = progress.find(p => p.lessonId === lessonId);
    if (savedProgress) {
      setCurrentTime(savedProgress.watchTime);
    }
    */
  }, [lessonId, currentLesson, navigate]);

  useEffect(() => {
    // Salvar progresso a cada 5 segundos quando estiver reproduzindo
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = Math.min(prev + 1, duration);
        
        // Salvar progresso
        const newProgress = progress.filter(p => p.lessonId !== lessonId);
        newProgress.push({
          lessonId: lessonId!,
          completed: newTime >= duration * 0.9, // 90% assistido = completo
          watchTime: newTime,
          totalTime: duration
        });
        setProgress(newProgress);
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, lessonId, progress, setProgress]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const goToLesson = (newLessonId: string) => {
    console.log(`[WatchLesson] Navegando para nova lição: ${newLessonId}`);
    // Resetar o tempo atual antes de navegar
    setCurrentTime(0);
    navigate(`/watch/${newLessonId}`);
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.find(p => p.lessonId === lessonId)?.completed || false;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Se não tiver ID de lição na URL, redirecionar para a primeira lição
  useEffect(() => {
    console.log('WatchLesson useEffect - lessonId:', lessonId);
    if (!lessonId) {
      navigate('/watch/MZSq-H-PB5I');
    }
  }, [lessonId, navigate]);

  if (!currentLesson && lessonId) {
    return null;
  }

  // Componente de Sidebar para conteúdo do curso
  const CourseSidebarContent = () => (
    <div className="h-full flex flex-col bg-engenha-light-cream">
      {/* Header */}
      <div className="p-4 border-b border-engenha-sky-blue flex items-center justify-between bg-gradient-to-r from-engenha-bright-blue to-engenha-sky-blue text-white">
        <h3 className="font-semibold">Conteúdo do curso</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAIChat(true)}
          className="flex items-center gap-2 text-white hover:bg-white/20 border border-white/30"
        >
          <Bot className="h-4 w-4" />
          IA
        </Button>
      </div>


      {/* Course Sections */}
      <div className="flex-1 overflow-y-auto">
        {mockCourseData.map((section) => (
          <div key={section.id} className="border-b border-engenha-sky-blue/20">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-engenha-light-blue/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedSections.includes(section.id) ? (
                  <ChevronDown className="h-4 w-4 text-engenha-blue" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-engenha-blue" />
                )}
                <div className="text-left">
                  <p className="font-medium text-engenha-dark-navy">{section.title}</p>
                  <p className="text-sm text-engenha-blue">
                    {section.lessons.filter(l => isLessonCompleted(l.id)).length} / {section.lessons.length} |{' '}
                    {section.lessons.reduce((total, lesson) => {
                      const time = parseInt(lesson.duration);
                      return total + (isNaN(time) ? 0 : time);
                    }, 0)}m
                  </p>
                </div>
              </div>
            </button>

            {expandedSections.includes(section.id) && (
              <div className="pl-4">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => goToLesson(lesson.id)}
                    className={cn(
                      "w-full p-3 flex items-center gap-3 hover:bg-engenha-light-blue/70 transition-colors text-left rounded-lg mx-2 mb-1",
                      lesson.id === lessonId && "bg-engenha-bright-blue/10 border-l-4 border-engenha-bright-blue shadow-sm"
                    )}
                  >
                    {isLessonCompleted(lesson.id) ? (
                      <CheckCircle className="h-5 w-5 text-engenha-orange" />
                    ) : (
                      <Circle className="h-5 w-5 text-engenha-blue" />
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-engenha-dark-navy">{lesson.title}</p>
                      <div className="flex items-center gap-2 text-xs text-engenha-blue">
                        <span>{lesson.duration}</span>
                        {lesson.type === 'video' && <span>📹</span>}
                        {lesson.type === 'text' && <span>📄</span>}
                        {lesson.type === 'quiz' && <span>❓</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Funções para lidar com perguntas do vídeo
  const handleQuestionTriggered = (question: any) => {
    setCurrentQuestion(question);
    // Salvar posição da última estrela
    setLastQuestionStar(question.time);
  };

  const handleQuestionAnswer = (correct: boolean) => {
    if (correct) {
      setCurrentQuestion(null);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setIsPlaying(true);
      }, 2000);
    } else {
      setCurrentQuestion(null);
      setShowErrorModal(true);
    }
  };

  const handleRewatch = () => {
    setShowErrorModal(false);
    setShowRewatchModal(true);
  };

  const handleRewatchConfirm = () => {
    setShowRewatchModal(false);
    setCurrentTime(lastQuestionStar);
    setIsPlaying(true);
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    console.log('Avaliação enviada:', { rating, comment, lessonId });
    // Aqui você salvaria a avaliação no backend
  };

  const tabs = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'description', label: 'Descrição' },
    { id: 'qa', label: 'Q&A' },
    { id: 'notes', label: 'Anotações' },
    { id: 'reviews', label: 'Avaliações' },
  ];

  return (
    <div className="min-h-screen bg-engenha-light-blue font-['Inter',sans-serif]">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b border-engenha-sky-blue">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-engenha-dark-navy"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </Button>
        
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="engenha-outline" size="sm">
              <Menu className="h-5 w-5 mr-2" />
              Conteúdo
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-engenha-dark-navy">Conteúdo do Curso</SheetTitle>
            </SheetHeader>
            <CourseSidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-[calc(100vh)]">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Container */}
          <VideoPlayer
            videoId={lessonId || ''}
            title={currentLesson?.title || ''}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            questions={videoQuestions}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(time, videoDuration) => {
              setCurrentTime(time);
              if (videoDuration) {
                setDuration(videoDuration);
              }
            }}
            onQuestionTriggered={handleQuestionTriggered}
          />

          {/* Content Tabs and Details */}
          <div className="flex-1 bg-white">
            {/* Navigation Tabs */}
            <div className="border-b border-engenha-sky-blue/30 bg-white sticky top-0 z-10">
              <div className="flex gap-2 lg:gap-8 px-4 lg:px-6 py-3 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "whitespace-nowrap pb-3 px-2 text-sm font-medium transition-colors border-b-2",
                      activeTab === tab.id
                        ? "text-engenha-dark-navy border-engenha-bright-blue"
                        : "text-engenha-blue border-transparent hover:text-engenha-dark-navy"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 lg:p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Course Info Card */}
                  <Card className="bg-gradient-to-br from-engenha-light-blue to-white border-engenha-sky-blue/30 shadow-lg">
                    <div className="p-6">
                      <h1 className="text-xl lg:text-2xl font-bold mb-4 text-engenha-dark-navy">
                        Curso Completo de Pré-Cálculo
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-engenha-blue mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-engenha-gold text-lg">★</span>
                          <span className="font-semibold">4,8</span>
                          <span>(12.387 avaliações)</span>
                        </div>
                        <span>• 623.147 Visualizações</span>
                        <span>• 8,5 horas de conteúdo</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-engenha-orange/10 text-engenha-orange text-sm rounded-full font-medium">
                          Material complementar
                        </span>
                        <span className="px-3 py-1 bg-engenha-sky-blue/10 text-engenha-sky-blue text-sm rounded-full font-medium">
                          Preparatório para Cálculo I
                        </span>
                        <span className="px-3 py-1 bg-engenha-bright-blue/10 text-engenha-bright-blue text-sm rounded-full font-medium">
                          Professor Douglas Maioli
                        </span>
                      </div>

                      <p className="text-engenha-blue text-sm">
                        📚 Curso completo preparatório para a disciplina de Cálculo I • 🌐 Disponível em Português e Inglês
                      </p>
                    </div>
                  </Card>

                  {/* Learning Progress */}
                  <Card className="border-engenha-sky-blue/20">
                    <div className="p-6">
                      <h3 className="font-semibold text-engenha-dark-navy mb-4">Seu Progresso</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-engenha-blue">Aulas concluídas</span>
                          <span className="font-medium text-engenha-dark-navy">12 de 156</span>
                        </div>
                        <Progress value={8} className="h-2 [&>div]:bg-engenha-orange" />
                        <p className="text-xs text-engenha-blue">Você está indo muito bem! Continue assistindo para desbloquear novos conteúdos.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'description' && (
                <div className="space-y-6">
                  <Card className="border-engenha-sky-blue/20">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-engenha-dark-navy mb-4">
                        Transcrição da Aula
                      </h3>
                      
                      <div className="prose prose-sm max-w-none text-engenha-dark-navy">
                        <p className="mb-4">
                          <strong>[00:00]</strong> Olá pessoal! Bem-vindos à nossa primeira aula de Pré-Cálculo. Este curso é fundamental para quem vai estudar Cálculo I e outras disciplinas avançadas de matemática nas áreas de engenharia e ciências exatas.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[00:15]</strong> O Pré-Cálculo reúne os conceitos matemáticos essenciais que formam a base para o estudo do Cálculo. Aqui vamos revisar e aprofundar temas como funções, trigonometria, exponenciais e logaritmos.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[00:45]</strong> Um dos grandes benefícios de estudar Pré-Cálculo é a construção de uma base sólida que facilita a compreensão de limites, derivadas e integrais quando você avançar para o Cálculo I.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[01:30]</strong> Começaremos nosso estudo pelas funções, que são o conceito central do Pré-Cálculo. Uma função estabelece uma relação entre conjuntos onde cada elemento do domínio tem exatamente uma imagem no contradomínio.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[02:00]</strong> Vamos estudar diversos tipos de funções como lineares, quadráticas, polinomiais, racionais, exponenciais, logarítmicas e trigonométricas. Cada tipo tem suas propriedades e aplicações específicas.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[02:30]</strong> As funções trigonométricas são particularmente importantes, pois nos permitem modelar fenômenos periódicos como ondas sonoras, ciclos sazonais e circuitos elétricos. Veremos seno, cosseno, tangente e suas inversas.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[03:00]</strong> Outro conceito fundamental são as transformações de funções. Aprenderemos como operações como deslocamento, reflexão, alongamento e compressão afetam o gráfico de uma função.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[04:00]</strong> Ao longo deste curso, resolveremos muitos exercícios práticos e abordaremos aplicações reais desses conceitos em física, engenharia, economia e outras áreas.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[04:30]</strong> Em resumo, o Pré-Cálculo é a ponte entre a Álgebra básica e o Cálculo avançado. Dominando esses conceitos, você estará preparado para enfrentar com confiança as disciplinas mais avançadas do seu curso.
                        </p>
                      </div>
                      
                      <div className="mt-6 p-4 bg-engenha-light-blue/30 rounded-lg">
                        <h4 className="font-semibold text-engenha-dark-navy mb-2">💡 Dica</h4>
                        <p className="text-sm text-engenha-blue">
                          Use a transcrição para revisar conceitos importantes ou para acompanhar melhor a explicação durante a aula.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="space-y-6">
                  {/* Área para fazer pergunta */}
                  <Card className="border-engenha-sky-blue/20">
                    <div className="p-6">
                      <h3 className="font-semibold text-engenha-dark-navy mb-4">Fazer uma pergunta</h3>
                      <div className="space-y-4">
                        <textarea 
                          placeholder="Digite sua pergunta sobre esta aula..."
                          className="w-full p-3 border border-engenha-sky-blue/30 rounded-lg resize-none focus:ring-2 focus:ring-engenha-bright-blue focus:border-engenha-bright-blue"
                          rows={3}
                        />
                        <Button className="bg-engenha-bright-blue hover:bg-engenha-blue text-white">
                          Publicar Pergunta
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Lista de perguntas existentes */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-engenha-dark-navy">Perguntas dos alunos</h4>
                    
                    {/* Pergunta exemplo */}
                    <Card className="border-engenha-sky-blue/20">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-engenha-orange rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">JS</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-engenha-dark-navy">João Silva</span>
                              <span className="text-xs text-engenha-blue">há 2 horas</span>
                            </div>
                            <p className="text-engenha-blue mb-3">
                              Qual a diferença prática entre JDK e JRE? Não ficou muito claro no vídeo.
                            </p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-engenha-blue hover:bg-engenha-light-blue hover:text-engenha-dark-navy">
                                👍 5
                              </Button>
                              <Button variant="ghost" size="sm" className="text-engenha-blue hover:bg-engenha-light-blue hover:text-engenha-dark-navy">
                                Responder
                              </Button>
                            </div>
                            
                            {/* Resposta */}
                            <div className="mt-4 pl-4 border-l-2 border-engenha-sky-blue/30">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-engenha-bright-blue rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-semibold">PR</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-engenha-dark-navy">Prof. Roberto</span>
                                    <span className="px-2 py-0.5 bg-engenha-orange/10 text-engenha-orange text-xs rounded-full">Instrutor</span>
                                    <span className="text-xs text-engenha-blue">há 1 hora</span>
                                  </div>
                                  <p className="text-engenha-blue text-sm">
                                    Ótima pergunta! O JDK (Java Development Kit) inclui ferramentas para desenvolvimento, como o compilador javac. 
                                    Já o JRE (Java Runtime Environment) é apenas o ambiente para executar aplicações Java. 
                                    Se você só vai executar programas Java, precisa apenas do JRE. Para desenvolver, precisa do JDK completo.
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Button variant="ghost" size="sm" className="text-engenha-blue hover:bg-engenha-light-blue hover:text-engenha-dark-navy">
                                      👍 12
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Segunda pergunta exemplo */}
                    <Card className="border-engenha-sky-blue/20">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-engenha-sky-blue rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">MF</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-engenha-dark-navy">Maria Fernanda</span>
                              <span className="text-xs text-engenha-blue">há 5 horas</span>
                            </div>
                            <p className="text-engenha-blue mb-3">
                              É possível usar Java para desenvolvimento mobile?
                            </p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-engenha-blue hover:bg-engenha-light-blue hover:text-engenha-dark-navy">
                                👍 3
                              </Button>
                              <Button variant="ghost" size="sm" className="text-engenha-blue hover:bg-engenha-light-blue hover:text-engenha-dark-navy">
                                Responder
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="text-center py-12">
                  <div className="h-12 w-12 bg-engenha-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-engenha-blue text-xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-engenha-dark-navy mb-2">Suas Anotações</h3>
                  <p className="text-engenha-blue text-sm">Faça anotações importantes durante a aula para revisar depois.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Student Rating Component */}
                  <StudentRating onSubmit={handleRatingSubmit} />
                  
                  {/* Existing Reviews */}
                  <Card className="border-engenha-sky-blue/20">
                    <div className="p-6">
                      <h3 className="font-semibold text-engenha-dark-navy mb-4">
                        Avaliações Recentes
                      </h3>
                      
                      <div className="space-y-4">
                        {[{
                          name: "Marina S.",
                          rating: 5,
                          comment: "Excelente explicação! Muito didático e fácil de entender.",
                          date: "há 2 dias"
                        },
                        {
                          name: "Carlos M.",
                          rating: 4,
                          comment: "Bom conteúdo, mas poderia ter mais exemplos práticos.",
                          date: "há 1 semana"
                        },
                        {
                          name: "Ana P.",
                          rating: 5,
                          comment: "Perfeito! Consegui entender todos os conceitos apresentados.",
                          date: "há 2 semanas"
                        }].map((review, index) => (
                          <div key={index} className="border-b border-engenha-sky-blue/20 last:border-b-0 pb-4 last:pb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-engenha-dark-navy">{review.name}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={i < review.rating ? "text-engenha-gold" : "text-engenha-sky-blue"}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-engenha-blue">{review.date}</span>
                            </div>
                            <p className="text-sm text-engenha-blue">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar - Completamente alinhada */}
        <div className="hidden lg:block w-96 bg-engenha-light-cream h-screen sticky top-0 border-l border-engenha-sky-blue/20">
          <CourseSidebarContent />
        </div>
      </div>

      {/* Modais */}
      {currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onAnswer={handleQuestionAnswer}
          onClose={() => setCurrentQuestion(null)}
        />
      )}

      {showErrorModal && (
        <ErrorReasonModal
          onSelect={(reason) => console.log('Motivo do erro:', reason)}
          onRewatch={handleRewatch}
          onContinue={() => {
            setShowErrorModal(false);
            setIsPlaying(true);
          }}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          explanation={currentQuestion?.explanation}
          onContinue={() => {
            setShowSuccessModal(false);
            setIsPlaying(true);
          }}
        />
      )}

      {showRewatchModal && (
        <RewatchModal
          onConfirm={handleRewatchConfirm}
          onCancel={() => setShowRewatchModal(false)}
        />
      )}

      {/* Chat da IA */}
      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  );
}