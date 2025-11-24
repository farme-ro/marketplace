/**
 * Swipeable Order Card Component
 * 
 * Card pentru comenzi cu swipe actions (swipe right pentru acțiuni rapide)
 */

'use client'

import { useState } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { MobileOrderCard, type Order } from './mobile-order-card'

interface SwipeableOrderCardProps {
  order: Order
  onConfirm?: (orderId: string) => void
  onShip?: (orderId: string) => void
  onMarkDelivered?: (orderId: string) => void
}

export function SwipeableOrderCard({
  order,
  onConfirm,
  onShip,
  onMarkDelivered,
}: SwipeableOrderCardProps) {
  const [swiped, setSwiped] = useState(false)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0], [1, 0])
  const scale = useTransform(x, [-100, 0], [1, 0.95])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      // Swipe left - show actions
      setSwiped(true)
    } else if (info.offset.x > 50) {
      // Swipe right - hide actions
      setSwiped(false)
    }
  }

  const getActionButton = () => {
    if (order.status === 'pending' && onConfirm) {
      return (
        <Button
          size="sm"
          onClick={() => {
            onConfirm(order.id)
            setSwiped(false)
          }}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          Confirmă
        </Button>
      )
    }
    if (order.status === 'confirmed' && onShip) {
      return (
        <Button
          size="sm"
          onClick={() => {
            onShip(order.id)
            setSwiped(false)
          }}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          Trimite
        </Button>
      )
    }
    if (order.status === 'shipped' && onMarkDelivered) {
      return (
        <Button
          size="sm"
          onClick={() => {
            onMarkDelivered(order.id)
            setSwiped(false)
          }}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          Livrat
        </Button>
      )
    }
    return null
  }

  return (
    <div className="relative mb-4 overflow-hidden">
      {/* Action Buttons (behind card) */}
      <motion.div
        style={{ opacity, scale }}
        className="absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4 bg-primary-soft rounded-2xl"
      >
        {getActionButton()}
      </motion.div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{ x: swiped ? -100 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ x }}
        className="relative z-10"
      >
        <MobileOrderCard
          order={order}
          onConfirm={onConfirm}
          onShip={onShip}
          onMarkDelivered={onMarkDelivered}
        />
      </motion.div>
    </div>
  )
}

