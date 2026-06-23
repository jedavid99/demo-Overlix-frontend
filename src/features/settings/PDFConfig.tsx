import React, { useState, useRef, useEffect } from 'react'
import {
  FileText,
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
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Printer,
  CheckCircle,
  AlertCircle,
  Settings,
  Plus,
  Trash2,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import jsPDF from 'jspdf'

// ============================================================================
// Tipos e interfaces
// ============================================================================
interface ServiceOrderData {
  // Empresa
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  companyLogo: string

  // Orden
  orderNumber: string
  orderDate: string

  // Cliente
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  clientId: string

  // Dispositivo
  deviceModel: string
  deviceImei: string
  deviceSerial: string
  deviceColor: string
  deviceStorage: string
  deviceDescription: string

  // Reparación
  repairDescription: string
  repairDiagnostic: string
  repairPrice: string
  partsCost: string
  laborCost: string
  totalPrice: string

  // Garantía
  warrantyMonths: string
  warrantyTerms: string

  // Seguridad
  securityType: 'none' | 'pin' | 'pattern' | 'fingerprint'
  securityPin: string
  securityPattern: string
  securityNotes: string

  // Técnico
  technicianName: string
  technicianNotes: string
  estimatedTime: string

  // Visibilidad
  showHeader: boolean
  showFooter: boolean
  showClientSection: boolean
  showTechnicianSection: boolean
  showSecurityInfo: boolean
  showWarrantyTerms: boolean
  showSignatures: boolean

  // Estilo
  headerText: string
  footerText: string
  fontSize: number
  margin: number
}

// ============================================================================
// Valores por defecto
// ============================================================================
const defaultData: ServiceOrderData = {
  companyName: 'TechFix Reparaciones',
  companyAddress: 'Av. Corrientes 1234, CABA, Argentina',
  companyPhone: '+54 11 4321-1234',
  companyEmail: 'info@techfix.com',
  companyLogo: 'TF',

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
  repairPrice: '',
  partsCost: '',
  laborCost: '',
  totalPrice: '',

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
  showClientSection: true,
  showTechnicianSection: true,
  showSecurityInfo: true,
  showWarrantyTerms: true,
  showSignatures: true,

  headerText: 'ORDEN DE SERVICIO',
  footerText: 'Este documento es un comprobante de recepción de equipo. Leer los términos y condiciones.',
  fontSize: 10,
  margin: 18,
}

// ============================================================================
// Componente principal
// ============================================================================
export default function PDFConfig() {
  const [data, setData] = useState<ServiceOrderData>(defaultData)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ============================================================================
  // Manejadores de cambios
  // ============================================================================
  const handleChange = <K extends keyof ServiceOrderData>(key: K, value: ServiceOrderData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  // ============================================================================
  // Lógica de renderizado en canvas (previsualización)
  // ============================================================================
  const renderPreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const m = data.margin
    const fs = data.fontSize
    const colW = (w - m * 3) / 2

    // Limpiar
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    let y = m

    // ---- Encabezado ----
    if (data.showHeader) {
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, '#1e293b')
      grad.addColorStop(1, '#334155')
      ctx.fillStyle = grad
      ctx.fillRect(m, y, w - m * 2, 50)

      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${fs + 6}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText(data.companyLogo || 'LOGO', m + 12, y + 32)

      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(m + 45, y + 8)
      ctx.lineTo(m + 45, y + 42)
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${fs + 4}px Arial`
      ctx.fillText(data.companyName || 'Mi Empresa', m + 55, y + 22)
      ctx.fillStyle = '#94a3b8'
      ctx.font = `${fs - 1}px Arial`
      ctx.fillText(data.companyAddress || '', m + 55, y + 38)
      ctx.fillText(
        (data.companyPhone || '') + ' | ' + (data.companyEmail || ''),
        m + 55,
        y + 46
      )

      ctx.textAlign = 'right'
      ctx.fillStyle = '#e2e8f0'
      ctx.font = `bold ${fs}px Arial`
      ctx.fillText('ORDEN N°', w - m - 10, y + 18)
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${fs + 4}px Arial`
      ctx.fillText(data.orderNumber || '---', w - m - 10, y + 34)
      ctx.fillStyle = '#94a3b8'
      ctx.font = `${fs - 1}px Arial`
      ctx.fillText('Fecha: ' + (data.orderDate || ''), w - m - 10, y + 48)

      y += 58
    }

    // Línea separadora
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(m, y)
    ctx.lineTo(w - m, y)
    ctx.stroke()
    y += 8

    const colTop = y
    const footerH = 30

    // ---- Columna izquierda: Cliente ----
    if (data.showClientSection) {
      const x = m
      let cy = colTop

      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fs + 2}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText('👤 DATOS DEL CLIENTE', x, cy)
      cy += 18

      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      ctx.strokeRect(x, cy - 4, colW, 120)
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(x + 1, cy - 3, colW - 2, 118)

      ctx.fillStyle = '#1e293b'
      ctx.font = `${fs}px Arial`
      const clientLines = [
        `Nombre: ${data.clientName || ''}`,
        `Teléfono: ${data.clientPhone || ''}`,
        `Email: ${data.clientEmail || ''}`,
        `Dirección: ${data.clientAddress || ''}`,
        `Documento: ${data.clientId || ''}`,
      ]
      clientLines.forEach((line, i) => {
        ctx.fillText(line, x + 10, cy + 6 + i * 18)
      })
      cy += 120 + 6

      if (data.showWarrantyTerms) {
        ctx.fillStyle = '#0f172a'
        ctx.font = `bold ${fs + 1}px Arial`
        ctx.fillText('🛡️ GARANTÍA', x, cy + 6)
        cy += 18

        ctx.strokeStyle = '#d1fae5'
        ctx.lineWidth = 1
        ctx.fillStyle = '#ecfdf5'
        ctx.fillRect(x, cy - 4, colW, 70)
        ctx.strokeRect(x, cy - 4, colW, 70)

        ctx.fillStyle = '#065f46'
        ctx.font = `${fs - 0.5}px Arial`
        ctx.textAlign = 'left'
        const terms = (data.warrantyTerms || '').split('. ')
        terms.forEach((sentence, i) => {
          const text = sentence + (i < terms.length - 1 ? '.' : '')
          ctx.fillText(`• ${text}`, x + 8, cy + 6 + i * 15)
        })
        cy += 70 + 8

        ctx.fillStyle = '#0f172a'
        ctx.font = `bold ${fs}px Arial`
        ctx.fillText(`Vigencia: ${data.warrantyMonths || '0'} meses`, x + 8, cy + 4)
        cy += 20
      }

      if (data.showSignatures) {
        cy += 10
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(x + 10, cy)
        ctx.lineTo(x + colW - 10, cy)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#64748b'
        ctx.font = `${fs - 1}px Arial`
        ctx.textAlign = 'center'
        ctx.fillText('Firma del Cliente', x + colW / 2, cy - 8)
        cy += 20
      }
    }

    // ---- Columna derecha: Técnico ----
    if (data.showTechnicianSection) {
      const x = m + colW + m / 2
      let ty = colTop

      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fs + 2}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText('🔧 INFORMACIÓN TÉCNICA', x, ty)
      ty += 18

      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${fs}px Arial`
      ctx.fillText('Dispositivo', x, ty)
      ty += 14
      ctx.font = `${fs}px Arial`
      ctx.fillStyle = '#334155'
      const deviceLines = [
        `Modelo: ${data.deviceModel || ''}`,
        `IMEI: ${data.deviceImei || ''}`,
        `Serial: ${data.deviceSerial || ''}`,
        `Color: ${data.deviceColor || ''}`,
        `Almacenamiento: ${data.deviceStorage || ''}`,
        `Descripción: ${data.deviceDescription || ''}`,
      ]
      deviceLines.forEach((line) => {
        ctx.fillText(line, x, ty)
        ty += 14
      })
      ty += 4

      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${fs}px Arial`
      ctx.fillText('Reparación', x, ty)
      ty += 14
      ctx.font = `${fs}px Arial`
      ctx.fillStyle = '#334155'
      ctx.fillText(`Descripción: ${data.repairDescription || ''}`, x, ty)
      ty += 14
      ctx.fillText(`Diagnóstico: ${data.repairDiagnostic || ''}`, x, ty)
      ty += 14

      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${fs}px Arial`
      ctx.fillText('Precios', x, ty)
      ty += 14
      ctx.font = `${fs}px Arial`
      ctx.fillStyle = '#334155'
      ctx.fillText(`Mano de obra: $${data.laborCost || '0'}`, x, ty)
      ty += 14
      ctx.fillText(`Repuestos: $${data.partsCost || '0'}`, x, ty)
      ty += 14
      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fs + 1}px Arial`
      ctx.fillText(`Total: $${data.totalPrice || '0'}`, x, ty)
      ty += 20

      if (data.showSecurityInfo && data.securityType !== 'none') {
        ctx.fillStyle = '#1e293b'
        ctx.font = `bold ${fs}px Arial`
        ctx.fillText('🔐 Acceso', x, ty)
        ty += 14
        ctx.font = `${fs}px Arial`
        ctx.fillStyle = '#334155'
        const secMap = {
          pin: `PIN: ${data.securityPin || ''}`,
          pattern: `Patrón: ${data.securityPattern || ''}`,
          fingerprint: 'Huella digital',
        }
        ctx.fillText(
          `Tipo: ${data.securityType === 'pin' ? 'PIN' : data.securityType === 'pattern' ? 'Patrón' : 'Huella'}`,
          x,
          ty
        )
        ty += 14
        ctx.fillText(secMap[data.securityType] || 'Seguridad activa', x, ty)
        ty += 14
        if (data.securityNotes) {
          ctx.fillText(`Notas: ${data.securityNotes}`, x, ty)
          ty += 14
        }
        ty += 4
      }

      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${fs}px Arial`
      ctx.fillText('Técnico', x, ty)
      ty += 14
      ctx.font = `${fs}px Arial`
      ctx.fillStyle = '#334155'
      ctx.fillText(`Asignado: ${data.technicianName || ''}`, x, ty)
      ty += 14
      ctx.fillText(`Tiempo estimado: ${data.estimatedTime || ''}`, x, ty)
      ty += 14
      if (data.technicianNotes) {
        ctx.fillStyle = '#1e293b'
        ctx.font = `bold ${fs}px Arial`
        ctx.fillText('Notas internas', x, ty)
        ty += 14
        ctx.font = `${fs}px Arial`
        ctx.fillStyle = '#334155'
        ctx.fillText(data.technicianNotes, x, ty)
        ty += 14
      }

      if (data.showSignatures) {
        ty += 12
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(x + 10, ty)
        ctx.lineTo(x + colW - 10, ty)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#64748b'
        ctx.font = `${fs - 1}px Arial`
        ctx.textAlign = 'center'
        ctx.fillText('Firma del Técnico', x + colW / 2, ty - 8)
      }
    }

    // Línea vertical divisoria
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 6])
    ctx.beginPath()
    ctx.moveTo(w / 2, colTop)
    ctx.lineTo(w / 2, h - m - footerH - 10)
    ctx.stroke()
    ctx.setLineDash([])

    // ---- Pie de página ----
    if (data.showFooter) {
      const fY = h - m - 6
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(m, fY - 10)
      ctx.lineTo(w - m, fY - 10)
      ctx.stroke()

      ctx.fillStyle = '#94a3b8'
      ctx.font = `${fs - 1}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText(data.footerText || '', w / 2, fY + 4)
    }
  }

  // ============================================================================
  // Generación de PDF con jsPDF
  // ============================================================================
  const generatePDF = () => {
    setIsGenerating(true)

    try {
      const doc = new jsPDF()
      const m = data.margin
      const w = 190
      const colW = (w - m) / 2
      const fs = data.fontSize
      let y = m

      // ---- Encabezado ----
      if (data.showHeader) {
        doc.setFillColor(30, 41, 59)
        doc.rect(m, y, w, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(fs + 6)
        doc.setFont(undefined, 'bold')
        doc.text(data.companyName || 'Mi Empresa', m + 12, y + 18)
        doc.setFontSize(fs)
        doc.setTextColor(148, 163, 184)
        doc.text(data.companyAddress || '', m + 12, y + 30)
        doc.text(
          (data.companyPhone || '') + ' | ' + (data.companyEmail || ''),
          m + 12,
          y + 38
        )

        doc.setFontSize(fs + 2)
        doc.setTextColor(255, 255, 255)
        doc.text('ORDEN N°', 190 - m - 10, y + 16, { align: 'right' })
        doc.setFontSize(fs + 4)
        doc.text(data.orderNumber || '---', 190 - m - 10, y + 30, { align: 'right' })
        doc.setFontSize(fs)
        doc.setTextColor(148, 163, 184)
        doc.text('Fecha: ' + (data.orderDate || ''), 190 - m - 10, y + 42, { align: 'right' })

        y += 48
      }

      doc.setDrawColor(200, 200, 200)
      doc.line(m, y, 190 - m, y)
      y += 8

      const colTop = y

      // ---- Columna izquierda: Cliente ----
      if (data.showClientSection) {
        let cy = colTop
        doc.setFontSize(fs + 2)
        doc.setTextColor(15, 23, 42)
        doc.setFont(undefined, 'bold')
        doc.text('👤 DATOS DEL CLIENTE', m, cy)
        cy += 8

        doc.setDrawColor(220, 220, 220)
        doc.rect(m, cy, colW, 100, 'S')
        doc.setFillColor(248, 250, 252)
        doc.rect(m, cy, colW, 100, 'F')
        cy += 6

        doc.setFontSize(fs)
        doc.setFont(undefined, 'normal')
        doc.setTextColor(30, 41, 59)
        const clientLines = [
          `Nombre: ${data.clientName || ''}`,
          `Teléfono: ${data.clientPhone || ''}`,
          `Email: ${data.clientEmail || ''}`,
          `Dirección: ${data.clientAddress || ''}`,
          `Documento: ${data.clientId || ''}`,
        ]
        clientLines.forEach((line) => {
          doc.text(line, m + 6, cy)
          cy += 6
        })
        cy += 6

        if (data.showWarrantyTerms) {
          doc.setFontSize(fs + 1)
          doc.setFont(undefined, 'bold')
          doc.setTextColor(15, 23, 42)
          doc.text('🛡️ GARANTÍA', m, cy + 4)
          cy += 8

          doc.setDrawColor(200, 230, 220)
          doc.setFillColor(236, 253, 245)
          doc.rect(m, cy, colW, 50, 'F')
          doc.rect(m, cy, colW, 50, 'S')
          cy += 4

          doc.setFontSize(fs - 0.5)
          doc.setFont(undefined, 'normal')
          doc.setTextColor(6, 95, 70)
          const terms = (data.warrantyTerms || '').split('. ')
          terms.forEach((sentence, i) => {
            const text = sentence + (i < terms.length - 1 ? '.' : '')
            doc.text(`• ${text}`, m + 6, cy + i * 5)
          })
          cy += 50 + 6
          doc.setFontSize(fs)
          doc.setFont(undefined, 'bold')
          doc.setTextColor(15, 23, 42)
          doc.text(`Vigencia: ${data.warrantyMonths || '0'} meses`, m + 8, cy + 2)
          cy += 12
        }

        if (data.showSignatures) {
          cy += 12
          doc.setDrawColor(150, 150, 150)
          doc.setLineDash([2, 2], 0)
          doc.line(m + 10, cy, m + colW - 10, cy)
          doc.setLineDash([], 0)
          doc.setFontSize(fs - 1)
          doc.setTextColor(100, 116, 139)
          doc.text('Firma del Cliente', m + colW / 2, cy - 4, { align: 'center' })
          cy += 16
        }
      }

      // ---- Columna derecha: Técnico ----
      if (data.showTechnicianSection) {
        const x = m + colW + m / 2
        let ty = colTop

        doc.setFontSize(fs + 2)
        doc.setFont(undefined, 'bold')
        doc.setTextColor(15, 23, 42)
        doc.text('🔧 INFORMACIÓN TÉCNICA', x, ty)
        ty += 8

        doc.setFontSize(fs)
        doc.setFont(undefined, 'bold')
        doc.setTextColor(30, 41, 59)
        doc.text('Dispositivo', x, ty)
        ty += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(51, 65, 85)
        const deviceLines = [
          `Modelo: ${data.deviceModel || ''}`,
          `IMEI: ${data.deviceImei || ''}`,
          `Serial: ${data.deviceSerial || ''}`,
          `Color: ${data.deviceColor || ''}`,
          `Almacenamiento: ${data.deviceStorage || ''}`,
          `Descripción: ${data.deviceDescription || ''}`,
        ]
        deviceLines.forEach((line) => {
          doc.text(line, x, ty)
          ty += 5
        })
        ty += 4

        doc.setFont(undefined, 'bold')
        doc.setTextColor(30, 41, 59)
        doc.text('Reparación', x, ty)
        ty += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(51, 65, 85)
        doc.text(`Descripción: ${data.repairDescription || ''}`, x, ty)
        ty += 5
        doc.text(`Diagnóstico: ${data.repairDiagnostic || ''}`, x, ty)
        ty += 5

        doc.setFont(undefined, 'bold')
        doc.setTextColor(30, 41, 59)
        doc.text('Precios', x, ty)
        ty += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(51, 65, 85)
        doc.text(`Mano de obra: $${data.laborCost || '0'}`, x, ty)
        ty += 5
        doc.text(`Repuestos: $${data.partsCost || '0'}`, x, ty)
        ty += 5
        doc.setFont(undefined, 'bold')
        doc.setTextColor(15, 23, 42)
        doc.text(`Total: $${data.totalPrice || '0'}`, x, ty)
        ty += 8

        if (data.showSecurityInfo && data.securityType !== 'none') {
          doc.setFont(undefined, 'bold')
          doc.setTextColor(30, 41, 59)
          doc.text('🔐 Acceso', x, ty)
          ty += 5
          doc.setFont(undefined, 'normal')
          doc.setTextColor(51, 65, 85)
          const secMap = {
            pin: `PIN: ${data.securityPin || ''}`,
            pattern: `Patrón: ${data.securityPattern || ''}`,
            fingerprint: 'Huella digital',
          }
          doc.text(
            `Tipo: ${data.securityType === 'pin' ? 'PIN' : data.securityType === 'pattern' ? 'Patrón' : 'Huella'}`,
            x,
            ty
          )
          ty += 5
          doc.text(secMap[data.securityType] || 'Seguridad activa', x, ty)
          ty += 5
          if (data.securityNotes) {
            doc.text(`Notas: ${data.securityNotes}`, x, ty)
            ty += 5
          }
          ty += 4
        }

        doc.setFont(undefined, 'bold')
        doc.setTextColor(30, 41, 59)
        doc.text('Técnico', x, ty)
        ty += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(51, 65, 85)
        doc.text(`Asignado: ${data.technicianName || ''}`, x, ty)
        ty += 5
        doc.text(`Tiempo estimado: ${data.estimatedTime || ''}`, x, ty)
        ty += 5
        if (data.technicianNotes) {
          doc.setFont(undefined, 'bold')
          doc.setTextColor(30, 41, 59)
          doc.text('Notas internas', x, ty)
          ty += 5
          doc.setFont(undefined, 'normal')
          doc.setTextColor(51, 65, 85)
          doc.text(data.technicianNotes, x, ty)
          ty += 5
        }

        if (data.showSignatures) {
          ty += 12
          doc.setDrawColor(150, 150, 150)
          doc.setLineDash([2, 2], 0)
          doc.line(x + 10, ty, x + colW - 10, ty)
          doc.setLineDash([], 0)
          doc.setFontSize(fs - 1)
          doc.setTextColor(100, 116, 139)
          doc.text('Firma del Técnico', x + colW / 2, ty - 4, { align: 'center' })
        }
      }

      // Línea vertical punteada
      doc.setDrawColor(180, 180, 180)
      doc.setLineDash([2, 4], 0)
      doc.line(105, colTop, 105, 270)
      doc.setLineDash([], 0)

      // ---- Pie de página ----
      if (data.showFooter) {
        const fY = 280 - m
        doc.setDrawColor(220, 220, 220)
        doc.line(m, fY - 6, 190 - m, fY - 6)
        doc.setFontSize(fs - 1)
        doc.setTextColor(148, 163, 184)
        doc.text(data.footerText || '', 105, fY + 4, { align: 'center' })
      }

      doc.save('orden-servicio-profesional.pdf')
    } catch (error) {
      console.error('Error al generar el PDF:', error)
      alert('Ocurrió un error al generar el PDF. Por favor, inténtalo de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Actualizar previsualización al cambiar datos
  useEffect(() => {
    renderPreview()
  }, [data])

  // ============================================================================
  // UI del panel de configuración
  // ============================================================================
  const renderConfigPanel = () => (
    <div className="space-y-4">
      {/* Datos de la empresa */}
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

      {/* Datos del cliente */}
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

      {/* Datos del dispositivo y reparación */}
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

      {/* Visibilidad y formato */}
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
          <div className="pt-2 border-t border-border">
            <Input
              value={data.headerText}
              onChange={(e) => handleChange('headerText', e.target.value)}
              placeholder="Texto del encabezado"
            />
            <Input
              value={data.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              placeholder="Texto del pie"
              className="mt-2"
            />
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm font-medium">Fuente: {data.fontSize}px</span>
              <input
                type="range"
                min="8"
                max="14"
                value={data.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm font-medium">Margen: {data.margin}px</span>
              <input
                type="range"
                min="12"
                max="30"
                value={data.margin}
                onChange={(e) => handleChange('margin', parseInt(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          setData(defaultData)
          alert('Configuración restablecida a valores predeterminados.')
        }}
        variant="outline"
        className="w-full"
      >
        <RefreshCw size={16} className="mr-2" />
        Restablecer predeterminados
      </Button>

      <Button onClick={() => alert('Configuración guardada localmente.')} className="w-full">
        <Save size={16} className="mr-2" />
        Guardar configuración
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
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          {isGenerating ? 'Generando...' : 'Descargar PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-thin">
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
                  A4 • {data.fontSize}px
                </Badge>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                <canvas
                  ref={canvasRef}
                  width={595}
                  height={842}
                  className="w-full h-auto"
                />
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