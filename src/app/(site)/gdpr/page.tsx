/**
 * GDPR Page
 * 
 * Pagină cu informații despre drepturile GDPR
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'

export default function GDPRPage() {
  const { t } = useI18n()
  
  const gdprRights = [
  {
    title: t('gdpr.rights.access.title', 'Dreptul de acces'),
    description: t('gdpr.rights.access.description', 'Ai dreptul să primești o copie a datelor tale personale pe care le deținem.'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    color: 'from-emerald-500/10 to-emerald-600/10',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: t('gdpr.rights.rectification.title', 'Dreptul de rectificare'),
    description: t('gdpr.rights.rectification.description', 'Poți solicita corectarea datelor tale personale care sunt incorecte sau incomplete.'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: 'from-primary/10 to-primary/20',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    title: t('gdpr.rights.deletion.title', 'Dreptul de ștergere'),
    description: t('gdpr.rights.deletion.description', 'Poți solicita ștergerea datelor tale personale în anumite circumstanțe (dreptul de a fi uitat).'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    color: 'from-orange-500/10 to-orange-600/10',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    title: t('gdpr.rights.opposition.title', 'Dreptul de opoziție'),
    description: t('gdpr.rights.opposition.description', 'Poți te opune procesării datelor tale personale pentru anumite scopuri, cum ar fi marketingul direct.'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    color: 'from-primary/10 to-primary/20',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    title: t('gdpr.rights.portability.title', 'Dreptul la portabilitate'),
    description: t('gdpr.rights.portability.description', 'Poți solicita transferul datelor tale personale într-un format structurat și utilizat frecvent.'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
      </svg>
    ),
    color: 'from-emerald-500/10 to-primary/10',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: t('gdpr.rights.restriction.title', 'Dreptul de restricționare'),
    description: t('gdpr.rights.restriction.description', 'Poți solicita restricționarea procesării datelor tale personale în anumite circumstanțe.'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: 'from-primary/10 to-primary/20',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {t('gdpr.title', 'Drepturile tale (GDPR)')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {t('gdpr.subtitle', 'Conform Regulamentului General privind Protecția Datelor (GDPR), ai următoarele drepturi privind datele tale personale')}
          </p>
        </motion.div>

        {/* Rights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {gdprRights.map((right, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Card className={`h-full border border-border rounded-2xl hover:shadow-2xl transition-all duration-500 bg-card group overflow-hidden relative hover:border-primary/50`}>
                {/* Animated gradient background */}
                <div 
                  className={`absolute bg-gradient-to-br ${right.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    top: '1px',
                    left: '1px',
                    right: '1px',
                    bottom: '1px',
                    borderRadius: 'calc(1rem - 1px)',
                  }}
                />
                
                <CardContent className="p-6 md:p-8 relative z-10">
                  {/* Icon Container */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl ${right.iconBg} ${right.iconColor} mb-6 border border-border/40 group-hover:border-transparent transition-all duration-300`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{ 
                      scale: { duration: 0.3 },
                      rotate: { duration: 0.5 }
                    }}
                  >
                    {right.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {right.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {right.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How to Exercise Rights */}
        <Card className="border-border/60 rounded-2xl shadow-sm">
          <CardContent className="p-8 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t('gdpr.howToExercise.title', 'Cum îți exercită drepturile')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('gdpr.howToExercise.content', 'Pentru a-ți exercita oricare dintre aceste drepturi, te rugăm să ne contactezi la:')}{' '}
                <a href={`mailto:${t('gdpr.howToExercise.email', 'privacy@farmero.ro')}`} className="text-primary hover:underline font-medium">
                  {t('gdpr.howToExercise.email', 'privacy@farmero.ro')}
                </a>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('gdpr.howToExercise.response', 'Vom răspunde la solicitarea ta în termen de 30 de zile și te vom informa despre acțiunile întreprinse. În anumite cazuri, putem solicita informații suplimentare pentru a verifica identitatea ta.')}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </PageContainer>
    </section>
  )
}

