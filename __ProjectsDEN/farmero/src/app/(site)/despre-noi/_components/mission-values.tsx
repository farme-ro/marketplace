'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

export function MissionValues() {
  const { t } = useI18n()

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('about.missionValues.values.0.title', 'Produse autentice'),
      description: t('about.missionValues.values.0.description', 'Verificăm și promovăm doar produse tradiționale și bio de la producători verificați, asigurând autenticitatea și calitatea fiecărui produs.'),
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500/20',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: t('about.missionValues.values.1.title', 'Sprijin pentru producători locali'),
      description: t('about.missionValues.values.1.description', 'Oferim producătorilor o platformă accesibilă pentru a-și vinde produsele direct clienților, fără intermediari costisitori sau comisioane ascunse.'),
      gradient: 'from-primary/10 via-primary/5 to-transparent',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      borderColor: 'border-primary/20',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: t('about.missionValues.values.2.title', 'Transparență și calitate'),
      description: t('about.missionValues.values.2.description', 'Fiecare producător este verificat, iar produsele sunt evaluate pentru a asigura standarde ridicate de calitate și transparență totală.'),
      gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-500/20',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945m-6.89 0H9m0 0v-1a2 2 0 012-2h2.945M9 13v-1a2 2 0 012-2h2.945m-6.89 0H9m0 0v-1a2 2 0 012-2h2.945M9 11V9a2 2 0 012-2h2.945M9 9H7a2 2 0 00-2 2v1a2 2 0 002 2h2m0 0v1a2 2 0 002 2h2.945M9 13h2.945M9 13v1a2 2 0 002 2h2.945M9 15v1a2 2 0 002 2h2.945m-6.89 0H9m0 0v-1a2 2 0 012-2h2.945M9 13v-1a2 2 0 012-2h2.945M9 11V9a2 2 0 012-2h2.945M9 9H7a2 2 0 00-2 2v1a2 2 0 002 2h2m0 0v1a2 2 0 002 2h2.945M9 15v1a2 2 0 002 2h2.945m-6.89 0H9m0 0v-1a2 2 0 012-2h2.945M9 13v-1a2 2 0 012-2h2.945M9 11V9a2 2 0 012-2h2.945M9 9H7a2 2 0 00-2 2v1a2 2 0 002 2h2m0 0v1a2 2 0 002 2h2.945M9 15v1a2 2 0 002 2h2.945m-6.89 0H9m0 0v-1a2 2 0 012-2h2.945M9 13v-1a2 2 0 012-2h2.945M9 11V9a2 2 0 012-2h2.945M9 9H7a2 2 0 00-2 2v1a2 2 0 002 2h2m0 0v1a2 2 0 002 2h2.945" />
        </svg>
      ),
      title: t('about.missionValues.values.3.title', 'Agricultură durabilă'),
      description: t('about.missionValues.values.3.description', 'Promovăm practici agricole durabile și respectuoase față de mediu, susținând producătorii care adoptă astfel de metode responsabile.'),
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
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <PageContainer className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
                {t('about.missionValues.title', 'Misiunea și valorile noastre')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {t('about.missionValues.subtitle', 'Principiile care ne ghidează în construirea unei comunități durabile de producători și clienți, bazate pe încredere, transparență și respect pentru tradițiile românești.')}
            </motion.p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Card className={`h-full border border-border rounded-2xl hover:shadow-2xl transition-all duration-500 bg-card group overflow-hidden relative hover:border-primary/50`}>
                  {/* Animated gradient background */}
                  <div className={`absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  
                  <CardContent className="p-8 md:p-10 relative z-10">
                    {/* Icon Container */}
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl ${value.iconBg} ${value.iconColor} mb-6 border border-border/40 group-hover:border-transparent transition-all duration-300`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ 
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.5 }
                      }}
                    >
                      {value.icon}
                    </motion.div>
                    
                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
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
