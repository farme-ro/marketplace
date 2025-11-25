/**
 * Producer Products Table Component
 * 
 * Tabel cu produse și toggle activ/inactiv
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'

interface Product {
  id: string
  name: string
  price: number
  unit: string
  stock: number
  isActive: boolean
}

interface ProducerProductsTableProps {
  products?: Product[]
  onToggleActive?: (productId: string, isActive: boolean) => void
  updatingIds?: Set<string>
}

// Mock data - Note: Replace with API fetch when backend endpoint is available
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Miere de salcâm',
    price: 45,
    unit: '500g',
    stock: 10,
    isActive: true,
  },
  {
    id: '2',
    name: 'Lapte de capră',
    price: 12,
    unit: '1L',
    stock: 0,
    isActive: false,
  },
  {
    id: '3',
    name: 'Ouă de țară',
    price: 8,
    unit: 'buc',
    stock: 50,
    isActive: true,
  },
]

export function ProducerProductsTable({
  products = mockProducts,
  onToggleActive,
  updatingIds = new Set(),
}: ProducerProductsTableProps) {
  const [localProducts, setLocalProducts] = useState(products)

  // Sync local products with prop changes
  useEffect(() => {
    setLocalProducts(products)
  }, [products])

  const handleToggle = async (productId: string, currentStatus: boolean) => {
    if (!onToggleActive) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[ProducerProductsTable] onToggleActive callback not provided')
      }
      return
    }

    // Optimistic update
    const newStatus = !currentStatus
    setLocalProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isActive: newStatus } : p))
    )

    try {
      // Call parent handler which handles API call
      await onToggleActive(productId, currentStatus)
    } catch (error) {
      // Revert on error
      setLocalProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, isActive: currentStatus } : p))
      )
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error toggling product:', error)
      }
    }
  }

  const getStatusBadge = (product: Product) => {
    if (product.stock === 0) {
      return {
        label: '❌ Stoc epuizat',
        className: 'bg-destructive/10 text-destructive border-destructive/20',
      }
    }
    if (product.isActive) {
      return {
        label: '✅ Activ',
        className: 'bg-primary-soft text-primary border-primary/20',
      }
    }
    return {
      label: '⏸️ Inactiv',
      className: 'bg-muted text-muted-foreground border-border',
    }
  }

  return (
    <Card className="border border-border rounded-[32px] shadow-premium bg-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Produs
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Preț
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Stoc
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                  Stare
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {localProducts.map((product, index) => {
                const status = getStatusBadge(product)
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-base font-semibold text-foreground">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground-body">
                        {product.price} lei / {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        product.stock > 0 ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {product.stock > 0 ? `${product.stock} buc` : '0 buc'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href={`/portal-producatori/produse/${product.id}/editeaza`}
                          className="text-sm text-primary hover:text-primary-hover transition-colors"
                        >
                          Editează
                        </Link>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.isActive}
                            onChange={() => handleToggle(product.id, product.isActive)}
                            disabled={(updatingIds?.has(product.id) ?? false) || product.stock === 0}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary disabled:opacity-50"></div>
                        </label>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {localProducts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-foreground-body mb-4">Nu ai produse încă.</p>
            <Button className="mt-4" variant="outline">
              Adaugă primul produs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

