/**
 * Producer Products Section Component
 * 
 * Grid elegant cu produse disponibile și filtre
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { ProductCard } from '@/components/ui/product-card'
import { getProducts } from '@/lib/api/public/products'
import type { ProductSummary } from '@/types/public'
import { Skeleton } from 'farme-ui'
import { useCart } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'

interface ProducerProductsSectionProps {
  producerId: string
  producerSlug: string
}

export function ProducerProductsSection({
  producerId,
  producerSlug,
}: ProducerProductsSectionProps) {
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showBioOnly, setShowBioOnly] = useState(false)
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const { addItem } = useCart()
  const { t } = useI18n()

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        // Note: Filter by producerId will be available when backend API supports it
        const response = await getProducts({ pageSize: 50 })
        // Map Product[] to ProductSummary[] ensuring unit is always present
        const mappedProducts: ProductSummary[] = (response.data || []).map(product => ({
          ...product,
          unit: product.unit || 'buc',
        })) as ProductSummary[]
        setProducts(mappedProducts)
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[ProducerProductsSection] Error fetching products:', error)
        }
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: ProductSummary) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: 1,
      image: product.imageUrl,
      producerName: product.producerName,
      producerId: '', // Will be set by the cart store
      slug: product.slug || product.id,
    })
  }

  const filteredProducts = products.filter(product => {
    if (showBioOnly && !product.isBio) return false
    if (showAvailableOnly && product.stock === 0) return false
    return true
  })

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-primary-bg/30">
        <PageContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96 rounded-[32px]" />
            ))}
          </div>
        </PageContainer>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-primary-bg/30">
      <PageContainer className="max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {t('producers.detail.productsAvailable', 'Produse Disponibile')}
              </h2>
              <p className="text-base md:text-lg text-foreground-body">
                {t('producers.detail.productsCount', '{count} produse disponibile').replace('{count}', filteredProducts.length.toString())}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={showBioOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowBioOnly(!showBioOnly)}
                className="rounded-full"
              >
                🌾 BIO
              </Button>
              <Button
                variant={showAvailableOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                className="rounded-full"
              >
                📦 Disponibil
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  unit={product.unit}
                  producerName={product.producerName}
                  producerSlug={product.producerSlug}
                  regionName={product.regionName}
                  isTraditional={product.isTraditional}
                  isBio={product.isBio}
                  imageUrl={product.imageUrl}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border border-border rounded-[32px] shadow-premium bg-card">
            <CardContent className="p-12 text-center">
              <p className="text-foreground-body">
                {t('producers.detail.productsEmpty', 'Nu există produse disponibile momentan.')}
              </p>
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </section>
  )
}

