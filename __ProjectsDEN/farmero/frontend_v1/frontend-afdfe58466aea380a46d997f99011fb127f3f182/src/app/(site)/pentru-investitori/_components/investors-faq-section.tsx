/**
 * Investors FAQ Section
 * 
 * Secțiunea cu întrebări frecvente pentru investitori
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'

export function InvestorsFAQSection() {
  const { t } = useI18n()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqItems = [
    {
      question: t('investors.faq.q1.question', 'Ce tipuri de investiții căutați?'),
      answer: t('investors.faq.q1.answer', 'Căutăm investitori strategici pentru seed round (€500K - €1M) care să ne ajute cu expansiunea pe piața românească și dezvoltarea tehnologiei. Suntem deschiși și la parteneriate strategice cu investitori care pot aduce valoare în domeniul agricol sau retail.'),
    },
    {
      question: t('investors.faq.q2.question', 'Care este modelul de exit?'),
      answer: t('investors.faq.q2.answer', 'Viziunea noastră include fie un exit strategic prin achiziție de către un jucător major din retail sau tech, fie un IPO pe termen de 5-7 ani. Modelul de business scalabil și profitabilitatea anticipată fac farme.ro un candidat atractiv pentru ambele scenarii.'),
    },
    {
      question: t('investors.faq.q3.question', 'Cum veți utiliza fondurile?'),
      answer: t('investors.faq.q3.answer', 'Aproximativ 60% din fonduri vor fi alocate marketing și recrutare producători, 25% pentru dezvoltare tehnologică și infrastructură, iar 15% pentru operațiuni și echipă. Prioritățile includ expansiunea națională și lansarea serviciilor B2B.'),
    },
    {
      question: t('investors.faq.q4.question', 'Care este valuation-ul companiei?'),
      answer: t('investors.faq.q4.answer', 'Valuation-ul este negociabil și depinde de termenii investiției. Ne bazăm pe metrici de traction actuală, potențial de creștere și comparații cu companii similare din regiune. Discutăm detalii specifice în cadrul întâlnirilor cu investitori interesați.'),
    },
    {
      question: t('investors.faq.q5.question', 'Ce riscuri identificați?'),
      answer: t('investors.faq.q5.answer', 'Riscurile principale includ competiția din piață, dependența de recrutarea producătorilor de calitate, și schimbările în comportamentul consumatorilor. Avem strategii clare de mitigare pentru fiecare risc și un plan de continuitate robust.'),
    },
    {
      question: t('investors.faq.q6.question', 'Cum măsurăm succesul investiției?'),
      answer: t('investors.faq.q6.answer', 'Metrici cheie includ: numărul de producători activi, volumul de comenzi, venituri recurente, rata de retenție a clienților, și progresul către profitabilitate. Oferim rapoarte regulate și transparență completă asupra performanței.'),
    },
    {
      question: t('investors.faq.q7.question', 'Există oportunități de investiție ulterioare?'),
      answer: t('investors.faq.q7.answer', 'Da, planificăm runde ulterioare (Series A) pentru expansiunea internațională și dezvoltarea de noi servicii. Investitorii din runda actuală vor avea prioritate și termeni preferențiali în rundele viitoare.'),
    },
    {
      question: t('investors.faq.q8.question', 'Cum pot programa o întâlnire?'),
      answer: t('investors.faq.q8.answer', 'Poți ne contacta direct prin formularul de contact cu tipul "investor" sau prin email la investitori@farme.ro. Organizăm întâlniri personalizate unde prezentăm detalii complete despre oportunitate și răspundem la toate întrebările tale.'),
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-24 bg-muted/30 scroll-mt-20">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t('investors.faq.title', 'Întrebări frecvente')}
          </h2>
          <p className="text-lg text-foreground-body max-w-2xl mx-auto">
            {t('investors.faq.subtitle', 'Răspunsuri la cele mai comune întrebări despre oportunitatea de investiție în farme.ro')}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="border border-border rounded-xl shadow-sm bg-card">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                          <HelpCircle className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground flex-1">
                          {item.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <p className="text-sm text-foreground-body leading-relaxed pl-12">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
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
            {t('investors.faq.contactNote', 'Ai alte întrebări? Suntem aici să răspundem.')}
          </p>
          <a
            href="/contact?type=investor"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm"
          >
            {t('investors.faq.contactButton', 'Contactează echipa')}
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </a>
        </motion.div>
      </PageContainer>
    </section>
  )
}

