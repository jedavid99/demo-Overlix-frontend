import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getMe } from '../services/auth.service';
import { clearAuthToken } from '../services/api';

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
          clearAuthToken();
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
    console.log('Respuesta completa del login:', response);
    
    // El backend envuelve la respuesta en {success: true, data: {token, refreshToken, usuario}}
    // Por lo tanto el token está en response.data.data.token
    const token = response.data?.data?.token;
    
    if (token) {
      localStorage.setItem('access_token', token);
      console.log('Token guardado en localStorage:', token);
      
      // El usuario ya viene en la respuesta, no necesitamos llamar a getMe
      const usuario = response.data?.data?.usuario;
      console.log('Usuario obtenido de la respuesta:', usuario);
      setUser(usuario);
      setIsAuthenticated(true);
    } else {
      console.error('No se recibió token en la respuesta');
      console.error('Estructura completa de response:', JSON.stringify(response, null, 2));
    }
  };

  const logout = () => {
    // Eliminar token de localStorage y headers de Axios
    clearAuthToken();
    // Llamar al servicio de logout del backend (opcional)
    logoutService();
    // Limpiar estado de autenticación
    setUser(null);
    setIsAuthenticated(false);
    // Redirigir al login
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
