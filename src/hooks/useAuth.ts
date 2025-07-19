import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('engenha_token');
    const storedUserType = localStorage.getItem('engenha_user_type');
    if (token) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userType?: string) => {
    localStorage.setItem('engenha_token', token);
    const type = userType || 'student';
    localStorage.setItem('engenha_user_type', type);
    setIsAuthenticated(true);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem('engenha_token');
    localStorage.removeItem('engenha_user_type');
    setIsAuthenticated(false);
    setUserType(null);
  };

  return { isAuthenticated, isLoading, userType, login, logout };
};
