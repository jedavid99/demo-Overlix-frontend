import api from './api';

export const login = async (email: string, password: string, codigoEmpresa: string) => {
  const payload = {
    email,
    contraseña: password,
    codigo_empresa: codigoEmpresa
  };

  console.log('auth.service.login payload:', payload);

  try {
    const response = await api.post('/auth/login', payload);
    console.log('auth.service.login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('auth.service.login error:', error);
    throw error;
  }
};

export const getMe = async () => {
  console.log('auth.service.getMe llamado');
  const response = await api.get('/auth/me');
  console.log('auth.service.getMe response:', response.data);
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
};