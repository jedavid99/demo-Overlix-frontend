import React, { useState } from 'react'
import { Calendar, Filter, CreditCard, Download, TrendingUp, Clock, AlertCircle, PieChart, Info, Plus } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function Expenses() {
  const [dateFilter, setDateFilter] = useState('last-30')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

  const expenses = [
    {
      id: 1,
      date: 'Oct 24, 2023',
      description: 'OLED Screens (iPhone 13)',
      category: 'Parts',
      categoryColor: 'blue',
      supplier: 'TechDistri Co.',
      amount: 1250.00,
      status: 'Paid',
    },
    {
      id: 2,
      date: 'Oct 22, 2023',
      description: 'Main Shop Monthly Rent',
      category: 'Rent',
      categoryColor: 'purple',
      supplier: 'Skyline Realty',
      amount: 3500.00,
      status: 'Pending',
    },
    {
      id: 3,
      date: 'Oct 20, 2023',
      description: 'Bi-weekly Staff Salaries',
      category: 'Salaries',
      categoryColor: 'rose',
      supplier: 'Internal Payroll',
      amount: 4800.00,
      status: 'Paid',
    },
    {
      id: 4,
      date: 'Oct 18, 2023',
      description: 'Advanced Microsoldering Station',
      category: 'Tools',
      categoryColor: 'amber',
      supplier: 'PrecisionTools Inc.',
      amount: 850.00,
      status: 'Paid',
    },
    {
      id: 5,
      date: 'Oct 15, 2023',
      description: 'Logitech Mouse/Keyboard Bulk',
      category: 'Parts',
      categoryColor: 'blue',
      supplier: 'LogiSupplies',
      amount: 620.00,
      status: 'Pending',
    },
  ]

  const getCategoryBadge = (color: string) => {
    switch (color) {
      case 'blue': return { variant: 'default' as const };
      case 'purple': return { variant: 'secondary' as const };
      case 'rose': return { variant: 'destructive' as const };
      case 'amber': return { variant: 'warning' as const };
      default: return { variant: 'outline' as const };
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'Paid' 
      ? { variant: 'success' as const }
      : { variant: 'warning' as const };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Gastos</h1>
          <p className="text-muted-foreground">Monitorea y analiza los costos operativos del negocio</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Nuevo gasto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total (Mes)</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">$12,450.00</p>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
              <TrendingUp size={16} />
              <span>+12.5% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pagos Pendientes</p>
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">8 Pagos</p>
            <p className="text-muted-foreground text-sm mt-2">Esperando aprobación: 3</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría Principal</p>
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">Partes</p>
            <p className="text-muted-foreground text-sm mt-2">42% del gasto mensual</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
                  <Calendar size={18} className="text-muted-foreground" />
                  <select
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground"
                  >
                    <option value="last-30">Últimos 30 días</option>
                    <option value="this-month">Este mes</option>
                    <option value="last-quarter">Último trimestre</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
                  <Filter size={18} className="text-muted-foreground" />
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="rent">Renta</option>
                    <option value="parts">Partes</option>
                    <option value="salaries">Salarios</option>
                    <option value="tools">Herramientas</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
                  <CreditCard size={18} className="text-muted-foreground" />
                  <select
                    value={paymentFilter}
                    onChange={e => setPaymentFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground"
                  >
                    <option value="all">Todos los métodos</option>
                    <option value="bank">Transferencia</option>
                    <option value="card">Tarjeta</option>
                    <option value="cash">Efectivo</option>
                  </select>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Download size={16} className="mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proveedor</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monto</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {expenses.map(expense => (
                      <tr key={expense.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{expense.date}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{expense.description}</td>
                        <td className="px-6 py-4 text-sm">
                          <Badge variant={getCategoryBadge(expense.categoryColor).variant}>
                            {expense.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{expense.supplier}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">${expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={getStatusBadge(expense.status).variant}>
                            {expense.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">Mostrando 5 de 42 gastos</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Anterior</Button>
                  <Button variant="default" size="sm">Siguiente</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-foreground font-semibold mb-6 flex items-center gap-2">
                <PieChart size={18} className="text-primary" />
                Distribución por Categoría
              </h3>

              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="18" className="text-primary" strokeDasharray="94 345" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="18" className="text-purple-500" strokeDasharray="91 345" strokeDashoffset="-94" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="18" className="text-rose-500" strokeDasharray="125 345" strokeDashoffset="-185" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xs font-semibold text-muted-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">$12.4k</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-rose-500" />
                    <span className="text-sm font-medium text-foreground">Salarios</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">$4,800</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-purple-500" />
                    <span className="text-sm font-medium text-foreground">Renta</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">$3,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-primary" />
                    <span className="text-sm font-medium text-foreground">Partes</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">$3,300</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium text-foreground">Herramientas</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">$850</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6">
                Ver reporte detallado
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 dark:bg-primary/5 border-primary/10">
            <CardContent className="p-6">
              <h4 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={16} />
                Insights Rápidos
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Gastos en partes <span className="font-semibold text-primary">15% más altos</span> que el promedio esta semana.
                  </p>
                </li>
                <li className="flex gap-3">
                  <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Ahorraste <span className="font-semibold text-primary">$200</span> en renta por pago anticipado.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

