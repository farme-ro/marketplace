/**
 * Flower Bloom from Package Animation Component
 * 
 * Animație SVG de floare care înflorește dintr-un colet de transport
 * Coletul se deschide și floarea crește din el
 */

'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

export function FlowerBloomAnimation() {
  const reducedMotion = useReducedMotion()
  // Ensure reducedMotion is always a boolean to prevent undefined SVG attributes
  const isReducedMotion = reducedMotion ?? false

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground/Base */}
        <ellipse cx="200" cy="280" rx="180" ry="18" fill="currentColor" opacity="0.08" />

        {/* Package/Box - starts closed, opens */}
        <motion.g
          initial={reducedMotion ? { scaleY: 1 } : { scaleY: 1 }}
          animate={reducedMotion ? {} : {
            scaleY: [1, 0.3, 0.3],
          }}
          transition={{
            duration: 1.5,
            delay: 0.5,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '200px 240px' }}
        >
          {/* Box base */}
          <rect
            x="140"
            y="220"
            width="120"
            height="40"
            rx="4"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.25"
          />
          
          {/* Box lid - opens upward */}
          <motion.rect
            x="140"
            y="180"
            width="120"
            height="40"
            rx="4"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
            animate={reducedMotion ? {} : {
              rotate: [0, -45],
              y: [180, 160],
            }}
            transition={{
              duration: 1.5,
              delay: 0.5,
              ease: 'easeOut',
            }}
            style={{ transformOrigin: '200px 200px' }}
          />
          
          {/* Box tape/seal */}
          <motion.rect
            x="190"
            y="200"
            width="20"
            height="20"
            rx="2"
            fill="currentColor"
            opacity="0.3"
            animate={reducedMotion ? {} : {
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          />
        </motion.g>

        {/* Stem - grows from inside the box */}
        <motion.path
          d="M200 240 Q200 200 200 150"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.25"
          initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={reducedMotion ? {} : {
            pathLength: [0, 1],
          }}
          transition={{
            duration: 2,
            delay: 2,
            ease: 'easeOut',
          }}
        />

        {/* Leaves on stem */}
        <motion.g
          initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          animate={reducedMotion ? {} : {
            opacity: [0, 1],
            scale: [0, 1],
          }}
          transition={{
            duration: 0.8,
            delay: 3,
            ease: 'easeOut',
          }}
        >
          {/* Left leaf */}
          <motion.path
            d="M200 220 Q180 210 170 220"
            stroke="currentColor"
            strokeWidth="3"
            fill="currentColor"
            fillOpacity="0.15"
            opacity="0.3"
            strokeLinecap="round"
            animate={reducedMotion ? {} : {
              pathLength: [0, 1],
            }}
            transition={{
              duration: 1,
              delay: 3.5,
              ease: 'easeOut',
            }}
          />
          {/* Right leaf */}
          <motion.path
            d="M200 220 Q220 210 230 220"
            stroke="currentColor"
            strokeWidth="3"
            fill="currentColor"
            fillOpacity="0.15"
            opacity="0.3"
            strokeLinecap="round"
            animate={reducedMotion ? {} : {
              pathLength: [0, 1],
            }}
            transition={{
              duration: 1,
              delay: 3.7,
              ease: 'easeOut',
            }}
          />
        </motion.g>

        {/* Flower center - appears first */}
        <motion.circle
          cx="200"
          cy="150"
          r={isReducedMotion ? 12 : 0}
          fill="currentColor"
          opacity="0.3"
          animate={isReducedMotion ? { r: 12 } : {
            r: [0, 12, 10, 12],
          }}
          transition={{
            r: {
              duration: 1.5,
              delay: 4,
              ease: 'easeOut',
            },
          }}
        />

        {/* Petals - bloom outward */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60) * (Math.PI / 180)
          const petalX = 200 + Math.cos(angle) * 25
          const petalY = 150 + Math.sin(angle) * 25
          
          return (
            <motion.ellipse
              key={i}
              cx={petalX}
              cy={petalY}
              rx={isReducedMotion ? 12 : 0}
              ry={isReducedMotion ? 18 : 0}
              fill="currentColor"
              opacity="0.25"
              transform={`rotate(${i * 60} ${petalX} ${petalY})`}
              animate={isReducedMotion ? { rx: 12, ry: 18 } : {
                rx: [0, 12, 10, 12],
                ry: [0, 18, 16, 18],
                opacity: [0, 0.25, 0.2, 0.25],
              }}
              transition={{
                rx: {
                  duration: 1.2,
                  delay: 4.5 + i * 0.1,
                  ease: 'easeOut',
                },
                ry: {
                  duration: 1.2,
                  delay: 4.5 + i * 0.1,
                  ease: 'easeOut',
                },
                opacity: {
                  duration: 1.2,
                  delay: 4.5 + i * 0.1,
                  ease: 'easeOut',
                },
              }}
            />
          )
        })}

        {/* Additional smaller petals layer */}
        {[...Array(6)].map((_, i) => {
          const angle = ((i * 60) + 30) * (Math.PI / 180)
          const petalX = 200 + Math.cos(angle) * 20
          const petalY = 150 + Math.sin(angle) * 20
          
          return (
            <motion.ellipse
              key={`inner-${i}`}
              cx={petalX}
              cy={petalY}
              rx={isReducedMotion ? 8 : 0}
              ry={isReducedMotion ? 12 : 0}
              fill="currentColor"
              opacity="0.2"
              transform={`rotate(${(i * 60) + 30} ${petalX} ${petalY})`}
              animate={isReducedMotion ? { rx: 8, ry: 12 } : {
                rx: [0, 8, 7, 8],
                ry: [0, 12, 11, 12],
                opacity: [0, 0.2, 0.15, 0.2],
              }}
              transition={{
                rx: {
                  duration: 1,
                  delay: 5.3 + i * 0.08,
                  ease: 'easeOut',
                },
                ry: {
                  duration: 1,
                  delay: 5.3 + i * 0.08,
                  ease: 'easeOut',
                },
                opacity: {
                  duration: 1,
                  delay: 5.3 + i * 0.08,
                  ease: 'easeOut',
                },
              }}
            />
          )
        })}

        {/* Gentle floating animation after bloom */}
        <motion.g
          animate={reducedMotion ? {} : {
            y: [0, -3, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            delay: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* This will wrap the flower elements for continuous gentle movement */}
        </motion.g>

        {/* Package label/address - fades as box opens */}
        <motion.text
          x="200"
          y="235"
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          opacity="0.2"
          animate={reducedMotion ? {} : {
            opacity: [0.2, 0],
          }}
          transition={{
            duration: 0.8,
            delay: 0.5,
          }}
        >
          📦
        </motion.text>
      </svg>
    </div>
  )
}
