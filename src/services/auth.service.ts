import api, { setAuthToken } from './api';

export const login = async (email: string, password: string, codigoEmpresa: string) => {
  const payload = {
    email,
    contraseña: password,
    codigo_empresa: codigoEmpresa
  };

  try {
    const response = await api.post('/auth/login', payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const register = async (data: any) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  setAuthToken(null);
};