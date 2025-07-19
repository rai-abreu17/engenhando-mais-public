/**
 * Types para componentes da aplicação
 */

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface IconProps {
  size?: number;
  className?: string;
}

export interface NavigationItem {
  icon: React.ComponentType<IconProps>;
  label: string;
  path: string;
  badge?: string | number;
}

export interface CarouselItem {
  id: string | number;
  title: string;
  [key: string]: any;
}

export interface ResponsiveConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'engenha' | 'outline' | 'ghost';
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface WithVariant {
  variant?: ComponentVariant;
}

export interface WithSize {
  size?: ComponentSize;
}

export interface InteractiveProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}