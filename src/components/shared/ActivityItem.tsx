import React from 'react';
import { Clock } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { COLORS } from '@/constants/theme';

interface ActivityItemProps {
  id: number;
  message: string;
  time: string;
  icon: LucideIcon;
  variant: 'success' | 'info' | 'warning';
  isLast?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  message, 
  time, 
  icon: Icon, 
  variant, 
  isLast = false 
}) => {
  const getVariantStyles = (variant: 'success' | 'info' | 'warning') => {
    switch (variant) {
      case 'success': 
        return { 
          color: COLORS.brightBlue, 
          backgroundColor: COLORS.lightBlue 
        };
      case 'info': 
        return { 
          color: COLORS.skyBlue, 
          backgroundColor: COLORS.lightBlue 
        };
      case 'warning': 
        return { 
          color: COLORS.orange, 
          backgroundColor: COLORS.lightCream 
        };
      default: 
        return { 
          color: COLORS.darkNavy, 
          backgroundColor: COLORS.lightBlue 
        };
    }
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <div 
      className={`p-2 sm:p-3 lg:p-4 flex items-center space-x-2 sm:space-x-3 ${
        !isLast ? 'border-b' : ''
      }`}
      style={{ borderColor: !isLast ? '#e0e7ff' : 'transparent' }}
    >
      <div 
        className="p-1 sm:p-1.5 lg:p-2 rounded-full flex-shrink-0"
        style={variantStyles}
      >
        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p 
          className="text-xs sm:text-sm line-clamp-2 leading-tight"
          style={{ color: COLORS.darkNavy }}
        >
          {message}
        </p>
        <div className="flex items-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
          <Clock 
            className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" 
            style={{ color: COLORS.blue }}
          />
          <span 
            className="text-xs"
            style={{ color: COLORS.blue }}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;