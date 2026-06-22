"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Bell, User, ChevronDown, ArrowRightToLine, LogOut } from 'lucide-react'
import { MdSearch, MdSettings, MdBarChart, MdInventory2, MdAttachMoney, MdReceipt } from 'react-icons/md'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'
import { NotificationList } from '../notifications/NotificationList'
import { Notification } from '../notifications/notification.types'

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
}: {
  onMenuClick?: () => void
  onToggleCollapse?: () => void
  sidebarCollapsed?: boolean
}) => {
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
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

  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      title: 'Nueva venta registrada', 
      description: 'Venta #SALE-4567 por $1,299.00',
      time: 'Hace 5 min', 
      icon: '💰', 
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      read: false,
      type: 'sale',
      link: '/sales'
    },
    { 
      id: 2, 
      title: 'Stock bajo: iPhone 15', 
      description: 'Solo 3 unidades disponibles',
      time: 'Hace 1 h', 
      icon: '📦', 
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      read: false,
      type: 'stock',
      link: '/stock'
    },
    { 
      id: 3, 
      title: 'Reparación completada', 
      description: 'iPhone 14 Pro - Pantalla reemplazada',
      time: 'Hace 2 h', 
      icon: '🔧', 
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      read: false,
      type: 'repair',
      link: '/reparaciones/list'
    },
    { 
      id: 4, 
      title: 'Nuevo cliente registrado', 
      description: 'María González - Cliente VIP',
      time: 'Hace 3 h', 
      icon: '👤', 
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      read: true,
      type: 'client',
      link: '/clients'
    },
    { 
      id: 5, 
      title: 'Pedido enviado #ORD-1234', 
      description: 'En camino al cliente',
      time: 'Hace 4 h', 
      icon: '🚚', 
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      read: true,
      type: 'shipment',
      link: '/envios/tracking'
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const handleNotificationDelete = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const handleViewAll = () => {
    navigate('/notifications')
  }

  return (
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
        {/* Global Search */}
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

        {/* 🪟 Notificaciones mejoradas con NotificationList */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell size={18} className="text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] animate-pulse">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[400px] p-0 max-h-[70vh] overflow-hidden z-50">
            <NotificationList
              notifications={notifications}
              onNotificationRead={handleNotificationRead}
              onNotificationDelete={handleNotificationDelete}
              onMarkAllRead={handleMarkAllRead}
              onViewAll={handleViewAll}
            />
          </PopoverContent>
        </Popover>

        {/* Profile */}
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
              <button onClick={handleLogout} className="flex items-center gap-2 w-full">
                Cerrar sesión <LogOut size={18} />
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default AdminTopBar
