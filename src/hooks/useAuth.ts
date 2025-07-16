import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('engenha_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('engenha_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('engenha_token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
};
