import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Search, Wrench, Clock, CheckCircle, Package, XCircle, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { repairService } from '@/services/repairService';
import { createPortal } from 'react-dom';

interface EditStatusModalProps {
  open: boolean;
  onClose: () => void;
  repairId: string;
  currentStatus: string;
  onSuccess: () => void;
}

// Estados en inglés (coinciden con el backend)
const statusOptions = [
  { value: 'pending', label: 'Pendiente', icon: Search },
  { value: 'diagnostic', label: 'Diagnóstico', icon: Search },
  { value: 'in_progress', label: 'En Progreso', icon: Wrench },
  { value: 'waiting_parts', label: 'Esperando Repuestos', icon: Clock },
  { value: 'ready', label: 'Listo', icon: CheckCircle },
  { value: 'delivered', label: 'Entregado', icon: Package },
  { value: 'cancelled', label: 'Cancelado', icon: XCircle },
];

// Transiciones válidas (claves en inglés)
const validTransitions: Record<string, string[]> = {
  pending: ['diagnostic', 'cancelled'],
  diagnostic: ['in_progress', 'cancelled'],
  in_progress: ['waiting_parts', 'ready', 'cancelled'],
  waiting_parts: ['in_progress', 'ready', 'cancelled'],
  ready: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const EditStatusModal: React.FC<EditStatusModalProps> = ({
  open,
  onClose,
  repairId,
  currentStatus,
  onSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const ref = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Resetear selección al abrir
  useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
      setIsOpen(false);
    }
  }, [open, currentStatus]);

  // Calcular posición del dropdown al abrir
  const handleToggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = statusOptions.find(opt => opt.value === selectedStatus);
  const CurrentIcon = currentOption?.icon || statusOptions[0].icon;

  // Estados permitidos desde el estado actual
  const allowedTransitions = validTransitions[currentStatus] || [];
  const availableOptions = statusOptions.filter(opt =>
    opt.value === currentStatus || allowedTransitions.includes(opt.value)
  );

  const handleSave = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    if (!allowedTransitions.includes(selectedStatus)) {
      toast({
        title: 'Error',
        description: `No puedes cambiar de "${currentStatus}" a "${selectedStatus}". Transición no válida.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      await repairService.update(repairId, { estado: selectedStatus });

      toast({
        title: 'Éxito',
        description: 'Estado actualizado correctamente',
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Estado de Reparación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Estado Actual
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <CurrentIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{currentOption?.label || currentStatus}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nuevo Estado
            </label>
            <div className="relative" ref={ref}>
              <button
                type="button"
                ref={buttonRef}
                onClick={handleToggleDropdown}
                className="w-full h-10 flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center gap-2">
                  <CurrentIcon className="h-4 w-4 text-muted-foreground" />
                  {currentOption?.label || 'Seleccionar'}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && createPortal(
                <div
                  className="fixed z-[9999] rounded-md border border-border bg-white shadow-lg overflow-hidden"
                  style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    width: `${dropdownPosition.width}px`,
                  }}
                >
                  {availableOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = option.value === selectedStatus;
                    const isDisabled = !allowedTransitions.includes(option.value) && option.value !== currentStatus;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedStatus(option.value);
                            setIsOpen(false);
                          }
                        }}
                        disabled={isDisabled}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-100'
                        } ${isSelected ? 'bg-gray-50 font-medium' : ''}`}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{option.label}</span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>,
                document.body
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Solo puedes cambiar a estados permitidos por la transición
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || selectedStatus === currentStatus}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 