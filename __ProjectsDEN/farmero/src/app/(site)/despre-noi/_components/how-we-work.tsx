'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

export function HowWeWork() {
  const { t } = useI18n()

  const processes = [
    {
      step: '01',
      icon: '✅',
      title: t('about.howWeWork.step1.title', 'Verificare producători'),
      description: t('about.howWeWork.step1.description', 'Fiecare producător este verificat, documentele sunt analizate și produsele sunt evaluate pentru calitate și autenticitate.'),
      gradient: 'from-emerald-500/10 to-emerald-600/10',
    },
    {
      step: '02',
      icon: '📋',
      title: t('about.howWeWork.step2.title', 'Listare produse'),
      description: t('about.howWeWork.step2.description', 'Producătorii pot încărca produsele cu detalii complete, imagini și prețuri transparente, fără comisioane ascunse.'),
      gradient: 'from-primary/10 to-primary/20',
    },
    {
      step: '03',
      icon: '💳',
      title: t('about.howWeWork.step3.title', 'Plăți securizate'),
      description: t('about.howWeWork.step3.description', 'Sistem de plăți securizat care protejează atât producătorii cât și clienții, cu procesare rapidă și transparentă.'),
      gradient: 'from-orange-500/10 to-orange-600/10',
    },
    {
      step: '04',
      icon: '🚚',
      title: t('about.howWeWork.step4.title', 'Logistică și livrare'),
      description: t('about.howWeWork.step4.description', 'Coordonăm livrarea directă de la producător la client, asigurând că produsele ajung proaspete și în condiții optime.'),
      gradient: 'from-primary/10 to-primary/20',
    },
    {
      step: '05',
      icon: '💬',
      title: t('about.howWeWork.step5.title', 'Suport continuu'),
      description: t('about.howWeWork.step5.description', 'Echipa noastră oferă suport atât producătorilor cât și clienților, asigurând o experiență pozitivă pentru toți.'),
      gradient: 'from-emerald-500/10 to-primary/10',
    },
  ]
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
              {t('about.howWeWork.title', 'Cum lucrăm')}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {t('about.howWeWork.subtitle', 'Procesele noastre interne care asigură calitatea și transparența platformei')}
            </p>
          </div>

          <div className="space-y-6">
            {processes.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ x: 8 }}
              >
                <Card className="border-border/60 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-primary/40 bg-card group overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-6">
                      {/* Icon container with gradient */}
                      <motion.div
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${process.gradient} flex items-center justify-center text-2xl md:text-3xl border-2 border-border/60 group-hover:border-primary/40 transition-colors`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {process.icon}
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            {process.step}
                          </span>
                          <h3 className="font-semibold text-foreground text-lg md:text-xl group-hover:text-primary transition-colors">
                            {process.title}
                          </h3>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {process.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
