import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Download, Search, ChevronDown, MoreVertical, TrendingUp, TrendingDown, Smartphone, Monitor, Gamepad2, Cpu, Wifi, Package } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import DataTable from '@/shared/components/data-table'

export default function Stock() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  const stockItems = [
    {
      id: 1,
      name: 'iPhone 14 Screen Assembly',
      description: 'Premium OLED Display',
      sku: 'IPH14-SCR-001',
      category: 'Phone',
      quantity: 45,
      status: 'Good',
      price: 129.00,
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
      price: 85.50,
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
      price: 12.00,
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

  const filtered = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (status: string, quantity: number) => {
    if (quantity === 0) return { variant: 'destructive' as const, label: 'Agotado' }
    if (quantity < 5) return { variant: 'warning' as const, label: 'Bajo' }
    return { variant: 'success' as const, label: 'En stock' }
  }

  const categoryColors = {
    Phone: 'bg-primary/10 text-primary',
    PC: 'bg-info/10 text-info',
    Console: 'bg-warning/10 text-warning',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
          <p className="text-muted-foreground">Gestiona tu stock de productos</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Agregar producto
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setActiveCategory('all')}
          >
            Todos
          </Badge>
          <Badge
            variant={activeCategory === 'phone' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setActiveCategory('phone')}
          >
            <Smartphone size={14} className="mr-1" />
            Phones
          </Badge>
          <Badge
            variant={activeCategory === 'pc' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setActiveCategory('pc')}
          >
            <Monitor size={14} className="mr-1" />
            PCs
          </Badge>
          <Badge
            variant={activeCategory === 'console' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setActiveCategory('console')}
          >
            <Gamepad2 size={14} className="mr-1" />
            Consoles
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
              <Skeleton variant="rectangular" className="h-10 w-10" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-32 h-4" />
                <Skeleton variant="text" className="w-48 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay productos</h3>
          <p className="text-muted-foreground mb-4">No se encontraron productos con los filtros actuales</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(item => {
                  const IconComponent = item.icon
                  const status = getStatusBadge(item.status, item.quantity)
                  return (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted/50 rounded flex items-center justify-center text-primary">
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" size="sm">{item.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{item.quantity}</td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant} size="sm">{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical size={16} />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}

