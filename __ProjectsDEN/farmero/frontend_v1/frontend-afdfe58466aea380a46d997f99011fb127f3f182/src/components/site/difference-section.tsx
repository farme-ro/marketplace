/**
 * Difference Section Component
 * 
 * Secțiunea "Diferența Farme.ro" cu 3 carduri animate
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { AnimatedIllustration } from '@/components/illustrations/animated-illustration'

export function DifferenceSection() {
  const { t } = useI18n()
  
  const differences = [
    {
      illustration: 'farm-basket',
      number: '01',
      title: t('home.difference.card1.title', 'De la fermă la tine'),
      description: t('home.difference.card1.description', 'Produse autentice, direct de la producători români. Fără lanțuri comerciale complexe, fără distribuitori care umflă prețurile.'),
    },
    {
      illustration: 'local-producer',
      number: '02',
      title: t('home.difference.card2.title', 'Susții producătorii români'),
      description: t('home.difference.card2.description', 'Bani rămân în comunitate. Când cumperi de la Farme.ro, susții direct micii producători și economia locală.'),
    },
    {
      illustration: 'sustainable-farm',
      number: '03',
      title: t('home.difference.card3.title', 'Reduci risipa alimentară'),
      description: t('home.difference.card3.description', 'Produsele neridicate sunt donate către centre sociale, nu aruncate. Fiecare comandă contează pentru comunitate.'),
    },
  ]
  return (
    <section className="py-16 md:py-24 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('home.difference.title', 'Diferența Farme.ro')}
          </h2>
          <p className="text-base md:text-lg text-foreground-body max-w-2xl mx-auto leading-relaxed">
            {t('home.difference.subtitle', 'Mai mult decât un marketplace. O platformă care conectează producători reali cu oameni care vor să mănânce mai bine.')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {differences.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <Card className="border border-border rounded-[32px] shadow-premium hover:shadow-premium-lg transition-all duration-300 bg-card h-full">
                <CardContent className="p-8">
                  {/* Number overlay */}
                  <div className="relative mb-6">
                    <span className="absolute -top-4 -left-4 text-7xl font-bold text-primary-soft/30 leading-none">
                      {item.number}
                    </span>
                    <div className="relative w-24 h-24 rounded-2xl bg-primary-soft/20 flex items-center justify-center">
                      <AnimatedIllustration
                        type={item.illustration as any}
                        width={80}
                        height={80}
                        className="text-primary"
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}

