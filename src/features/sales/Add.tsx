import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Minus, CreditCard, DollarSign, ShoppingCart, ChevronRight } from 'lucide-react'

type CatalogItem = { id: string; title: string; price: number; stock?: number; img?: string; badge?: string }

const CATALOG: CatalogItem[] = [
  { id: 'p1', title: 'iPhone 13 Pro Screen', price: 120, stock: 12, img: '' },
  { id: 's1', title: 'Labor: Screen Repair', price: 60, badge: 'Service' },
  { id: 'p2', title: 'Samsung S22 Battery', price: 45, stock: 5, img: '' },
  { id: 'p3', title: 'Tempered Glass Protector', price: 15, stock: 50, img: '' },
  { id: 'p4', title: 'Anker USB-C Cable 6ft', price: 19.99, stock: 22, img: '' },
]

export default function SaleAdd() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('Walk-in Customer')
  const [items, setItems] = useState<{ item: CatalogItem; qty: number }[]>([ { item: CATALOG[0], qty: 1 }, { item: CATALOG[1], qty: 1 } ])

  const filtered = useMemo(() => CATALOG.filter(c => c.title.toLowerCase().includes(query.toLowerCase())), [query])

  const addItem = (it: CatalogItem) => {
    setItems(prev => {
      const existing = prev.find(p => p.item.id === it.id)
      if (existing) return prev.map(p => p.item.id === it.id ? { ...p, qty: Math.min((p.qty||0)+1, (it.stock||9999)) } : p)
      return [{ item: it, qty: 1 }, ...prev]
    })
  }

  const changeQty = (id: string, delta: number) => {
    setItems(prev => prev.map(p => p.item.id === id ? { ...p, qty: Math.max(1, Math.min((p.qty||1)+delta, p.item.stock||9999)) } : p))
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(p => p.item.id !== id))

  const subtotal = items.reduce((s, p) => s + p.item.price * p.qty, 0)
  const taxRate = 0.08
  const tax = +(subtotal * taxRate).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Crear Venta</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/sales')} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">Volver a Ventas</button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold">Item Personalizado</button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Catalog */}
        <section className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold">Catálogo</h2>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-2">
                <Plus size={14} /> Item Personalizado
              </button>
            </div>
          </div>

          <div className="p-4 flex gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary" placeholder="Search by name, category or SKU..." />
            </div>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
              <Filter size={16} />
            </button>
          </div>

          <div className="flex border-b border-slate-100 dark:border-slate-800 px-4">
            <button className="px-4 py-3 text-sm font-bold border-b-2 border-primary text-primary">Todos los Items</button>
            <button className="px-4 py-3 text-sm font-semibold text-slate-500">Servicios de Reparación</button>
            <button className="px-4 py-3 text-sm font-semibold text-slate-500">Pantallas</button>
            <button className="px-4 py-3 text-sm font-semibold text-slate-500">Baterías</button>
            <button className="px-4 py-3 text-sm font-semibold text-slate-500">Accesorios</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(it => (
                <button key={it.id} onClick={() => addItem(it)} className="group flex flex-col text-left p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:shadow-md transition-all">
                  <div className="aspect-square w-full rounded-lg bg-slate-100 dark:bg-slate-700 mb-3 flex items-center justify-center overflow-hidden">
                    <ShoppingCart size={36} className="text-slate-500" />
                  </div>
                  <p className="font-bold text-sm mb-1 truncate">{it.title}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">${it.price.toFixed(2)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold uppercase tracking-tight">{it.badge ?? (it.stock ? `${it.stock} in stock` : 'Service')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Current Sale */}
        <section className="w-[420px] shrink-0 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Venta Actual</h2>
              <span className="text-slate-500 text-sm">#INV-9402</span>
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <Search className="text-slate-400" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Cliente</p>
                  <p className="text-sm font-bold">{selectedCustomer}</p>
                </div>
                <button onClick={() => setSelectedCustomer('Cliente en Caja')} className="text-primary text-xs font-bold px-2 py-1 rounded bg-primary/10">Cambiar</button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.map(p => (
              <div key={p.item.id} className="flex items-start gap-3">
                <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <ShoppingCart className="text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <p className="text-sm font-bold">{p.item.title}</p>
                    <p className="text-sm font-bold">${(p.item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQty(p.item.id, -1)} className="size-6 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800"><Minus size={14} /></button>
                      <span className="text-sm font-bold">{p.qty}</span>
                      <button onClick={() => changeQty(p.item.id, 1)} className="size-6 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(p.item.id)} className="text-red-500 text-xs font-bold hover:underline">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <span>Tax</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1 rounded">8%</span>
              </div>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500 font-medium pb-2 border-b border-dashed border-slate-300 dark:border-slate-600">
              <button className="text-primary flex items-center gap-1 hover:underline">
                <DollarSign size={14} /> Aplicar Descuento
              </button>
              <span>-$0.00</span>
            </div>
            <div className="flex items-center justify-between text-xl font-extrabold text-slate-900 dark:text-slate-100 py-2">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary transition-all">
                <span className="mb-1"><CreditCard size={18} /></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Tarjeta</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary transition-all">
                <span className="mb-1">💵</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Efectivo</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-primary hover:text-primary transition-all">
                <span className="mb-1">🔀</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Dividir</span>
              </button>
            </div>
            <button onClick={() => navigate('/sales')} className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
              Completar Transacción
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}


