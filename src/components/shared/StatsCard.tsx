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
  iconColor = 'rgba(255, 255, 255, 0.6)'
}) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <Card 
      className={`text-white border-0 bg-gradient-to-br ${gradient}`}
    >
      <CardContent className="p-2 sm:p-3 lg:p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-white/80 text-xs lg:text-sm">{title}</p>
            <p className="text-base sm:text-xl lg:text-2xl font-bold truncate">
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