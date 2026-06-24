import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Smartphone,
  Laptop,
  Gamepad2,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Loader2,
  Eye,
  Trash2,
  Edit,
  FileText,
  Package,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { repairService } from '@/services/repairService';
import { toast } from '@/hooks/use-toast';
import RepairPreviewModal from './RepairPreviewModal';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending': return { variant: 'warning' as const, label: 'Pendiente' };
    case 'diagnostic': return { variant: 'default' as const, label: 'Diagnóstico' };
    case 'in_progress': return { variant: 'default' as const, label: 'En Progreso' };
    case 'waiting_parts': return { variant: 'warning' as const, label: 'Esperando Repuestos' };
    case 'ready': return { variant: 'success' as const, label: 'Listo' };
    case 'delivered': return { variant: 'outline' as const, label: 'Entregado' };
    case 'cancelled': return { variant: 'destructive' as const, label: 'Cancelado' };
    default: return { variant: 'outline' as const, label: status };
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'low': return { variant: 'outline' as const, label: 'Baja' };
    case 'medium': return { variant: 'default' as const, label: 'Media' };
    case 'high': return { variant: 'warning' as const, label: 'Alta' };
    case 'critical': return { variant: 'destructive' as const, label: 'Crítica' };
    default: return { variant: 'outline' as const, label: priority };
  }
};

const deviceIcons = {
  phone: <Smartphone className="text-primary" size={20} />,
  laptop: <Laptop className="text-primary" size={20} />,
  pc: <Gamepad2 className="text-primary" size={20} />,
  console: <Gamepad2 className="text-primary" size={20} />,
  tablet: <Smartphone className="text-primary" size={20} />,
};

export default function RepairsList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [totalRepairs, setTotalRepairs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);

  useEffect(() => {
    loadRepairs();
  }, [currentPage]);

  const loadRepairs = async () => {
    try {
      setLoading(true);
      const response = await repairService.list({ 
        page: currentPage, 
        limit: 10,
        sort: 'created_at:desc'
      }) as any;
      
      console.log('Respuesta de reparaciones:', response);
      
      // Extraer datos según la estructura: {data: {reparaciones: [...], total: 10, pagina: 1, total_paginas: 10}}
      const repairsArray = response?.data?.data?.reparaciones ||
                         response?.data?.reparaciones ||
                         response?.reparaciones ||
                         response?.data?.data?.data ||
                         response?.data?.data ||
                         response?.data ||
                         [];
      
      const total = response?.data?.data?.total ||
                   response?.data?.total ||
                   response?.total ||
                   0;
      
      const totalPages = response?.data?.data?.total_paginas ||
                       response?.data?.total_paginas ||
                       response?.total_pages ||
                       1;
      
      setRepairs(Array.isArray(repairsArray) ? repairsArray : []);
      setTotalRepairs(total);
      setTotalPages(totalPages);
    } catch (error: any) {
      console.error('Error al cargar reparaciones:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las reparaciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (repairId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reparación?')) {
      return;
    }

    try {
      await repairService.delete(repairId);
      toast({
        title: 'Éxito',
        description: 'Reparación eliminada correctamente',
      });
      loadRepairs();
    } catch (error: any) {
      console.error('Error al eliminar reparación:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la reparación',
        variant: 'destructive'
      });
    }
  };

  const handleMarkAsDelivered = async (repairId: string) => {
    try {
      await repairService.updateStatus(repairId, { estado: 'delivered' });
      toast({
        title: 'Éxito',
        description: 'Reparación marcada como entregada',
      });
      loadRepairs();
    } catch (error: any) {
      console.error('Error al marcar como entregada:', error);
      toast({
        title: 'Error',
        description: 'No se pudo marcar la reparación como entregada',
        variant: 'destructive'
      });
    }
  };

  const filteredRepairs = repairs.filter(repair => {
    const matchesStatus = filterStatus === 'all' || repair.estado === filterStatus;
    const matchesSearch = repair.cliente_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repair.dispositivo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repair.numero_reparacion?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reparaciones</h1>
          <p className="text-muted-foreground">Gestiona y rastrea todos los tickets de reparación</p>
        </div>
        <Button onClick={() => navigate('/reparaciones/add')}>
          <Plus size={16} className="mr-2" />
          Nueva reparación
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendientes Hoy</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2"></p>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
              <TrendingUp size={16} />
              <span>% vs ayer</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expirando Pronto</p>
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2"></p>
            <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
              <span>% en 24h</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Listos para Recoger</p>
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2"></p>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
              <span>% listos para cerrar</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ingresos Totales</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2"></p>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
              <TrendingUp size={16} />
              <span>%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-1">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pendientes
              </Button>
              <Button
                variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('in_progress')}
              >
                En Progreso
              </Button>
              <Button
                variant={filterStatus === 'ready' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('ready')}
              >
                Listos
              </Button>
              <Button
                variant={filterStatus === 'delivered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('delivered')}
              >
                Entregados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRepairs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay reparaciones
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Orden</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dispositivo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problema</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prioridad</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRepairs.map((repair) => (
                    <tr
                      key={repair.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                        {repair.numero_reparacion || repair.id?.substring(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">
                        {repair.cliente_nombre || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {repair.dispositivo || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                        {repair.problema_reportado || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={getStatusBadge(repair.estado)?.variant} size="sm">
                          {getStatusBadge(repair.estado)?.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={getPriorityBadge(repair.prioridad)?.variant} size="sm">
                          {getPriorityBadge(repair.prioridad)?.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {repair.fecha_ingreso ? new Date(repair.fecha_ingreso).toLocaleDateString('es-AR') : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right relative">
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === repair.id ? null : repair.id);
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          
                          {activeDropdown === repair.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                              <div 
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(null);
                                  setSelectedRepairId(repair.id);
                                  setPreviewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                Vista Previa
                              </div>
                              <div 
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(null);
                                  navigate(`/reparaciones/edit/${repair.id}`);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                Editar
                              </div>
                              <div 
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(null);
                                  navigate(`/reparaciones/confirmation?orderId=${repair.id}&print=true`);
                                }}
                              >
                                <FileText className="h-4 w-4" />
                                PDF Orden
                              </div>
                              {repair.estado !== 'delivered' && (
                                <div 
                                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(null);
                                    handleMarkAsDelivered(repair.id);
                                  }}
                                >
                                  <Package className="h-4 w-4" />
                                  Marcar Entregado
                                </div>
                              )}
                              <div 
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(null);
                                  handleDelete(repair.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Página <span className="font-semibold text-foreground">{currentPage}</span> de <span className="font-semibold text-foreground">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de vista previa */}
      {selectedRepairId && (
        <RepairPreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setSelectedRepairId(null);
          }}
          repairId={selectedRepairId}
        />
      )}
    </div>
  );
}
