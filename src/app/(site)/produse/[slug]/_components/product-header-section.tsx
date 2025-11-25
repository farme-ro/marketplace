/**
 * Product Header Section
 * 
 * Header section cu layout 2 coloane pentru pagina de detaliu produs
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button, Badge } from 'farme-ui'
import { ProducerPriceBadge } from '@/components/impact/producer-price-badge'
import { TrustStack } from '@/components/trust/trust-stack'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { useCartStore } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'
import { useState } from 'react'

interface ProductHeaderSectionProps {
  product: {
    id: string
    name: string
    slug: string
    description?: string
    price: number
    unit: string
    imageUrl?: string
    producer: {
      id: string
      name: string
      slug: string
    }
    category?: {
      id: string
      name: string
      slug: string
    }
    isTraditional: boolean
    isBio: boolean
    stock: number
  }
}

export function ProductHeaderSection({ product }: ProductHeaderSectionProps) {
  const { addItem } = useCartStore()
  const { t, locale } = useI18n()
  const [quantity, setQuantity] = useState(1)

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      producerId: product.producer.slug,
      producerName: product.producer.name,
      price: product.price,
      quantity,
      image: product.imageUrl,
      unit: product.unit,
      slug: product.slug,
    })
  }

  const stockStatus = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'limited' : 'out-of-stock'

  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start mb-12">
      {/* Left Column - Image */}
      <div className="space-y-4">
        <div className="relative aspect-[4/3] w-full rounded-[32px] overflow-hidden bg-muted border border-border shadow-premium-lg">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
              <svg
                className="w-24 h-24 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isBio && (
              <Badge variant="success" className="text-xs font-semibold shadow-md backdrop-blur-sm bg-success/90">
                BIO
              </Badge>
            )}
            {product.isTraditional && (
              <Badge variant="secondary" className="text-xs font-semibold shadow-md backdrop-blur-sm bg-secondary/90">
                Tradițional
              </Badge>
            )}
            <ProducerPriceBadge variant="compact" className="text-xs shadow-md backdrop-blur-sm" />
          </div>
        </div>
      </div>

      {/* Right Column - Info */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            {product.name}
          </h1>
          <Link
            href={`/producers/${product.producer.slug}`}
            className="text-base text-primary hover:text-primary-hover transition-colors inline-block mb-2"
          >
            {product.producer.name}
          </Link>
          {product.category && (
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-bold text-foreground">
              {formatCurrency(product.price, locale)}
            </span>
            <span className="text-base text-muted-foreground">
              / {product.unit}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('product.priceProducer', 'Preț de producător (fără adaos de supermarket).')}
          </p>
          <TrustStack
            badges={['producer-prices', 'verified-producers']}
            variant="compact"
            layout="horizontal"
          />
        </div>

        {/* Stock Status */}
        <div>
          {stockStatus === 'in-stock' && (
            <p className="text-sm text-success flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              {t('product.inStock', 'În stoc')}
            </p>
          )}
          {stockStatus === 'limited' && (
            <p className="text-sm text-warning flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              {t('product.limitedStock', 'Stoc limitat')}
            </p>
          )}
          {stockStatus === 'out-of-stock' && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              {t('product.outOfStock', 'Stoc epuizat')}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {t('product.stockUpdate', 'Producătorul își actualizează stocurile înainte de comandă.')}
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-4 border-t border-border">
          {/* Quantity Selector */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-2">
              {t('product.quantity', 'Cantitate')}
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="rounded-full"
              >
                -
              </Button>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center border border-border rounded-full px-4 py-2 bg-background text-foreground"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-full"
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground">
                {product.unit}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={stockStatus === 'out-of-stock'}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-full py-6 text-base font-semibold shadow-premium"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {t('actions.addToCart', 'Adaugă în coș')}
          </Button>

          {/* Favorite Button */}
          <FavoriteButton
            targetType="product"
            targetId={product.id}
            className="w-full rounded-full"
            size="md"
            variant="outline"
            showLabel
          />

          {/* Micro copy */}
          <div className="space-y-2 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('product.orderHelpsProducer', 'Comanda ta îl ajută pe producător să-și planifice mai bine producția.')}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Comenzile neridicate pot fi donate către centre sociale, acolo unde este posibil.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

