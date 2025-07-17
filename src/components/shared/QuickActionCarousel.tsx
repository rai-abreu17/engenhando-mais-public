import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { COLORS } from '@/constants/theme';

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
  variant: 'outline' | 'default';
}

interface QuickActionCarouselProps {
  actions: QuickAction[];
}

const QuickActionCarousel: React.FC<QuickActionCarouselProps> = ({ actions }) => {
  return (
    <section>
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: COLORS.darkNavy }}>
        Ações Rápidas
      </h2>
      
      {/* Desktop: Grid normal */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <QuickActionCard key={index} action={action} />
        ))}
      </div>

      {/* Mobile: Carrossel horizontal */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {actions.map((action, index) => (
            <div key={index} className="flex-none w-72 snap-start">
              <QuickActionCard action={action} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const QuickActionCard: React.FC<{ action: QuickAction }> = ({ action }) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-lg"
      style={{ 
        backgroundColor: COLORS.lightCream, 
        borderColor: COLORS.skyBlue 
      }}
    >
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div 
            className="p-1.5 sm:p-2 rounded-lg border flex-shrink-0"
            style={{ 
              backgroundColor: COLORS.lightBlue, 
              borderColor: COLORS.skyBlue 
            }}
          >
            <action.icon 
              className="h-4 w-4 sm:h-5 sm:w-5" 
              style={{ color: COLORS.brightBlue }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle 
              className="text-sm sm:text-base leading-tight"
              style={{ color: COLORS.darkNavy }}
            >
              {action.title}
            </CardTitle>
            <CardDescription 
              className="text-xs sm:text-sm line-clamp-2 mt-0.5"
              style={{ color: COLORS.blue }}
            >
              {action.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          variant={action.variant} 
          size="sm" 
          onClick={action.action}
          className="w-full text-xs sm:text-sm transition-all duration-300"
          style={{
            borderColor: COLORS.skyBlue,
            color: COLORS.blue,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.brightBlue;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = COLORS.brightBlue;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = COLORS.blue;
            e.currentTarget.style.borderColor = COLORS.skyBlue;
          }}
        >
          Executar
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionCarousel;