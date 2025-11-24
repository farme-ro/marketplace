/**
 * Button Press Motion Component
 * 
 * Standardized press animation for buttons
 * Subtle scale(0.97) when active
 */

'use client'

import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

export interface ButtonPressProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  disabled?: boolean
}

export function ButtonPress({ 
  children, 
  disabled = false,
  className,
  ...props 
}: ButtonPressProps) {
  const reducedMotion = useReducedMotion()

  if (disabled || reducedMotion) {
    // Extract only standard button props, excluding motion-specific props
    const { whileTap, whileHover, animate, initial, transition, ...buttonProps } = props as any
    return (
      <button className={cn('transition-all duration-200', className)} disabled={disabled} {...buttonProps}>
        {children}
      </button>
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1, ease: 'easeInOut' }}
      className={cn('transition-all duration-200', className)}
      {...props}
    >
      {children}
    </motion.button>
  )
}

