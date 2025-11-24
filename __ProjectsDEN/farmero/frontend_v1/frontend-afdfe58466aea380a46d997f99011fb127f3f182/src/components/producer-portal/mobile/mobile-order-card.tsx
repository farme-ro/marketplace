/**
 * Mobile Order Card Component
 * 
 * Card pentru comenzi cu swipe actions
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'

export interface Order {
  id: string
  client: string
  amount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'canceled' | 'uncollected'
  paymentMethod: 'card' | 'cash' | 'cod' | 'bank_transfer' | 'other'
  date: string
  isUpdating?: boolean
  orderNumber?: string
  deliveryAddress?: string
  items?: Array<{
    id: string
    productId: string
    productName: string
    quantity: number
    price: number
    total: number
  }>
}

interface MobileOrderCardProps {
  order: Order
  onConfirm?: (orderId: string) => void
  onShip?: (orderId: string) => void
  onMarkDelivered?: (orderId: string) => void
}

const statusConfig = {
  pending: {
    label: 'Nouă',
    className: 'bg-primary-soft text-primary border-primary/20',
    action: 'Confirmă',
  },
  confirmed: {
    label: 'Confirmată',
    className: 'bg-primary-bg text-primary border-primary/30',
    action: 'Trimite',
  },
  shipped: {
    label: 'Trimisă',
    className: 'bg-primary-bg text-primary border-primary/30',
    action: 'Marchează livrat',
  },
  delivered: {
    label: 'Livrată',
    className: 'bg-primary-soft text-primary border-primary/20',
    action: null,
  },
  uncollected: {
    label: 'Neridicată',
    className: 'bg-secondary-soft text-secondary border-secondary/20',
    action: null,
  },
}

export function MobileOrderCard({ 
  order, 
  onConfirm, 
  onShip, 
  onMarkDelivered 
}: MobileOrderCardProps) {
  const status = statusConfig[order.status]
  const hasAction = status.action !== null

  const handleAction = () => {
    if (order.status === 'pending' && onConfirm) {
      onConfirm(order.id)
    } else if (order.status === 'confirmed' && onShip) {
      onShip(order.id)
    } else if (order.status === 'shipped' && onMarkDelivered) {
      onMarkDelivered(order.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card className="border border-border rounded-2xl shadow-premium bg-card">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">{order.client}</p>
              <p className="text-xs text-foreground-body">{order.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {order.paymentMethod === 'cash' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-soft text-secondary border border-secondary/20">
                  🟡 Ramburs
                </span>
              )}
              {order.status === 'uncollected' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                  ⚠️ Neridicată
                </span>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="mb-3">
            <p className="text-xl font-bold text-foreground">{order.amount} RON</p>
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${status.className}`}>
              {status.label}
            </span>
          </div>

          {/* Action Button */}
          {hasAction && (
            <Button
              onClick={handleAction}
              size="sm"
              disabled={order.isUpdating}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground disabled:opacity-50"
            >
              {order.isUpdating ? 'Se procesează...' : status.action}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

