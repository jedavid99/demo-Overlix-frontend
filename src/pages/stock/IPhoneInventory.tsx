import React, { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  ChevronRight,
  Smartphone,
  Fingerprint,
  ShoppingCart,
  Tag,
  Camera,
  Upload,
  Info,
  Save,
  X,
} from 'lucide-react';

export default function IPhoneInventory() {
  const [formData, setFormData] = useState({
    model: 'iPhone 15 Pro Max',
    storage: '256 GB',
    color: 'Titanium Black',
    condition: 'New',
    imei1: '',
    imei2: '',
    serialNumber: '',
    partNumber: '',
    supplier: 'Apple Inc. Official',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: '',
    retailPrice: '1199.00',
    taxRate: '8.5',
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [autoSaveTime] = useState('14:24');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatedMargin = formData.retailPrice && formData.purchaseCost
    ? (((parseFloat(formData.retailPrice) - parseFloat(formData.purchaseCost)) / parseFloat(formData.retailPrice)) * 100).toFixed(1)
    : '0.0';

  const projectedProfit = formData.retailPrice && formData.purchaseCost
    ? (parseFloat(formData.retailPrice) - parseFloat(formData.purchaseCost)).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Navigation */}
      

      <main className="flex-1 flex justify-center py-8">
        <div className="max-w-5xl flex-1 px-4">
          {/* Breadcrumbs */}
         

          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white">Add iPhone to Inventory</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">Complete the technical and financial specifications for new stock.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700">
                Save as Draft
              </button>
              <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                Confirm & Add to Stock
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Model & Specifications */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Smartphone size={20} />
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-lg font-bold">1. Model & Specifications</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">iPhone Model</label>
                    <select
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>iPhone 15 Pro Max</option>
                      <option>iPhone 15 Pro</option>
                      <option>iPhone 15 Plus</option>
                      <option>iPhone 15</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Storage Capacity</label>
                    <select
                      value={formData.storage}
                      onChange={(e) => handleInputChange('storage', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>128 GB</option>
                      <option>256 GB</option>
                      <option>512 GB</option>
                      <option>1 TB</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Finish / Color</label>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleInputChange('color', 'Titanium Black')}
                        className={`size-8 rounded-full bg-slate-800 border-2 ring-2 transition-all ${
                          formData.color === 'Titanium Black' ? 'border-blue-600 ring-blue-600' : 'border-slate-300 ring-white dark:ring-slate-900'
                        }`}
                        title="Titanium Black"
                      />
                      <button
                        onClick={() => handleInputChange('color', 'Natural Titanium')}
                        className={`size-8 rounded-full bg-slate-200 border-2 transition-all ${
                          formData.color === 'Natural Titanium' ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-300'
                        }`}
                        title="Natural Titanium"
                      />
                      <button
                        onClick={() => handleInputChange('color', 'Blue Titanium')}
                        className={`size-8 rounded-full bg-blue-200 border-2 transition-all ${
                          formData.color === 'Blue Titanium' ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-300'
                        }`}
                        title="Blue Titanium"
                      />
                      <button
                        onClick={() => handleInputChange('color', 'White Titanium')}
                        className={`size-8 rounded-full bg-white border-2 transition-all ${
                          formData.color === 'White Titanium' ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-300'
                        }`}
                        title="White Titanium"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Condition</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleInputChange('condition', 'New')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                          formData.condition === 'New'
                            ? 'border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        New
                      </button>
                      <button
                        onClick={() => handleInputChange('condition', 'Refurbished')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                          formData.condition === 'Refurbished'
                            ? 'border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                            : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Refurbished
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Unique Identification */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Fingerprint size={20} />
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-lg font-bold">2. Unique Identification</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">IMEI 1</label>
                    <input
                      type="text"
                      placeholder="15-digit number"
                      value={formData.imei1}
                      onChange={(e) => handleInputChange('imei1', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">IMEI 2 (Digital/eSIM)</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={formData.imei2}
                      onChange={(e) => handleInputChange('imei2', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Serial Number</label>
                    <input
                      type="text"
                      placeholder="e.g. G6TXXXXXXX"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Part Number (MPN)</label>
                    <input
                      type="text"
                      placeholder="e.g. MU7A3LL/A"
                      value={formData.partNumber}
                      onChange={(e) => handleInputChange('partNumber', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* 3. Sourcing */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <ShoppingCart size={20} />
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-lg font-bold">3. Sourcing</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Supplier</label>
                    <select
                      value={formData.supplier}
                      onChange={(e) => handleInputChange('supplier', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Apple Inc. Official</option>
                      <option>Tech Distribution Co.</option>
                      <option>Global Wholesale</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Purchase Date</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Purchase Cost (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={formData.purchaseCost}
                        onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
                        className="w-full pl-7 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* 4. Retail Info */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Tag size={20} />
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-lg font-bold">4. Retail Info</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Retail Price (SRP)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                      <input
                        type="number"
                        value={formData.retailPrice}
                        onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                        className="w-full pl-7 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tax (%)</label>
                    <input
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', e.target.value)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Profit Projection Card */}
                  <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-medium text-slate-500">Projected Margin</span>
                      <span className="text-xs font-bold text-green-600">+{calculatedMargin}%</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">${projectedProfit}</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(Math.max(parseFloat(calculatedMargin) / 50 * 100, 0), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Media */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Camera size={20} />
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-lg font-bold">5. Media</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
                    <Upload size={32} className="text-slate-400" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Drop high-res photos here</p>
                    <p className="text-xs text-slate-400">PNG, JPG up to 10MB</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group relative overflow-hidden hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
                      <Camera size={24} />
                    </div>
                    <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group relative overflow-hidden hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
                      <Camera size={24} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
                    <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">Ensure IMEI and Serial labels are clearly visible in at least one photo for verification.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center gap-4 pb-12 flex-wrap">
            <span className="text-sm text-slate-500">Last auto-saved at {autoSaveTime}</span>
            <button className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button className="px-10 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-colors">
              Add to Stock
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


