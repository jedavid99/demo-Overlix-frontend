import React, { useState, useRef, useEffect } from 'react'
import {
  FileText, Download, Settings as SettingsIcon, Image, AlignCenter,
  Eye, Save, RefreshCw, Shield, Smartphone, User, Wrench, Key,
  CheckCircle, Printer, Calendar, Clock, MapPin, Phone, Mail,
  Building, Award, PenTool, Fingerprint, AlertCircle
} from 'lucide-react'
import jsPDF from 'jspdf'

interface PDFConfig {
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

  // Configuración visual
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

const defaultConfig: PDFConfig = {
  companyName: 'TechFix Reparaciones',
  companyAddress: 'Av. Corrientes 1234, CABA, Argentina',
  companyPhone: '+54 11 4321-1234',
  companyEmail: 'info@techfix.com',
  companyLogo: 'TF',

  orderNumber: 'OS-2024-0042',
  orderDate: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' }),

  clientName: 'Juan Carlos Pérez',
  clientPhone: '+54 9 11 5678-1234',
  clientEmail: 'juan.perez@email.com',
  clientAddress: 'Av. Rivadavia 5678, CABA',
  clientId: 'DNI 30.123.456',

  deviceModel: 'iPhone 15 Pro Max',
  deviceImei: '356912087654321',
  deviceSerial: 'G6T5X7Y8Z9',
  deviceColor: 'Titanium Black',
  deviceStorage: '256 GB',
  deviceDescription: 'Pantalla OLED, cámara trasera triple',

  repairDescription: 'Reemplazo de pantalla OLED y reparación de botón de volumen',
  repairDiagnostic: 'Pantalla con líneas verticales y falta de respuesta táctil. Botón de volumen inferior dañado.',
  repairPrice: '450.00',
  partsCost: '280.00',
  laborCost: '170.00',
  totalPrice: '450.00',

  warrantyMonths: '12',
  warrantyTerms: 'Garantía por defectos de fabricación y mano de obra por 12 meses. No cubre daños por agua, golpes o uso indebido posterior a la reparación.',

  securityType: 'pin',
  securityPin: '1234',
  securityPattern: 'Patrón en L (3x3)',
  securityNotes: 'El cliente ha proporcionado la clave de acceso. No compartir con personal no autorizado.',

  technicianName: 'Carlos López',
  technicianNotes: 'Verificar la batería durante el proceso. Posible desgaste por uso.',
  estimatedTime: '3 horas',

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

export default function PDFConfig() {
  const [config, setConfig] = useState<PDFConfig>(defaultConfig)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleConfigChange = <K extends keyof PDFConfig>(key: K, value: PDFConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  // Render preview profesional
  const generatePreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const m = config.margin
    const fs = config.fontSize
    const colW = (w - m * 3) / 2

    // Fondo blanco
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    let y = m

    // ---------- ENCABEZADO ----------
    if (config.showHeader) {
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, '#1e293b')
      grad.addColorStop(1, '#334155')
      ctx.fillStyle = grad
      ctx.fillRect(m, y, w - m * 2, 50)

      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${fs + 6}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText(config.companyLogo || 'LOGO', m + 12, y + 32)

      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(m + 45, y + 8)
      ctx.lineTo(m + 45, y + 42)
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${fs + 4}px Arial`
      ctx.fillText(config.companyName || 'Mi Empresa', m + 55, y + 22)
      ctx.fillStyle = '#94a3b8'
      ctx.font = `${fs - 1}px Arial`
      ctx.fillText(config.companyAddress || '', m + 55, y + 38)
      ctx.fillText((config.companyPhone || '') + ' | ' + (config.companyEmail || ''), m + 55, y + 46)

      ctx.textAlign = 'right'
      ctx.fillStyle = '#e2e8f0'
      ctx.font = `bold ${fs}px Arial`
      ctx.fillText('ORDEN N°', w - m - 10, y + 18)
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${fs + 4}px Arial`
      ctx.fillText(config.orderNumber || '---', w - m - 10, y + 34)
      ctx.fillStyle = '#94a3b8'
      ctx.font = `${fs - 1}px Arial`
      ctx.fillText('Fecha: ' + (config.orderDate || ''), w - m - 10, y + 48)

      y += 58
    }

    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(m, y)
    ctx.lineTo(w - m, y)
    ctx.stroke()
    y += 8

    const colTop = y
    const footerH = 30

    // ---- COLUMNA IZQUIERDA: CLIENTE ----
    if (config.showClientSection) {
      const x = m
      let cy = colTop

      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fs + 2}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText('👤 DATOS DEL CLIENTE', x, cy)
      cy += 18

      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      // Usamos rect en lugar de roundRect para compatibilidad
      ctx.strokeRect(x, cy - 4, colW, 120)
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(x + 1, cy - 3, colW - 2, 118)

      ctx.fillStyle = '#1e293b'
      ctx.font = `${fs}px Arial`
      const clientData = [
        `Nombre: ${config.clientName || ''}`,
        `Teléfono: ${config.clientPhone || ''}`,
        `Email: ${config.clientEmail || ''}`,
        `Dirección: ${config.clientAddress || ''}`,
        `Documento: ${config.clientId || ''}`
      ]
      clientData.forEach((line, i) => {
        ctx.fillText(line, x + 10, cy + 6 + i * 18)
      })
      cy += 120 + 6

      if (config.showWarrantyTerms) {
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
        const warrantyLines = (config.warrantyTerms || '').split('. ')
        warrantyLines.forEach((sentence, i) => {
          const text = sentence + (i < warrantyLines.length - 1 ? '.' : '')
          ctx.fillText(`• ${text}`, x + 8, cy + 6 + i * 15)
        })
        cy += 70 + 8

        ctx.fillStyle = '#0f172a'
        ctx.font = `bold ${fs}px Arial`
        ctx.fillText(`Vigencia: ${config.warrantyMonths || '0'} meses`, x + 8, cy + 4)
        cy += 20
      }

      if (config.showSignatures) {
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

    // ---- COLUMNA DERECHA: TÉCNICO ----
    if (config.showTechnicianSection) {
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
      const deviceData = [
        `Modelo: ${config.deviceModel || ''}`,
        `IMEI: ${config.deviceImei || ''}`,
        `Serial: ${config.deviceSerial || ''}`,
        `Color: ${config.deviceColor || ''}`,
        `Almacenamiento: ${config.deviceStorage || ''}`,
        `Descripción: ${config.deviceDescription || ''}`
      ]
      deviceData.forEach((line) => {
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
      ctx.fillText(`Descripción: ${config.repairDescription || ''}`, x, ty)
      ty += 14
      ctx.fillText(`Diagnóstico: ${config.repairDiagnostic || ''}`, x, ty)
      ty += 14

      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${fs}px Arial`
      ctx.fillText('Precios', x, ty)
      ty += 14
      ctx.font = `${fs}px Arial`
      ctx.fillStyle = '#334155'
      ctx.fillText(`Mano de obra: $${config.laborCost || '0'}`, x, ty)
      ty += 14
      ctx.fillText(`Repuestos: $${config.partsCost || '0'}`, x, ty)
      ty += 14
      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fs + 1}px Arial`
      ctx.fillText(`Total: $${config.totalPrice || '0'}`, x, ty)
      ty += 20

      if (config.showSecurityInfo && config.securityType !== 'none') {
        ctx.fillStyle = '#1e293b'
        ctx.font = `bold ${fs}px Arial`
        ctx.fillText('🔐 Acceso', x, ty)
        ty += 14
        ctx.font = `${fs}px Arial`
        ctx.fillStyle = '#334155'
        const securityLabels = {
          pin: `PIN: ${config.securityPin || ''}`,
          pattern: `Patrón: ${config.securityPattern || ''}`,
          fingerprint: 'Huella digital'
        }
        const secText = securityLabels[config.securityType] || 'Seguridad activa'
        ctx.fillText(`Tipo: ${config.securityType === 'pin' ? 'PIN' : config.securityType === 'pattern' ? 'Patrón' : 'Huella'}`, x, ty)
        ty += 14
        ctx.fillText(secText, x, ty)
        ty += 14
        if (config.securityNotes) {
          ctx.fillText(`Notas: ${config.securityNotes}`, x, ty)
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
      ctx.fillText(`Asignado: ${config.technicianName || ''}`, x, ty)
      ty += 14
      ctx.fillText(`Tiempo estimado: ${config.estimatedTime || ''}`, x, ty)
      ty += 14
      if (config.technicianNotes) {
        ctx.fillStyle = '#1e293b'
        ctx.font = `bold ${fs}px Arial`
        ctx.fillText('Notas internas', x, ty)
        ty += 14
        ctx.font = `${fs}px Arial`
        ctx.fillStyle = '#334155'
        ctx.fillText(config.technicianNotes, x, ty)
        ty += 14
      }

      if (config.showSignatures) {
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

    // Línea divisoria vertical
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 6])
    ctx.beginPath()
    ctx.moveTo(w / 2, colTop)
    ctx.lineTo(w / 2, h - m - footerH - 10)
    ctx.stroke()
    ctx.setLineDash([])

    // ---------- PIE DE PÁGINA ----------
    if (config.showFooter) {
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
      ctx.fillText(config.footerText || '', w / 2, fY + 4)
    }
  }

  // Generar PDF profesional con jsPDF
  const generatePDF = () => {
    setIsGenerating(true)
    const doc = new jsPDF()
    const m = config.margin
    const w = 190
    const colW = (w - m) / 2
    const fs = config.fontSize
    let y = m

    // ---------- ENCABEZADO ----------
    if (config.showHeader) {
      doc.setFillColor(30, 41, 59)
      doc.rect(m, y, w, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(fs + 6)
      doc.setFont(undefined, 'bold')
      doc.text(config.companyName || 'Mi Empresa', m + 12, y + 18)
      doc.setFontSize(fs)
      doc.setTextColor(148, 163, 184)
      doc.text(config.companyAddress || '', m + 12, y + 30)
      doc.text((config.companyPhone || '') + ' | ' + (config.companyEmail || ''), m + 12, y + 38)

      doc.setFontSize(fs + 2)
      doc.setTextColor(255, 255, 255)
      doc.text('ORDEN N°', 190 - m - 10, y + 16, { align: 'right' })
      doc.setFontSize(fs + 4)
      doc.text(config.orderNumber || '---', 190 - m - 10, y + 30, { align: 'right' })
      doc.setFontSize(fs)
      doc.setTextColor(148, 163, 184)
      doc.text('Fecha: ' + (config.orderDate || ''), 190 - m - 10, y + 42, { align: 'right' })

      y += 48
    }

    doc.setDrawColor(200, 200, 200)
    doc.line(m, y, 190 - m, y)
    y += 8

    const colTop = y

    // ---- COLUMNA IZQUIERDA: CLIENTE ----
    if (config.showClientSection) {
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
      const clientData = [
        `Nombre: ${config.clientName || ''}`,
        `Teléfono: ${config.clientPhone || ''}`,
        `Email: ${config.clientEmail || ''}`,
        `Dirección: ${config.clientAddress || ''}`,
        `Documento: ${config.clientId || ''}`
      ]
      clientData.forEach((line) => {
        doc.text(line, m + 6, cy)
        cy += 6
      })
      cy += 6

      if (config.showWarrantyTerms) {
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
        const warrantyLines = (config.warrantyTerms || '').split('. ')
        warrantyLines.forEach((sentence, i) => {
          const text = sentence + (i < warrantyLines.length - 1 ? '.' : '')
          doc.text(`• ${text}`, m + 6, cy + i * 5)
        })
        cy += 50 + 6
        doc.setFontSize(fs)
        doc.setFont(undefined, 'bold')
        doc.setTextColor(15, 23, 42)
        doc.text(`Vigencia: ${config.warrantyMonths || '0'} meses`, m + 8, cy + 2)
        cy += 12
      }

      if (config.showSignatures) {
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

    // ---- COLUMNA DERECHA: TÉCNICO ----
    if (config.showTechnicianSection) {
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
      const deviceData = [
        `Modelo: ${config.deviceModel || ''}`,
        `IMEI: ${config.deviceImei || ''}`,
        `Serial: ${config.deviceSerial || ''}`,
        `Color: ${config.deviceColor || ''}`,
        `Almacenamiento: ${config.deviceStorage || ''}`,
        `Descripción: ${config.deviceDescription || ''}`
      ]
      deviceData.forEach((line) => {
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
      doc.text(`Descripción: ${config.repairDescription || ''}`, x, ty)
      ty += 5
      doc.text(`Diagnóstico: ${config.repairDiagnostic || ''}`, x, ty)
      ty += 5

      doc.setFont(undefined, 'bold')
      doc.setTextColor(30, 41, 59)
      doc.text('Precios', x, ty)
      ty += 5
      doc.setFont(undefined, 'normal')
      doc.setTextColor(51, 65, 85)
      doc.text(`Mano de obra: $${config.laborCost || '0'}`, x, ty)
      ty += 5
      doc.text(`Repuestos: $${config.partsCost || '0'}`, x, ty)
      ty += 5
      doc.setFont(undefined, 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text(`Total: $${config.totalPrice || '0'}`, x, ty)
      ty += 8

      if (config.showSecurityInfo && config.securityType !== 'none') {
        doc.setFont(undefined, 'bold')
        doc.setTextColor(30, 41, 59)
        doc.text('🔐 Acceso', x, ty)
        ty += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(51, 65, 85)
        const securityLabels = {
          pin: `PIN: ${config.securityPin || ''}`,
          pattern: `Patrón: ${config.securityPattern || ''}`,
          fingerprint: 'Huella digital'
        }
        const secText = securityLabels[config.securityType] || 'Seguridad activa'
        doc.text(`Tipo: ${config.securityType === 'pin' ? 'PIN' : config.securityType === 'pattern' ? 'Patrón' : 'Huella'}`, x, ty)
        ty += 5
        doc.text(secText, x, ty)
        ty += 5
        if (config.securityNotes) {
          doc.text(`Notas: ${config.securityNotes}`, x, ty)
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
      doc.text(`Asignado: ${config.technicianName || ''}`, x, ty)
      ty += 5
      doc.text(`Tiempo estimado: ${config.estimatedTime || ''}`, x, ty)
      ty += 5
      if (config.technicianNotes) {
        doc.setFont(undefined, 'bold')
        doc.setTextColor(30, 41, 59)
        doc.text('Notas internas', x, ty)
        ty += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(51, 65, 85)
        doc.text(config.technicianNotes, x, ty)
        ty += 5
      }

      if (config.showSignatures) {
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

    // ---------- PIE DE PÁGINA ----------
    if (config.showFooter) {
      const fY = 280 - m
      doc.setDrawColor(220, 220, 220)
      doc.line(m, fY - 6, 190 - m, fY - 6)
      doc.setFontSize(fs - 1)
      doc.setTextColor(148, 163, 184)
      doc.text(config.footerText || '', 105, fY + 4, { align: 'center' })
    }

    doc.save('orden-servicio-profesional.pdf')
    setIsGenerating(false)
  }

  useEffect(() => {
    generatePreview()
  }, [config])

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración de Orden de Servicio</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Personaliza el contenido y el diseño profesional de la orden</p>
        </div>
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
          {isGenerating ? 'Generando...' : 'Descargar PDF Profesional'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-1 space-y-4">
          {/* Configuración general y empresa */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building size={16} className="text-primary" /> Empresa
            </h3>
            <input type="text" value={config.companyName} onChange={(e) => handleConfigChange('companyName', e.target.value)} placeholder="Nombre empresa" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.companyAddress} onChange={(e) => handleConfigChange('companyAddress', e.target.value)} placeholder="Dirección" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.companyPhone} onChange={(e) => handleConfigChange('companyPhone', e.target.value)} placeholder="Teléfono" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.companyEmail} onChange={(e) => handleConfigChange('companyEmail', e.target.value)} placeholder="Email" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <div className="flex gap-2">
              <input type="text" value={config.orderNumber} onChange={(e) => handleConfigChange('orderNumber', e.target.value)} placeholder="N° Orden" className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <input type="date" value={config.orderDate} onChange={(e) => handleConfigChange('orderDate', e.target.value)} className="w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            </div>
          </div>

          {/* Cliente */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-primary" /> Cliente
            </h3>
            <input type="text" value={config.clientName} onChange={(e) => handleConfigChange('clientName', e.target.value)} placeholder="Nombre completo" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.clientPhone} onChange={(e) => handleConfigChange('clientPhone', e.target.value)} placeholder="Teléfono" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.clientEmail} onChange={(e) => handleConfigChange('clientEmail', e.target.value)} placeholder="Email" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.clientAddress} onChange={(e) => handleConfigChange('clientAddress', e.target.value)} placeholder="Dirección" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.clientId} onChange={(e) => handleConfigChange('clientId', e.target.value)} placeholder="Documento" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
          </div>

          {/* Dispositivo y reparación */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone size={16} className="text-primary" /> Dispositivo
            </h3>
            <input type="text" value={config.deviceModel} onChange={(e) => handleConfigChange('deviceModel', e.target.value)} placeholder="Modelo" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.deviceImei} onChange={(e) => handleConfigChange('deviceImei', e.target.value)} placeholder="IMEI" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.deviceSerial} onChange={(e) => handleConfigChange('deviceSerial', e.target.value)} placeholder="Serial" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.deviceColor} onChange={(e) => handleConfigChange('deviceColor', e.target.value)} placeholder="Color" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.deviceStorage} onChange={(e) => handleConfigChange('deviceStorage', e.target.value)} placeholder="Almacenamiento" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.deviceDescription} onChange={(e) => handleConfigChange('deviceDescription', e.target.value)} placeholder="Descripción" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm mt-2">Reparación</h4>
            <input type="text" value={config.repairDescription} onChange={(e) => handleConfigChange('repairDescription', e.target.value)} placeholder="Descripción reparación" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.repairDiagnostic} onChange={(e) => handleConfigChange('repairDiagnostic', e.target.value)} placeholder="Diagnóstico" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={config.laborCost} onChange={(e) => handleConfigChange('laborCost', e.target.value)} placeholder="Mano obra" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <input type="text" value={config.partsCost} onChange={(e) => handleConfigChange('partsCost', e.target.value)} placeholder="Repuestos" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <input type="text" value={config.totalPrice} onChange={(e) => handleConfigChange('totalPrice', e.target.value)} placeholder="Total" className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            </div>
          </div>

          {/* Seguridad y técnico */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield size={16} className="text-primary" /> Seguridad y Técnico
            </h3>
            <select value={config.securityType} onChange={(e) => handleConfigChange('securityType', e.target.value as any)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm">
              <option value="none">Ninguno</option>
              <option value="pin">PIN</option>
              <option value="pattern">Patrón</option>
              <option value="fingerprint">Huella</option>
            </select>
            {config.securityType === 'pin' && <input type="text" value={config.securityPin} onChange={(e) => handleConfigChange('securityPin', e.target.value)} placeholder="PIN" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />}
            {config.securityType === 'pattern' && <input type="text" value={config.securityPattern} onChange={(e) => handleConfigChange('securityPattern', e.target.value)} placeholder="Patrón" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />}
            <input type="text" value={config.securityNotes} onChange={(e) => handleConfigChange('securityNotes', e.target.value)} placeholder="Notas seguridad" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.technicianName} onChange={(e) => handleConfigChange('technicianName', e.target.value)} placeholder="Técnico" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.estimatedTime} onChange={(e) => handleConfigChange('estimatedTime', e.target.value)} placeholder="Tiempo estimado" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <textarea value={config.technicianNotes} onChange={(e) => handleConfigChange('technicianNotes', e.target.value)} placeholder="Notas internas" rows={2} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm resize-none" />
          </div>

          {/* Garantía */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={16} className="text-primary" /> Garantía
            </h3>
            <input type="text" value={config.warrantyMonths} onChange={(e) => handleConfigChange('warrantyMonths', e.target.value)} placeholder="Meses" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <textarea value={config.warrantyTerms} onChange={(e) => handleConfigChange('warrantyTerms', e.target.value)} placeholder="Términos y condiciones" rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm resize-none" />
          </div>

          {/* Mostrar/ocultar secciones */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye size={16} className="text-primary" /> Visibilidad
            </h3>
            {[
              { key: 'showClientSection', label: 'Sección Cliente' },
              { key: 'showTechnicianSection', label: 'Sección Técnico' },
              { key: 'showSecurityInfo', label: 'Información de seguridad' },
              { key: 'showWarrantyTerms', label: 'Términos de garantía' },
              { key: 'showSignatures', label: 'Espacios de firma' },
              { key: 'showHeader', label: 'Encabezado' },
              { key: 'showFooter', label: 'Pie de página' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config[item.key as keyof PDFConfig] as boolean}
                    onChange={(e) => handleConfigChange(item.key as keyof PDFConfig, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Textos personalizados y formato */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Textos y Formato
            </h3>
            <input type="text" value={config.headerText} onChange={(e) => handleConfigChange('headerText', e.target.value)} placeholder="Texto encabezado" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <input type="text" value={config.footerText} onChange={(e) => handleConfigChange('footerText', e.target.value)} placeholder="Texto pie" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fuente: {config.fontSize}px</label>
              <input type="range" min="8" max="14" value={config.fontSize} onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))} className="flex-1" />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Margen: {config.margin}px</label>
              <input type="range" min="12" max="30" value={config.margin} onChange={(e) => handleConfigChange('margin', parseInt(e.target.value))} className="flex-1" />
            </div>
          </div>

          <button
            onClick={() => alert('Configuración guardada')}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all"
          >
            <Save size={16} /> Guardar configuración
          </button>
        </div>

        {/* Vista previa */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Vista previa profesional (A4)</h3>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
              <canvas
                ref={canvasRef}
                width={595}
                height={842}
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              La vista previa se actualiza automáticamente al cambiar cualquier campo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}