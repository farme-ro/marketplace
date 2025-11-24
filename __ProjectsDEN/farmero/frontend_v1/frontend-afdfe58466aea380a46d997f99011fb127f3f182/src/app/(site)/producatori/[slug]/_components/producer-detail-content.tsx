'use client'

import { Card, CardContent } from 'farme-ui'
import { ProducerProductsList } from './producer-products-list'
import { ProducerJournalSection } from '@/components/producers/producer-journal-section'
import { useI18n } from '@/lib/i18n/context'
import type { ProducerDetail } from '../page'

interface ProducerDetailContentProps {
  storyFull?: string
  products: any[]
  producer: ProducerDetail
}

export function ProducerDetailContent({ storyFull, products, producer }: ProducerDetailContentProps) {
  const { t } = useI18n()
  
  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.35fr)]">
      {/* Col stânga – Poveste, practici, impact */}
      <div className="space-y-6">
        {/* Povestea producătorului */}
        {storyFull && (
          <Card className="rounded-[32px] border border-border bg-card shadow-premium">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                {t('producers.detail.storyTitle', 'Povestea producătorului')}
              </h2>
              <p className="text-sm text-foreground-body leading-relaxed">
                {storyFull}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-full bg-primary-soft px-2.5 py-1 font-medium text-primary">
                  {t('producers.detail.badgeProducerPrice', 'Preț de producător')}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
                  {t('producers.detail.badgeSmallBatches', 'Loturi mici, proaspete')}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
                  {t('producers.detail.badgeSupportHousehold', 'Susții direct gospodăria')}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Practici / calitate */}
        <Card className="rounded-[32px] border border-border bg-card shadow-premium">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              {t('producers.detail.howWorksTitle', 'Cum lucrează')}
            </h2>
            <ul className="space-y-2 text-sm text-foreground-body">
              <li>• {t('producers.detail.howWorks1', 'Produse făcute în gospodărie, în loturi limitate.')}</li>
              <li>• {t('producers.detail.howWorks2', 'Rețete tradiționale și ingrediente locale, acolo unde este posibil.')}</li>
              <li>• {t('producers.detail.howWorks3', 'Focus pe calitate, nu pe cantitate – stocurile se pot epuiza rapid.')}</li>
            </ul>

            <p className="mt-3 text-xs text-muted-foreground">
              {t('producers.detail.howWorksNote', 'Notă: disponibilitatea produselor poate varia în funcție de sezon și de producție. Dacă un produs nu mai este în stoc, producătorul îl poate dezactiva rapid din platformă.')}
            </p>
          </CardContent>
        </Card>

        {/* Impact social */}
        <Card className="rounded-[32px] border border-primary/20 bg-primary-soft/30 shadow-premium">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-4">
              {t('producers.detail.impactTitle', 'Impactul tău social')}
            </h2>
            <p className="text-sm text-foreground mb-3">
              {t('producers.detail.impactDescription', 'Când comanzi de la acest producător:')}
            </p>
            <ul className="space-y-1.5 text-xs text-foreground-body">
              <li>• {t('producers.detail.impact1', 'Susții direct o gospodărie locală, nu un lanț de retail.')}</li>
              <li>• {t('producers.detail.impact2', 'Contribui la reducerea risipei alimentare prin comenzi planificate.')}</li>
              <li>• {t('producers.detail.impact3', 'Ajuți la păstrarea rețetelor și obiceiurilor culinare tradiționale.')}</li>
            </ul>
          </CardContent>
        </Card>

        {/* Journal Section */}
        <ProducerJournalSection producerId={producer.id} producerSlug={producer.slug} />
      </div>

      {/* Col dreapta – Produse listă + info livrare */}
      <div className="space-y-6">
        {/* Produse */}
        <Card className="rounded-[32px] border border-border bg-card shadow-premium">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('producers.detail.productsTitle', 'Produse disponibile')}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('producers.detail.productsSubtitle', 'Toate prețurile sunt direct de la producător.')}
                </p>
              </div>
            </div>

            <ProducerProductsList 
              products={products}
              producerName={producer.name}
              producerId={producer.id}
            />
          </CardContent>
        </Card>

        {/* Info livrare */}
        <Card className="rounded-[32px] border border-border bg-card shadow-premium">
          <CardContent className="p-6 md:p-8 text-xs">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              {t('producers.detail.deliveryTitle', 'Livrare & ambalare')}
            </h2>
            <ul className="space-y-1.5 text-foreground-body">
              <li>• {t('producers.detail.delivery1', 'Livrarea se face direct de către producător sau prin curier partener.')}</li>
              <li>• {t('producers.detail.delivery2', 'Produsele sensibile sunt ambalate corespunzător pentru transport.')}</li>
              <li>
                • {t('producers.detail.delivery3', 'Pentru anumite comenzi, livrarea se poate face la pachetomat / easybox (unde este disponibil).')}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

