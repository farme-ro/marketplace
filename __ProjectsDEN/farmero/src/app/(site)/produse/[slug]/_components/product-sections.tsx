/**
 * Product Sections
 * 
 * Secțiuni sub header pentru pagina de detaliu produs
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { SimilarProductsSection } from './similar-products-section'

interface ProductSectionsProps {
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

export function ProductSections({ product }: ProductSectionsProps) {
  const { t } = useI18n()
  return (
    <div className="space-y-10">
      {/* Description Section */}
      {product.description && (
        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
            {t('product.descriptionTitle', 'Descriere produs')}
          </h2>
          <div className="prose prose-sm max-w-none text-foreground-body leading-relaxed">
            <p>{product.description}</p>
          </div>
        </section>
      )}

      {/* Producer Section */}
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
          {t('product.aboutProducer', 'Despre producător')}
        </h2>
        <Card className="rounded-[32px] border border-border bg-card shadow-premium">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Producer Avatar/Logo */}
              <div className="relative w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🧑‍🌾</span>
              </div>

              {/* Producer Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {product.producer.name}
                  </h3>
                  {product.category && (
                    <p className="text-sm text-muted-foreground">
                      {t('product.producerFrom', 'Producător din zona {region}').replace('{region}', product.category.name)}
                    </p>
                  )}
                </div>
                <p className="text-sm text-foreground-body leading-relaxed">
                  {t('product.producerDescription', 'Producător local specializat în produse de calitate, direct de la sursă.')}
                </p>
                <Link href={`/producers/${product.producer.slug}`}>
                  <Button variant="outline" className="rounded-full">
                    {t('product.viewProducerPage', 'Vezi pagina producătorului')}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Delivery Info Section */}
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
          {t('product.deliveryInfo', 'Info livrare')}
        </h2>
        <Card className="rounded-[32px] border border-border bg-card shadow-premium">
          <CardContent className="p-6 md:p-8 space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {t('product.coveredArea', 'Zona acoperită')}
              </h3>
              <p className="text-sm text-foreground-body leading-relaxed">
                {t('product.deliveryAvailable', 'Livrare disponibilă în toată România prin curier.')}
              </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {t('product.deliveryOptions', 'Opțiuni de livrare')}
              </h3>
              <ul className="space-y-2 text-sm text-foreground-body">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{t('product.deliveryHome', 'Livrare la adresă (curier)')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    {t('product.deliveryEasybox', 'Easybox / Pachetomat (pentru anumite produse, acestea pot fi lăsate în pachetomat, în limita timpului de siguranță alimentară)')}
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Subscriptions Placeholder */}
      <section className="space-y-3 border-t border-border pt-8">
        <Card className="rounded-[32px] border border-border bg-gradient-to-br from-primary-soft/30 to-primary-bg/20 shadow-premium">
          <CardContent className="p-6 md:p-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-foreground">
                {t('product.subscriptionsComing', 'Curând: abonamente recurente')}
              </h3>
              <p className="text-sm text-foreground-body leading-relaxed max-w-md mx-auto">
                {t('product.subscriptionsDescription', 'Cosul tău preferat livrat automat, la intervalul ales de tine.')}
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  // Note: Subscription notification will be implemented when backend API is available
                  // Endpoint: POST /products/:id/notify-when-available
                }}
              >
                {t('product.notifyWhenAvailable', 'Anunță-mă când e disponibil')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Similar Products Section */}
      <SimilarProductsSection currentProduct={product} />

      {/* Reviews Placeholder */}
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
          {t('product.reviews', 'Recenzii')}
        </h2>
        <Card className="rounded-[32px] border border-border bg-card shadow-premium">
          <CardContent className="p-6 md:p-8">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {t('product.reviewsComingSoon', 'Recenziile vor fi disponibile în curând.')}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

