import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Info, CreditCard, Cloud, Save, X, AlertCircle, Calendar, Building2, Tag, DollarSign, LucideBanknote, Landmark } from 'lucide-react'
import { MdAdd, MdCreditCard, MdAttachFile } from 'react-icons/md'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'

export default function ExpensesAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    date: '',
    category: '',
    supplier: '',
    paymentMethod: 'cash',
  })
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Limpiar error al modificar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.title.trim()) newErrors.title = 'La descripción es obligatoria'
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'El monto debe ser mayor a 0'
    if (!form.date) newErrors.date = 'La fecha es obligatoria'
    if (!form.category) newErrors.category = 'La categoría es obligatoria'
    if (!form.supplier) newErrors.supplier = 'El proveedor es obligatorio'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Gasto guardado:', { ...form, file })
    alert('Gasto registrado correctamente')
    setIsLoading(false)
    navigate('/expenses')
  }

  const categories = [
    { value: 'spare_parts', label: 'Repuestos' },
    { value: 'utilities', label: 'Servicios' },
    { value: 'rent', label: 'Alquiler' },
    { value: 'salaries', label: 'Salarios' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Otros' },
  ]

  const suppliers = [
    { value: '1', label: 'Logística Global S.A.' },
    { value: '2', label: 'Propiedades Main Street' },
    { value: '3', label: 'Tech Supplies Co.' },
    { value: '4', label: 'Red Eléctrica' },
  ]

  const currencies = [
    { value: 'USD', label: 'USD - Dólar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - Libra' },
    { value: 'JPY', label: 'JPY - Yen' },
  ]

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Nuevo gasto</h1>
          <p className="text-muted-foreground mt-1">
            Registra una nueva transacción para el control de costos y contabilidad.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información general */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Info size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Información general</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold">
                    Título / Descripción <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ej. Alquiler mensual local"
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-semibold">
                    Monto <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      placeholder="0.00"
                      className={`pl-8 ${errors.amount ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.amount}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-semibold">
                    Moneda
                  </Label>
                  <select
                    id="currency"
                    value={form.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {currencies.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold">
                    Fecha del gasto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={errors.date ? 'border-destructive' : ''}
                  />
                  {errors.date && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.date}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold">
                    Categoría <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={`w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.category ? 'border-destructive' : ''}`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-sm font-semibold">
                    Proveedor <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="supplier"
                    value={form.supplier}
                    onChange={(e) => handleChange('supplier', e.target.value)}
                    className={`w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.supplier ? 'border-destructive' : ''}`}
                  >
                    <option value="">Seleccionar proveedor</option>
                    {suppliers.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {errors.supplier && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle size={14} /> {errors.supplier}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MdAdd size={14} className="text-primary" />{' '}
                    <button type="button" className="text-primary hover:underline">
                      Agregar nuevo proveedor
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Método de pago */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <CreditCard size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Método de pago</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'cash', label: 'Efectivo', icon: <LucideBanknote size={24} /> },
                  { value: 'card', label: 'Tarjeta', icon: <MdCreditCard size={24} /> },
                  { value: 'bank', label: 'Transferencia', icon: <Landmark size={24} /> },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`
                      flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${form.paymentMethod === method.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50 hover:bg-muted/30'}
                    `}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={() => handleChange('paymentMethod', method.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comprobante */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Cloud size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">Comprobante o factura</h2>
              </div>

              <div className="flex flex-col items-center justify-center w-full">
                <label
                  className={`
                    flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer
                    transition-all hover:bg-muted/30 hover:border-primary/50
                    ${file ? 'border-primary/50 bg-muted/20' : 'border-border'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Cloud size={48} className="text-muted-foreground/50 mb-3" />
                    <p className="mb-2 text-sm font-semibold text-foreground">
                      Haz clic para subir o arrastra y suelta
                    </p>
                    <p className="text-xs text-muted-foreground uppercase font-medium">
                      PNG, JPG o PDF (máx. 5MB)
                    </p>
                  </div>
                  <input
                    onChange={handleFileChange}
                    className="hidden"
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                  />
                </label>

                {file && (
                  <div className="mt-4 w-full p-3 bg-muted/30 rounded-lg flex items-center justify-between border border-border">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <MdAttachFile size={16} className="text-primary" />
                      {file.name}
                      <Badge variant="outline" className="text-[10px]">
                        {(file.size / 1024).toFixed(1)} KB
                      </Badge>
                    </span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/expenses')}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Guardar gasto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}