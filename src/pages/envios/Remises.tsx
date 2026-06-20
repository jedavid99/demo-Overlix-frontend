import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Truck } from 'lucide-react'

export default function Remises() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Remises</h1>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Truck size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No hay remises registrados aún. Esta función estará disponible próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


