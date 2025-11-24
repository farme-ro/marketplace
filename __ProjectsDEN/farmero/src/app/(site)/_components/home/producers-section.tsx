'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { ProducerCard } from '@/components/ui/producer-card'
import { getProducers, type ProducerSummary } from '@/lib/api/public/producers'
import { getFeaturedProducers, enhanceProducerWithVisibility } from '@/lib/api/farmero-producers-marketing'
import type { ProducerWithVisibility, ProducerVisibilityInfo } from '@/lib/types/farmero-marketing'
import { Skeleton } from 'farme-ui'
import { Card } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'

export function ProducersSection() {
  const [producers, setProducers] = useState<ProducerSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    
    async function fetchProducers() {
      try {
        setIsLoading(true)
        setHasError(false)
        
        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            abortController.abort()
            setHasError(true)
            setProducers([])
            setIsLoading(false)
          }
        }, 5000) // 5 second timeout
        
        // Try to get featured producers first, fallback to regular producers
        let producersData: (ProducerSummary | ProducerWithVisibility)[] = []
        
        if (isBackendSyncEnabled('producerMarketing')) {
          try {
            const featured = await getFeaturedProducers()
            if (featured.length > 0) {
              producersData = featured
            } else {
              const response = await getProducers({ pageSize: 6 })
              producersData = response.data || []
            }
          } catch {
            // Fallback to regular producers
            const response = await getProducers({ pageSize: 6 })
            producersData = response.data || []
          }
        } else {
          const response = await getProducers({ pageSize: 6 })
          producersData = response.data || []
        }
        
        clearTimeout(timeoutId)
        
        if (isMounted) {
          setProducers(producersData)
          setIsLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          // Only log unexpected errors (not 404, 500, or network errors)
          if (error instanceof Error) {
            const isExpected = 
              error.message.includes('404') || 
              error.message.includes('500') || 
              error.message.includes('network') ||
              error.message.includes('Network') ||
              error.message.includes('429')
            
            if (!isExpected && process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.warn('[ProducersSection] Unexpected error fetching producers:', error)
            }
          }
          setHasError(true)
          setProducers([])
          setIsLoading(false)
        }
      }
    }

    fetchProducers()
    
    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  // Don't show loading state for too long - hide section if error or timeout
  if (isLoading && !hasError) {
    return (
      <PageContainer className="py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
              {t('home.producers.title', 'Producători Recomandați')}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t('home.producers.subtitle', 'Descoperă producătorii noștri parteneri')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="rounded-2xl shadow-sm border border-border/60">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton variant="circular" width={64} height={64} />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </div>
                  </div>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </PageContainer>
    )
  }

  // Hide section if no producers or error/timeout
  if (producers.length === 0 || hasError) {
    return null
  }

  return (
    <PageContainer className="py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
            {t('home.producers.title', 'Producători Recomandați')}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t('home.producers.subtitle', 'Descoperă producătorii noștri parteneri')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {producers.map((producer, index) => {
            const isProducerWithVisibility = 'visibility' in producer && producer.visibility !== undefined
            const visibility: ProducerVisibilityInfo | undefined = isProducerWithVisibility && producer.visibility && typeof producer.visibility === 'object' && 'tier' in producer.visibility && 'producerId' in producer.visibility ? producer.visibility as ProducerVisibilityInfo : undefined
            const isVerified = 'status' in producer ? producer.status === 'APPROVED' : producer.isVerified
            
            return (
              <motion.div
                key={producer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProducerCard
                  id={producer.id}
                  slug={producer.slug}
                  name={producer.name}
                  description={producer.description || undefined}
                  avatarUrl={producer.avatarUrl || undefined}
                  regionName={producer.regionName || undefined}
                  productCount={producer.productCount}
                  tags={producer.tags}
                  isVerified={isVerified}
                  visibility={visibility}
                />
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/producatori">
            <Button 
              variant="outline" 
              size="lg"
              aria-label={t('home.producers.viewAllAria', 'Vezi toți producătorii disponibili')}
            >
              {t('home.producers.viewAll', 'Vezi toți producătorii')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </PageContainer>
  )
}

