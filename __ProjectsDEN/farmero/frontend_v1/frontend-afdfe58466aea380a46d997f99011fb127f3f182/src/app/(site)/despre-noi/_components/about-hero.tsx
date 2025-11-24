'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'

export function AboutHero() {
  const { t } = useI18n()
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2],
            x: [0, 50],
            y: [0, 30],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3],
            x: [0, -40],
            y: [0, -20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 order-1 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
                {t('about.hero.title', 'Despre farme.ro')}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mt-4 mb-6" />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              {t('about.hero.description', 'Conectăm producătorii locali cu clienții care caută produse autentice și tradiționale, susținând economia locală și promovând valorile agriculturii durabile din România.')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{t('about.hero.badge1', 'Producători verificați')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{t('about.hero.badge2', 'Livrare rapidă')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t('about.hero.badge3', 'Prețuri corecte')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive SVG Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-2 lg:order-2"
          >
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                {/* Interactive SVG Farm Animation */}
                <motion.svg
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="w-full h-full"
                  viewBox="0 0 400 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Animated sun */}
                  <motion.circle
                    cx="320"
                    cy="60"
                    r="25"
                    fill="hsl(45, 100%, 60%)"
                    animate={{
                      scale: [1, 1.1],
                      opacity: [0.8, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                  />
                  
                  {/* Farm house with animated roof */}
                  <motion.path
                    d="M100 200 L100 120 L150 100 L200 120 L200 200 Z"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    fill="hsl(var(--primary) / 0.15)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                  <motion.path
                    d="M100 120 L150 100 L200 120"
                    stroke="hsl(25, 95%, 53%)"
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                  
                  {/* Animated door */}
                  <motion.rect
                    x="135"
                    y="160"
                    width="30"
                    height="40"
                    fill="hsl(25, 95%, 53%)"
                    rx="3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2, type: 'spring' }}
                  />
                  
                  {/* Animated window */}
                  <motion.circle
                    cx="160"
                    cy="140"
                    r="12"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    fill="hsl(var(--primary) / 0.1)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4, type: 'spring' }}
                  />
                  
                  {/* Animated tree */}
                  <motion.path
                    d="M280 200 L280 150"
                    stroke="hsl(var(--primary))"
                    strokeWidth="5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1.6 }}
                  />
                  <motion.circle
                    cx="280"
                    cy="130"
                    r="28"
                    fill="hsl(var(--primary) / 0.25)"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: 1,
                      rotate: [0, 5],
                    }}
                    transition={{ 
                      scale: { duration: 0.8, delay: 1.8, type: 'spring' },
                      rotate: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      }
                    }}
                  />
                  
                  {/* Ground line */}
                  <motion.line
                    x1="50"
                    y1="200"
                    x2="350"
                    y2="200"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                  
                  {/* Floating products */}
                  <motion.g
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 2.2 }}
                  >
                    <motion.text
                      x="50"
                      y="240"
                      fontSize="28"
                      animate={{
                        y: [240, 235],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: 2.5,
                      }}
                    >
                      🍯
                    </motion.text>
                    <motion.text
                      x="120"
                      y="240"
                      fontSize="28"
                      animate={{
                        y: [240, 235],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: 2.7,
                      }}
                    >
                      🧀
                    </motion.text>
                    <motion.text
                      x="190"
                      y="240"
                      fontSize="28"
                      animate={{
                        y: [240, 235],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: 2.9,
                      }}
                    >
                      🥕
                    </motion.text>
                    <motion.text
                      x="260"
                      y="240"
                      fontSize="28"
                      animate={{
                        y: [240, 235],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: 3.1,
                      }}
                    >
                      🍎
                    </motion.text>
                  </motion.g>
                </motion.svg>
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
