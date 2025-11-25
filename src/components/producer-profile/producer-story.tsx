/**
 * Producer Story Component
 * 
 * Secțiunea "Povestea noastră" cu layout editorial
 */

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'

interface ProducerStoryProps {
  story?: string
  photoUrl?: string
  signature?: string
}

const defaultStory = `Ferma noastră a început în 2015, când am decis să ne întoarcem la rădăcini și să cultivăm produse autentice, fără chimicale. 

Fiecare produs pe care îl creștem este rezultatul pasiunii și muncii noastre zilnice. Credem în agricultură responsabilă, care respectă pământul și oferă oamenilor alimente sănătoase.

Viziunea noastră este să ajungem la cât mai mulți oameni care apreciază calitatea și autenticitatea produselor tradiționale românești.`

export function ProducerStory({
  story = defaultStory,
  photoUrl,
  signature = 'Familia Popescu',
}: ProducerStoryProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <PageContainer>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
              Povestea noastră
            </h2>
            
            <div className="prose prose-lg max-w-none">
              {story.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base md:text-lg text-foreground-body leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Signature */}
            {signature && (
              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground italic">— {signature}</p>
              </div>
            )}
          </motion.div>

          {/* Right Column - Photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="border border-border rounded-[32px] shadow-premium overflow-hidden bg-card">
              <div className="relative aspect-[4/5] bg-muted">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="Producător"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">👨‍🌾</div>
                      <p className="text-sm text-foreground-body">Fotografie producător</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}

