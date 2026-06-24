import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, MapPin, Phone, Mail, Hash, MessageCircle } from 'lucide-react'
export default function ClientAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', phoneCode: '+34', phone: '', email: '', dni: '', address: '', city: '', zip: '', notes: '', whatsapp: true,
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const val = (type === 'checkbox') ? (e.target as HTMLInputElement).checked : value
    setForm({ ...form, [name]: val })
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: persist to backend
    navigate('/clients')
  }
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/clients" className="inline-flex items-center justify-center w-9 h-9 bg-white border rounded-md shadow-sm hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <h2 className="text-2xl font-semibold">Nuevo Registro de Cliente</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><User size={16} /></div>
              <h3 className="font-medium">Datos Personales</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Nombre Completo</label>
                <div className="relative">
                  <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="Ej. Juan Pérez" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-36">
                  <label className="block text-sm text-gray-600 mb-2">Teléfono</label>
                  <select name="phoneCode" value={form.phoneCode} onChange={handleChange} className="w-full px-3 py-3 border rounded-lg bg-gray-50">
                    <option value="+34">ES +34</option>
                    <option value="+54">AR +54</option>
                    <option value="+1">US +1</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-2">&nbsp;</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="000 000 000" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Correo Electrónico</label>
                <input name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="juan@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">DNI / Identificación</label>
                <input name="dni" value={form.dni} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="12345678X" />
              </div>
            </div>
          </section>
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 rounded-full text-indigo-600"><MapPin size={16} /></div>
              <h3 className="font-medium">Dirección y Facturación</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Calle / Dirección</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="Calle Principal 123" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Ciudad</label>
                  <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="Madrid" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Cód. Postal</label>
                  <input name="zip" value={form.zip} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="28001" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Notas de Referencia</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="Piso, puerta, horario de entrega..." rows={4} />
              </div>
            </div>
          </section>
        </div>
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-md text-green-600"><MessageCircle size={18} /></div>
              <div>
                <div className="font-medium">Notificaciones por WhatsApp</div>
                <div className="text-sm text-gray-500">Enviar actualizaciones automáticas del estado de la orden.</div>
              </div>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="whatsapp" checked={!!form.whatsapp} onChange={handleChange as any} className="sr-only" />
                <span className={`w-11 h-6 inline-block rounded-full transition-colors ${form.whatsapp ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="ml-3 text-sm text-gray-600">{form.whatsapp ? 'Activado' : 'Inactivo'}</span>
              </label>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate('/clients')} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded shadow">Guardar y Crear Orden</button>
          </div>
        </div>
      </form>
    </div>
  )
}
