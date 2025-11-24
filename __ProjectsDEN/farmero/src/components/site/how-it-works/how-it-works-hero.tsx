/**
 * How It Works Hero Component
 * 
 * Hero section pentru pagina "Cum funcționează"
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'

export function HowItWorksHero() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Cum funcționează Farmero
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6">
            Conectăm producători locali, oameni care vor să mănânce mai bine și o rețea de livrare gândită să reducă risipa, nu doar să mute cutii.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Fiecare comandă pe care o faci ajută un producător să își vândă munca cinstit, iar atunci când lucrurile nu merg perfect, încercăm să transformăm pierderea în ajutor pentru altcineva, nu în mâncare aruncată.
          </p>
        </motion.div>
      </PageContainer>
    </section>
  )
}

