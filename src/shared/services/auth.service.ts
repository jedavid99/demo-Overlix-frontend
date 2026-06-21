import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const login = async (email: string, password: string, codigoEmpresa: string) => {
  const payload = {
    email,
    contraseña: password,
    codigo_empresa: codigoEmpresa
  };

  try {
    const response = await axios.post(`${API_URL}/auth/login`, payload);
    return response.data;
  } catch (error: any) {
    console.error('Error en login:', error.response?.data);
    throw error;
  }
};

export const getMe = async (token: string) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
