/**
 * Animated Illustration Component
 * 
 * Component pregătit pentru ilustrații animate (Lottie/SVG)
 * Momentan folosește SVG static, poate fi upgradat ulterior cu Lottie
 */

'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

export type IllustrationType =
  | 'farmer-market'
  | 'farm-basket'
  | 'local-producer'
  | 'sustainable-farm'
  | 'fresh-products'
  | 'community-support'

interface AnimatedIllustrationProps {
  type: IllustrationType
  className?: string
  width?: number
  height?: number
  animated?: boolean
}

/**
 * SVG Illustrations - Static pentru moment, pregătite pentru upgrade la Lottie
 */
const illustrations: Record<IllustrationType, React.ReactNode> = {
  'farmer-market': (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Farm market illustration - simplified SVG */}
      <rect x="50" y="200" width="300" height="80" rx="8" fill="currentColor" opacity="0.1" />
      <circle cx="120" cy="150" r="40" fill="currentColor" opacity="0.2" />
      <circle cx="280" cy="150" r="40" fill="currentColor" opacity="0.2" />
      <path d="M100 180 L150 120 L200 180" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" />
      <path d="M200 180 L250 120 L300 180" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" />
      <rect x="80" y="220" width="60" height="40" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="160" y="220" width="60" height="40" rx="4" fill="currentColor" opacity="0.3" />
      <rect x="240" y="220" width="60" height="40" rx="4" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  'farm-basket': (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Basket with produce */}
      <ellipse cx="200" cy="220" rx="120" ry="40" fill="currentColor" opacity="0.2" />
      <path d="M120 200 Q200 160 280 200" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.4" />
      <circle cx="160" cy="180" r="25" fill="currentColor" opacity="0.3" />
      <circle cx="200" cy="160" r="25" fill="currentColor" opacity="0.3" />
      <circle cx="240" cy="180" r="25" fill="currentColor" opacity="0.3" />
      <path d="M140 100 L180 60 L220 100" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" />
    </svg>
  ),
  'local-producer': (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Producer with farm */}
      <circle cx="200" cy="120" r="50" fill="currentColor" opacity="0.2" />
      <rect x="150" y="170" width="100" height="80" rx="8" fill="currentColor" opacity="0.15" />
      <path d="M100 200 L200 100 L300 200" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
      <circle cx="120" cy="240" r="20" fill="currentColor" opacity="0.3" />
      <circle cx="200" cy="240" r="20" fill="currentColor" opacity="0.3" />
      <circle cx="280" cy="240" r="20" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  'sustainable-farm': (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sustainable farm with nature elements */}
      <ellipse cx="200" cy="250" rx="180" ry="30" fill="currentColor" opacity="0.1" />
      <path d="M150 200 Q200 120 250 200" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
      <circle cx="120" cy="180" r="30" fill="currentColor" opacity="0.2" />
      <circle cx="280" cy="180" r="30" fill="currentColor" opacity="0.2" />
      <path d="M100 100 L200 50 L300 100" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
      <circle cx="200" cy="150" r="40" fill="currentColor" opacity="0.15" />
    </svg>
  ),
  'fresh-products': (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fresh produce arrangement */}
      <ellipse cx="150" cy="200" rx="50" ry="60" fill="currentColor" opacity="0.2" />
      <ellipse cx="250" cy="200" rx="50" ry="60" fill="currentColor" opacity="0.2" />
      <circle cx="200" cy="120" r="40" fill="currentColor" opacity="0.2" />
      <path d="M120 100 L180 60 L240 100" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
      <rect x="160" y="240" width="80" height="40" rx="4" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  'community-support': (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Community hands/connection */}
      <circle cx="150" cy="150" r="50" fill="currentColor" opacity="0.2" />
      <circle cx="250" cy="150" r="50" fill="currentColor" opacity="0.2" />
      <path d="M150 150 Q200 100 250 150" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
      <path d="M150 150 Q200 200 250 150" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
      <rect x="100" y="220" width="100" height="60" rx="8" fill="currentColor" opacity="0.15" />
      <rect x="200" y="220" width="100" height="60" rx="8" fill="currentColor" opacity="0.15" />
    </svg>
  ),
}

export function AnimatedIllustration({
  type,
  className,
  width = 400,
  height = 300,
  animated = false,
}: AnimatedIllustrationProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const illustration = illustrations[type]

  if (!illustration) {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center text-primary',
        animated && 'animate-pulse',
        className
      )}
      style={{ width, height }}
      role="img"
      aria-label={`Illustration: ${type.replace(/-/g, ' ')}`}
    >
      <div
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      >
        {illustration}
      </div>
    </div>
  )
}

/**
 * Hook pentru future Lottie integration
 * 
 * Note: Upgrade to Lottie when available for better animation support
 * 
 * @example
 * const { animationData, isLoading } = useLottieAnimation('farmer-market')
 */
export function useLottieAnimation(type: IllustrationType) {
  // Placeholder pentru future Lottie integration
  return {
    animationData: null,
    isLoading: false,
    error: null,
  }
}

