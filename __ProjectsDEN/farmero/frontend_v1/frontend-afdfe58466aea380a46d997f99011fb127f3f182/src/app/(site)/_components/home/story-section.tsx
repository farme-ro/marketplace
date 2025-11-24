'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { ImpactBadge } from '@/components/impact/impact-badge'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

export function StorySection() {
  const { t } = useI18n()
  const [isMounted, setIsMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [30, -30])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section ref={ref} className="py-16 md:py-24 relative overflow-hidden bg-background">
      
      <PageContainer className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                {t('home.story.title', 'Povestea farme.ro')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-8" />
            </motion.div>
            
            <div className="space-y-6 text-foreground-body text-base md:text-lg leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('home.story.paragraph1', 'farme.ro a apărut din dorința de a conecta producătorii locali cu clienții care caută produse autentice și tradiționale. Înțelegem că alimentele tradiționale românești sunt mai mult decât produse - sunt parte din identitatea noastră culturală.')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t('home.story.paragraph2', 'Platforma noastră oferă producătorilor o cale directă către piață, fără intermediari, iar clienților le oferim acces la produse de calitate, verificate și autentice.')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {t('home.story.paragraph3', 'Susținem economia locală și promovăm practici agricole durabile, creând o comunitate care valorifică tradițiile românești.')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="pt-4"
              >
                <ImpactBadge variant="social" />
                <p className="text-xs text-muted-foreground mt-2">
                  {t('home.story.impactNote', 'Comanda ta susține producători locali și poate reduce risipa alimentară.')}
                </p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-4"
            >
              <Link href="/despre-noi">
                <Button variant="outline" size="lg" className="group">
                  {t('home.story.cta', 'Află povestea noastră')}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Animated Visual */}
          <motion.div
            style={isMounted ? { y } : undefined}
            className="relative hidden lg:block"
          >
            <Card className="rounded-[32px] border border-border overflow-hidden shadow-premium-lg bg-card">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] bg-muted">
                  {/* Animated SVG illustration */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <motion.svg
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="w-full h-full"
                      viewBox="0 0 400 300"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Farm house */}
                      <motion.path
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        d="M100 200 L100 120 L150 100 L200 120 L200 200 Z"
                        stroke="hsl(var(--primary))"
                        strokeWidth="4"
                        fill="hsl(var(--primary) / 0.15)"
                      />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.7 }}
                        d="M100 120 L150 100 L200 120"
                        stroke="hsl(25, 95%, 53%)"
                        strokeWidth="4"
                        fill="none"
                      />
                      
                      {/* Animated door */}
                      <motion.rect
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.2, type: 'spring' }}
                        x="135"
                        y="160"
                        width="30"
                        height="40"
                        fill="hsl(25, 95%, 53%)"
                        rx="3"
                      />
                      
                      {/* Animated window */}
                      <motion.circle
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.4, type: 'spring' }}
                        cx="160"
                        cy="140"
                        r="12"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        fill="hsl(var(--primary) / 0.1)"
                      />
                      
                      {/* Animated tree */}
                      <motion.path
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 1.6 }}
                        d="M280 200 L280 150"
                        stroke="hsl(var(--primary))"
                        strokeWidth="5"
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
                      
                      {/* Sun */}
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
                      
                      {/* Ground line */}
                      <motion.line
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        x1="50"
                        y1="200"
                        x2="350"
                        y2="200"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                      />
                      
                      {/* Floating products */}
                      <motion.g
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
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
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-secondary/30 rounded-full"
                        initial={{ 
                          x: Math.random() * 100 + '%',
                          y: Math.random() * 100 + '%',
                          opacity: 0
                        }}
                        animate={{
                          y: [null, (Math.random() - 0.5) * 50 + '%'],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 4 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
