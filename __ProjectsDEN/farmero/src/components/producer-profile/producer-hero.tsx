/**
 * Producer Hero Component
 * 
 * Hero cinematic cu imagine copertă full-width și overlay card
 */

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

interface ProducerHeroProps {
  name: string
  regionName?: string
  specialization?: string
  avatarUrl?: string
  coverImageUrl?: string
  isVerified?: boolean
  productCount?: number
}

export function ProducerHero({
  name,
  regionName,
  specialization,
  avatarUrl,
  coverImageUrl,
  isVerified = true,
  productCount = 0,
}: ProducerHeroProps) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Cover Image */}
      <div className="absolute inset-0">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={`${name} - Fermă`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-soft/50 via-primary-bg/30 to-background flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">🌾</div>
              <p className="text-foreground-body">Imagine copertă fermă</p>
            </div>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Overlay Card */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <PageContainer className="pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border border-border rounded-[32px] shadow-premium-lg bg-card/95 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background shadow-premium bg-muted">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">🧑‍🌾</span>
                        </div>
                      )}
                    </div>
                    {isVerified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-2">
                        🧑‍🌾 {name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-foreground-body">
                        {regionName && (
                          <span className="inline-flex items-center gap-1">
                            📍 {regionName}
                          </span>
                        )}
                        {specialization && (
                          <span className="inline-flex items-center gap-1">
                            🌱 {specialization}
                          </span>
                        )}
                        {productCount > 0 && (
                          <span className="inline-flex items-center gap-1">
                            📦 {productCount} produse
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isVerified && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-soft text-primary text-xs font-semibold rounded-full border border-primary/20">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Producător verificat
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-soft text-primary text-xs font-semibold rounded-full border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        100% local
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-soft text-primary text-xs font-semibold rounded-full border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Agricultură responsabilă
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Link href={`/producers/${name.toLowerCase().replace(/\s+/g, '-')}/products`}>
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-3 text-base font-semibold shadow-premium"
                        >
                          ➡️ Vezi produsele
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-3 text-base font-semibold"
                      >
                        ➡️ Abonează-te la acest producător
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </PageContainer>
      </div>
    </section>
  )
}

