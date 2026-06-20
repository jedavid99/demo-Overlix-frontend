import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, Package, DollarSign, Settings, Image, ChevronRight, Save, Trash2, X, CheckCircle, Cloud, Plus } from 'lucide-react'

export default function StockAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    itemName: '',
    sku: '',
    category: '',
    brand: '',
    initialQuantity: '',
    minStockLevel: '',
    storageLocation: '',
    purchaseCost: '',
    sellingPrice: '',
    tax: '',
  })

  const [compatibility, setCompatibility] = useState<string[]>(['iPhone 13', 'iPhone 13 Pro'])
  const [compatibilityInput, setCompatibilityInput] = useState('')

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const addCompatibility = (device: string) => {
    const newDevice = device || compatibilityInput
    if (newDevice && !compatibility.includes(newDevice)) {
      setCompatibility([...compatibility, newDevice])
      setCompatibilityInput('')
    }
  }

  const removeCompatibility = (device: string) => {
    setCompatibility(compatibility.filter(d => d !== device))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCompatibility(compatibilityInput)
    }
  }

  const handleSubmit = (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault()
    // TODO: persist data
    navigate('/stock')
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      

      {/* Main Content */}
      <main className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
        <div className="flex flex-col max-w-[960px] flex-1 w-full">
          {/* Breadcrumbs & Title */}
          <div className="flex flex-col gap-2 mb-8">
            
            <div className="flex justify-between items-end mt-4">
              <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Add New Stock Item</h1>
                <p className="text-slate-500 mt-2">Specify technical details, pricing, and compatibility for the new part.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/stock')}
                  className="px-6 py-2.5 rounded-lg font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={e => handleSubmit(e, false)}
                  className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={e => handleSubmit(e, false)} className="space-y-12 pb-20">
            {/* Section 1: General Info */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Info size={20} className="text-primary" />
                <h2 className="text-slate-900 dark:text-white text-xl font-bold">General Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Item Name</span>
                  <input
                    value={form.itemName}
                    onChange={e => handleChange('itemName', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4"
                    placeholder="e.g. iPhone 13 OLED Display"
                    type="text"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">SKU</span>
                  <input
                    value={form.sku}
                    onChange={e => handleChange('sku', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4"
                    placeholder="SCRN-IP13-OLED-01"
                    type="text"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Category</span>
                  <select
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4"
                  >
                    <option>Select Category</option>
                    <option>Screens</option>
                    <option>Batteries</option>
                    <option>Charging Ports</option>
                    <option>Mainboards</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Brand</span>
                  <input
                    value={form.brand}
                    onChange={e => handleChange('brand', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4"
                    placeholder="e.g. Apple OEM"
                    type="text"
                  />
                </label>
              </div>
            </section>

            {/* Section 2: Inventory Details */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Package size={20} className="text-primary" />
                <h2 className="text-slate-900 dark:text-white text-xl font-bold">Inventory Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Initial Quantity</span>
                  <input
                    value={form.initialQuantity}
                    onChange={e => handleChange('initialQuantity', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-12 px-4"
                    placeholder="0"
                    type="number"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Min Stock Level (Alerts)</span>
                  <input
                    value={form.minStockLevel}
                    onChange={e => handleChange('minStockLevel', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-12 px-4"
                    placeholder="5"
                    type="number"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Storage Location / Shelf</span>
                  <input
                    value={form.storageLocation}
                    onChange={e => handleChange('storageLocation', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-12 px-4"
                    placeholder="Shelf A-12"
                    type="text"
                  />
                </label>
              </div>
            </section>

            {/* Section 3: Pricing */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <DollarSign size={20} className="text-primary" />
                <h2 className="text-slate-900 dark:text-white text-xl font-bold">Pricing</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Purchase Cost ($)</span>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">$</span>
                    <input
                      value={form.purchaseCost}
                      onChange={e => handleChange('purchaseCost', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-12 pl-8 pr-4"
                      placeholder="0.00"
                      type="text"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Selling Price ($)</span>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">$</span>
                    <input
                      value={form.sellingPrice}
                      onChange={e => handleChange('sellingPrice', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-12 pl-8 pr-4"
                      placeholder="0.00"
                      type="text"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Tax (%)</span>
                  <div className="relative">
                    <input
                      value={form.tax}
                      onChange={e => handleChange('tax', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-12 pl-4 pr-8"
                      placeholder="0"
                      type="text"
                    />
                    <span className="absolute right-3 top-3 text-slate-500">%</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Section 4: Compatibility Tags */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Settings size={20} className="text-primary" />
                <h2 className="text-slate-900 dark:text-white text-xl font-bold">Compatibility</h2>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-slate-500 text-sm">Add devices this part is compatible with:</p>
                <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                  {compatibility.map(device => (
                    <span key={device} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-semibold">
                      {device}
                      <button
                        type="button"
                        onClick={() => removeCompatibility(device)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center ml-2">
                    <input
                      value={compatibilityInput}
                      onChange={e => setCompatibilityInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 p-0 outline-none"
                      placeholder="Type and press Enter..."
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addCompatibility('iPhone 14')}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-primary/20 hover:text-primary transition-all flex items-center gap-1"
                  >
                    <Plus size={14} /> Add iPhone 14
                  </button>
                  <button
                    type="button"
                    onClick={() => addCompatibility('PS5')}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-primary/20 hover:text-primary transition-all flex items-center gap-1"
                  >
                    <Plus size={14} /> Add PS5
                  </button>
                  <button
                    type="button"
                    onClick={() => addCompatibility('Nintendo Switch')}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-primary/20 hover:text-primary transition-all flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Nintendo Switch
                  </button>
                </div>
              </div>
            </section>

            {/* Section 5: Media Upload */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Image size={20} className="text-primary" />
                <h2 className="text-slate-900 dark:text-white text-xl font-bold">Item Media</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="group relative aspect-video w-full rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-all">
                  <Cloud size={48} className="text-slate-300 group-hover:text-primary mb-2 transition-colors" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Click or drag photo here</p>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 10MB</p>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Image Guidelines:</h3>
                  <ul className="text-sm space-y-2 text-slate-500">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      Clear, high-resolution photo on white background.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      Show all connectors and cables clearly.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      Include packaging if specific serials are visible.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                Discard Draft
              </button>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={e => handleSubmit(e, true)}
                  className="px-8 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all flex items-center gap-2"
                >
                  <Save size={18} />
                  Save and Publish Item
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}


