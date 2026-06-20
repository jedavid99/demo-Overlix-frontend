import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Info, Phone, Tag, MapPin, Save } from 'lucide-react'

export default function ProviderAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    businessName: '', taxId: '', website: '', 
    contactName: '', role: '', phone: '', email: '',
    categories: [] as string[], parts: [] as string[],
    address: '', city: '', postal: '', incoterms: '', leadTime: ''
  })

  const handleChange = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/providers')
  }

  const categories = ['Phones', 'PCs / Laptops', 'Consoles', 'Accessories']
  const partOptions = ['LCD & OLED Screens', 'Replacement Batteries', 'Charging Ports', 'Motherboards', 'Internal Cooling Fans', 'Camera Modules', 'Housing / Chassis', 'Thermal Paste / Tools']

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      

      <main className="flex justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Add New Supplier</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Create a new vendor profile to manage procurement and inventory restocks.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Info size={20} /> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Business Name</label>
                  <input value={form.businessName} onChange={e => handleChange('businessName', e.target.value)} placeholder="e.g. Global Tech Solutions" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tax ID / VAT Number</label>
                  <input value={form.taxId} onChange={e => handleChange('taxId', e.target.value)} placeholder="XX-123456789" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Website</label>
                  <input value={form.website} onChange={e => handleChange('website', e.target.value)} placeholder="https://www.supplier.com" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="url" />
                </div>
              </div>
            </div>

            {/* Primary Contact Details */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Phone size={20} /> Primary Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contact Name</label>
                  <input value={form.contactName} onChange={e => handleChange('contactName', e.target.value)} placeholder="John Smith" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role / Position</label>
                  <input value={form.role} onChange={e => handleChange('role', e.target.value)} placeholder="Account Manager" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Direct Phone</label>
                  <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+1 (555) 000-0000" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="tel" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <input value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="john@supplier.com" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="email" />
                </div>
              </div>
            </div>

            {/* Categories & Parts */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Tag size={20} /> Categories & Parts
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Supply Categories</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <input checked={form.categories.includes(cat)} onChange={() => toggleCategory(cat)} className="rounded text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                        <span className="text-sm font-medium">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Specific Parts Supplied</label>
                  <select multiple className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary min-h-[120px]">
                    {partOptions.map(part => (
                      <option key={part} value={part}>{part}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-2 italic">Hold Ctrl (Windows) or Command (Mac) to select multiple items.</p>
                </div>
              </div>
            </div>

            {/* Physical Address & Shipping */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <MapPin size={20} /> Physical Address & Shipping
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Street Address</label>
                  <input value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="123 Supply Lane, Industrial Park" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">City</label>
                  <input value={form.city} onChange={e => handleChange('city', e.target.value)} placeholder="New York" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Postal Code</label>
                  <input value={form.postal} onChange={e => handleChange('postal', e.target.value)} placeholder="10001" className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Shipping Terms (Incoterms)</label>
                  <select value={form.incoterms} onChange={e => handleChange('incoterms', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary">
                    <option>DDP - Delivered Duty Paid</option>
                    <option>EXW - Ex Works</option>
                    <option>FOB - Free On Board</option>
                    <option>CIF - Cost, Insurance and Freight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Default Lead Time</label>
                  <select value={form.leadTime} onChange={e => handleChange('leadTime', e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary">
                    <option>Next Day Delivery</option>
                    <option>2-3 Business Days</option>
                    <option>1 Week</option>
                    <option>2+ Weeks (International)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => navigate('/providers')} className="px-6 h-12 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" type="button">
                Cancel
              </button>
              <button className="px-8 h-12 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 flex items-center gap-2" type="submit">
                <Save size={16} /> Save Supplier
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}


