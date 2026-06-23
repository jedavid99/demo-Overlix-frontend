import React, { useState, useRef } from 'react'
import { FileText, Download, Settings as SettingsIcon, Move, Image, AlignCenter, Eye, Save, RefreshCw } from 'lucide-react'
import jsPDF from 'jspdf'

interface PDFConfig {
  logoPosition: 'center' | 'watermark'
  showLogo: boolean
  showHeader: boolean
  showFooter: boolean
  showCustomerInfo: boolean
  showDeviceInfo: boolean
  showRepairDetails: boolean
  showPricing: boolean
  showWarranty: boolean
  headerText: string
  footerText: string
  fontSize: number
  margin: number
}

const defaultConfig: PDFConfig = {
  logoPosition: 'center',
  showLogo: true,
  showHeader: true,
  showFooter: true,
  showCustomerInfo: true,
  showDeviceInfo: true,
  showRepairDetails: true,
  showPricing: true,
  showWarranty: true,
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
    const y = margin

    // Header
    if (config.showHeader) {
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(margin, y, canvas.width - margin * 2, 40)
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${config.fontSize + 4}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText(config.headerText, canvas.width / 2, y + 25)
    }

    let currentY = config.showHeader ? y + 60 : y + 20

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

    // Customer Info
    if (config.showCustomerInfo) {
      ctx.fillStyle = '#64748b'
      ctx.font = `${config.fontSize}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText('Cliente: Juan Pérez', margin, currentY)
      ctx.fillText('Tel: +54 11 1234-5678', margin, currentY + 20)
      currentY += 40
    }

    // Device Info
    if (config.showDeviceInfo) {
      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${config.fontSize}px Arial`
      ctx.fillText('Dispositivo: iPhone 15 Pro Max', margin, currentY)
      ctx.fillStyle = '#64748b'
      ctx.font = `${config.fontSize}px Arial`
      ctx.fillText('IMEI: 356912087654321', margin, currentY + 20)
      currentY += 40
    }

    // Repair Details
    if (config.showRepairDetails) {
      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${config.fontSize}px Arial`
      ctx.fillText('Reparación: Cambio de pantalla', margin, currentY)
      ctx.fillStyle = '#64748b'
      ctx.font = `${config.fontSize}px Arial`
      ctx.fillText('Descripción: Pantalla OLED original', margin, currentY + 20)
      currentY += 40
    }

    // Pricing
    if (config.showPricing) {
      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${config.fontSize}px Arial`
      ctx.fillText('Total: $450.00', margin, currentY)
      currentY += 30
    }

    // Warranty
    if (config.showWarranty) {
      ctx.fillStyle = '#059669'
      ctx.font = `${config.fontSize}px Arial`
      ctx.fillText('Garantía: 90 días', margin, currentY)
      currentY += 30
    }

    // Footer
    if (config.showFooter) {
      ctx.fillStyle = '#64748b'
      ctx.font = `${config.fontSize}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText(config.footerText, canvas.width / 2, canvas.height - margin)
    }
  }

  const generatePDF = () => {
    setIsGenerating(true)
    const doc = new jsPDF()
    
    // Header
    if (config.showHeader) {
      doc.setFillColor(30, 41, 59)
      doc.rect(config.margin, config.margin, 190 - config.margin * 2, 20, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(config.fontSize + 4)
      doc.text(config.headerText, 105, config.margin + 13, { align: 'center' })
    }

    let y = config.showHeader ? config.margin + 35 : config.margin + 15

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

    // Customer Info
    if (config.showCustomerInfo) {
      doc.setTextColor(100, 116, 139)
      doc.text('Cliente: Juan Pérez', config.margin, y)
      doc.text('Tel: +54 11 1234-5678', config.margin, y + 8)
      y += 20
    }

    // Device Info
    if (config.showDeviceInfo) {
      doc.setTextColor(30, 41, 59)
      doc.setFont(undefined, 'bold')
      doc.text('Dispositivo: iPhone 15 Pro Max', config.margin, y)
      doc.setFont(undefined, 'normal')
      doc.setTextColor(100, 116, 139)
      doc.text('IMEI: 356912087654321', config.margin, y + 8)
      y += 20
    }

    // Repair Details
    if (config.showRepairDetails) {
      doc.setTextColor(30, 41, 59)
      doc.setFont(undefined, 'bold')
      doc.text('Reparación: Cambio de pantalla', config.margin, y)
      doc.setFont(undefined, 'normal')
      doc.setTextColor(100, 116, 139)
      doc.text('Descripción: Pantalla OLED original', config.margin, y + 8)
      y += 20
    }

    // Pricing
    if (config.showPricing) {
      doc.setTextColor(30, 41, 59)
      doc.setFont(undefined, 'bold')
      doc.text('Total: $450.00', config.margin, y)
      y += 15
    }

    // Warranty
    if (config.showWarranty) {
      doc.setTextColor(5, 150, 105)
      doc.setFont(undefined, 'normal')
      doc.text('Garantía: 90 días', config.margin, y)
      y += 15
    }

    // Footer
    if (config.showFooter) {
      doc.setTextColor(100, 116, 139)
      doc.text(config.footerText, 105, 280 - config.margin, { align: 'center' })
    }

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

          {/* Secciones del PDF */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Secciones del PDF</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'showHeader', label: 'Encabezado' },
                { key: 'showFooter', label: 'Pie de página' },
                { key: 'showCustomerInfo', label: 'Información del cliente' },
                { key: 'showDeviceInfo', label: 'Información del dispositivo' },
                { key: 'showRepairDetails', label: 'Detalles de reparación' },
                { key: 'showPricing', label: 'Precios' },
                { key: 'showWarranty', label: 'Garantía' },
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
