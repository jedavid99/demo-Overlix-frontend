import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../features/dashboard/home'
import Login from '../features/auth/index'
import Dashboard from '../features/dashboard/index'
import Clients from '../features/clients/index'
import Sales from '../features/sales/index'
import Stock from '../features/products/index'
import Providers from '../features/shipments/providers'
import Settings from '../features/settings/index'
import RootLayout from './layout'
import AdminLayout from '../shared/components/layouts/AdminLayout'
import RepairsList from '../features/repairs/List'
import RepairAdd from '../features/repairs/Add'
import RepairFlow from '../features/repairs/RepairFlow'
import Budgets from '../features/repairs/Budgets'
import ClientAdd from '../features/clients/Add'
import SaleAdd from '../features/sales/Add'
import StockAdd from '../features/products/Add'
import ProviderAdd from '../features/shipments/Add'
import ProvidersOrders from '../features/shipments/Orders'
import OrdersList from '../features/shipments/OrdersList'
import OrderForm from '../features/shipments/OrderForm'
import OrderDetail from '../features/shipments/OrderDetail'
import Billing from '../features/business/billing'
import Expenses from '../features/expenses/index'
import ExpensesAdd from '../features/expenses/Add'
import ExpensesCategories from '../features/expenses/Categories'
import Developer from '../features/settings/developer'
import Profile from '../features/settings/profile'
import CajaDiaria from '../features/sales/cash-register'
import ARCA from '../features/business/arca'
import ARCAIVA from '../features/business/ARCAIVA'
import CreateInvoice from '../features/sales/invoice'
import InvoicesList from '../features/sales/invoices'
import IphoneSales from '../features/sales/iphone/Sales'
import IphoneRecords from '../features/sales/iphone/Records'
import IphoneInsurance from '../features/sales/iphone/Insurance'
import IphoneCanje from '../features/sales/iphone/Canje'
import CanjeNew from '../features/sales/iphone/CanjeNew'
import IPhoneInventory from '../features/products/IPhoneInventory'
import IPhoneInventoryList from '../features/products/IPhoneInventoryList'
import StockRepuestos from '../features/products/Repuestos'
import StockAdjustments from '../features/products/Adjustments'
import Notifications from '../features/settings/notifications'
import Tracking from '../features/shipments/Tracking'
import Remises from '../features/shipments/Remises'
import ReportsSales from '../features/reports/SalesReport'
import ReportsStock from '../features/reports/StockReport'
import ReportsFinancial from '../features/reports/FinancialReport'
import Docs from '../features/settings/docs'
import Help from '../features/settings/help'
import RepairsReport from '@/features/reports/RepairsReport'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />

      <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/clients" element={<AdminLayout><Clients /></AdminLayout>} />
      <Route path="/sales" element={<AdminLayout><Sales /></AdminLayout>} />
      <Route path="/stock" element={<AdminLayout><Stock /></AdminLayout>} />
      <Route path="/providers" element={<AdminLayout><Providers /></AdminLayout>} />
      <Route path="/reports" element={<Navigate to="/reports/sales" replace />} />
      <Route path="/billing" element={<AdminLayout><InvoicesList /></AdminLayout>} />
      <Route path="/expenses" element={<AdminLayout><Expenses /></AdminLayout>} />
      <Route path="/developer" element={<AdminLayout><Developer /></AdminLayout>} />
      <Route path="/profile" element={<AdminLayout><Profile /></AdminLayout>} />
      <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
      <Route path="/clients/add" element={<AdminLayout><ClientAdd /></AdminLayout>} />
      <Route path="/sales/add" element={<AdminLayout><SaleAdd /></AdminLayout>} />
      <Route path="/stock/add" element={<AdminLayout><StockAdd /></AdminLayout>} />
      <Route path="/providers/add" element={<AdminLayout><ProviderAdd /></AdminLayout>} />
      <Route path="/expenses/add" element={<AdminLayout><ExpensesAdd /></AdminLayout>} />
      {/* keep backwards compatibility: direct /envios goes to tracking as well */}
      <Route path="/envios" element={<AdminLayout><Tracking /></AdminLayout>} />
      <Route path="/envios/tracking" element={<AdminLayout><Tracking /></AdminLayout>} />
      <Route path="/caja-diaria" element={<AdminLayout><CajaDiaria /></AdminLayout>} />
      <Route path="/reparaciones/list" element={<AdminLayout><RepairsList /></AdminLayout>} />
      <Route path="/reparaciones/add" element={<AdminLayout><RepairFlow /></AdminLayout>} />
      <Route path="/reparaciones/budgets" element={<AdminLayout><Budgets /></AdminLayout>} />
      <Route path="/billing/ARCA" element={<AdminLayout><ARCA /></AdminLayout>} />
      <Route path="/billing/ARCA/iva" element={<AdminLayout><ARCAIVA /></AdminLayout>} />
      <Route path="/billing/create" element={<AdminLayout><CreateInvoice /></AdminLayout>} />
      <Route path="/iphone/sales" element={<AdminLayout><IphoneSales /></AdminLayout>} />
      <Route path="/iphone/records" element={<AdminLayout><IphoneRecords /></AdminLayout>} />
      <Route path="/iphone/insurance" element={<AdminLayout><IphoneInsurance /></AdminLayout>} />
      <Route path="/iphone-canje" element={<AdminLayout><IphoneCanje /></AdminLayout>} />
      <Route path="/iphone-canje/new" element={<AdminLayout><CanjeNew /></AdminLayout>} />
      <Route path="/stock/iphone" element={<AdminLayout><IPhoneInventoryList /></AdminLayout>} />
      <Route path="/stock/iphone-add" element={<AdminLayout><IPhoneInventory /></AdminLayout>} />
      <Route path="/stock/repuestos" element={<AdminLayout><StockRepuestos /></AdminLayout>} />
      <Route path="/stock/adjustments" element={<AdminLayout><StockAdjustments /></AdminLayout>} />
      <Route path="/providers/orders" element={<AdminLayout><OrdersList /></AdminLayout>} />
      <Route path="/providers/orders/add" element={<AdminLayout><OrderForm /></AdminLayout>} />
      <Route path="/providers/orders/edit/:id" element={<AdminLayout><OrderForm /></AdminLayout>} />
      <Route path="/providers/orders/:id" element={<AdminLayout><OrderDetail /></AdminLayout>} />
      <Route path="/expenses/categories" element={<AdminLayout><ExpensesCategories /></AdminLayout>} />
      <Route path="/reports/sales" element={<AdminLayout><ReportsSales /></AdminLayout>} />
      <Route path="/reports/stock" element={<AdminLayout><ReportsStock /></AdminLayout>} />
      <Route path="/reports/financial" element={<AdminLayout><ReportsFinancial /></AdminLayout>} />
      
      <Route path="/reports/repairs" element={<AdminLayout><RepairsReport /></AdminLayout>} />
      <Route path="/envios/remises" element={<AdminLayout><Remises /></AdminLayout>} />
      <Route path="/notifications" element={<AdminLayout><Notifications /></AdminLayout>} />
      <Route path="/docs" element={<AdminLayout><Docs /></AdminLayout>} />
      <Route path="/help" element={<AdminLayout><Help /></AdminLayout>} />
    </Routes>
  )
}
