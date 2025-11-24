/**
 * Pitch Deck Section
 * 
 * Secțiunea cu prezentarea pentru investitori
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent, Button } from 'farme-ui'
import { FileText, Download, Presentation, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

export function PitchDeckSection() {
  const { t } = useI18n()

  const pitchDeckSections = [
    {
      title: t('investors.pitchDeck.sections.problem.title', 'Problema'),
      description: t('investors.pitchDeck.sections.problem.description', 'Producătorii locali au dificultăți în a-și vinde produsele direct consumatorilor'),
    },
    {
      title: t('investors.pitchDeck.sections.solution.title', 'Soluția'),
      description: t('investors.pitchDeck.sections.solution.description', 'Platformă digitală care conectează producătorii cu clienții, eliminând intermediarii'),
    },
    {
      title: t('investors.pitchDeck.sections.market.title', 'Piața'),
      description: t('investors.pitchDeck.sections.market.description', 'Piața alimentară românească: €15B+ anual, cu creștere constantă'),
    },
    {
      title: t('investors.pitchDeck.sections.businessModel.title', 'Model de business'),
      description: t('investors.pitchDeck.sections.businessModel.description', 'Comisioane transparente, abonamente producători, servicii B2B'),
    },
    {
      title: t('investors.pitchDeck.sections.traction.title', 'Traction'),
      description: t('investors.pitchDeck.sections.traction.description', '500+ producători, 10,000+ comenzi/lună, creștere 25% lunară'),
    },
    {
      title: t('investors.pitchDeck.sections.competition.title', 'Competiție'),
      description: t('investors.pitchDeck.sections.competition.description', 'Avantaj competitiv prin focus pe producători locali și impact social'),
    },
    {
      title: t('investors.pitchDeck.sections.team.title', 'Echipa'),
      description: t('investors.pitchDeck.sections.team.description', 'Fondatori cu experiență în tech, agricultură și business'),
    },
    {
      title: t('investors.pitchDeck.sections.financial.title', 'Financiar'),
      description: t('investors.pitchDeck.sections.financial.description', 'Proiecții de €50M venituri până în 2027, model scalabil'),
    },
  ]
  return (
    <section id="pitch-deck" className="py-16 md:py-24 bg-background scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('investors.pitchDeck.title', 'Pitch Deck')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto mb-8">
            {t('investors.pitchDeck.subtitle', 'Prezentare completă pentru investitori cu toate informațiile esențiale despre farme.ro')}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact?type=investor">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3 font-semibold flex items-center gap-2"
              >
                <Presentation className="w-5 h-5" />
                {t('investors.pitchDeck.ctaLive', 'Programează prezentare live')}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-6 py-3 font-semibold flex items-center gap-2"
              disabled
            >
              <Download className="w-5 h-5" />
              {t('investors.pitchDeck.ctaDownload', 'Descarcă PDF (disponibil la cerere)')}
            </Button>
          </div>
        </motion.div>

        {/* Pitch Deck Sections Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pitchDeckSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="border border-border rounded-xl shadow-sm bg-card h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        {section.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            {t('investors.pitchDeck.contactNote', 'Pentru acces la pitch deck complet sau pentru a programa o prezentare personalizată')}
          </p>
          <Link href="/contact?type=investor">
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary-bg rounded-full px-6 py-3 font-semibold flex items-center gap-2 mx-auto"
            >
              {t('investors.pitchDeck.contactButton', 'Contactează echipa')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </PageContainer>
    </section>
  )
}

