/**
 * Producer Products Client Component
 * 
 * Client component pentru gestionarea add to cart în pagina de produse producător
 */

'use client'

import { useCartStore } from '@/lib/store/cart'
import { useToast } from '@/components/ui/toast'
import { useI18n } from '@/lib/i18n/context'
import { ProductCard } from '@/components/ui/product-card'
import type { PublicProduct } from '@/lib/api/public/products'

interface ProducerProductsClientProps {
  products: PublicProduct[]
  producerName: string
  producerSlug: string
}

export function ProducerProductsClient({
  products,
  producerName,
  producerSlug,
}: ProducerProductsClientProps) {
  const { addItem } = useCartStore()
  const { showToast } = useToast()
  const { t } = useI18n()

  const handleAddToCart = async (product: PublicProduct) => {
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        producerId: product.producer?.id || '',
        producerName: product.producer?.name || producerName,
        price: product.price,
        quantity: 1,
        unit: product.unit || 'buc',
        slug: product.slug,
        image: product.imageUrl,
      })
      showToast(
        t('cart.added', 'Produs adăugat în coș'),
        'success'
      )
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error adding to cart:', error)
      }
      showToast(
        t('cart.error', 'Eroare la adăugarea în coș. Te rugăm să încerci din nou.'),
        'error'
      )
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          unit={product.unit}
          imageUrl={product.imageUrl}
          producerName={product.producer?.name || producerName}
          producerSlug={product.producer?.slug || producerSlug}
          isBio={product.isBio}
          isTraditional={product.isTraditional}
          onAddToCart={() => handleAddToCart(product)}
        />
      ))}
    </div>
  )
}

