import React, { useState, useRef } from 'react'
import {
  Download,
  Eye,
  Save,
  RefreshCw,
  Shield,
  Smartphone,
  User,
  Wrench,
  Building,
  Award,
  Settings,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ServiceOrderPreview from './ServiceOrderPreview'

// ============================================================================
// Tipos e interfaces (mismos que antes)
// ============================================================================
interface ServiceOrderData {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  orderNumber: string
  orderDate: string
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  clientId: string
  deviceModel: string
  deviceImei: string
  deviceSerial: string
  deviceColor: string
  deviceStorage: string
  deviceDescription: string
  repairDescription: string
  repairDiagnostic: string
  laborCost: string
  partsCost: string
  totalPrice: string
  warrantyMonths: string
  warrantyTerms: string
  securityType: 'none' | 'pin' | 'pattern' | 'fingerprint'
  securityPin: string
  securityPattern: string
  securityNotes: string
  technicianName: string
  technicianNotes: string
  estimatedTime: string
  showHeader: boolean
  showFooter: boolean
  headerText: string
  footerText: string
  fontSize: number
  margin: number
  showClientSection: boolean
  showTechnicianSection: boolean
  showSecurityInfo: boolean
  showWarrantyTerms: boolean
  showSignatures: boolean
}

// ============================================================================
// Valores por defecto
// ============================================================================
const defaultData: ServiceOrderData = {
  companyName: 'TechFix Reparaciones',
  companyAddress: 'Av. Corrientes 1234, CABA, Argentina',
  companyPhone: '+54 11 4321-1234',
  companyEmail: 'info@techfix.com',
  orderNumber: `OS-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  orderDate: new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }),
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  clientId: '',
  deviceModel: '',
  deviceImei: '',
  deviceSerial: '',
  deviceColor: '',
  deviceStorage: '',
  deviceDescription: '',
  repairDescription: '',
  repairDiagnostic: '',
  laborCost: '0',
  partsCost: '0',
  totalPrice: '0',
  warrantyMonths: '12',
  warrantyTerms:
    'Garantía por defectos de fabricación y mano de obra por 12 meses. No cubre daños por agua, golpes o uso indebido posterior a la reparación.',
  securityType: 'none',
  securityPin: '',
  securityPattern: '',
  securityNotes: '',
  technicianName: '',
  technicianNotes: '',
  estimatedTime: '',
  showHeader: true,
  showFooter: true,
  headerText: 'ORDEN DE SERVICIO',
  footerText: 'Este documento es un comprobante de recepción de equipo. Leer los términos y condiciones.',
  fontSize: 10,
  margin: 18,
  showClientSection: true,
  showTechnicianSection: true,
  showSecurityInfo: true,
  showWarrantyTerms: true,
  showSignatures: true,
}

// ============================================================================
// Componente principal
// ============================================================================
export default function PDFConfig() {
  const [data, setData] = useState<ServiceOrderData>(defaultData)
  const [isGenerating, setIsGenerating] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // ============================================================================
  // Manejadores de cambios
  // ============================================================================
  const handleChange = <K extends keyof ServiceOrderData>(key: K, value: ServiceOrderData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  // ============================================================================
  // Generación de PDF con html2canvas + jsPDF
  // ============================================================================
  const generatePDF = async () => {
    if (!previewRef.current) return

    setIsGenerating(true)

    try {
      // Capturar el componente de previsualización
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Alta calidad
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('orden-servicio-profesional.pdf')
    } catch (error) {
      console.error('Error al generar el PDF:', error)
      alert('Ocurrió un error al generar el PDF. Por favor, inténtalo de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  // ============================================================================
  // Renderizado del panel de configuración (reducido para brevedad)
  // ============================================================================
  const renderConfigPanel = () => (
    <div className="space-y-4">
      {/* Empresa */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Building size={16} className="text-primary" /> Empresa
          </h3>
          <Input
            value={data.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Nombre de la empresa"
          />
          <Input
            value={data.companyAddress}
            onChange={(e) => handleChange('companyAddress', e.target.value)}
            placeholder="Dirección"
          />
          <Input
            value={data.companyPhone}
            onChange={(e) => handleChange('companyPhone', e.target.value)}
            placeholder="Teléfono"
          />
          <Input
            value={data.companyEmail}
            onChange={(e) => handleChange('companyEmail', e.target.value)}
            placeholder="Email"
          />
          <div className="flex gap-2">
            <Input
              value={data.orderNumber}
              onChange={(e) => handleChange('orderNumber', e.target.value)}
              placeholder="N° Orden"
              className="flex-1"
            />
            <Input
              type="date"
              value={data.orderDate}
              onChange={(e) => handleChange('orderDate', e.target.value)}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cliente */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <User size={16} className="text-primary" /> Cliente
          </h3>
          <Input
            value={data.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
            placeholder="Nombre completo"
          />
          <Input
            value={data.clientPhone}
            onChange={(e) => handleChange('clientPhone', e.target.value)}
            placeholder="Teléfono"
          />
          <Input
            value={data.clientEmail}
            onChange={(e) => handleChange('clientEmail', e.target.value)}
            placeholder="Email"
          />
          <Input
            value={data.clientAddress}
            onChange={(e) => handleChange('clientAddress', e.target.value)}
            placeholder="Dirección"
          />
          <Input
            value={data.clientId}
            onChange={(e) => handleChange('clientId', e.target.value)}
            placeholder="Documento"
          />
        </CardContent>
      </Card>

      {/* Dispositivo y reparación */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Smartphone size={16} className="text-primary" /> Dispositivo
          </h3>
          <Input
            value={data.deviceModel}
            onChange={(e) => handleChange('deviceModel', e.target.value)}
            placeholder="Modelo"
          />
          <Input
            value={data.deviceImei}
            onChange={(e) => handleChange('deviceImei', e.target.value)}
            placeholder="IMEI"
          />
          <Input
            value={data.deviceSerial}
            onChange={(e) => handleChange('deviceSerial', e.target.value)}
            placeholder="Serial"
          />
          <Input
            value={data.deviceColor}
            onChange={(e) => handleChange('deviceColor', e.target.value)}
            placeholder="Color"
          />
          <Input
            value={data.deviceStorage}
            onChange={(e) => handleChange('deviceStorage', e.target.value)}
            placeholder="Almacenamiento"
          />
          <Input
            value={data.deviceDescription}
            onChange={(e) => handleChange('deviceDescription', e.target.value)}
            placeholder="Descripción del dispositivo"
          />
          <div className="border-t border-border pt-3 mt-2">
            <Label className="text-sm font-medium">Reparación</Label>
            <Input
              value={data.repairDescription}
              onChange={(e) => handleChange('repairDescription', e.target.value)}
              placeholder="Descripción de la reparación"
              className="mt-1"
            />
            <Input
              value={data.repairDiagnostic}
              onChange={(e) => handleChange('repairDiagnostic', e.target.value)}
              placeholder="Diagnóstico"
              className="mt-1"
            />
            <div className="grid grid-cols-3 gap-2 mt-1">
              <Input
                value={data.laborCost}
                onChange={(e) => handleChange('laborCost', e.target.value)}
                placeholder="Mano obra"
              />
              <Input
                value={data.partsCost}
                onChange={(e) => handleChange('partsCost', e.target.value)}
                placeholder="Repuestos"
              />
              <Input
                value={data.totalPrice}
                onChange={(e) => handleChange('totalPrice', e.target.value)}
                placeholder="Total"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad y técnico */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Shield size={16} className="text-primary" /> Seguridad y Técnico
          </h3>
          <select
            value={data.securityType}
            onChange={(e) => handleChange('securityType', e.target.value as any)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="none">Ninguno</option>
            <option value="pin">PIN</option>
            <option value="pattern">Patrón</option>
            <option value="fingerprint">Huella</option>
          </select>
          {data.securityType === 'pin' && (
            <Input
              value={data.securityPin}
              onChange={(e) => handleChange('securityPin', e.target.value)}
              placeholder="PIN"
            />
          )}
          {data.securityType === 'pattern' && (
            <Input
              value={data.securityPattern}
              onChange={(e) => handleChange('securityPattern', e.target.value)}
              placeholder="Descripción del patrón"
            />
          )}
          <Input
            value={data.securityNotes}
            onChange={(e) => handleChange('securityNotes', e.target.value)}
            placeholder="Notas de seguridad"
          />
          <Input
            value={data.technicianName}
            onChange={(e) => handleChange('technicianName', e.target.value)}
            placeholder="Técnico asignado"
          />
          <Input
            value={data.estimatedTime}
            onChange={(e) => handleChange('estimatedTime', e.target.value)}
            placeholder="Tiempo estimado"
          />
          <textarea
            value={data.technicianNotes}
            onChange={(e) => handleChange('technicianNotes', e.target.value)}
            placeholder="Notas internas"
            rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </CardContent>
      </Card>

      {/* Garantía */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Award size={16} className="text-primary" /> Garantía
          </h3>
          <Input
            value={data.warrantyMonths}
            onChange={(e) => handleChange('warrantyMonths', e.target.value)}
            placeholder="Meses de garantía"
          />
          <textarea
            value={data.warrantyTerms}
            onChange={(e) => handleChange('warrantyTerms', e.target.value)}
            placeholder="Términos y condiciones"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </CardContent>
      </Card>

      {/* Configuración visual (simplificada) */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Settings size={16} className="text-primary" /> Configuración visual
          </h3>
          <div className="space-y-2">
            {[
              { key: 'showHeader', label: 'Mostrar encabezado' },
              { key: 'showFooter', label: 'Mostrar pie de página' },
              { key: 'showClientSection', label: 'Mostrar sección cliente' },
              { key: 'showTechnicianSection', label: 'Mostrar sección técnico' },
              { key: 'showSecurityInfo', label: 'Mostrar información de seguridad' },
              { key: 'showWarrantyTerms', label: 'Mostrar términos de garantía' },
              { key: 'showSignatures', label: 'Mostrar espacios de firma' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data[item.key as keyof ServiceOrderData] as boolean}
                    onChange={(e) =>
                      handleChange(item.key as keyof ServiceOrderData, e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          setData(defaultData)
          alert('Configuración restablecida.')
        }}
        variant="outline"
        className="w-full"
      >
        <RefreshCw size={16} className="mr-2" />
        Restablecer
      </Button>
    </div>
  )

  // ============================================================================
  // Renderizado principal
  // ============================================================================
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Generador de Orden de Servicio</h2>
          <p className="text-muted-foreground">Personaliza y genera documentos profesionales para tus clientes</p>
        </div>
        <Button onClick={generatePDF} disabled={isGenerating} className="gap-2">
          {isGenerating ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <Download size={18} />
          )}
          {isGenerating ? 'Generando...' : 'Descargar PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            {renderConfigPanel()}
          </div>
        </div>

        {/* Vista previa */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={18} className="text-primary" />
                <h3 className="font-bold text-foreground">Vista previa</h3>
                <Badge variant="outline" className="ml-auto text-[10px] font-mono">
                  A4
                </Badge>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                <div ref={previewRef} className="transform scale-[0.7] origin-top-left w-[143%]">
                  <ServiceOrderPreview data={data} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                La vista previa se actualiza automáticamente con cada cambio.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}