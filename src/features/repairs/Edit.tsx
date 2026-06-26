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

  // ✅ Estado completo del formulario
  const [formData, setFormData] = useState({
    // Diagnóstico
    problema_reportado: '',
    diagnosis: '',
    reparacion_realizada: '',
    
    // Estado
    estado: 'diagnostic',
    
    // Costos
    costo_piezas: 0,
    costo_mano_obra: 0,
    total_reparacion: 0,
    
    // Notas y evidencia
    notas: '',
    foto_evidencia: '',
    
    // Asignación
    tecnico_asignado_id: '',
    fecha_estimada_entrega: '',
    
    // Dispositivo
    categoria_dispositivo: '',
    dispositivo: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    condicion_estetica: '',
    accesorios_incluidos: '',
    tiempo_estimado_minutos: 0,
    
    // Pago
    pagado: false,
    metodo_pago: '',
    monto_pagado: 0,
    
    // Seguridad
    tipo_seguridad: 'none',
    pin_acceso: '',
    patron_puntos: '',
    secuencia_patron: '',
    
    // Hardware
    chequeo_hardware: '',
  });

  const [repuestos, setRepuestos] = useState<RepairPart[]>([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    nombre: '',
    cantidad: 1,
    costo_unitario: 0,
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  // Cargar datos de la reparación
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

      // Mapear todos los campos
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
        categoria_dispositivo: orderData.categoria_dispositivo || '',
        dispositivo: orderData.dispositivo || '',
        marca: orderData.marca || '',
        modelo: orderData.modelo || '',
        numero_serie: orderData.numero_serie || '',
        condicion_estetica: orderData.condicion_estetica || '',
        accesorios_incluidos: Array.isArray(orderData.accesorios_incluidos)
          ? orderData.accesorios_incluidos.join(', ')
          : orderData.accesorios_incluidos || '',
        tiempo_estimado_minutos: orderData.tiempo_estimado_minutos || 0,
        pagado: orderData.pagado || false,
        metodo_pago: orderData.metodo_pago || '',
        monto_pagado: orderData.monto_pagado || 0,
        tipo_seguridad: orderData.tipo_seguridad || 'none',
        pin_acceso: orderData.pin_acceso || '',
        patron_puntos: Array.isArray(orderData.patron_puntos)
          ? orderData.patron_puntos.join(', ')
          : orderData.patron_puntos || '',
        secuencia_patron: Array.isArray(orderData.secuencia_patron)
          ? orderData.secuencia_patron.join(', ')
          : orderData.secuencia_patron || '',
        chequeo_hardware:
          typeof orderData.chequeo_hardware === 'object'
            ? JSON.stringify(orderData.chequeo_hardware, null, 2)
            : orderData.chequeo_hardware || '',
      });

      setRepuestos(orderData.repuestos || []);
    } catch (error: any) {
      console.error('Error al cargar reparación:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la reparación',
        variant: 'destructive',
      });
      navigate('/reparaciones/list');
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!repairData) return;

    try {
      setSaving(true);

      // Validar transiciones de estado
      const validTransitions: Record<string, string[]> = {
        diagnostic: ['in_progress', 'cancelled'],
        in_progress: ['waiting_parts', 'testing', 'completed', 'cancelled'],
        waiting_parts: ['in_progress', 'cancelled'],
        testing: ['in_progress', 'completed', 'cancelled'],
        completed: [],
        cancelled: [],
      };

      const payload: any = {};

      // Validar cambio de estado
      if (formData.estado !== repairData.estado) {
        const allowed = validTransitions[repairData.estado] || [];
        if (!allowed.includes(formData.estado)) {
          toast({
            title: 'Error',
            description: `No puedes cambiar de "${repairData.estado}" a "${formData.estado}". Transición no válida.`,
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
        payload.estado = formData.estado;
      }

      // Campos de diagnóstico
      if (formData.problema_reportado) payload.problema_reportado = formData.problema_reportado;
      if (formData.diagnosis) payload.diagnosis = formData.diagnosis;
      if (formData.reparacion_realizada) payload.reparacion_realizada = formData.reparacion_realizada;
      if (formData.notas) payload.notas = formData.notas;

      // Costos
      if (formData.costo_piezas > 0) payload.costo_piezas = formData.costo_piezas;
      if (formData.costo_mano_obra > 0) payload.costo_mano_obra = formData.costo_mano_obra;
      if (formData.total_reparacion > 0) payload.total_reparacion = formData.total_reparacion;

      // Evidencia
      if (formData.foto_evidencia) payload.foto_evidencia = formData.foto_evidencia;

      // Asignación
      if (formData.tecnico_asignado_id) payload.tecnico_asignado_id = formData.tecnico_asignado_id;
      if (formData.fecha_estimada_entrega) payload.fecha_estimada_entrega = formData.fecha_estimada_entrega;

      // Dispositivo
      if (formData.categoria_dispositivo) payload.categoria_dispositivo = formData.categoria_dispositivo;
      if (formData.dispositivo) payload.dispositivo = formData.dispositivo;
      if (formData.marca) payload.marca = formData.marca;
      if (formData.modelo) payload.modelo = formData.modelo;
      if (formData.numero_serie) payload.numero_serie = formData.numero_serie;
      if (formData.condicion_estetica) payload.condicion_estetica = formData.condicion_estetica;
      if (formData.accesorios_incluidos) {
        payload.accesorios_incluidos = formData.accesorios_incluidos
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);
      }
      if (formData.tiempo_estimado_minutos > 0) {
        payload.tiempo_estimado_minutos = formData.tiempo_estimado_minutos;
      }

      // Pago
      payload.pagado = formData.pagado;
      if (formData.metodo_pago) payload.metodo_pago = formData.metodo_pago;
      if (formData.monto_pagado !== undefined) payload.monto_pagado = formData.monto_pagado;

      // Seguridad
      if (formData.tipo_seguridad && formData.tipo_seguridad !== 'none') {
        payload.tipo_seguridad = formData.tipo_seguridad;
      }
      if (formData.pin_acceso) payload.pin_acceso = formData.pin_acceso;
      if (formData.patron_puntos) {
        payload.patron_puntos = formData.patron_puntos
          .split(',')
          .map((s) => parseInt(s.trim()))
          .filter((n) => !isNaN(n));
      }
      if (formData.secuencia_patron) {
        payload.secuencia_patron = formData.secuencia_patron
          .split(',')
          .map((s) => parseInt(s.trim()))
          .filter((n) => !isNaN(n));
      }

      // Hardware
      if (formData.chequeo_hardware) {
        try {
          payload.chequeo_hardware = JSON.parse(formData.chequeo_hardware);
        } catch (e) {
          console.error('Error parsing chequeo_hardware:', e);
        }
      }

      // Repuestos
      if (repuestos.length > 0) payload.repuestos = repuestos;

      console.log('📦 Payload enviado:', payload);

      if (Object.keys(payload).length === 0) {
        toast({
          title: 'Aviso',
          description: 'No hay cambios para guardar',
          variant: 'default',
        });
        setSaving(false);
        return;
      }

      await repairService.update(repairData.id, payload);

      toast({
        title: 'Éxito',
        description: 'Reparación actualizada correctamente',
      });

      navigate('/reparaciones/list', { state: { reload: true } });
    } catch (error: any) {
      console.error('Error al actualizar reparación:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar la reparación',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Manejo de repuestos
  const handleAddRepuesto = () => {
    if (!nuevoRepuesto.nombre || nuevoRepuesto.cantidad <= 0) {
      toast({
        title: 'Error',
        description: 'Complete los datos del repuesto',
        variant: 'destructive',
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
    setRepuestos(repuestos.filter((r) => r.id !== repuestoId));
  };

  // Manejo de foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
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
        variant: 'destructive',
      });
      setUploadingPhoto(false);
    }
  };

  const calculateTotalRepuestos = () => {
    return repuestos.reduce((sum, r) => sum + r.cantidad * r.costo_unitario, 0);
  };

  // Estado de carga
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/reparaciones/list')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar Reparación</h1>
            <p className="text-sm text-muted-foreground">
              {repairData.numero_reparacion || repairData.id?.substring(0, 8)}
            </p>
          </div>
        </div>

        {/* 1. Información del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Cliente</label>
              <p className="text-foreground font-medium">{repairData.cliente_nombre || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Teléfono</label>
              <p className="text-foreground">{repairData.cliente_telefono || '—'}</p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Dispositivo */}
        <Card>
          <CardHeader>
            <CardTitle>Dispositivo</CardTitle>
            <p className="text-sm text-muted-foreground">Datos del equipo que se repara</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Categoría *</label>
                <Select
                  value={formData.categoria_dispositivo}
                  onValueChange={(value) => setFormData({ ...formData, categoria_dispositivo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telefono">📱 Teléfono</SelectItem>
                    <SelectItem value="pc">💻 PC / Laptop</SelectItem>
                    <SelectItem value="laptop">💻 Laptop</SelectItem>
                    <SelectItem value="consola">🎮 Consola</SelectItem>
                    <SelectItem value="tablet">📱 Tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Dispositivo *</label>
                <Input
                  value={formData.dispositivo}
                  onChange={(e) => setFormData({ ...formData, dispositivo: e.target.value })}
                  placeholder="Ej: iPhone 13, MacBook Pro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Marca</label>
                <Input
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  placeholder="Ej: Apple, Samsung"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Modelo</label>
                <Input
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  placeholder="Ej: A2845, S23"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Número de Serie</label>
              <Input
                value={formData.numero_serie}
                onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                placeholder="Número de serie del dispositivo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Condición Estética</label>
              <Textarea
                value={formData.condicion_estetica}
                onChange={(e) => setFormData({ ...formData, condicion_estetica: e.target.value })}
                placeholder="Rayones, golpes, estado general del equipo"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Accesorios Incluidos</label>
              <Input
                value={formData.accesorios_incluidos}
                onChange={(e) => setFormData({ ...formData, accesorios_incluidos: e.target.value })}
                placeholder="Cargador, funda, audífonos (separados por comas)"
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle>Seguridad del Dispositivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tipo de Seguridad</label>
              <Select
                value={formData.tipo_seguridad}
                onValueChange={(value) => setFormData({ ...formData, tipo_seguridad: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ninguno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">🔓 Ninguno</SelectItem>
                  <SelectItem value="pin">🔢 PIN</SelectItem>
                  <SelectItem value="patron">🎨 Patrón</SelectItem>
                  <SelectItem value="huella">👆 Huella</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.tipo_seguridad === 'pin' && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">PIN de Acceso</label>
                <Input
                  value={formData.pin_acceso}
                  onChange={(e) => setFormData({ ...formData, pin_acceso: e.target.value })}
                  placeholder="4-10 dígitos"
                  maxLength={10}
                />
              </div>
            )}

            {formData.tipo_seguridad === 'patron' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Puntos del Patrón</label>
                  <Input
                    value={formData.patron_puntos}
                    onChange={(e) => setFormData({ ...formData, patron_puntos: e.target.value })}
                    placeholder="Ej: 1,2,3,4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Secuencia del Patrón</label>
                  <Input
                    value={formData.secuencia_patron}
                    onChange={(e) => setFormData({ ...formData, secuencia_patron: e.target.value })}
                    placeholder="Ej: 1,2,3,4"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 4. Problema y Diagnóstico */}
        <Card>
          <CardHeader>
            <CardTitle>Problema y Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Problema Reportado *</label>
              <Textarea
                value={formData.problema_reportado}
                onChange={(e) => setFormData({ ...formData, problema_reportado: e.target.value })}
                rows={3}
                placeholder="Descripción detallada del problema reportado por el cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Diagnóstico</label>
              <Textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                rows={3}
                placeholder="Diagnóstico técnico del problema"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Reparación Realizada</label>
              <Textarea
                value={formData.reparacion_realizada}
                onChange={(e) => setFormData({ ...formData, reparacion_realizada: e.target.value })}
                rows={3}
                placeholder="Descripción de la reparación realizada"
              />
            </div>
          </CardContent>
        </Card>

        {/* 5. Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de la Reparación</CardTitle>
            <p className="text-sm text-muted-foreground">
              Estado actual:{' '}
              <Badge
                className={`
                  ${
                    formData.estado === 'diagnostic'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : formData.estado === 'in_progress'
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                      : formData.estado === 'waiting_parts'
                      ? 'bg-orange-100 text-orange-800 border-orange-300'
                      : formData.estado === 'testing'
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : formData.estado === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                  }
                `}
              >
                {formData.estado === 'diagnostic' && 'Diagnóstico'}
                {formData.estado === 'in_progress' && 'En Progreso'}
                {formData.estado === 'waiting_parts' && 'Esperando Repuestos'}
                {formData.estado === 'testing' && 'Pruebas'}
                {formData.estado === 'completed' && 'Completado'}
                {formData.estado === 'cancelled' && 'Cancelado'}
              </Badge>
            </p>
          </CardHeader>
          <CardContent>
            <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diagnostic">🔍 Diagnóstico</SelectItem>
                <SelectItem value="in_progress">⚙️ En Progreso</SelectItem>
                <SelectItem value="waiting_parts">⏳ Esperando Repuestos</SelectItem>
                <SelectItem value="testing">🧪 Pruebas</SelectItem>
                <SelectItem value="completed">✅ Completado</SelectItem>
                <SelectItem value="cancelled">❌ Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Cambiar el estado puede afectar los permisos y notificaciones.
            </p>
          </CardContent>
        </Card>

        {/* 6. Costos */}
        <Card>
          <CardHeader>
            <CardTitle>Costos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Costo de Mano de Obra</label>
              <Input
                type="number"
                value={formData.costo_mano_obra}
                onChange={(e) =>
                  setFormData({ ...formData, costo_mano_obra: parseFloat(e.target.value) || 0 })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, total_reparacion: parseFloat(e.target.value) || 0 })
                }
                placeholder="Precio total de la reparación"
                min={0}
                step={0.01}
              />
            </div>
            <div className="flex items-center justify-between rounded-md bg-primary/5 p-3 border border-primary/20">
              <span className="text-sm font-medium text-foreground">Total Repuestos</span>
              <span className="text-sm font-bold text-primary">{formatCurrency(calculateTotalRepuestos())}</span>
            </div>
          </CardContent>
        </Card>

        {/* 7. Repuestos */}
        <Card>
          <CardHeader>
            <CardTitle>Repuestos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                placeholder="Nombre del repuesto"
                value={nuevoRepuesto.nombre}
                onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, nombre: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Cantidad"
                value={nuevoRepuesto.cantidad}
                onChange={(e) =>
                  setNuevoRepuesto({ ...nuevoRepuesto, cantidad: parseInt(e.target.value) || 0 })
                }
                min={1}
              />
              <Input
                type="number"
                placeholder="Costo unitario"
                value={nuevoRepuesto.costo_unitario}
                onChange={(e) =>
                  setNuevoRepuesto({ ...nuevoRepuesto, costo_unitario: parseFloat(e.target.value) || 0 })
                }
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
                        {repuesto.cantidad} x {formatCurrency(repuesto.costo_unitario)} ={' '}
                        {formatCurrency(repuesto.cantidad * repuesto.costo_unitario)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRepuesto(repuesto.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 8. Asignación */}
        <Card>
          <CardHeader>
            <CardTitle>Asignación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Técnico Asignado</label>
              <Input
                value={formData.tecnico_asignado_id}
                onChange={(e) => setFormData({ ...formData, tecnico_asignado_id: e.target.value })}
                placeholder="Nombre o ID del técnico"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Fecha Estimada de Entrega</label>
              <Input
                type="date"
                value={formData.fecha_estimada_entrega}
                onChange={(e) => setFormData({ ...formData, fecha_estimada_entrega: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tiempo Estimado (minutos)</label>
              <Input
                type="number"
                value={formData.tiempo_estimado_minutos}
                onChange={(e) =>
                  setFormData({ ...formData, tiempo_estimado_minutos: parseInt(e.target.value) || 0 })
                }
                placeholder="Minutos estimados para la reparación"
                min={0}
                step={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* 9. Pago */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pagado"
                checked={formData.pagado}
                onChange={(e) => {
                  const isPaid = e.target.checked;
                  setFormData({
                    ...formData,
                    pagado: isPaid,
                    monto_pagado: isPaid ? formData.total_reparacion : 0,
                  });
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="pagado" className="text-sm font-medium text-foreground">
                {formData.pagado ? '✅ Pagado completo' : '❌ Pendiente de pago'}
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Método de Pago</label>
              <Select
                value={formData.metodo_pago}
                onValueChange={(value) => setFormData({ ...formData, metodo_pago: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">💵 Efectivo</SelectItem>
                  <SelectItem value="transferencia">🏦 Transferencia Bancaria</SelectItem>
                  <SelectItem value="tarjeta">💳 Tarjeta de Crédito</SelectItem>
                  <SelectItem value="cuotas">📆 Cuotas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!formData.pagado && (
              <>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Monto Pagado</label>
                  <Input
                    type="number"
                    min={0}
                    max={formData.total_reparacion || 0}
                    step={0.01}
                    value={formData.monto_pagado ?? 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        monto_pagado: Math.min(value, formData.total_reparacion || 0),
                      });
                    }}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
                  <span className="text-sm font-medium text-muted-foreground">Saldo Restante</span>
                  <span className="text-sm font-bold text-destructive">
                    {formatCurrency((formData.total_reparacion || 0) - (formData.monto_pagado || 0))}
                  </span>
                </div>
              </>
            )}

            {formData.pagado && (
              <div className="flex items-center justify-between rounded-md bg-green-50 p-3 border border-green-200">
                <span className="text-sm font-medium text-green-700">Total Pagado</span>
                <span className="text-sm font-bold text-green-700">
                  {formatCurrency(formData.total_reparacion || 0)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between rounded-md bg-primary/5 p-3 border border-primary/20">
              <span className="text-sm font-medium text-foreground">Total de la Reparación</span>
              <span className="text-sm font-bold text-primary">
                {formatCurrency(formData.total_reparacion || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 10. Hardware Check (avanzado) */}
        <Card>
          <CardHeader>
            <CardTitle>Chequeo de Hardware</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ingresa un objeto JSON con los componentes revisados (ej: {"{"}"pantalla": true, "bateria": false{"}"})
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.chequeo_hardware}
              onChange={(e) => setFormData({ ...formData, chequeo_hardware: e.target.value })}
              rows={4}
              placeholder={`{\n  "pantalla": true,\n  "bateria": false,\n  "camara": true\n}`}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* 11. Foto de Evidencia */}
        <Card>
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
                <p className="text-sm text-muted-foreground mb-4">Haz clic para subir una foto</p>
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
        </Card>

        {/* 12. Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              rows={3}
              placeholder="Notas adicionales sobre la reparación..."
            />
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/reparaciones/list')} className="flex-1">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}