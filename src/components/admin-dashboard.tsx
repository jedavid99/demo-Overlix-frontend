// 'use client'

// import { useState, useMemo } from 'react'
// import DataTable from '@/components/data-table'
// import { Button } from '@/components/ui/button'

// interface AdminDashboardProps {
//   onLogout: () => void
// }

// // Generar 500 registros de ejemplo
// const generateSampleData = () => {
//   return Array.from({ length: 500 }, (_, i) => ({
//     id: i + 1,
//     name: `Usuario ${i + 1}`,
//     email: `usuario${i + 1}@example.com`,
//     status: Math.random() > 0.5 ? 'Activo' : 'Inactivo',
//     joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
//     transactions: Math.floor(Math.random() * 100),
//   }))
// }

// export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 10

//   // Datos siempre los mismos (memoizados) para evitar regeneración en cada render
//   const data = useMemo(() => generateSampleData(), [])

//   // Calcular paginación eficientemente
//   const paginationData = useMemo(() => {
//     const totalPages = Math.ceil(data.length / itemsPerPage)
//     const startIndex = (currentPage - 1) * itemsPerPage
//     const endIndex = startIndex + itemsPerPage
//     const paginatedData = data.slice(startIndex, endIndex)

//     return { paginatedData, totalPages }
//   }, [currentPage, data])

//   return (
//     <div className="flex h-screen bg-slate-950 text-white">

//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold">Dashboard</h1>
//             <p className="text-slate-400 text-sm mt-1">Bienvenido al panel de administración</p>
//           </div>
//           <Button
//             onClick={onLogout}
//             className="bg-red-600 hover:bg-red-700 text-white"
//           >
//             Cerrar Sesión
//           </Button>
//         </header>

//         {/* Main Content */}
//         <main className="flex-1 overflow-auto p-6">
//           <div className="max-w-7xl mx-auto">
//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
//                 <p className="text-slate-400 text-sm">Total de Usuarios</p>
//                 <p className="text-3xl font-bold mt-2">{data.length}</p>
//               </div>
//               <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
//                 <p className="text-slate-400 text-sm">Usuarios Activos</p>
//                 <p className="text-3xl font-bold mt-2">{data.filter(d => d.status === 'Activo').length}</p>
//               </div>
//               <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
//                 <p className="text-slate-400 text-sm">Total Transacciones</p>
//                 <p className="text-3xl font-bold mt-2">{data.reduce((sum, d) => sum + d.transactions, 0)}</p>
//               </div>
//             </div>

//             {/* Data Table with Pagination */}
//             <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
//               <DataTable
//                 data={paginationData.paginatedData}
//                 currentPage={currentPage}
//                 totalPages={paginationData.totalPages}
//                 onPageChange={setCurrentPage}
//               />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
