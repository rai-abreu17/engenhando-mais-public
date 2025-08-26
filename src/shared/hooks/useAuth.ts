import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('engenha_token');
      const storedUserType = localStorage.getItem('engenha_user_type');
      if (token) {
        setIsAuthenticated(true);
        setUserType(storedUserType || 'authenticated');
      } else {
        setIsAuthenticated(false);
        setUserType(null);
      }
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Adicionar listener para alterações no localStorage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const login = (token: string, userType?: string) => {
    localStorage.setItem('engenha_token', token);
    const type = userType || 'authenticated';
    localStorage.setItem('engenha_user_type', type);
    setIsAuthenticated(true);
    setUserType(type);
    
    // Disparar evento storage para notificar outros componentes
    window.dispatchEvent(new Event('storage'));
  };

  const logout = () => {
    localStorage.removeItem('engenha_token');
    localStorage.removeItem('engenha_user_type');
    localStorage.removeItem('selectedMascot');
    localStorage.removeItem('unlockedMascots');
    localStorage.removeItem('customMascotNames');
    setIsAuthenticated(false);
    setUserType(null);
    
    // Disparar um evento para informar que o logout foi realizado
    window.dispatchEvent(new Event('storage'));
  };

  return { isAuthenticated, isLoading, userType, login, logout };
};