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
    title: 'Seção 1: Introdução',
    lessons: [
      { id: '1-1', title: 'Introdução: visão geral do curso', duration: '17m', type: 'video' },
      { id: '1-2', title: 'Mapa de estudos da carreira Java', duration: '4m', type: 'video' },
    ]
  },
  {
    id: '2',
    title: 'Seção 2: Conceitos de programação',
    lessons: [
      { id: '2-1', title: 'Algoritmos e lógica de programação', duration: '15m', type: 'video' },
      { id: '2-2', title: 'Estruturas de dados básicas', duration: '12m', type: 'video' },
      { id: '2-3', title: 'Exercícios práticos', duration: '8m', type: 'quiz' },
    ]
  },
  {
    id: '3',
    title: 'Seção 3: Introdução à linguagem Java',
    lessons: [
      { id: '3-1', title: 'Visão geral do capítulo', duration: '1m', type: 'video' },
      { id: '3-2', title: 'Material de apoio do capítulo', duration: '1m', type: 'text' },
      { id: '3-3', title: 'Entendendo as versões do Java', duration: '4m', type: 'video' },
      { id: '3-4', title: 'Histórico e edições de Java', duration: '8m', type: 'video' },
      { id: '3-5', title: 'JDK / JVM - Máquina Virtual do Java', duration: '7m', type: 'video' },
      { id: '3-6', title: 'Estrutura de uma aplicação Java', duration: '3m', type: 'video' },
      { id: '3-7', title: 'Instalando o Java JDK', duration: '1m', type: 'video' },
      { id: '3-8', title: 'Instalando o Eclipse', duration: '3m', type: 'video' },
      { id: '3-9', title: 'Primeiro programa em Java no Eclipse', duration: '14m', type: 'video' },
    ]
  }
];

// Dados das perguntas do vídeo
const videoQuestions = [
  {
    id: 'q1',
    time: 45, // 45 segundos
    question: 'Qual é o principal objetivo da linguagem Java?',
    options: [
      'Ser uma linguagem apenas para web',
      'Ser multiplataforma e orientada a objetos',
      'Substituir completamente o C++',
      'Funcionar apenas em Windows'
    ],
    correctAnswer: 1,
    explanation: 'Java foi criada com o princípio "write once, run anywhere" - escreva uma vez, execute em qualquer lugar.'
  },
  {
    id: 'q2',
    time: 120, // 2 minutos
    question: 'O que significa JVM?',
    options: [
      'Java Virtual Machine',
      'Java Version Manager',
      'Java Visual Mode',
      'Java Variable Method'
    ],
    correctAnswer: 0,
    explanation: 'JVM (Java Virtual Machine) é responsável por executar o código Java em diferentes sistemas operacionais.'
  },
  {
    id: 'q3',
    time: 240, // 4 minutos
    question: 'Qual extensão têm os arquivos de código Java?',
    options: [
      '.js',
      '.class',
      '.java',
      '.jvm'
    ],
    correctAnswer: 2,
    explanation: 'Arquivos de código fonte Java têm extensão .java, que são compilados para .class.'
  }
];

export default function WatchLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
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
    if (!currentLesson) {
      navigate('/');
      return;
    }

    // Carregar progresso salvo
    const savedProgress = progress.find(p => p.lessonId === lessonId);
    if (savedProgress) {
      setCurrentTime(savedProgress.watchTime);
    }
  }, [lessonId, currentLesson, navigate, progress]);

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

  if (!currentLesson) {
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
            videoId="73wo6vFD99s"
            title={currentLesson.title}
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
                        Curso completo de Java e Programação Orientada a Objetos
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-engenha-blue mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-engenha-gold text-lg">★</span>
                          <span className="font-semibold">4,8</span>
                          <span>(62.795 avaliações)</span>
                        </div>
                        <span>• 182.371 Alunos</span>
                        <span>• 54,5 horas de conteúdo</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-engenha-orange/10 text-engenha-orange text-sm rounded-full font-medium">
                          Certificado disponível
                        </span>
                        <span className="px-3 py-1 bg-engenha-sky-blue/10 text-engenha-sky-blue text-sm rounded-full font-medium">
                          Atualizado 2024
                        </span>
                        <span className="px-3 py-1 bg-engenha-bright-blue/10 text-engenha-bright-blue text-sm rounded-full font-medium">
                          Suporte completo
                        </span>
                      </div>

                      <p className="text-engenha-blue text-sm">
                        📚 Última atualização: junho de 2024 • 🌐 Legendas em Português
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
                          <strong>[00:00]</strong> Muito bem pessoal, nesta aula vamos falar sobre a estrutura de uma aplicação Java e como organizar seu código de forma eficiente.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[00:15]</strong> Java é uma linguagem de programação orientada a objetos, criada pela Sun Microsystems e atualmente mantida pela Oracle. Uma das principais características do Java é ser multiplataforma.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[00:45]</strong> O principal objetivo da linguagem Java é seguir o conceito "write once, run anywhere" - escreva uma vez, execute em qualquer lugar. Isso é possível graças à Java Virtual Machine, ou JVM.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[01:30]</strong> A JVM é responsável por interpretar o bytecode Java e executá-lo no sistema operacional específico. Isso permite que um programa Java compilado rode em Windows, Linux, Mac ou qualquer sistema que tenha a JVM instalada.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[02:00]</strong> Agora vamos entender melhor o que significa JVM. JVM é a abreviação para Java Virtual Machine, que é o coração da plataforma Java.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[02:30]</strong> Quando você escreve código Java, ele é salvo em arquivos com extensão .java. Esses arquivos são então compilados pelo compilador javac para gerar arquivos .class, que contêm o bytecode.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[03:00]</strong> O bytecode é um código intermediário que não é específico de nenhuma arquitetura de hardware, permitindo que seja executado em qualquer sistema que tenha a JVM.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[04:00]</strong> Os arquivos de código fonte Java sempre têm extensão .java. Esta é uma convenção importante que você deve sempre seguir quando criar seus programas.
                        </p>
                        
                        <p className="mb-4">
                          <strong>[04:30]</strong> Em resumo, a estrutura básica é: código .java → compilação → bytecode .class → execução na JVM → resultado final no sistema operacional.
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