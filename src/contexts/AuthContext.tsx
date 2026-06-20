import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/auth.service';

interface User {
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);
    setUser(response.user || null);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
