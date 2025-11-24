/**
 * Card Hover Motion Component
 * 
 * Standardized hover animation for cards
 * Based on homepage: translateY(-2px) + shadow increase
 */

'use client'

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

export interface CardHoverProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  disabled?: boolean
  intensity?: 'subtle' | 'normal' | 'strong'
}

const intensityConfig = {
  subtle: {
    y: -2,
    shadow: 'hover:shadow-md',
  },
  normal: {
    y: -4,
    shadow: 'hover:shadow-lg',
  },
  strong: {
    y: -6,
    shadow: 'hover:shadow-xl',
  },
} as const

export function CardHover({ 
  children, 
  disabled = false,
  intensity = 'normal',
  className,
  ...props 
}: CardHoverProps) {
  const reducedMotion = useReducedMotion()
  const config = intensityConfig[intensity]

  if (disabled || reducedMotion) {
    // Extract only standard div props, excluding motion-specific props
    const { whileHover, whileTap, animate, initial, transition, ...divProps } = props as any
    return (
      <div className={cn('transition-shadow duration-200', config.shadow, className)} {...divProps}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: config.y }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('transition-shadow duration-200', config.shadow, className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}


