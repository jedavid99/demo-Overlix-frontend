import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getMe } from '../services/auth.service';
import { setAuthToken } from '../services/api';

interface User {
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, codigoEmpresa: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        try {
          setAuthToken(token);
          const currentUser = await getMe();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error al obtener usuario:', error);
          localStorage.removeItem('access_token');
          setAuthToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, codigoEmpresa: string) => {
    const response = await loginService(email, password, codigoEmpresa);
    
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      setAuthToken(response.access_token);
      
      const currentUser = await getMe();
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
