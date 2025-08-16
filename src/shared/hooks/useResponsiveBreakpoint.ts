import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/lib/constants';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Hook para detectar breakpoint atual
 */
export const useResponsiveBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= parseInt(BREAKPOINTS.desktop)) {
        setBreakpoint('desktop');
      } else if (width >= parseInt(BREAKPOINTS.tablet)) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };

    // Verificar no mount
    checkBreakpoint();

    // Listener para mudanças
    window.addEventListener('resize', checkBreakpoint);
    
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
};

/**
 * Hook para verificar se está em mobile
 */
export const useIsMobile = (): boolean => {
  const breakpoint = useResponsiveBreakpoint();
  return breakpoint === 'mobile';
};

/**
 * Hook para verificar se está em desktop
 */
export const useIsDesktop = (): boolean => {
  const breakpoint = useResponsiveBreakpoint();
  return breakpoint === 'desktop';
};