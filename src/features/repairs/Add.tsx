import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  Power,
  Volume,
  Eye,
  Camera,
  Wifi,
  Fingerprint,
  Volume2,
  Mic,
  Zap,
  Battery,
  Lock,
  AlertCircle,
  Info,
  Check,
  Keyboard,
  Mouse,
  Usb,
  Headphones,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { MdPerson, MdBuild, MdCheck } from 'react-icons/md';
import { RiSimCard2Line } from 'react-icons/ri';
import type { RepairData } from './RepairFlow';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

// Mapa de hardware por categoría
const hardwareByCategory: Record<string, { key: string; label: string; icon: any }[]> = {
  phone: [
    { key: 'botonPawer', label: 'Botón de Power', icon: Power },
    { key: 'botonVolumen', label: 'Botón de Volumen', icon: Volume },
    { key: 'sensorProximidad', label: 'Sensor de Proximidad', icon: Eye },
    { key: 'camaraFrontal', label: 'Cámara Frontal', icon: Camera },
    { key: 'modulo', label: 'Módulo', icon: Smartphone },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'huella', label: 'Huella', icon: Fingerprint },
    { key: 'camaraTrasera', label: 'Cámara Trasera', icon: Camera },
    { key: 'audio', label: 'Audio', icon: Volume2 },
    { key: 'altavoz', label: 'Altavoz', icon: Mic },
    { key: 'fichaCarga', label: 'Ficha de Carga', icon: Zap },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'lectorSimcard', label: 'Lector de Simcard', icon: RiSimCard2Line },
  ],
  notebook: [
    { key: 'teclado', label: 'Teclado', icon: Keyboard },
    { key: 'trackpad', label: 'Trackpad', icon: Mouse },
    { key: 'pantalla', label: 'Pantalla', icon: Monitor },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'camara', label: 'Cámara', icon: Camera },
    { key: 'altavoces', label: 'Altavoces', icon: Volume2 },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'cargador', label: 'Cargador', icon: Zap },
  ],
  pc: [
    { key: 'fuentePoder', label: 'Fuente de Poder', icon: Power },
    { key: 'cpu', label: 'CPU', icon: Cpu },
    { key: 'ram', label: 'Memoria RAM', icon: HardDrive },
    { key: 'disco', label: 'Disco Duro/SSD', icon: HardDrive },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
  ],
  tablet: [
    { key: 'pantalla', label: 'Pantalla', icon: Monitor },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'camara', label: 'Cámara', icon: Camera },
    { key: 'altavoces', label: 'Altavoces', icon: Volume2 },
    { key: 'botones', label: 'Botones Físicos', icon: Power },
    { key: 'cargador', label: 'Cargador', icon: Zap },
  ],
  console: [
    { key: 'fuentePoder', label: 'Fuente de Poder', icon: Power },
    { key: 'lectorDiscos', label: 'Lector de Discos', icon: HardDrive },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
    { key: 'control', label: 'Control/Gamepad', icon: Gamepad2 },
  ],
  other: [
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
  ],
};

// Categorías de dispositivo
const deviceCategories = [
  { id: 'phone', name: 'Teléfono', icon: Smartphone, color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 'notebook', name: 'Portátil', icon: Laptop, color: 'text-info', bgColor: 'bg-info/10' },
  { id: 'pc', name: 'PC', icon: Monitor, color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'tablet', name: 'Tablet', icon: Tablet, color: 'text-warning', bgColor: 'bg-warning/10' },
  { id: 'console', name: 'Consola', icon: Gamepad2, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  { id: 'other', name: 'Otro', icon: Grid3X3, color: 'text-muted-foreground', bgColor: 'bg-muted' },
];

// Estado inicial
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
  hardwareChecks: {},
  securityType: 'pin',
  accessPin: '',
  patternDots: [false, false, false, false, false, false, false, false, false],
  patternSequence: [],
  technicianNotes: '',
  termsAccepted: false,
  signaturePad: '',
  printOption: 'both',
};

interface RepairCreateProps {
  data?: RepairData;
  updateData?: (updates: Partial<RepairData>) => void;
  onSave?: () => void;
  currentStep?: number;
}

export default function RepairCreate({ data, updateData, onSave = () => {}, currentStep = 1 }: RepairCreateProps) {
  const [search, setSearch] = useState('');
  const [localData, setLocalData] = useState<RepairData>(defaultData);
  const state = data ?? localData;

  const applyUpdate = (updates: Partial<RepairData>) => {
    if (updateData) updateData(updates);
    else setLocalData((prev) => ({ ...prev, ...updates }));
  };

  // Clientes mock (cargar desde API)
  const clients: any[] = [];
  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(search.toLowerCase()) ||
    client.phone?.includes(search) ||
    client.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Obtener items de hardware según categoría seleccionada
  const currentHardwareItems = useMemo(() => {
    return hardwareByCategory[state.deviceType] || [];
  }, [state.deviceType]);

  // Inicializar hardwareChecks con valores en false para los items de la categoría actual
  const hardwareKeys = currentHardwareItems.map((item) => item.key);
  const initialHardwareChecks = hardwareKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {});
  // Si el estado ya tiene algunos checks, los fusionamos
  const mergedHardwareChecks = { ...initialHardwareChecks, ...state.hardwareChecks };
  // Solo mantener las claves que corresponden a la categoría actual
  const filteredHardwareChecks = Object.fromEntries(
    Object.entries(mergedHardwareChecks).filter(([key]) => hardwareKeys.includes(key))
  );

  // Actualizar hardwareChecks cuando cambie la categoría
  React.useEffect(() => {
    const newChecks = { ...initialHardwareChecks, ...state.hardwareChecks };
    const filtered = Object.fromEntries(Object.entries(newChecks).filter(([key]) => hardwareKeys.includes(key)));
    applyUpdate({ hardwareChecks: filtered });
  }, [state.deviceType]);

  const handleHardwareToggle = (key: string) => {
    const updated = { ...state.hardwareChecks };
    updated[key] = !updated[key];
    applyUpdate({ hardwareChecks: updated });
  };

  const functionalCount = Object.values(state.hardwareChecks).filter(Boolean).length;

  // Accesorios según categoría
  const getAccessoriesForDevice = () => {
    const map: Record<string, string[]> = {
      phone: ['Caja Original', 'Cable Cargador', 'Adaptador de Corriente', 'Funda'],
      notebook: ['Cargador', 'Mouse', 'Caja Original'],
      pc: ['Teclado', 'Mouse', 'Cable de Alimentación'],
      tablet: ['Cargador', 'Funda', 'Lápiz'],
      console: ['Caja Original', 'Control', 'Cable HDMI'],
      other: ['Accesorios', 'Documentación'],
    };
    return map[state.deviceType] || [];
  };

  const handleAccessoryToggle = (accessory: string) => {
    if (state.accessories.includes(accessory)) {
      applyUpdate({ accessories: state.accessories.filter((a) => a !== accessory) });
    } else {
      applyUpdate({ accessories: [...state.accessories, accessory] });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      <main className="max-w-[1400px] mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registro de Reparación</h1>
            <p className="text-muted-foreground text-sm">Información de Cliente, Dispositivo y Diagnóstico</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Cliente */}
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
                      <Button variant="ghost" size="sm" onClick={() => applyUpdate({ selectedClient: null })}>
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
                        <Button size="sm" onClick={() => applyUpdate({ selectedClient: client })}>
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

            {/* Dispositivo */}
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
                        <span className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Especificaciones Técnicas */}
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
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Marca</label>
                    <input
                      type="text"
                      value={state.brand}
                      onChange={(e) => applyUpdate({ brand: e.target.value })}
                      placeholder="ej. Samsung, Apple..."
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Modelo</label>
                    <input
                      type="text"
                      value={state.model}
                      onChange={(e) => applyUpdate({ model: e.target.value })}
                      placeholder="ej. Galaxy S24 Ultra..."
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Serial / IMEI</label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Condición Estética */}
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

                  {/* Accesorios */}
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

            {/* Chequeo rápido de hardware (dinámico) */}
            <AnimatePresence mode="wait">
              {state.deviceType && currentHardwareItems.length > 0 && (
                <motion.section
                  key={state.deviceType}
                  initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                      <CheckCircle2 size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Chequeo rápido de hardware</h2>
                    <Badge variant="outline" className="ml-auto">{functionalCount}/{currentHardwareItems.length} funcionales</Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {currentHardwareItems.map((item) => {
                      const Icon = item.icon;
                      const isChecked = state.hardwareChecks[item.key] ?? false;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} className={isChecked ? 'text-blue-600' : 'text-slate-400'} />
                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleHardwareToggle(item.key)}
                              className="sr-only"
                            />
                            <div
                              className={`w-11 h-6 rounded-full transition-colors ${isChecked ? 'bg-blue-600' : 'bg-slate-200'}`}
                            >
                              <div
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${
                                  isChecked ? 'translate-x-5' : ''
                                }`}
                              />
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Notas y diagnóstico */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                    <AlertCircle size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Diagnóstico y Notas</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Descripción del Problema
                    </label>
                    <textarea
                      value={state.issueDescription}
                      onChange={(e) => applyUpdate({ issueDescription: e.target.value })}
                      placeholder="Pantalla rota, puerto de carga suelto..."
                      rows={3}
                      className="w-full bg-muted border border-border rounded-xl p-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Prioridad</label>
                      <select
                        value={state.priority}
                        onChange={(e) => applyUpdate({ priority: e.target.value })}
                        className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                      >
                        <option>Normal</option>
                        <option>Urgente</option>
                        <option>Baja</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Días Estimados</label>
                      <input
                        type="number"
                        value={state.estimatedDays}
                        onChange={(e) => applyUpdate({ estimatedDays: parseInt(e.target.value) })}
                        className="w-full bg-muted border border-border rounded-xl py-3 px-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Notas del Técnico</label>
                    <textarea
                      value={state.technicianNotes}
                      onChange={(e) => applyUpdate({ technicianNotes: e.target.value })}
                      placeholder="Observaciones adicionales..."
                      rows={3}
                      className="w-full bg-muted border border-border rounded-xl p-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón Guardar */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex justify-end"
            >
              <Button onClick={onSave} size="lg" className="px-10 py-6 text-base">
                <Check size={20} className="mr-2" />
                Crear Orden de Servicio
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Resumen */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-lg">Resumen del Ticket</h3>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
                      Nueva Orden
                    </Badge>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <Search className="text-primary-foreground/80" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Cliente</p>
                        <p className="font-semibold text-sm">{state.selectedClient?.name || 'No Seleccionado'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <Smartphone className="text-primary-foreground/80" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Dispositivo</p>
                        <p className="font-semibold text-sm">
                          {state.brand && state.model ? `${state.brand} ${state.model}` : 'No Especificado'}
                        </p>
                        {state.serial && <p className="text-xs text-slate-400">S/N: {state.serial}</p>}
                      </div>
                    </div>
                    {currentHardwareItems.length > 0 && (
                      <div className="flex items-start gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                          <CheckCircle2 size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Estado de Pre-Check</p>
                          <p className="font-semibold text-sm text-green-400">
                            {functionalCount}/{currentHardwareItems.length} funcionales
                          </p>
                          <p className="text-xs text-slate-400">
                            {currentHardwareItems.length - functionalCount} módulo{currentHardwareItems.length - functionalCount !== 1 ? 's' : ''} defectuoso{currentHardwareItems.length - functionalCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Mano de Obra</span>
                        <span className="font-bold text-sm">$0.00</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-sm">Repuestos Estimados</span>
                        <span className="font-bold text-sm">$0.00</span>
                      </div>
                      <div className="flex items-center justify-between text-xl font-bold pt-4 border-t border-white/20">
                        <span>Total</span>
                        <span className="text-blue-400">$0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={18} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-600">Ayuda</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Completa todos los campos para crear la orden de reparación.
                  El chequeo de hardware es específico para la categoría seleccionada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}