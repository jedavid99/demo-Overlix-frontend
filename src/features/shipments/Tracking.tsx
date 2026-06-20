import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Search, Plus, ChevronDown, MoreVertical, Package,
  Truck, CheckCircle, Clock, MapPin, Navigation,
  Calendar, Phone, Mail, User, Box, ArrowRight,
  Filter, Download, Eye, Edit, Trash2, X,
  Circle, TrendingUp, TrendingDown, AlertCircle,
  FileText, Printer, Share2, Star, Bell, Settings,
  Map, Globe, Compass, Activity, BarChart3,
  Shield, Zap, Award, Target, Gift, CreditCard,
  Home, ShoppingBag, Wrench, HelpCircle, Maximize2,
  Minimize2, ChevronLeft, ChevronRight, RotateCw,
  Info, ExternalLink, MessageSquare, ThumbsUp
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
interface Shipment {
  id: string
  customer: string
  type: 'Repair' | 'Sale'
  provider: string
  location: string
  progress: number
  status: 'preparation' | 'transit' | 'delivery' | 'delivered'
  estimatedDelivery: string
  origin: string
  destination: string
  weight: string
  items: number
  lat?: number
  lng?: number
  lastUpdate: string
  driver?: string
  vehicle?: string
  signature?: boolean
  description?: string
  value?: string
}

interface LogEvent {
  title: string
  detail: string
  completed: boolean
  time: string
  icon?: React.ReactNode
}

export default function Tracking() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState<'details' | 'map' | 'timeline'>('details')
  const [mapZoom, setMapZoom] = useState(12)

  const location = useLocation()

  useEffect(() => {
    if (location.state) {
      const st = location.state as any
      if (st.shipment) {
        setSelectedShipment(st.shipment)
      }
      if (st.searchTerm) {
        setSearchTerm(st.searchTerm)
      }
      if (st.filterStatus) {
        setFilterStatus(st.filterStatus)
      }
    }
  }, [location.state])

  // Abrir modal con el envío seleccionado
  const openTrackingModal = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowModal(true)
    setModalView('details')
  }

  const shipments: Shipment[] = [
    { 
      id: '#TRK90210', 
      customer: 'John Doe', 
      type: 'Repair', 
      provider: 'FedEx', 
      location: 'Memphis, TN', 
      progress: 75,
      status: 'transit',
      estimatedDelivery: 'Oct 25, 2024',
      origin: 'Nashville, TN',
      destination: 'Miami, FL',
      weight: '2.5 kg',
      items: 3,
      lat: 35.1495,
      lng: -90.0490,
      lastUpdate: '10:45 AM',
      driver: 'Mike Johnson',
      vehicle: 'FedEx Truck #442',
      signature: false,
      description: 'iPhone 14 Pro Max - Reparación de pantalla',
      value: '$1,299.00'
    },
    { 
      id: '#TRK88432', 
      customer: 'Jane Smith', 
      type: 'Sale', 
      provider: 'DHL Express', 
      location: 'Cincinnati, OH', 
      progress: 40,
      status: 'transit',
      estimatedDelivery: 'Oct 26, 2024',
      origin: 'Chicago, IL',
      destination: 'Atlanta, GA',
      weight: '1.8 kg',
      items: 2,
      lat: 39.1031,
      lng: -84.5120,
      lastUpdate: '09:30 AM',
      driver: 'Sarah Williams',
      vehicle: 'DHL Van #128',
      signature: false,
      description: 'Samsung Galaxy S23 Ultra - Venta',
      value: '$1,499.00'
    },
    { 
      id: '#TRK77211', 
      customer: 'Tech Corp', 
      type: 'Repair', 
      provider: 'UPS', 
      location: 'Louisville, KY', 
      progress: 90,
      status: 'delivery',
      estimatedDelivery: 'Oct 24, 2024',
      origin: 'Dallas, TX',
      destination: 'New York, NY',
      weight: '3.2 kg',
      items: 5,
      lat: 38.2527,
      lng: -85.7585,
      lastUpdate: '11:15 AM',
      driver: 'Robert Brown',
      vehicle: 'UPS Truck #789',
      signature: false,
      description: 'MacBook Pro 16" - Reparación de teclado',
      value: '$2,499.00'
    },
    { 
      id: '#TRK66543', 
      customer: 'Alice Brown', 
      type: 'Sale', 
      provider: 'FedEx', 
      location: 'Dallas, TX', 
      progress: 20,
      status: 'preparation',
      estimatedDelivery: 'Oct 28, 2024',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      weight: '1.2 kg',
      items: 1,
      lat: 32.7767,
      lng: -96.7970,
      lastUpdate: '08:45 AM',
      driver: 'Pending',
      vehicle: 'Pending',
      signature: false,
      description: 'iPad Pro 12.9" - Venta',
      value: '$1,099.00'
    },
    { 
      id: '#TRK55123', 
      customer: 'Robert Wilson', 
      type: 'Repair', 
      provider: 'USPS', 
      location: 'Denver, CO', 
      progress: 100,
      status: 'delivered',
      estimatedDelivery: 'Oct 23, 2024',
      origin: 'Seattle, WA',
      destination: 'Denver, CO',
      weight: '4.1 kg',
      items: 2,
      lat: 39.7392,
      lng: -104.9903,
      lastUpdate: '02:30 PM',
      driver: 'Tom Davis',
      vehicle: 'USPS Truck #231',
      signature: true,
      description: 'iMac 24" - Reparación de pantalla',
      value: '$1,899.00'
    },
  ]

  const kpiCards = [
    {
      title: 'En Preparaci�n',
      value: 12,
      change: 2,
      icon: <Package size={20} />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'En Tr�nsito',
      value: 45,
      change: 5,
      icon: <Truck size={20} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'En Reparto',
      value: 8,
      change: -1,
      icon: <Navigation size={20} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Entregados',
      value: 124,
      change: 12,
      icon: <CheckCircle size={20} />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
  ]
  const filteredShipments = shipments.filter(s => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        s.id.toLowerCase().includes(term) ||
        s.customer.toLowerCase().includes(term) ||
        s.location.toLowerCase().includes(term) ||
        s.provider.toLowerCase().includes(term)
      )
    }
    return true
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'preparation': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'transit': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'delivery': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-muted text-foreground border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'preparation': return <Package size={14} />
      case 'transit': return <Truck size={14} />
      case 'delivery': return <Navigation size={14} />
      case 'delivered': return <CheckCircle size={14} />
      default: return <Circle size={14} />
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'preparation': return 'Preparación'
      case 'transit': return 'En Tránsito'
      case 'delivery': return 'En Reparto'
      case 'delivered': return 'Entregado'
      default: return status
    }
  }

  const getTrackingLog = (shipmentId: string): LogEvent[] => {
    return [
      { 
        title: 'Arrived at Sort Facility', 
        detail: 'Memphis, TN', 
        completed: true,
        time: 'Oct 24, 10:45 AM',
        icon: <Package size={14} className="text-green-600" />
      },
      { 
        title: 'Departed Origin Hub', 
        detail: 'Nashville, TN', 
        completed: true,
        time: 'Oct 23, 08:30 PM',
        icon: <Truck size={14} className="text-blue-600" />
      },
      { 
        title: 'Picked Up by Carrier', 
        detail: 'Nashville, TN', 
        completed: true,
        time: 'Oct 23, 03:15 PM',
        icon: <User size={14} className="text-purple-600" />
      },
      { 
        title: 'Label Created', 
        detail: 'Logistics Hub', 
        completed: true,
        time: 'Oct 22, 11:20 AM',
        icon: <FileText size={14} className="text-foreground" />
      },
    ]
  }

  const getMapUrl = (lat: number, lng: number, zoom: number) => {
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=800x500&markers=${lat},${lng},red-pin`
  }

  // Modal de seguimiento
  const TrackingModal = () => {
    if (!selectedShipment) return null

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay con blur */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setShowModal(false)}
        />

        {/* Modal Container */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-card rounded-2xl shadow-2xl transform transition-all animate-slideUp">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Truck size={28} className="text-white" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    selectedShipment.status === 'delivered' ? 'bg-green-500' :
                    selectedShipment.status === 'transit' ? 'bg-blue-500' :
                    selectedShipment.status === 'delivery' ? 'bg-purple-500' :
                    'bg-amber-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedShipment.id}
                    </h2>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedShipment.status)}`}>
                      {getStatusIcon(selectedShipment.status)}
                      {getStatusText(selectedShipment.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedShipment.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Navegación entre vistas */}
                <div className="flex bg-muted dark:bg-muted rounded-lg p-1 mr-4">
                  <button
                    onClick={() => setModalView('details')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      modalView === 'details'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                        : 'text-foreground dark:text-muted-foreground hover:text-gray-900'
                    }`}
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => setModalView('map')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      modalView === 'map'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                        : 'text-foreground dark:text-muted-foreground hover:text-gray-900'
                    }`}
                  >
                    Mapa
                  </button>
                  <button
                    onClick={() => setModalView('timeline')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      modalView === 'timeline'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                        : 'text-foreground dark:text-muted-foreground hover:text-gray-900'
                    }`}
                  >
                    Timeline
                  </button>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-muted dark:hover:bg-muted rounded-xl transition-colors"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {modalView === 'details' && (
                <div className="space-y-6">
                  {/* Progreso */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Progreso del envío</h3>
                      <Target size={20} className="opacity-80" />
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Completado</span>
                        <span className="font-bold">{selectedShipment.progress}%</span>
                      </div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${selectedShipment.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-white/70 mb-1">Origen</p>
                        <p className="text-sm font-medium">{selectedShipment.origin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70 mb-1">Destino</p>
                        <p className="text-sm font-medium">{selectedShipment.destination}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70 mb-1">Entrega estimada</p>
                        <p className="text-sm font-medium">{selectedShipment.estimatedDelivery}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/70 mb-1">Última actualización</p>
                        <p className="text-sm font-medium">{selectedShipment.lastUpdate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Grid de información */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Información del paquete */}
                    <div className="bg-gray-50 dark:bg-muted/50 rounded-xl p-6">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Package size={18} className="text-blue-600" />
                        Detalles del paquete
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-muted-foreground">Peso</span>
                          <span className="text-sm font-medium text-foreground">{selectedShipment.weight}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-muted-foreground">Artículos</span>
                          <span className="text-sm font-medium text-foreground">{selectedShipment.items} unidades</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-muted-foreground">Transportista</span>
                          <span className="text-sm font-medium text-foreground">{selectedShipment.provider}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Valor</span>
                          <span className="text-sm font-bold text-green-600">{selectedShipment.value}</span>
                        </div>
                      </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="bg-gray-50 dark:bg-muted/50 rounded-xl p-6">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <User size={18} className="text-blue-600" />
                        Cliente
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
                            <User size={18} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{selectedShipment.customer}</p>
                            <p className="text-xs text-muted-foreground">ID: CLT-{Math.floor(Math.random() * 10000)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-muted-foreground" />
                          <span className="text-sm text-foreground dark:text-muted-foreground">+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-muted-foreground" />
                          <span className="text-sm text-foreground dark:text-muted-foreground">{selectedShipment.customer.toLowerCase().replace(' ', '.')}@email.com</span>
                        </div>
                      </div>
                    </div>

                    {/* Información del transportista */}
                    <div className="bg-gray-50 dark:bg-muted/50 rounded-xl p-6">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Truck size={18} className="text-blue-600" />
                        Transportista
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                            <User size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{selectedShipment.driver}</p>
                            <p className="text-xs text-muted-foreground">Conductor</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck size={14} className="text-muted-foreground" />
                          <span className="text-sm text-foreground dark:text-muted-foreground">{selectedShipment.vehicle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-muted-foreground" />
                          <span className="text-sm text-foreground dark:text-muted-foreground">+1 (555) 987-6543</span>
                        </div>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-gray-50 dark:bg-muted/50 rounded-xl p-6">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Info size={18} className="text-blue-600" />
                        Información adicional
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-muted-foreground">Tipo de envío</span>
                          <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                            selectedShipment.type === 'Repair'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {selectedShipment.type}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-muted-foreground">Firma requerida</span>
                          <span className={`text-sm font-medium ${selectedShipment.signature ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {selectedShipment.signature ? 'Sí' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Seguimiento</span>
                          <span className="text-sm font-mono font-bold text-blue-600">{selectedShipment.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones rápidas */}
                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <Phone size={16} />
                      <span className="text-sm font-medium">Contactar conductor</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-muted transition-colors">
                      <Share2 size={16} className="text-foreground" />
                      <span className="text-sm font-medium text-foreground dark:text-gray-300">Compartir</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-muted transition-colors">
                      <Download size={16} className="text-foreground" />
                      <span className="text-sm font-medium text-foreground dark:text-gray-300">PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {modalView === 'map' && selectedShipment.lat && selectedShipment.lng && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Map size={20} className="text-blue-600" />
                      <h3 className="font-semibold text-foreground">Ubicación en tiempo real</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                        className="p-2 bg-muted dark:bg-muted rounded-lg hover:bg-muted"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => setMapZoom(Math.max(mapZoom - 1, 5))}
                        className="p-2 bg-muted dark:bg-muted rounded-lg hover:bg-muted"
                      >
                        <Minus size={16} />
                      </button>
                      <button
                        onClick={() => setMapZoom(12)}
                        className="p-2 bg-muted dark:bg-muted rounded-lg hover:bg-muted"
                      >
                        <RotateCw size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="relative h-96 w-full bg-muted dark:bg-muted rounded-xl overflow-hidden">
                    <img
                      src={getMapUrl(selectedShipment.lat, selectedShipment.lng, mapZoom)}
                      alt={`Map showing location of ${selectedShipment.location}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay con coordenadas */}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-muted/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Ubicación actual</p>
                      <p className="text-sm font-semibold text-foreground">
                        {selectedShipment.location}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lat: {selectedShipment.lat.toFixed(4)} • Lng: {selectedShipment.lng.toFixed(4)}
                      </p>
                    </div>

                    {/* Marcador animado */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="w-8 h-8 bg-red-600 rounded-full animate-ping opacity-50 absolute"></div>
                        <div className="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg relative flex items-center justify-center">
                          <Truck size={16} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Información de ruta */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-muted/90 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-green-600" />
                          <span className="text-sm font-medium">{selectedShipment.origin}</span>
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-red-600" />
                          <span className="text-sm font-medium">{selectedShipment.destination}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Distancia: 1,245 km</span>
                        <span>Tiempo estimado: 2 días</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-foreground">Vehículo en movimiento</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      <ExternalLink size={14} />
                      Ver en Google Maps
                    </button>
                  </div>
                </div>
              )}

              {modalView === 'timeline' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity size={20} className="text-blue-600" />
                      <h3 className="font-semibold text-foreground">Historial de seguimiento</h3>
                    </div>
                    <span className="text-sm text-muted-foreground">6 eventos</span>
                  </div>

                  <div className="relative">
                    {/* Línea de tiempo vertical */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted dark:bg-gray-700"></div>
                    
                    <div className="space-y-6">
                      {getTrackingLog(selectedShipment.id).map((log, index) => (
                        <div key={index} className="relative flex gap-4">
                          <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              log.completed 
                                ? 'bg-green-100 dark:bg-green-900/20' 
                                : 'bg-muted dark:bg-muted'
                            }`}>
                              {log.icon || <Clock size={20} className={
                                log.completed ? 'text-green-600' : 'text-muted-foreground'
                              } />}
                            </div>
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-base font-semibold text-foreground">
                                {log.title}
                              </p>
                              <span className="text-xs font-medium px-2 py-1 bg-muted dark:bg-muted rounded-full">
                                {log.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin size={14} />
                              {log.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Evento actual */}
                      <div className="relative flex gap-4">
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center animate-pulse">
                            <Navigation size={20} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-base font-semibold text-foreground">
                              En camino a destino final
                            </p>
                            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              En curso
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin size={14} />
                            Próxima parada: {selectedShipment.destination}
                          </p>
                        </div>
                      </div>

                      {/* Eventos futuros */}
                      <div className="relative flex gap-4 opacity-50">
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-muted dark:bg-muted rounded-xl flex items-center justify-center">
                            <CheckCircle size={20} className="text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-muted-foreground">
                            Entrega programada
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedShipment.destination} • {selectedShipment.estimatedDelivery}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nota adicional */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start gap-3">
                    <Info size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        ¿Necesitas más información?
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                        Contacta con atención al cliente para más detalles sobre este envío.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg">
                  <MessageSquare size={18} className="text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg">
                  <ThumbsUp size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Descargar comprobante
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        {/* ... (mantén el header igual) ... */}
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* ... (mantén el título y KPIs igual) ... */}

          {/* Live Shipments Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
            {/* ... (mantén el header de la tabla igual) ... */}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>{/* ... */}</thead>
                <tbody className="divide-y divide-border">
                  {filteredShipments.map((shipment) => (
                    <tr
                      key={shipment.id}
                      className="group hover:bg-muted/50 cursor-pointer transition-all"
                      onClick={() => openTrackingModal(shipment)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-blue-600">
                            {shipment.id}
                          </span>
                          {shipment.signature && (
                            <Award size={14} className="text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                            <User size={14} className="text-foreground dark:text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {shipment.customer}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          shipment.type === 'Repair'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {shipment.type === 'Repair' ? <Wrench size={12} /> : <ShoppingBag size={12} />}
                          {shipment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-muted dark:bg-muted rounded flex items-center justify-center">
                            <Package size={12} className="text-muted-foreground" />
                          </div>
                          <span className="text-sm text-foreground dark:text-gray-300">{shipment.provider}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-muted-foreground" />
                          <span className="text-sm text-foreground dark:text-muted-foreground">{shipment.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          {getStatusText(shipment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-muted dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${shipment.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-foreground dark:text-gray-300">
                            {shipment.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            openTrackingModal(shipment)
                          }}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de seguimiento */}
      {showModal && <TrackingModal />}
    </div>
  )
}

// Componente Minus para el zoom
const Minus = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)





