/**
 * Optimized Image Component
 * 
 * Component optimizat pentru imagini cu:
 * - Lazy loading cu Intersection Observer
 * - Placeholder blur
 * - Error handling cu fallback
 * - Next.js Image optimization (dacă e disponibil)
 */

'use client'

import { useState, useRef, useEffect, memo } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  priority?: boolean
  fallback?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'empty',
  blurDataURL,
  priority = false,
  fallback,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority || isInView) return

    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '50px' }
    )

    observer.observe(imgRef.current)

    return () => {
      observer.disconnect()
    }
  }, [priority, isInView])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  const imageSrc = hasError && fallback ? fallback : src

  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={cn('bg-muted animate-pulse', className)}
        style={{ width, height }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <Image
          src={blurDataURL}
          alt=""
          fill
          className="blur-sm scale-110"
          aria-hidden="true"
          unoptimized
        />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill'
        )}
        placeholder={placeholder === 'blur' && blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  )
})


