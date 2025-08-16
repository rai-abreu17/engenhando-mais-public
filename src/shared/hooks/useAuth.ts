import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // Mock implementation for standalone use
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
      setIsLoading(true);
      try {
        // Mock login - replace with actual authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user based on email domain
        let role: 'student' | 'teacher' | 'admin' = 'student';
        if (email.includes('professor') || email.includes('teacher')) {
          role = 'teacher';
        } else if (email.includes('admin')) {
          role = 'admin';
        }

        const mockUser: User = {
          id: Math.random().toString(36),
          name: email.split('@')[0],
          email,
          role
        };

        setUser(mockUser);
        localStorage.setItem('auth-user', JSON.stringify(mockUser));
      } catch (error) {
        throw new Error('Falha na autenticação');
      } finally {
        setIsLoading(false);
      }
    };

    const logout = () => {
      setUser(null);
      localStorage.removeItem('auth-user');
    };

    // Load user from localStorage on mount
    useEffect(() => {
      const storedUser = localStorage.getItem('auth-user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('auth-user');
        }
      }
    }, []);

    return {
      user,
      login,
      logout,
      isLoading,
      isAuthenticated: !!user,
      userType: user?.role || null
    };
  }
  return context;
};