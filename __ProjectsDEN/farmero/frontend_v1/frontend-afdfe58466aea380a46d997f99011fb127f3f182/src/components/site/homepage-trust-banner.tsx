/**
 * Homepage Trust Banner Component
 * 
 * Banner cu TrustStack pentru homepage
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { TrustStack } from '@/components/trust/trust-stack'

export function HomepageTrustBanner() {
  return (
    <section className="py-8 md:py-12 bg-muted">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-border rounded-2xl shadow-lg bg-card">
            <CardContent className="p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                De ce poți avea încredere în Farmero
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <TrustStack
                  badges={[
                    'verified-producers',
                    'producer-prices',
                    'no-intermediaries',
                    'social-impact',
                    'secure-payment',
                  ]}
                  variant="default"
                  layout="horizontal"
                  showAll={true}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

