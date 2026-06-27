import React, { useRef, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { repair_statusOptions } from './RepairEdit.types';
import type { FormData } from './RepairEdit.types';

interface EditStatusFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditStatusForm: React.FC<EditStatusFormProps> = ({
  formData,
  setFormData,
}) => {
  const estadoRef = useRef<HTMLDivElement>(null);
  const [isEstadoOpen, setIsEstadoOpen] = React.useState(false);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (estadoRef.current && !estadoRef.current.contains(event.target as Node)) {
        setIsEstadoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CurrentIcon = repair_statusOptions.find(o => o.value === formData.repair_status)?.icon || repair_statusOptions[0].icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Estado y Diagnóstico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado - Custom Dropdown */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Estado</label>
          <div className="relative" ref={estadoRef}>
            <button
              type="button"
              onClick={() => setIsEstadoOpen(!isEstadoOpen)}
              className="w-full h-9 flex items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center gap-2">
                <CurrentIcon className="h-4 w-4 text-muted-foreground" />
                {repair_statusOptions.find(o => o.value === formData.repair_status)?.label || 'Seleccionar'}
              </span>
              <svg
                className={`h-4 w-4 text-muted-foreground transition-transform ${isEstadoOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isEstadoOpen && (
              <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-white shadow-lg overflow-hidden">
                {repair_statusOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, repair_status: option.value });
                        setIsEstadoOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                        formData.repair_status === option.value ? 'bg-gray-50 font-medium' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {option.label}
                      {formData.repair_status === option.value && (
                        <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Problema Reportado */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Problema Reportado</label>
          <Textarea
            value={formData.problema_reportado}
            onChange={(e) => setFormData({ ...formData, problema_reportado: e.target.value })}
            placeholder="Descripción del problema"
            rows={3}
          />
        </div>

        {/* Diagnóstico */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Diagnóstico</label>
          <Textarea
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            placeholder="Diagnóstico técnico"
            rows={3}
          />
        </div>

        {/* Reparación Realizada */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Reparación Realizada</label>
          <Textarea
            value={formData.reparacion_realizada}
            onChange={(e) => setFormData({ ...formData, reparacion_realizada: e.target.value })}
            placeholder="Descripción de la reparación realizada"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
