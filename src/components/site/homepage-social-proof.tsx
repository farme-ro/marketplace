/**
 * Homepage Social Proof Component
 * 
 * Placeholder pentru poveștile comunității
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

export function HomepageSocialProof() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Curând: povești ale comunității Farmero
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Vom împărtăși povești reale despre producători, clienți și impactul pe care îl creăm împreună.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

