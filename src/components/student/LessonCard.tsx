import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  subject: string;
  thumbnail?: string;
  className?: string;
}

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  watchTime: number;
  totalTime: number;
}

export function LessonCard({
  id,
  title,
  description,
  duration,
  difficulty,
  subject,
  thumbnail,
  className
}: LessonCardProps) {
  const navigate = useNavigate();
  const [progress] = useLocalStorage<LessonProgress[]>('course-progress', []);
  
  const lessonProgress = progress.find(p => p.lessonId === id);
  const isCompleted = lessonProgress?.completed || false;
  const watchProgress = lessonProgress ? (lessonProgress.watchTime / lessonProgress.totalTime) * 100 : 0;

  const handleStartLesson = () => {
    navigate(`/watch/${id}`);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2 group-hover:text-engenha-bright-blue transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{subject}</p>
          </div>
          {isCompleted && (
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {duration}
          </div>
        </div>

        {watchProgress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>{Math.round(watchProgress)}%</span>
            </div>
            <Progress value={watchProgress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          onClick={handleStartLesson}
          className="w-full"
          variant={isCompleted ? "outline" : "default"}
        >
          <Play className="h-4 w-4 mr-2" />
          {isCompleted ? 'Revisar Aula' : watchProgress > 0 ? 'Continuar' : 'Iniciar Aula'}
        </Button>
      </CardFooter>
    </Card>