/**
 * Favorite Button Component
 * 
 * Buton pentru marcarea/eliminarea produselor și producătorilor ca favorite
 * Folosește heart icon cu animație
 * Debounced pentru a evita request-uri multiple
 */

'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useFavoritesStore } from '@/lib/store/favorites'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils/cn'
import type { FavoriteTargetType } from '@/lib/types/favorites'

export interface FavoriteButtonProps {
  targetType: FavoriteTargetType
  targetId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
  showLabel?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function FavoriteButton({
  targetType,
  targetId,
  className,
  size = 'md',
  variant = 'ghost',
  showLabel = false,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth()
  const { t } = useI18n()
  const { showToast } = useToast()
  const { isFavorited, toggleFavorite, pendingActions } = useFavoritesStore()
  const [isPending, setIsPending] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const favorited = isFavorited(targetType, targetId)
  const actionKey = `${targetType}:${targetId}`
  const isActionPending = pendingActions.has(actionKey)

  // Handle click
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      showToast(
        t('favorites.authRequiredDescription', 'Trebuie să fii autentificat pentru a adăuga la favorite.'),
        'warning'
      )
      return
    }

    if (isPending || isActionPending) {
      return
    }

    setIsPending(true)
    setIsAnimating(true)

    try {
      await toggleFavorite(targetType, targetId)
      
      // Animation feedback
      setTimeout(() => setIsAnimating(false), 300)
      
      // Show success toast
      if (favorited) {
        showToast(
          t('favorites.removed', 'Eliminat din favorite'),
          'success'
        )
      } else {
        showToast(
          t('favorites.added', 'Adăugat la favorite'),
          'success'
        )
      }
    } catch (error) {
      setIsAnimating(false)
      // Show error toast
      showToast(
        t('favorites.errorDescription', 'A apărut o eroare. Te rugăm să încerci din nou.'),
        'error'
      )
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Failed to toggle favorite:', error)
      }
    } finally {
      setIsPending(false)
    }
  }

  // Button classes
  const buttonClasses = cn(
    'inline-flex items-center justify-center rounded-full transition-all',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      // Size
      'p-1.5': size === 'sm',
      'p-2': size === 'md',
      'p-2.5': size === 'lg',
      // Variant
      'bg-transparent hover:bg-muted': variant === 'ghost',
      'bg-background border border-border hover:bg-muted': variant === 'outline',
      'bg-primary/10 hover:bg-primary/20': variant === 'default',
      // Favorited state
      'text-primary': favorited,
      'text-muted-foreground hover:text-foreground': !favorited,
      // Animation
      'scale-110': isAnimating,
    },
    className
  )

  return (
    <button
      onClick={handleClick}
      disabled={isPending || isActionPending}
      className={buttonClasses}
      aria-label={
        favorited
          ? t('favorites.remove', 'Elimină din favorite')
          : t('favorites.add', 'Adaugă la favorite')
      }
      title={
        favorited
          ? t('favorites.remove', 'Elimină din favorite')
          : t('favorites.add', 'Adaugă la favorite')
      }
    >
      <Heart
        className={cn(
          sizeClasses[size],
          'transition-all',
          favorited && 'fill-current',
          isAnimating && 'scale-125'
        )}
      />
      {showLabel && (
        <span className="ml-2 text-sm">
          {favorited
            ? t('favorites.remove', 'Elimină')
            : t('favorites.add', 'Adaugă')}
        </span>
      )}
    </button>
  )
}

