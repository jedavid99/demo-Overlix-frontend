import React, { useState, useEffect } from 'react';
import { useBusinessInfo, useBusinessInfoMutations } from '@/hooks/useBusinessInfo';
import { BusinessInfoUpdate } from '@/types/businessInfo.types';
import { Button } from '@/shared/components/ui/button';
import { Save, Building2, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Linkedin, Upload } from 'lucide-react';

export const BusinessInfo = () => {
  const { data: businessInfo, loading, error, refetch } = useBusinessInfo();
  const { updateBusinessInfo, updateLogo, loading: mutationLoading, error: mutationError } = useBusinessInfoMutations();

  const [formData, setFormData] = useState<BusinessInfoUpdate>({
    nombre_empresa: '',
    razon_social: '',
    cuit: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    pais: '',
    sitio_web: '',
    descripcion: '',
    horario_atencion: '',
    redes_sociales: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    configuracion_facturacion: {
      iva_responsable: '',
      condicion_iva: '',
      punto_venta: 1
    },
    moneda: 'ARS',
    idioma: 'es'
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (businessInfo) {
      setFormData({
        nombre_empresa: businessInfo.nombre_empresa,
        razon_social: businessInfo.razon_social || '',
        cuit: businessInfo.cuit || '',
        email: businessInfo.email,
        telefono: businessInfo.telefono,
        direccion: businessInfo.direccion,
        ciudad: businessInfo.ciudad,
        provincia: businessInfo.provincia,
        codigo_postal: businessInfo.codigo_postal || '',
        pais: businessInfo.pais || '',
        sitio_web: businessInfo.sitio_web || '',
        descripcion: businessInfo.descripcion || '',
        horario_atencion: businessInfo.horario_atencion || '',
        redes_sociales: businessInfo.redes_sociales || {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: ''
        },
        configuracion_facturacion: businessInfo.configuracion_facturacion || {
          iva_responsable: '',
          condicion_iva: '',
          punto_venta: 1
        },
        moneda: businessInfo.moneda || 'ARS',
        idioma: businessInfo.idioma || 'es'
      });
    }
  }, [businessInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('redes_sociales.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        redes_sociales: {
          ...prev.redes_sociales,
          [socialField]: value
        }
      }));
    } else if (name.startsWith('configuracion_facturacion.')) {
      const configField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        configuracion_facturacion: {
          ...prev.configuracion_facturacion,
          [configField]: configField === 'punto_venta' ? parseInt(value) || 1 : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateBusinessInfo(formData);
    if (result) {
      refetch();
    }
  };

  const handleLogoUpload = async () => {
    if (logoFile) {
      const result = await updateLogo(logoFile);
      if (result) {
        refetch();
        setLogoFile(null);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Cargando información de la empresa...</div>;
  if (error) {
    if (error.includes('401') || error.includes('unauthorized')) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          <p className="font-semibold">No tienes permiso para acceder a esta información</p>
          <p className="text-sm mt-1">Por favor, inicia sesión nuevamente o contacta al administrador.</p>
        </div>
      );
    }
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Información de la Empresa</h1>
        <p className="text-muted-foreground">Configura los datos de tu negocio</p>
      </div>

      {mutationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {mutationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Información Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de la Empresa *</label>
              <input
                type="text"
                name="nombre_empresa"
                value={formData.nombre_empresa}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Razón Social</label>
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CUIT</label>
              <input
                type="text"
                name="cuit"
                value={formData.cuit}
                onChange={handleChange}
                placeholder="XX-XXXXXXXX-X"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Moneda</label>
              <select
                name="moneda"
                value={formData.moneda}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ARS">Pesos Argentinos (ARS)</option>
                <option value="USD">Dólares (USD)</option>
                <option value="EUR">Euros (EUR)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Contacto */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Sitio Web
              </label>
              <input
                type="url"
                name="sitio_web"
                value={formData.sitio_web}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Horario de Atención</label>
              <input
                type="text"
                name="horario_atencion"
                value={formData.horario_atencion}
                onChange={handleChange}
                placeholder="Lun-Vie 9:00-18:00"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Dirección
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Provincia *</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Código Postal</label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">País</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </label>
              <input
                type="url"
                name="redes_sociales.facebook"
                value={formData.redes_sociales?.facebook || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                Instagram
              </label>
              <input
                type="url"
                name="redes_sociales.instagram"
                value={formData.redes_sociales?.instagram || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Twitter className="w-4 h-4 text-blue-400" />
                Twitter
              </label>
              <input
                type="url"
                name="redes_sociales.twitter"
                value={formData.redes_sociales?.twitter || ''}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-700" />
                LinkedIn
              </label>
              <input
                type="url"
                name="redes_sociales.linkedin"
                value={formData.redes_sociales?.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/..."
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Configuración de Facturación */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Configuración de Facturación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Responsable IVA</label>
              <input
                type="text"
                name="configuracion_facturacion.iva_responsable"
                value={formData.configuracion_facturacion?.iva_responsable || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Condición IVA</label>
              <select
                name="configuracion_facturacion.condicion_iva"
                value={formData.configuracion_facturacion?.condicion_iva || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Seleccionar</option>
                <option value="responsable_inscripto">Responsable Inscripto</option>
                <option value="monotributo">Monotributo</option>
                <option value="exento">Exento</option>
                <option value="consumidor_final">Consumidor Final</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Punto de Venta</label>
              <input
                type="number"
                name="configuracion_facturacion.punto_venta"
                value={formData.configuracion_facturacion?.punto_venta || 1}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Logo de la Empresa</h2>
          <div className="flex items-center gap-4">
            {businessInfo?.logo_url && (
              <img
                src={businessInfo.logo_url}
                alt="Logo de la empresa"
                className="w-32 h-32 object-contain border rounded-lg"
              />
            )}
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {logoFile && (
                <Button type="button" onClick={handleLogoUpload} disabled={mutationLoading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {mutationLoading ? 'Subiendo...' : 'Subir Logo'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutationLoading} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {mutationLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessInfo;
