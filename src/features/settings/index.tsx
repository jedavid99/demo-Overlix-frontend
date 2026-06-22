import React, { useState } from 'react'
import { Plus, Cloud, Clock, Bell, Key, Smartphone, Laptop, Monitor, Gamepad2, Edit, Trash2, ChevronDown, Info, DollarSign, ChevronRight, Building2, AlertCircle, CheckCircle2, Ticket, Eye, RotateCcw, CreditCard } from 'lucide-react'
import { MdContentCopy, MdDelete, MdLink, MdEdit, MdCalendarToday, MdEmail, MdBarChart } from 'react-icons/md'

const sections = [
  { id: 'general', label: 'General', icon: <Cloud size={16} /> },
  { id: 'business', label: 'Business Info', icon: <Clock size={16} /> },
  { id: 'categories', label: 'Repair Categories', icon: <Plus size={16} /> },
  { id: 'taxes', label: 'Taxes & Payments', icon: <Key size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'api', label: 'API & Integrations', icon: <Cloud size={16} /> },
]

function LeftNav({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <aside className="w-64 pr-6 hidden lg:block">
      <div className="sticky top-6 space-y-4">
        <div className="text-sm font-semibold text-slate-700">SETTINGS</div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm divide-y">
          <div className="p-3">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => onChange(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${current === s.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}>
                <div className="text-slate-400">{s.icon}</div>
                <div className="flex-1">{s.label}</div>
              </button>
            ))}
          </div>
          <div className="p-3">
            <div className="rounded bg-blue-50 p-3 text-sm text-blue-600">PRO PLAN<br/><span className="text-xs text-slate-500">You are using 45% of your storage</span></div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function Settings() {
  const [section, setSection] = useState('general')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        <LeftNav current={section} onChange={setSection} />

        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{sections.find(s => s.id === section)?.label}</h1>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-white shadow text-slate-700">Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save All Changes</button>
            </div>
          </div>

          {/* Sections */}
          {section === 'general' && (
            <div className="space-y-6 pb-24">
              {/* Business Profile */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Business Profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Psddy of your repair shop</p>
                  </div>
                  <Info size={18} className="text-slate-400 cursor-help" />
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Business Name</label>
                      <input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" type="text" defaultValue="ProTech Solutions" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Business Address</label>
                      <textarea className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" rows={3} defaultValue={`123 Tech Avenue, Silicon Valley, CA 94025, United States`} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 bg-slate-50 dark:bg-slate-800/50">
                    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <Cloud className="text-primary text-3xl" />
                    </div>
                    <p className="text-sm font-bold mb-1">Upload Business Logo</p>
                    <p className="text-xs text-slate-500 text-center">PNG, JPG or SVG up to 10MB. Recommended 512x512px.</p>
                    <button className="mt-4 px-4 py-2 text-xs font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-all">Select File</button>
                  </div>
                </div>
              </section>

              {/* System Preferences */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">System Preferences</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Localization and regional formatting</p>
                  </div>
                  <Info size={18} className="text-slate-400" />
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date Format</label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Timezone</label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white">
                      <option>(UTC-08:00) Pacific Time</option>
                      <option>(UTC+00:00) London</option>
                      <option>(UTC+01:00) Paris</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Repair Statuses */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Repair Statuses</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Define your custom repair lifecycle</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
                    <Plus size={14} /> Add Status
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg group">
                      <span className="size-2 rounded-full bg-blue-500"></span>
                      <span className="text-sm font-medium">Diagnosing</span>
                      <button className="material-symbols-outlined text-[14px] text-slate-400 ml-2">✕</button>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg group">
                      <span className="size-2 rounded-full bg-amber-500"></span>
                      <span className="text-sm font-medium">Awaiting Parts</span>
                      <button className="material-symbols-outlined text-[14px] text-slate-400 ml-2">✕</button>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg group">
                      <span className="size-2 rounded-full bg-purple-500"></span>
                      <span className="text-sm font-medium">Awaiting Approval</span>
                      <button className="material-symbols-outlined text-[14px] text-slate-400 ml-2">✕</button>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg group">
                      <span className="size-2 rounded-full bg-indigo-500"></span>
                      <span className="text-sm font-medium">In Repair</span>
                      <button className="material-symbols-outlined text-[14px] text-slate-400 ml-2">✕</button>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg group">
                      <span className="size-2 rounded-full bg-green-500"></span>
                      <span className="text-sm font-medium">Ready for Pickup</span>
                      <button className="material-symbols-outlined text-[14px] text-slate-400 ml-2">✕</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Methods */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Accepted Payment Methods</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Toggle which payment options are available during checkout</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                        <DollarSign className="text-slate-600 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold">Cash</p>
                        <p className="text-xs text-slate-500">Standard over-the-counter cash payments</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                        <CreditCard className="text-slate-600 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold">Credit/Debit Card</p>
                        <p className="text-xs text-slate-500">Visa, Mastercard, AMEX via integrated terminal</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                        <Building2 className="text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold">Bank Transfer</p>
                        <p className="text-xs text-slate-500">Invoiced payments for corporate clients</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}
          {section === 'business' && (
            <div className="space-y-6">
              {/* Legal Information Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Legal Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Official business registration details</p>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Legal Entity Name</label>
                    <input 
                      type="text" 
                      defaultValue="ProTech Solutions LLC"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tax ID / VAT Number</label>
                    <input 
                      type="text" 
                      defaultValue="US-987654321"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue="+1 (555) 012-3456"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Business Email</label>
                    <input 
                      type="email" 
                      defaultValue="contact@protech-repair.com"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Website</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm">
                        https://
                      </span>
                      <input 
                        type="text" 
                        defaultValue="www.protech-repair.com"
                        className="flex-1 rounded-r-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating Hours Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Operating Hours</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Set your shop opening and closing times</p>
                  </div>
                  <div className="text-xs text-slate-400 italic">Auto-calculated: 48 hrs/week</div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                      <div className="col-span-3">Day of the Week</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-3 text-center">Opening Time</div>
                      <div className="col-span-3 text-center">Closing Time</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Days of the Week */}
                    {[
                      { day: 'Monday', isOpen: true },
                      { day: 'Tuesday', isOpen: true },
                      { day: 'Wednesday', isOpen: true },
                      { day: 'Thursday', isOpen: true },
                      { day: 'Friday', isOpen: true },
                      { day: 'Saturday', isOpen: false },
                      { day: 'Sunday', isOpen: false }
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg transition-colors ${
                          item.isOpen 
                            ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50' 
                            : 'bg-slate-50 dark:bg-slate-800/30'
                        }`}
                      >
                        <div className="col-span-3 font-semibold text-slate-900 dark:text-white">
                          {item.day}
                        </div>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.isOpen
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                          }`}>
                            {item.isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                        <div className="col-span-3">
                          <input 
                            type="time" 
                            defaultValue="09:00"
                            disabled={!item.isOpen}
                            className={`w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${
                              !item.isOpen ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                        </div>
                        <div className="col-span-3">
                          <input 
                            type="time" 
                            defaultValue={item.day === 'Saturday' || item.day === 'Sunday' ? '14:00' : '18:00'}
                            disabled={!item.isOpen}
                            className={`w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${
                              !item.isOpen ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          {item.isOpen ? (
                            <button className="text-slate-400 hover:text-red-500 transition-colors">🚫</button>
                          ) : (
                            <button className="text-primary hover:underline text-xs font-bold">ENABLE</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'categories' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Repair Categories</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Manage device types and supported brands for your repair services.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                  <Plus size={18} />
                  Add New Category
                </button>
              </div>

              {/* Categories List */}
              <div className="space-y-4">
                {[
                  { name: 'Smartphones', icon: Smartphone, color: 'blue', brands: ['Apple', 'Samsung', 'Google'], description: '6 Brands supported • 42 common models', isExpanded: true },
                  { name: 'Laptops', icon: Laptop, color: 'purple', brands: [], description: '4 Brands supported • 24 common models', isExpanded: false },
                  { name: 'Desktops', icon: Monitor, color: 'amber', brands: [], description: 'Custom Builds & Major OEMs', isExpanded: false },
                  { name: 'Consoles', icon: Gamepad2, color: 'green', brands: [], description: 'Sony, Microsoft, Nintendo', isExpanded: false },
                ].map((category, idx) => {
                  const IconComponent = category.icon
                  const colorClasses = {
                    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
                    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
                    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
                    green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
                  }
                  
                  return (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                      <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`size-12 ${colorClasses[category.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center`}>
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{category.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                              <Edit size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <ChevronDown size={18} className="text-slate-400" />
                        </div>
                      </div>
                      
                      {/* Expanded View - Only for first category */}
                      {category.isExpanded && (
                        <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="grid grid-cols-4 gap-4 mt-4">
                            {category.brands.length > 0 && category.brands.map((brand, bIdx) => (
                              <div key={bIdx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center text-center hover:border-primary/30 transition-all">
                                <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center mb-2 shadow-sm">
                                  <span className="text-xs font-bold text-primary">{brand.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{brand}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{bIdx === 0 ? '12 Models' : bIdx === 1 ? '18 Models' : '6 Models'}</span>
                              </div>
                            ))}
                            {category.brands.length > 0 && (
                              <button className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
                                <Plus size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Add Brand</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Summary Card */}
              <div className="mt-6 p-6 bg-slate-900 dark:bg-slate-800 rounded-2xl text-white flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Categories</p>
                    <p className="text-2xl font-black">04</p>
                  </div>
                  <div className="h-10 w-px bg-slate-700"></div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Supported Brands</p>
                    <p className="text-2xl font-black">18</p>
                  </div>
                  <div className="h-10 w-px bg-slate-700"></div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Models</p>
                    <p className="text-2xl font-black">124</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <Info size={18} className="text-primary flex-shrink-0" />
                  <p className="text-sm text-slate-300 max-w-xs">Define exactly what devices your system accepts to streamline the intake process.</p>
                </div>
              </div>
            </div>
          )}

          {section === 'taxes' && (
            <div className="space-y-6 pb-24">
              {/* Tax Configuration Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tax Configuration</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Global tax settings applied to orders</p>
                  </div>
                  <Info size={18} className="text-slate-400 cursor-help" />
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tax Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. VAT, IVA, Sales Tax"
                      defaultValue="VAT"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Global Tax Rate (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.01"
                        defaultValue="20.00"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 pr-10 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Settings Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Invoice Settings</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Customize the appearance and numbering of your invoices</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Custom Invoice Prefix</label>
                      <input 
                        type="text" 
                        defaultValue="INV-"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Starting Number</label>
                      <input 
                        type="number" 
                        defaultValue="1001"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Invoice Footer Text</label>
                    <textarea 
                      rows={3}
                      defaultValue="Thank you for choosing ProTech Solutions. Full warranty information is available on our website."
                      placeholder="Thank you for your business! Items left for more than 30 days will be recycled."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Integrations Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment Gateway Integrations</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Connect third-party services to accept online payments</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Stripe', color: 'indigo', description: 'Accept Apple Pay, Google Pay, and all major credit cards globally.', isConnected: true },
                    { name: 'PayPal', color: 'blue', description: 'Allow customers to pay using their PayPal balance or linked bank accounts.', isConnected: false },
                    { name: 'Square', color: 'black', description: 'Perfect for syncing with physical Square POS hardware in your shop.', isConnected: false }
                  ].map((gateway, idx) => {
                    const bgs = {
                      indigo: 'bg-indigo-600',
                      blue: 'bg-blue-600',
                      black: 'bg-black'
                    }
                    return (
                      <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`${bgs[gateway.color as keyof typeof bgs]} text-white font-bold px-3 py-1 rounded text-xs`}>
                            {gateway.name}
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={gateway.isConnected} className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{gateway.description}</p>
                        <button className={`text-xs font-bold flex items-center gap-1 transition-colors ${gateway.isConnected ? 'text-primary hover:underline' : 'text-slate-400 cursor-not-allowed'}`}>
                          {gateway.isConnected ? 'Configure Settings' : 'Connect Account'}
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Saved Bank Accounts Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved Bank Accounts</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Bank details shown on invoices for manual transfers</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm">
                    <Plus size={14} /> Add Account
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { name: 'Main Operations (USD)', bank: 'Chase Bank • •••• 8829', isPrimary: true },
                      { name: 'International Savings (EUR)', bank: 'HSBC • •••• 4120', isPrimary: false }
                    ].map((account, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="size-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                            <Building2 size={18} className="text-slate-500 dark:text-slate-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm text-slate-900 dark:text-white">{account.name}</p>
                              {account.isPrimary && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded uppercase">Primary</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{account.bank}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div className="space-y-6 pb-24">
              {/* Event Notifications Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Event Notifications</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Configure which events trigger customer alerts</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Event Trigger</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">SMS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        { 
                          name: 'New Ticket Created', 
                          description: 'Sent when a new repair order is opened',
                          icon: Ticket,
                          color: 'blue',
                          email: true,
                          sms: true
                        },
                        { 
                          name: 'Repair Finished', 
                          description: "Sent when repair status is set to 'Ready for Pickup'",
                          icon: CheckCircle2,
                          color: 'green',
                          email: true,
                          sms: true
                        },
                        { 
                          name: 'Overdue Payment', 
                          description: 'Sent when an invoice remains unpaid past the due date',
                          icon: AlertCircle,
                          color: 'amber',
                          email: true,
                          sms: false
                        }
                      ].map((event, idx) => {
                        const IconComponent = event.icon
                        const colorClasses = {
                          blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
                          green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
                          amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
                        }
                        return (
                          <tr key={idx}>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className={`size-8 ${colorClasses[event.color as keyof typeof colorClasses]} rounded flex items-center justify-center`}>
                                  <IconComponent size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{event.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{event.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={event.email} className="sr-only peer" />
                                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={event.sms} className="sr-only peer" />
                                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Template Editor Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Template Editor</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Customize the content of your automated messages</p>
                  </div>
                  <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>New Ticket Created (Email)</option>
                    <option>Repair Finished (Email)</option>
                    <option>Overdue Payment (SMS)</option>
                  </select>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-6">
                    {/* Placeholders */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Placeholders</p>
                      <div className="flex flex-wrap gap-2">
                        {['{customer_name}', '{ticket_id}', '{device_model}', '{repair_cost}', '{shop_name}'].map((placeholder, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors"
                          >
                            {placeholder}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Email Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Subject</label>
                      <input 
                        type="text"
                        defaultValue="Repair Update: New Ticket {ticket_id} opened at {shop_name}"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Message Body */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message Body</label>
                      <textarea 
                        rows={8}
                        defaultValue={`Dear {customer_name},
Thank you for choosing {shop_name}. We have successfully created a new repair ticket for your {device_model}.
Ticket ID: {ticket_id}
Status: Diagnosing
You can track your repair progress on our website using your ticket ID. We will notify you as soon as the diagnosis is complete.
Best regards,
The {shop_name} Team`}
                        placeholder="Type your message here..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">Changes here only affect the selected template.</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1">
                      <Eye size={14} />
                      Preview Email
                    </button>
                    <button className="px-4 py-2 text-xs font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1">
                      <RotateCcw size={14} />
                      Reset to Default
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'api' && (
            <div className="space-y-6">
              {/* API Keys Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">API Keys</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Authenticate requests to the TechRepair API</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <span>+</span> Generate New Key
                  </button>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Key Name</th>
                        <th className="px-6 py-3">API Key</th>
                        <th className="px-6 py-3">Created</th>
                        <th className="px-6 py-3">Last Used</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Production-Main-CRM</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">tr_live_••••••••••••3a9b</code>
                            <button className="text-slate-400 hover:text-primary transition-colors"><MdContentCopy size={16} /></button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">Oct 12, 2023</td>
                        <td className="px-6 py-4 text-slate-500">2 mins ago</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-red-500 transition-colors"><MdDelete size={16} /></button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Staging-Test-Env</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">tr_test_••••••••••••9f2e</code>
                            <button className="text-slate-400 hover:text-primary transition-colors"><MdContentCopy size={16} /></button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">Sep 28, 2023</td>
                        <td className="px-6 py-4 text-slate-500">Yesterday</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-red-500 transition-colors"><MdDelete size={16} /></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Webhooks Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Webhooks</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Send real-time event data to your server endpoints</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                    <MdLink size={16} /> Add Endpoint
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex gap-4">
                        <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MdLink size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">https://api.myapp.com/webhooks/repair-updates</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded uppercase">repair.created</span>
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded uppercase">repair.status_changed</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                          <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          ACTIVE
                        </span>
                        <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"><MdEdit size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third-Party Integrations Section */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Third-Party Integrations</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Connect with external platforms and tools</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WhatsApp */}
                  <div className="flex flex-col p-5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-2xl">
                        💬
                      </div>
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-full uppercase">
                        <span className="size-1.5 bg-green-600 rounded-full"></span>Connected
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">WhatsApp Business API</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 leading-relaxed">Send automated status notifications and chat with customers directly from the dashboard.</p>
                    <button className="mt-auto w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                      Disconnect Integration
                    </button>
                  </div>

                  {/* Google Calendar */}
                  <div className="flex flex-col p-5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-2xl">
                        <MdCalendarToday size={24} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Not Connected</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Google Calendar</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 leading-relaxed">Sync repair appointments and deadline schedules with your team's Google Calendars.</p>
                    <button className="mt-auto w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                      Connect Account
                    </button>
                  </div>

                  {/* Mailchimp */}
                  <div className="flex flex-col p-5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-2xl">
                        <MdEmail size={24} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Not Connected</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Mailchimp</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 leading-relaxed">Automatically sync customer emails to your marketing lists for repair follow-ups and promos.</p>
                    <button className="mt-auto w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                      Connect Account
                    </button>
                  </div>

                  {/* QuickBooks */}
                  <div className="flex flex-col p-5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-2xl">
                        <MdBarChart size={24} />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase">Not Connected</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">QuickBooks Online</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 leading-relaxed">Sync invoices, payments, and inventory costs with your accounting software seamlessly.</p>
                    <button className="mt-auto w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                      Connect Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

