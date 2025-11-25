/**
 * Agricultural Background Animation Component
 * 
 * Animație interactivă pe fundal cu elemente specifice agriculturii
 */

'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

interface FloatingElement {
  id: number
  icon: string
  x: number
  y: number
  delay: number
  duration: number
}

const agriculturalElements: FloatingElement[] = [
  { id: 1, icon: '🥕', x: 8, y: 15, delay: 0, duration: 20 },
  { id: 2, icon: '🍎', x: 88, y: 12, delay: 1.5, duration: 25 },
  { id: 3, icon: '🌾', x: 15, y: 55, delay: 3, duration: 18 },
  { id: 4, icon: '🥬', x: 75, y: 65, delay: 0.8, duration: 22 },
  { id: 5, icon: '🌿', x: 45, y: 25, delay: 2.5, duration: 24 },
  { id: 6, icon: '🍇', x: 25, y: 75, delay: 4.5, duration: 19 },
  { id: 7, icon: '🥔', x: 92, y: 45, delay: 1.2, duration: 21 },
  { id: 8, icon: '🌽', x: 5, y: 40, delay: 2.8, duration: 23 },
  { id: 9, icon: '🍅', x: 60, y: 18, delay: 0.5, duration: 20 },
  { id: 10, icon: '🥒', x: 35, y: 88, delay: 3.5, duration: 22 },
  { id: 11, icon: '🌻', x: 82, y: 35, delay: 1.8, duration: 26 },
  { id: 12, icon: '🍓', x: 12, y: 68, delay: 4.2, duration: 19 },
]

export function AgriculturalBackground() {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {agriculturalElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl md:text-3xl opacity-[0.06]"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {element.icon}
        </motion.div>
      ))}
      
      {/* Floating particles - subtile - fixed values to prevent hydration mismatch */}
      {[
        { size: 1.2, x: 10, y: 20, duration: 18, delay: 0 },
        { size: 0.8, x: 45, y: 15, duration: 22, delay: 1.5 },
        { size: 1.5, x: 80, y: 30, duration: 20, delay: 0.8 },
        { size: 1.0, x: 25, y: 60, duration: 19, delay: 2.2 },
        { size: 0.9, x: 65, y: 50, duration: 21, delay: 1.0 },
        { size: 1.3, x: 15, y: 75, duration: 17, delay: 3.5 },
        { size: 0.7, x: 90, y: 40, duration: 23, delay: 0.5 },
        { size: 1.1, x: 35, y: 10, duration: 18, delay: 2.8 },
        { size: 1.4, x: 70, y: 65, duration: 20, delay: 1.2 },
        { size: 0.6, x: 5, y: 45, duration: 24, delay: 4.0 },
        { size: 1.2, x: 55, y: 80, duration: 19, delay: 0.3 },
        { size: 0.9, x: 85, y: 25, duration: 21, delay: 1.8 },
      ].map((particle, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-primary/8"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

