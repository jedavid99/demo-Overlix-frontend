import React, { useState, useRef } from 'react'
import { FileText, Download, Settings as SettingsIcon, Move, Image, AlignCenter, Eye, Save, RefreshCw, User, Wrench, Calendar, Clock, CheckCircle, FileSignature } from 'lucide-react'
import jsPDF from 'jspdf'

interface PDFConfig {
  showLogo: boolean
  footerText: string
  warrantyTerms: string[]
}

const defaultConfig: PDFConfig = {
  showLogo: true,
  footerText: 'Gracias por su confianza',
  warrantyTerms: [
    '• La garantía cubre defectos de fabricación de la pieza instalada',
    '• No cubre daños por mal uso, caídas o exposición a líquidos',
    '• El cliente debe conservar esta orden como comprobante de garantía',
    '• Para hacer válida la garantía, el dispositivo no debe tener sellos rotos',
    '• La garantía es transferible a un nuevo propietario'
  ],
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

    const margin = 20
    const fontSize = 11
    let currentY = margin

    // Logo (siempre marca de agua)
    if (config.showLogo) {
      ctx.globalAlpha = 0.08
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    // Header fijo
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(margin, currentY, canvas.width - margin * 2, 35)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${fontSize + 3}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText('ORDEN DE SERVICIO', canvas.width / 2, currentY + 22)
    currentY += 50

    // Layout optimizado: Información del cliente y dispositivo en columnas
    ctx.textAlign = 'left'
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    
    // Columna izquierda - Cliente
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('INFORMACIÓN DEL CLIENTE', margin, currentY)
    currentY += 18
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('N° Orden: #ORD-2024-00123', margin, currentY)
    ctx.fillText('Fecha: 22/06/2024', margin, currentY + 16)
    ctx.fillText('Estado: En proceso', margin, currentY + 32)
    ctx.fillText('Cliente: Juan Pérez', margin, currentY + 48)
    ctx.fillText('Tel: +54 11 1234-5678', margin, currentY + 64)
    currentY += 80

    // Columna derecha - Dispositivo
    const rightColumnX = canvas.width / 2 + 20
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('INFORMACIÓN DEL DISPOSITIVO', rightColumnX, currentY - 62)
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('iPhone 15 Pro Max', rightColumnX, currentY - 44)
    ctx.fillText('IMEI: 356912087654321', rightColumnX, currentY - 28)
    ctx.fillText('Color: Titanium Black', rightColumnX, currentY - 12)
    ctx.fillText('Almacenamiento: 256 GB', rightColumnX, currentY + 4)

    // Detalles de reparación
    currentY += 10
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('DETALLES DE REPARACIÓN', margin, currentY)
    currentY += 18
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('Servicio: Cambio de pantalla', margin, currentY)
    ctx.fillText('Descripción: Pantalla OLED original', margin, currentY + 16)
    currentY += 40

    // Precios en línea
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('PRECIO: ', margin, currentY)
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('Servicio: $450.00 | Piezas: $350.00 | Mano de obra: $100.00', margin + 50, currentY)
    currentY += 30

    // Garantía y términos modificables
    ctx.fillStyle = '#059669'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('GARANTÍA: 90 DÍAS', margin, currentY)
    currentY += 20
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize - 1}px Arial`
    ctx.fillText('Términos y condiciones:', margin, currentY)
    currentY += 16
    config.warrantyTerms.forEach((term, index) => {
      ctx.fillText(term, margin, currentY + (index * 14))
    })
    currentY += config.warrantyTerms.length * 14 + 20

    // Firma del cliente
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('Firma del cliente: ______________________  Fecha: ____/____/______', margin, currentY)
    currentY += 30

    // ORDEN DE SERVICIO - TÉCNICO
    currentY += 10
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(margin, currentY, canvas.width - margin * 2, 25)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${fontSize + 2}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText('ORDEN DE SERVICIO - TÉCNICO', canvas.width / 2, currentY + 17)
    currentY += 35

    ctx.textAlign = 'left'
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    
    // Información del técnico en columnas
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('TÉCNICO ASIGNADO', margin, currentY)
    currentY += 18
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('Nombre: Carlos García', margin, currentY)
    ctx.fillText('ID: TEC-001', margin, currentY + 16)
    ctx.fillText('Fecha: 22/06/2024 | Hora: 09:00 AM', margin, currentY + 32)
    ctx.fillText('Tiempo estimado: 2 horas | Prioridad: Normal', margin, currentY + 48)
    currentY += 65

    // Columna derecha - Estado del trabajo
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('ESTADO DEL TRABAJO', rightColumnX, currentY - 47)
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('Estado actual: En progreso', rightColumnX, currentY - 29)
    ctx.fillText('Progreso: 0% completado', rightColumnX, currentY - 13)
    ctx.fillText('Fecha estimada entrega: 22/06/2024', rightColumnX, currentY + 3)
    ctx.fillText('Hora estimada entrega: 11:00 AM', rightColumnX, currentY + 19)

    // Diagnóstico detallado
    currentY += 10
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('DIAGNÓSTICO DETALLADO', margin, currentY)
    currentY += 18
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('Síntoma: Pantalla dañada con líneas verticales', margin, currentY)
    ctx.fillText('Estado: Rota, sin respuesta táctil', margin, currentY + 16)
    ctx.fillText('Pruebas: Test de pantalla, test táctil, test de sensores', margin, currentY + 32)
    ctx.fillText('Resultado: Pantalla defectuosa, requiere reemplazo completo', margin, currentY + 48)
    currentY += 65

    // Piezas requeridas
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('PIEZAS Y HERRAMIENTAS', margin, currentY)
    currentY += 18
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('• Pantalla OLED iPhone 15 Pro Max (x1)', margin, currentY)
    ctx.fillText('• Adhesivo de pantalla premium (x1)', margin, currentY + 16)
    ctx.fillText('• Kit de herramientas especializado (x1)', margin, currentY + 32)
    ctx.fillText('• Guantes antiestáticos (x1 par)', margin, currentY + 48)
    currentY += 65

    // Procedimiento compacto
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('PROCEDIMIENTO', margin, currentY)
    currentY += 18
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    const procedures = [
      '1. Apagar dispositivo y retirar protectores',
      '2. Calentar bordes (80°C) para ablandar adhesivo',
      '3. Retirar pantalla con herramienta de succión',
      '4. Limpiar marco y aplicar nuevo adhesivo',
      '5. Instalar nueva pantalla OLED con cuidado',
      '6. Conectar flex cables y realizar pruebas',
      '7. Verificar calidad de imagen, táctil y sensores'
    ]
    procedures.forEach((proc, index) => {
      ctx.fillText(proc, margin, currentY + (index * 14))
    })
    currentY += procedures.length * 14 + 20

    // Observaciones
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('OBSERVACIONES', margin, currentY)
    currentY += 18
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.fillText('• Cliente reportó caída desde 1m de altura', margin, currentY)
    ctx.fillText('• No hay evidencia de daño por líquido', margin, currentY + 16)
    ctx.fillText('• Sellos de seguridad intactos', margin, currentY + 32)
    ctx.fillText('• Batería en buen estado (95% capacidad)', margin, currentY + 48)
    currentY += 65

    // Firma del técnico
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${fontSize}px Arial`
    ctx.fillText('Firma del técnico: ______________________  Fecha: ____/____/______', margin, currentY)
    currentY += 30

    // Footer
    ctx.fillStyle = '#64748b'
    ctx.font = `${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText(config.footerText, canvas.width / 2, canvas.height - margin)
  }

  const generatePDF = () => {
    setIsGenerating(true)
    const doc = new jsPDF()
    
    const margin = 20
    const fontSize = 11
    let y = margin

    // Logo (siempre marca de agua)
    if (config.showLogo) {
      doc.setFillColor(59, 130, 246)
      doc.setGState(new doc.GState({ opacity: 0.08 }))
      doc.circle(105, 150, 50, 'F')
      doc.setGState(new doc.GState({ opacity: 1 }))
    }

    // Header fijo
    doc.setFillColor(30, 41, 59)
    doc.rect(margin, y, 170, 15, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(fontSize + 3)
    doc.setFont(undefined, 'bold')
    doc.text('ORDEN DE SERVICIO', 105, y + 10, { align: 'center' })
    y += 25

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(fontSize)
    doc.setFont(undefined, 'normal')

    // Layout optimizado: Información del cliente y dispositivo en columnas
    // Columna izquierda - Cliente
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('INFORMACIÓN DEL CLIENTE', margin, y)
    y += 7
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('N° Orden: #ORD-2024-00123', margin, y)
    doc.text('Fecha: 22/06/2024', margin, y + 6)
    doc.text('Estado: En proceso', margin, y + 12)
    doc.text('Cliente: Juan Pérez', margin, y + 18)
    doc.text('Tel: +54 11 1234-5678', margin, y + 24)
    y += 32

    // Columna derecha - Dispositivo
    const rightColumnX = 105
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('INFORMACIÓN DEL DISPOSITIVO', rightColumnX, y - 25)
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('iPhone 15 Pro Max', rightColumnX, y - 18)
    doc.text('IMEI: 356912087654321', rightColumnX, y - 11)
    doc.text('Color: Titanium Black', rightColumnX, y - 4)
    doc.text('Almacenamiento: 256 GB', rightColumnX, y + 3)

    // Detalles de reparación
    y += 5
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('DETALLES DE REPARACIÓN', margin, y)
    y += 7
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Servicio: Cambio de pantalla', margin, y)
    doc.text('Descripción: Pantalla OLED original', margin, y + 6)
    y += 16

    // Precios en línea
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('PRECIO: ', margin, y)
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Servicio: $450.00 | Piezas: $350.00 | Mano de obra: $100.00', margin + 15, y)
    y += 12

    // Garantía y términos modificables
    doc.setTextColor(5, 150, 105)
    doc.setFont(undefined, 'bold')
    doc.text('GARANTÍA: 90 DÍAS', margin, y)
    y += 8
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.setFontSize(fontSize - 1)
    doc.text('Términos y condiciones:', margin, y)
    y += 6
    config.warrantyTerms.forEach((term) => {
      doc.text(term, margin, y)
      y += 5
    })
    y += 8
    doc.setFontSize(fontSize)

    // Firma del cliente
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('Firma del cliente: ______________________  Fecha: ____/____/______', margin, y)
    y += 12

    // ORDEN DE SERVICIO - TÉCNICO
    y += 5
    doc.setFillColor(30, 41, 59)
    doc.rect(margin, y, 170, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(fontSize + 2)
    doc.setFont(undefined, 'bold')
    doc.text('ORDEN DE SERVICIO - TÉCNICO', 105, y + 7, { align: 'center' })
    y += 15

    doc.setTextColor(100, 116, 139)
    doc.setFontSize(fontSize)
    doc.setFont(undefined, 'normal')
    
    // Información del técnico en columnas
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('TÉCNICO ASIGNADO', margin, y)
    y += 7
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Nombre: Carlos García', margin, y)
    doc.text('ID: TEC-001', margin, y + 6)
    doc.text('Fecha: 22/06/2024 | Hora: 09:00 AM', margin, y + 12)
    doc.text('Tiempo estimado: 2 horas | Prioridad: Normal', margin, y + 18)
    y += 26

    // Columna derecha - Estado del trabajo
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('ESTADO DEL TRABAJO', rightColumnX, y - 19)
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Estado actual: En progreso', rightColumnX, y - 12)
    doc.text('Progreso: 0% completado', rightColumnX, y - 5)
    doc.text('Fecha estimada entrega: 22/06/2024', rightColumnX, y + 2)
    doc.text('Hora estimada entrega: 11:00 AM', rightColumnX, y + 9)

    // Diagnóstico detallado
    y += 5
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('DIAGNÓSTICO DETALLADO', margin, y)
    y += 7
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('Síntoma: Pantalla dañada con líneas verticales', margin, y)
    doc.text('Estado: Rota, sin respuesta táctil', margin, y + 6)
    doc.text('Pruebas: Test de pantalla, test táctil, test de sensores', margin, y + 12)
    doc.text('Resultado: Pantalla defectuosa, requiere reemplazo completo', margin, y + 18)
    y += 26

    // Piezas requeridas
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('PIEZAS Y HERRAMIENTAS', margin, y)
    y += 7
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('• Pantalla OLED iPhone 15 Pro Max (x1)', margin, y)
    doc.text('• Adhesivo de pantalla premium (x1)', margin, y + 6)
    doc.text('• Kit de herramientas especializado (x1)', margin, y + 12)
    doc.text('• Guantes antiestáticos (x1 par)', margin, y + 18)
    y += 26

    // Procedimiento compacto
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('PROCEDIMIENTO', margin, y)
    y += 7
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    const procedures = [
      '1. Apagar dispositivo y retirar protectores',
      '2. Calentar bordes (80°C) para ablandar adhesivo',
      '3. Retirar pantalla con herramienta de succión',
      '4. Limpiar marco y aplicar nuevo adhesivo',
      '5. Instalar nueva pantalla OLED con cuidado',
      '6. Conectar flex cables y realizar pruebas',
      '7. Verificar calidad de imagen, táctil y sensores'
    ]
    procedures.forEach((proc) => {
      doc.text(proc, margin, y)
      y += 5
    })
    y += 8

    // Observaciones
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('OBSERVACIONES', margin, y)
    y += 7
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text('• Cliente reportó caída desde 1m de altura', margin, y)
    doc.text('• No hay evidencia de daño por líquido', margin, y + 6)
    doc.text('• Sellos de seguridad intactos', margin, y + 12)
    doc.text('• Batería en buen estado (95% capacidad)', margin, y + 18)
    y += 26

    // Firma del técnico
    doc.setTextColor(30, 41, 59)
    doc.setFont(undefined, 'bold')
    doc.text('Firma del técnico: ______________________  Fecha: ____/____/______', margin, y)
    y += 12

    // Footer
    doc.setTextColor(100, 116, 139)
    doc.setFont(undefined, 'normal')
    doc.text(config.footerText, 105, 280 - margin, { align: 'center' })

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
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Mostrar logo (marca de agua)</span>
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
          </div>


          {/* Texto personalizado */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Texto Personalizado</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Texto del pie de página</label>
              <input
                type="text"
                value={config.footerText}
                onChange={(e) => handleConfigChange('footerText', e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Términos y condiciones de garantía */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileSignature size={18} className="text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Términos y Condiciones de Garantía</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Términos (un término por línea)</label>
              <textarea
                value={config.warrantyTerms.join('\n')}
                onChange={(e) => handleConfigChange('warrantyTerms', e.target.value.split('\n').filter(t => t.trim()))}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white resize-y"
                rows={6}
                placeholder="• La garantía cubre defectos de fabricación\n• No cubre daños por mal uso\n• El cliente debe conservar esta orden"
              />
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
