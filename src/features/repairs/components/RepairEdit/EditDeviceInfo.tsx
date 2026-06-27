import React from 'react';
import { Smartphone, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import type { RepairData, FormData } from './RepairEdit.types';

interface EditDeviceInfoProps {
  repairData: RepairData | null;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditDeviceInfo: React.FC<EditDeviceInfoProps> = ({
  repairData,
  formData,
  setFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          Información del Dispositivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Cliente</label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{repairData?.cliente_nombre || '—'}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Teléfono</label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{repairData?.cliente_telefono || '—'}</span>
            </div>
          </div>
        </div>

        {/* Dispositivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Dispositivo</label>
            <Input
              value={formData.dispositivo}
              onChange={(e) => setFormData({ ...formData, dispositivo: e.target.value })}
              placeholder="Tipo de dispositivo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Marca</label>
            <Input
              value={formData.marca}
              onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
              placeholder="Marca"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Modelo</label>
            <Input
              value={formData.modelo}
              onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
              placeholder="Modelo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Número de Serie</label>
            <Input
              value={formData.numero_serie}
              onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
              placeholder="Serial / IMEI"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Condición Estética</label>
          <Textarea
            value={formData.condicion_estetica}
            onChange={(e) => setFormData({ ...formData, condicion_estetica: e.target.value })}
            placeholder="Descripción del estado estético"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Accesorios Incluidos</label>
          <Textarea
            value={formData.accesorios_incluidos}
            onChange={(e) => setFormData({ ...formData, accesorios_incluidos: e.target.value })}
            placeholder="Separar por comas: Cargador, Funda, Cable..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};
