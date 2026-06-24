// Tipos para el módulo de Información de la Empresa

export interface BusinessInfo {
  id: string;
  nombre_empresa: string;
  razon_social?: string;
  cuit?: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal?: string;
  pais?: string;
  sitio_web?: string;
  logo_url?: string;
  descripcion?: string;
  horario_atencion?: string;
  redes_sociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  configuracion_facturacion?: {
    iva_responsable?: string;
    condicion_iva?: string;
    punto_venta?: number;
  };
  moneda?: string;
  idioma?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface BusinessInfoUpdate extends Partial<BusinessInfo> {}
