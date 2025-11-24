'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

export function StepsSection() {
  const { t } = useI18n()
  
  const steps = [
    {
      number: '01',
      title: t('home.steps.step1.title', 'Descoperi producători locali'),
      description: t('home.steps.step1.description', 'Explorează gama variată de produse tradiționale și bio de la producători verificați din toată România.'),
      icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  {
    number: '02',
    title: t('home.steps.step2.title', 'Plasezi comanda online'),
    description: t('home.steps.step2.description', 'Adaugă produsele preferate în coș și finalizează comanda cu plăți securizate și procesare rapidă.'),
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    number: '03',
    title: t('home.steps.step3.title', 'Producătorul pregătește produsele'),
    description: t('home.steps.step3.description', 'Producătorul local pregătește comanda ta cu grijă și atenție la detalii, asigurând calitatea și proaspătatea.'),
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-500/20',
  },
  {
    number: '04',
    title: t('home.steps.step4.title', 'Primești coletul acasă'),
    description: t('home.steps.step4.description', 'Livrare directă de la producător, asigurând proaspătatea și calitatea produselor până la ușa ta.'),
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-primary/10 via-primary/5 to-transparent',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    borderColor: 'border-primary/20',
  },
  ]
  
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <PageContainer className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
                {t('home.steps.title', 'Cum funcționează farme.ro')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-amber-500 to-orange-500 rounded-full mx-auto mb-6" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {t('home.steps.subtitle', 'Proces simplu în 4 pași pentru a cumpăra produse tradiționale direct de la producători')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Card className={`h-full text-center border-border/60 rounded-2xl hover:shadow-2xl transition-all duration-500 bg-card group overflow-hidden relative ${step.borderColor.includes('emerald') ? 'hover:border-emerald-500/50' : step.borderColor.includes('amber') ? 'hover:border-amber-500/50' : step.borderColor.includes('orange') ? 'hover:border-orange-500/50' : 'hover:border-primary/50'}`}>
                  {/* Animated gradient background */}
                  <div 
                    className={`absolute bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{
                      top: '1px',
                      left: '1px',
                      right: '1px',
                      bottom: '1px',
                      borderRadius: 'calc(1rem - 1px)',
                    }}
                  />
                  
                  <CardContent className="p-6 md:p-8 relative z-10">
                    {/* Step number badge - top right */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.2, type: 'spring' }}
                      className="absolute top-4 right-4"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                        {step.number}
                      </span>
                    </motion.div>

                    {/* Icon Container - centered */}
                    <motion.div
                      className="flex items-center justify-center mb-6 mt-2"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ 
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.5 }
                      }}
                    >
                      <div className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl ${step.iconBg} ${step.iconColor} border border-border/40 group-hover:border-transparent transition-all duration-300`}>
                        {step.icon}
                      </div>
                    </motion.div>

                    <h3 className="font-semibold mb-3 text-foreground text-base md:text-lg group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
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
