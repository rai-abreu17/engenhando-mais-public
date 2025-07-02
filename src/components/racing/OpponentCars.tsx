
import React from 'react';
import { OpponentCar } from './types';
import { LANES } from './constants';

interface OpponentCarsProps {
  opponentCars: OpponentCar[];
}

const OpponentCars: React.FC<OpponentCarsProps> = ({ opponentCars }) => {
  console.log('🎨 RENDER: Renderizando carros adversários:', opponentCars.length);
  
  if (opponentCars.length === 0) {
    console.log('⚠️ RENDER: Nenhum carro para renderizar');
    return null;
  }
  
  return (
    <>
      {opponentCars.map((car) => {
        console.log(`🚗 RENDER: Carro ${car.id.toString().slice(-4)} - Lane ${car.lane + 1}, Pos ${car.position.toFixed(1)}%`);
        
        return (
          <div 
            key={car.id}
            className="absolute z-30"
            style={{
              left: `${LANES[car.lane]}%`,
              bottom: `${car.position}%`,
              transform: 'translateX(-50%) rotate(180deg)',
              width: '60px',
              height: '100px'
            }}
          >
            {/* Carro simples e visível */}
            <div 
              className="w-full h-full rounded-lg border-4 border-white shadow-xl"
              style={{ 
                backgroundColor: car.color,
                position: 'relative'
              }}
            >
              {/* Para-brisa */}
              <div className="absolute left-2 right-2 top-2 h-6 bg-gray-200 rounded-t-lg opacity-90" />
              
              {/* Faróis traseiros (vermelho porque está virado) */}
              <div className="absolute left-1 top-1 w-4 h-3 bg-red-500 rounded-sm" />
              <div className="absolute right-1 top-1 w-4 h-3 bg-red-500 rounded-sm" />
              
              {/* Indicador de debug bem visível */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded border-2 border-red-500">
                #{car.id.toString().slice(-3)}
              </div>
              
              {/* Indicador da pista */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-1 rounded">
                P{car.lane + 1}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OpponentCars;
