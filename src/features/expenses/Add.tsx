import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Info, CreditCard, Cloud, Save, X } from 'lucide-react'
import { MdAdd, MdCreditCard, MdAttachFile } from 'react-icons/md'

export default function ExpensesAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    date: '',
    category: '',
    supplier: '',
    paymentMethod: 'cash',
  })
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: persist data
    navigate('/expenses')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[960px] mx-auto w-full py-8 px-6">
          {/* Breadcrumbs */}
          
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold tracking-tight">Register New Expense</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Record a new business transaction for tax reporting and accounting.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Transaction Details */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Info size={20} className="text-primary" />
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Expense Title / Description
                  </label>
                  <input
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3"
                    placeholder="e.g. Monthly Office Rent"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Amount
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm">
                      $
                    </span>
                    <input
                      value={form.amount}
                      onChange={e => handleChange('amount', e.target.value)}
                      className="w-full rounded-r-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3"
                      placeholder="0.00"
                      step="0.01"
                      type="number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={e => handleChange('currency', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Date of Expense
                  </label>
                  <input
                    value={form.date}
                    onChange={e => handleChange('date', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3"
                    type="date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3"
                  >
                    <option value="">Select Category</option>
                    <option value="spare_parts">Spare Parts</option>
                    <option value="utilities">Utilities</option>
                    <option value="rent">Rent</option>
                    <option value="salaries">Salaries</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Supplier & Payment */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Supplier &amp; Payment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Supplier
                  </label>
                  <select
                    value={form.supplier}
                    onChange={e => handleChange('supplier', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary px-4 py-3"
                  >
                    <option value="">Select from database</option>
                    <option value="1">Global Logistics Inc.</option>
                    <option value="2">Main Street Properties</option>
                    <option value="3">Tech Supplies Co.</option>
                    <option value="4">Utility Power Grid</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <MdAdd size={14} /> Add a new supplier
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="flex flex-col items-center justify-center p-3 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-primary/5 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                      <input
                        checked={form.paymentMethod === 'cash'}
                        onChange={e => handleChange('paymentMethod', 'cash')}
                        className="sr-only"
                        name="payment_method"
                        type="radio"
                        value="cash"
                      />
                      <span className="text-xl mb-1">💵</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Cash</span>
                    </label>
                    <label className="flex flex-col items-center justify-center p-3 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-primary/5 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                      <input
                        checked={form.paymentMethod === 'card'}
                        onChange={e => handleChange('paymentMethod', 'card')}
                        className="sr-only"
                        name="payment_method"
                        type="radio"
                        value="card"
                      />
                      <MdCreditCard size={20} className="mb-1" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Card</span>
                    </label>
                    <label className="flex flex-col items-center justify-center p-3 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-primary/5 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                      <input
                        checked={form.paymentMethod === 'bank'}
                        onChange={e => handleChange('paymentMethod', 'bank')}
                        className="sr-only"
                        name="payment_method"
                        type="radio"
                        value="bank"
                      />
                      <span className="text-xl mb-1">🏦</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Transfer</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Digital Record */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Cloud size={20} className="text-primary" />
                Receipt or Invoice
              </h3>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Cloud size={48} className="text-slate-400 mb-3" />
                    <p className="mb-2 text-sm text-slate-700 dark:text-slate-300 font-semibold tracking-tight">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">
                      PNG, JPG or PDF (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    onChange={handleFileChange}
                    className="hidden"
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                  />
                </label>
              </div>
              {file && (
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1"><MdAttachFile size={16} /> {file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 py-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => navigate('/expenses')}
                className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                type="submit"
              >
                <Save size={18} />
                Save Expense
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-10 py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-[960px] mx-auto flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <p>© 2024 ExpenseFlow Business Systems. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#/" className="hover:text-primary">
              Support
            </a>
            <a href="#/" className="hover:text-primary">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}


