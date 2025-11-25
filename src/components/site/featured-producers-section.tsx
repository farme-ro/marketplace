/**
 * Featured Producers Section Component
 * 
 * Grid premium cu producători featured
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { getProducers, type ProducerSummary } from '@/lib/api/public/producers'
import { Skeleton } from 'farme-ui'

export function FeaturedProducersSection() {
  const [producers, setProducers] = useState<ProducerSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

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
        
        const response = await getProducers({ pageSize: 6 })
        
        clearTimeout(timeoutId)
        
        if (isMounted) {
          setProducers(response.data || [])
          setIsLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[FeaturedProducersSection] Error fetching producers:', error)
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
    // Show loading only for first 2 seconds, then hide section
    return (
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-[32px]" />
            ))}
          </div>
        </PageContainer>
      </section>
    )
  }

  // Hide section if no producers or error/timeout
  if (producers.length === 0 || hasError) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <PageContainer className="max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Producători Featured
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            Descoperă fermele și producătorii noștri parteneri. Produse autentice, direct de la sursă.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {producers.map((producer, index) => (
            <motion.div
              key={producer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <Card className="border border-border rounded-[32px] shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card overflow-hidden h-full">
                <Link href={`/producers/${producer.slug}`}>
                  {/* Producer Image */}
                  <div className="relative h-48 bg-muted">
                    {producer.avatarUrl ? (
                      <Image
                        src={producer.avatarUrl}
                        alt={producer.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">🧑‍🌾</span>
                      </div>
                    )}
                    {producer.status === 'APPROVED' && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-soft text-primary text-xs font-semibold rounded-full border border-primary/20">
                          ✓ Verificat
                        </span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {producer.name}
                    </h3>
                    {producer.regionName && (
                      <p className="text-sm text-foreground-body mb-3">
                        📍 {producer.regionName}
                      </p>
                    )}
                    {producer.description && (
                      <p className="text-sm text-foreground-body mb-4 line-clamp-2">
                        {producer.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {producer.productCount} produse
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary border-primary hover:bg-primary-bg"
                      >
                        Vezi ferma →
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/producatori">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-3"
            >
              Vezi toți producătorii →
            </Button>
          </Link>
        </div>
      </PageContainer>
    </section>
  )
}

