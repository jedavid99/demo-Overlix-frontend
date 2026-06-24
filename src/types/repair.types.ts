// Tipos para el módulo de Reparaciones

export interface Repair {
  id: string;
  cliente_id: string;
  cliente_nombre?: string;
  dispositivo: string;
  marca?: string;
  modelo?: string;
  serial?: string;
  falla_reportada: string;
  diagnostico?: string;
  estado: 'pendiente' | 'en_progreso' | 'esperando_repuestos' | 'listo' | 'entregado' | 'cancelado';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  tecnico_id?: string;
  tecnico_nombre?: string;
  costo_estimado?: number;
  costo_final?: number;
  abono?: number;
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  fecha_entrega?: string;
  notas?: string;
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
  dispositivo: string;
  marca?: string;
  modelo?: string;
  serial?: string;
  falla_reportada: string;
  prioridad?: 'baja' | 'media' | 'alta' | 'urgente';
  tecnico_id?: string;
  costo_estimado?: number;
  abono?: number;
  fecha_estimada_entrega?: string;
  notas?: string;
}

export interface RepairUpdate extends Partial<RepairCreate> {
  diagnostico?: string;
  estado?: 'pendiente' | 'en_progreso' | 'esperando_repuestos' | 'listo' | 'entregado' | 'cancelado';
  costo_final?: number;
  fecha_entrega?: string;
  repuestos_usados?: RepairPart[];
}

export interface RepairFilters {
  page?: number;
  limit?: number;
  search?: string;
  estado?: 'pendiente' | 'en_progreso' | 'esperando_repuestos' | 'listo' | 'entregado' | 'cancelado';
  prioridad?: 'baja' | 'media' | 'alta' | 'urgente';
  tecnico_id?: string;
  cliente_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RepairStatusUpdate {
  estado: 'pendiente' | 'en_progreso' | 'esperando_repuestos' | 'listo' | 'entregado' | 'cancelado';
  notas?: string;
}
