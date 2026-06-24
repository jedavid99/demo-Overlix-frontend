import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { MdPerson } from 'react-icons/md'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import DataTable from '@/shared/components/data-table'
import { useClients } from '@/hooks/useClients'

export default function Clients() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all')
  const pageSize = 5
  
  // Conectar con API real usando el hook
  const { data: clientsData, loading, error, refetch } = useClients({ page: 1, limit: 100 })
  
  // Mapear datos del backend al formato del componente
  const clients = useMemo(() => {
    if (!clientsData?.data) return []
    return clientsData.data.map((client: any) => ({
      id: client.id,
      name: client.nombre_completo,
      email: client.email || '',
      dni: client.dni || '',
      phone: client.telefono || '',
      status: client.estado, // 'activo' | 'inactivo'
      joinDate: client.fecha_registro,
      transactions: client.deuda_actual || 0,
    }))
  }, [clientsData])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = clients
    if (q) {
      result = result.filter(c => (
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.dni.toLowerCase().includes(q)
      ))
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status.toLowerCase() === statusFilter)
    }
    return result
  }, [query, statusFilter])
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const onSearch = (v: string) => { setQuery(v); setPage(1) }
  const tableData = filtered.slice((page - 1) * pageSize, page * pageSize).map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    status: c.status,
    joinDate: c.joinDate,
    transactions: c.transactions,
  }))
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestiona ss tu base de clientes</p>
        </div>
        <Link to="/clients/add">
          <Button>
            <Plus size={16} className="mr-2" />
            Nuevo cliente
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Buscar cliente..."
            value={query}
            onChange={e => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('all')}
          >
            Todos
          </Badge>
          <Badge
            variant={statusFilter === 'activo' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('activo')}
          >
            Activos
          </Badge>
          <Badge
            variant={statusFilter === 'inactivo' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setStatusFilter('inactivo')}
          >
            Inactivos
          </Badge>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error al cargar clientes: {error}
        </div>
      )}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
              <Skeleton variant="circle" className="h-10 w-10" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-32 h-4" />
                <Skeleton variant="text" className="w-48 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <MdPerson size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay clientes aún</h3>
          <p className="text-muted-foreground mb-4">Comienza agregando tu primer cliente</p>
          <Link to="/clients/add">
            <Button>
              <Plus size={16} className="mr-2" />
              Agregar primer cliente
            </Button>
          </Link>
        </div>
      ) : (
        <DataTable
          data={tableData}
          currentPage={page}
          totalPages={pages}
          onPageChange={setPage}
          loading={loading}
          emptyMessage="No hay clientes que coincidan con la búsqueda"
        />
      )}
    </motion.div>
  )
}
