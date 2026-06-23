import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para establecer el token en los headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Interceptor request: agrega token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Rutas públicas que no deben redirigir en caso de 401
const publicRoutes = ['/auth/login', '/auth/register'];

// Interceptor response: maneja 401 solo en rutas protegidas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Verificar si es 401 y NO es una ruta pública
    if (error.response?.status === 401) {
      const isPublicRoute = publicRoutes.some(route => 
        originalRequest.url?.includes(route)
      );
      
      if (!isPublicRoute) {
        // Eliminar token y redirigir solo en rutas protegidas
        localStorage.removeItem('access_token');
        setAuthToken(null);
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      window.location.href = '/unauthorized';
    }
    
    return Promise.reject(error);
  }
);

export default api;
