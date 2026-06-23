import React, { useState, useRef, useEffect } from 'react'
import { FileText, Download, Settings as SettingsIcon, Move, Image, AlignCenter, Eye, Save, RefreshCw, Shield, Smartphone, User, Wrench, Key, CheckCircle } from 'lucide-react'
import jsPDF from 'jspdf'

interface PDFConfig {
  // Configuración general
  showHeader: boolean
  showFooter: boolean
  headerText: string
  footerText: string
  fontSize: number
  margin: number
  
  // Datos del cliente
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  
  // Datos del dispositivo
  deviceModel: string
  deviceImei: string
  deviceSerial: string
  deviceDescription: string
  
  // Datos de reparación
  repairDescription: string
  repairPrice: string
  warrantyMonths: string
  warrantyTerms: string
  
  // Seguridad (para la sección del técnico)
  securityType: 'none' | 'pin' | 'pattern' | 'fingerprint'
  securityPin: string
  securityPattern: string
  securityNotes: string
  
  // Técnico
  technicianName: string
  technicianNotes: string
  
  // Mostrar/ocultar secciones
  showClientSection: boolean
  showTechnicianSection: boolean
  showSecurityInfo: boolean
  showWarrantyTerms: boolean
}

const defaultConfig: PDFConfig = {
  showHeader: true,
  showFooter: true,
  headerText: 'ORDEN DE SERVICIO',
  footerText: 'Gracias por confiar en nosotros',
  fontSize: 11,
  margin: 18,
  
  clientName: 'Juan Pérez',
  clientPhone: '+54 11 1234-5678',
  clientEmail: 'juan@email.com',
  clientAddress: 'Av. Principal 123, Ciudad',
  
  deviceModel: 'iPhone 15 Pro Max',
  deviceImei: '356912087654321',
  deviceSerial: 'G6T5X7Y8Z9',
  deviceDescription: 'Pantalla OLED original',
  
  repairDescription: 'Cambio de pantalla y reparación de botón de volumen',
  repairPrice: '450.00',
  warrantyMonths: '12',
  warrantyTerms: 'Garantía contra defectos de fabricación y mano de obra. No cubre daños por agua o caídas posteriores.',
  
  securityType: 'pin',
  securityPin: '1234',
  securityPattern: 'L-shape 3x3',
  securityNotes: 'El cliente ha proporcionado la clave de acceso.',
  
  technicianName: 'Carlos López',
  technicianNotes: 'Se recomienda revisar la batería durante el proceso.',
  
  showClientSection: true,
  showTechnicianSection: true,
  showSecurityInfo: true,
  showWarrantyTerms: true,
}

export default function PDFConfig() {
  const [config, setConfig] = useState<PDFConfig>(defaultConfig)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleConfigChange = (key: keyof PDFConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  // Render preview en canvas
  const generatePreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const m = config.margin
    const fontSize = config.fontSize
    const colWidth = (w - m * 3) / 2 // dos columnas con separación

    // Fondo
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    let y = m

    // Encabezado
    if (config.showHeader) {
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(m, y, w - m * 2, 40)
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${fontSize + 6}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText(config.headerText, w / 2, y + 26)
      y += 50
    }

    // Línea divisoria horizontal sutil
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(m, y)
    ctx.lineTo(w - m, y)
    ctx.stroke()
    y += 10

    // Altura máxima de la columna (para mantener simetría)
    const colHeight = h - y - m - 30

    // ---- COLUMNA IZQUIERDA (Cliente) ----
    const x1 = m
    const x2 = m + colWidth + m / 2

    ctx.textAlign = 'left'

    if (config.showClientSection) {
      // Título columna cliente
      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fontSize + 2}px Arial`
      ctx.fillText('📋 INFORMACIÓN DEL CLIENTE', x1, y)
      let cy = y + 18
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = '#334155'
      
      const clientLines = [
        `Cliente: ${config.clientName}`,
        `Teléfono: ${config.clientPhone}`,
        `Email: ${config.clientEmail}`,
        `Dirección: ${config.clientAddress}`,
      ]
      clientLines.forEach(line => {
        ctx.fillText(line, x1, cy)
        cy += 16
      })

      // Términos de garantía
      if (config.showWarrantyTerms) {
        cy += 6
        ctx.fillStyle = '#0f172a'
        ctx.font = `bold ${fontSize + 1}px Arial`
        ctx.fillText('🔒 TÉRMINOS DE GARANTÍA', x1, cy)
        cy += 18
        ctx.font = `${fontSize - 1}px Arial`
        ctx.fillStyle = '#475569'
        const terms = config.warrantyTerms.split('. ')
        terms.forEach((sentence, i) => {
          const text = sentence + (i < terms.length - 1 ? '.' : '')
          ctx.fillText(`• ${text}`, x1, cy)
          cy += 15
        })
      }
    }

    // ---- COLUMNA DERECHA (Técnico) ----
    if (config.showTechnicianSection) {
      const x = x2
      let ty = y

      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fontSize + 2}px Arial`
      ctx.fillText('🔧 INFORMACIÓN PARA EL TÉCNICO', x, ty)
      ty += 18
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = '#334155'

      // Dispositivo
      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fontSize}px Arial`
      ctx.fillText('Dispositivo:', x, ty)
      ty += 14
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = '#334155'
      ctx.fillText(`Modelo: ${config.deviceModel}`, x, ty)
      ty += 14
      ctx.fillText(`IMEI: ${config.deviceImei}`, x, ty)
      ty += 14
      ctx.fillText(`Serial: ${config.deviceSerial}`, x, ty)
      ty += 14
      ctx.fillText(`Descripción: ${config.deviceDescription}`, x, ty)
      ty += 16

      // Reparación
      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fontSize}px Arial`
      ctx.fillText('Reparación:', x, ty)
      ty += 14
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = '#334155'
      ctx.fillText(config.repairDescription, x, ty)
      ty += 16

      // Seguridad (si está activada)
      if (config.showSecurityInfo && config.securityType !== 'none') {
        ctx.fillStyle = '#0f172a'
        ctx.font = `bold ${fontSize}px Arial`
        ctx.fillText('🔐 Acceso:', x, ty)
        ty += 14
        ctx.font = `${fontSize}px Arial`
        ctx.fillStyle = '#334155'
        ctx.fillText(`Tipo: ${config.securityType === 'pin' ? 'PIN' : config.securityType === 'pattern' ? 'Patrón' : 'Huella'}`, x, ty)
        ty += 14
        if (config.securityType === 'pin') {
          ctx.fillText(`Clave: ${config.securityPin}`, x, ty)
          ty += 14
        } else if (config.securityType === 'pattern') {
          ctx.fillText(`Patrón: ${config.securityPattern}`, x, ty)
          ty += 14
        }
        if (config.securityNotes) {
          ctx.fillText(`Notas: ${config.securityNotes}`, x, ty)
          ty += 14
        }
      }

      // Notas del técnico
      if (config.technicianNotes) {
        ctx.fillStyle = '#0f172a'
        ctx.font = `bold ${fontSize}px Arial`
        ctx.fillText('Notas:', x, ty)
        ty += 14
        ctx.font = `${fontSize}px Arial`
        ctx.fillStyle = '#334155'
        ctx.fillText(config.technicianNotes, x, ty)
        ty += 14
      }

      // Técnico asignado
      ctx.fillStyle = '#0f172a'
      ctx.font = `bold ${fontSize}px Arial`
      ctx.fillText('Técnico:', x, ty)
      ty += 14
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = '#334155'
      ctx.fillText(config.technicianName, x, ty)
    }

    // Línea divisoria vertical entre columnas
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(w / 2, y + 10)
    ctx.lineTo(w / 2, h - m - 20)
    ctx.stroke()
    ctx.setLineDash([])

    // Footer
    if (config.showFooter) {
      ctx.fillStyle = '#94a3b8'
      ctx.font = `${fontSize - 1}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText(config.footerText, w / 2, h - m)
    }
  }

  // Generar PDF con jsPDF (dos columnas)
  const generatePDF = () => {
    setIsGenerating(true)
    const doc = new jsPDF()
    const m = config.margin
    const w = 190 // ancho util
    const colWidth = (w - m) / 2
    let y = m

    // Encabezado
    if (config.showHeader) {
      doc.setFillColor(30, 41, 59)
      doc.rect(m, m, w, 20, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(config.fontSize + 6)
      doc.text(config.headerText, 105, m + 13, { align: 'center' })
      y += 30
    }

    // Línea horizontal
    doc.setDrawColor(200, 200, 200)
    doc.line(m, y, w + m, y)
    y += 6

    // Columnas
    const colHeight = 250 // altura aprox para la columna

    // ---- Columna izquierda: Cliente ----
    if (config.showClientSection) {
      let cy = y
      doc.setFontSize(config.fontSize + 1)
      doc.setTextColor(15, 23, 42)
      doc.setFont(undefined, 'bold')
      doc.text('📋 INFORMACIÓN DEL CLIENTE', m, cy)
      cy += 6
      doc.setFontSize(config.fontSize)
      doc.setFont(undefined, 'normal')
      doc.setTextColor(51, 65, 85)

      const clientLines = [
        `Cliente: ${config.clientName}`,
        `Teléfono: ${config.clientPhone}`,
        `Email: ${config.clientEmail}`,
        `Dirección: ${config.clientAddress}`,
      ]
      clientLines.forEach(line => {
        doc.text(line, m, cy)
        cy += 6
      })

      if (config.showWarrantyTerms) {
        cy += 4
        doc.setFontSize(config.fontSize + 1)
        doc.setFont(undefined, 'bold')
        doc.setTextColor(15, 23, 42)
        doc.text('🔒 TÉRMINOS DE GARANTÍA', m, cy)
        cy += 6
        doc.setFontSize(config.fontSize - 1)
        doc.setFont(undefined, 'normal')
        doc.setTextColor(71, 85, 105)
        const lines = config.warrantyTerms.split('. ')
        lines.forEach((sentence, i) => {
          const text = sentence + (i < lines.length - 1 ? '.' : '')
          doc.text(`• ${text}`, m, cy)
          cy += 5
        })
      }
    }

    // ---- Columna derecha: Técnico ----
    if (config.showTechnicianSection) {
      const x = m + colWidth + m / 2
      let ty = y

      doc.setFontSize(config.fontSize + 1)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('🔧 INFORMACIÓN PARA EL TÉCNICO', x, ty)
      ty += 6
      doc.setFontSize(config.fontSize)
      doc.setFont(undefined, 'normal')
      doc.setTextColor(51, 65, 85)

      // Dispositivo
      doc.setFont(undefined, 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('Dispositivo:', x, ty)
      ty += 5
      doc.setFont(undefined, 'normal')
      doc.setTextColor(51, 65, 85)
      doc.text(`Modelo: ${config.deviceModel}`, x, ty)
      ty += 5
      doc.text(`IMEI: ${config.deviceImei}`, x, ty)
      ty += 5
      doc.text(`Serial: ${config.deviceSerial}`, x, ty)
      ty += 5
      doc.text(`Descripción: ${config.deviceDescription}`, x, ty)
      ty += 6

      // Reparación
      doc.setFont(undefined, 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('Reparación:', x, ty)
      ty += 5
      doc.setFont(undefined, 'normal')
      doc.setTextColor(51, 65, 85)
      doc.text(config.repairDescription, x, ty)
      ty += 6

      // Seguridad
      if (config.showSecurityInfo && config.securityType !== 'none') {
        doc.setFont(undefined, 'bold')
        doc.setTextColor(15, 23, 42)
        doc.text('🔐 Acceso:', x, ty)
        ty += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(51, 65, 85)
        const typeLabel = config.securityType === 'pin' ? 'PIN' : config.securityType === 'pattern' ? 'Patrón' : 'Huella'
        doc.text(`Tipo: ${typeLabel}`, x, ty)
        ty += 5
        if (config.securityType === 'pin') {
          doc.text(`Clave: ${config.securityPin}`, x, ty)
          ty += 5
        } else if (config.securityType === 'pattern') {
          doc.text(`Patrón: ${config.securityPattern}`, x, ty)
          ty += 5
        }
        if (config.securityNotes) {
          doc.text(`Notas: ${config.securityNotes}`, x, ty)
          ty += 5
        }
        ty += 1
      }

      // Notas del técnico
      if (config.technicianNotes) {
        doc.setFont(undefined, 'bold')
        doc.setTextColor(15, 23, 42)
        doc.text('Notas:', x, ty)
        ty += 5
        doc.setFont(undefined, 'normal')
        doc.setTextColor(51, 65, 85)
        doc.text(config.technicianNotes, x, ty)
        ty += 6
      }

      // Técnico
      doc.setFont(undefined, 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('Técnico asignado:', x, ty)
      ty += 5
      doc.setFont(undefined, 'normal')
      doc.setTextColor(51, 65, 85)
      doc.text(config.technicianName, x, ty)
    }

    // Línea vertical de separación (punteada)
    doc.setDrawColor(200, 200, 200)
    doc.setLineDashPattern([2, 2])
    doc.line(m + colWidth + m / 4, m + 30, m + colWidth + m / 4, 270)
    doc.setLineDashPattern([])

    // Footer
    if (config.showFooter) {
      doc.setTextColor(148, 163, 184)
      doc.setFontSize(config.fontSize - 1)
      doc.text(config.footerText, 105, 280 - m, { align: 'center' })
    }

    doc.save('orden-servicio.pdf')
    setIsGenerating(false)
  }

  useEffect(() => {
    generatePreview()
  }, [config])

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración de PDF</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Personaliza el contenido y diseño de la orden de servicio</p>
        </div>
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
          {isGenerating ? 'Generando...' : 'Descargar PDF'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-1 space-y-4">
          {/* Datos del cliente */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Datos del Cliente</h3>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={config.clientName}
                onChange={(e) => handleConfigChange('clientName', e.target.value)}
                placeholder="Nombre"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={config.clientPhone}
                onChange={(e) => handleConfigChange('clientPhone', e.target.value)}
                placeholder="Teléfono"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={config.clientEmail}
                onChange={(e) => handleConfigChange('clientEmail', e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={config.clientAddress}
                onChange={(e) => handleConfigChange('clientAddress', e.target.value)}
                placeholder="Dirección"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Datos del dispositivo y reparación */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Dispositivo y Reparación</h3>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={config.deviceModel}
                onChange={(e) => handleConfigChange('deviceModel', e.target.value)}
                placeholder="Modelo"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={config.deviceImei}
                onChange={(e) => handleConfigChange('deviceImei', e.target.value)}
                placeholder="IMEI"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={config.deviceSerial}
                onChange={(e) => handleConfigChange('deviceSerial', e.target.value)}
                placeholder="Serial"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={config.deviceDescription}
                onChange={(e) => handleConfigChange('deviceDescription', e.target.value)}
                placeholder="Descripción del dispositivo"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <textarea
                value={config.repairDescription}
                onChange={(e) => handleConfigChange('repairDescription', e.target.value)}
                placeholder="Descripción de la reparación"
                rows={2}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white resize-none"
              />
              <input
                type="text"
                value={config.repairPrice}
                onChange={(e) => handleConfigChange('repairPrice', e.target.value)}
                placeholder="Precio"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Seguridad y técnico */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Seguridad y Técnico</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de seguridad</label>
                <select
                  value={config.securityType}
                  onChange={(e) => handleConfigChange('securityType', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="none">Ninguno</option>
                  <option value="pin">PIN</option>
                  <option value="pattern">Patrón</option>
                  <option value="fingerprint">Huella</option>
                </select>
              </div>
              {config.securityType === 'pin' && (
                <input
                  type="text"
                  value={config.securityPin}
                  onChange={(e) => handleConfigChange('securityPin', e.target.value)}
                  placeholder="Clave PIN"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
                />
              )}
              {config.securityType === 'pattern' && (
                <input
                  type="text"
                  value={config.securityPattern}
                  onChange={(e) => handleConfigChange('securityPattern', e.target.value)}
                  placeholder="Descripción del patrón"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
                />
              )}
              <input
                type="text"
                value={config.securityNotes}
                onChange={(e) => handleConfigChange('securityNotes', e.target.value)}
                placeholder="Notas de seguridad"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={config.technicianName}
                onChange={(e) => handleConfigChange('technicianName', e.target.value)}
                placeholder="Nombre del técnico"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <textarea
                value={config.technicianNotes}
                onChange={(e) => handleConfigChange('technicianNotes', e.target.value)}
                placeholder="Notas para el técnico"
                rows={2}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* Términos de garantía */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Términos de Garantía</h3>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={config.warrantyMonths}
                onChange={(e) => handleConfigChange('warrantyMonths', e.target.value)}
                placeholder="Meses de garantía"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <textarea
                value={config.warrantyTerms}
                onChange={(e) => handleConfigChange('warrantyTerms', e.target.value)}
                placeholder="Términos y condiciones de la garantía"
                rows={3}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* Mostrar/ocultar secciones */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Mostrar secciones</h3>
            </div>
            <div className="space-y-2">
              {[
                { key: 'showClientSection', label: 'Sección Cliente' },
                { key: 'showTechnicianSection', label: 'Sección Técnico' },
                { key: 'showSecurityInfo', label: 'Información de seguridad' },
                { key: 'showWarrantyTerms', label: 'Términos de garantía' },
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
          </div>

          {/* Textos personalizados */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Textos personalizados</h3>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={config.headerText}
                onChange={(e) => handleConfigChange('headerText', e.target.value)}
                placeholder="Texto del encabezado"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={config.footerText}
                onChange={(e) => handleConfigChange('footerText', e.target.value)}
                placeholder="Texto del pie"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Formato */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Formato</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tamaño de fuente: {config.fontSize}px</label>
                <input
                  type="range"
                  min="8"
                  max="14"
                  value={config.fontSize}
                  onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Margen: {config.margin}px</label>
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={config.margin}
                  onChange={(e) => handleConfigChange('margin', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Configuración guardada')}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all"
          >
            <Save size={16} />
            Guardar configuración
          </button>
        </div>

        {/* Vista previa */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Vista previa (A4)</h3>
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