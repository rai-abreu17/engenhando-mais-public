
import React from 'react';
import { OpponentCar } from './types';
import { LANES } from './constants';

interface OpponentCarsProps {
  opponentCars: OpponentCar[];
}

const OpponentCars: React.FC<OpponentCarsProps> = ({ opponentCars }) => {
  // Debug: Log para verificar se há carros para renderizar
  console.log('🚗 OpponentCars renderizando:', opponentCars.length);
  
  if (!opponentCars || opponentCars.length === 0) {
    console.log('⚠️ Nenhum carro adversário para renderizar');
    return null;
  }

  return (
    <>
      {opponentCars.map((car) => {
        // Verificação de segurança para dados do carro
        if (!car || typeof car.lane !== 'number' || typeof car.position !== 'number') {
          console.warn('❌ Dados inválidos do carro:', car);
          return null;
        }

        // Verificação se o carro está na área visível
        const isVisible = car.position >= -20 && car.position <= 150;
        if (!isVisible) {
          return null;
        }

        console.log(`🚙 Renderizando carro ID:${car.id}, Lane:${car.lane}, Pos:${car.position.toFixed(1)}`);

        return (
          <div 
            key={car.id}
            className="absolute z-20"
            style={{
              left: `${LANES[car.lane]}%`,
              bottom: `${car.position}%`,
              transform: 'translateX(-50%) rotate(180deg)',
              width: '50px',
              height: '90px',
              pointerEvents: 'none' // Previne problemas de interação
            }}
          >
            {/* Sombra do carro */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-black opacity-40 rounded-full"
              style={{ filter: 'blur(3px)', zIndex: -1 }}
            />
            
            {/* Corpo do carro */}
            <div className="relative w-full h-full">
              <div 
                className="absolute inset-0 rounded-lg shadow-xl border-2 border-white border-opacity-30"
                style={{ 
                  backgroundColor: car.color,
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)',
                  boxShadow: `0 0 20px ${car.color}50` // Brilho colorido
                }}
              >
                {/* Para-brisa */}
                <div className="absolute left-1/4 right-1/4 top-3 h-6 bg-gray-100 rounded-t opacity-90 border border-gray-300" />
                
                {/* Faróis */}
                <div className="absolute left-2 top-1 w-3 h-2 bg-red-500 rounded-sm" />
                <div className="absolute right-2 top-1 w-3 h-2 bg-red-500 rounded-sm" />
                
                {/* Linha central */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-white opacity-50" />
                
                {/* Indicador visual adicional */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-20" />
              </div>
            </div>
            
            {/* Debug info para desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-75 px-1 rounded">
                L{car.lane + 1}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default OpponentCars;
