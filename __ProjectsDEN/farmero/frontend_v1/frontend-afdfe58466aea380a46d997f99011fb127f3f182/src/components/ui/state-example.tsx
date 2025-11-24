/**
 * State Examples - Reference Implementation
 * 
 * Acest fișier demonstrează pattern-ul standard pentru loading/empty/error states.
 * Folosește-l ca referință când implementezi state-uri în componente.
 * 
 * ⚠️ Acest fișier este doar pentru referință - nu îl importa în producție.
 */

'use client'

import { useState } from 'react'
import { Package, ShoppingBag, AlertCircle } from 'lucide-react'
import { GridSkeleton, ListSkeleton } from './unified-skeletons'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { getUserFriendlyErrorMessage } from '@/lib/utils/error-handling'
import { useI18n } from '@/lib/i18n/context'

/**
 * Example: Products List Component
 * 
 * Demonstrează pattern-ul complet: Loading → Error → Empty → Success
 */
export function ProductsListExample() {
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [products, setProducts] = useState<any[]>([])

  // 1. Loading State
  if (isLoading) {
    return <GridSkeleton count={6} columns={3} />
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorState
        title={t('errors.loadFailed', 'Eroare la încărcare')}
        message={getUserFriendlyErrorMessage(error)}
        onRetry={() => {
          setError(null)
          setIsLoading(true)
          // refetch()
        }}
      />
    )
  }

  // 3. Empty State
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={t('emptyStates.products.title', 'Nu există produse disponibile')}
        description={t('emptyStates.products.description', 'Încearcă să modifici filtrele sau să revii mai târziu.')}
        action={{
          label: t('emptyStates.products.clearFilters', 'Șterge filtre'),
          onClick: () => {
            // handleClearFilters()
          },
          variant: 'outline'
        }}
      />
    )
  }

  // 4. Success State - Render data
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id}>{/* Product card */}</div>
      ))}
    </div>
  )
}

/**
 * Example: Orders List Component
 * 
 * Demonstrează empty state cu acțiune către altă pagină
 */
export function OrdersListExample() {
  const { t } = useI18n()
  const orders: any[] = []

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t('emptyStates.orders.title', 'Nu ai comenzi')}
        description={t('emptyStates.orders.description', 'Începe să cumperi pentru a vedea comenzile tale aici.')}
        action={{
          label: t('emptyStates.orders.startShopping', 'Începe să cumperi'),
          href: '/products'
        }}
      />
    )
  }

  return <div>{/* Orders list */}</div>
}

/**
 * Example: Error State cu acțiune custom
 */
export function ErrorWithCustomActionExample() {
  const { t } = useI18n()
  const error = new Error('Network error')

  return (
    <ErrorState
      message={getUserFriendlyErrorMessage(error)}
      action={{
        label: t('errors.contactSupport', 'Contactează suportul'),
        onClick: () => {
          // router.push('/contact')
        },
        variant: 'outline'
      }}
    />
  )
}

/**
 * Example: Empty State fără Card wrapper
 */
export function EmptyStateWithoutCardExample() {
  const { t } = useI18n()

  return (
    <EmptyState
      icon={Package}
      title="Nu există date"
      description="Descriere utilă."
      card={false}
      size="sm"
    />
  )
}

