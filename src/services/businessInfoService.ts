import api from './api';
import { BusinessInfo, BusinessInfoUpdate } from '@/types/businessInfo.types';

export const businessInfoService = {
  // Obtener información de la empresa
  get: (): Promise<BusinessInfo> => {
    return api.get('/api/business-info').then(res => res.data);
  },

  // Actualizar información de la empresa
  update: (data: BusinessInfoUpdate): Promise<BusinessInfo> => {
    return api.put('/api/business-info', data).then(res => res.data);
  },

  // Actualizar logo
  updateLogo: (logoUrl: string): Promise<{ logo_url: string }> => {
    return api.put('/api/business-info/logo', { logo_url: logoUrl }).then(res => res.data);
  }
};
