'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { getRegions, type Region } from '@/lib/api/public/regions'
import { Skeleton } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

export function RegionsSection() {
  const { t } = useI18n()
  const [regions, setRegions] = useState<Region[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRegions() {
      try {
        const data = await getRegions()
        setRegions(data.slice(0, 6)) // Show max 6 regions
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[RegionsSection] Error fetching regions:', error)
        }
        setRegions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegions()
  }, [])

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <PageContainer>
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                {t('home.regions.title', 'Explorează după regiune')}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height="120px" className="rounded-xl" />
              ))}
            </div>
          </div>
        </PageContainer>
      </section>
    )
  }

  if (regions.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
              {t('home.regions.title', 'Explorează după regiune')}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {t('home.regions.subtitle', 'Descoperă producători locali din diferite regiuni ale României')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {regions.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link 
                  href={`/products?regionId=${region.id}`}
                  aria-label={t('home.regions.regionAria', 'Vezi produse din regiunea {{region}}').replace('{{region}}', region.name)}
                >
                  <Card className="h-full border-border/60 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-accent/20 transition-colors">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                          <h3 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                            {region.name}
                          </h3>
                        </div>
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
