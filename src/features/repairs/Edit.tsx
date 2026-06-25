import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus, Trash2, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { repairService } from '@/services/repairService';

interface RepairPart {
  id: string;
  nombre: string;
  cantidad: number;
  costo_unitario: number;
}

interface RepairData {
  id: string;
  numero_reparacion?: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  dispositivo: string;
  marca?: string;
  modelo?: string;
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
  estado: string;
  prioridad: string;
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  total_reparacion?: number;
  notas?: string;
  foto_evidencia?: string;
  repuestos?: RepairPart[];
}

export default function RepairEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [repairData, setRepairData] = useState<RepairData | null>(null);
  const [formData, setFormData] = useState({
    problema_reportado: '',
    diagnosis: '',
    reparacion_realizada: '',
    estado: 'diagnostic',
    costo_piezas: 0,
    costo_mano_obra: 0,
    total_reparacion: 0,
    notas: '',
    foto_evidencia: '',
    tecnico_asignado_id: '',
    fecha_estimada_entrega: '',
  });
  const [repuestos, setRepuestos] = useState<RepairPart[]>([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    nombre: '',
    cantidad: 1,
    costo_unitario: 0,
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (id) {
      loadRepairData(id);
    }
  }, [id]);

  const loadRepairData = async (repairId: string) => {
    try {
      setLoading(true);
      const response = await repairService.getById(repairId) as any;
      const orderData = response?.data?.data || response?.data || response;
      
      setRepairData(orderData);
      setFormData({
        problema_reportado: orderData.problema_reportado || '',
        diagnosis: orderData.diagnosis || '',
        reparacion_realizada: orderData.reparacion_realizada || '',
        estado: orderData.estado || 'diagnostic',
        costo_piezas: orderData.costo_piezas || 0,
        costo_mano_obra: orderData.costo_mano_obra || 0,
        total_reparacion: orderData.total_reparacion || 0,
        notas: orderData.notas || '',
        foto_evidencia: orderData.foto_evidencia || '',
        tecnico_asignado_id: orderData.tecnico_asignado_id || '',
        fecha_estimada_entrega: orderData.fecha_estimada_entrega || '',
      });
      setRepuestos(orderData.repuestos || []);
    } catch (error: any) {
      console.error('Error al cargar reparación:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la reparación',
        variant: 'destructive'
      });
      navigate('/reparaciones/list');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!repairData) return;

    try {
      setSaving(true);
      
      // Validar transición de estado según backend
      const validTransitions: Record<string, string[]> = {
        'diagnostic': ['in_progress', 'cancelled'],
        'in_progress': ['waiting_parts', 'testing', 'completed', 'cancelled'],
        'waiting_parts': ['in_progress', 'cancelled'],
        'testing': ['in_progress', 'completed', 'cancelled'],
        'completed': [],
        'cancelled': [],
      };

      // Construir payload con todos los campos que tienen valores
      const payload: any = {};
      
      // Solo incluir estado si cambió y es una transición válida
      if (formData.estado !== repairData.estado) {
        const allowedTransitions = validTransitions[repairData.estado] || [];
        if (!allowedTransitions.includes(formData.estado)) {
          toast({
            title: 'Error',
            description: `No puedes cambiar de "${repairData.estado}" a "${formData.estado}". Transición no válida.`,
            variant: 'destructive'
          });
          setSaving(false);
          return;
        }
        payload.estado = formData.estado;
      }
      
      // PRUEBA BÁSICA: Solo enviar problema_reportado y diagnosis
      if (formData.problema_reportado) payload.problema_reportado = formData.problema_reportado;
      if (formData.diagnosis) payload.diagnosis = formData.diagnosis;
      
      // Campos comentados para prueba
      // if (formData.reparacion_realizada) payload.reparacion_realizada = formData.reparacion_realizada;
      // if (formData.notas) payload.notas = formData.notas;
      // if (formData.costo_piezas > 0) payload.costo_piezas = formData.costo_piezas;
      // if (formData.costo_mano_obra > 0) payload.costo_mano_obra = formData.costo_mano_obra;
      // if (formData.total_reparacion > 0) payload.total_reparacion = formData.total_reparacion;

      console.log('Payload enviado:', payload);
      
      // Verificar si hay cambios para enviar
      if (Object.keys(payload).length === 0) {
        toast({
          title: 'Aviso',
          description: 'No hay cambios para guardar',
          variant: 'default'
        });
        setSaving(false);
        return;
      }
      
      await repairService.update(repairData.id, payload);
      
      toast({
        title: 'Éxito',
        description: 'Reparación actualizada correctamente',
      });
      
      navigate('/reparaciones/list');
    } catch (error: any) {
      console.error('Error al actualizar reparación:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar la reparación',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddRepuesto = () => {
    if (!nuevoRepuesto.nombre || nuevoRepuesto.cantidad <= 0) {
      toast({
        title: 'Error',
        description: 'Complete los datos del repuesto',
        variant: 'destructive'
      });
      return;
    }

    const repuesto: RepairPart = {
      id: Date.now().toString(),
      nombre: nuevoRepuesto.nombre,
      cantidad: nuevoRepuesto.cantidad,
      costo_unitario: nuevoRepuesto.costo_unitario,
    };

    setRepuestos([...repuestos, repuesto]);
    setNuevoRepuesto({ nombre: '', cantidad: 1, costo_unitario: 0 });
  };

  const handleRemoveRepuesto = (repuestoId: string) => {
    setRepuestos(repuestos.filter(r => r.id !== repuestoId));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      // Aquí deberías implementar la subida de la foto a tu servicio de almacenamiento
      // Por ahora, simulamos la subida con una URL temporal
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto_evidencia: reader.result as string });
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error al subir foto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la foto',
        variant: 'destructive'
      });
      setUploadingPhoto(false);
    }
  };

  const calculateTotal = () => {
    const repuestosTotal = repuestos.reduce((sum, r) => sum + (r.cantidad * r.costo_unitario), 0);
    return repuestosTotal;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!repairData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No se encontró la reparación</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/reparaciones/list')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar Reparación</h1>
            <p className="text-sm text-muted-foreground">
              {repairData.numero_reparacion || repairData.id?.substring(0, 8)}
            </p>
          </div>
        </div>

        {/* Información del cliente y dispositivo */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Cliente</label>
                <p className="text-foreground font-medium">{repairData.cliente_nombre || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Teléfono</label>
                <p className="text-foreground">{repairData.cliente_telefono || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Dispositivo</label>
                <p className="text-foreground font-medium">{repairData.dispositivo || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Marca/Modelo</label>
                <p className="text-foreground">
                  {repairData.marca && repairData.modelo ? `${repairData.marca} ${repairData.modelo}` : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problema y Diagnóstico */}
        <Card>
          <CardHeader>
            <CardTitle>Problema y Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Problema Reportado</label>
              <Textarea
                value={formData.problema_reportado}
                onChange={(e) => setFormData({ ...formData, problema_reportado: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Diagnóstico</label>
              <Textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Campos comentados para prueba */}
        {/* Estado */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Estado de la Reparación</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diagnostic">Diagnóstico</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="waiting_parts">Esperando Repuestos</SelectItem>
                <SelectItem value="testing">Pruebas</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card> */}

        {/* Repuestos */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Repuestos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Nombre del repuesto"
                value={nuevoRepuesto.nombre}
                onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, nombre: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Cantidad"
                value={nuevoRepuesto.cantidad}
                onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, cantidad: parseInt(e.target.value) || 0 })}
                min={1}
              />
              <Input
                type="number"
                placeholder="Costo unitario"
                value={nuevoRepuesto.costo_unitario}
                onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, costo_unitario: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
              />
              <Button onClick={handleAddRepuesto}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>

            {repuestos.length > 0 && (
              <div className="space-y-2">
                {repuestos.map((repuesto) => (
                  <div key={repuesto.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{repuesto.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {repuesto.cantidad} x ${repuesto.costo_unitario.toFixed(2)} = ${(repuesto.cantidad * repuesto.costo_unitario).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRepuesto(repuesto.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total Repuestos:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Costos */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Costos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Costo de Piezas</label>
              <Input
                type="number"
                value={formData.costo_piezas}
                onChange={(e) => setFormData({ ...formData, costo_piezas: parseFloat(e.target.value) || 0 })}
                placeholder="Costo de piezas"
                min={0}
                step={0.01}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Costo de Mano de Obra</label>
              <Input
                type="number"
                value={formData.costo_mano_obra}
                onChange={(e) => setFormData({ ...formData, costo_mano_obra: parseFloat(e.target.value) || 0 })}
                placeholder="Costo de mano de obra"
                min={0}
                step={0.01}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Total de Reparación</label>
              <Input
                type="number"
                value={formData.total_reparacion}
                onChange={(e) => setFormData({ ...formData, total_reparacion: parseFloat(e.target.value) || 0 })}
                placeholder="Precio total de la reparación"
                min={0}
                step={0.01}
              />
            </div>
          </CardContent>
        </Card> */}

        {/* Asignación */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Asignación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">ID del Técnico</label>
              <Input
                value={formData.tecnico_asignado_id}
                onChange={(e) => setFormData({ ...formData, tecnico_asignado_id: e.target.value })}
                placeholder="UUID del técnico asignado"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Fecha Estimada de Entrega</label>
              <Input
                type="datetime-local"
                value={formData.fecha_estimada_entrega}
                onChange={(e) => setFormData({ ...formData, fecha_estimada_entrega: e.target.value })}
              />
            </div>
          </CardContent>
        </Card> */}

        {/* Foto de Evidencia */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Foto de Evidencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sube una foto del equipo desarmado para documentar irregularidades o daños encontrados.
            </p>
            
            {formData.foto_evidencia ? (
              <div className="relative">
                <img
                  src={formData.foto_evidencia}
                  alt="Evidencia"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData({ ...formData, foto_evidencia: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Haz clic para subir una foto
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button asChild disabled={uploadingPhoto}>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingPhoto ? 'Subiendo...' : 'Subir Foto'}
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Notas */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              rows={3}
              placeholder="Notas adicionales..."
            />
          </CardContent>
        </Card> */}

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/reparaciones/list')}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
