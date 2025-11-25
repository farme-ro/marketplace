/**
 * Producer Card Component
 *
 * Component reutilizabil pentru afișarea unui producător
 */

'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from 'farme-ui'
import { cn } from '@/lib/utils/cn'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import type { ProducerVisibilityInfo } from '@/lib/types/farmero-marketing'
import { useI18n } from '@/lib/i18n/context'
import { CardHover } from '@/components/ui/motion/card-hover'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

export interface ProducerCardProps {
  id: string
  slug: string
  name: string
  description?: string
  avatarUrl?: string | null
  regionName?: string
  productCount?: number
  tags?: string[]
  isVerified?: boolean
  partnerSince?: string
  visibility?: ProducerVisibilityInfo
}

function ProducerCardComponent({
  id,
  slug,
  name,
  description,
  avatarUrl,
  regionName,
  productCount,
  tags,
  isVerified,
  partnerSince,
  visibility,
}: ProducerCardProps) {
  const { t } = useI18n()
  const reducedMotion = useReducedMotion()

  const getVisibilityBadge = () => {
    if (!visibility || visibility.tier === 'none') return null

    const badgeConfig: Record<string, { label: string; className: string }> = {
      featured: {
        label: t('producer.badge.featured', 'Recomandat'),
        className: 'bg-secondary/10 text-secondary border-secondary/30',
      },
      boosted: {
        label: t('producer.badge.boosted', 'Vizibilitate crescută'),
        className: 'bg-primary/10 text-primary border-primary/30',
      },
      sponsored: {
        label: t('producer.badge.sponsored', 'Partener Farmero'),
        className: 'bg-secondary/15 text-secondary border-secondary/40',
      },
    }

    const tier = visibility.tier as keyof typeof badgeConfig
    const config = badgeConfig[tier]
    if (!config) return null

    return (
      <Badge
        variant="outline"
        className={cn('text-xs font-medium', config.className)}
      >
        {visibility.badgeLabel || config.label}
      </Badge>
    )
  }

  const visibilityBadge = getVisibilityBadge()
  const hasVisibility = visibility && visibility.tier !== 'none'

  if (!slug) {
    return null
  }

  return (
    <CardHover intensity="normal" disabled={reducedMotion}>
      <Link href={`/producers/${slug}`}>
        <div
        className={cn(
          'group border rounded-2xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col',
          hasVisibility &&
            visibility?.tier === 'featured' &&
            'border-secondary/40 hover:border-secondary/60',
          hasVisibility &&
            visibility?.tier === 'boosted' &&
            'border-primary/40 hover:border-primary/60',
          hasVisibility &&
            visibility?.tier === 'sponsored' &&
            'border-secondary/50 hover:border-secondary/70 shadow-sm',
          !hasVisibility && 'border-border/60 hover:border-primary/60',
        )}
      >
        {/* Header with avatar */}
        <div className="p-5 md:p-6 pb-4 relative">
          {/* Favorite Button */}
          <div className="absolute top-5 right-5 md:top-6 md:right-6 z-10">
            <FavoriteButton
              targetType="producer"
              targetId={id}
              size="md"
              variant="ghost"
              className="bg-background/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              {avatarUrl ? (
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-muted border-2 border-border group-hover:border-primary/60 transition-colors">
                  <Image
                    src={avatarUrl}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="80px"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-border group-hover:border-primary/60 transition-colors flex items-center justify-center">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
              {isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-background flex items-center justify-center shadow-md"
                >
                  <svg
                    className="w-3.5 h-3.5 text-primary-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1"
                    aria-label={`Producător: ${name}`}
                  >
                    {name}
                  </h3>
                  {regionName && (
                    <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {regionName}
                    </p>
                  )}
                </div>
                {visibilityBadge && (
                  <div className="flex-shrink-0">{visibilityBadge}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 md:px-6 pb-5 md:pb-6 flex-1 flex flex-col">
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {description}
            </p>
          )}

          {/* Tags / Product types */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer info */}
          <div className="mt-auto space-y-2 pt-4 border-t border-border/60">
            {typeof productCount === 'number' && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                {productCount}{' '}
                {productCount === 1 ? 'produs' : 'produse'} disponibile
              </p>
            )}
            {partnerSince && (
              <p className="text-xs text-muted-foreground">
                {t('producers.detail.partnerSince', 'Partener din {year}').replace('{year}', partnerSince)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
    </CardHover>
  )
}

// Memoize component to prevent unnecessary re-renders in lists
export const ProducerCard = memo(ProducerCardComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.slug === nextProps.slug &&
    prevProps.name === nextProps.name &&
    prevProps.description === nextProps.description &&
    prevProps.avatarUrl === nextProps.avatarUrl &&
    prevProps.regionName === nextProps.regionName &&
    prevProps.productCount === nextProps.productCount &&
    prevProps.isVerified === nextProps.isVerified &&
    prevProps.partnerSince === nextProps.partnerSince &&
    JSON.stringify(prevProps.tags) === JSON.stringify(nextProps.tags) &&
    JSON.stringify(prevProps.visibility) === JSON.stringify(nextProps.visibility)
  )
})

ProducerCard.displayName = 'ProducerCard'
