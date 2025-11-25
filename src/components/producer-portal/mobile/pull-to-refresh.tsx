/**
 * Pull to Refresh Component
 * 
 * Component pentru pull-to-refresh pe mobile
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canPull, setCanPull] = useState(true)
  const y = useMotionValue(0)
  const springY = useSpring(y, { stiffness: 300, damping: 30 })
  const opacity = useTransform(springY, [0, 100], [0, 1])
  const scale = useTransform(springY, [0, 100], [0.8, 1])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setCanPull(true)
      } else {
        setCanPull(false)
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    return () => window.removeEventListener('touchstart', handleTouchStart)
  }, [])

  const handleDragEnd = async () => {
    if (springY.get() > 80 && canPull && !isRefreshing) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    y.set(0)
  }

  return (
    <div className="relative">
      {/* Refresh Indicator */}
      <motion.div
        style={{ opacity, scale, y: springY }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
          {isRefreshing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.div>
          ) : (
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y: springY }}
        className="touch-none"
      >
        {children}
      </motion.div>
    </div>
  )
}

