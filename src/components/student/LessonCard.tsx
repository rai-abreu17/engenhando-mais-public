
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, CheckCircle, Star, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn("group", className)}
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-muted/50 hover:from-card hover:via-muted/30 hover:to-accent/20 transition-all duration-500 shadow-md hover:shadow-xl hover:shadow-primary/10">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating particles effect */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-secondary/30 rounded-full animate-ping" style={{ animationDelay: '200ms' }} />
            <div className="w-1 h-1 bg-accent/30 rounded-full animate-ping" style={{ animationDelay: '400ms' }} />
          </div>
        </div>

        <CardHeader className="pb-3 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary/70" />
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">{subject}</span>
              </div>
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                {title}
              </h3>
            </div>
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 drop-shadow-sm" />
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="py-3 relative">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className={cn(
              getDifficultyColor(difficulty),
              "font-medium shadow-sm border-0 px-3 py-1"
            )}>
              <Star className="h-3 w-3 mr-1" />
              {difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{duration}</span>
            </div>
          </div>

          {watchProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2 bg-muted/30 rounded-lg p-3 border border-border/50"
            >
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground">Progresso</span>
                <span className="text-primary">{Math.round(watchProgress)}%</span>
              </div>
              <div className="relative">
                <Progress value={watchProgress} className="h-2 bg-muted" />
                <motion.div
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary via-primary/80 to-secondary rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${watchProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="pt-3 relative">
          <motion.div className="w-full" whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleStartLesson}
              className={cn(
                "w-full relative overflow-hidden font-semibold transition-all duration-300",
                isCompleted 
                  ? "bg-secondary/80 hover:bg-secondary text-secondary-foreground border border-border hover:border-primary/50 hover:shadow-md" 
                  : "bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 border-0"
              )}
              size="lg"
            >
              {/* Button glow effect */}
              {!isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              
              <Play className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              <span className="relative z-10">
                {isCompleted ? 'Revisar Aula' : watchProgress > 0 ? 'Continuar' : 'Iniciar Aula'}
              </span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
