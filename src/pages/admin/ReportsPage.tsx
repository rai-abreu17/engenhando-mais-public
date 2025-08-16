import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Filter,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  PieChart,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import Header from '@/features/student/components/Header';
import AdminNavigation from '@/admin/components/AdminNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Verificar se há filtros ativos (não padrão)
  const hasActiveFilters = selectedPeriod !== 'month' || startDate || endDate;

  // Mock data - em produção viria de APIs
  const reportTypes = [
    {
      id: 1,
      title: 'Relatório de Alunos',
      description: 'Lista completa de alunos por turma, status e desempenho',
      icon: Users,
      type: 'students',
      formats: ['PDF', 'Excel'],
      lastGenerated: '2024-01-15'
    },
    {
      id: 2,
      title: 'Relatório de Professores',
      description: 'Performance e estatísticas dos professores',
      icon: BookOpen,
      type: 'teachers',
      formats: ['PDF', 'Excel'],
      lastGenerated: '2024-01-14'
    },
    {
      id: 3,
      title: 'Relatório de Aulas',
      description: 'Aulas ministradas, frequência e aproveitamento',
      icon: Clock,
      type: 'lessons',
      formats: ['PDF', 'Excel'],
      lastGenerated: '2024-01-16'
    },
    {
      id: 4,
      title: 'Relatório Financeiro',
      description: 'Receitas, despesas e análise financeira',
      icon: BarChart3,
      type: 'financial',
      formats: ['PDF', 'Excel'],
      lastGenerated: '2024-01-10'
    },
    {
      id: 5,
      title: 'Relatório de Frequência',
      description: 'Análise de frequência por turma e aluno',
      icon: PieChart,
      type: 'attendance',
      formats: ['PDF', 'Excel'],
      lastGenerated: '2024-01-12'
    },
    {
      id: 6,
      title: 'Relatório de Desempenho',
      description: 'Notas, progressos e estatísticas de aproveitamento',
      icon: TrendingUp,
      type: 'performance',
      formats: ['PDF', 'Excel'],
      lastGenerated: '2024-01-13'
    }
  ];

  const quickStats = {
    totalReports: 156,
    thisMonth: 23,
    pendingReports: 3,
    automatedReports: 8
  };

  const generateReport = (reportType: string, format: string) => {
    console.log(`Generating ${reportType} report in ${format} format`);
    // Aqui seria a lógica para gerar o relatório
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] pb-20">
      <Header 
        title="Relatórios e Estatísticas"
        subtitle="Gere e visualize relatórios do sistema"
      />

      <div className="px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Estatísticas Rápidas */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <Card className="bg-gradient-to-r from-[#28b0ff] to-[#0029ff] text-white border-[#28b0ff]">
            <CardContent className="p-2 sm:p-3 lg:p-4 text-center">
              <p className="text-base sm:text-xl lg:text-2xl font-bold">{quickStats.totalReports}</p>
              <p className="text-xs lg:text-sm text-white/80">Total de Relatórios</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#ff7a28] to-[#d75200] text-white border-[#ff7a28]">
            <CardContent className="p-2 sm:p-3 lg:p-4 text-center">
              <p className="text-base sm:text-xl lg:text-2xl font-bold">{quickStats.thisMonth}</p>
              <p className="text-xs lg:text-sm text-white/80">Este Mês</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#ffb646] to-[#ff9800] text-white border-[#ffb646]">
            <CardContent className="p-2 sm:p-3 lg:p-4 text-center">
              <p className="text-base sm:text-xl lg:text-2xl font-bold">{quickStats.pendingReports}</p>
              <p className="text-xs lg:text-sm text-white/80">Pendentes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#00a86b] to-[#008853] text-white border-[#00a86b]">
            <CardContent className="p-2 sm:p-3 lg:p-4 text-center">
              <p className="text-base sm:text-xl lg:text-2xl font-bold">{quickStats.automatedReports}</p>
              <p className="text-xs lg:text-sm text-white/80">Automatizados</p>
            </CardContent>
          </Card>
        </section>

        {/* Filtros de Período */}
        <section className="flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#030025]">Relatórios do Sistema</h2>
            <p className="text-xs sm:text-sm text-[#001cab]">Gere e baixe relatórios personalizados</p>
          </div>
          
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={`border-[#28b0ff] hover:bg-[#f0f6ff] w-8 sm:w-auto text-xs sm:text-sm h-8 sm:h-10 p-0 sm:px-3 ${hasActiveFilters ? 'bg-[#0029ff] text-white border-[#0029ff]' : 'text-[#0029ff]'}`}
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filtrar Período</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="hidden sm:inline-flex ml-2 bg-white/20 text-white text-xs">
                    1
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-[#030025]">Filtrar por Período</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[#030025] mb-2">Período Predefinido</label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fffaf0] border border-[#28b0ff] rounded-md text-xs sm:text-sm text-[#030025] focus:border-[#0029ff] focus:outline-none h-10"
                    >
                      <option value="week">Última Semana</option>
                      <option value="month">Último Mês</option>
                      <option value="quarter">Último Trimestre</option>
                      <option value="year">Último Ano</option>
                      <option value="custom">Período Personalizado</option>
                    </select>
                  </div>
                  
                  {selectedPeriod === 'custom' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#030025] mb-2">Data Inicial</label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#030025] mb-2">Data Final</label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-[#fffaf0] border-[#28b0ff] focus:border-[#0029ff]"
                        />
                      </div>
                    </>
                  )}
                  
                  <Button className="w-full bg-[#0029ff] hover:bg-[#001cab] text-white text-xs sm:text-sm">
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </section>

        {/* Tipos de Relatórios */}
        <section>
          <h2 className="text-lg font-semibold text-[#030025] mb-4">Tipos de Relatórios Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <Card key={report.id} className="bg-[#fffaf0] border-[#28b0ff] hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                      <report.icon className="h-5 w-5 text-[#0029ff]" />
                    </div>
                    <div>
                      <CardTitle className="text-sm text-[#030025]">{report.title}</CardTitle>
                      <CardDescription className="text-xs text-[#001cab]">
                        Último: {new Date(report.lastGenerated).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#001cab] mb-4">{report.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#030025]">Formatos Disponíveis:</p>
                    <div className="flex space-x-2">
                      {report.formats.map((format) => (
                        <Button
                          key={format}
                          variant="outline"
                          size="sm"
                          onClick={() => generateReport(report.type, format)}
                          className="border-[#28b0ff] text-[#0029ff] hover:bg-[#f0f6ff]"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Relatórios Agendados */}
        <Card className="bg-[#fffaf0] border-[#28b0ff]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-[#030025]">
              <Calendar className="h-5 w-5" />
              <span>Relatórios Agendados</span>
            </CardTitle>
            <CardDescription className="text-[#001cab]">
              Configure relatórios para serem gerados automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <div>
                  <p className="font-medium text-[#030025]">Relatório Mensal de Alunos</p>
                  <p className="text-sm text-[#001cab]">Todo dia 1 às 09:00</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar relatório
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover relatório
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f0f6ff] rounded-lg border border-[#28b0ff]">
                <div>
                  <p className="font-medium text-[#030025]">Relatório Semanal de Frequência</p>
                  <p className="text-sm text-[#001cab]">Toda sexta-feira às 17:00</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar relatório
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover relatório
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button className="w-full bg-[#0029ff] hover:bg-[#001cab] text-white mt-4">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Novo Relatório
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminNavigation />
    </div>
  );
};

export default ReportsPage;