/**
 * Product Card Component
 * 
 * Component reutilizabil pentru afișarea unui produs
 */

'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button, Badge } from 'farme-ui'
import { cn } from '@/lib/utils/cn'
import { ProducerPriceBadge } from '@/components/impact/producer-price-badge'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { formatCurrency } from '@/lib/utils/format'
import { formatUnit } from '@/lib/utils/format-units'
import { useI18n } from '@/lib/i18n/context'
import { CardHover } from '@/components/ui/motion/card-hover'

export interface ProductCardProps {
  id: string
  slug: string
  name: string
  price: number
  unit: string
  producerName: string
  producerSlug: string
  regionName?: string
  isTraditional?: boolean
  isBio?: boolean
  imageUrl?: string | null
  onAddToCart: () => void
}

function ProductCardComponent({
  id,
  slug,
  name,
  price,
  unit,
  producerName,
  producerSlug,
  regionName,
  isTraditional,
  isBio,
  imageUrl,
  onAddToCart,
}: ProductCardProps) {
  const reducedMotion = useReducedMotion()
  const { locale, t } = useI18n()
  
  return (
    <CardHover intensity="normal" disabled={reducedMotion}>
      <div className="group border border-border rounded-[32px] overflow-hidden bg-card shadow-premium hover:shadow-premium-lg transition-all duration-300">
      {/* Image */}
      <Link href={`/products/${slug}`} className="block relative">
        <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
              <svg
                className="w-16 h-16 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isBio && (
              <motion.div
                initial={reducedMotion ? { scale: 1 } : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={reducedMotion ? { duration: 0 } : { delay: 0.1 }}
              >
                <Badge variant="success" className="text-xs font-semibold shadow-md backdrop-blur-sm bg-success/90">
                  BIO
                </Badge>
              </motion.div>
            )}
            {isTraditional && (
              <motion.div
                initial={reducedMotion ? { scale: 1 } : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={reducedMotion ? { duration: 0 } : { delay: 0.15 }}
              >
                <Badge variant="secondary" className="text-xs font-semibold shadow-md backdrop-blur-sm bg-secondary/90">
                  Tradițional
                </Badge>
              </motion.div>
            )}
          </div>
          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton
              targetType="product"
              targetId={id}
              size="md"
              variant="ghost"
              className="bg-background/80 backdrop-blur-sm"
            />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 md:p-5 space-y-3 flex flex-col flex-1">
        {/* Name */}
        <Link href={`/products/${slug}`} className="flex-1">
          <h3 className="font-semibold text-base md:text-lg mb-2 text-foreground hover:text-primary transition-colors line-clamp-2 min-h-[3rem]" aria-label={`Produs: ${name}`}>
            {name}
          </h3>
        </Link>

        {/* Producer */}
        <Link href={`/producers/${producerSlug}`} className="block">
          <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {producerName}
            {regionName && <span className="ml-1">• {regionName}</span>}
          </p>
        </Link>

        {/* Price */}
        <div className="space-y-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              {formatCurrency(price, locale)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {formatUnit(1, unit, locale, t)}
            </span>
          </div>
          <ProducerPriceBadge variant="compact" className="text-xs" />
        </div>

        {/* Delivery info */}
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t('product.deliveryTime', 'Livrare în 2-3 zile lucrătoare')}
        </p>

        {/* Add to Cart */}
        <Button
          variant="default"
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onAddToCart()
          }}
          className="w-full mt-auto rounded-full bg-primary hover:bg-primary-hover text-primary-foreground"
          aria-label={t('actions.addToCart', 'Adaugă în coș').replace('{productName}', name)}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {t('actions.addToCart', 'Adaugă în coș')}
        </Button>
      </div>
      </div>
    </CardHover>
  )
}

// Memoize component to prevent unnecessary re-renders in lists
export const ProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.slug === nextProps.slug &&
    prevProps.name === nextProps.name &&
    prevProps.price === nextProps.price &&
    prevProps.unit === nextProps.unit &&
    prevProps.producerName === nextProps.producerName &&
    prevProps.producerSlug === nextProps.producerSlug &&
    prevProps.regionName === nextProps.regionName &&
    prevProps.isTraditional === nextProps.isTraditional &&
    prevProps.isBio === nextProps.isBio &&
    prevProps.imageUrl === nextProps.imageUrl
    // Note: onAddToCart is intentionally excluded from comparison
    // as it's typically a stable callback from parent components
  )
})

ProductCard.displayName = 'ProductCard'
