import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import {
  MdFileDownload,
  MdSearch,
  MdReceipt,
  MdCheckCircle,
  MdHourglassEmpty,
  MdCancel,
  MdErrorOutline,
  MdBarChart,
  MdAdd,
  MdVisibility,
  MdEdit,
  MdDelete,
} from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { exportToCSV } from '@/shared/lib/export'

// Tipos
interface Budget {
  id: string
  clientName: string
  clientPhone: string
  device: string
  issue: string
  total: number
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Completado'
  date: Date
  technician: string
}

// Datos mock eliminados – conectar con API real
// const sampleBudgets: Budget[] = [ ... ]

const STATUS_COLORS = {
  Pendiente: '#f59e0b', // amber
  Aprobado: '#10b981', // green
  Rechazado: '#ef4444', // red
  Completado: '#3b82f6', // blue
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}

const Budgets = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // 🔌 Conectar con API real:
    // api.get('/budgets').then(res => setBudgets(res.data)).catch(() => setError(true)).finally(() => setLoading(false))
    setTimeout(() => {
      // setBudgets(sampleBudgets) // Opcional: descomentar para ver datos
      setLoading(false)
    }, 800)
  }, [])

  // Filtrar presupuestos
  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // KPIs
  const totalBudgets = filteredBudgets.length
  const totalPending = filteredBudgets.filter((b) => b.status === 'Pendiente').length
  const totalApproved = filteredBudgets.filter((b) => b.status === 'Aprobado').length
  const totalValue = filteredBudgets.reduce((sum, b) => sum + b.total, 0)

  // Datos para gráfico de estado
  const statusData = [
    { name: 'Pendiente', value: totalPending },
    { name: 'Aprobado', value: totalApproved },
    {
      name: 'Rechazado',
      value: filteredBudgets.filter((b) => b.status === 'Rechazado').length,
    },
    {
      name: 'Completado',
      value: filteredBudgets.filter((b) => b.status === 'Completado').length,
    },
  ].filter((d) => d.value > 0)

  // Paginación
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage)

  // Exportar CSV
  const handleExport = () => {
    const csvData = filteredBudgets.map((budget) => ({
      ID: budget.id,
      Cliente: budget.clientName,
      Teléfono: budget.clientPhone,
      Dispositivo: budget.device,
      Problema: budget.issue,
      Total: budget.total,
      Estado: budget.status,
      Fecha: format(budget.date, 'dd/MM/yyyy', { locale: es }),
      Técnico: budget.technician,
    }))
    exportToCSV(csvData, 'presupuestos')
  }

  const handleRetry = () => {
    setError(false)
    setLoading(true)
    // api.get('/budgets').then(...)
    setLoading(false)
  }

  const getStatusBadge = (status: Budget['status']) => {
    const variants = {
      Pendiente: 'warning',
      Aprobado: 'success',
      Rechazado: 'destructive',
      Completado: 'default',
    }
    return variants[status] as 'warning' | 'success' | 'destructive' | 'default'
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-6"
      >
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
        <Skeleton className="h-96" />
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6"
      >
        <Card className="p-12 text-center">
          <MdErrorOutline size={64} className="mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar los presupuestos</h2>
          <p className="text-muted-foreground mb-4">Hubo un problema al obtener los datos.</p>
          <Button onClick={handleRetry}>Reintentar</Button>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Presupuestos de Reparaciones</h1>
          <p className="text-muted-foreground">Gestión de presupuestos y cotizaciones</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline" className="gap-2" disabled={filteredBudgets.length === 0}>
            <MdFileDownload size={18} />
            Exportar
          </Button>
          <Button onClick={() => navigate('/budgets/add')} className="gap-2">
            <MdAdd size={18} />
            Nuevo presupuesto
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MdReceipt className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalBudgets}</p>
            <p className="text-sm text-muted-foreground">Total de presupuestos</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <MdHourglassEmpty className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-500">{totalPending}</p>
            <p className="text-sm text-muted-foreground">Pendientes de aprobación</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <MdCheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success">{totalApproved}</p>
            <p className="text-sm text-muted-foreground">Aprobados</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MdBarChart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-muted-foreground">Valor total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por cliente, dispositivo o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['all', 'Pendiente', 'Aprobado', 'Rechazado', 'Completado'].map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'Todos' : status}
              </Badge>
            ))}
          </div>
          {(searchQuery || statusFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-muted-foreground"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
              }}
            >
              <MdCancel size={14} className="mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </Card>

      {/* Gráfico de estado y tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de presupuestos (ocupa 2 columnas) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lista de presupuestos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBudgets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MdReceipt size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                <p>No hay presupuestos que coincidan con los filtros</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-card/80 backdrop-blur-md sticky top-0">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">ID</th>
                        <th className="pb-3 font-medium">Cliente</th>
                        <th className="pb-3 font-medium">Dispositivo</th>
                        <th className="pb-3 font-medium text-right">Total</th>
                        <th className="pb-3 font-medium">Fecha</th>
                        <th className="pb-3 font-medium text-center">Estado</th>
                        <th className="pb-3 font-medium text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {paginatedBudgets.map((budget) => (
                        <tr
                          key={budget.id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 font-mono font-medium">{budget.id}</td>
                          <td className="py-3">{budget.clientName}</td>
                          <td className="py-3">{budget.device}</td>
                          <td className="py-3 text-right font-semibold">
                            {formatCurrency(budget.total)}
                          </td>
                          <td className="py-3">
                            {format(budget.date, 'dd/MM/yyyy', { locale: es })}
                          </td>
                          <td className="py-3 text-center">
                            <Badge variant={getStatusBadge(budget.status)} size="sm">
                              {budget.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-8 w-8"
                                onClick={() => navigate(`/budgets/${budget.id}`)}
                              >
                                <MdVisibility size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-8 w-8"
                                onClick={() => navigate(`/budgets/edit/${budget.id}`)}
                              >
                                <MdEdit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm('¿Eliminar este presupuesto?')) {
                                    // Lógica de eliminación
                                  }
                                }}
                              >
                                <MdDelete size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Paginación */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, filteredBudgets.length)} de{' '}
                    {filteredBudgets.length}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de distribución por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                <p>Sin datos</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const total = statusData.reduce((sum, d) => sum + d.value, 0)
                          const value = payload[0].value as number
                          const percentage = ((value / total) * 100).toFixed(1)
                          return (
                            <Card className="p-3 shadow-lg">
                              <p className="text-sm font-semibold">{payload[0].name}</p>
                              <p className="text-sm text-muted-foreground">
                                {value} presupuestos ({percentage}%)
                              </p>
                            </Card>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {statusData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[item.name as keyof typeof STATUS_COLORS],
                          }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export default Budgets