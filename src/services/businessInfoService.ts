import api from './api';
import { BusinessInfo, BusinessInfoUpdate } from '@/types/businessInfo.types';

export const businessInfoService = {
  // Obtener información de la empresa
  get: (): Promise<BusinessInfo> => {
    return api.get('/business-info').then(res => res.data);
  },

  // Actualizar información de la empresa
  update: (data: BusinessInfoUpdate): Promise<BusinessInfo> => {
    return api.put('/business-info', data).then(res => res.data);
  },

  // Actualizar logo
  updateLogo: (file: File): Promise<{ logo_url: string }> => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/business-info/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  }
};
