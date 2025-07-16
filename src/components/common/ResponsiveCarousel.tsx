import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useResponsiveItems } from '../../hooks/useResponsiveItems';

interface ResponsiveCarouselProps<T = unknown> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  title: string;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

const ResponsiveCarousel = <T extends { id?: string | number }>({ 
  items, 
  renderItem, 
  title,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 }
}: ResponsiveCarouselProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = useResponsiveItems(itemsPerView);

  // Resetar índice quando itemsToShow mudar para evitar índices inválidos
  useEffect(() => {
    const maxIndex = Math.max(0, items.length - itemsToShow);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [itemsToShow, items.length, currentIndex]);

  const maxIndex = Math.max(0, items.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Não mostrar setas se todos os itens estão visíveis
  const showArrows = items.length > itemsToShow;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[#030025]">{title}</h2>
      </div>
      <div className="relative">
        {/* Seta Esquerda - Visível apenas em telas médias e maiores */}
        {showArrows && (
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#fffaf0] border border-[#28b0ff] rounded-full p-1 md:p-2 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            aria-label="Item anterior"
          >
            <ChevronLeft className="text-[#28b0ff]" size={16} />
            <span className="hidden md:inline"><ChevronLeft className="text-[#28b0ff]" size={24} /></span>
          </button>
        )}

        {/* Seta Direita - Visível apenas em telas médias e maiores */}
        {showArrows && (
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#fffaf0] border border-[#28b0ff] rounded-full p-1 md:p-2 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
            aria-label="Próximo item"
          >
            <ChevronRight className="text-[#28b0ff]" size={16} />
            <span className="hidden md:inline"><ChevronRight className="text-[#28b0ff]" size={24} /></span>
          </button>
        )}

        {/* Container do Carrossel - garantir layout horizontal */}
        <div className={`overflow-hidden px-6 md:px-0 ${showArrows ? 'md:mx-8' : ''}`}> 
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores - Visíveis apenas no mobile quando há mais itens que os visíveis */}
        {showArrows && itemsToShow === 1 && (
          <div className="flex justify-center mt-4 space-x-2 md:hidden">
            {Array.from({ length: items.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-[#0029ff]' 
                    : 'bg-[#28b0ff] opacity-50'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navegação por swipe no mobile */}
        <div 
          className="md:hidden"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startX = touch.clientX;
            
            const handleTouchMove = (moveEvent: TouchEvent) => {
              const moveTouch = moveEvent.touches[0];
              const diffX = startX - moveTouch.clientX;
              
              if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                  nextSlide();
                } else {
                  prevSlide();
                }
                document.removeEventListener('touchmove', handleTouchMove);
              }
            };
            
            document.addEventListener('touchmove', handleTouchMove);
            
            const handleTouchEnd = () => {
              document.removeEventListener('touchmove', handleTouchMove);
              document.removeEventListener('touchend', handleTouchEnd);
            };
            
            document.addEventListener('touchend', handleTouchEnd);
          }}
        >
          {/* Área invisível para capturar swipes */}
        </div>
      </div>
    </section>
  );
};

export default ResponsiveCarousel;
