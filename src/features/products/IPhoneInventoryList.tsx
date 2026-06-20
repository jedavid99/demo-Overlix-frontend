import React, { useState } from 'react';
import {
  Search,
  Download,
  Plus,
  TrendingUp,
  DollarSign,
  AlertCircle,
  QrCode,
  Edit,
  ChevronLeft,
  ChevronRight,
  Bell,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { MdPhoneAndroid } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface iPhone {
  id: string;
  model: string;
  color: string;
  modelNumber: string;
  storage: string;
  imei: string;
  battery: number;
  status: 'Available' | 'Reserved' | 'Sold' | 'Out of Stock';
  image: React.ReactNode;
}

export default function IPhoneInventoryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const iphones: iPhone[] = [
    {
      id: '1',
      model: 'iPhone 15 Pro',
      color: 'Blue Titanium',
      modelNumber: 'A3102',
      storage: '256 GB',
      imei: '357890123456789',
      battery: 100,
      status: 'Available',
      image: <MdPhoneAndroid size={24} />,
    },
    {
      id: '2',
      model: 'iPhone 14 Pro',
      color: 'Deep Purple',
      modelNumber: 'A2894',
      storage: '128 GB',
      imei: '351234567890123',
      battery: 88,
      status: 'Reserved',
      image: <MdPhoneAndroid size={24} />,
    },
    {
      id: '3',
      model: 'iPhone 13',
      color: 'Starlight',
      modelNumber: 'A2633',
      storage: '512 GB',
      imei: '354455667788990',
      battery: 94,
      status: 'Sold',
      image: <MdPhoneAndroid size={24} />,
    },
    {
      id: '4',
      model: 'iPhone 15',
      color: 'Black',
      modelNumber: 'A3090',
      storage: '128 GB',
      imei: '-- Stock Out --',
      battery: 0,
      status: 'Out of Stock',
      image: <MdPhoneAndroid size={24} />,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' };
      case 'Reserved':
        return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' };
      case 'Sold':
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500' };
      case 'Out of Stock':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500' };
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery >= 80) return 'bg-emerald-500';
    if (battery >= 50) return 'bg-amber-500';
    if (battery >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Navigation */}
     
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">iPhone Inventory Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400">Real-time stock monitoring and asset management</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium">
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          <Link to="/stock/iphone-add">
  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-medium">
    <Plus size={18} />
    <span>Add New Stock</span>
  </button>
</Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                <Search size={24} />
              </div>
              <span className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={16} /> +12%
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Total iPhone Units</h3>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">1,284</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                <DollarSign size={24} />
              </div>
              <span className="text-slate-500 text-sm font-medium">USD</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Market Value</h3>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">$1.14M</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600">
                <AlertCircle size={24} />
              </div>
              <span className="text-red-500 text-sm font-medium">Critical</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Out of Stock Models</h3>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">14</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-[300px]">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search IMEI, Model or Serial Number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option>Series: All</option>
                <option>iPhone 15 Series</option>
                <option>iPhone 14 Series</option>
                <option>iPhone 13 Series</option>
              </select>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option>Condition: All</option>
                <option>Brand New</option>
                <option>Used - Like New</option>
                <option>Used - Good</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                <Filter size={18} />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Storage</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">IMEI / Serial</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Battery</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {iphones.map(phone => {
                  const statusColors = getStatusColor(phone.status);
                  return (
                    <tr key={phone.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-2xl">
                            {phone.image}
                          </div>
                          <div>
                            <p className={phone.status === 'Out of Stock' ? 'font-semibold text-slate-400' : 'font-semibold text-slate-900 dark:text-white'}>
                              {phone.model}
                            </p>
                            <p className="text-xs text-slate-500">{phone.color} • Model {phone.modelNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${phone.status === 'Out of Stock' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'}`}>
                          {phone.storage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">{phone.imei}</td>
                      <td className="px-6 py-4">
                        {phone.battery > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getBatteryColor(phone.battery)} transition-all`}
                                style={{ width: `${phone.battery}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs font-medium ${getBatteryColor(phone.battery) === 'bg-emerald-500' ? 'text-emerald-500' : getBatteryColor(phone.battery) === 'bg-amber-500' ? 'text-amber-500' : 'text-red-500'}`}>
                              {phone.battery}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                            <span className="text-xs font-medium text-slate-400">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}>
                          {phone.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {phone.status === 'Out of Stock' ? (
                          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-all font-medium">
                            Restock
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-800 rounded text-slate-600 dark:text-slate-400" title="Print Barcode">
                              <QrCode size={16} />
                            </button>
                            <button className="p-1.5 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-800 rounded text-slate-600 dark:text-slate-400" title="Edit Item">
                              <Edit size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Showing 1 to 10 of 1,284 entries</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs">3</button>
              <span className="px-2 text-slate-400">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs">129</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-12">
          {/* Stock Distribution */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Stock Distribution by Series</h3>
              <button className="text-blue-600 text-xs font-semibold hover:underline">View Details</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'iPhone 15 Series', units: 420, percent: 33 },
                { name: 'iPhone 14 Series', units: 582, percent: 45 },
                { name: 'iPhone 13 Series', units: 212, percent: 17 },
                { name: 'Legacy Models', units: 70, percent: 5 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-medium mb-2 text-slate-900 dark:text-white">
                    <span>{item.name}</span>
                    <span>{item.units} units ({item.percent}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${item.percent}%`, opacity: 1 - idx * 0.15 }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Recent Inventory Activity</h3>
            <div className="space-y-4">
              {[
                { type: 'add', text: 'New Stock In: iPhone 15 Pro (12 units)', time: '12 mins ago', user: 'Added by Admin' },
                { type: 'update', text: 'Status Update: IMEI 3512... Marked as Reserved', time: '45 mins ago', user: 'Store #42' },
                { type: 'audit', text: 'Inventory Audit Completed', time: '3 hours ago', user: 'Warehouse A' },
                { type: 'alert', text: 'Critical Stock Alert: iPhone 13 128GB Black', time: '5 hours ago', user: 'Automated System' },
              ].map((activity, idx) => {
                const colors: Record<string, string> = {
                  add: 'bg-emerald-500',
                  update: 'bg-amber-500',
                  audit: 'bg-blue-600',
                  alert: 'bg-red-500',
                };
                return (
                  <div key={idx} className="flex gap-4">
                    <div className={`w-2 h-2 rounded-full ${colors[activity.type]} flex-shrink-0 mt-2`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.text}</p>
                      <p className="text-xs text-slate-500">{activity.time} • {activity.user}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


