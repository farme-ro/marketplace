'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from 'farme-ui'
import { getProducts, type GetProductsParams } from '@/lib/api/public/products'
import type { PaginatedResponse } from '@/types/public'
import type { Product } from '@/lib/types/domain'
import { ProductCard } from '@/components/ui/product-card'
import { PageContainer } from '@/components/layout/page-container'
import { Skeleton } from 'farme-ui'
import { useCartStore } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { addItem } = useCartStore()
  const { t } = useI18n()

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
        
        const params: GetProductsParams = {
          page: 1,
          pageSize: 6,
        }
        const response = await getProducts(params)
        
        clearTimeout(timeoutId)
        
        if (isMounted) {
          setProducts(response.data || [])
          setIsLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[ProductsSection] Error fetching products:', error)
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

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      producerId: product.producerSlug || product.producerId || '',
      producerName: product.producerName || '',
      price: product.price,
      quantity: 1,
      image: product.imageUrl,
      unit: product.unit || 'buc',
      slug: product.slug,
    })
  }

  // Don't show loading state for too long - hide section if error or timeout
  if (isLoading && !hasError) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <PageContainer>
          <h2 className="text-2xl md:text-3xl font-semibold mb-12 text-foreground">
            {t('home.products.title', 'Produse populare')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height="400px" className="rounded-2xl" />
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
    <section className="py-16 md:py-24 bg-muted/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-foreground">
                {t('home.products.title', 'Produse populare')}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {t('home.products.subtitle', 'Descoperă cele mai căutate produse tradiționale')}
              </p>
            </div>
            <Link href={routes.products.list} className="hidden md:flex">
              <Button 
                variant="outline"
                aria-label={t('home.products.viewAllAria', 'Vezi toate produsele disponibile')}
              >
                {t('home.products.viewAll', 'Vezi toate produsele')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
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
              </motion.div>
            ))}
          </div>

          <div className="text-center md:hidden">
            <Link href={routes.products.list} className="inline-block w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                {t('home.products.viewAll', 'Vezi toate produsele')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
