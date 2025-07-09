
import React from 'react';
import { OpponentCar } from './types';
import { LANES } from './constants';

interface OpponentCarsProps {
  opponentCars: OpponentCar[];
}

const OpponentCars: React.FC<OpponentCarsProps> = ({ opponentCars }) => {
  console.log('🚗 OpponentCars renderizando:', opponentCars.length, opponentCars);
  
  if (!opponentCars || opponentCars.length === 0) {
    return null;
  }

  return (
    <>
      {opponentCars.map((car) => {
        if (!car || typeof car.lane !== 'number' || typeof car.position !== 'number') {
          return null;
        }

        const isVisible = car.position >= -20 && car.position <= 150;
        if (!isVisible) {
          return null;
        }

        console.log(`🚙 Renderizando carro ID:${car.id}, Lane:${car.lane}, Pos:${car.position.toFixed(1)}`);

        return (
          <div 
            key={car.id}
            className="absolute z-50"
            style={{
              left: `${LANES[car.lane]}%`,
              bottom: `${car.position}%`,
              transform: 'translateX(-50%)',
              width: '60px',
              height: '100px',
              pointerEvents: 'none'
            }}
          >
            {/* Carro simplificado e bem visível */}
            <div 
              className="w-full h-full rounded-lg border-4 border-white shadow-2xl"
              style={{ 
                backgroundColor: car.color,
                boxShadow: `0 0 30px ${car.color}, inset 0 0 20px rgba(255,255,255,0.3)`
              }}
            >
              {/* Para-brisa */}
              <div className="absolute left-2 right-2 top-2 h-8 bg-blue-200 rounded border-2 border-white" />
              
              {/* Faróis */}
              <div className="absolute left-1 top-1 w-4 h-3 bg-yellow-300 rounded border border-white" />
              <div className="absolute right-1 top-1 w-4 h-3 bg-yellow-300 rounded border border-white" />
              
              {/* Debug label bem visível */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-1 rounded font-bold text-sm border-2 border-white">
                CAR-{car.id}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OpponentCars;
