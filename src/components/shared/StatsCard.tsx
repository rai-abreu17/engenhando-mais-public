import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  iconColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  gradient,
  iconColor = 'white'
}) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  
  // Implementação mais robusta para lidar com diferentes formatos de gradiente
  let cardStyle = {};
  let cardClasses = 'text-white border-0';
  
  if (gradient.includes('linear-gradient')) {
    // Gradiente CSS como string - aplicar como estilo inline
    cardStyle = { 
      background: gradient,
      color: 'white' // Garantir que o texto seja branco
    };
  } else if (gradient.includes('from-')) {
    // Formato de classe Tailwind
    cardClasses = `text-white border-0 bg-gradient-to-br ${gradient}`;
  } else {
    // Fallback para um gradiente padrão caso nenhum formato seja reconhecido
    cardStyle = { 
      background: 'linear-gradient(135deg, #28b0ff, #0029ff)',
      color: 'white'
    };
  }

  return (
    <Card 
      className={cardClasses}
      style={cardStyle}
    >
      <CardContent className="p-2 sm:p-3 lg:p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-white text-xs lg:text-sm">{title}</p>
            <p className="text-base sm:text-xl lg:text-2xl font-bold truncate text-white">
              {formattedValue}
            </p>
          </div>
          <Icon 
            className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 flex-shrink-0" 
            style={{ color: iconColor }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;