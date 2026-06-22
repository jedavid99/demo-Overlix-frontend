import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, MoreVertical, ChevronLeft, ChevronRight, Package, Zap, Cpu, Wrench, Cable, Building2, Globe } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DataTable from '@/shared/components/data-table'

export default function Providers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // 📦 Datos de muestra ELIMINADOS – array vacío (cargar desde API)
  const suppliers: {
    id: number
    name: string
    contact: string
    category: string
    phone: string
    email: string
    location: string
    type: string
    color: string
    icon: React.ElementType
  }[] = []

  // Filtrar proveedores (todos vacíos)
  const filterOptions = {
    all: { label: 'Todos', suppliers },
    local: { label: 'Local', suppliers: suppliers.filter(s => s.type === 'Local') },
    international: { label: 'Internacional', suppliers: suppliers.filter(s => s.type === 'International') },
    oem: { label: 'OEM', suppliers: suppliers.filter(s => s.type === 'OEM') },
    thirdparty: { label: 'Terceros', suppliers: suppliers.filter(s => s.type === 'Third-party') },
  }

  // ⚠️ Forzamos el tipo a any[] para evitar error con DataTable
  const filtered: any[] = filterOptions[activeFilter as keyof typeof filterOptions].suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // KPIs calculados a partir del array vacío
  const totalSuppliers = suppliers.length
  const localSuppliers = suppliers.filter(s => s.type === 'Local').length
  const internationalSuppliers = suppliers.filter(s => s.type === 'International').length
  const averageDeliveryDays = 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona todos los proveedores de hardware y servicios</p>
        </div>
        <Button onClick={() => navigate('/providers/add')}>
          <UserPlus size={16} className="mr-2" />
          Nuevo proveedor
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{totalSuppliers}</p>
            <p className="text-muted-foreground text-sm">Proveedores activos</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nacionales</p>
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{localSuppliers}</p>
            <p className="text-muted-foreground text-sm">Socios domésticos</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Internacionales</p>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{internationalSuppliers}</p>
            <p className="text-muted-foreground text-sm">Proveedores globales</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tiempo Promedio</p>
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{averageDeliveryDays === 0 ? '—' : averageDeliveryDays}</p>
            <p className="text-muted-foreground text-sm">Días de entrega</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, contacto o ubicación..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div className="flex gap-2">
              {Object.entries(filterOptions).map(([key, val]) => (
                <Button
                  key={key}
                  variant={activeFilter === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(key)}
                >
                  {val.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DataTable – ahora con filtered: any[] */}
      <DataTable
        data={filtered}
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        loading={false}
        emptyMessage="No hay proveedores registrados"
      />
    </div>
  )
}