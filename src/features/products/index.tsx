import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Download,
  Search,
  ChevronDown,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Monitor,
  Gamepad2,
  Cpu,
  Wifi,
  Package,
  AlertCircle,
  DollarSign,
  Filter,
  X,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

// Types
interface StockItem {
  id: number
  name: string
  description: string
  sku: string
  category: string
  quantity: number
  status: string
  price: number
  icon: React.ElementType
  color: string
}

// Datos de ejemplo (puedes reemplazar con API)
const stockItems: StockItem[] = [
  {
    id: 1,
    name: 'iPhone 14 Screen Assembly',
    description: 'Premium OLED Display',
    sku: 'IPH14-SCR-001',
    category: 'Phone',
    quantity: 45,
    status: 'Good',
    price: 129.0,
    icon: Smartphone,
    color: 'blue',
  },
  {
    id: 2,
    name: 'MacBook Air M2 Battery',
    description: 'A2389 Replacement',
    sku: 'MBA-M2-BAT-45',
    category: 'PC',
    quantity: 4,
    status: 'Low',
    price: 85.5,
    icon: Cpu,
    color: 'indigo',
  },
  {
    id: 3,
    name: 'PS5 HDMI Port',
    description: '2.1 Specification OEM',
    sku: 'PS5-HDMI-V2',
    category: 'Console',
    quantity: 0,
    status: 'Out',
    price: 12.0,
    icon: Gamepad2,
    color: 'purple',
  },
  {
    id: 4,
    name: 'Internal Wi-Fi Card',
    description: 'Intel AX210 Gig+',
    sku: 'NET-WIFI-AX210',
    category: 'PC',
    quantity: 112,
    status: 'Good',
    price: 34.99,
    icon: Wifi,
    color: 'indigo',
  },
]

// Categorías y estados para filtros
const categories = ['all', 'phone', 'pc', 'console']
const statusOptions = ['all', 'good', 'low', 'out']

export default function Stock() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [loading, setLoading] = useState(false)

  // Filtrar productos
  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        activeCategory === 'all' || item.category.toLowerCase() === activeCategory
      const matchesStatus =
        activeStatus === 'all' ||
        (activeStatus === 'good' && item.status === 'Good') ||
        (activeStatus === 'low' && item.status === 'Low') ||
        (activeStatus === 'out' && item.status === 'Out')
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, activeCategory, activeStatus])

  // KPIs
  const totalItems = stockItems.length
  const totalCategories = new Set(stockItems.map((i) => i.category)).size
  const lowStockItems = stockItems.filter((i) => i.quantity < 5 && i.quantity > 0).length
  const totalValue = stockItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  // Helper para badge de estado
  const getStatusBadge = (status: string, quantity: number) => {
    if (quantity === 0) return { variant: 'destructive' as const, label: 'Agotado' }
    if (quantity < 5) return { variant: 'warning' as const, label: 'Bajo stock' }
    return { variant: 'success' as const, label: 'En stock' }
  }

  // Mapeo de colores por categoría
  const categoryColorMap: Record<string, string> = {
    Phone: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    PC: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    Console: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  }

  const kpiData = [
    {
      label: 'Productos totales',
      value: totalItems,
      icon: Package,
      trend: '+12%',
      trendUp: true,
      color: 'text-blue-600',
    },
    {
      label: 'Categorías',
      value: totalCategories,
      icon: Filter,
      trend: '3 activas',
      trendUp: false,
      color: 'text-indigo-600',
    },
    {
      label: 'Stock bajo',
      value: lowStockItems,
      icon: AlertCircle,
      trend: lowStockItems > 0 ? '⚠️ Revisar' : '✅ OK',
      trendUp: false,
      color: 'text-amber-600',
    },
    {
      label: 'Valor total',
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      trend: '+8% vs mes anterior',
      trendUp: true,
      color: 'text-emerald-600',
    },
  ]

  // Framer Motion variants para filas
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.25 },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventario</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona tu stock de productos y repuestos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus size={16} className="mr-2" />
            Agregar producto
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
            >
              <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {kpi.label}
                      </p>
                      <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-muted/50 ${kpi.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-xs">
                    {kpi.trendUp ? (
                      <TrendingUp size={14} className="text-emerald-500" />
                    ) : (
                      <TrendingDown size={14} className="text-muted-foreground" />
                    )}
                    <span
                      className={kpi.trendUp ? 'text-emerald-600' : 'text-muted-foreground'}
                    >
                      {kpi.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-background"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Categorías */}
          <div className="flex items-center gap-1.5 bg-muted/30 rounded-lg p-1">
            <Badge
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setActiveCategory('all')}
            >
              Todos
            </Badge>
            {categories.slice(1).map((cat) => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors flex items-center gap-1"
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'phone' && <Smartphone size={12} />}
                {cat === 'pc' && <Monitor size={12} />}
                {cat === 'console' && <Gamepad2 size={12} />}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Badge>
            ))}
          </div>

          {/* Estado */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <Filter size={14} />
                Estado
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={activeStatus === status ? 'bg-primary/10' : ''}
                >
                  {status === 'all' && 'Todos'}
                  {status === 'good' && 'En stock'}
                  {status === 'low' && 'Bajo stock'}
                  {status === 'out' && 'Agotado'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Limpiar filtros */}
          {(activeCategory !== 'all' || activeStatus !== 'all' || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-muted-foreground"
              onClick={() => {
                setActiveCategory('all')
                setActiveStatus('all')
                setSearchTerm('')
              }}
            >
              <X size={14} className="mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Tabla / Lista de productos */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
              <Skeleton variant="rectangular" className="h-10 w-10 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-32 h-4" />
                <Skeleton variant="text" className="w-48 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-muted/10 rounded-xl border border-dashed border-border"
        >
          <Package size={56} className="mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No hay productos</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            No se encontraron productos con los filtros actuales. Prueba a ajustar tu búsqueda o
            agrega un nuevo producto.
          </p>
          <Button variant="outline" className="mt-4">
            <Plus size={16} className="mr-2" />
            Agregar producto
          </Button>
        </motion.div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence mode="wait">
                  {filteredItems.map((item, idx) => {
                    const IconComponent = item.icon
                    const status = getStatusBadge(item.status, item.quantity)
                    const categoryColor =
                      categoryColorMap[item.category] || 'bg-muted text-muted-foreground'

                    return (
                      <motion.tr
                        key={item.id}
                        custom={idx}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                              <IconComponent size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${categoryColor}`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-medium">
                          <span
                            className={
                              item.quantity === 0
                                ? 'text-destructive'
                                : item.quantity < 5
                                ? 'text-amber-600'
                                : 'text-foreground'
                            }
                          >
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={status.variant} size="sm" className="font-medium">
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="gap-2">
                                <Eye size={14} /> Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Edit size={14} /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 size={14} /> Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla (opcional) */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-t border-border text-xs text-muted-foreground">
            <span>
              Mostrando <strong className="text-foreground">{filteredItems.length}</strong> de{' '}
              <strong className="text-foreground">{stockItems.length}</strong> productos
            </span>
            <span>Última actualización: Hoy a las 10:30</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}