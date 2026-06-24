import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { MdPerson } from 'react-icons/md'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { clientService } from '@/services/clientService'
import { toast } from '@/hooks/use-toast'

export default function Clients() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all')
  const pageSize = 5

  // Estado local
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Cargar datos UNA SOLA VEZ
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await clientService.list({ page: 1, limit: 100 })
        console.log('Respuesta completa:', response)
        
        // Extraer datos según la estructura real
        // Intenta varias posibilidades
        let clientesArray = response?.data?.data?.clientes ||
                           response?.data?.data?.data ||
                           response?.data?.data ||
                           response?.data ||
                           response
        
        if (!Array.isArray(clientesArray)) {
          console.error('No se encontró un array de clientes:', response)
          setClients([])
          setTotal(0)
          return
        }

        console.log('Clientes obtenidos:', clientesArray.length)
        setClients(clientesArray)
        setTotal(clientesArray.length)
      } catch (err: any) {
        console.error('Error al cargar clientes:', err)
        setError(err?.response?.data?.message || 'Error al cargar clientes')
        setClients([])
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, []) // 👈 Dependencias vacías = se ejecuta UNA SOLA VEZ

  // Filtros locales
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = clients

    if (q) {
      result = result.filter(c =>
        c.nombre_completo?.toLowerCase().includes(q) ||
        c.dni?.toLowerCase().includes(q) ||
        c.telefono?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(c => c.estado === statusFilter)
    }

    return result
  }, [clients, query, statusFilter])

  // Paginación local
  const totalFiltered = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize)

  const onSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return
    try {
      await clientService.delete(id)
      toast({ title: 'Cliente eliminado' })
      // Recargar la lista
      const response = await clientService.list({ page: 1, limit: 100 })
      let clientesArray = response?.data?.data?.clientes || response?.data?.data || response?.data || response
      if (Array.isArray(clientesArray)) {
        setClients(clientesArray)
        setTotal(clientesArray.length)
      }
    } catch (err) {
      toast.error('Error al eliminar')
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error: {error}
        </div>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
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
            Gestiona tu base de clientes ({total} registrados)
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
          {totalFiltered} cliente{totalFiltered !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Contenido */}
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
      ) : paginatedData.length === 0 ? (
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
        <>
          {/* Tabla básica */}
         <div className="overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-slate-50/80 dark:bg-slate-800/60">
        <tr>
          <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Cliente
          </th>
          <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            DNI
          </th>
          <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Teléfono
          </th>
          <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Fecha registro
          </th>
          <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Estado
          </th>
          <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {paginatedData.map((row) => (
          <tr
            key={row.id}
            className="group transition-all duration-200 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 hover:shadow-sm"
          >
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold text-sm ring-1 ring-primary/10">
                  {row.nombre_completo?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1">
                    {row.nombre_completo || 'Sin nombre'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                    {row.email || 'Sin email'}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-5 py-4 font-mono text-sm text-slate-700 dark:text-slate-300">
              {row.dni || '—'}
            </td>
            <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
              {row.telefono || '—'}
            </td>
            <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
              {row.fecha_registro
                ? new Date(row.fecha_registro).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '—'}
            </td>
            <td className="px-5 py-4">
              <Badge
                variant={row.estado === 'activo' ? 'success' : 'secondary'}
                className="capitalize shadow-sm"
              >
                {row.estado || 'activo'}
              </Badge>
            </td>
            <td className="px-5 py-4 text-right">
              <div className="flex items-center justify-end gap-1">
                <Link
                  to={`/clients/${row.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:text-slate-400 dark:hover:bg-primary/20 dark:hover:text-primary"
                  title="Ver cliente"
                >
                  <Eye size={17} />
                </Link>
                <Link
                  to={`/clients/edit/${row.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-500/20 dark:hover:text-blue-400"
                  title="Editar cliente"
                >
                  <Edit size={17} />
                </Link>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
                  title="Eliminar cliente"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalFiltered)} de {totalFiltered} clientes
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="gap-1"
              >
                <ChevronLeft size={14} />
                Anterior
              </Button>
              <span className="flex items-center px-3 text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="gap-1"
              >
                Siguiente
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}