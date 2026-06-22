import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Info, Phone, Tag, MapPin, Save, X, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'

export default function ProviderAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    businessName: '',
    taxId: '',
    website: '',
    contactName: '',
    role: '',
    phone: '',
    email: '',
    categories: [] as string[],
    parts: [] as string[],
    address: '',
    city: '',
    postal: '',
    incoterms: 'DDP',
    leadTime: '2-3 Business Days',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo al modificar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))
  }

  const handlePartsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
    setForm((prev) => ({ ...prev, parts: selectedOptions }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.businessName.trim()) newErrors.businessName = 'El nombre del negocio es obligatorio'
    if (!form.contactName.trim()) newErrors.contactName = 'El nombre del contacto es obligatorio'
    if (!form.phone.trim()) newErrors.phone = 'El teléfono es obligatorio'
    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Correo electrónico inválido'
    }
    if (!form.address.trim()) newErrors.address = 'La dirección es obligatoria'
    if (!form.city.trim()) newErrors.city = 'La ciudad es obligatoria'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // Aquí iría la llamada a la API para guardar el proveedor
    console.log('Proveedor guardado:', form)
    // Simular guardado exitoso
    alert('Proveedor guardado correctamente')
    navigate('/providers')
  }

  const categories = ['Teléfonos', 'PCs / Portátiles', 'Consolas', 'Accesorios']
  const partOptions = [
    'Pantallas LCD / OLED',
    'Baterías de repuesto',
    'Puertos de carga',
    'Placas base',
    'Ventiladores internos',
    'Módulos de cámara',
    'Carcasa / Chasis',
    'Pasta térmica / Herramientas',
    'Cables flex',
    'Conectores',
  ]

  const incotermsOptions = ['DDP', 'EXW', 'FOB', 'CIF']
  const leadTimeOptions = ['Entrega al día siguiente', '2-3 días hábiles', '1 semana', '2+ semanas (Internacional)']

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Nuevo Proveedor</h1>
          <p className="text-muted-foreground mt-1">
            Crea un perfil de proveedor para gestionar compras y reposición de inventario.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Info size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Información básica</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-semibold">
                    Nombre del negocio <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    value={form.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="Ej. Soluciones Tecnológicas Globales"
                    className={errors.businessName ? 'border-destructive' : ''}
                  />
                  {errors.businessName && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.businessName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId" className="text-sm font-semibold">
                    NIF / CIF
                  </Label>
                  <Input
                    id="taxId"
                    value={form.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    placeholder="XX-123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-semibold">
                    Sitio web
                  </Label>
                  <Input
                    id="website"
                    value={form.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://www.proveedor.com"
                    type="url"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto principal */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Phone size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Contacto principal</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName" className="text-sm font-semibold">
                    Nombre del contacto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactName"
                    value={form.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    placeholder="Juan Pérez"
                    className={errors.contactName ? 'border-destructive' : ''}
                  />
                  {errors.contactName && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.contactName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-semibold">
                    Cargo / Puesto
                  </Label>
                  <Input
                    id="role"
                    value={form.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    placeholder="Gerente de Cuentas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">
                    Teléfono directo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+34 600 000 000"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Correo electrónico <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="juan@proveedor.com"
                    type="email"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categorías y piezas */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Tag size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Categorías y piezas</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold block mb-3">
                    Categorías de suministro
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          form.categories.includes(cat)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <input
                          checked={form.categories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                          type="checkbox"
                        />
                        <span className="text-sm font-medium">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="parts" className="text-sm font-semibold block mb-2">
                    Piezas específicas que suministra
                  </Label>
                  <select
                    id="parts"
                    multiple
                    value={form.parts}
                    onChange={handlePartsChange}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[140px]"
                  >
                    {partOptions.map((part) => (
                      <option key={part} value={part}>
                        {part}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Mantén presionada la tecla <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl</kbd> (Windows) o <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">⌘</kbd> (Mac) para seleccionar múltiples opciones.
                  </p>
                  {form.parts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.parts.map((part) => (
                        <Badge key={part} variant="secondary" className="text-xs">
                          {part}
                          <button
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                parts: prev.parts.filter((p) => p !== part),
                              }))
                            }}
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dirección y envío */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <MapPin size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Dirección y envío</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold">
                    Dirección <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Calle, número, parque industrial"
                    className={errors.address ? 'border-destructive' : ''}
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.address}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold">
                    Ciudad <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Madrid"
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal" className="text-sm font-semibold">
                    Código postal
                  </Label>
                  <Input
                    id="postal"
                    value={form.postal}
                    onChange={(e) => handleChange('postal', e.target.value)}
                    placeholder="28001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incoterms" className="text-sm font-semibold">
                    Términos de envío (Incoterms)
                  </Label>
                  <select
                    id="incoterms"
                    value={form.incoterms}
                    onChange={(e) => handleChange('incoterms', e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {incotermsOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadTime" className="text-sm font-semibold">
                    Tiempo de entrega estimado
                  </Label>
                  <select
                    id="leadTime"
                    value={form.leadTime}
                    onChange={(e) => handleChange('leadTime', e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {leadTimeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/providers')}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              <Save size={16} className="mr-2" />
              Guardar proveedor
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}