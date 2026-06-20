import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { TrendingUp } from 'lucide-react'

export default function SalesReport() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Reporte de Ventas</h1>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No hay datos de ventas aún. Esta función estará disponible próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


