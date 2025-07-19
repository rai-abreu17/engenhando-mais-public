import React from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  navigation?: React.ReactNode;
  className?: string;
  withPadding?: boolean;
  fullHeight?: boolean;
}

/**
 * Layout padrão para páginas da aplicação
 * Gerencia o espaçamento, navegação e estrutura base
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  header,
  navigation,
  className,
  withPadding = true,
  fullHeight = true,
}) => {
  return (
    <div 
      className={cn(
        "bg-background",
        fullHeight && "min-h-screen",
        navigation && "pb-20", // Espaço para navegação fixa
        className
      )}
    >
      {header}
      
      <main 
        className={cn(
          "flex-1",
          withPadding && "px-4 sm:px-6 lg:px-8",
          header && "pt-4"
        )}
      >
        {children}
      </main>
      
      {navigation}
    </div>
  );
};

export default PageLayout;