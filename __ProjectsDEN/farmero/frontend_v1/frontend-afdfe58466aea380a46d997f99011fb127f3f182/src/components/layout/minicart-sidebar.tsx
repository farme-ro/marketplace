/**
 * Minicart Sidebar
 * 
 * Sidebar pentru coșul de cumpărături (right side)
 * Cu animații slide-in/slide-out și keyboard support
 */

'use client'

import { useEffect, useRef, memo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore, useCartItemCount, useCartTotal } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { formatCurrency } from '@/lib/utils/format'
import { Button } from 'farme-ui'
import { cn } from '@/lib/utils/cn'
import { ImpactBanner } from '@/components/impact/impact-banner'
import { ProducerPriceBadge } from '@/components/impact/producer-price-badge'
import { TrustStack } from '@/components/trust/trust-stack'

export interface MinicartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const MinicartSidebar = memo(function MinicartSidebar({ isOpen, onClose }: MinicartSidebarProps) {
  const router = useRouter()
  const { items, removeItem, updateQuantity } = useCartStore()
  const cartCount = useCartItemCount()
  const total = useCartTotal()
  const { locale } = useI18n()
  const { t } = useI18n()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      // Focus pe sidebar când se deschide
      setTimeout(() => {
        const firstButton = sidebarRef.current?.querySelector<HTMLElement>('button, a')
        firstButton?.focus()
      }, 100)
    } else {
      // Restaurează focus-ul când se închide
      previousActiveElement.current?.focus()
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    return () => {
      // Cleanup on unmount
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      const sidebar = sidebarRef.current
      if (!sidebar) return

      const focusableElements = sidebar.querySelectorAll<HTMLElement>(
        'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  function handleCheckout() {
    onClose()
    router.push(routes.checkout)
  }

  function handleViewCart() {
    onClose()
    router.push(routes.cart)
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-96 bg-background',
          'border-l border-border shadow-lg',
          'transform transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="complementary"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {t('navbar.cart', 'Coș')} ({cartCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-16 h-16 text-muted-foreground mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-muted-foreground mb-2">
                {t('cart.empty', 'Coșul tău este gol')}
              </p>
              <Link
                href="/produse"
                onClick={onClose}
                className="text-primary hover:underline"
              >
                {t('cart.startShopping', 'Începe să cumperi')}
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-4 p-4 border border-border rounded-lg"
                >
                  {item.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.producerName}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium text-foreground min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-muted"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <span className="ml-auto text-sm font-semibold text-foreground">
                        {formatCurrency(item.price * item.quantity, locale)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="mt-2 text-xs text-destructive hover:underline"
                    >
                      {t('common.delete', 'Șterge')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Impact Banner */}
        {items.length > 0 && (
          <div className="px-4 pb-4">
            <ImpactBanner context="cart" />
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-lg font-semibold text-foreground mb-3">
              <span>{t('cart.total', 'Total')}:</span>
              <span>{formatCurrency(total, locale)}</span>
            </div>
            <div className="space-y-2 pb-2">
              <div className="flex justify-center">
                <ProducerPriceBadge variant="compact" showTooltip={false} />
              </div>
              <div className="flex justify-center">
                <TrustStack
                  badges={['verified-producers', 'secure-payment']}
                  variant="compact"
                  layout="horizontal"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="default"
                className="flex-1"
                onClick={handleViewCart}
              >
                {t('cart.viewCart', 'Vezi coșul')}
              </Button>
              <Button
                variant="primary"
                size="default"
                className="flex-1"
                onClick={handleCheckout}
              >
                {t('cart.checkout', 'Checkout')}
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
})

