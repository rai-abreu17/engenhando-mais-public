// Theme constants and design tokens
export const COLORS = {
  // Paleta de cores exclusiva
  lightBlue: '#f0f6ff',     // Azul muito claro - fundo principal
  lightCream: '#fffaf0',    // Bege muito claro - cards e componentes
  darkNavy: '#030025',      // Azul muito escuro - texto principal
  brightBlue: '#0029ff',    // Azul vibrante - primário
  orange: '#ff7a28',        // Laranja - secundário
  blue: '#001cab',          // Azul escuro - texto secundário
  darkOrange: '#d75200',    // Laranja escuro - gradientes
  skyBlue: '#28b0ff',       // Azul claro - borders e acentos
  gold: '#ffb646',          // Dourado - avisos e destaques
} as const;

export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.skyBlue}, ${COLORS.brightBlue})`,
  secondary: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.darkOrange})`,
  warning: `linear-gradient(135deg, ${COLORS.gold}, #ff9800)`,
  success: `linear-gradient(135deg, #00a86b, #008853)`,
} as const;

export const SPACING = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
} as const;

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px',
} as const;

export const ANIMATIONS = {
  fast: '0.2s ease-out',
  normal: '0.3s ease-out',
  slow: '0.5s ease-out',
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  modal: 1050,
  toast: 1100,
  tooltip: 1200,
} as const;