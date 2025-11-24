/**
 * Hero Section - How It Works Page
 * 
 * Hero section pentru pagina "Cum funcționează"
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

export function HeroHowItWorks() {
  return (
    <section className="relative py-10 sm:py-16 lg:py-20 overflow-hidden bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/30 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Comanda ta = venit corect pentru producători + mai puțină risipă
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground"
          >
            Cum funcționează farme.ro
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-foreground-body max-w-3xl mx-auto leading-relaxed"
          >
            Comanzi direct de la producători locali, la preț de producător. Noi avem grijă de logistică și de risipa alimentară.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link href="/produse">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-4 text-base font-semibold shadow-premium"
              >
                Vezi produsele
              </Button>
            </Link>
            <Link href="/pentru-producatori">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-8 py-4 text-base font-semibold"
              >
                Pentru producători
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </PageContainer>
    </section>
  )
}

