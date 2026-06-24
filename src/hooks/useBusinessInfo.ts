import { useState, useEffect, useCallback } from 'react';
import { businessInfoService } from '@/services/businessInfoService';
import { BusinessInfo, BusinessInfoUpdate } from '@/types/businessInfo.types';

export const useBusinessInfo = () => {
  const [data, setData] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await businessInfoService.get();
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar información de la empresa');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useBusinessInfoMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBusinessInfo = async (data: BusinessInfoUpdate): Promise<BusinessInfo | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await businessInfoService.update(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar información de la empresa');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLogo = async (file: File): Promise<{ logo_url: string } | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await businessInfoService.updateLogo(file);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar logo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateBusinessInfo, updateLogo };
};
