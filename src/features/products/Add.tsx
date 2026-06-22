import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Info,
  Package,
  DollarSign,
  Settings,
  Image,
  ChevronRight,
  Save,
  Trash2,
  X,
  CheckCircle,
  Cloud,
  Plus,
  Tag,
  Layers,
  Barcode,
  MapPin,
  Percent,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'

export default function StockAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    itemName: '',
    sku: '',
    category: '',
    brand: '',
    initialQuantity: '',
    minStockLevel: '',
    storageLocation: '',
    purchaseCost: '',
    sellingPrice: '',
    tax: '',
  })

  const [compatibility, setCompatibility] = useState<string[]>(['iPhone 13', 'iPhone 13 Pro'])
  const [compatibilityInput, setCompatibilityInput] = useState('')

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const addCompatibility = (device: string) => {
    const newDevice = device || compatibilityInput
    if (newDevice && !compatibility.includes(newDevice)) {
      setCompatibility([...compatibility, newDevice])
      setCompatibilityInput('')
    }
  }

  const removeCompatibility = (device: string) => {
    setCompatibility(compatibility.filter(d => d !== device))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCompatibility(compatibilityInput)
    }
  }

  const handleSubmit = (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault()
    // TODO: persist data
    navigate('/stock')
  }

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' },
    }),
  }

  const categories = [
    { value: '', label: 'Seleccionar categoría' },
    { value: 'screens', label: 'Pantallas' },
    { value: 'batteries', label: 'Baterías' },
    { value: 'charging-ports', label: 'Puertos de carga' },
    { value: 'mainboards', label: 'Placas base' },
    { value: 'cameras', label: 'Cámaras' },
    { value: 'accessories', label: 'Accesorios' },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex flex-col"
    >
      <main className="flex-1 px-4 py-8 md:px-8 lg:px-16 xl:px-24 max-w-6xl mx-auto w-full">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Agregar nuevo producto
            </h1>
            <p className="text-muted-foreground mt-1">
              Completa los detalles técnicos, precios y compatibilidad del nuevo repuesto.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/stock')}>
              Cancelar
            </Button>
            <Button onClick={(e) => handleSubmit(e, false)}>
              <Save size={18} className="mr-2" />
              Guardar producto
            </Button>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8 pb-16">
          {/* Sección 1: Información General */}
          <motion.section
            variants={sectionVariants}
            custom={0}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <Info size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">Información general</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="itemName" className="text-sm font-semibold">
                  Nombre del producto
                </Label>
                <Input
                  id="itemName"
                  value={form.itemName}
                  onChange={(e) => handleChange('itemName', e.target.value)}
                  placeholder="Ej. Pantalla OLED iPhone 13"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-sm font-semibold flex items-center gap-1">
                  <Barcode size={14} className="text-muted-foreground" />
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="Ej. SCRN-IP13-OLED-01"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-1">
                  <Layers size={14} className="text-muted-foreground" />
                  Categoría
                </Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-semibold flex items-center gap-1">
                  <Tag size={14} className="text-muted-foreground" />
                  Marca
                </Label>
                <Input
                  id="brand"
                  value={form.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  placeholder="Ej. Apple OEM"
                  className="h-11"
                />
              </div>
            </div>
          </motion.section>

          {/* Sección 2: Detalles de inventario */}
          <motion.section
            variants={sectionVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <Package size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">Detalles de inventario</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="initialQuantity" className="text-sm font-semibold">
                  Cantidad inicial
                </Label>
                <Input
                  id="initialQuantity"
                  type="number"
                  value={form.initialQuantity}
                  onChange={(e) => handleChange('initialQuantity', e.target.value)}
                  placeholder="0"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStockLevel" className="text-sm font-semibold">
                  Nivel mínimo de stock
                </Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  value={form.minStockLevel}
                  onChange={(e) => handleChange('minStockLevel', e.target.value)}
                  placeholder="5"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storageLocation" className="text-sm font-semibold flex items-center gap-1">
                  <MapPin size={14} className="text-muted-foreground" />
                  Ubicación / Estante
                </Label>
                <Input
                  id="storageLocation"
                  value={form.storageLocation}
                  onChange={(e) => handleChange('storageLocation', e.target.value)}
                  placeholder="Ej. Estante A-12"
                  className="h-11"
                />
              </div>
            </div>
          </motion.section>

          {/* Sección 3: Precios */}
          <motion.section
            variants={sectionVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <DollarSign size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">Precios</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="purchaseCost" className="text-sm font-semibold">
                  Costo de compra ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="purchaseCost"
                    value={form.purchaseCost}
                    onChange={(e) => handleChange('purchaseCost', e.target.value)}
                    placeholder="0.00"
                    className="h-11 pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice" className="text-sm font-semibold">
                  Precio de venta ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="sellingPrice"
                    value={form.sellingPrice}
                    onChange={(e) => handleChange('sellingPrice', e.target.value)}
                    placeholder="0.00"
                    className="h-11 pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax" className="text-sm font-semibold flex items-center gap-1">
                  <Percent size={14} className="text-muted-foreground" />
                  Impuesto (%)
                </Label>
                <div className="relative">
                  <Input
                    id="tax"
                    value={form.tax}
                    onChange={(e) => handleChange('tax', e.target.value)}
                    placeholder="0"
                    className="h-11 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Sección 4: Compatibilidad */}
          <motion.section
            variants={sectionVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <Settings size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">Compatibilidad</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Agrega los dispositivos con los que este repuesto es compatible:
              </p>
              <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed border-border rounded-xl bg-muted/30 min-h-[60px] items-center">
                {compatibility.map((device) => (
                  <Badge
                    key={device}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium flex items-center gap-1.5"
                  >
                    {device}
                    <button
                      type="button"
                      onClick={() => removeCompatibility(device)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
                <div className="flex items-center ml-1">
                  <input
                    value={compatibilityInput}
                    onChange={(e) => setCompatibilityInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground p-1 outline-none min-w-[120px]"
                    placeholder="Escribe y presiona Enter..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['iPhone 14', 'PS5', 'Nintendo Switch', 'iPad Pro'].map((device) => (
                  <Button
                    key={device}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompatibility(device)}
                    className="h-8 text-xs"
                  >
                    <Plus size={14} className="mr-1" />
                    Agregar {device}
                  </Button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Sección 5: Imagen del producto */}
          <motion.section
            variants={sectionVariants}
            custom={4}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
              <Image size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">Imagen del producto</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative aspect-video w-full rounded-2xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all overflow-hidden">
                <Cloud size={48} className="text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                <p className="text-sm font-medium text-muted-foreground">Haz clic o arrastra una imagen</p>
                <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG hasta 10MB</p>
              </div>
              <div className="flex flex-col justify-center space-y-3">
                <h3 className="font-bold text-foreground">Recomendaciones:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    Foto nítida y de alta resolución sobre fondo blanco.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    Muestra todos los conectores y cables claramente.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    Incluye el empaque si los números de serie son visibles.
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Botones de acción */}
          <motion.div
            variants={sectionVariants}
            custom={5}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border"
          >
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => navigate('/stock')}
            >
              <Trash2 size={18} className="mr-2" />
              Descartar borrador
            </Button>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, true)}
              >
                Guardar como borrador
              </Button>
              <Button type="submit" size="lg">
                <Save size={18} className="mr-2" />
                Publicar producto
              </Button>
            </div>
          </motion.div>
        </form>
      </main>
    </motion.div>
  )
}