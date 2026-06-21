"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, User, Command, PanelLeft, ChevronDown, ArrowRight, ArrowRightToLine, LogOut, X } from 'lucide-react'
import { MdSearch, MdSettings, MdBarChart, MdInventory2, MdAttachMoney, MdReceipt } from 'react-icons/md'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'

const categories = [
  { value: 'all', label: 'Todo', placeholder: 'Buscar en Overlix...', route: '/dashboard' },
  { value: 'sales', label: 'Ventas', placeholder: 'Buscar venta...', route: '/sales' },
  { value: 'repairs', label: 'Reparaciones', placeholder: 'Buscar reparación...', route: '/reparaciones/list' },
  { value: 'clients', label: 'Clientes', placeholder: 'Buscar cliente...', route: '/clients' },
  { value: 'expenses', label: 'Gastos', placeholder: 'Buscar gasto...', route: '/expenses' },
  { value: 'stock', label: 'Stock', placeholder: 'Buscar producto...', route: '/stock' },
  { value: 'shipments', label: 'Envíos', placeholder: 'Buscar envío...', route: '/envios/tracking' },
  { value: 'orders', label: 'Órdenes de Compra', placeholder: 'Buscar orden de compra...', route: '/providers/orders', icon: <MdReceipt size={16} /> },
  { value: 'reports-sales', label: 'Reporte Ventas', placeholder: 'Buscar en reporte de ventas...', route: '/reports/sales', icon: <MdBarChart size={16} /> },
  { value: 'reports-stock', label: 'Reporte Stock', placeholder: 'Buscar en reporte de stock...', route: '/reports/stock', icon: <MdInventory2 size={16} /> },
  { value: 'reports-financial', label: 'Reporte Financiero', placeholder: 'Buscar en reporte financiero...', route: '/reports/financial', icon: <MdAttachMoney size={16} /> },
]

export const AdminTopBar = ({
  onMenuClick = () => {},
  onToggleCollapse = () => {},
  sidebarCollapsed = false,
  sidebarOpen = false,
}: {
  onMenuClick?: () => void
  onToggleCollapse?: () => void
  sidebarCollapsed?: boolean
  sidebarOpen?: boolean
}) => {
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false) // 🆕 estado para el modal
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const navigateL = useNavigate()

  const handleLogout = () => {
    // Limpiar sesión aquí si es necesario
    navigateL('/')
  }

  const currentCategory = categories.find(cat => cat.value === selectedCategory) || categories[0]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const route = currentCategory.route
      navigate(`${route}?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 lg:px-6 bg-card/80 backdrop-blur-md border-b border-border z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <Button onClick={onMenuClick} variant="ghost" size="icon-sm" className="lg:hidden">
            <Menu size={18} />
          </Button>
          <Button onClick={onToggleCollapse} variant="ghost" size="icon-sm" className="hidden lg:inline-flex">
            <ArrowRightToLine size={18} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Search (sin cambios) */}
          <div className="hidden md:flex items-center gap-0 w-64">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 h-9 px-3 rounded-l-full border border-input border-r-0 bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors">
                  {currentCategory.label}
                  <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {categories.map(cat => (
                  <DropdownMenuItem
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={selectedCategory === cat.value ? 'bg-muted' : ''}
                  >
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      {cat.label}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative flex-1">
              <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={currentCategory.placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`h-9 w-full rounded-r-full border border-input bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none transition-all duration-150 ${searchFocused ? 'ring-1 ring-primary/20 border-primary' : ''}`}
              />
            </div>
          </div>

          {/* Botón de notificaciones - abre el modal */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell size={18} className="text-muted-foreground" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              3
            </Badge>
          </Button>

          {/* Profile (sin cambios) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                  D
                </div>
                <ChevronDown size={14} className="hidden sm:block text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User size={16} className="mr-2" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <MdSettings size={16} className="mr-2" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer">
                <button onClick={handleLogout}>Cerrar sesión <LogOut size={18} className="h-5 w-5 flex items-center justify-center shrink-0" /></button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* 🪟 MODAL DE NOTIFICACIONES */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Cerrar al hacer clic en el fondo (fuera del panel)
            if (e.target === e.currentTarget) setNotificationsOpen(false)
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Notificaciones</h2>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Lista de notificaciones (scroll) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-xl border border-border">
                <span className="text-sm font-medium text-foreground">Nueva venta registrada</span>
                <span className="text-xs text-muted-foreground">Hace 5 minutos</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-xl border border-border">
                <span className="text-sm font-medium text-foreground">Stock bajo: iPhone 15</span>
                <span className="text-xs text-muted-foreground">Hace 1 hora</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-xl border border-border">
                <span className="text-sm font-medium text-foreground">Reparación completada</span>
                <span className="text-xs text-muted-foreground">Hace 2 horas</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-xl border border-border">
                <span className="text-sm font-medium text-foreground">Nuevo cliente registrado</span>
                <span className="text-xs text-muted-foreground">Hace 3 horas</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-muted/50 rounded-xl border border-border">
                <span className="text-sm font-medium text-foreground">Pedido enviado #ORD-1234</span>
                <span className="text-xs text-muted-foreground">Hace 4 horas</span>
              </div>
            </div>

            {/* Pie del modal */}
            <div className="p-4 border-t border-border text-center">
              <button
                onClick={() => {
                  // Aquí puedes navegar a la página de notificaciones
                  navigate('/notifications')
                  setNotificationsOpen(false)
                }}
                className="text-sm font-medium text-primary hover:underline"
              >
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminTopBar