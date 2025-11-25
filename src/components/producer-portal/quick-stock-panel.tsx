/**
 * Quick Stock Panel Component
 * 
 * Panel pentru gestionarea rapidă a stocului cu slider-uri
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'
import Image from 'next/image'

interface QuickStockProduct {
  id: string
  name: string
  imageUrl?: string
  stock: number
  status: 'available' | 'limited' | 'unavailable'
}

interface QuickStockPanelProps {
  products?: QuickStockProduct[]
}

const mockProducts: QuickStockProduct[] = [
  {
    id: '1',
    name: 'Miere de salcâm',
    stock: 15,
    status: 'available',
  },
  {
    id: '2',
    name: 'Brânză de capră',
    stock: 3,
    status: 'limited',
  },
  {
    id: '3',
    name: 'Ouă de țară',
    stock: 0,
    status: 'unavailable',
  },
]

const statusConfig = {
  available: {
    label: '✅ Disponibil',
    className: 'bg-primary-soft text-primary border-primary/20',
    icon: '✅',
  },
  limited: {
    label: '⚠️ Stoc limitat',
    className: 'bg-secondary-soft text-secondary border-secondary/20',
    icon: '⚠️',
  },
  unavailable: {
    label: '⛔ Indisponibil',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: '⛔',
  },
}

export function QuickStockPanel({ products = mockProducts }: QuickStockPanelProps) {
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)

  const handleDeactivate = (productId: string) => {
    setDeactivatingId(productId)
    // Note: API call to deactivate product will be implemented when backend endpoint is available
    // Endpoint: PATCH /producers/products/:id (with status: inactive)
    setTimeout(() => {
      setDeactivatingId(null)
    }, 1000)
  }

  return (
    <Card className="border border-border rounded-[32px] shadow-premium bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground">Gestionează rapid stocul</CardTitle>
        <p className="text-sm text-foreground-body mt-1">Actualizează statusul produselor rapid</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => {
            const status = statusConfig[product.status]
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                {/* Product Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground mb-2 truncate">
                    {product.name}
                  </p>
                  
                  {/* Status Slider */}
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                      {status.icon} {status.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Stoc: <span className="font-semibold text-foreground">{product.stock}</span>
                    </span>
                  </div>
                </div>

                {/* Deactivate Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeactivate(product.id)}
                  disabled={deactivatingId === product.id}
                  className="flex-shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
                  title="Clienții nu vor putea comanda acest produs."
                >
                  {deactivatingId === product.id ? 'Dezactivare...' : 'Dezactivează produsul'}
                </Button>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <a href="/portal-producatori/produse">
            <Button variant="outline" className="w-full sm:w-auto">Gestionează toate produsele →</Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

