// Tipos para el módulo de Reparaciones

export interface Repair {
  id: string;
  numero_reparacion?: string;
  empresa_id?: string;
  cliente_id: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  cliente_email?: string;
  
  // Datos del dispositivo
  categoria_dispositivo?: 'phone' | 'pc' | 'laptop' | 'console' | 'tablet';
  dispositivo: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  
  // Estado del equipo
  condicion_estetica?: string;
  accesorios_incluidos?: string[];
  
  // Seguridad
  tipo_seguridad?: 'pin' | 'pattern' | 'fingerprint' | 'face' | 'none';
  pin_acceso?: string;
  patron_puntos?: string[];
  secuencia_patron?: string;
  
  // Diagnóstico
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
  chequeo_hardware?: Record<string, boolean>;
  
  // Estados
  estado?: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'delivered' | 'cancelled';
  prioridad?: 'low' | 'medium' | 'high' | 'critical';
  tecnico_asignado_id?: string;
  tecnico_nombre?: string;
  
  // Fechas
  fecha_ingreso?: string;
  hora_ingreso?: string;
  fecha_estimada_entrega?: string;
  tiempo_estimado_minutos?: number;
  fecha_entrega?: string;
  
  // Financiero
  total_reparacion?: number;
  metodo_pago_id?: string;
  pagado?: boolean;
  costo_piezas?: number;
  costo_mano_obra?: number;
  garantia_meses?: number;
  
  // Notas
  notas?: string;
  
  // Repuestos
  repuestos_usados?: RepairPart[];
}

export interface RepairPart {
  repuesto_id: string;
  nombre: string;
  cantidad: number;
  costo_unitario: number;
}

export interface RepairCreate {
  cliente_id: string;
  
  // Datos del dispositivo
  categoria_dispositivo?: 'phone' | 'pc' | 'laptop' | 'console' | 'tablet';
  dispositivo: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  
  // Estado del equipo
  condicion_estetica?: string;
  accesorios_incluidos?: string[];
  
  // Seguridad
  tipo_seguridad?: 'pin' | 'pattern' | 'fingerprint' | 'face' | 'none';
  pin_acceso?: string;
  patron_puntos?: string[];
  secuencia_patron?: string;
  
  // Diagnóstico
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
  chequeo_hardware?: Record<string, boolean>;
  
  // Estados
  prioridad?: 'low' | 'medium' | 'high' | 'critical';
  tecnico_asignado_id?: string;
  
  // Fechas
  fecha_ingreso?: string;
  fecha_estimada_entrega?: string;
  
  // Financiero
  total_reparacion?: number;
  metodo_pago_id?: string;
  pagado?: boolean;
  garantia_meses?: number;
  
  // Notas
  notas?: string;
}

export interface RepairUpdate extends Partial<RepairCreate> {
  estado?: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'delivered' | 'cancelled';
  costo_final?: number;
  fecha_entrega?: string;
  repuestos_usados?: RepairPart[];
}

export interface RepairFilters {
  page?: number;
  limit?: number;
  search?: string;
  estado?: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'delivered' | 'cancelled';
  prioridad?: 'low' | 'medium' | 'high' | 'critical';
  tecnico_id?: string;
  cliente_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RepairStatusUpdate {
  estado: 'pending' | 'diagnostic' | 'in_progress' | 'waiting_parts' | 'ready' | 'delivered' | 'cancelled';
  notas?: string;
}
