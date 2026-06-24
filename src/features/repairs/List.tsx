import React, { useState } from 'react';
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import DataTable from '@/shared/components/data-table';
// Datos mock eliminados - conectar con API real
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'waiting': return { variant: 'warning' as const, label: 'Esperando' };
    case 'in_progress': return { variant: 'default' as const, label: 'En Progreso' };
    case 'ready': return { variant: 'success' as const, label: 'Listo' };
    case 'delivered': return { variant: 'outline' as const, label: 'Entregado' };
    default: return { variant: 'outline' as const, label: status };
  }
};
const deviceIcons = {
  phone: <Smartphone className="text-primary" size={20} />,
  laptop: <Laptop className="text-primary" size={20} />,
  gaming: <Gamepad2 className="text-primary" size={20} />,
};
export default function RepairsList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Conectar con API real: api.get('/repairs')
  const [repairs, setRepairs] = useState<any[]>([]);
  const filteredRepairs = repairs.filter(repair => {
    const matchesStatus = filterStatus === 'all' || repair.status === filterStatus;
    const matchesSearch = repair.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repair.email.toLowerCase().includes(searchQuery.toLowerCase());
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
                Activos
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
      <DataTable
        data={filteredRepairs}
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        loading={false}
        emptyMessage="No hay reparaciones"
      />
    </div>
  );
}
