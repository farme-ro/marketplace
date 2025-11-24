/**
 * Category Card Component
 * 
 * Component reutilizabil pentru cardurile de categorie
 * Suportă toate state-urile: default, hover, active, focus, selected, disabled
 * Design consistent cu Farmero card style
 */

'use client'

import Link from 'next/link'
import { forwardRef, useCallback, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { getCategoryColor } from '@/lib/categories/category-colors'

export interface CategoryCardProps {
  id: string
  icon: React.ReactNode // Icon component (SVG)
  label: string // Text localizat (deja tradus)
  description?: string // Text scurt sub label (opțional)
  href?: string // Link Next.js
  isActive?: boolean // Categoria curent selectată
  isDisabled?: boolean // Dacă categoria e indisponibilă
  onClick?: () => void // Pentru cazul când nu folosim href
  selectedLabel?: string // Label pentru indicatorul "Selected" (i18n)
  className?: string
  'aria-label'?: string
  categorySlug?: string // Slug-ul categoriei pentru culori specifice
}

export const CategoryCard = forwardRef<HTMLDivElement, CategoryCardProps>(
  (
    {
      id,
      icon,
      label,
      description,
      href,
      isActive = false,
      isDisabled = false,
      onClick,
      selectedLabel,
      className,
      'aria-label': ariaLabel,
      categorySlug,
    },
    ref
  ) => {
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (isDisabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      },
      [onClick, isDisabled]
    )

    // Get category-specific colors
    const colors = categorySlug ? getCategoryColor(categorySlug) : null
    const categoryPrimary = colors?.primary || 'hsl(var(--primary))'
    const categorySoft = colors?.soft || 'hsl(var(--primary-soft))'
    const categoryShadow = colors?.shadow || 'hsl(var(--primary))'

    // Base classes pentru card - Redesign cu culori specifice
    const baseClasses = cn(
      // Layout
      'group relative flex flex-col items-center', // items-center pentru centrare
      'rounded-3xl border-2 transition-all duration-300 ease-out',
      'px-5 pt-12 pb-6 md:px-6 md:pt-14 md:pb-7', // Padding top mai mare pentru icon
      'h-full w-full overflow-visible', // overflow-visible pentru a permite iconului să iasă
      // Default state - Background gradient cu culoare specifică categoriei
      colors 
        ? 'bg-gradient-to-br from-white via-white to-[var(--category-soft)]'
        : 'bg-gradient-to-br from-card via-card to-muted/30',
      'border-border/50 shadow-sm',
      // Hover state (doar dacă nu e disabled) - cu shadow specific categoriei
      !isDisabled && [
        'hover:-translate-y-1 hover:scale-[1.02]',
        colors 
          ? 'hover:border-[var(--category-primary)]/50'
          : 'hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10',
        colors
          ? 'hover:bg-gradient-to-br hover:from-white hover:via-[var(--category-soft)]/30 hover:to-[var(--category-soft)]/50'
          : 'hover:bg-gradient-to-br hover:from-card hover:via-primary/5 hover:to-primary-soft/10',
      ],
      // Active/Selected state - cu culori specifice
      isActive && [
        colors
          ? 'border-[var(--category-primary)]/60 shadow-lg ring-2 ring-[var(--category-primary)]/20'
          : 'border-primary/60 shadow-lg shadow-primary/20 ring-2 ring-primary/20',
        colors
          ? 'bg-gradient-to-br from-[var(--category-primary)]/10 via-[var(--category-soft)]/20 to-[var(--category-soft)]/30'
          : 'bg-gradient-to-br from-primary/10 via-primary-soft/15 to-primary-soft/20',
      ],
      // Disabled state
      isDisabled && [
        'opacity-50 cursor-not-allowed grayscale',
        'hover:translate-y-0 hover:shadow-sm hover:scale-100',
        'hover:bg-gradient-to-br hover:from-card hover:via-card hover:to-muted/30',
      ],
      // Focus ring (keyboard navigation)
      'focus-visible:outline-none focus-visible:ring-2',
      colors 
        ? 'focus-visible:ring-[var(--category-primary)]/50'
        : 'focus-visible:ring-primary/50',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      className
    )

    // Style object pentru CSS custom properties
    const style = colors ? {
      '--category-primary': categoryPrimary,
      '--category-soft': categorySoft,
      '--category-shadow': categoryShadow,
    } as React.CSSProperties & { 
      '--category-primary': string
      '--category-soft': string
      '--category-shadow': string
    } : undefined

    // Icon container classes - cu background, padding egal și border
    const iconContainerClasses = cn(
      'flex items-center justify-center',
      'rounded-2xl transition-all duration-300',
      'p-4', // Padding egal în jurul iconului
      'relative -mt-[85px]', // Margin negativ de 85px pentru a ridica iconul și textul
      'self-center', // Centrare orizontală (stânga-dreapta)
      'border-2', // Border pentru background
      // Background gradient cu culoare specifică
      colors
        ? 'bg-gradient-to-br from-[var(--category-soft)]/50 via-[var(--category-soft)]/40 to-[var(--category-primary)]/30'
        : 'bg-gradient-to-br from-primary-soft/40 via-primary-soft/30 to-primary/20',
      // Border color
      colors
        ? 'border-[var(--category-primary)]/30'
        : 'border-primary/30',
      colors ? 'text-[var(--category-primary)]' : 'text-primary',
      // Hover - scale cu tot cu background + drop shadow (se aplică când hover pe card)
      !isDisabled && [
        colors
          ? 'group-hover:bg-gradient-to-br group-hover:from-[var(--category-primary)]/40 group-hover:via-[var(--category-soft)]/50 group-hover:to-[var(--category-soft)]/60'
          : 'group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:via-primary-soft/40 group-hover:to-primary-soft/50',
        'group-hover:scale-110',
        colors
          ? 'group-hover:shadow-lg group-hover:shadow-[var(--category-shadow)]/50 group-hover:border-[var(--category-primary)]/50'
          : 'group-hover:shadow-lg group-hover:shadow-primary/40 group-hover:border-primary/50',
      ],
      // Active/Selected - Stronger gradient cu culoare specifică
      isActive && [
        colors
          ? 'bg-gradient-to-br from-[var(--category-primary)]/50 via-[var(--category-soft)]/60 to-[var(--category-soft)]/70'
          : 'bg-gradient-to-br from-primary/40 via-primary-soft/50 to-primary-soft/60',
        colors
          ? 'shadow-md shadow-[var(--category-shadow)]/40 ring-2 ring-[var(--category-primary)]/40'
          : 'shadow-md shadow-primary/30 ring-2 ring-primary/30',
      ],
      // Disabled
      isDisabled && 'opacity-50'
    )

    // Label classes - Enhanced typography cu culori specifice
    const labelClasses = cn(
      'text-sm md:text-base font-bold text-center',
      'text-foreground transition-colors duration-300',
      'tracking-tight',
      !isDisabled && (colors ? 'group-hover:text-[var(--category-primary)]' : 'group-hover:text-primary'),
      isActive && (colors ? 'text-[var(--category-primary)] font-extrabold' : 'text-primary font-extrabold')
    )

    // Description classes - Better readability
    const descriptionClasses = cn(
      'text-xs md:text-sm text-muted-foreground/80 text-center',
      'line-clamp-2 leading-relaxed',
      'transition-colors duration-300',
      !isDisabled && 'group-hover:text-muted-foreground',
      isActive && 'text-foreground/70'
    )

    // Active indicator (pill în colțul stânga sus) - cu culoare specifică
    const activeIndicator = isActive && selectedLabel && (
      <div className="absolute top-3 left-3 z-10">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-lg ring-2',
            colors
              ? 'bg-gradient-to-r from-[var(--category-primary)] to-[var(--category-soft)] shadow-[var(--category-shadow)]/30 ring-[var(--category-primary)]/20'
              : 'bg-gradient-to-r from-primary to-primary-soft shadow-primary/30 ring-primary/20'
          )}
        >
          {selectedLabel}
        </motion.span>
      </div>
    )

    // Decorative background element cu culoare specifică
    const decorativeBg = !isDisabled && (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {colors ? (
          <>
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: `${categoryPrimary}15` }} />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-2xl" style={{ backgroundColor: `${categorySoft}20` }} />
          </>
        ) : (
          <>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary-soft/10 rounded-full blur-2xl" />
          </>
        )}
      </div>
    )

    // Content
    const content = (
      <div className="relative w-full h-full flex flex-col items-center z-10">
        {decorativeBg}
        {activeIndicator}
        {/* Icon container with background and padding */}
        <motion.div
          className={iconContainerClasses}
          whileHover={!isDisabled ? { 
            scale: 1.1,
            transition: { duration: 0.3, ease: "easeOut" }
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
            {icon}
          </div>
        </motion.div>

        {/* Text content - centrat */}
        <div className="flex flex-col items-center gap-1.5 w-full mt-4">
          <span className={labelClasses}>{label}</span>
          {description && (
            <span className={descriptionClasses}>{description}</span>
          )}
        </div>
      </div>
    )

    // Render ca Link sau div/button cu style pentru CSS vars
    if (href && !isDisabled) {
      return (
        <Link
          href={href}
          className={baseClasses}
          style={style}
          onMouseEnter={(e) => {
            if (colors && !isDisabled) {
              e.currentTarget.style.boxShadow = `0 20px 25px -5px ${categoryShadow}25, 0 10px 10px -5px ${categoryShadow}15`
            }
          }}
          onMouseLeave={(e) => {
            if (colors && !isDisabled) {
              e.currentTarget.style.boxShadow = isActive 
                ? `0 10px 25px -5px ${categoryShadow}40, 0 0 0 2px ${categoryPrimary}30`
                : ''
            }
          }}
          aria-label={ariaLabel || label}
          aria-current={isActive ? 'page' : undefined}
          role="link"
        >
          {content}
        </Link>
      )
    }

    if (onClick && !isDisabled) {
      return (
        <motion.div
          ref={ref}
          className={baseClasses}
          style={style}
          onMouseEnter={(e) => {
            if (colors && !isDisabled) {
              e.currentTarget.style.boxShadow = `0 20px 25px -5px ${categoryShadow}25, 0 10px 10px -5px ${categoryShadow}15`
            }
          }}
          onMouseLeave={(e) => {
            if (colors && !isDisabled) {
              e.currentTarget.style.boxShadow = isActive 
                ? `0 10px 25px -5px ${categoryShadow}40, 0 0 0 2px ${categoryPrimary}30`
                : ''
            }
          }}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={ariaLabel || label}
          aria-pressed={isActive}
          aria-disabled={isDisabled}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
        >
          {content}
        </motion.div>
      )
    }

    // Disabled state - render ca div
    return (
      <div
        ref={ref}
        className={baseClasses}
        style={style}
        aria-label={ariaLabel || label}
        aria-disabled="true"
        role="button"
      >
        {content}
      </div>
    )
  }
)

CategoryCard.displayName = 'CategoryCard'

