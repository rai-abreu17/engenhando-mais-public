import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group cursor-default"
    >
      <Card 
        className={`${cardClasses} relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500`}
        style={cardStyle}
      >
        {/* Animated background overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
        />
        
        {/* Floating particles */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-white/40 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>

        <CardContent className="p-2 sm:p-3 lg:p-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <motion.p 
                className="text-white/90 text-xs lg:text-sm font-medium uppercase tracking-wider mb-1"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                {title}
              </motion.p>
              <motion.p 
                className="text-base sm:text-xl lg:text-2xl font-bold truncate text-white"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {formattedValue}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ 
                rotate: 10,
                scale: 1.1
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              {/* Icon glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle, ${iconColor}40 0%, transparent 70%)`,
                  filter: 'blur(8px)'
                }}
              />
              
              <Icon 
                className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 flex-shrink-0 relative z-10 drop-shadow-sm" 
                style={{ color: iconColor }}
              />
            </motion.div>
          </div>

          {/* Bottom shine effect */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={false}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;