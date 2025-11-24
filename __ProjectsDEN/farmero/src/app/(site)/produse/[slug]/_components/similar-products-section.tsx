/**
 * Similar Products Section
 * 
 * Secțiune pentru produse similare de la alți producători
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { fetchPublicProducts } from '@/lib/api/public/products'
import { useCartStore } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'
import type { PublicProduct } from '@/lib/api/public/products'
import { Package } from 'lucide-react'

interface SimilarProductsSectionProps {
  currentProduct: {
    id: string
    category?: {
      id: string
    }
    producer?: {
      id: string
    }
  }
}

export function SimilarProductsSection({ currentProduct }: SimilarProductsSectionProps) {
  const [similarProducts, setSimilarProducts] = useState<PublicProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCartStore()
  const { t, locale } = useI18n()

  useEffect(() => {
    async function loadSimilarProducts() {
      try {
        setIsLoading(true)
        
        // Try to fetch products from same category first
        let fetchedProducts = []
        
        if (currentProduct.category?.id) {
          fetchedProducts = await fetchPublicProducts({
            categoryId: currentProduct.category.id,
            pageSize: 4,
          })
        } else {
          // Fallback: get random products
          fetchedProducts = await fetchPublicProducts({
            pageSize: 4,
          })
        }
        
        // Map products to ensure all required PublicProduct fields are present
        const products: PublicProduct[] = fetchedProducts.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          unit: p.unit || 'buc',
          producerName: p.producerName || '',
          producerSlug: p.producerSlug || '',
          regionName: p.regionName,
          regionId: p.regionId,
          isTraditional: p.isTraditional ?? false,
          isBio: p.isBio ?? false,
          imageUrl: p.imageUrl,
          stock: p.stock ?? 0,
          status: p.status || 'APPROVED',
          description: p.description,
          producer: p.producerId ? {
            id: p.producerId,
            name: p.producerName || '',
            slug: p.producerSlug || '',
            region: p.regionName,
          } : undefined,
        }))
        
        // Filter out current product and products from same producer
        const filtered = products
          .filter(p => 
            p.id !== currentProduct.id && 
            p.producer?.id !== currentProduct.producer?.id
          )
          .slice(0, 4)
        
        setSimilarProducts(filtered)
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading similar products:', error)
        }
        // On error, just show empty state
        setSimilarProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSimilarProducts()
  }, [currentProduct.id, currentProduct.category?.id, currentProduct.producer?.id])

  const handleAddToCart = async (product: PublicProduct) => {
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        producerId: product.producer?.id || '',
        producerName: product.producer?.name || '',
        price: product.price,
        quantity: 1,
        unit: product.unit || 'buc',
        slug: product.slug,
        image: product.imageUrl,
      })
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error adding to cart:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
          {t('product.similarProducts', 'Produse similare de la alți producători')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-border rounded-2xl bg-card animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (similarProducts.length === 0) {
    return null
  }

  return (
    <section className="space-y-3 border-t border-border pt-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
        {t('product.similarProducts', 'Produse similare de la alți producători')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {similarProducts.map((product) => (
          <Card key={product.id} className="border border-border rounded-2xl bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link href={`/products/${product.slug}`} className="block mb-3">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted mb-3">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Link>
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-foreground mb-1 line-clamp-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              {product.producer && (
                <p className="text-xs text-muted-foreground mb-2">
                  {product.producer.name}
                </p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-foreground">
                  {formatCurrency(product.price, locale)}
                  {product.unit && (
                    <span className="text-xs text-muted-foreground font-normal">/{product.unit}</span>
                  )}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  className="rounded-full"
                >
                  {t('actions.addToCart', 'Adaugă în coș')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

