import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Download, Users, BookOpen, TrendingUp, AlertTriangle, Clock, Target, MessageCircle, FileText, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dados mockados
const mockAdminSummary = [
  { courseId: 1, courseName: "Matemática", avgGrade: 8.5, completionRate: 85, dropoutRate: 15, avgStudyHours: 4.2 },
  { courseId: 2, courseName: "Português", avgGrade: 7.8, completionRate: 78, dropoutRate: 22, avgStudyHours: 3.8 },
  { courseId: 3, courseName: "História", avgGrade: 9.1, completionRate: 92, dropoutRate: 8, avgStudyHours: 5.1 },
  { courseId: 4, courseName: "Geografia", avgGrade: 8.0, completionRate: 80, dropoutRate: 20, avgStudyHours: 4.0 },
  { courseId: 5, courseName: "Física", avgGrade: 7.3, completionRate: 73, dropoutRate: 27, avgStudyHours: 3.5 }
];

const mockAdminDetail = [
  { courseId: 1, turmaId: 'A1', professorId: 1, professorName: 'Prof. Silva', avgGrade: 8.7, completionRate: 88, avgStudyHours: 4.5 },
  { courseId: 1, turmaId: 'A2', professorId: 2, professorName: 'Prof. Santos', avgGrade: 8.3, completionRate: 82, avgStudyHours: 3.9 },
  { courseId: 2, turmaId: 'B1', professorId: 3, professorName: 'Prof. Lima', avgGrade: 8.0, completionRate: 80, avgStudyHours: 4.0 },
];

const mockTeacherEngagement = {
  turma: "Turma A - Matemática",
  avgStudyByDay: [
    { day: "Seg", hours: 1.2 },
    { day: "Ter", hours: 1.8 },
    { day: "Qua", hours: 2.1 },
    { day: "Qui", hours: 1.9 },
    { day: "Sex", hours: 1.5 },
    { day: "Sáb", hours: 0.8 },
    { day: "Dom", hours: 0.5 }
  ],
  studentsAtRisk: [
    { studentId: 1, name: "João Silva", riskScore: 85, avgStudyHours: 0.5, missingAssignments: 5, lastActivity: "2024-01-15" },
    { studentId: 2, name: "Maria Santos", riskScore: 72, avgStudyHours: 1.2, missingAssignments: 3, lastActivity: "2024-01-18" },
    { studentId: 3, name: "Pedro Lima", riskScore: 68, avgStudyHours: 1.8, missingAssignments: 4, lastActivity: "2024-01-20" }
  ],
  feedbackByLesson: [
    { 
      lessonId: 1, 
      title: "Álgebra Linear", 
      date: "2024-01-22", 
      avgCompletionRate: 78,
      feedbacks: [
        { studentId: 1, text: "Muito difícil, preciso de mais exemplos", rating: 2 },
        { studentId: 2, text: "Gostei da explicação, mas poderia ser mais devagar", rating: 4 },
        { studentId: 3, text: "Excelente aula, bem explicado", rating: 5 }
      ]
    },
    {
      lessonId: 2,
      title: "Geometria Analítica",
      date: "2024-01-25",
      avgCompletionRate: 85,
      feedbacks: [
        { studentId: 1, text: "Melhor que a aula anterior", rating: 3 },
        { studentId: 2, text: "Perfeito, entendi tudo", rating: 5 },
        { studentId: 4, text: "Precisa de mais exercícios práticos", rating: 4 }
      ]
    }
  ]
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

const ReportsPage = () => {
  const [currentRole, setCurrentRole] = useState<'admin' | 'professor'>('admin');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-31' });
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedTurma, setSelectedTurma] = useState('all');
  const [selectedProfessor, setSelectedProfessor] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDrillDown, setSelectedDrillDown] = useState<any>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const { toast } = useToast();

  const itemsPerPage = 5;

  // Simulação de loading
  const handleRoleChange = (role: 'admin' | 'professor') => {
    setLoading(true);
    setTimeout(() => {
      setCurrentRole(role);
      setLoading(false);
    }, 1500);
  };

  // Função para exportar CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast({ title: "Sucesso", description: `${filename} exportado com sucesso!` });
  };

  const handleDrillDown = (item: any) => {
    // Simulação de drill-down - em um app real faria requisição para obter detalhes
    const details = mockAdminDetail.filter(detail => detail.courseId === item.courseId);
    setSelectedDrillDown({ ...item, details });
  };

  const handleMarkForFollowUp = (studentId: number) => {
    toast({ 
      title: "Marcado para acompanhamento", 
      description: `Aluno ID ${studentId} foi marcado para acompanhamento especial.` 
    });
  };

  const handleSendMessage = (studentId: number) => {
    toast({ 
      title: "Mensagem enviada", 
      description: `Mensagem de apoio enviada para aluno ID ${studentId}.` 
    });
  };

  // Paginação
  const paginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (data: any[]) => Math.ceil(data.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Análise de desempenho e engajamento</p>
          </div>
          
          {/* Role Selector */}
          <div className="flex gap-2">
            <Button
              variant={currentRole === 'admin' ? 'default' : 'outline'}
              onClick={() => handleRoleChange('admin')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Administrador
            </Button>
            <Button
              variant={currentRole === 'professor' ? 'default' : 'outline'}
              onClick={() => handleRoleChange('professor')}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Professor
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Data Início</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Data Fim</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              {currentRole === 'admin' && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Curso</label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os cursos</SelectItem>
                        {mockAdminSummary.map(course => (
                          <SelectItem key={course.courseId} value={course.courseId.toString()}>
                            {course.courseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Professor</label>
                    <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os professores</SelectItem>
                        <SelectItem value="1">Prof. Silva</SelectItem>
                        <SelectItem value="2">Prof. Santos</SelectItem>
                        <SelectItem value="3">Prof. Lima</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {currentRole === 'professor' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Turma</label>
                  <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as turmas</SelectItem>
                      <SelectItem value="A">Turma A - Matemática</SelectItem>
                      <SelectItem value="B">Turma B - Matemática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin View */}
        {currentRole === 'admin' && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Média Geral</p>
                      <p className="text-2xl font-bold text-foreground">8.1</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                      <p className="text-2xl font-bold text-foreground">81.6%</p>
                    </div>
                    <Target className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Evasão</p>
                      <p className="text-2xl font-bold text-foreground">18.4%</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo Médio</p>
                      <p className="text-2xl font-bold text-foreground">4.1h</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos Admin */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockAdminSummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="courseName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgGrade" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Conclusão vs Evasão</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Concluíram', value: 81.6 },
                          { name: 'Evadiram', value: 18.4 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}%`}
                      >
                        {[{ name: 'Concluíram', value: 81.6 }, { name: 'Evadiram', value: 18.4 }].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabela Admin com Drill-down */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Detalhes por Curso</CardTitle>
                  <Button 
                    onClick={() => exportToCSV(mockAdminSummary, 'relatorio-admin')}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Média de Notas</TableHead>
                      <TableHead>Taxa de Conclusão</TableHead>
                      <TableHead>Taxa de Evasão</TableHead>
                      <TableHead>Tempo Médio (h)</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData(mockAdminSummary).map((course) => (
                      <TableRow key={course.courseId}>
                        <TableCell className="font-medium">{course.courseName}</TableCell>
                        <TableCell>{course.avgGrade}</TableCell>
                        <TableCell>{course.completionRate}%</TableCell>
                        <TableCell>{course.dropoutRate}%</TableCell>
                        <TableCell>{course.avgStudyHours}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDrillDown(course)}
                              >
                                Ver Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes - {course.courseName}</DialogTitle>
                                <DialogDescription>
                                  Informações detalhadas por turma e professor
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {selectedDrillDown?.details?.map((detail: any) => (
                                  <Card key={`${detail.turmaId}-${detail.professorId}`}>
                                    <CardContent className="p-4">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Turma</p>
                                          <p className="font-medium">{detail.turmaId}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Professor</p>
                                          <p className="font-medium">{detail.professorName}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Média</p>
                                          <p className="font-medium">{detail.avgGrade}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Conclusão</p>
                                          <p className="font-medium">{detail.completionRate}%</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Paginação */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages(mockAdminSummary)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages(mockAdminSummary), prev + 1))}
                      disabled={currentPage === totalPages(mockAdminSummary)}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Professor View */}
        {currentRole === 'professor' && (
          <>
            {/* KPIs Professor */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Alunos em Risco</p>
                      <p className="text-2xl font-bold text-orange-500">{mockTeacherEngagement.studentsAtRisk.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tempo Médio Semanal</p>
                      <p className="text-2xl font-bold text-foreground">
                        {(mockTeacherEngagement.avgStudyByDay.reduce((acc, day) => acc + day.hours, 0)).toFixed(1)}h
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Aulas Avaliadas</p>
                      <p className="text-2xl font-bold text-foreground">{mockTeacherEngagement.feedbackByLesson.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico - Tempo de Estudo por Dia */}
            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Estudo por Dia da Semana</CardTitle>
                <CardDescription>{mockTeacherEngagement.turma}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTeacherEngagement.avgStudyByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alunos em Risco */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Alunos com Dificuldades</CardTitle>
                    <Button 
                      size="sm"
                      onClick={() => exportToCSV(mockTeacherEngagement.studentsAtRisk, 'alunos-risco')}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTeacherEngagement.studentsAtRisk
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .map((student) => (
                    <Card key={student.studentId} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={student.riskScore > 80 ? 'destructive' : 'secondary'}>
                              Risco: {student.riskScore}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                        <div>Tempo médio: {student.avgStudyHours}h</div>
                        <div>Atividades perdidas: {student.missingAssignments}</div>
                        <div className="col-span-2">Última atividade: {student.lastActivity}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkForFollowUp(student.studentId)}
                        >
                          Marcar Acompanhamento
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSendMessage(student.studentId)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Enviar Mensagem
                        </Button>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Feedback por Aula */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Detalhado por Aula</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTeacherEngagement.feedbackByLesson.map((lesson) => (
                    <Card key={lesson.lessonId} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground">{lesson.date}</p>
                        </div>
                        <Badge>
                          {lesson.avgCompletionRate}% conclusão
                        </Badge>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedFeedback(lesson)}
                          >
                            Ver Feedbacks ({lesson.feedbacks.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{lesson.title}</DialogTitle>
                            <DialogDescription>
                              Feedbacks dos alunos - {lesson.date}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {lesson.feedbacks.map((feedback, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-medium">Aluno ID: {feedback.studentId}</p>
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <span 
                                        key={i} 
                                        className={`text-lg ${
                                          i < feedback.rating ? 'text-yellow-500' : 'text-gray-300'
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">"{feedback.text}"</p>
                              </Card>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;