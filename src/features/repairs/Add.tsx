import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Gamepad2,
  Grid3X3,
  CheckCircle2,
  Cable,
  ArrowRight,
  Settings
} from 'lucide-react';
import { MdPerson, MdBuild, MdCheck } from 'react-icons/md';
import type { RepairData } from './RepairFlow';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface RepairAddProps {
  data?: RepairData;
  updateData?: (updates: Partial<RepairData>) => void;
  onNext?: () => void;
  currentStep?: number;
}

export default function RepairAdd({ data, updateData, onNext = () => {}, currentStep = 1 }: RepairAddProps) {
  const [search, setSearch] = useState('');

  const defaultData: RepairData = {
    selectedClient: null,
    deviceType: 'phone',
    brand: '',
    model: '',
    serial: '',
    aestheticCondition: '',
    accessories: [],
    issueDescription: '',
    priority: 'Normal',
    estimatedDays: 3,
    hardwareChecks: {
      power: false,
      display: false,
      wifi: false,
      bluetooth: false,
      cameras: false,
      audio: false,
    },
    securityType: 'pin',
    accessPin: '',
    patternDots: [false, false, false, false, false, false, false, false, false],
    patternSequence: [],
    technicianNotes: '',
    termsAccepted: false,
    signaturePad: '',
    printOption: 'both',
  };

  const [localData, setLocalData] = useState<RepairData>(defaultData);
  const state = data ?? localData;
  const applyUpdate = (updates: Partial<RepairData>) => {
    if (updateData) updateData(updates);
    else setLocalData(prev => ({ ...prev, ...updates }));
  };

  // 📦 Categorías de dispositivos – fijas, pero se pueden cargar desde API
  const deviceCategories = [
    { id: 'phone', name: 'Teléfono', icon: Smartphone, color: 'text-primary', bgColor: 'bg-primary/10' },
    { id: 'notebook', name: 'Portátil', icon: Laptop, color: 'text-info', bgColor: 'bg-info/10' },
    { id: 'pc', name: 'PC', icon: Monitor, color: 'text-success', bgColor: 'bg-success/10' },
    { id: 'tablet', name: 'Tablet', icon: Tablet, color: 'text-warning', bgColor: 'bg-warning/10' },
    { id: 'console', name: 'Consola', icon: Gamepad2, color: 'text-destructive', bgColor: 'bg-destructive/10' },
    { id: 'other', name: 'Otro', icon: Grid3X3, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  ];

  const getAccessoriesForDevice = () => {
    const accessoriesMap: Record<string, string[]> = {
      phone: ['Caja Original', 'Cable Cargador', 'Adaptador de Corriente', 'Funda'],
      notebook: ['Cargador', 'Mouse', 'Caja Original'],
      pc: ['Teclado', 'Mouse', 'Cable de Alimentación'],
      tablet: ['Cargador', 'Funda', 'Lápiz'],
      console: ['Caja Original', 'Control', 'Cable HDMI'],
      other: ['Accesorios', 'Documentación'],
    };
    return accessoriesMap[state.deviceType] || [];
  };

  const handleAccessoryToggle = (accessory: string) => {
    if (state.accessories.includes(accessory)) {
      applyUpdate({ accessories: state.accessories.filter(a => a !== accessory) });
    } else {
      applyUpdate({ accessories: [...state.accessories, accessory] });
    }
  };

  // 📦 Clientes – vacío (cargar desde API)
  const clients: any[] = [];

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(search.toLowerCase()) ||
    client.phone?.includes(search) ||
    client.email?.toLowerCase().includes(search.toLowerCase())
  );

  // 📊 Cálculo de presupuesto – valores en cero (cargar desde API)
  const laborCost = 0;
  const partsCost = 0;
  const totalBudget = laborCost + partsCost;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1400px] mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registro de Reparación</h1>
            <p className="text-muted-foreground text-sm">Paso 1: Información de Cliente y Dispositivo</p>
          </div>

          {/* Stepper */}
          <div className="hidden md:flex items-center gap-4">
            {[
              { num: 1, label: 'Cliente y Dispositivo', icon: <MdPerson size={16} /> },
              { num: 2, label: 'Información Técnica', icon: <MdBuild size={16} /> },
              { num: 3, label: 'Finalizar', icon: <MdCheck size={16} /> },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${
                    currentStep >= step.num
                      ? 'bg-card border-border shadow-sm'
                      : 'bg-card border-border'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= step.num
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.num}
                  </div>
                  <span className={`text-sm font-semibold ${
                    currentStep >= step.num ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < 2 && <div className="w-8 h-px bg-border"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Customer Selection */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-xl">
                      <Search size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Selección de Cliente</h2>
                  </div>
                  <Button variant="ghost" className="text-primary">
                    <UserPlus size={18} className="mr-2" />
                    Agregar Nuevo Cliente
                  </Button>
                </div>

                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, teléfono o número de identificación..."
                    className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg font-medium text-foreground"
                  />
                </div>

                {state.selectedClient ? (
                  <div className="mt-4 border border-primary/20 rounded-2xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between bg-primary/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {state.selectedClient.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{state.selectedClient.name}</p>
                          <p className="text-xs text-muted-foreground">{state.selectedClient.phone} • {state.selectedClient.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyUpdate({ selectedClient: null })}
                      >
                        Cambiar
                      </Button>
                    </div>
                  </div>
                ) : filteredClients.length > 0 ? (
                  <div className="mt-4 border border-border rounded-2xl overflow-hidden divide-y divide-border">
                    {filteredClients.map((client) => (
                      <div key={client.id} className="p-4 flex items-center justify-between hover:bg-muted transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                            {client.name?.substring(0, 2).toUpperCase() || '??'}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">{client.name}</p>
                            <p className="text-xs text-muted-foreground">{client.phone} • {client.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => applyUpdate({ selectedClient: client })}
                        >
                          Seleccionar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 text-center py-8 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="font-medium">No hay clientes registrados</p>
                    <p className="text-sm">Agrega un nuevo cliente para comenzar</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Category */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 text-primary p-2 rounded-xl">
                    <Smartphone size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Categoría de Dispositivo</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                  {deviceCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = state.deviceType === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => applyUpdate({ deviceType: category.id })}
                        className={`category-tile flex flex-col items-center gap-3 p-6 rounded-2xl transition-all ${
                          isSelected
                            ? 'border-2 border-primary bg-primary/5 shadow-sm'
                            : 'border border-border bg-muted hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
                        }`}
                      >
                        <div className={`${category.bgColor} ${category.color} p-3 rounded-xl`}>
                          <Icon size={24} />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wide ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 text-primary p-2 rounded-xl">
                    <Settings size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Especificaciones Técnicas</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Marca
                    </label>
                    <input
                      type="text"
                      value={state.brand}
                      onChange={(e) => applyUpdate({ brand: e.target.value })}
                      placeholder="ej. Samsung, Apple..."
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Modelo
                    </label>
                    <input
                      type="text"
                      value={state.model}
                      onChange={(e) => applyUpdate({ model: e.target.value })}
                      placeholder="ej. Galaxy S24 Ultra..."
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Serial / IMEI
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={state.serial}
                        onChange={(e) => applyUpdate({ serial: e.target.value })}
                        placeholder="15 dígitos..."
                        className="w-full pl-4 pr-10 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-foreground"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                        <Smartphone size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Aesthetic Condition */}
                  <Card className="border border-border">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-muted-foreground" />
                        Condición Estética
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {['Nuevo', 'Rayones Leves', 'Pantalla Rota', 'Desgaste Intenso'].map((condition) => (
                          <button
                            key={condition}
                            onClick={() => applyUpdate({ aestheticCondition: condition })}
                            className={`py-2.5 px-3 text-xs font-bold border-2 rounded-xl transition-all ${
                              state.aestheticCondition === condition
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-muted-foreground hover:border-border'
                            }`}
                          >
                            {condition}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Included Accessories */}
                  <Card className="border border-border">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                        <Cable size={18} className="text-muted-foreground" />
                        Accesorios Incluidos
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getAccessoriesForDevice().map((accessory) => (
                          <button
                            key={accessory}
                            onClick={() => handleAccessoryToggle(accessory)}
                            className={`px-4 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-2 ${
                              state.accessories.includes(accessory)
                                ? 'bg-primary/5 border-primary text-primary'
                                : 'bg-muted border-border text-foreground hover:border-border'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={state.accessories.includes(accessory)}
                              onChange={() => {}}
                              className="w-3.5 h-3.5 rounded"
                            />
                            {accessory}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Ticket Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Ticket Summary Card */}
              <Card className="bg-primary text-primary-foreground rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border-primary/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-lg">Resumen del Ticket</h3>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
                      Nueva Orden
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-foreground/10 p-2 rounded-lg">
                        <Search className="text-primary-foreground/80" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary-foreground/70 uppercase">Cliente</p>
                        <p className="font-semibold text-sm">{state.selectedClient?.name || 'No Seleccionado'}</p>
                      </div>
                    </div>

                    {/* Device Info */}
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-foreground/10 p-2 rounded-lg">
                        <Smartphone className="text-primary-foreground/80" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary-foreground/70 uppercase">Dispositivo</p>
                        <p className="font-semibold text-sm">
                          {state.brand && state.model ? `${state.brand} ${state.model}` : 'No Especificado'}
                        </p>
                        {state.serial && <p className="text-xs text-primary-foreground/70">S/N: {state.serial}</p>}
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="pt-6 border-t border-primary-foreground/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-primary-foreground/70 text-sm">Mano de Obra</span>
                        <span className="font-bold text-sm">${laborCost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-primary-foreground/70 text-sm">Repuestos Estimados</span>
                        <span className="font-bold text-sm">${partsCost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xl font-bold pt-4 border-t border-primary-foreground/30">
                        <span>Total</span>
                        <span className="text-primary-foreground">${totalBudget.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Service Details */}
              <Card>
                <CardContent className="p-6">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    Detalles del Servicio
                  </label>

                  <div className="space-y-4">
                    {/* Issue Description */}
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                        Descripción del Problema
                      </label>
                      <textarea
                        value={state.issueDescription}
                        onChange={(e) => applyUpdate({ issueDescription: e.target.value })}
                        placeholder="Pantalla rota, puerto de carga suelto..."
                        rows={3}
                        className="w-full text-xs bg-muted border border-border rounded-xl py-2 px-3 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                      />
                    </div>

                    {/* Priority and Days */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                          Prioridad
                        </label>
                        <select
                          value={state.priority}
                          onChange={(e) => applyUpdate({ priority: e.target.value })}
                          className="w-full text-xs bg-muted border border-border rounded-xl py-2 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                        >
                          <option>Normal</option>
                          <option>Urgente</option>
                          <option>Baja</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                          Días Est.
                        </label>
                        <input
                          type="number"
                          value={state.estimatedDays}
                          onChange={(e) => applyUpdate({ estimatedDays: parseInt(e.target.value) })}
                          className="w-full text-xs bg-muted border border-border rounded-xl py-2 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Next Step Button */}
                  <Button
                    onClick={onNext}
                    className="w-full mt-6"
                  >
                    Siguiente Paso: Técnico
                    <ArrowRight size={20} className="ml-2" />
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground mt-4">
                    Borrador guardado automáticamente
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}