/**
 * Producer Products List Component (Client)
 * 
 * Client component pentru lista de produse cu funcționalitate add to cart
 */

'use client'

import { Button } from 'farme-ui'
import { useCart } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'

type ProducerProduct = {
  id: string
  name: string
  price: number
  priceText?: string
  unit?: string
  isBio?: boolean
  isTraditional?: boolean
  isLimited?: boolean
  stock?: number
  isActive?: boolean
}

interface ProducerProductsListProps {
  products: ProducerProduct[]
  producerName: string
  producerId?: string
}

export function ProducerProductsList({ products, producerName, producerId }: ProducerProductsListProps) {
  const { addItem } = useCart()
  const { t, locale } = useI18n()

  const handleAddToCart = (product: ProducerProduct) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit || 'buc',
      quantity: 1,
      image: null,
      producerName: producerName,
      producerId: producerId || '',
      slug: '', // Note: Product slug not included in ProducerProduct type from this API endpoint
    })
  }

  if (products.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-border bg-muted px-3 py-4 text-center text-xs text-muted-foreground">
        {t('producers.detail.productsEmpty', 'Momentan nu sunt produse active. Revino în curând sau urmărește acest producător pentru noutăți.')}
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      {products
        .filter((p) => p.isActive !== false && (p.stock ?? 0) > 0)
        .map((product) => {
          const priceText = product.priceText || formatCurrency(product.price, locale)
          return (
            <div
              key={product.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-muted px-3 py-2.5 text-xs"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {product.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  {product.unit && <span>/ {product.unit}</span>}
                  {product.isBio && (
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                      {t('ui.badges.bio', 'Bio')}
                    </span>
                  )}
                  {product.isTraditional && (
                    <span className="rounded-full bg-secondary-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary">
                      {t('ui.badges.traditional', 'Tradițional')}
                    </span>
                  )}
                  {product.isLimited && (
                    <span className="rounded-full bg-secondary-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-secondary">
                      {t('ui.badges.limitedBatch', 'Lot limitat')}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                {priceText && (
                  <p className="text-sm font-semibold text-foreground">
                    {priceText}
                  </p>
                )}
                <Button
                  size="sm"
                  className="mt-1 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-[11px] px-3 py-1.5"
                  onClick={() => handleAddToCart(product)}
                >
                  {t('actions.addToCart', 'Adaugă în coș')}
                </Button>
              </div>
            </div>
          )
        })}
    </div>
  )
}

