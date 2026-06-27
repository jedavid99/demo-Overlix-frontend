import { Smartphone, Laptop, Monitor, Tablet, Gamepad2, Grid3X3 } from 'lucide-react';
import { RiSimCard2Line } from 'react-icons/ri';
import type { RepairData } from '../RepairFlow';

// Hardware items por categoría
export const hardwareByCategory: Record<string, { key: string; label: string; icon: any }[]> = {
  phone: [
    { key: 'botonPawer', label: 'Botón de Power', icon: require('lucide-react').Power },
    { key: 'botonVolumen', label: 'Botón de Volumen', icon: require('lucide-react').Volume },
    { key: 'sensorProximidad', label: 'Sensor de Proximidad', icon: require('lucide-react').Eye },
    { key: 'camaraFrontal', label: 'Cámara Frontal', icon: require('lucide-react').Camera },
    { key: 'modulo', label: 'Módulo', icon: Smartphone },
    { key: 'wifi', label: 'WiFi', icon: require('lucide-react').Wifi },
    { key: 'huella', label: 'Huella', icon: require('lucide-react').Fingerprint },
    { key: 'camaraTrasera', label: 'Cámara Trasera', icon: require('lucide-react').Camera },
    { key: 'audio', label: 'Audio', icon: require('lucide-react').Volume2 },
    { key: 'altavoz', label: 'Altavoz', icon: require('lucide-react').Mic },
    { key: 'fichaCarga', label: 'Ficha de Carga', icon: require('lucide-react').Zap },
    { key: 'bateria', label: 'Batería', icon: require('lucide-react').Battery },
    { key: 'lectorSimcard', label: 'Lector de Simcard', icon: RiSimCard2Line },
  ],
  notebook: [
    { key: 'teclado', label: 'Teclado', icon: require('lucide-react').Keyboard },
    { key: 'trackpad', label: 'Trackpad', icon: require('lucide-react').Mouse },
    { key: 'pantalla', label: 'Pantalla', icon: Monitor },
    { key: 'bateria', label: 'Batería', icon: require('lucide-react').Battery },
    { key: 'wifi', label: 'WiFi', icon: require('lucide-react').Wifi },
    { key: 'camara', label: 'Cámara', icon: require('lucide-react').Camera },
    { key: 'altavoces', label: 'Altavoces', icon: require('lucide-react').Volume2 },
    { key: 'puertos', label: 'Puertos USB', icon: require('lucide-react').Usb },
    { key: 'cargador', label: 'Cargador', icon: require('lucide-react').Zap },
  ],
  pc: [
    { key: 'fuentePoder', label: 'Fuente de Poder', icon: require('lucide-react').Power },
    { key: 'cpu', label: 'CPU', icon: require('lucide-react').Cpu },
    { key: 'ram', label: 'Memoria RAM', icon: require('lucide-react').HardDrive },
    { key: 'disco', label: 'Disco Duro/SSD', icon: require('lucide-react').HardDrive },
    { key: 'wifi', label: 'WiFi', icon: require('lucide-react').Wifi },
    { key: 'puertos', label: 'Puertos USB', icon: require('lucide-react').Usb },
    { key: 'audio', label: 'Audio', icon: require('lucide-react').Volume2 },
  ],
  tablet: [
    { key: 'pantalla', label: 'Pantalla', icon: Monitor },
    { key: 'bateria', label: 'Batería', icon: require('lucide-react').Battery },
    { key: 'wifi', label: 'WiFi', icon: require('lucide-react').Wifi },
    { key: 'camara', label: 'Cámara', icon: require('lucide-react').Camera },
    { key: 'altavoces', label: 'Altavoces', icon: require('lucide-react').Volume2 },
    { key: 'botones', label: 'Botones Físicos', icon: require('lucide-react').Power },
    { key: 'cargador', label: 'Cargador', icon: require('lucide-react').Zap },
  ],
  console: [
    { key: 'fuentePoder', label: 'Fuente de Poder', icon: require('lucide-react').Power },
    { key: 'lectorDiscos', label: 'Lector de Discos', icon: require('lucide-react').HardDrive },
    { key: 'wifi', label: 'WiFi', icon: require('lucide-react').Wifi },
    { key: 'puertos', label: 'Puertos USB', icon: require('lucide-react').Usb },
    { key: 'audio', label: 'Audio', icon: require('lucide-react').Volume2 },
    { key: 'control', label: 'Control/Gamepad', icon: Gamepad2 },
  ],
  other: [
    { key: 'bateria', label: 'Batería', icon: require('lucide-react').Battery },
    { key: 'wifi', label: 'WiFi', icon: require('lucide-react').Wifi },
    { key: 'puertos', label: 'Puertos', icon: require('lucide-react').Usb },
    { key: 'audio', label: 'Audio', icon: require('lucide-react').Volume2 },
  ],
};

// Opciones de seguridad por categoría
export const securityOptionsByCategory: Record<string, { id: string; label: string; icon: any }[]> = {
  phone: [
    { id: 'ninguno', label: 'Ninguno', icon: require('lucide-react').Shield },
    { id: 'pin', label: 'PIN', icon: require('lucide-react').Key },
    { id: 'patron', label: 'Patrón', icon: Grid3X3 },
    { id: 'huella', label: 'Huella', icon: require('lucide-react').Fingerprint },
  ],
  notebook: [
    { id: 'ninguno', label: 'Ninguno', icon: require('lucide-react').Shield },
    { id: 'pin', label: 'Contraseña', icon: require('lucide-react').Key },
    { id: 'huella', label: 'Huella', icon: require('lucide-react').Fingerprint },
  ],
  pc: [
    { id: 'ninguno', label: 'Ninguno', icon: require('lucide-react').Shield },
    { id: 'pin', label: 'Contraseña', icon: require('lucide-react').Key },
  ],
  tablet: [
    { id: 'ninguno', label: 'Ninguno', icon: require('lucide-react').Shield },
    { id: 'pin', label: 'PIN', icon: require('lucide-react').Key },
    { id: 'patron', label: 'Patrón', icon: Grid3X3 },
  ],
  console: [
    { id: 'ninguno', label: 'Ninguno', icon: require('lucide-react').Shield },
    { id: 'pin', label: 'Código', icon: require('lucide-react').Key },
  ],
  other: [
    { id: 'ninguno', label: 'Ninguno', icon: require('lucide-react').Shield },
    { id: 'pin', label: 'Contraseña', icon: require('lucide-react').Key },
  ],
};

// Categorías de dispositivo
export const deviceCategories = [
  { id: 'phone', name: 'Teléfono', icon: Smartphone, color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 'notebook', name: 'Portátil', icon: Laptop, color: 'text-info', bgColor: 'bg-info/10' },
  { id: 'pc', name: 'PC', icon: Monitor, color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'tablet', name: 'Tablet', icon: Tablet, color: 'text-warning', bgColor: 'bg-warning/10' },
  { id: 'console', name: 'Consola', icon: Gamepad2, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  { id: 'other', name: 'Otro', icon: Grid3X3, color: 'text-muted-foreground', bgColor: 'bg-muted' },
];

// Estado inicial por defecto
export const defaultData: RepairData = {
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
  securityType: 'ninguno',
  accessPin: '',
  patternDots: [false, false, false, false, false, false, false, false, false],
  patternSequence: [],
  technicianNotes: '',
  termsAccepted: false,
  signaturePad: '',
  printOption: 'both',
  paymentMethod: 'cash',
  installmentsCount: 1,
  paymentType: 'full',
  orderNumber: '',
};

// Props para el componente principal
export interface RepairCreateProps {
  data?: RepairData;
  updateData?: (updates: Partial<RepairData>) => void;
  onSave?: () => void;
  currentStep?: number;
}

// Props para subcomponentes
export interface ClientSelectorProps {
  selectedClient: RepairData['selectedClient'];
  onSelectClient: (client: any) => void;
  onClearClient: () => void;
}

export interface DeviceFormProps {
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  aestheticCondition: string;
  accessories: string[];
  onDeviceTypeChange: (type: string) => void;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onSerialChange: (serial: string) => void;
  onConditionChange: (condition: string) => void;
  onAccessoryToggle: (accessory: string) => void;
  onGenerateSerial: () => void;
}

export interface SecurityFormProps {
  deviceType: string;
  securityType: string;
  accessPin: string;
  hardwareChecks: Record<string, boolean>;
  onSecurityTypeChange: (type: string) => void;
  onAccessPinChange: (pin: string) => void;
  onHardwareToggle: (key: string) => void;
}

export interface DiagnosticFormProps {
  issueDescription: string;
  technicianNotes: string;
  priority: string;
  estimatedDays: number;
  onIssueDescriptionChange: (desc: string) => void;
  onTechnicianNotesChange: (notes: string) => void;
  onPriorityChange: (priority: string) => void;
  onEstimatedDaysChange: (days: number) => void;
}

export interface SummaryProps {
  selectedClient: RepairData['selectedClient'];
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  hardwareChecks: Record<string, boolean>;
  orderNumber: string;
}

export interface PaymentFormProps {
  paymentMethod: string;
  paymentType: string;
  installmentsCount: number;
  onPaymentMethodChange: (method: string) => void;
  onPaymentTypeChange: (type: string) => void;
  onInstallmentsCountChange: (count: number) => void;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  selectedClient: RepairData['selectedClient'];
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  issueDescription: string;
  repairPrice: string;
  submitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onPriceChange: (price: string) => void;
}
