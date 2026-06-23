import React, { useState, useRef } from 'react'
import { FileText, Download, Settings as SettingsIcon, Move, Image, AlignCenter, Eye, Save, RefreshCw, User, Wrench, Calendar, Clock, CheckCircle, FileSignature } from 'lucide-react'
import jsPDF from 'jspdf'

interface PDFConfig {
  logoPosition: 'center' | 'watermark'
  showLogo: boolean
  headerText: string
  footerText: string
  fontSize: number
  margin: number
}

const defaultConfig: PDFConfig = {
  logoPosition: 'center',
  showLogo: true,
  headerText: 'ORDEN DE SERVICIO',
  footerText: 'Gracias por su confianza',
  fontSize: 12,
  margin: 20,
}

export default function PDFConfig() {
  const [config, setConfig] = useState<PDFConfig>(defaultConfig)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleConfigChange = (key: keyof PDFConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const generatePreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const margin = config.margin
    let currentY = margin

    // Header
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(margin, currentY, canvas.width - margin * 2, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${config.fontSize + 4}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText(config.headerText, canvas.width / 2, currentY + 25)
    currentY += 60

    // Logo
    if (config.showLogo) {
      ctx.fillStyle = '#3b82f6'
      if (config.logoPosition === 'center') {
        ctx.beginPath()
        ctx.arc(canvas.width / 2, currentY + 20, 30, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px Arial'
        ctx.fillText('LOGO', canvas.width / 2, currentY + 25)
        currentY += 60
      } else {
        ctx.globalAlpha = 0.1
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // ORDEN DE SERVICIO - CLIENTE
    currentY += 10
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(margin, currentY, canvas.width - margin * 2, 30)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${config.fontSize + 2}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText('ORDEN DE SERVICIO - CLIENTE', canvas.width / 2, currentY + 20)
    currentY += 40

    ctx.textAlign = 'left'
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    
    // Información del cliente
    ctx.fillText('N° Orden: #ORD-2024-00123', margin, currentY)
    ctx.fillText('Fecha: 22/06/2024', margin, currentY + 20)
    ctx.fillText('Estado: En proceso', margin, currentY + 40)
    currentY += 60

    // Información del dispositivo
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('INFORMACIÓN DEL DISPOSITIVO', margin, currentY)
    currentY += 20
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    ctx.fillText('Dispositivo: iPhone 15 Pro Max', margin, currentY)
    ctx.fillText('IMEI: 356912087654321', margin, currentY + 20)
    ctx.fillText('Color: Titanium Black', margin, currentY + 40)
    ctx.fillText('Almacenamiento: 256 GB', margin, currentY + 60)
    currentY += 80

    // Detalles de reparación
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('DETALLES DE REPARACIÓN', margin, currentY)
    currentY += 20
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    ctx.fillText('Servicio: Cambio de pantalla', margin, currentY)
    ctx.fillText('Descripción: Pantalla OLED original', margin, currentY + 20)
    currentY += 40

    // Precios
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('PRECIO', margin, currentY)
    currentY += 20
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    ctx.fillText('Servicio: $450.00', margin, currentY)
    ctx.fillText('Piezas: $350.00', margin, currentY + 20)
    ctx.fillText('Mano de obra: $100.00', margin, currentY + 40)
    currentY += 70

    // Garantía y términos
    ctx.fillStyle = '#059669'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('GARANTÍA: 90 DÍAS', margin, currentY)
    currentY += 25
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize - 2}px Arial`
    const warrantyTerms = [
      'Términos y condiciones de la garantía:',
      '• La garantía cubre defectos de fabricación de la pieza instalada',
      '• No cubre daños por mal uso, caídas o exposición a líquidos',
      '• El cliente debe conservar esta orden como comprobante de garantía',
      '• Para hacer válida la garantía, el dispositivo no debe tener sellos rotos',
      '• La garantía es transferible a un nuevo propietario'
    ]
    warrantyTerms.forEach((term, index) => {
      ctx.fillText(term, margin, currentY + (index * 18))
    })
    currentY += warrantyTerms.length * 18 + 30

    // Firma del cliente
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('Firma del cliente:', margin, currentY)
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize - 2}px Arial`
    ctx.fillText('__________________________', margin, currentY + 25)
    ctx.fillText('Fecha: ____/____/______', margin, currentY + 45)
    currentY += 60

    // ORDEN DE SERVICIO - TÉCNICO
    currentY += 10
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(margin, currentY, canvas.width - margin * 2, 30)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${config.fontSize + 2}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText('ORDEN DE SERVICIO - TÉCNICO', canvas.width / 2, currentY + 20)
    currentY += 40

    ctx.textAlign = 'left'
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    
    // Información del técnico
    ctx.fillText('Técnico asignado: Carlos García', margin, currentY)
    ctx.fillText('ID Técnico: TEC-001', margin, currentY + 20)
    ctx.fillText('Fecha de asignación: 22/06/2024', margin, currentY + 40)
    ctx.fillText('Hora de inicio: 09:00 AM', margin, currentY + 60)
    ctx.fillText('Tiempo estimado: 2 horas', margin, currentY + 80)
    ctx.fillText('Prioridad: Normal', margin, currentY + 100)
    currentY += 120

    // Diagnóstico detallado
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('DIAGNÓSTICO', margin, currentY)
    currentY += 20
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    ctx.fillText('Síntoma reportado: Pantalla dañada con líneas verticales', margin, currentY)
    ctx.fillText('Estado de la pantalla: Rota, sin respuesta táctil', margin, currentY + 20)
    ctx.fillText('Pruebas realizadas: Test de pantalla, test táctil', margin, currentY + 40)
    ctx.fillText('Resultado: Pantalla defectuosa, requiere reemplazo', margin, currentY + 60)
    currentY += 80

    // Piezas requeridas
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('PIEZAS REQUERIDAS', margin, currentY)
    currentY += 20
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    ctx.fillText('• Pantalla OLED iPhone 15 Pro Max - Cantidad: 1', margin, currentY)
    ctx.fillText('• Adhesivo de pantalla - Cantidad: 1', margin, currentY + 20)
    ctx.fillText('• Kit de herramientas - Cantidad: 1', margin, currentY + 40)
    currentY += 60

    // Procedimiento
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('PROCEDIMIENTO', margin, currentY)
    currentY += 20
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    const procedures = [
      '1. Apagar dispositivo y retirar protectores',
      '2. Calentar bordes para ablandar adhesivo',
      '3. Retirar pantalla dañada con cuidado',
      '4. Limpiar marco y aplicar nuevo adhesivo',
      '5. Instalar nueva pantalla OLED',
      '6. Realizar pruebas de funcionamiento',
      '7. Verificar calidad de imagen y táctil'
    ]
    procedures.forEach((proc, index) => {
      ctx.fillText(proc, margin, currentY + (index * 18))
    })
    currentY += procedures.length * 18 + 30

    // Observaciones
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('OBSERVACIONES', margin, currentY)
    currentY += 20
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    ctx.fillText('El cliente reportó que el dispositivo se cayó desde 1 metro de altura.', margin, currentY)
    ctx.fillText('No hay evidencia de daño por líquido. Los sellos de seguridad están intactos.', margin, currentY + 20)
    currentY += 40

    // Firma del técnico
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${config.fontSize}px Arial`
    ctx.fillText('Firma del técnico:', margin, currentY)
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize - 2}px Arial`
    ctx.fillText('__________________________', margin, currentY + 25)
    ctx.fillText('Fecha: ____/____/______', margin, currentY + 45)
    currentY += 60

    // Footer
    ctx.fillStyle = '#64748b'
    ctx.font = `${config.fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText(config.footerText, canvas.width / 2, canvas.height - margin)
  }

  const generatePDF = () => {
    setIsGenerating(true)
    const doc = new jsPDF()
    
    let y = config.margin

    // Header
    doc.setFillColor(30, 41, 59)
    doc.rect(config.margin, y, 190 - config.margin * 2, 20, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(config.fontSize + 4)
    doc.setFont(undefined, 'bold')
    doc.text(config.headerText, 105, y + 13, { align: 'center' })
    y += 30

    // Logo
    if (config.showLogo && config.logoPosition === 'center') {
      doc.setFillColor(59, 130, 246)
      doc.circle(105, y + 10, 15, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.text('LOGO', 105, y + 14, { align: 'center' })
      y += 30
    }

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(config.fontSize)

    // ORDEN DE SERVICIO - CLIENTE
    y += 5
    doc.setFillColor(30, 41, 59)
    doc.rect(config.margin, y, 190 - config.margin * 2, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(config.fontSize + 2)
    doc.setFont(undefined, 'bold')
    doc.text('ORDEN DE SERVICIO - CLIENTE', 105, y + 7, { align: 'center' })
    y += 15

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(config.fontSize)
    doc.setFont(undefined, 'normal')
    
    // Información del cliente
    doc.text('N° Orden: #ORD-2024-00123', config.margin, y)
    doc.text('Fecha: 22/06/2024', config.margin, y + 7)
    doc.text('Estado: En proceso', config.margin, y + 14)
    y += 25

    // Información del dispositivo
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('INFORMACIÓN DEL DISPOSITIVO', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Dispositivo: iPhone 15 Pro Max', config.margin, y)
    doc.text('IMEI: 356912087654321', config.margin, y + 7)
    doc.text('Color: Titanium Black', config.margin, y + 14)
    doc.text('Almacenamiento: 256 GB', config.margin, y + 21)
    y += 30

    // Detalles de reparación
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('DETALLES DE REPARACIÓN', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Servicio: Cambio de pantalla', config.margin, y)
    doc.text('Descripción: Pantalla OLED original', config.margin, y + 7)
    y += 18

    // Precios
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('PRECIO', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Servicio: $450.00', config.margin, y)
    doc.text('Piezas: $350.00', config.margin, y + 7)
    doc.text('Mano de obra: $100.00', config.margin, y + 14)
    y += 25

    // Garantía y términos
    doc.setTextColor(5, 150, 105)
    doc.setFont(undefined, 'bold')
    doc.text('GARANTÍA: 90 DÍAS', config.margin, y)
    y += 10
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.setFontSize(config.fontSize - 2)
    const warrantyTerms = [
      'Términos y condiciones de la garantía:',
      '• La garantía cubre defectos de fabricación de la pieza instalada',
      '• No cubre daños por mal uso, caídas o exposición a líquidos',
      '• El cliente debe conservar esta orden como comprobante de garantía',
      '• Para hacer válida la garantía, el dispositivo no debe tener sellos rotos',
      '• La garantía es transferible a un nuevo propietario'
    ]
    warrantyTerms.forEach((term) => {
      doc.text(term, config.margin, y)
      y += 6
    })
    y += 10
    doc.setFontSize(config.fontSize)

    // Firma del cliente
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('Firma del cliente:', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('__________________________', config.margin, y)
    doc.text('Fecha: ____/____/______', config.margin, y + 7)
    y += 20

    // ORDEN DE SERVICIO - TÉCNICO
    y += 5
    doc.setFillColor(30, 41, 59)
    doc.rect(config.margin, y, 190 - config.margin * 2, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(config.fontSize + 2)
    doc.setFont(undefined, 'bold')
    doc.text('ORDEN DE SERVICIO - TÉCNICO', 105, y + 7, { align: 'center' })
    y += 15

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(config.fontSize)
    doc.setFont(undefined, 'normal')
    
    // Información del técnico
    doc.text('Técnico asignado: Carlos García', config.margin, y)
    doc.text('ID Técnico: TEC-001', config.margin, y + 7)
    doc.text('Fecha de asignación: 22/06/2024', config.margin, y + 14)
    doc.text('Hora de inicio: 09:00 AM', config.margin, y + 21)
    doc.text('Tiempo estimado: 2 horas', config.margin, y + 28)
    doc.text('Prioridad: Normal', config.margin, y + 35)
    y += 45

    // Diagnóstico detallado
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('DIAGNÓSTICO', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Síntoma reportado: Pantalla dañada con líneas verticales', config.margin, y)
    doc.text('Estado de la pantalla: Rota, sin respuesta táctil', config.margin, y + 7)
    doc.text('Pruebas realizadas: Test de pantalla, test táctil', config.margin, y + 14)
    doc.text('Resultado: Pantalla defectuosa, requiere reemplazo', config.margin, y + 21)
    y += 30

    // Piezas requeridas
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('PIEZAS REQUERIDAS', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('• Pantalla OLED iPhone 15 Pro Max - Cantidad: 1', config.margin, y)
    doc.text('• Adhesivo de pantalla - Cantidad: 1', config.margin, y + 7)
    doc.text('• Kit de herramientas - Cantidad: 1', config.margin, y + 14)
    y += 25

    // Procedimiento
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('PROCEDIMIENTO', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    const procedures = [
      '1. Apagar dispositivo y retirar protectores',
      '2. Calentar bordes para ablandar adhesivo',
      '3. Retirar pantalla dañada con cuidado',
      '4. Limpiar marco y aplicar nuevo adhesivo',
      '5. Instalar nueva pantalla OLED',
      '6. Realizar pruebas de funcionamiento',
      '7. Verificar calidad de imagen y táctil'
    ]
    procedures.forEach((proc) => {
      doc.text(proc, config.margin, y)
      y += 6
    })
    y += 10

    // Observaciones
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('OBSERVACIONES', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('El cliente reportó que el dispositivo se cayó desde 1 metro de altura.', config.margin, y)
    doc.text('No hay evidencia de daño por líquido. Los sellos de seguridad están intactos.', config.margin, y + 7)
    y += 20

    // Firma del técnico
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('Firma del técnico:', config.margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('__________________________', config.margin, y)
    doc.text('Fecha: ____/____/______', config.margin, y + 7)
    y += 20

    // Footer
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text(config.footerText, 105, 280 - config.margin, { align: 'center' })

    doc.save('orden-servicio.pdf')
    setIsGenerating(false)
  }

  React.useEffect(() => {
    generatePreview()
  }, [config])

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Configuración de PDF</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Personaliza la apariencia y contenido de tus documentos PDF</p>
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
          {/* Logo Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Image size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Configuración de Logo</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Mostrar logo</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showLogo}
                    onChange={(e) => handleConfigChange('showLogo', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Posición del logo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleConfigChange('logoPosition', 'center')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                      config.logoPosition === 'center'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                    }`}
                  >
                    <AlignCenter size={16} />
                    <span className="text-sm">Centrado</span>
                  </button>
                  <button
                    onClick={() => handleConfigChange('logoPosition', 'watermark')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                      config.logoPosition === 'watermark'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
                    }`}
                  >
                    <FileText size={16} />
                    <span className="text-sm">Marca de agua</span>
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* Texto personalizado */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Texto Personalizado</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Texto del encabezado</label>
                <input
                  type="text"
                  value={config.headerText}
                  onChange={(e) => handleConfigChange('headerText', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Texto del pie</label>
                <input
                  type="text"
                  value={config.footerText}
                  onChange={(e) => handleConfigChange('footerText', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Configuración de formato */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Formato</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tamaño de fuente: {config.fontSize}px</label>
                <input
                  type="range"
                  min="8"
                  max="16"
                  value={config.fontSize}
                  onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Margen: {config.margin}px</label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={config.margin}
                  onChange={(e) => handleConfigChange('margin', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vista previa */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Vista Previa</h3>
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
              Vista previa en escala A4. Los cambios se reflejan automáticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => alert('Configuración de PDF guardada')}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
        >
          <Save size={16} />
          Guardar configuración
        </button>
      </div>
    </div>
  )
}
