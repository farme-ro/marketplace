/**
 * Smart Stock Widget Component
 * 
 * Widget pentru produse cu stoc scăzut
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'

interface LowStockProduct {
  id: string
  name: string
  stock: number
  minStock: number
}

interface SmartStockWidgetProps {
  products?: LowStockProduct[]
}

const mockProducts: LowStockProduct[] = [
  {
    id: '1',
    name: 'Miere de salcâm',
    stock: 5,
    minStock: 10,
  },
  {
    id: '2',
    name: 'Brânză de capră',
    stock: 3,
    minStock: 8,
  },
]

export function SmartStockWidget({ products = mockProducts }: SmartStockWidgetProps) {
  if (products.length === 0) {
    return (
      <Card className="border border-border rounded-[32px] shadow-premium bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-foreground">Stoc inteligent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-body">Toate produsele au stoc suficient.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border rounded-[32px] shadow-premium bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground">Stoc inteligent</CardTitle>
        <p className="text-sm text-foreground-body mt-1">Produse cu stoc scăzut</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-destructive/5 rounded-xl border border-destructive/20"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">{product.name}</p>
                <p className="text-xs text-foreground-body">
                  Stoc: <span className="font-semibold text-destructive">{product.stock}</span> / Min: {product.minStock}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-4 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Dezactivează
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <Button variant="outline" className="w-full sm:w-auto">
            Gestionează toate produsele →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

