/**
 * Popular Products Carousel Component
 * 
 * Carousel modern cu produse populare
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { getProducts } from '@/lib/api/public/products'
import type { ProductSummary } from '@/types/public'
import { Skeleton } from 'farme-ui'
import { useCart } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'

export function PopularProductsCarousel() {
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const { t, locale } = useI18n()

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    
    async function fetchProducts() {
      try {
        setIsLoading(true)
        setHasError(false)
        
        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            abortController.abort()
            setHasError(true)
            setProducts([])
            setIsLoading(false)
          }
        }, 5000) // 5 second timeout
        
        const response = await getProducts({ pageSize: 8 })
        
        clearTimeout(timeoutId)
        
        if (isMounted) {
          // Map Product[] to ProductSummary[] ensuring unit is always present
          const mappedProducts: ProductSummary[] = (response.data || []).map(product => ({
            ...product,
            unit: product.unit || 'buc',
          })) as ProductSummary[]
          setProducts(mappedProducts)
          setIsLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[PopularProductsCarousel] Error fetching products:', error)
          }
          setHasError(true)
          setProducts([])
          setIsLoading(false)
        }
      }
    }

    fetchProducts()
    
    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  const handleAddToCart = (product: ProductSummary) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: 1,
      image: product.imageUrl || null,
      producerName: product.producerName,
      producerId: '', // ProductSummary doesn't have producerId, will be set by cart store
      slug: product.slug,
    })
  }

  // Don't show loading state for too long - hide section if error or timeout
  if (isLoading && !hasError) {
    return (
      <section className="py-16 md:py-24 bg-primary-bg/30">
        <PageContainer>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-64 h-80 rounded-[32px] flex-shrink-0" />
            ))}
          </div>
        </PageContainer>
      </section>
    )
  }

  // Hide section if no products or error/timeout
  if (products.length === 0 || hasError) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-primary-bg/30">
      <PageContainer className="max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('home.products.title', 'Produse populare')}
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            {t('home.products.subtitle', 'Descoperă cele mai căutate produse tradiționale')}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -8 }}
                className="flex-shrink-0 w-64"
              >
                <Card className="border border-border rounded-[32px] shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card overflow-hidden h-full">
                  <Link href={`/products/${product.slug}`}>
                    {/* Product Image */}
                    <div className="relative h-48 bg-muted">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl">📦</span>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isBio && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-primary-soft text-primary text-xs font-semibold rounded-full border border-primary/20">
                            BIO
                          </span>
                        )}
                        {product.isTraditional && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full border border-secondary/20">
                            {t('ui.badges.traditional', 'Tradițional')}
                          </span>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-foreground-body mb-3">
                        {t('cart.fromProducer', 'de la')} {product.producerName}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            {formatCurrency(product.price, locale)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            / {product.unit}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                  <div className="px-5 pb-5">
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(product)
                      }}
                    >
                      {t('actions.addToCart', 'Adaugă în coș')}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/produse">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-3"
            >
              {t('home.products.viewAll', 'Vezi toate produsele')} →
            </Button>
          </Link>
        </div>
      </PageContainer>
    </section>
  )
}

