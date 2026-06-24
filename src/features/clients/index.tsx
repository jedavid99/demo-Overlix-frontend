import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { MdPerson } from 'react-icons/md'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import DataTable from '@/shared/components/data-table'
import { useClients } from '@/hooks/useClients'
import { toast } from '@/hooks/use-toast'

export default function Clients() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all')
  const pageSize = 5

  // Obtener datos del backend
  const { data: clientsData, loading, error, refetch } = useClients({ page: 1, limit: 100 })

  // Mapear datos del backend al formato del componente
  const clients = useMemo(() => {
    if (!clientsData?.data?.data) return []
    
    const backendData = clientsData.data.data
    const clientesArray = backendData.clientes || backendData.data || backendData
    
    if (!Array.isArray(clientesArray)) return []

    return clientesArray.map((client: any) => ({
      id: client.id,
      name: client.nombre_completo || 'Sin nombre',
      dni: client.dni || '—',
      phone: client.telefono || '—',
      address: client.direccion || '—',
      fecha_registro: client.fecha_registro || client.created_at,
      estado: client.estado || 'activo',
      email: client.email || '—',
      equipos_reparados: client.equipos_reparados || 0,
    }))
  }, [clientsData])

  // Filtros locales
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = clients

    if (q) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.dni.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(c => c.estado === statusFilter)
    }

    return result
  }, [clients, query, statusFilter])

  // Paginación local
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize)

  const onSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  // Definición de columnas para el DataTable
  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'dni',
      label: 'DNI',
      render: (row: any) => <span className="text-sm">{row.dni}</span>,
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (row: any) => <span className="text-sm">{row.phone}</span>,
    },
    {
      key: 'fecha_registro',
      label: 'Fecha registro',
      render: (row: any) => (
        <span className="text-sm">
          {row.fecha_registro
            ? new Date(row.fecha_registro).toLocaleDateString('es-AR')
            : '—'}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (row: any) => (
        <Badge
          variant={row.estado === 'activo' ? 'success' : 'secondary'}
          className="capitalize"
        >
          {row.estado}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/clients/${row.id}`}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Ver cliente"
          >
            <Eye size={16} className="text-muted-foreground" />
          </Link>
          <Link
            to={`/clients/edit/${row.id}`}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Editar cliente"
          >
            <Edit size={16} className="text-muted-foreground" />
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
            title="Eliminar cliente"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ]

  // Función para eliminar (con confirmación)
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      // Aquí iría la llamada a la API para eliminar
      toast({
        title: 'Cliente eliminado correctamente',
        description: 'El cliente ha sido eliminado exitosamente',
      })
      refetch()
    }
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error al cargar clientes: {error}
        </div>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            {clients.length > 0
              ? `Gestiona tu base de clientes (${clients.length} registrados)`
              : 'Gestiona tu base de clientes'}
          </p>
        </div>
        <Link to="/clients/add">
          <Button className="gap-2">
            <Plus size={16} />
            Nuevo cliente
          </Button>
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Buscar por nombre, DNI o teléfono..."
            value={query}
            onChange={e => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setStatusFilter('all')}
          >
            Todos
          </Badge>
          <Badge
            variant={statusFilter === 'activo' ? 'success' : 'outline'}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setStatusFilter('activo')}
          >
            Activos
          </Badge>
          <Badge
            variant={statusFilter === 'inactivo' ? 'secondary' : 'outline'}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setStatusFilter('inactivo')}
          >
            Inactivos
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Contenido principal */}
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
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {query || statusFilter !== 'all' ? 'No hay resultados' : 'No hay clientes aún'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {query || statusFilter !== 'all'
              ? 'Prueba con otros filtros o términos de búsqueda'
              : 'Comienza agregando tu primer cliente'}
          </p>
          {!query && statusFilter === 'all' && (
            <Link to="/clients/add">
              <Button>
                <Plus size={16} className="mr-2" />
                Agregar primer cliente
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <DataTable
          columns={columns}        // 👈 ¡Ahora con columnas!
          data={paginatedData}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
          emptyMessage="No hay clientes que coincidan con la búsqueda"
        />
      )}
    </motion.div>
  )
}