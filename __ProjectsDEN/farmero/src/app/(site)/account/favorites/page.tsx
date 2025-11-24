/**
 * Favorites Page
 * 
 * Pagină pentru afișarea produselor și producătorilor favoriți
 * Include opțiuni pentru notificări (alerts)
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RequireAuth } from '@/components/auth/require-auth'
import { useFavoritesStore, useFavorites } from '@/lib/store/favorites'
import { useI18n } from '@/lib/i18n/context'
import { ProductCard } from '@/components/ui/product-card'
import { ProducerCard } from '@/components/ui/producer-card'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { Button } from 'farme-ui'
import { Heart, Package, Building2, Bell, ChevronDown, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { getProducts } from '@/lib/api/public/products'
import { getProducers } from '@/lib/api/public/producers'
import { getAlertPreferences, updateAlertPreferences } from '@/lib/api/alerts'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/lib/types/domain'
import type { Producer } from '@/lib/types/domain'
import type { FavoriteAlertPreference, AlertType } from '@/lib/types/alerts'

export default function FavoritesPage() {
  const { t } = useI18n()
  const favorites = useFavorites()
  const { loadFavorites, status } = useFavoritesStore()
  const { addItem } = useCartStore()
  
  const [productFavorites, setProductFavorites] = useState<Product[]>([])
  const [producerFavorites, setProducerFavorites] = useState<Producer[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isLoadingProducers, setIsLoadingProducers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alertPreferences, setAlertPreferences] = useState<FavoriteAlertPreference[]>([])
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false)
  const [openAlertMenuId, setOpenAlertMenuId] = useState<string | null>(null)
  const { showToast } = useToast()

  // Load favorites on mount
  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  // Load product and producer data for favorites
  useEffect(() => {
    async function loadFavoriteData() {
      const productFavs = favorites.filter(f => f.targetType === 'product')
      const producerFavs = favorites.filter(f => f.targetType === 'producer')

      if (productFavs.length > 0) {
        setIsLoadingProducts(true)
        try {
          // Fetch products by IDs
          // Note: Backend should support GET /products?ids=... for bulk fetch when available
          const products: Product[] = []
          try {
            // For now, fetch all products and filter by favorite IDs
            // This should be optimized with a bulk endpoint when available
            const response = await getProducts({ pageSize: 1000 })
            const allProducts = response.data || []
            for (const fav of productFavs) {
              const product = allProducts.find(p => p.id === fav.targetId)
              if (product) products.push(product)
            }
          } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.error('Failed to load favorite products:', err)
            }
          }
          setProductFavorites(products)
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Failed to load favorite products:', err)
          }
        } finally {
          setIsLoadingProducts(false)
        }
      }

      if (producerFavs.length > 0) {
        setIsLoadingProducers(true)
        try {
          // Fetch producers by IDs
          // Note: Backend should support GET /producers?ids=... for bulk fetch when available
          const producers: Producer[] = []
          try {
            // For now, fetch all producers and filter by favorite IDs
            // This should be optimized with a bulk endpoint when available
            const response = await getProducers({ pageSize: 1000 })
            const allProducers = response.data || []
            for (const fav of producerFavs) {
              const producer = allProducers.find(p => p.id === fav.targetId)
              if (producer) producers.push(producer)
            }
          } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
              // eslint-disable-next-line no-console
              console.error('Failed to load favorite producers:', err)
            }
          }
          setProducerFavorites(producers)
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('Failed to load favorite producers:', err)
          }
        } finally {
          setIsLoadingProducers(false)
        }
      }
    }

    if (favorites.length > 0) {
      loadFavoriteData()
    } else {
      setProductFavorites([])
      setProducerFavorites([])
    }
  }, [favorites])

  const handleAddToCart = (product: Product) => {
    try {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        unit: product.unit || 'buc',
        image: product.imageUrl || undefined,
        producerName: product.producerName || '',
        producerId: product.producerSlug || product.producerId || '',
        slug: product.slug,
      })
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Failed to add to cart:', err)
      }
    }
  }

  const handleToggleAlert = async (
    targetType: 'product' | 'producer',
    targetId: string,
    alertType: AlertType
  ) => {
    if (!isBackendSyncEnabled('alerts')) {
      showToast(
        t('alerts.notAvailable', 'Notificările nu sunt disponibile încă'),
        'info'
      )
      return
    }

    try {
      const currentPref = alertPreferences.find(
        p => p.targetType === targetType && p.targetId === targetId
      )
      
      const currentAlertTypes = currentPref?.alertTypes || []
      const isEnabled = currentAlertTypes.includes(alertType)
      
      const newAlertTypes = isEnabled
        ? currentAlertTypes.filter(t => t !== alertType)
        : [...currentAlertTypes, alertType]
      
      // If no alerts left, remove preference; otherwise update/create
      const updatedPreferences = newAlertTypes.length === 0
        ? alertPreferences.filter(
            p => !(p.targetType === targetType && p.targetId === targetId)
          )
        : [
            ...alertPreferences.filter(
              p => !(p.targetType === targetType && p.targetId === targetId)
            ),
            {
              targetType,
              targetId,
              alertTypes: newAlertTypes,
              priceDropThreshold: alertType === 'price_drop' ? 10 : undefined,
            },
          ]
      
      const saved = await updateAlertPreferences({ preferences: updatedPreferences })
      setAlertPreferences(saved)
      
      showToast(
        t('alerts.preferencesSaved', 'Preferințele au fost salvate'),
        'success'
      )
      
      // Close menu if all alerts are disabled
      if (newAlertTypes.length === 0) {
        setOpenAlertMenuId(null)
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Failed to update alert preferences:', err)
      }
      showToast(
        err instanceof Error ? err.message : t('alerts.updateError', 'Eroare la actualizarea preferințelor.'),
        'error'
      )
    }
  }

  const isLoading = status === 'loading' || isLoadingProducts || isLoadingProducers
  const hasFavorites = favorites.length > 0
  const hasProducts = productFavorites.length > 0
  const hasProducers = producerFavorites.length > 0

  return (
    <RequireAuth role="client" fallbackRedirect="/login-client?redirect=/account/favorites">
      <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-8xl mx-auto px-4 py-10 md:py-16">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                {t('favorites.myFavorites', 'Favoritele mele')}
              </h1>
              <p className="text-base text-muted-foreground">
                {t('favorites.title', 'Produse și producători pe care îi preferi')}
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    {t('favorites.loading', 'Se încarcă favoritele...')}
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !hasFavorites && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {t('favorites.empty', 'Nu ai favorite încă')}
                </h2>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  {t('favorites.emptyDescription', 'Adaugă produse și producători la favorite pentru a-i găsi rapid.')}
                </p>
                <div className="flex gap-4">
                  <Link href="/produse">
                    <Button variant="default">
                      {t('common.products', 'Produse')}
                    </Button>
                  </Link>
                  <Link href="/producatori">
                    <Button variant="outline">
                      {t('common.producers', 'Producători')}
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Content */}
            {!isLoading && hasFavorites && (
              <div className="space-y-12">
                {/* Products Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Package className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">
                      {t('favorites.products', 'Produse favorite')}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      ({productFavorites.length})
                    </span>
                  </div>

                  {!hasProducts ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {t('favorites.emptyProducts', 'Nu ai produse favorite')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {productFavorites.map((product) => {
                        const productAlertPref = alertPreferences.find(
                          p => p.targetType === 'product' && p.targetId === product.id
                        )
                        const isAlertMenuOpen = openAlertMenuId === product.id
                        
                        return (
                          <div key={product.id} className="relative">
                            <ProductCard
                              id={product.id}
                              slug={product.slug}
                              name={product.name}
                              price={product.price}
                              unit={product.unit || 'buc'}
                              producerName={product.producerName || ''}
                              producerSlug={product.producerSlug || ''}
                              regionName={product.regionName}
                              isTraditional={product.isTraditional}
                              isBio={product.isBio}
                              imageUrl={product.imageUrl}
                              onAddToCart={() => handleAddToCart(product)}
                            />
                            {/* Alert Preferences Menu */}
                            {isBackendSyncEnabled('alerts') && (
                              <div className="absolute top-2 right-2 z-10">
                                <div className="relative">
                                  <button
                                    onClick={() => setOpenAlertMenuId(isAlertMenuOpen ? null : product.id)}
                                    className={cn(
                                      'p-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border',
                                      'hover:bg-muted transition-colors',
                                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                                    )}
                                    aria-label={t('alerts.notifyMe', 'Notifică-mă când')}
                                    title={t('alerts.notifyMe', 'Notifică-mă când')}
                                  >
                                    <Bell className={cn(
                                      'w-4 h-4',
                                      productAlertPref && productAlertPref.alertTypes.length > 0
                                        ? 'text-primary fill-current'
                                        : 'text-muted-foreground'
                                    )} />
                                  </button>
                                  
                                  {isAlertMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50 p-2">
                                      <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                                        {t('alerts.notifyMe', 'Notifică-mă când')}
                                      </div>
                                      <div className="space-y-1">
                                        {(['price_drop', 'back_in_stock'] as AlertType[]).map((alertType) => {
                                          const isEnabled = productAlertPref?.alertTypes.includes(alertType) || false
                                          
                                          return (
                                            <button
                                              key={alertType}
                                              onClick={async () => {
                                                await handleToggleAlert('product', product.id, alertType)
                                              }}
                                              className={cn(
                                                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                                                'hover:bg-muted flex items-center justify-between',
                                                isEnabled && 'bg-primary/10'
                                              )}
                                            >
                                              <span>
                                                {alertType === 'price_drop'
                                                  ? t('alerts.priceDrop', 'scade prețul')
                                                  : t('alerts.backInStock', 'revine în stoc')}
                                              </span>
                                              {isEnabled && (
                                                <Check className="w-4 h-4 text-primary" />
                                              )}
                                            </button>
                                          )
                                        })}
                                      </div>
                                      <div className="mt-2 pt-2 border-t border-border">
                                        <p className="text-xs text-muted-foreground px-2">
                                          {t('alerts.priceDropDescription', 'Te anunțăm discret când acest produs intră la promoție sau revine în stoc.')}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>

                {/* Producers Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">
                      {t('favorites.producers', 'Producători favoriți')}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      ({producerFavorites.length})
                    </span>
                  </div>

                  {!hasProducers ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {t('favorites.emptyProducers', 'Nu ai producători favoriți')}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {producerFavorites.map((producer) => (
                        <ProducerCard
                          key={producer.id}
                          id={producer.id}
                          slug={producer.slug}
                          name={producer.name}
                          description={producer.description}
                          avatarUrl={producer.logoUrl}
                          regionName={producer.regionName}
                          productCount={producer.productCount}
                          tags={producer.tags}
                          isVerified={producer.isVerified}
                          partnerSince={producer.partnerSince}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
    </RequireAuth>
  )
}

