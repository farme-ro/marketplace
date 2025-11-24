/**
 * Mobile Product Card Component
 * 
 * Card pentru produse în grid mobile
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, Button } from 'farme-ui'
import Image from 'next/image'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  unit: string
  stock: number
  image?: string
  isActive: boolean
  isUpdating?: boolean
}

interface MobileProductCardProps {
  product: Product
  onToggleActive?: (productId: string, isActive: boolean) => void
  onEdit?: (productId: string) => void
}

export function MobileProductCard({ 
  product, 
  onToggleActive, 
  onEdit 
}: MobileProductCardProps) {
  const [localIsUpdating, setLocalIsUpdating] = useState(false)
  const isUpdating = product.isUpdating ?? localIsUpdating

  const handleToggle = async () => {
    if (onToggleActive && !isUpdating) {
      if (!product.isUpdating) {
        setLocalIsUpdating(true)
      }
      try {
        await onToggleActive(product.id, product.isActive)
      } finally {
        if (!product.isUpdating) {
          setLocalIsUpdating(false)
        }
      }
    }
  }

  const getStatusBadge = () => {
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

  const status = getStatusBadge()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="mb-4"
    >
      <Card className="border border-border rounded-2xl shadow-premium bg-card overflow-hidden">
        {/* Image */}
        <div className="relative w-full h-40 bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title & Price */}
          <div className="mb-3">
            <h3 className="text-base font-semibold text-foreground mb-1">{product.name}</h3>
            <p className="text-sm text-foreground-body">{product.price} lei / {product.unit}</p>
          </div>

          {/* Stock */}
          <div className="mb-3">
            <p className="text-xs text-foreground-body">
              Stoc: <span className="font-semibold text-foreground">{product.stock} buc</span>
            </p>
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}>
              {status.label}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={product.isActive}
                onChange={handleToggle}
                disabled={isUpdating || product.stock === 0}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary disabled:opacity-50"></div>
              <span className="ml-2 text-xs text-foreground-body">
                {product.isActive ? 'Activ' : 'Inactiv'}
              </span>
            </label>
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(product.id)}
                className="flex-shrink-0"
              >
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

