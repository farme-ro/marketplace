/**
 * Farm Animation Component - Simplified & Clear
 * 
 * Animație SVG simplificată și clară pentru card-ul din hero section
 * Design minimalist cu elemente recognoscibile
 */

'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

export function FarmAnimation() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground - subtle */}
        <ellipse cx="200" cy="280" rx="180" ry="20" fill="currentColor" opacity="0.08" />

        {/* Main basket - centered and clear */}
        <motion.g
          animate={reducedMotion ? {} : {
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Basket */}
          <ellipse cx="200" cy="220" rx="90" ry="32" fill="currentColor" opacity="0.18" />
          <path
            d="M120 205 Q200 160 280 205"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            opacity="0.25"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Produce items - simple circles with subtle animation */}
        <motion.circle
          cx="160"
          cy="190"
          r="18"
          fill="currentColor"
          opacity="0.22"
          animate={reducedMotion ? {} : {
            y: [0, -4, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            delay: 0,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.circle
          cx="200"
          cy="175"
          r="20"
          fill="currentColor"
          opacity="0.22"
          animate={reducedMotion ? {} : {
            y: [0, -4, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            delay: 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.circle
          cx="240"
          cy="190"
          r="18"
          fill="currentColor"
          opacity="0.22"
          animate={reducedMotion ? {} : {
            y: [0, -4, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            delay: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Additional smaller items */}
        <motion.circle
          cx="175"
          cy="205"
          r="10"
          fill="currentColor"
          opacity="0.18"
          animate={reducedMotion ? {} : {
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3.5,
            delay: 0.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.circle
          cx="225"
          cy="205"
          r="10"
          fill="currentColor"
          opacity="0.18"
          animate={reducedMotion ? {} : {
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3.5,
            delay: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Simple farm house - minimalist */}
        <motion.g
          animate={reducedMotion ? {} : {
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path
            d="M100 120 L200 70 L300 120 L300 150 L100 150 Z"
            stroke="currentColor"
            strokeWidth="3"
            fill="currentColor"
            fillOpacity="0.1"
            opacity="0.25"
          />
        </motion.g>

        {/* Sun - simple and clear */}
        <motion.g
          animate={reducedMotion ? {} : {
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <circle cx="320" cy="80" r="22" fill="currentColor" opacity="0.2" />
        </motion.g>

        {/* Simple plants */}
        <path
          d="M80 220 Q95 190 110 220"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          opacity="0.2"
          strokeLinecap="round"
        />
        <path
          d="M290 220 Q305 190 320 220"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          opacity="0.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
