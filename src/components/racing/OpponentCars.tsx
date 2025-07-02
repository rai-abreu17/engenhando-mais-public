
import React from 'react';
import { OpponentCar } from './types';
import { LANES } from './constants';

interface OpponentCarsProps {
  opponentCars: OpponentCar[];
}

const OpponentCars: React.FC<OpponentCarsProps> = ({ opponentCars }) => {
  return (
    <>
      {opponentCars.map((car) => (
        <div 
          key={car.id}
          className="absolute z-10"
          style={{
            left: `${LANES[car.lane]}%`,
            bottom: `${car.position}%`,
            transform: 'translateX(-50%) rotate(180deg)',
            width: '50px',
            height: '90px'
          }}
        >
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-black opacity-40 rounded-full"
            style={{ filter: 'blur(3px)' }}
          />
          
          <div className="relative w-full h-full">
            <div 
              className="absolute inset-0 rounded-lg shadow-lg border border-white border-opacity-20"
              style={{ 
                backgroundColor: car.color,
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%, 0% 20%)'
              }}
            >
              <div className="absolute left-1/4 right-1/4 top-2 h-5 bg-gray-100 rounded-t opacity-90" />
              <div className="absolute left-2 top-1 w-3 h-2 bg-red-500 rounded-sm" />
              <div className="absolute right-2 top-1 w-3 h-2 bg-red-500 rounded-sm" />
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-white opacity-50" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OpponentCars;
