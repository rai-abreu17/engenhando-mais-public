import React from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/common/Header';
import TeacherNavigation from '../components/TeacherNavigation';

const TeacherAnalytics: React.FC = () => {
  const analyticsData = [
    { title: 'Total de Visualizações', value: '1,234', change: '+12%', icon: BarChart3 },
    { title: 'Alunos Engajados', value: '89', change: '+8%', icon: Users },
    { title: 'Avaliação Média', value: '4.7', change: '+0.3', icon: Star },
    { title: 'Taxa de Conclusão', value: '73%', change: '+5%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20 md:pb-0">
        <Header 
          title="Analytics"
          subtitle="Acompanhe o desempenho das suas aulas"
        />

        <div className="p-6 space-y-6">
          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analyticsData.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-green-600">{metric.change}</p>
                    </div>
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico de performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance das Aulas - Últimos 30 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>Gráfico de performance em breve</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top aulas */}
          <Card>
            <CardHeader>
              <CardTitle>Aulas Mais Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Cálculo I - Limites', views: 234, rating: 4.8 },
                  { name: 'Física - Movimento', views: 189, rating: 4.6 },
                  { name: 'Matemática Básica', views: 156, rating: 4.9 },
                ].map((lesson, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{lesson.name}</h4>
                      <p className="text-sm text-muted-foreground">{lesson.views} visualizações</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{lesson.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TeacherNavigation />
    </div>
  );
};

export default TeacherAnalytics;