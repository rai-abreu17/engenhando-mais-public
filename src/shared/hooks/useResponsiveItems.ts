import { useState, useEffect } from 'react';

interface UseResponsiveItemsProps {
  mobile: number;
  tablet: number;
  desktop: number;
}

export const useResponsiveItems = ({ mobile, tablet, desktop }: UseResponsiveItemsProps) => {
  const [itemsToShow, setItemsToShow] = useState(mobile);

  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;
      if (width >= 1280) { // xl breakpoint
        setItemsToShow(desktop);
      } else if (width >= 768) { // md breakpoint
        setItemsToShow(tablet);
      } else {
        setItemsToShow(mobile);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, [mobile, tablet, desktop]);

  return itemsToShow;
};
