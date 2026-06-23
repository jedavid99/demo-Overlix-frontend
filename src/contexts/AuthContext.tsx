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
          const currentUser = await getMe();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('access_token');
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
    console.log('AuthContext.login llamado con:', { email, codigoEmpresa });
    const response = await loginService(email, password, codigoEmpresa);
    console.log('Respuesta del login:', response);
    
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      console.log('Token guardado en localStorage');
      
      const currentUser = await getMe();
      console.log('Usuario obtenido:', currentUser);
      setUser(currentUser);
      setIsAuthenticated(true);
    } else {
      console.error('No se recibió access_token en la respuesta');
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
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
